module.exports = (...rolesPermitidos) => {
  return (req, res, next) => {
    if (!req.user || !rolesPermitidos.includes(req.user.permissao)) {
      return res.status(403).json({ error: 'Acesso negado' });
    }
    next();
  };
}
