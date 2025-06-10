const mongoose = require('mongoose');

const InventoryHistorySchema = new mongoose.Schema({
  item_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Inventory' },
  quantidade_teorica: Number,
  quantidade_real: Number,
  diferenca: Number,
  data_corrigida: { type: Date, default: Date.now }
});

module.exports = mongoose.model('InventoryHistory', InventoryHistorySchema);
