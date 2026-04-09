const express = require('express');
const router = express.Router();
const postController = require('../controllers/PostController');
const {authenticate, requireAdmin, requireModerator} = require('../middleware/index');

router.get('/', postController.getList);
router.get('/:id', postController.getById);

router.post('/', authenticate, postController.create);
router.patch('/:id', authenticate, postController.update);
router.delete('/:id', authenticate, postController.delete)
router.delete('/:id/hard', authenticate, requireAdmin, postController.hardDelete);
router.post('/:id/publish', authenticate, postController.publish);

module.exports = router;