const { supabase } = require('../config/supabase');
const { AppError } = require('../utils/AppError');

class MeasurementService {

    async create(measurementData) {
        if (!measurementData.name || measurementData.name.trim().length < 2) {
            throw new AppError('Название должно содержать минимум 2 символа', 'invalid_name', 400);
        }
        
        if (!measurementData.code || measurementData.code.trim().length < 1) {
            throw new AppError('Код обязателен', 'invalid_code', 400);
        }
        
        if (measurementData.gramsCoefficient === undefined) {
            throw new AppError('Коэффициент граммов обязателен', 'invalid_coefficient', 400);
        }
        
        const { data: existing } = await supabase
            .from('measurement_units')
            .select('uuid')
            .eq('code', measurementData.code.toUpperCase())
            .single();
        
        if (existing) {
            throw new AppError('Единица измерения с таким кодом уже существует', 'code_exists', 400);
        }
        
        const { data: measurement, error } = await supabase
            .from('measurement_units')
            .insert({
                name: measurementData.name.trim(),
                code: measurementData.code.toUpperCase().trim(),
                grams_coefficient: measurementData.gramsCoefficient,
                is_weight: measurementData.isWeight || false,
                is_active: measurementData.isActive !== undefined ? measurementData.isActive : true
            })
            .select()
            .single();
        
        if (error) throw new AppError(error.message, 'create_failed', 500);
        
        return this._formatMeasurement(measurement);
    }
    
    async getById(id) {
        const { data: measurement, error } = await supabase
            .from('measurement_units')
            .select('*')
            .eq('uuid', id)
            .single();
        
        if (error || !measurement) {
            throw new AppError('Единица измерения не найдена', 'not_found', 404);
        }
        
        return this._formatMeasurement(measurement);
    }
    
    async getByCode(code) {
        const { data: measurement, error } = await supabase
            .from('measurement_units')
            .select('*')
            .eq('code', code.toUpperCase())
            .single();
        
        if (error || !measurement) {
            throw new AppError('Единица измерения не найдена', 'not_found', 404);
        }
        
        return this._formatMeasurement(measurement);
    }
    
    async getList({ page = 1, limit = 50, filters = {} }) {
        const offset = (page - 1) * limit;
        
        let query = supabase
            .from('measurement_units')
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
        
        if (filters.isWeight !== undefined) {
            query = query.eq('is_weight', filters.isWeight);
        }
        
        const { data: measurements, count, error } = await query;
        
        if (error) throw new AppError(error.message, 'fetch_failed', 500);
        
        return {
            measurements: measurements.map(m => this._formatMeasurement(m)),
            pagination: {
                page,
                limit,
                total: count,
                totalPages: Math.ceil(count / limit)
            }
        };
    }
    
    async autocomplete(search, limit = 10) {
        if (!search || search.trim().length < 1) {
            return { suggestions: [] };
        }
        
        const { data: measurements, error } = await supabase
            .from('measurement_units')
            .select('uuid, name, code, grams_coefficient, is_weight')
            .eq('is_active', true)
            .or(`name.ilike.%${search.trim()}%,code.ilike.%${search.trim()}%`)
            .order('name', { ascending: true })
            .limit(limit);
        
        if (error) throw new AppError(error.message, 'fetch_failed', 500);
        
        return {
            suggestions: measurements.map(m => ({
                id: m.uuid,
                label: `${m.name} (${m.code})`,
                code: m.code,
                value: m.name,
                gramsCoefficient: m.grams_coefficient,
                isWeight: m.is_weight
            }))
        };
    }
    
    async update(id, updateData) {
        const { data: existing } = await supabase
            .from('measurement_units')
            .select('uuid, code')
            .eq('uuid', id)
            .single();
        
        if (!existing) {
            throw new AppError('Единица измерения не найдена', 'not_found', 404);
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
                    .from('measurement_units')
                    .select('uuid')
                    .eq('code', newCode)
                    .neq('uuid', id)
                    .single();
                
                if (duplicate) {
                    throw new AppError('Единица измерения с таким кодом уже существует', 'code_exists', 400);
                }
            }
            
            updatePayload.code = newCode;
        }
        
        if (updateData.gramsCoefficient !== undefined) {
            updatePayload.grams_coefficient = updateData.gramsCoefficient;
        }
        
        if (updateData.isWeight !== undefined) {
            updatePayload.is_weight = updateData.isWeight;
        }
        
        if (updateData.isActive !== undefined) {
            updatePayload.is_active = updateData.isActive;
        }
        
        const { data: measurement, error } = await supabase
            .from('measurement_units')
            .update(updatePayload)
            .eq('uuid', id)
            .select()
            .single();
        
        if (error) throw new AppError(error.message, 'update_failed', 500);
        
        return this._formatMeasurement(measurement);
    }
    
    async delete(id) {
        const { data: existing } = await supabase
            .from('measurement_units')
            .select('uuid')
            .eq('uuid', id)
            .single();
        
        if (!existing) {
            throw new AppError('Единица измерения не найдена', 'not_found', 404);
        }
        
        const { data: usage } = await supabase
            .from('ingredient_entries')
            .select('uuid', { count: 'exact', head: true })
            .eq('measurement_id', id)
            .limit(1);
        
        if (usage && usage.length > 0) {
            throw new AppError('Нельзя удалить единицу измерения, которая используется в рецептах', 'in_use', 400);
        }
        
        const { data, error } = await supabase
            .from('measurement_units')
            .delete()
            .eq('uuid', id)
            .select();
        
        if (!data || data.length === 0 ) { 
            throw new AppError('Размерность не найдена', 'not_found', 404);
        }

        if (error) throw new AppError(error.message, 'delete_failed', 500);
        
        return { success: true };
    }
    

    _formatMeasurement(measurement) {
        return {
            uuid: measurement.uuid,
            name: measurement.name,
            code: measurement.code,
            gramsCoefficient: measurement.grams_coefficient,
            isWeight: measurement.is_weight,
            isActive: measurement.is_active,
            createdAt: measurement.created_at,
            updatedAt: measurement.updated_at
        };
    }
}

module.exports = new MeasurementService();