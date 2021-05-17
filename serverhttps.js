var https = require('https');
var fs = require('fs')
var app = require('./app');

var options = {
    //key: fs.readFileSync('hostkey.pem'),
    //cert: fs.readFileSync('hostcert.pem')
    key: fs.readFileSync(__dirname+ '/server.key'),
    cert: fs.readFileSync(__dirname+'/server.cert')
};

var port = process.env.PORT || 8686;


var httpsServer = https.createServer(options, app);
require = require("esm")(module/* , options */)

httpsServer.listen(port,function(){
    console.log('Server running at http://127.0.0.1:' + port + '/');
})
