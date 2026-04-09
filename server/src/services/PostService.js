const AppError = require('../utils/AppError');
const { supabase } = require('../config/supabase');


class PostService {

    async create(userId, postData) {
        if (!postData.title || postData.title.trim().length < 3) {
            throw new AppError('Заголовок должен содержать минимум 3 символа', 'missing_data', 400);
        }
        
        if (!postData.portionsCount || postData.portionsCount < 1) {
            throw new AppError('Количество порций должно быть больше 0',  'missing_data', 400);
        }
        
        try {
            const postPayload = {
                author_id: userId,
                title: postData.title.trim(),
                description: postData.description?.trim() || null,
                summary: postData.summary?.trim() || null,
                cooking_time_minutes: postData.cookingTimeMinutes || null,
                portions_count: parseInt(postData.portionsCount),
                status: postData.status || 'draft'
            };
            
            const { data: post, error: postError } = await supabase
                .from('posts')
                .insert(postPayload)
                .select()
                .single();
            
            if (postError) throw postError;
            
            if (postData.images?.length > 0) {
                await this._createPostImages(post.uuid, postData.images);
            }
            
            if (postData.tagIds?.length > 0) {
                await this._attachTags(post.uuid, postData.tagIds);
            }
            
            if (postData.instructionSteps?.length > 0) {
                await this._createInstructionSteps(post.uuid, postData.instructionSteps);
            }
            
            if (postData.ingredientStages?.length > 0) {
                await this._createIngredientStages(post.uuid, postData.ingredientStages);
            }
            
            return await this.getById(post.uuid, userId);
            
        } catch (error) {
            console.error('Error creating post:', error);
            throw new AppError(`Ошибка при создании поста: ${error.message}`, 'failed_to_create_post', 500);
        }
    }
    

    async getById(postId, userId = null) {
        
        const { data: postCheck, error: checkError } = await supabase
            .from('posts')
            .select('uuid, author_id, status, deleted_at')
            .eq('uuid', cleanPostId)
            .single();
        

        let query = supabase
            .from('posts')
            .select(`*, author:users!posts_author_id_fkey (uuid, login, tag, avatar_url),
                    post_tags (tag:tags (uuid, name, slug, color, emblem_img)),
                    post_images (uuid, url, thumbnail_url, alt, display_order, is_cover ),
                    instruction_steps (uuid, display_order, content, instruction_images (uuid, url, thumbnail_url, alt, display_order)),
                    ingredient_stages (uuid, name, display_order, 
                    ingredient_entries (uuid, ingredient:ingredient_types (uuid, name),
                    measurement:measurement_units (uuid, name, code),
                    quantity, is_optional, note, display_order))`)
            .eq('uuid', postId);
        
        if (userId) {
            const { data: postCheck } = await supabase
                .from('posts')
                .select('author_id, status')
                .eq('uuid', postId)
                .single();
            
            if (!postCheck) {
                throw new AppError('Пост не найден', 'not_found', 404);
            }
            
            if (postCheck.author_id !== userId && postCheck.status !== 'published') {
                throw new AppError('Доступ запрещён', 'access_denied', 403);
            }
        } else {
            query = query.eq('status', 'published').is('deleted_at', null);
        }
        
        const { data: post, error } = await query.single();
        
        if (!post) {
            throw new AppError('Пост не найден', 'not_found', 404);
        }
        if (error) throw new AppError(error.message, error.code, error.status);
        
        return this._formatPostResponse(post);
    }
    
    
    async update(postId, userId, updateData) {
        const { data: existingPost } = await supabase
            .from('posts')
            .select('author_id')
            .eq('uuid', postId)
            .single();
        
        if (!existingPost) {
            throw new AppError('Пост не найден', 'not_found', 404);
        }
        
        if (existingPost.author_id !== userId) {
            throw new AppError('Нет прав на редактирование', 'access_denied', 403);
        }
        
        try {
            const allowedFields = [ 'title', 'description', 'summary', 'cooking_time_minutes', 'portions_count', 'status'];
            
            const updatePayload = { updated_at: new Date() };
            
            for (const field of allowedFields) {
                if (updateData[field] !== undefined) {
                    updatePayload[field] = updateData[field];
                }
            }
            
            const { data: updatedPost, error } = await supabase
                .from('posts')
                .update(updatePayload)
                .eq('uuid', postId)
                .select()
                .single();
            
            if (error) throw new AppError(error.message, error.code, error.status);
            
            if (updateData.images !== undefined) {
                await this._syncPostImages(postId, updateData.images);
            }
            
            if (updateData.tagIds !== undefined) {
                await this._syncTags(postId, updateData.tagIds);
            }
            
            if (updateData.instructionSteps !== undefined) {
                await this._syncInstructionSteps(postId, updateData.instructionSteps);
            }
            
            if (updateData.ingredientStages !== undefined) {
                await this._syncIngredientStages(postId, updateData.ingredientStages);
            }
            
            return await this.getById(postId, userId);
            
        } catch (error) {
            console.error('Error updating post:', error);
            throw new AppError(`Ошибка при обновлении поста: ${error.message}`, 'failed_to_update_post', 500);
        }
    }
    
