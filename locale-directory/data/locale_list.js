// 377 locale codes from simplelocalize, mapped to ISO country code
// Format: { localeCode: countryCode }
const LOCALE_TO_COUNTRY = {
  "aa-ER":"ER","af-NA":"NA","af-ZA":"ZA","am-ET":"ET","ar-AE":"AE",
  "ar-BH":"BH","ar-DJ":"DJ","ar-DZ":"DZ","ar-EG":"EG","ar-ER":"ER",
  "ar-IL":"IL","ar-IQ":"IQ","ar-JO":"JO","ar-KM":"KM","ar-KW":"KW",
  "ar-LB":"LB","ar-LY":"LY","ar-MA":"MA","ar-MR":"MR","ar-OM":"OM",
  "ar-PS":"PS","ar-QA":"QA","ar-SA":"SA","ar-SD":"SD","ar-SO":"SO",
  "ar-SY":"SY","ar-TD":"TD","ar-TN":"TN","ar-YE":"YE","ay-BO":"BO",
  "az-AZ":"AZ","be-BY":"BY","bg-BG":"BG","bi-VU":"VU","bn-BD":"BD",
  "bs-BA":"BA","bs-ME":"ME","byn-ER":"ER","ca-AD":"AD","ch-GU":"GU",
  "ch-MP":"MP","cs-CZ":"CZ","da-DK":"DK","de-AT":"AT","de-BE":"BE",
  "de-CH":"CH","de-DE":"DE","de-LI":"LI","de-LU":"LU","de-VA":"VA",
  "dv-MV":"MV","dz-BT":"BT","el-CY":"CY","el-GR":"GR","en-AG":"AG",
  "en-AI":"AI","en-AQ":"AQ","en-AS":"AS","en-AU":"AU","en-BB":"BB",
  "en-BM":"BM","en-BS":"BS","en-BW":"BW","en-BZ":"BZ","en-CA":"CA",
  "en-CC":"CC","en-CK":"CK","en-CM":"CM","en-CW":"CW","en-CX":"CX",
  "en-DM":"DM","en-ER":"ER","en-FJ":"FJ","en-FK":"FK","en-FM":"FM",
  "en-GB":"GB","en-GD":"GD","en-GG":"GG","en-GH":"GH","en-GI":"GI",
  "en-GM":"GM","en-GS":"GS","en-GU":"GU","en-GY":"GY","en-HK":"HK",
  "en-HM":"HM","en-IE":"IE","en-IM":"IM","en-IN":"IN","en-IO":"IO",
  "en-JE":"JE","en-JM":"JM","en-KE":"KE","en-KI":"KI","en-KN":"KN",
  "en-KY":"KY","en-LC":"LC","en-LR":"LR","en-LS":"LS","en-MF":"MF",
  "en-MH":"MH","en-MP":"MP","en-MS":"MS","en-MT":"MT","en-MU":"MU",
  "en-MW":"MW","en-NA":"NA","en-NF":"NF","en-NG":"NG","en-NR":"NR",
  "en-NU":"NU","en-NZ":"NZ","en-PG":"PG","en-PH":"PH","en-PK":"PK",
  "en-PN":"PN","en-PR":"PR","en-PW":"PW","en-RW":"RW","en-SB":"SB",
  "en-SC":"SC","en-SD":"SD","en-SG":"SG","en-SH":"SH","en-SL":"SL",
  "en-SS":"SS","en-SX":"SX","en-SZ":"SZ","en-TC":"TC","en-TK":"TK",
  "en-TO":"TO","en-TT":"TT","en-TV":"TV","en-TZ":"TZ","en-UG":"UG",
  "en-UM":"UM","en-US":"US","en-VC":"VC","en-VG":"VG","en-VI":"VI",
  "en-VU":"VU","en-WS":"WS","en-ZA":"ZA","en-ZM":"ZM","en-ZW":"ZW",
  "es-AR":"AR","es-BO":"BO","es-BZ":"BZ","es-CL":"CL","es-CO":"CO",
  "es-CR":"CR","es-CU":"CU","es-DO":"DO","es-EC":"EC","es-EH":"EH",
  "es-ES":"ES","es-GQ":"GQ","es-GT":"GT","es-HN":"HN","es-MX":"MX",
  "es-NI":"NI","es-PA":"PA","es-PE":"PE","es-PR":"PR","es-PY":"PY",
  "es-SV":"SV","es-UY":"UY","es-VE":"VE","et-EE":"EE","fa-IR":"IR",
  "ff-BF":"BF","ff-GN":"GN","fi-FI":"FI","fj-FJ":"FJ","fo-FO":"FO",
  "fr-BE":"BE","fr-BF":"BF","fr-BI":"BI","fr-BJ":"BJ","fr-BL":"BL",
  "fr-CA":"CA","fr-CD":"CD","fr-CF":"CF","fr-CG":"CG","fr-CH":"CH",
  "fr-CI":"CI","fr-CM":"CM","fr-DJ":"DJ","fr-FR":"FR","fr-GA":"GA",
  "fr-GF":"GF","fr-GG":"GG","fr-GN":"GN","fr-GP":"GP","fr-GQ":"GQ",
  "fr-HT":"HT","fr-JE":"JE","fr-KM":"KM","fr-LB":"LB","fr-LU":"LU",
  "fr-MC":"MC","fr-MF":"MF","fr-MG":"MG","fr-ML":"ML","fr-MQ":"MQ",
  "fr-NC":"NC","fr-NE":"NE","fr-PF":"PF","fr-PM":"PM","fr-RE":"RE",
  "fr-RW":"RW","fr-SC":"SC","fr-SN":"SN","fr-TD":"TD","fr-TF":"TF",
  "fr-TG":"TG","fr-VA":"VA","fr-VU":"VU","fr-WF":"WF","fr-YT":"YT",
  "ga-IE":"IE","gn-PY":"PY","gv-IM":"IM","he-IL":"IL","hi-IN":"IN",
  "hr-BA":"BA","hr-HR":"HR","hr-ME":"ME","ht-HT":"HT","hu-HU":"HU",
  "hy-AM":"AM","id-ID":"ID","is-IS":"IS","it-CH":"CH","it-IT":"IT",
  "it-SM":"SM","it-VA":"VA","ja-JP":"JP","ka-GE":"GE","kk-KZ":"KZ",
  "kl-GL":"GL","km-KH":"KH","ko-KP":"KP","ko-KR":"KR","ku-IQ":"IQ",
  "ky-KG":"KG","lb-LU":"LU","ln-CD":"CD","ln-CG":"CG","lo-LA":"LA",
  "lt-LT":"LT","lv-LV":"LV","mg-MG":"MG","mh-MH":"MH","mk-MK":"MK",
  "mn-MN":"MN","ms-BN":"BN","ms-MY":"MY","ms-SG":"SG","mt-MT":"MT",
  "my-MM":"MM","na-NR":"NR","nb-NO":"NO","nd-ZW":"ZW","ne-NP":"NP",
  "nl-AW":"AW","nl-BE":"BE","nl-BQ":"BQ","nl-CW":"CW","nl-NL":"NL",
  "nl-SR":"SR","nl-SX":"SX","nn-NO":"NO","no-NO":"NO","no-SJ":"SJ",
  "nr-ZA":"ZA","ny-MW":"MW","pl-PL":"PL","ps-AF":"AF","pt-AO":"AO",
  "pt-BR":"BR","pt-CV":"CV","pt-GW":"GW","pt-MO":"MO","pt-MZ":"MZ",
  "pt-PT":"PT","pt-ST":"ST","pt-TL":"TL","ro-MD":"MD","ro-RO":"RO",
  "ru-AQ":"AQ","ru-BY":"BY","ru-KG":"KG","ru-KZ":"KZ","ru-RU":"RU",
  "ru-TJ":"TJ","ru-TM":"TM","ru-UZ":"UZ","rw-RW":"RW","si-LK":"LK",
  "sk-SK":"SK","sl-SI":"SI","sm-AS":"AS","sm-WS":"WS","sn-ZW":"ZW",
  "so-SO":"SO","sq-AL":"AL","sr-BA":"BA","sr-ME":"ME","sr-RS":"RS",
  "ss-SZ":"SZ","ss-ZA":"ZA","st-LS":"LS","st-ZA":"ZA","sv-AX":"AX",
  "sv-FI":"FI","sv-SE":"SE","sw-CD":"CD","sw-KE":"KE","sw-TZ":"TZ",
  "sw-UG":"UG","ta-LK":"LK","tg-TJ":"TJ","th-TH":"TH","ti-ER":"ER",
  "tk-TM":"TM","tn-BW":"BW","tn-ZA":"ZA","to-TO":"TO","tr-CY":"CY",
  "tr-TR":"TR","ts-ZA":"ZA","uk-UA":"UA","ur-PK":"PK","uz-UZ":"UZ",
  "ve-ZA":"ZA","vi-VN":"VN","xh-ZA":"ZA","zh-CN":"CN","zh-HK":"HK",
  "zh-MO":"MO","zh-SG":"SG","zh-TW":"TW","zu-ZA":"ZA",
};

// Add some locales that were dropped or have special mappings
LOCALE_TO_COUNTRY["fan-GQ"] = "GQ";
LOCALE_TO_COUNTRY["kun-ER"] = "ER";
LOCALE_TO_COUNTRY["la-VA"] = "VA";
LOCALE_TO_COUNTRY["mi-NZ"] = "NZ";
LOCALE_TO_COUNTRY["nrb-ER"] = "ER";
LOCALE_TO_COUNTRY["rar-CK"] = "CK";
LOCALE_TO_COUNTRY["rm-CH"] = "CH";
LOCALE_TO_COUNTRY["rn-BI"] = "BI";
LOCALE_TO_COUNTRY["rtm-FJ"] = "FJ";
LOCALE_TO_COUNTRY["sg-CF"] = "CF";
LOCALE_TO_COUNTRY["ssy-ER"] = "ER";
LOCALE_TO_COUNTRY["tig-ER"] = "ER";

module.exports = LOCALE_TO_COUNTRY;
