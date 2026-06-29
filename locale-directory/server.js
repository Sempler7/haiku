const http = require('http');
const fs = require('fs');
const path = require('path');
const LOCALE_MAP = require('./locales');

const PORT = 3000;
const PUBLIC_DIR = path.join(__dirname, 'public');
const CSV_PATH = path.join(__dirname, 'data', 'countries.csv');

// Convert country code to flag emoji (e.g. "UA" -> "🇺🇦")
function codeToFlag(code) {
  return String.fromCodePoint(
    ...code.toUpperCase().split('').map(c => 0x1F1E6 + c.charCodeAt(0) - 65)
  );
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

    // Handle quoted fields (e.g. "Palestine, State of")
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

// Extract country code from locale code (e.g. "uk-UA" -> "UA")
function countryFromLocale(localeCode) {
  return localeCode.split('-').pop().toUpperCase();
}

// Load and parse locales from LOCALE_MAP + CSV names
function loadLocales() {
  const csvContent = fs.readFileSync(CSV_PATH, 'utf-8');
  const countries = parseCSV(csvContent);

  // Build country name index
  const countryNames = {};
  for (const c of countries) {
    countryNames[c.code] = c.name;
  }

  const result = [];
  for (const [localeCode, enrichment] of LOCALE_MAP) {
    const countryCode = countryFromLocale(localeCode);
    result.push({
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

  return result;
}

// MIME types for static files
const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
};

let locales = [];

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);
  const pathname = url.pathname;

  // API: GET /api/locales
  if (pathname === '/api/locales' && req.method === 'GET') {
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.setHeader('Access-Control-Allow-Origin', '*');

    const query = url.searchParams.get('q');
    if (!query || !query.trim()) {
      res.end(JSON.stringify(locales));
      return;
    }

    const q = query.trim().toLowerCase();
    const filtered = locales.filter(l =>
      l.code.toLowerCase().includes(q) ||
      l.currency.toLowerCase().includes(q) ||
      l.name.toLowerCase().includes(q) ||
      l.capital.toLowerCase().includes(q) ||
      l.language.toLowerCase().includes(q) ||
      l.tld.toLowerCase().includes(q) ||
      l.utcOffset.toLowerCase().includes(q)
    );

    res.end(JSON.stringify(filtered));
    return;
  }

  // Serve static files from public/
  if (pathname === '/') {
    serveStatic('/index.html', res);
  } else {
    serveStatic(pathname, res);
  }
});

function serveStatic(filePath, res) {
  const fullPath = path.join(PUBLIC_DIR, filePath);

  // Prevent directory traversal
  if (!fullPath.startsWith(PUBLIC_DIR)) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }

  fs.readFile(fullPath, (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('Not Found');
      return;
    }
    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
    res.end(data);
  });
}

// Start
try {
  locales = loadLocales();
  console.log(`Loaded ${locales.length} locales`);

  server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
} catch (err) {
  console.error('Failed to start server:', err);
  process.exit(1);
}
