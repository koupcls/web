const express = require('express');
const router = express.Router();
const tagController = require('../controllers/TagController');
const {authenticate, requireAdmin, requireModerator} = require('../middleware/index');

router.get('/', tagController.getList);
router.get('/popular', tagController.getPopular);
router.get('/:id', tagController.getById);
router.get('/slug/:slug', tagController.getBySlug);

router.post('/', authenticate, tagController.create);
router.patch('/:id', authenticate, tagController.update);
router.delete('/:id', authenticate, tagController.delete);

module.exports = router;