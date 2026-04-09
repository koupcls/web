const express = require('express');
const router = express.Router();
const ingredientController = require('../controllers/IngredientController');
const {authenticate, requireAdmin, requireModerator} = require('../middleware/index');

router.get('/', ingredientController.getList);
router.get('/autocomplete', ingredientController.autocomplete);
router.get('/:id', ingredientController.getById);
router.get('/code/:code', ingredientController.getByCode);

router.post('/', authenticate, requireAdmin, ingredientController.create);
router.patch('/:id', authenticate, requireAdmin, ingredientController.update);
router.delete('/:id', authenticate, requireAdmin, ingredientController.delete);

module.exports = router;