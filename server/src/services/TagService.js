const { supabase } = require('../config/supabase');
const AppError = require('../utils/AppError');

class TagService {

    async create(tagData) {
        if (!tagData.name || tagData.name.trim().length < 3) {
            throw new AppError('Название тега должно содержать минимум 3 символа', 'missing_data', 400);
        }
        
        if (!tagData.categoryId) {
            throw new AppError('Категория тега обязательна', 'missing_data', 400);
        }
        
        const slug = tagData.slug || this._generateSlug(tagData.name);
        
        const { data: existing } = await supabase
            .from('tags')
            .select('uuid')
            .eq('slug', slug)
            .single();
        
        if (existing) {
            throw new AppError('Тег с таким slug уже существует', 'tag_already_exists', 400);
        }
        
        const { data: tag, error } = await supabase
            .from('tags')
            .insert({
                name: tagData.name.trim(),
                slug: slug.toLowerCase(),
                emoji: tagData.emoji || null,
                emblem_img: tagData.emblemImg || null,
                color: tagData.color || null,
                category_id: tagData.categoryId,
                is_special: tagData.isSpecial || false,
                usage_count: 0
            })
            .select()
            .single();
        
        if (error) throw new AppError(error.message, error.code, error.status);
        
        return this._formatTagResponse(tag);
    }
    
    async getById(tagId) {
        const { data: tag, error } = await supabase
            .from('tags')
            .select(`*, category:tag_categories (uuid, code, name)`)
            .eq('uuid', tagId)
            .single();
        
        if (error || !tag) {
            throw new AppError('Тег не найден', 'not_found', 404);
        }
        
        return this._formatTagResponse(tag);
    }
    
    async getBySlug(slug) {
        const { data: tag, error } = await supabase
            .from('tags')
            .select(`*, category:tag_categories (uuid, code, name)`)
            .eq('slug', slug.toLowerCase())
            .single();
        
        if (error || !tag) {
            throw new AppError('Тег не найден', 'not_found', 404);
        }
        
        return this._formatTagResponse(tag);
    }
    
    async getList({ page = 1, limit = 50, filters = {} }) {
        const offset = (page - 1) * limit;
        
        let query = supabase
            .from('tags')
            .select(`*, category:tag_categories (uuid, code, name)`, { count: 'exact' })
            .eq('is_active', filters.isActive !== undefined ? filters.isActive : true)
            .order('usage_count', { ascending: false })
            .range(offset, offset + limit - 1);
        
        if (filters.categoryId) {
            query = query.eq('category_id', filters.categoryId);
        }
        
        if (filters.isSpecial !== undefined) {
            query = query.eq('is_special', filters.isSpecial);
        }
                
        if (filters.search) {
            query = query.ilike('name', `%${filters.search}%`);
        }
        
        const { data: tags, count, error } = await query;
        
        if (error) throw new AppError(error.message, error.code, error.status);
        
        return {
            tags: tags.map(tag => this._formatTagResponse(tag)),
            pagination: {
                page,
                limit,
                total: count,
                totalPages: Math.ceil(count / limit)
            }
        };
    }
    
    async update(tagId, updateData) {
        const { data: existingTag } = await supabase
            .from('tags')
            .select('uuid')
            .eq('uuid', tagId)
            .single();
        
        if (!existingTag) {
            throw new AppError('Тег не найден', 'not_found', 404);
        }
        
        const updatePayload = { updated_at: new Date() };
        
        const allowedFields = [
            'name', 'slug', 'emoji', 'emblem_img', 'color', 
            'category_id', 'is_special', 'is_active'
        ];
        
        for (const field of allowedFields) {
            if (updateData[field] !== undefined) {
                if (field === 'name') {
                    updatePayload[field] = updateData[field].trim();
                } else if (field === 'slug') {
                    updatePayload[field] = updateData[field].toLowerCase();
                } else {
                    updatePayload[field] = updateData[field];
                }
            }
        }
        
        if (updatePayload.slug && updatePayload.slug !== existingTag.slug) {
            const { data: duplicate } = await supabase
                .from('tags')
                .select('uuid')
                .eq('slug', updatePayload.slug)
                .neq('uuid', tagId)
                .single();
            
            if (duplicate) {
                throw new AppError('Тег с таким slug уже существует', 'tag_already_exists', 400);
            }
        }
        
        const { data: updatedTag, error } = await supabase
            .from('tags')
            .update(updatePayload)
            .eq('uuid', tagId)
            .select()
            .single();
        
        if (error) throw new AppError(error.message, error.code, error.status);
        
        return this._formatTagResponse(updatedTag);
    }
    
    async delete(tagId) {
        const { data: tag } = await supabase
            .from('tags')
            .select('uuid, usage_count')
            .eq('uuid', tagId)
            .single();
        
        if (!tag) {
            throw new AppError('Тег не найден', 'not_found', 404);
        }
        
        if (tag.usage_count > 0) {
            throw new AppError('Нельзя удалить тег, который используется в постах', 'delete_failed', 400);
        }
        
        const { error } = await supabase
            .from('tags')
            .update({ 
                is_active: false,
                updated_at: new Date()
            })
            .eq('uuid', tagId);
        
        if (error) throw new AppError(error.message, error.code, error.status);
        
        return { success: true };
    }
    
    async getPopular(limit = 20) {
        const { data: tags, error } = await supabase
            .from('tags')
            .select(`*, category:tag_categories (uuid, code, name)`)
            .eq('is_active', true)
            .order('usage_count', { ascending: false })
            .limit(limit);
        
        if (error) throw new AppError(error.message, error.code, error.status);
        
        return tags.map(tag => this._formatTagResponse(tag));
    }
    
    async getByCategory(categoryId, { limit = 100 } = {}) {
        const { data: tags, error } = await supabase
            .from('tags')
            .select('*')
            .eq('is_active', true)
            .eq('category_id', categoryId)
            .order('usage_count', { ascending: false })
            .limit(limit);
        
        if (error) throw new AppError(error.message, error.code, error.status);
        
        return tags.map(tag => this._formatTagResponse(tag));
    }
    

    _generateSlug(name) {
        return name
            .toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .trim();
    }
    
    _formatTagResponse(tag) {
        return {
            uuid: tag.uuid,
            name: tag.name,
            slug: tag.slug,
            emoji: tag.emoji,
            emblemImg: tag.emblem_img,
            color: tag.color,
            categoryId: tag.category_id,
            category: tag.category,
            usageCount: tag.usage_count,
            isSpecial: tag.is_special,
            isActive: tag.is_active,
            createdAt: tag.created_at,
            updatedAt: tag.updated_at
        };
    }
}

module.exports = new TagService();