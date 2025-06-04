const express = require('express');
const { getAllTools, getToolById, createTool } = require('../controllers/toolController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.get('/', getAllTools);
router.get('/:id', getToolById);
router.post('/', authMiddleware, createTool);

module.exports = router;