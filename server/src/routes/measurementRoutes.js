const express = require('express');
const router = express.Router();
const measurementController = require('../controllers/MeasurementController');
const {authenticate, requireAdmin, requireModerator} = require('../middleware/index');

router.get('/', measurementController.getList);
router.get('/autocomplete', measurementController.autocomplete);
router.get('/:id', measurementController.getById);
router.get('/code/:code', measurementController.getByCode);

router.post('/', authenticate, requireAdmin, measurementController.create);
router.patch('/:id', authenticate, requireAdmin, measurementController.update);
router.delete('/:id', authenticate, requireAdmin, measurementController.delete);

module.exports = router;