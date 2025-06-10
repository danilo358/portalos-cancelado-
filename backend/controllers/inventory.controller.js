const Inventory = require('../models/inventory.model')
const InventoryHistory = require('../models/inventory_history.model')

exports.ajustarInventario = async (req, res) => {
  try {
    const { ajustes } = req.body

    for (const ajuste of ajustes) {
      const item = await Inventory.findById(ajuste.item_id)
      if (!item) continue

      const historico = new InventoryHistory({
        item_id: item._id,
        quantidade_teorica: item.quantidade,
        quantidade_real: ajuste.quantidade_real,
        diferenca: ajuste.quantidade_real - item.quantidade
      })

      item.quantidade = ajuste.quantidade_real
      await item.save()
      await historico.save()
    }

    res.json({ message: 'Inventário ajustado com sucesso' })
  } catch (err) {
    res.status(500).json({ error: 'Erro ao ajustar inventário' })
  }
}
