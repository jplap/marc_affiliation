var path = require('path');
const dotenv = require("dotenv");

var PREFIX = "affilaeDriver: ";
var request = require('request');

var direnv = path.join(__dirname, '..', 'config.env')
console.log(PREFIX +" direnv: " + direnv);
dotenv.config({path: direnv});

var affilaeDriver = require('../controllers/affilaeDriver');
var AFFILAE_USER = process.env.AFFILAE_USER;
var AFFILAE_PWD = process.env.AFFILAE_PWD;





exports.programListCaller = function (){
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

exports.conversionsListCaller = function ( programId, limit ){


        var p1 = new Promise( ( resolve, reject ) => {
            try {
                var username = AFFILAE_USER;
                var password = AFFILAE_PWD;

                var url = 'https://api.affilae.com/2.0/advertiser/' + programId +'/conversions?count=1'

                var auth = "Basic " + new Buffer(username + ":" + password).toString("base64");
                request.get(url, {
                    headers: {
                        "Authorization": auth
                    }
                }, function (error, response, body) {
                    if (error) {
                        console.log(PREFIX + error)

                        reject(error);
                        //res.status(500).send('affilae response failed');
                    } else {


                        affilaeDriver.conversionsListWithLimitCaller(programId, response.body ).then((resp) => {
                            resolve(resp);
                        }, function (erreur) {
                            reject(erreur);
                        })
                        //res.status(200).send(response.body);
                    }


                });
            }catch(error){
                console.log(PREFIX + " conversion request failed : " + error);
                reject(error);
            }


        })



       return Promise.all([
           p1.catch(error => {
               return(error); }),
           /*p2.catch(error => {
               return(error); }),*/
       ]).then(values => {
           console.log(values[0]); // "p1_resolution_retardee"
           /*console.log(values[1]); // "Error: p2_rejet_immediat"
           if ( values[0] && values[0].body && values[1] ){
               values[1].count = values[0].body;
            }
           //resolve(values[1]);
           return (values[1]);*/
           return (values[0])
       })




   }





exports.conversionsListWithLimitCaller = function ( programId, limit ){




        return new Promise( ( resolve, reject ) => {
            try {
                var username = AFFILAE_USER;
                var password = AFFILAE_PWD;

                var url = 'https://api.affilae.com/2.0/advertiser/' + programId +'/conversions?limit=' + limit

                var auth = "Basic " + new Buffer(username + ":" + password).toString("base64");
                request.get(url, {
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
                console.log(PREFIX + " conversion request failed : " + err);
                resolve(err);
            }


        } );
    }

exports.conversionsByIdCaller = function ( programId, id ){
        return new Promise( ( resolve, reject ) => {
            try {
                var username = AFFILAE_USER;
                var password = AFFILAE_PWD;

                var url = 'https://api.affilae.com/2.0/advertiser/' + programId +'/conversions/' + id

                var auth = "Basic " + new Buffer(username + ":" + password).toString("base64");
                request.get(url, {
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
                console.log(PREFIX + " conversion by id request failed : " + err);
            }


        } );
    }

exports.addConversionCaller = function ( programId, id, partnership_id, amount, commission, rule_Id ){
        return new Promise( ( resolve, reject ) => {
            try {
                var username = AFFILAE_USER;
                var password = AFFILAE_PWD;


                var body = {}
                body.identifier = id;
                body.partnership_id = partnership_id;
                body.amount = amount;
                body.commission = commission;
                body.rule_id = rule_Id;




                var url = 'https://api.affilae.com/2.0/advertiser/' + programId +'/conversions/add'

                var auth = "Basic " + new Buffer(username + ":" + password).toString("base64");
                request.post(url, {
                    headers: {
                        "Authorization": auth,
                        'Content-Type': 'application/json'
                    },
                    body:JSON.stringify(body)
                }, function (error, response, body) {
                    if (error) {
                        console.log(PREFIX + " add conversio failed: " + error)

                        reject(error);
                        //res.status(500).send('affilae response failed');
                    } else {
                        console.log(PREFIX + " add conversion sucessfuly: " + JSON.stringify(response));
                        resolve(response);
                        //res.status(200).send(response.body);
                    }


                });
            }catch(err){
                console.log(PREFIX + " add conversion request failed : " + err);


                reject(err);
            }


        } );
    }

    /*exports.advertiser = function (req, res) {
        this.programListCaller().then((response) => {
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



    }*/




