const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

exports.register = async (req, res) => {
  const { nome, email, senha, permissao } = req.body;
  try {
    const hashed = await bcrypt.hash(senha, 10);
    const user = new User({ nome, email, senha: hashed, permissao });
    await user.save();
    res.status(201).json({ message: 'Usuário criado' });
  } catch (err) {
    res.status(400).json({ error: 'Erro ao criar usuário' });
  }
};

exports.login = async (req, res) => {
  const { email, senha } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: 'Usuário não encontrado' });

    const match = await bcrypt.compare(senha, user.senha);
    if (!match) return res.status(401).json({ error: 'Senha incorreta' });

    const token = jwt.sign({ id: user._id, permissao: user.permissao }, process.env.JWT_SECRET, { expiresIn: '2h' });
    res.json({ token, user: { nome: user.nome, email: user.email, permissao: user.permissao } });
  } catch (err) {
    res.status(500).json({ error: 'Erro no login' });
  }
};
