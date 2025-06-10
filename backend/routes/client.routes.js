const express = require('express');
const router = express.Router();
const { createClient, getClients } = require('../controllers/client.controller');

router.post('/', createClient);
router.get('/', getClients);

module.exports = router;