    async delete(postId, userId) {

        const { data: post } = await supabase
            .from('posts')
            .select('author_id')
            .eq('uuid', postId)
            .single();

        if (!post) {
            throw new AppError('Пост не найден', 'not_found', 404);
        }
        
        if (post.author_id !== userId) {
            throw new AppError('Нет прав на удаление', 'access_denied', 403);
        }
        
        const { error } = await supabase
            .from('posts')
            .update({ 
                deleted_at: new Date(),
                updated_at: new Date()
            })
            .eq('uuid', postId);
        
        if (error) throw new AppError(error.message, error.code, error.status);
        
        if (post.status === 'published') {
            await this._decrementUserPostCount(post.author_id);
        }

        return { success: true };
    }

    async hardDelete(postId, userId) {

        const { data: post, error: postError } = await supabase
            .from('posts')
            .select('uuid, author_id, status')
            .eq('uuid', postId)
            .single();
        
        if (postError || !post) {
            throw new AppError('Пост не найден', 'not_found', 404);
        }
        
        const { data: postTags } = await supabase
            .from('post_tags')
            .select('tag_id')
            .eq('post_id', postId);
        
        const { data: stages } = await supabase
            .from('ingredient_stages')
            .select('uuid')
            .eq('post_id', postId);
        
        const { data: steps } = await supabase
            .from('instruction_steps')
            .select('uuid')
            .eq('post_id', postId);
        
        try {
            if (stages?.length > 0) {
                const stageIds = stages.map(s => s.uuid);
                await supabase
                    .from('ingredient_entries')
                    .delete()
                    .in('stage_id', stageIds);
            }
            
            await supabase
                .from('ingredient_stages')
                .delete()
                .eq('post_id', postId);
            
                
            if (steps?.length > 0) {
                const stepIds = steps.map(s => s.uuid);
                await supabase
                    .from('instruction_images')
                    .delete()
                    .in('step_id', stepIds);
            }
            
            await supabase
                .from('instruction_steps')
                .delete()
                .eq('post_id', postId);
            
            await supabase
                .from('post_tags')
                .delete()
                .eq('post_id', postId);
            
            await supabase
                .from('post_images')
                .delete()
                .eq('post_id', postId);
            
            await supabase
                .from('saved_posts')
                .delete()
                .eq('post_id', postId);
            
            await supabase
                .from('messages')
                .delete()
                .eq('post_id', postId);
            
            await supabase
                .from('post_collection_items')
                .delete()
                .eq('post_id', postId);
            
            const { error: deleteError } = await supabase
                .from('posts')
                .delete()
                .eq('uuid', postId);
            
            if (deleteError) throw deleteError;
            
            if (postTags?.length > 0) {
                for (const tag of postTags) {
                    await this._decrementTagUsage(tag.tag_id);
                }
            }
            
            if (post.status === 'published') {
                await this._decrementUserPostCount(post.author_id);
            }
            
            return { 
                success: true, 
                message: 'Пост полностью удалён',
                deletedPostId: postId
            };
            
        } catch (error) {
            console.error('Hard delete failed:', error);
            throw new AppError(
                `Ошибка при полном удалении поста: ${error.message}`, 
                'failed_to_hard_delete', 
                500
            );
        }
    }

    async publish(postId, userId) {
        const { data: post } = await supabase
            .from('posts')
            .select('author_id, status, title')
            .eq('uuid', postId)
            .single();
        
        if (!post) {
            throw new AppError('Пост не найден', 'not_found', 404);
        }
        
        if (post.author_id !== userId) {
            throw new AppError('Нет прав', 'access_denied', 403);
        }
        
        if (post.status === 'published') {
            throw new AppError('Пост уже опубликован', 'post_already_published', 400);
        }
        
        // Минимальная валидация перед публикацией
        if (!post.title || post.title.length < 3) {
            throw new AppError('Заголовок обязателен для публикации', 'missing_data', 400);
        }
        
        const { data: publishedPost, error } = await supabase
            .from('posts')
            .update({
                status: 'published',
                published_at: new Date(),
                updated_at: new Date()
            })
            .eq('uuid', postId)
            .select()
            .single();
        
        if (error) throw new AppError(error.message, error.code, error.status);
        
        return publishedPost;
    }
    

