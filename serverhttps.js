var https = require('https');
var fs = require('fs')
var app = require('./app');

var options = {
    //key: fs.readFileSync('hostkey.pem'),
    //cert: fs.readFileSync('hostcert.pem')
    key: fs.readFileSync(__dirname+ '/server.key'),
    cert: fs.readFileSync(__dirname+'/server.cert')
};


let port = 8686;
var httpsServer = https.createServer(options, app);
require = require("esm")(module/* , options */)
console.log ("listen port:"+ port)
httpsServer.listen(port);