const express = require('express');
const router = express.Router();

const authRoutes = require('./authRoutes');
const postRoutes = require('./postRoutes');
const tagRoutes = require('./tagRoutes');
const tagCategoryRoutes = require('./tagCategoryRoutes'); 
const ingredientRoutes = require('./ingredientRoutes');
const measurementRoutes = require('./measurementRoutes');


router.use('/auth', authRoutes);
router.use('/posts', postRoutes);
router.use('/tags', tagRoutes);
router.use('/ingredients', ingredientRoutes);
router.use('/tag-categories', tagCategoryRoutes);  
router.use('/measurements', measurementRoutes);

module.exports = router;