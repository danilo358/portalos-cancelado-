const mongoose = require('mongoose');

const InventorySchema = new mongoose.Schema({
  nome: { type: String, required: true, unique: true },
  quantidade: { type: Number, required: true },
  valor: { type: Number },
  permite_estoque_negativo: { type: Boolean, default: false }
});

module.exports = mongoose.model('Inventory', InventorySchema);
