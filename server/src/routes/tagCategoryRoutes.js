const express = require('express');
const router = express.Router();
const tagCategoryController = require('../controllers/TagCategoryController');
const {authenticate, requireAdmin, requireModerator} = require('../middleware/index');

router.get('/', tagCategoryController.getList);
router.get('/all', tagCategoryController.getAll);
router.get('/:id', tagCategoryController.getById);


router.post('/', authenticate, tagCategoryController.create);
router.patch('/:id', authenticate, tagCategoryController.update);
router.delete('/:id', authenticate, tagCategoryController.delete);

module.exports = router;