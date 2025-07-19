// controllers/documentController.js
const Document = require('../models/Document');

async function uploadDocument(clientId, type, url) {
  const doc = await Document.create({ clientId, type, url, status: 'pendente', uploadedAt: new Date() });
  return doc;
}

module.exports = { uploadDocument };
