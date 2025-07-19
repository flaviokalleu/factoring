// controllers/biController.js
const BIGraph = require('../models/BIGraph');

async function createGraph(companyId, type, config) {
  const graph = await BIGraph.create({ companyId, type, config });
  return graph;
}

async function getGraphs(companyId) {
  return await BIGraph.findAll({ where: { companyId } });
}

module.exports = { createGraph, getGraphs };
