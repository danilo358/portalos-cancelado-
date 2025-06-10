const mongoose = require('mongoose');

const OSMainSchema = new mongoose.Schema({
  modelo_id: { type: mongoose.Schema.Types.ObjectId, ref: 'OSModel', required: true },
  cliente_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true },
  tecnico_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Technician', required: true },
  campos_preenchidos: [{
    campo: String,
    valor: mongoose.Schema.Types.Mixed
  }],
  anexos: [String], // links ou nomes de arquivos
  status: { type: String, enum: ['rascunho', 'em_analise', 'finalizada', 'cancelada'], default: 'rascunho' },
  criado_em: { type: Date, default: Date.now },
  finalizada_em: { type: Date },
  itens_utilizados: [{
    item_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Inventory' },
    quantidade: Number
  }]
});

module.exports = mongoose.model('OSMain', OSMainSchema);
