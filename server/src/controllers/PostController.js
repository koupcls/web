const postService = require('../services/PostService');
const { AppError } = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');

class PostController {
    /**
     * POST /api/posts - Создать пост
     */
    create = catchAsync(async (req, res) => {
        const post = await postService.create(req.user.uuid, req.body);
        
        res.status(201).json({
            success: true,
            message: 'Пост успешно создан',
            data: { post }
        });
    });
    
    /**
     * GET /api/posts - Список постов
     */
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
    
    /**
     * GET /api/posts/:id - Получить пост
     */
    getById = catchAsync(async (req, res) => {
        const post = await postService.getById(
            req.params.id,
            req.user?.uuid
        );
        
        // Увеличиваем счётчик просмотров (асинхронно)
        // postService.incrementViews(req.params.id).catch(console.error);
        
        res.json({
            success: true,
            data: { post }
        });
    });
    
    /**
     * PATCH /api/posts/:id - Обновить пост
     */
    update = catchAsync(async (req, res) => {
        const post = await postService.update(
            req.params.id,
            req.user.uuid,
            req.body
        );
        
        res.json({
            success: true,
            message: 'Пост успешно обновлён',
            data: { post }
        });
    });
    
    /**
     * DELETE /api/posts/:id - Удалить пост
     */
    delete = catchAsync(async (req, res) => {
        await postService.delete(
            req.params.id,
            req.user.uuid
        );
        
        res.json({
            success: true,
            message: 'Пост успешно удалён'
        });
    });

    /**
     * DELETE /api/posts/:id/hard - Удалить пост безвозвратно
     */
    hardDelete = catchAsync(async (req, res) => {
        await postService.hardDelete(
            req.params.id,
            req.user.uuid
        );
        
        res.json({
            success: true,
            message: 'Пост успешно удалён'
        });
    });
    
    /**
     * POST /api/posts/:id/publish - Опубликовать пост
     */
    publish = catchAsync(async (req, res) => {
        const post = await postService.publish(
            req.params.id,
            req.user.uuid
        );
        
        res.json({
            success: true,
            message: 'Пост успешно опубликован',
            data: { post }
        });
    });
}

module.exports = new PostController();