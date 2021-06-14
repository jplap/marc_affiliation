let http = require('http');
var app = require('./app');
let port = 8686;
var httpServer = http.createServer( app);
require = require("esm")(module/* , options */)
console.log ("listen port:"+ port)
httpServer.listen(port);

