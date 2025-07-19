// controllers/biExportController.js
const BIGraph = require('../models/BIGraph');
const { exportToCSV } = require('../utils/exportReport');
const path = require('path');

async function exportGraphs(companyId) {
  const graphs = await BIGraph.findAll({ where: { companyId } });
  const filePath = path.join(__dirname, '../../exports/graphs.csv');
  exportToCSV(graphs.map(g => g.dataValues), ['id', 'type', 'config'], filePath);
  return filePath;
}

module.exports = { exportGraphs };
