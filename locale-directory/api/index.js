const fs = require('fs');
const path = require('path');
const LOCALE_MAP = require('../locales');

function codeToFlag(code) {
  return String.fromCodePoint(
    ...code.toUpperCase().split('').map(c => 0x1F1E6 + c.charCodeAt(0) - 65)
  );
}

function countryFromLocale(localeCode) {
  return localeCode.split('-').pop().toUpperCase();
}

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

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
};

module.exports = (req, res) => {
  const url = new URL(req.url, 'https://localhost');
  const pathname = url.pathname;

  // API: /api/locales
  if (pathname === '/api/locales') {
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.setHeader('Access-Control-Allow-Origin', '*');
    try {
      const all = getLocales();
      const q = url.searchParams.get('q');
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
    } catch (err) {
      return res.status(500).json({ error: 'Internal error' });
    }
  }

  // Serve static files from root
  const filename = pathname === '/' ? '/index.html' : pathname;
  const fullPath = path.join(__dirname, '..', filename);

  try {
    if (!fullPath.startsWith(path.join(__dirname, '..'))) {
      return res.status(403).end('Forbidden');
    }
    const data = fs.readFileSync(fullPath);
    const ext = path.extname(filename).toLowerCase();
    res.setHeader('Content-Type', MIME[ext] || 'application/octet-stream');
    res.status(200).end(data);
  } catch {
    res.status(404).end('Not Found');
  }
};
