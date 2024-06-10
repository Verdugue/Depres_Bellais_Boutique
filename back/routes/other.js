const express = require('express');
const router = express.Router();
const otherController = require('../controllers/other');

router.get('/', otherController.getOthers);
router.get('/:id', otherController.getOtherById);

module.exports = router;
