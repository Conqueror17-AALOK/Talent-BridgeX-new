const express = require('express');
const router = express.Router();
const { getQuestions, submitAssessment, getPhase1, getPhase2 } = require('../controllers/assessmentController');

router.get('/phase1', getPhase1);
router.get('/phase2', getPhase2);
router.get('/questions', getQuestions); // keep for backward compat
router.post('/submit', submitAssessment);

module.exports = router;
