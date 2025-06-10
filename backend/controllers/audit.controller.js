const AuditLog = require('../models/audit_log.model');

exports.listarLogs = async (req, res) => {
  try {
    const logs = await AuditLog.find().populate('usuario_id').sort({ data: -1 }).limit(100);
    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar auditoria' });
  }
};
