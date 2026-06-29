const path = require('path');
const fs = require('fs');
const LOCALE_MAP = require('../locales');

// Convert country code to flag emoji
function codeToFlag(code) {
  return String.fromCodePoint(
    ...code.toUpperCase().split('').map(c => 0x1F1E6 + c.charCodeAt(0) - 65)
  );
}

// Extract country code from locale code (e.g. "uk-UA" -> "UA")
function countryFromLocale(localeCode) {
  return localeCode.split('-').pop().toUpperCase();
}

// Parse CSV into array of { name, code }
function parseCSV(content) {
  const lines = content.trim().split('\n');
  const headers = lines[0].split(',');
  const codeIdx = headers.indexOf('Code');
  const nameIdx = headers.indexOf('Name');

  const result = [];
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    let col = 0, name = '', code = '', inQuotes = false;
    for (const ch of line) {
      if (ch === '"') { inQuotes = !inQuotes; continue; }
      if (ch === ',' && !inQuotes) { col++; continue; }
      if (col === nameIdx) name += ch;
      if (col === codeIdx) code += ch;
    }
    if (code) result.push({ name: name.trim(), code: code.trim() });
  }
  return result;
}

// Build locales array (cached)
let locales = null;

function getLocales() {
  if (locales) return locales;

  const csvPath = path.join(__dirname, '..', 'data', 'countries.csv');
  const csv = fs.readFileSync(csvPath, 'utf-8');
  const countries = parseCSV(csv);

  const countryNames = {};
  for (const c of countries) countryNames[c.code] = c.name;

  locales = [];
  for (const [localeCode, enrichment] of LOCALE_MAP) {
    const countryCode = countryFromLocale(localeCode);
    locales.push({
      code: localeCode,
      name: countryNames[countryCode] || countryCode,
      capital: enrichment[5] || '',
      language: enrichment[0] || '',
      currency: enrichment[1] || '',
      utcOffset: enrichment[2] || '',
      tld: enrichment[3] || '',
      flag: codeToFlag(countryCode),
      timezone: enrichment[4] || '',
    });
  }

  return locales;
}

// Vercel serverless handler: GET /api/locales?q=...
module.exports = (req, res) => {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Access-Control-Allow-Origin', '*');

  const all = getLocales();
  const { q } = req.query;

  if (!q || !q.trim()) {
    return res.status(200).json(all);
  }

  const query = q.trim().toLowerCase();
  const filtered = all.filter(l =>
    l.code.toLowerCase().includes(query) ||
    l.currency.toLowerCase().includes(query) ||
    l.name.toLowerCase().includes(query) ||
    l.capital.toLowerCase().includes(query) ||
    l.language.toLowerCase().includes(query) ||
    l.tld.toLowerCase().includes(query) ||
    l.utcOffset.toLowerCase().includes(query)
  );

  return res.status(200).json(filtered);
};
