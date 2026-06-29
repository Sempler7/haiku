// Regenerate locales.js with all data including capitals
const fs = require('fs');
const path = require('path');

// [language, currency, utcOffset, tld, timezone, capital]
const DATA = require('./locales_raw.js');

// Build the file content
let lines = [
  '// Locale enrichment data: [code, language, currency, utcOffset, tld, timezone, capital]',
  '// Keyed by ISO 3166-1 alpha-2 country code. Format: [language, currency, utcOffset, tld, timezone, capital]',
  'const LOCALE_MAP = new Map([',
];

const sorted = Object.keys(DATA).sort();
for (const code of sorted) {
  const vals = DATA[code].map(v => "'" + v.replace(/'/g, "\\'") + "'");
  lines.push("  ['" + code + "', [" + vals.join(', ') + "]],");
}

lines.push(']);');
lines.push('');
lines.push('module.exports = LOCALE_MAP;');

fs.writeFileSync(path.join(__dirname, '..', 'locales.js'), lines.join('\n'), 'utf-8');
console.log('Done! Verifying...');

const map = require(path.join(__dirname, '..', 'locales.js'));
console.log('Total:', map.size);
console.log('UA:', map.get('UA'));
console.log('AG:', map.get('AG'));
console.log('TD:', map.get('TD'));
console.log('YE:', map.get('YE'));
console.log('TO:', map.get('TO'));
