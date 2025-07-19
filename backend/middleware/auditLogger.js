// middleware/auditLogger.js
const AuditLog = require('../models/AuditLog');

module.exports = async function auditLogger(userId, action, details = null) {
  try {
    await AuditLog.create({
      userId,
      action,
      details,
      createdAt: new Date()
    });
  } catch (err) {
    // Não interrompe o fluxo, apenas loga erro
    console.error('Erro ao registrar log de auditoria:', err);
  }
};
