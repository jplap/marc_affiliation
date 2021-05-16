var path = require('path');
const dotenv = require("dotenv");

var PREFIX = "affilaeController: ";
var request = require('request');

var direnv = path.join(__dirname, '..', 'config.env')
console.log(PREFIX +" direnv: " + direnv);
dotenv.config({path: direnv});


var AFFILAE_USER = process.env.AFFILAE_USER;
var AFFILAE_PWD = process.env.AFFILAE_PWD;


advertiserCaller = function(){
    return new Promise( ( resolve, reject ) => {
        try {
            var username = AFFILAE_USER;
            var password = AFFILAE_PWD;

            var auth = "Basic " + new Buffer(username + ":" + password).toString("base64");
            request.get('https://api.affilae.com/2.0/advertiser', {
                headers: {
                    "Authorization": auth
                }
            }, function (error, response, body) {
                if (error) {
                    console.log(PREFIX + error)

                    reject(error);
                    //res.status(500).send('affilae response failed');
                } else {

                    resolve(response);
                    //res.status(200).send(response.body);
                }


            });
        }catch(err){
            console.log(PREFIX + " request failed err: " + err);
        }


    } );
}

exports.advertiser = function (req, res) {
    this.advertiserCaller().then((response) => {
        if (response.headers['content-type']) {
            res.setHeader('content-type', response.headers['content-type']);
        }
        if (response.headers['transfer-encoding']) {
            res.setHeader('transfer-encoding', response.headers['transfer-encoding']);
        }
        console.log(PREFIX + " affilae response successfull");
        res.status(200).send(response.body);
    }, function(erreur) {
        res.status(500).send('affilae response failed');
    })



}

/*exports.advertiser = function (req, res) {
    //var username = '5f85bcee6c7218455e78823c';
    //var password = 'b67878ddecd4066b75f9f035ed80429d';
    var username = AFFILAE_USER;
    var password = AFFILAE_PWD;

    var auth = "Basic " + new Buffer(username + ":" + password).toString("base64");
    request.get('https://api.affilae.com/2.0/advertiser', {
        headers: {
            "Authorization": auth
        }
    }, function (error, response, body) {
        if (error) {
            console.log(PREFIX + error)
            console.log(PREFIX + " affilae response failed");
            res.status(500).send('affilae response failed');
        } else {
            if (response.headers['content-type']) {
                res.setHeader('content-type', response.headers['content-type']);
            }
            if (response.headers['transfer-encoding']) {
                res.setHeader('transfer-encoding', response.headers['transfer-encoding']);
            }
            res.status(200).send(response.body);
        }


    });
}*/

