var express = require('express');
var router = express.Router();
var request = require('request');

const https = require('https');
var PREFIX = "affilaeRouter: "

//advertiser -> Liste les programmes disponibles

router.get('/advertiser', function (req, res, next) {
    var username = '5f85bcee6c7218455e78823c';
    var password = 'b67878ddecd4066b75f9f035ed80429d';

    var auth = "Basic " + new Buffer(username + ":" + password).toString("base64");
    request.get('https://api.affilae.com/2.0/advertiser', {
        headers: {
            "Authorization": auth
        }
    }, function (error, response, body) {
        if (error) {
            console.log(error)
            console.log("affilae response failed");
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
})

//Détails du programme


// Liste des conversions

module.exports = router;
