const express = require('express');
const router = express.Router();
const calculatorController = require('../controllers/calculatorController');

// Calculator endpoints
router.get('/add', calculatorController.add);
router.get('/subtract', calculatorController.subtract);
router.get('/multiply', calculatorController.multiply);
router.get('/divide', calculatorController.divide);

module.exports = router;