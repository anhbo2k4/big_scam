const express = require('express');
const router = express.Router();
const uiFragmentController = require('../controllers/uiFragmentController');

router.get('/:name', uiFragmentController.getFragment);

module.exports = router;
