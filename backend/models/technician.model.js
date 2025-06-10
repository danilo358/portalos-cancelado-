const mongoose = require('mongoose');

const TechnicianSchema = new mongoose.Schema({
  nome: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true }
});

module.exports = mongoose.model('Technician', TechnicianSchema);
