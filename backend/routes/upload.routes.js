const express = require('express');
const upload = require('../middlewares/upload');
const router = express.Router();

router.post('/anexos', upload.array('anexos', 5), (req, res) => {
  const nomes = req.files.map(file => file.filename);
  res.json({ arquivos: nomes });
});

module.exports = router;
