const express = require('express');
const { createOSModel, addFieldToModel, getModelsWithFields } = require('../controllers/os_model.controller');
const router = express.Router();

router.post('/', createOSModel);
router.post('/campo', addFieldToModel);
router.get('/', getModelsWithFields);

module.exports = router;
