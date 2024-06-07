const express = require('express');
const router = express.Router();
const plantController = require('../controllers/plant'); // Assure-toi que le chemin est correct

router.get('/', plantController.getPlants);

module.exports = router;