    async getList({ page = 1, limit = 20, filters = {}, userId = null }) {
        const offset = (page - 1) * limit;
        
        let query = supabase
            .from('posts')
            .select(`*, author:users!posts_author_id_fkey (uuid, login, tag, avatar_url),
                    post_tags (tag:tags (uuid, name, slug, color)),
                    post_images (url, thumbnail_url, is_cover)`, { count: 'exact' })
            .eq('status', 'published')
            .is('deleted_at', null)
            .order('published_at', { ascending: false })
            .range(offset, offset + limit - 1);
        
        if (filters.tagSlug) {
            query = query.contains('post_tags', [{ tag: { slug: filters.tagSlug } }]);
        }
        
        if (filters.authorId) {
            query = query.eq('author_id', filters.authorId);
        }
        
        if (filters.search) {
            query = query.ilike('title', `%${filters.search}%`);
        }
        
        const { data: posts, count, error } = await query;
        
        if (error) throw new AppError(error.message, error.code, error.status);

        return {
            posts: posts.map(post => this._formatPostResponse(post)),
            pagination: {
                page,
                limit,
                total: count,
                totalPages: Math.ceil(count / limit)
            }
        };
    }


    async _createPostImages(postId, images) {
        const imageEntries = images.map((img, index) => ({
            post_id: postId,
            url: img.url,
            thumbnail_url: img.thumbnailUrl || null,
            alt: img.alt || null,
            display_order: img.order || index,
            is_cover: img.isCover || false
        }));
        
        const { error } = await supabase
            .from('post_images')
            .insert(imageEntries);
        
        if (error) throw new AppError(error.message, error.code, error.status);
    }
    
    async _syncPostImages(postId, images) {
        await supabase
            .from('post_images')
            .delete()
            .eq('post_id', postId);
        
        if (images?.length > 0) {
            await this._createPostImages(postId, images);
        }
    }
    
    async _attachTags(postId, tagIds) {
        const tagEntries = tagIds.map(tagId => ({
            post_id: postId,
            tag_id: tagId
        }));
        
        const { error } = await supabase
            .from('post_tags')
            .insert(tagEntries);
        
        if (error) throw new AppError(error.message, error.code, error.status);
        
        for (const tagId of tagIds) {
            await this._incrementTagUsage(tagId);
        }
    }
    
    async _syncTags(postId, tagIds) {
        const { data: oldTags } = await supabase
            .from('post_tags')
            .select('tag_id')
            .eq('post_id', postId);
        
        await supabase
            .from('post_tags')
            .delete()
            .eq('post_id', postId);
        
        if (tagIds?.length > 0) {
            await this._attachTags(postId, tagIds);
        }
        
        if (oldTags?.length > 0) {
            for (const oldTag of oldTags) {
                await this._decrementTagUsage(oldTag.tag_id);
            }
        }
    }
    
    async _createInstructionSteps(postId, steps) {
        for (const [index, step] of steps.entries()) {
            const { data: stepData, error: stepError } = await supabase
                .from('instruction_steps')
                .insert({
                    post_id: postId,
                    display_order: step.order || index + 1,
                    content: step.content
                })
                .select()
                .single();
            
            if (stepError) throw new AppError(stepError.message, stepError.code, stepError.status);
            
            if (step.images?.length > 0) {
                await this._createInstructionImages(stepData.uuid, step.images);
            }
        }
    }
    
    async _createInstructionImages(stepId, images) {
        const imageEntries = images.map((img, index) => ({
            step_id: stepId,
            url: img.url,
            thumbnail_url: img.thumbnailUrl || null,
            alt: img.alt || null,
            display_order: img.order || index
        }));
        
        const { error } = await supabase
            .from('instruction_images')
            .insert(imageEntries);
        
        if (error) throw new AppError(error.message, error.code, error.status);
    }
    
    async _syncInstructionSteps(postId, steps) {
        const { data: oldSteps } = await supabase
            .from('instruction_steps')
            .select('uuid')
            .eq('post_id', postId);
        
        await supabase
            .from('instruction_steps')
            .delete()
            .eq('post_id', postId);
        
        if (steps?.length > 0) {
            await this._createInstructionSteps(postId, steps);
        }
    }
    
    async _createIngredientStages(postId, stages) {
        for (const [index, stage] of stages.entries()) {
            const { data: stageData, error: stageError } = await supabase
                .from('ingredient_stages')
                .insert({
                    post_id: postId,
                    name: stage.name,
                    display_order: stage.order || index + 1
                })
                .select()
                .single();
            
            if (stageError) throw new AppError(stageError.message, stageError.code, stageError.status);
            
            if (stage.ingredients?.length > 0) {
                await this._createIngredientEntries(stageData.uuid, null, stage.ingredients);
            }
        }
    }
    

