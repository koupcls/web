const { supabase } = require('../config/supabase');
const AppError = require('../utils/AppError');

class TagCategoryService {

    async getList({ page = 1, limit = 50, filters = {} }) {
        const offset = (page - 1) * limit;
        
        let query = supabase
            .from('tag_categories')
            .select('*', { count: 'exact' })
            .order('display_order', { ascending: true })
            .range(offset, offset + limit - 1);
        
        if (filters.isActive !== undefined) {
            query = query.eq('is_active', filters.isActive);
        }
        
        const { data: categories, count, error } = await query;
        
        if (error) throw new AppError(error.message, 'fetch_failed', 500);
        
        return {
            categories: categories.map(c => this._formatCategory(c)),
            pagination: {
                page,
                limit,
                total: count,
                totalPages: Math.ceil(count / limit)
            }
        };
    }
    
    async getAll() {
        const { data: categories, error } = await supabase
            .from('tag_categories')
            .select('*')
            .eq('is_active', true)
            .order('display_order', { ascending: true });
        
        if (error) throw new AppError(error.message, 'fetch_failed', 500);
        
        return categories.map(c => this._formatCategory(c));
    }
    
    async getById(id) {
        const { data: category, error } = await supabase
            .from('tag_categories')
            .select('*')
            .eq('uuid', id)
            .single();
        
        if (error || !category) {
            throw new AppError('Категория не найдена', 'not_found', 404);
        }
        
        return this._formatCategory(category);
    }
    
    async create(categoryData) {
        if (!categoryData.name || categoryData.name.trim().length < 2) {
            throw new AppError('Название должно содержать минимум 2 символа', 'invalid_name', 400);
        }
        
        if (!categoryData.code || categoryData.code.trim().length < 2) {
            throw new AppError('Код должен содержать минимум 2 символа', 'invalid_code', 400);
        }
        
        const { data: existing } = await supabase
            .from('tag_categories')
            .select('uuid')
            .eq('code', categoryData.code.toLowerCase())
            .single();
        
        if (existing) {
            throw new AppError('Категория с таким кодом уже существует', 'code_exists', 400);
        }
        
        const { data: category, error } = await supabase
            .from('tag_categories')
            .insert({
                code: categoryData.code.toLowerCase().trim(),
                name: categoryData.name.trim(),
                description: categoryData.description || null,
                display_order: categoryData.displayOrder || 0,
                is_active: categoryData.isActive !== undefined ? categoryData.isActive : true
            })
            .select()
            .single();
        
        if (error) throw new AppError(error.message, 'create_failed', 500);
        
        return this._formatCategory(category);
    }
    
    async update(id, updateData) {
        const { data: existing } = await supabase
            .from('tag_categories')
            .select('uuid, code')
            .eq('uuid', id)
            .single();
        
        if (!existing) {
            throw new AppError('Категория не найдена', 'not_found', 404);
        }
        
        const updatePayload = { updated_at: new Date() };
        
        if (updateData.name !== undefined) {
            updatePayload.name = updateData.name.trim();
        }
        
        if (updateData.code !== undefined) {
            const newCode = updateData.code.toLowerCase().trim();
            if (newCode !== existing.code) {
                const { data: duplicate } = await supabase
                    .from('tag_categories')
                    .select('uuid')
                    .eq('code', newCode)
                    .neq('uuid', id)
                    .single();
                
                if (duplicate) {
                    throw new AppError('Категория с таким кодом уже существует', 'code_exists', 400);
                }
            }
            updatePayload.code = newCode;
        }
        
        if (updateData.description !== undefined) {
            updatePayload.description = updateData.description;
        }
        
        if (updateData.displayOrder !== undefined) {
            updatePayload.display_order = updateData.displayOrder;
        }
        
        if (updateData.isActive !== undefined) {
            updatePayload.is_active = updateData.isActive;
        }
        
        const { data: category, error } = await supabase
            .from('tag_categories')
            .update(updatePayload)
            .eq('uuid', id)
            .select()
            .single();
        
        if (error) throw new AppError(error.message, 'update_failed', 500);
        
        return this._formatCategory(category);
    }
    
    async delete(id) {
        const { data: existing } = await supabase
            .from('tag_categories')
            .select('uuid')
            .eq('uuid', id)
            .single();
        
        if (!existing) {
            throw new AppError('Категория не найдена', 'not_found', 404);
        }
        
        const { data: tags } = await supabase
            .from('tags')
            .select('uuid', { count: 'exact', head: true })
            .eq('category_id', id)
            .limit(1);
        
        if (tags && tags.length > 0) {
            throw new AppError(
                'Нельзя удалить категорию, в которой есть теги', 
                'in_use', 
                400
            );
        }
        
        const { error } = await supabase
            .from('tag_categories')
            .update({ 
                is_active: false,
                updated_at: new Date()
            })
            .eq('uuid', id);
        
        if (error) throw new AppError(error.message, 'delete_failed', 500);
        
        return { success: true };
    }
    
    _formatCategory(category) {
        return {
            uuid: category.uuid,
            code: category.code,
            name: category.name,
            description: category.description,
            displayOrder: category.display_order,
            isActive: category.is_active,
            createdAt: category.created_at,
            updatedAt: category.updated_at
        };
    }
}

module.exports = new TagCategoryService();