const AuditLog = require('../models/audit_log.model');

const logAction = (acao, detalhes = '') => {
  return async (req, res, next) => {
    const user = req.user; // vem do middleware de autenticação (JWT)
    if (!user) return next();

    try {
      await AuditLog.create({
        usuario_id: user.id,
        acao,
        detalhes
      });
    } catch (err) {
      console.error('Erro ao registrar log:', err.message);
    }

    next();
  };
};

module.exports = logAction;
