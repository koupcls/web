const postService = require('../services/PostService');
const catchAsync = require('../utils/catchAsync');

class PostController {

    create = catchAsync(async (req, res) => {
        const post = await postService.create(req.user.uuid, req.body);
        
        res.status(201).json({
            success: true,
            message: 'Пост успешно создан',
            data: { post }
        });
    });
    

    getList = catchAsync(async (req, res) => {
        const { page, limit, tag, author, search } = req.query;
        
        const filters = {};
        if (tag) filters.tagSlug = tag;
        if (author) filters.authorId = author;
        if (search) filters.search = search;
        
        const result = await postService.getList({
            page: parseInt(page) || 1,
            limit: parseInt(limit) || 20,
            filters,
            userId: req.user?.uuid
        });
        
        res.json({
            success: true,
            data: result
        });
    });
    

    getById = catchAsync(async (req, res) => {
        const post = await postService.getById(req.params.id, req.user?.uuid);
        
        res.json({
            success: true,
            data: { post }
        });
    });
    
    update = catchAsync(async (req, res) => {
        const post = await postService.update(req.params.id, req.user.uuid, req.body);
        
        res.json({
            success: true,
            message: 'Пост успешно обновлён',
            data: { post }
        });
    });
    
    delete = catchAsync(async (req, res) => {
        await postService.delete(req.params.id, req.user.uuid);
        
        res.json({
            success: true,
            message: 'Пост успешно удалён'
        });
    });

    hardDelete = catchAsync(async (req, res) => {
        await postService.hardDelete(req.params.id, req.user.uuid);
        
        res.json({
            success: true,
            message: 'Пост успешно удалён'
        });
    });
    
    publish = catchAsync(async (req, res) => {
        const post = await postService.publish(req.params.id, req.user.uuid);
        
        res.json({
            success: true,
            message: 'Пост успешно опубликован',
            data: { post }
        });
    });
}

module.exports = new PostController();