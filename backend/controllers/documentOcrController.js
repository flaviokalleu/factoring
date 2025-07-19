// controllers/documentOcrController.js
const Document = require('../models/Document');

async function validateDocument(documentId) {
  // Simulação de validação OCR
  const doc = await Document.findByPk(documentId);
  if (!doc) throw new Error('Documento não encontrado');
  // Aqui você pode integrar com um serviço OCR
  doc.status = 'validado';
  await doc.save();
  return doc;
}

module.exports = { validateDocument };
