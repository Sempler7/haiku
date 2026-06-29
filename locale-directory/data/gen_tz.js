// One-time script: add IANA timezone field to LOCALE_MAP
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'locales.js');
let content = fs.readFileSync(filePath, 'utf-8');

const TZ = {
  AF:'Asia/Kabul', AL:'Europe/Tirane', DZ:'Africa/Algiers',
  AS:'Pacific/Pago_Pago', AD:'Europe/Andorra', AO:'Africa/Luanda',
  AI:'America/Anguilla', AQ:'Antarctica/McMurdo', AG:'America/Antigua',
  AR:'America/Argentina/Buenos_Aires', AM:'Asia/Yerevan', AW:'America/Aruba',
  AU:'Australia/Sydney', AT:'Europe/Vienna', AZ:'Asia/Baku',
  BS:'America/Nassau', BH:'Asia/Bahrain', BD:'Asia/Dhaka',
  BB:'America/Barbados', BY:'Europe/Minsk', BE:'Europe/Brussels',
  BZ:'America/Belize', BJ:'Africa/Porto-Novo', BM:'Atlantic/Bermuda',
  BT:'Asia/Thimphu', BO:'America/La_Paz', BQ:'America/Kralendijk',
  BA:'Europe/Sarajevo', BW:'Africa/Gaborone', BV:'Europe/Oslo',
  BR:'America/Sao_Paulo', IO:'Indian/Chagos', BN:'Asia/Brunei',
  BG:'Europe/Sofia', BF:'Africa/Ouagadougou', BI:'Africa/Bujumbura',
  CV:'Atlantic/Cape_Verde', KH:'Asia/Phnom_Penh', CM:'Africa/Douala',
  CA:'America/Toronto', KY:'America/Cayman', CF:'Africa/Bangui',
  TD:'Africa/Ndjamena', CL:'America/Santiago', CN:'Asia/Shanghai',
  CX:'Indian/Christmas', CC:'Indian/Cocos', CO:'America/Bogota',
  KM:'Indian/Comoro', CD:'Africa/Kinshasa', CG:'Africa/Brazzaville',
  CK:'Pacific/Rarotonga', CR:'America/Costa_Rica', HR:'Europe/Zagreb',
  CU:'America/Havana', CW:'America/Curacao', CY:'Asia/Nicosia',
  CZ:'Europe/Prague', CI:'Africa/Abidjan', DK:'Europe/Copenhagen',
  DJ:'Africa/Djibouti', DM:'America/Dominica', DO:'America/Santo_Domingo',
  EC:'America/Guayaquil', EG:'Africa/Cairo', SV:'America/El_Salvador',
  GQ:'Africa/Malabo', ER:'Africa/Asmara', EE:'Europe/Tallinn',
  SZ:'Africa/Mbabane', ET:'Africa/Addis_Ababa', FK:'Atlantic/Stanley',
  FO:'Atlantic/Faroe', FJ:'Pacific/Fiji', FI:'Europe/Helsinki',
  FR:'Europe/Paris', GF:'America/Cayenne', PF:'Pacific/Tahiti',
  TF:'Indian/Kerguelen', GA:'Africa/Libreville', GM:'Africa/Banjul',
  GE:'Asia/Tbilisi', DE:'Europe/Berlin', GH:'Africa/Accra',
  GI:'Europe/Gibraltar', GR:'Europe/Athens', GL:'America/Godthab',
  GD:'America/Grenada', GP:'America/Guadeloupe', GU:'Pacific/Guam',
  GT:'America/Guatemala', GG:'Europe/Guernsey', GN:'Africa/Conakry',
  GW:'Africa/Bissau', GY:'America/Guyana', HT:'America/Port-au-Prince',
  HM:'Indian/Kerguelen', VA:'Europe/Vatican', HN:'America/Tegucigalpa',
  HK:'Asia/Hong_Kong', HU:'Europe/Budapest', IS:'Atlantic/Reykjavik',
  IN:'Asia/Kolkata', ID:'Asia/Jakarta', IR:'Asia/Tehran',
  IQ:'Asia/Baghdad', IE:'Europe/Dublin', IM:'Europe/Isle_of_Man',
  IL:'Asia/Jerusalem', IT:'Europe/Rome', JM:'America/Jamaica',
  JP:'Asia/Tokyo', JE:'Europe/Jersey', JO:'Asia/Amman',
  KZ:'Asia/Almaty', KE:'Africa/Nairobi', KI:'Pacific/Tarawa',
  KP:'Asia/Pyongyang', KR:'Asia/Seoul', KW:'Asia/Kuwait',
  KG:'Asia/Bishkek', LA:'Asia/Vientiane', LV:'Europe/Riga',
  LB:'Asia/Beirut', LS:'Africa/Maseru', LR:'Africa/Monrovia',
  LY:'Africa/Tripoli', LI:'Europe/Vaduz', LT:'Europe/Vilnius',
  LU:'Europe/Luxembourg', MO:'Asia/Macau', MG:'Indian/Antananarivo',
  MW:'Africa/Blantyre', MY:'Asia/Kuala_Lumpur', MV:'Indian/Maldives',
  ML:'Africa/Bamako', MT:'Europe/Malta', MH:'Pacific/Majuro',
  MQ:'America/Martinique', MR:'Africa/Nouakchott', MU:'Indian/Mauritius',
  YT:'Indian/Mayotte', MX:'America/Mexico_City', FM:'Pacific/Chuuk',
  MD:'Europe/Chisinau', MC:'Europe/Monaco', MN:'Asia/Ulaanbaatar',
  ME:'Europe/Podgorica', MS:'America/Montserrat', MA:'Africa/Casablanca',
  MZ:'Africa/Maputo', MM:'Asia/Yangon', NA:'Africa/Windhoek',
  NR:'Pacific/Nauru', NP:'Asia/Kathmandu', NL:'Europe/Amsterdam',
  NC:'Pacific/Noumea', NZ:'Pacific/Auckland', NI:'America/Managua',
  NE:'Africa/Niamey', NG:'Africa/Lagos', NU:'Pacific/Niue',
  NF:'Pacific/Norfolk', MK:'Europe/Skopje', MP:'Pacific/Saipan',
  NO:'Europe/Oslo', OM:'Asia/Muscat', PK:'Asia/Karachi',
  PW:'Pacific/Palau', PS:'Asia/Gaza', PA:'America/Panama',
  PG:'Pacific/Port_Moresby', PY:'America/Asuncion', PE:'America/Lima',
  PH:'Asia/Manila', PN:'Pacific/Pitcairn', PL:'Europe/Warsaw',
  PT:'Europe/Lisbon', PR:'America/Puerto_Rico', QA:'Asia/Qatar',
  RO:'Europe/Bucharest', RU:'Europe/Moscow', RW:'Africa/Kigali',
  RE:'Indian/Reunion', BL:'America/St_Barthelemy', SH:'Atlantic/St_Helena',
  KN:'America/St_Kitts', LC:'America/St_Lucia', MF:'America/Marigot',
  PM:'America/Miquelon', VC:'America/St_Vincent', WS:'Pacific/Apia',
  SM:'Europe/San_Marino', ST:'Africa/Sao_Tome', SA:'Asia/Riyadh',
  SN:'Africa/Dakar', RS:'Europe/Belgrade', SC:'Indian/Mahe',
  SL:'Africa/Freetown', SG:'Asia/Singapore', SX:'America/Lower_Princes',
  SK:'Europe/Bratislava', SI:'Europe/Ljubljana', SB:'Pacific/Guadalcanal',
  SO:'Africa/Mogadishu', ZA:'Africa/Johannesburg', GS:'Atlantic/South_Georgia',
  SS:'Africa/Juba', ES:'Europe/Madrid', LK:'Asia/Colombo',
  SD:'Africa/Khartoum', SR:'America/Paramaribo', SJ:'Arctic/Longyearbyen',
  SE:'Europe/Stockholm', CH:'Europe/Zurich', SY:'Asia/Damascus',
  TW:'Asia/Taipei', TJ:'Asia/Dushanbe', TZ:'Africa/Dar_es_Salaam',
  TH:'Asia/Bangkok', TL:'Asia/Dili', TG:'Africa/Lome',
  TK:'Pacific/Fakaofo', TO:'Pacific/Tongatapu', TT:'America/Port_of_Spain',
  TN:'Africa/Tunis', TM:'Asia/Ashgabat', TC:'America/Grand_Turk',
  TV:'Pacific/Funafuti', TR:'Europe/Istanbul', UG:'Africa/Kampala',
  UA:'Europe/Kyiv', AE:'Asia/Dubai', GB:'Europe/London',
  UM:'Pacific/Wake', US:'America/New_York', UY:'America/Montevideo',
  UZ:'Asia/Tashkent', VU:'Pacific/Efate', VE:'America/Caracas',
  VN:'Asia/Ho_Chi_Minh', VG:'America/Tortola', VI:'America/St_Thomas',
  WF:'Pacific/Wallis', EH:'Africa/El_Aaiun', YE:'Asia/Aden',
  ZM:'Africa/Lusaka', ZW:'Africa/Harare', AX:'Europe/Mariehamn',
};

