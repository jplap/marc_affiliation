var path = require('path');
const dotenv = require("dotenv");

var PREFIX = "affilaeController: ";
var request = require('request');
//import {affilaeDriver} from "./affilaeDriver";
var affilaeDriver = require('../controllers/affilaeDriver');


exports.advertiser = function (req, res) {
    affilaeDriver.programListCaller().then((response) => {
        if (response.headers['content-type']) {
            res.setHeader('content-type', response.headers['content-type']);
        }
        if (response.headers['transfer-encoding']) {
            res.setHeader('transfer-encoding', response.headers['transfer-encoding']);
        }
        console.log(PREFIX + " affilae response successfull");
        res.status(200).send(response.body);
    }, function (erreur) {
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

