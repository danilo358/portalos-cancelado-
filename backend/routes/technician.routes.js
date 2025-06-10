const express = require('express');
const { createTechnician, getTechnicians } = require('../controllers/technician.controller');

const router = express.Router();

router.post('/', createTechnician);
router.get('/', getTechnicians);

module.exports = router;
