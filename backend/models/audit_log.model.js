const mongoose = require('mongoose');

const AuditLogSchema = new mongoose.Schema({
  usuario_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  acao: { type: String, required: true },
  detalhes: { type: String },
  data: { type: Date, default: Date.now }
});

module.exports = mongoose.model('AuditLog', AuditLogSchema);