    async _createIngredientEntries(stageId, stepId, ingredients) {
        const entries = [];
        
        for (const [index, ing] of ingredients.entries()) {
            let ingredientId = ing.ingredientId;
            
            if (!ingredientId && ing.ingredientCode) {
                const { data: foundIngredient, error: findError } = await supabase
                    .from('ingredient_types')
                    .select('uuid')
                    .eq('code', ing.ingredientCode.toUpperCase())
                    .eq('is_active', true)
                    .single();
                
                if (findError || !foundIngredient) {
                    throw new AppError(`Ингредиент с кодом "${ing.ingredientCode}" не найден`, 'ingredient_not_found', 400);
                }
                ingredientId = foundIngredient.uuid;
            }
            
            if (!ingredientId) {
                throw new AppError('Необходимо указать ingredientId или ingredientCode', 'missing_ingredient_reference', 400);
            }
            
            let measurementId = ing.measurementId;
            
            const { data: foundMeasurement, error: findError } = await supabase
                .from('measurement_units')
                .select('uuid')
                .eq('code', ing.measurementCode.toUpperCase())
                .eq('is_active', true)
                .single();
            
            if (findError || !foundMeasurement) {
                throw new AppError(
                    `Единица измерения с кодом "${ing.measurementCode}" не найден`, 
                    'measurement_not_found', 
                    400
                );
            }
            measurementId = foundMeasurement.uuid;
            
            entries.push({
                stage_id: stageId,
                step_id: stepId,
                ingredient_id: ingredientId || null,
                measurement_id: measurementId || null,
                quantity: ing.quantity,
                is_optional: ing.isOptional || false,
                note: ing.note || null,
                display_order: ing.order || index + 1
            });
        }
        
        if (entries.length > 0) {
            const { error } = await supabase
                .from('ingredient_entries')
                .insert(entries);
            
            if (error) throw new AppError(error.message, error.code, error.status);
        }
    }
    
    async _syncIngredientStages(postId, stages) {
        const { data: oldStages } = await supabase
            .from('ingredient_stages')
            .select('uuid')
            .eq('post_id', postId);
        
        await supabase
            .from('ingredient_stages')
            .delete()
            .eq('post_id', postId);
        
        if (stages?.length > 0) {
            await this._createIngredientStages(postId, stages);
        }
    }
    
    async _incrementTagUsage(tagId) {
        await supabase.rpc('increment_tag_usage', { tag_id: tagId });
    }
    
    async _decrementTagUsage(tagId) {
        await supabase.rpc('decrement_tag_usage', { tag_id: tagId });
    }
    
    async _decrementUserPostCount(userId) {
        await supabase.rpc('decrement_user_post_count', { user_id: userId });
    }

    _formatPostResponse(post) {
        return {
            uuid: post.uuid,
            author: post.author,
            title: post.title,
            description: post.description,
            summary: post.summary,
            cookingTimeMinutes: post.cooking_time_minutes,
            portionsCount: post.portions_count,
            status: post.status,
            rating: post.rating,
            totalReviewsCount: post.total_reviews_count,
            totalQuestionsCount: post.total_questions_count,
            savesCount: post.saves_count,
            viewsCount: post.views_count,
            sharesCount: post.shares_count,
            createdAt: post.created_at,
            updatedAt: post.updated_at,
            publishedAt: post.published_at,
            images: post.post_images || [],
            tags: (post.post_tags || []).map(pt => pt.tag),
            instructionSteps: (post.instruction_steps || []).map(step => ({
                uuid: step.uuid,
                order: step.display_order,
                content: step.content,
                images: step.instruction_images || []
            })),
            ingredientStages: (post.ingredient_stages || []).map(stage => ({
                uuid: stage.uuid,
                name: stage.name,
                order: stage.display_order,
                ingredients: (stage.ingredient_entries || []).map(entry => ({
                    uuid: entry.uuid,
                    ingredientId: entry.ingredient?.uuid,
                    ingredientName: entry.ingredient?.name,
                    ingredientCode: entry.ingredient?.code,
                    measurementId: entry.measurement?.uuid,
                    measurementName: entry.measurement?.name,
                    measurementCode: entry.measurement?.code,
                    quantity: entry.quantity,
                    isOptional: entry.is_optional,
                    note: entry.note,
                    order: entry.display_order
                }))
            }))
        };
    }
}

module.exports = new PostService();