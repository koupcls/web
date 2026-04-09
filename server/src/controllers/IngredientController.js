const ingredientService = require('../services/IngredientService');
const catchAsync = require('../utils/catchAsync');

class IngredientController {

    create = catchAsync(async (req, res) => {
        const ingredient = await ingredientService.create(req.body);
        
        res.status(201).json({
            success: true,
            message: 'Ингредиент создан',
            data: { ingredient }
        });
    });
    
    getList = catchAsync(async (req, res) => {
        const { page, limit, search, code, category, active } = req.query;
        
        const filters = {};
        if (search) filters.search = search;
        if (code) filters.code = code;
        if (category) filters.category = category;
        if (active !== undefined) filters.isActive = active === 'true';
        
        const result = await ingredientService.getList({
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
        
        const result = await ingredientService.autocomplete(
            q || '',
            parseInt(limit) || 10
        );
        
        res.json({
            success: true,
            data: result
        });
    });
    
    getById = catchAsync(async (req, res) => {
        const ingredient = await ingredientService.getById(req.params.id);
        
        res.json({
            success: true,
            data: { ingredient }
        });
    });
    
    getByCode = catchAsync(async (req, res) => {
        const ingredient = await ingredientService.getByCode(req.params.code);
        
        res.json({
            success: true,
            data: { ingredient }
        });
    });
    
    update = catchAsync(async (req, res) => {
        const ingredient = await ingredientService.update(req.params.id, req.body);
        
        res.json({
            success: true,
            message: 'Ингредиент обновлён',
            data: { ingredient }
        });
    });
    
    delete = catchAsync(async (req, res) => {
        await ingredientService.delete(req.params.id);
        
        res.json({
            success: true,
            message: 'Ингредиент удалён'
        });
    });
}

module.exports = new IngredientController();