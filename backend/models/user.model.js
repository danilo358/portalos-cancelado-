const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  senha: { type: String, required: true },
  permissao: { type: String, enum: ['admin', 'tecnico', 'estoquista'], required: true }
});

module.exports = mongoose.model('User', UserSchema);
