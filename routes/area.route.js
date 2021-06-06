const express = require('express');
const controller = require ('../controllers/area.controller');

const router = express.Router();

router.get('/city',controller.city);

router.get('/district',controller.district);

module.exports = router;