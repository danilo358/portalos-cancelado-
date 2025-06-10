const mongoose = require('mongoose');

const OSModelSchema = new mongoose.Schema({
  nome: { type: String, required: true, unique: true }
});

module.exports = mongoose.model('OSModel', OSModelSchema);
