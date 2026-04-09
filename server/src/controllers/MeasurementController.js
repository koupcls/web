const measurementService = require('../services/MeasurementService');
const catchAsync = require('../utils/catchAsync');

class MeasurementController {
    create = catchAsync(async (req, res) => {
        const measurement = await measurementService.create(req.body);
        
        res.status(201).json({
            success: true,
            message: 'Единица измерения создана',
            data: { measurement }
        });
    });
    
    getList = catchAsync(async (req, res) => {
        const { page, limit, search, code, weight, active } = req.query;
        
        const filters = {};
        if (search) filters.search = search;
        if (code) filters.code = code;
        if (weight !== undefined) filters.isWeight = weight === 'true';
        if (active !== undefined) filters.isActive = active === 'true';
        
        const result = await measurementService.getList({
            page: parseInt(page) || 1,
            limit: parseInt(limit) || 50,
            filters
        });
        
        res.json({
            success: true,
            data: result
        });
    });
    
    autocomplete = catchAsync(async (req, res) => {
        const { q, limit } = req.query;
        
        const result = await measurementService.autocomplete(
            q || '',
            parseInt(limit) || 10
        );
        
        res.json({
            success: true,
            data: result
        });
    });
    
    getById = catchAsync(async (req, res) => {
        const measurement = await measurementService.getById(req.params.id);
        
        res.json({
            success: true,
            data: { measurement }
        });
    });
    
    getByCode = catchAsync(async (req, res) => {
        const measurement = await measurementService.getByCode(req.params.code);
        
        res.json({
            success: true,
            data: { measurement }
        });
    });
    
    update = catchAsync(async (req, res) => {
        const measurement = await measurementService.update(req.params.id, req.body);
        
        res.json({
            success: true,
            message: 'Единица измерения обновлена',
            data: { measurement }
        });
    });
    
    delete = catchAsync(async (req, res) => {
        await measurementService.delete(req.params.id);
        
        res.json({
            success: true,
            message: 'Единица измерения удалена'
        });
    });
}

module.exports = new MeasurementController();