const express = require('express');
const router = express.Router();
const plantController = require('../controllers/plant');

router.get('/', plantController.getPlants);
router.get('/:id', plantController.getPlantById);

module.exports = router;
