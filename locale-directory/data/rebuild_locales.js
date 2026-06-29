// Rebuild locales.js with locale codes (en-US, uk-UA, etc.)
const fs = require('fs');
const path = require('path');

const COUNTRY_DATA = require('./locales_raw.js');
const LOCALE_TO_COUNTRY = require('./locale_list.js');

// Build locale map: localeCode → country data (inherited)
const LOCALE_MAP = new Map();

let missingCountry = new Set();

for (const [localeCode, countryCode] of Object.entries(LOCALE_TO_COUNTRY)) {
  const data = COUNTRY_DATA[countryCode];
  if (data) {
    LOCALE_MAP.set(localeCode, data);
  } else {
    missingCountry.add(countryCode);
  }
}

console.log('Total locales:', LOCALE_MAP.size);
console.log('Missing countries:', [...missingCountry].join(', '));

// Build file content
let lines = [
  '// Locale enrichment data keyed by locale code (e.g., uk-UA, en-US)',
  '// Format: [language, currency, utcOffset, tld, timezone, capital]',
  'const LOCALE_MAP = new Map([',
];

const sorted = [...LOCALE_MAP.entries()].sort((a, b) => a[0].localeCompare(b[0]));
for (const [code, data] of sorted) {
  const vals = data.map(v => "'" + String(v).replace(/'/g, "\\'") + "'");
  lines.push("  ['" + code + "', [" + vals.join(', ') + "]],");
}

lines.push(']);');
lines.push('');
lines.push('module.exports = LOCALE_MAP;');

fs.writeFileSync(path.join(__dirname, '..', 'locales.js'), lines.join('\n'), 'utf-8');
console.log('Written to locales.js');

// Verify
const map = require(path.join(__dirname, '..', 'locales.js'));
console.log('Verified:', map.size, 'locales');
console.log('uk-UA:', map.get('uk-UA'));
console.log('en-US:', map.get('en-US'));
console.log('de-DE:', map.get('de-DE'));
console.log('ja-JP:', map.get('ja-JP'));
