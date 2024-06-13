const express = require('express');
const router = express.Router();
const filterController = require('../controllers/filter');

router.get('/species', filterController.getSpecies);
router.get('/locations', filterController.getLocations);
router.get('/colors', filterController.getColors);
router.get('/results', filterController.getResults);

module.exports = router;
