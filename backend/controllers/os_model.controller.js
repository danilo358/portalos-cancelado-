const OSModel = require('../models/os_model.model');
const OSFieldModel = require('../models/os_field_model.model');

exports.createOSModel = async (req, res) => {
  try {
    const model = new OSModel({ nome: req.body.nome });
    await model.save();
    res.status(201).json(model);
  } catch (err) {
    res.status(400).json({ error: 'Erro ao criar modelo' });
  }
};

exports.addFieldToModel = async (req, res) => {
  try {
    const field = new OSFieldModel(req.body);
    await field.save();
    res.status(201).json(field);
  } catch (err) {
    res.status(400).json({ error: 'Erro ao adicionar campo ao modelo' });
  }
};

exports.getModelsWithFields = async (req, res) => {
  try {
    const models = await OSModel.find();
    const modelsWithFields = await Promise.all(models.map(async (model) => {
      const fields = await OSFieldModel.find({ modelo_id: model._id });
      return { ...model.toObject(), campos: fields };
    }));
    res.json(modelsWithFields);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar modelos' });
  }
};
