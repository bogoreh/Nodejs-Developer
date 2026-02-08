const express = require('express');
const router = express.Router();
const helloController = require('../controllers/hello.controller');

// Welcome route
router.get('/', helloController.getWelcome);

// Hello route
router.post('/hello', helloController.postHello);

module.exports = router;