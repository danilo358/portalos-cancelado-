const express = require('express');
const router = express.Router();

const Inventory = require('../models/inventory.model');
const InventoryHistory = require('../models/inventory_history.model');

// [GET] /api/estoque - listar todos os itens
router.get('/', async (req, res) => {
  try {
    const itens = await Inventory.find();
    res.json(itens);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar inventário' });
  }
});

// [POST] /api/estoque/ajustar - ajustar estoque com base na contagem real
router.post('/ajustar', async (req, res) => {
  try {
    const { ajustes } = req.body;

    for (const ajuste of ajustes) {
      const item = await Inventory.findById(ajuste.item_id);
      if (!item) continue;

      const historico = new InventoryHistory({
        item_id: item._id,
        quantidade_teorica: item.quantidade,
        quantidade_real: ajuste.quantidade_real,
        diferenca: ajuste.quantidade_real - item.quantidade
      });

      item.quantidade = ajuste.quantidade_real;
      await item.save();
      await historico.save();
    }

    res.json({ message: 'Inventário ajustado com sucesso' });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao ajustar inventário' });
  }
});

// [GET] /api/estoque/historico - histórico de correções (opcional)
router.get('/historico', async (req, res) => {
  try {
    const historico = await InventoryHistory.find().populate('item_id').sort({ data_corrigida: -1 });
    res.json(historico);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar histórico' });
  }
});

module.exports = router;
