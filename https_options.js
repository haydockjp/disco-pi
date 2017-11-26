// Dependancies
const fs = require('fs')
, constants = require('constants')
;

const https_options = {
    key: fs.readFileSync('certs/disco-pi-key.pem', 'utf8'),
    cert: fs.readFileSync('certs/disco-pi-cert.pem', 'utf8'),
    secureProtocol: 'SSLv23_method',
    secureOptions: constants.SSL_OP_NO_SSLv3 | constants.SSL_OP_NO_SSLv2,
    ciphers: [
	"ECDHE-RSA-AES256-SHA384",
	"DHE-RSA-AES256-SHA384",
	"ECDHE-RSA-AES256-SHA256",
	"DHE-RSA-AES256-SHA256",
	"ECDHE-RSA-AES128-SHA256",
	"DHE-RSA-AES128-SHA256",
	"HIGH",
	"!aNULL",
	"!eNULL",
	"!EXPORT",
	"!DES",
	"!RC4",
	"!MD5",
	"!PSK",
	"!SRP",
	"!CAMELLIA"
    ].join(':'),
    honorCipherOrder: true,
    dhparams: fs.readFileSync('certs/dh_2048.pem', 'utf8')
}

module.exports = https_options;
