const express = require('express');
const router = express.Router();
const { createRoadmap, getRoadmap } = require('../controllers/roadmapController');

router.post('/generate', createRoadmap);
router.get('/:userId', getRoadmap);

module.exports = router;
