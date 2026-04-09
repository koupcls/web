const tagService = require('../services/TagService');
const catchAsync = require('../utils/catchAsync');

class TagController {

    create = catchAsync(async (req, res) => {
        const tag = await tagService.create(req.body);
        
        res.status(201).json({
            success: true,
            message: 'Тег успешно создан',
            data: { tag }
        });
    });
    
    getList = catchAsync(async (req, res) => {
        const { page, limit, category, search } = req.query;
        
        const filters = {};
        if (category) filters.categoryId = category;
        if (search) filters.search = search;
        
        const result = await tagService.getList({
            page: parseInt(page) || 1,
            limit: parseInt(limit) || 50,
            filters
        });
        
        res.json({
            success: true,
            data: result
        });
    });
    

    getPopular = catchAsync(async (req, res) => {
        const limit = parseInt(req.query.limit) || 20;
        const tags = await tagService.getPopular(limit);
        
        res.json({
            success: true,
            data: { tags }
        });
    });

    getById = catchAsync(async (req, res) => {
        const tag = await tagService.getById(req.params.id);
        
        res.json({
            success: true,
            data: { tag }
        });
    });
    
    getBySlug = catchAsync(async (req, res) => {
        const tag = await tagService.getBySlug(req.params.slug);
        
        res.json({
            success: true,
            data: { tag }
        });
    });
    
    update = catchAsync(async (req, res) => {
        const tag = await tagService.update(req.params.id, req.body);
        
        res.json({
            success: true,
            message: 'Тег успешно обновлён',
            data: { tag }
        });
    });
    
    delete = catchAsync(async (req, res) => {
        await tagService.delete(req.params.id);
        
        res.json({
            success: true,
            message: 'Тег успешно удалён'
        });
    });
}

module.exports = new TagController();