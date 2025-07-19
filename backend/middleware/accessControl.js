// middleware/accessControl.js
module.exports = function accessControl(requiredRole = null) {
  return (req, res, next) => {
    const user = req.user; // req.user deve ser preenchido pelo middleware de autenticação
    if (!user) {
      return res.status(401).json({ error: 'Usuário não autenticado' });
    }
    if (requiredRole && user.role !== requiredRole) {
      return res.status(403).json({ error: 'Acesso negado: permissão insuficiente' });
    }
    // Se for admin, restringe acesso à própria empresa
    if (user.role === 'admin') {
      req.companyFilter = { companyId: user.companyId };
    }
    // Superadmin tem acesso total
    next();
  };
};
