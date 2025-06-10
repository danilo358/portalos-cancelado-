const mongoose = require('mongoose');

const OSFieldModelSchema = new mongoose.Schema({
  modelo_id: { type: mongoose.Schema.Types.ObjectId, ref: 'OSModel', required: true },
  campo: { type: String, required: true },
  tipo: { type: String, enum: ['texto', 'número', 'data', 'email'], required: true },
  obrigatorio: { type: Boolean, default: false }
});

module.exports = mongoose.model('OSFieldModel', OSFieldModelSchema);
