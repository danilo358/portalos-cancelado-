const express = require('express');
const router = express.Router();
const { listarLogs } = require('../controllers/audit.controller');
const authMiddleware = require('../middlewares/auth'); // assume JWT já implementado
const auth = require('../middlewares/auth');
const permitir = require('../middlewares/permitirRoles');


router.get('/', auth, permitir('admin'), listarLogs);

module.exports = router;
