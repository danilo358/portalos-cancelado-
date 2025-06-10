const Technician = require('../models/technician.model');

exports.createTechnician = async (req, res) => {
  try {
    const tech = new Technician(req.body);
    await tech.save();
    res.status(201).json(tech);
  } catch (err) {
    res.status(400).json({ error: 'Erro ao criar técnico', details: err });
  }
};

exports.getTechnicians = async (req, res) => {
  try {
    const technicians = await Technician.find();
    res.json(technicians);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar técnicos' });
  }
};
