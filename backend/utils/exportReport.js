// utils/exportReport.js
const { Parser } = require('json2csv');
const fs = require('fs');

function exportToCSV(data, fields, filePath) {
  const parser = new Parser({ fields });
  const csv = parser.parse(data);
  fs.writeFileSync(filePath, csv);
  return filePath;
}

module.exports = { exportToCSV };
