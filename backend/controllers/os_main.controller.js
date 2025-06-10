const OSMain = require('../models/os_main.model');
const Inventory = require('../models/inventory.model');
const { sendOSMail } = require('../services/email.service');
const { gerarPDFOS } = require('../services/pdf.service');
const mongoose = require('mongoose');
const logAction = require('../middlewares/logAction');



exports.createOS = async (req, res) => {
  try {
    const os = new OSMain(req.body);
    await os.save();
    res.status(201).json(os);
  } catch (err) {
    res.status(400).json({ error: 'Erro ao criar OS', details: err });
  }
};

exports.getAllOS = async (req, res) => {
  try {
    const { status, cliente, tecnico } = req.query;

    let query = {};
    if (status) query.status = status;
    if (cliente) query.cliente_id = cliente;
    if (tecnico) query.tecnico_id = tecnico;

    const osList = await OSMain.find(query)
      .populate('modelo_id')
      .populate('cliente_id')
      .populate('tecnico_id');

    res.json(osList);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao listar OS' });
  }
};

exports.finalizeOS = async (req, res) => {
  const { id } = req.params;

  try {
    const os = await OSMain.findById(id).populate('itens_utilizados.item_id');
    if (!os) return res.status(404).json({ error: 'OS não encontrada' });
    if (os.status === 'finalizada') return res.status(400).json({ error: 'OS já finalizada' });

    // Deduzir itens
    for (const item of os.itens_utilizados) {
      const estoque = await Inventory.findById(item.item_id._id);
      if (!estoque) continue;

      if (!estoque.permite_estoque_negativo && estoque.quantidade < item.quantidade) {
        return res.status(400).json({ error: `Estoque insuficiente para o item: ${estoque.nome}` });
      }

      estoque.quantidade -= item.quantidade;
      await estoque.save();
    }

    os.status = 'finalizada';
    os.finalizada_em = new Date();
    await os.save();
    await os.populate(['cliente_id', 'tecnico_id', 'modelo_id']) // garantir dados completos
    await sendOSMail(os)

    res.json({ message: 'OS finalizada e estoque atualizado' });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao finalizar OS', details: err });
  }
};

exports.countPendingOS = async (req, res) => {
  try {
    const count = await OSMain.countDocuments({ status: 'em_analise' });
    res.json({ pendentes: count });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao contar OS pendentes' });
  }
};

exports.getOSById = async (req, res) => {
  try {
    const os = await OSMain.findById(req.params.id)
      .populate('cliente_id')
      .populate('tecnico_id')
      .populate('modelo_id')
      .populate('itens_utilizados.item_id')

    if (!os) return res.status(404).json({ error: 'OS não encontrada' })
    res.json(os)
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar OS' })
  }
}

exports.exportarPDF = async (req, res) => {
  try {
    const os = await OSMain.findById(req.params.id)
      .populate('modelo_id')
      .populate('cliente_id')
      .populate('tecnico_id')
      .populate('itens_utilizados.item_id');

    if (!os) return res.status(404).json({ error: 'OS não encontrada' });

    gerarPDFOS(os, (filePath) => {
      res.download(filePath, `OS-${os._id}.pdf`, () => {
        fs.unlinkSync(filePath); // remove após envio
      });
    });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao gerar PDF' });
  }
};

exports.getDashboardStats = async (req, res) => {
  try {
    const porStatus = await OSMain.aggregate([
      { $group: { _id: '$status', total: { $sum: 1 } } }
    ]);

    const porTecnico = await OSMain.aggregate([
      {
        $group: {
          _id: '$tecnico_id',
          total: { $sum: 1 }
        }
      }
    ]);

    const porMes = await OSMain.aggregate([
      {
        $group: {
          _id: {
            ano: { $year: '$criado_em' },
            mes: { $month: '$criado_em' }
          },
          total: { $sum: 1 }
        }
      },
      { $sort: { '_id.ano': 1, '_id.mes': 1 } }
    ]);

    res.json({ porStatus, porTecnico, porMes });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao gerar estatísticas' });
  }
};