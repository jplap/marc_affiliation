let http = require('http');
var app = require('./app');
let port = process.env.PORT || 8686;
var httpServer = http.createServer( app);
require = require("esm")(module/* , options */)
console.log ("server: listen port:"+ port)
httpServer.listen(port);


