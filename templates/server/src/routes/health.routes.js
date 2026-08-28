const express = require('express');
const { getHealthStatus } = require('../controllers/health.controller');
const { validate } = require('../middlewares/validation.middleware');
const { healthQuerySchema } = require('../validators/health.validator');

const router = express.Router();

router.get('/', validate(healthQuerySchema), getHealthStatus);

module.exports = router;
