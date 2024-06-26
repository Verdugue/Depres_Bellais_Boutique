const express = require('express');
const router = express.Router();
const controllers = require('../controllers/poisson');

router.get('/', controllers.getPoissons);
router.get('/:id', controllers.getPoissonById);

module.exports = router;
