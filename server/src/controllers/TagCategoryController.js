const tagCategoryService = require('../services/TagCategoryService');
const catchAsync = require('../utils/catchAsync');

class TagCategoryController {
    getList = catchAsync(async (req, res) => {
        const { page, limit, active } = req.query;
        
        const filters = {};
        if (active !== undefined) filters.isActive = active === 'true';
        
        const result = await tagCategoryService.getList({
            page: parseInt(page) || 1,
            limit: parseInt(limit) || 50,
            filters
        });
        
        res.json({
            success: true,
            data: result
        });
    });
    
    getAll = catchAsync(async (req, res) => {
        const categories = await tagCategoryService.getAll();
        
        res.json({
            success: true,
            data: { categories }
        });
    });
    
    getById = catchAsync(async (req, res) => {
        const category = await tagCategoryService.getById(req.params.id);
        
        res.json({
            success: true,
            data: { category }
        });
    });
    
    create = catchAsync(async (req, res) => {
        const category = await tagCategoryService.create(req.body);
        
        res.status(201).json({
            success: true,
            message: 'Категория создана',
            data: { category }
        });
    });
    
    update = catchAsync(async (req, res) => {
        const category = await tagCategoryService.update(req.params.id, req.body);
        
        res.json({
            success: true,
            message: 'Категория обновлена',
            data: { category }
        });
    });
    
    delete = catchAsync(async (req, res) => {
        await tagCategoryService.delete(req.params.id);
        
        res.json({
            success: true,
            message: 'Категория удалена'
        });
    });
}

module.exports = new TagCategoryController();