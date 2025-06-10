const express = require('express');
const { createOS, getAllOS } = require('../controllers/os_main.controller');
const router = express.Router();
const { finalizeOS, countPendingOS, getOSById, exportarPDF, getDashboardStats } = require('../controllers/os_main.controller');
const auth = require('../middlewares/auth');
const logAction = require('../middlewares/logAction');
const permitir = require('../middlewares/permitirRoles');

// Rotas

router.post('/', createOS);
router.get('/', getAllOS);
router.patch('/:id/finalizar', logAction('Finalizar OS', 'OS marcada como finalizada'),auth, permitir('admin'), finalizeOS);
router.get('/contagem/pendentes', countPendingOS);
router.get('/:id', getOSById);
router.get('/:id/exportar', exportarPDF);
router.get('/dashboard/estatisticas', getDashboardStats);

module.exports = router;