// Fix comment
content = content.replace(
  "// Locale enrichment data: [code, language, currency, utcOffset, tld]",
  "// Locale enrichment data: [code, language, currency, utcOffset, tld, timezone]"
);
content = content.replace(
  "// Keyed by ISO 3166-1 alpha-2 country code",
  "// Keyed by ISO 3166-1 alpha-2 country code. Format: [language, currency, utcOffset, tld, timezone]"
);

// For each country code entry, add timezone before closing bracket
for (const [code, tz] of Object.entries(TZ)) {
  // Match [['code', [... and insert timezone
  const re = new RegExp(`('${code}',\\s*\\[[^\\]]+)'(]\\s*,\\s*\\[)`);
  // The closing '] at end of the array
  // Actually the pattern is: ['XX', [...values...]] -> need to find 'XX', [... last element ']
  content = content.replace(
    new RegExp(`('${code}',\\s*\\[)((?:'[^']*',\\s*)*'[^']*)'(\\])`),
    `$1$2', '${tz}']`
  );
}

fs.writeFileSync(filePath, content, 'utf-8');
console.log('Done! Verifying...');

// Verify
const map = require(filePath);
console.log('Total entries:', map.size);
const al = map.get('AL');
console.log('Albania:', al);
const ua = map.get('UA');
console.log('Ukraine:', ua);
const us = map.get('US');
console.log('USA:', us);
