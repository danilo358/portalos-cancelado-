const mongoose = require('mongoose');

const ClientSchema = new mongoose.Schema({
  nome: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  cidade: { type: String },
  contato: { type: String }
});

module.exports = mongoose.model('Client', ClientSchema);
