const { supabase } = require('../config/supabase');
const AppError = require('../utils/AppError');

class IngredientService {

    async create(ingredientData) {
        if (!ingredientData.name || ingredientData.name.trim().length < 2) {
            throw new AppError('Название должно содержать минимум 2 символа', 'invalid_name', 400);
        }
        
        if (!ingredientData.code || ingredientData.code.trim().length < 2) {
            throw new AppError('Код должен содержать минимум 2 символа', 'invalid_code', 400);
        }
        
        const { data: existing } = await supabase
            .from('ingredient_types')
            .select('uuid')
            .eq('code', ingredientData.code.toUpperCase())
            .single();
        
        if (existing) {
            throw new AppError('Ингредиент с таким кодом уже существует', 'code_exists', 400);
        }
        
        const { data: ingredient, error } = await supabase
            .from('ingredient_types')
            .insert({
                name: ingredientData.name.trim(),
                code: ingredientData.code.toUpperCase().trim(),
                density: ingredientData.density || null,
                is_active: ingredientData.isActive !== undefined ? ingredientData.isActive : true
            })
            .select()
            .single();
        
        if (error) throw new AppError(error, 'create_failed', 500);
        
        return this._formatIngredient(ingredient);
    }
    
    async getById(id) {
        const { data: ingredient, error } = await supabase
            .from('ingredient_types')
            .select('*')
            .eq('uuid', id)
            .single();
        
        if (error || !ingredient) {
            throw new AppError('Ингредиент не найден', 'not_found', 404);
        }
        
        return this._formatIngredient(ingredient);
    }
    
    async getByCode(code) {
        const { data: ingredient, error } = await supabase
            .from('ingredient_types')
            .select('*')
            .eq('code', code.toUpperCase())
            .single();
        
        if (error || !ingredient) {
            throw new AppError('Ингредиент не найден', 'not_found', 404);
        }
        
        return this._formatIngredient(ingredient);
    }
    
    async getList({ page = 1, limit = 50, filters = {} }) {
        const offset = (page - 1) * limit;
        
        let query = supabase
            .from('ingredient_types')
            .select('*', { count: 'exact' })
            .order('name', { ascending: true })
            .range(offset, offset + limit - 1);
        
        if (filters.isActive !== undefined) {
            query = query.eq('is_active', filters.isActive);
        }
    
        if (filters.search) {
            query = query.ilike('name', `%${filters.search}%`);
        }
        
        if (filters.code) {
            query = query.ilike('code', `%${filters.code}%`);
        }
        
        if (filters.category) {
            query = query.like('code', `${filters.category}%`);
        }
        
        const { data: ingredients, count, error } = await query;
        
        if (error) throw new AppError(error.message, 'fetch_failed', 500);
        
        return {
            ingredients: ingredients.map(i => this._formatIngredient(i)),
            pagination: {
                page,
                limit,
                total: count,
                totalPages: Math.ceil(count / limit)
            }
        };
    }
    
    async autocomplete(search, limit = 10) {
        if (!search || search.trim().length < 2) {
            return { suggestions: [] };
        }
        
        const { data: ingredients, error } = await supabase
            .from('ingredient_types')
            .select('uuid, name, code, density')
            .eq('is_active', true)
            .ilike('name', `%${search.trim()}%`)
            .order('name', { ascending: true })
            .limit(limit);
        
        if (error) throw new AppError(error.message, 'fetch_failed', 500);
        
        return {
            suggestions: ingredients.map(i => ({
                id: i.uuid,
                label: i.name,
                code: i.code,
                value: i.name,
                density: i.density
            }))
        };
    }
    
    async update(id, updateData) {
        const { data: existing } = await supabase
            .from('ingredient_types')
            .select('uuid, code')
            .eq('uuid', id)
            .single();
        
        if (!existing) {
            throw new AppError('Ингредиент не найден', 'not_found', 404);
        }
        
        const updatePayload = { updated_at: new Date() };
        
        if (updateData.name !== undefined) {
            if (updateData.name.trim().length < 2) {
                throw new AppError('Название должно содержать минимум 2 символа', 'invalid_name', 400);
            }
            updatePayload.name = updateData.name.trim();
        }
        
        if (updateData.code !== undefined) {
            const newCode = updateData.code.toUpperCase().trim();
            
            if (newCode !== existing.code) {
                const { data: duplicate } = await supabase
                    .from('ingredient_types')
                    .select('uuid')
                    .eq('code', newCode)
                    .neq('uuid', id)
                    .single();
                
                if (duplicate) {
                    throw new AppError('Ингредиент с таким кодом уже существует', 'code_exists', 400);
                }
            }
            
            updatePayload.code = newCode;
        }
        
        if (updateData.density !== undefined) {
            updatePayload.density = updateData.density;
        }
        
        if (updateData.isActive !== undefined) {
            updatePayload.is_active = updateData.isActive;
        }
        
        const { data: ingredient, error } = await supabase
            .from('ingredient_types')
            .update(updatePayload)
            .eq('uuid', id)
            .select()
            .single();
        
        if (error) throw new AppError(error.message, 'update_failed', 500);
        
        return this._formatIngredient(ingredient);
    }
    
    async delete(id) {
        const { data: existing } = await supabase
            .from('ingredient_types')
            .select('uuid')
            .eq('uuid', id)
            .single();
        
        if (!existing) {
            throw new AppError('Ингредиент не найден', 'not_found', 404);
        }
        
        const { data: usage } = await supabase
            .from('ingredient_entries')
            .select('uuid', { count: 'exact', head: true })
            .eq('ingredient_id', id)
            .limit(1);
        
        if (usage && usage.length > 0) {
            throw new AppError('Нельзя удалить ингредиент, который используется в рецептах', 'in_use', 400);
        }
        
        const { data: ingredient, error } = await supabase
            .from('ingredient_types')
            .delete()
            .eq('uuid', id)
            .select();
        
        if (!ingredient || ingredient.length === 0) {
            throw new AppError('Ингредиент не найден', 'not_found', 404);
        }

        if (error) throw new AppError(error.message, 'delete_failed', 500);
        
        return { success: true };
    }

    _formatIngredient(ingredient) {
        return {
            uuid: ingredient.uuid,
            name: ingredient.name,
            code: ingredient.code,
            density: ingredient.density,
            isActive: ingredient.is_active,
            createdAt: ingredient.created_at,
            updatedAt: ingredient.updated_at
        };
    }
}

module.exports = new IngredientService();