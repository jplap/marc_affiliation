const path = require('path');
const dotenv = require("dotenv");
const moment = require("moment");

const PREFIX = "affilaeDriver: ";
const request = require('request');
const fs = require('fs');

const direnv = path.join(__dirname, '..', 'config.env');
console.log(PREFIX +" config path: " + direnv);
dotenv.config({path: direnv});

const affilaeDriver = require('../controllers/affilaeDriver');
const AFFILAE_USER = process.env.AFFILAE_USER;
const AFFILAE_PWD = process.env.AFFILAE_PWD;

const AFFILAE_CAPTURE = process.env.AFFILAE_CAPTURE;

const mkdirSync = function (dirPath) {
    try {
        fs.mkdirSync(dirPath)
    } catch (err) {
        if (err.code !== "EEXIST") throw err
    }
}
var snoopperDir = "";
let snoopperAdvertiserFilePath = "";
let snoopperAdvertiserConversionFilePath = "";
let snoopperAdvertiserConversionLimitFilePath = "";
let snoopperAdvertiserConversionByIdFilePath = "";
let snoopperAdvertiserConversionAddFilePath = "";
if ( AFFILAE_CAPTURE == "true" ) {

    var formattedDate = moment(new Date()).format('YYYY-MM-DD_HH-mm-ss');
    snoopperDir = path.join(__dirname, '..', "log","affilae_capture_" + formattedDate);
    console.log( PREFIX + "Directory capture path:" + snoopperDir)
    mkdirSync(snoopperDir);
    snoopperAdvertiserFilePath = path.join(snoopperDir, 'list');
    snoopperAdvertiserConversionFilePath = path.join(snoopperDir, 'conversion');
    snoopperAdvertiserConversionLimitFilePath = path.join(snoopperDir, 'conversionLimit');
    snoopperAdvertiserConversionByIdFilePath = path.join(snoopperDir, 'conversionById');
    snoopperAdvertiserConversionAddFilePath = path.join(snoopperDir, 'conversionAdd');
}

function snooperAdd ( snooperPath, verb, url, request, response, error ){

    if ( AFFILAE_CAPTURE == "true" ) {
        var snoopperData = {}
        snoopperData.url = url;
        if (verb){
            snoopperData.verb = verb;
        }
        if (request){
            snoopperData.request = request;
        }

        if ( error ) {
            snoopperData.error = error;
        }else{
            snoopperData.response = {};
            snoopperData.response.body = JSON.parse(response.body);
            snoopperData.response.statusCode = response.statusCode
        }

        var formattedDate = moment(new Date()).format('YYYY-MM-DD_HH-mm-ss');
        var filePath = snooperPath + "_" + formattedDate

        fs.writeFile(filePath, JSON.stringify(snoopperData), function (err) {
            if (err) throw err;
            console.log(PREFIX + 'file ' + filePath + ' created');
        });
    }
}

exports.programListCaller = function (){
        return new Promise( ( resolve, reject ) => {
            try {

                const url = "https://api.affilae.com/2.0/advertiser";
                const username = AFFILAE_USER;
                const password = AFFILAE_PWD;

                let verb = "GET";

                const auth = "Basic " + new Buffer(username + ":" + password).toString("base64");
                request.get(url, {
                    headers: {
                        "Authorization": auth
                    }
                }, function (error, response, body) {
                    if (error) {
                        console.log(PREFIX + error);
                        snooperAdd(snoopperAdvertiserFilePath, verb,url,  null ,null, error  );


                        reject(error);
                        //res.status(500).send('affilae response failed');
                    } else {

                        snooperAdd(snoopperAdvertiserFilePath, verb,url, null ,response, null  );

                        resolve(response);
                        //res.status(200).send(response.body);
                    }


                });
            }catch(err){
                console.log(PREFIX + " list request failed err: " + err);
            }


        } );
    }

exports.conversionsListCaller = function ( programId, limit ){


    const p1 = new Promise((resolve, reject) => {
        try {
            var username = AFFILAE_USER;
            var password = AFFILAE_PWD;

            var url = 'https://api.affilae.com/2.0/advertiser/' + programId + '/conversions?count=1'

            let verb = "GET";

            var auth = "Basic " + new Buffer(username + ":" + password).toString("base64");
            request.get(url, {
                headers: {
                    "Authorization": auth
                }
            }, function (error, response, body) {
                if (error) {
                    console.log(PREFIX + error)
                    snooperAdd(snoopperAdvertiserConversionFilePath, verb,url, null ,null, error  );
                    reject(error);
                    //res.status(500).send('affilae response failed');
                } else {

                        snooperAdd(snoopperAdvertiserConversionFilePath, verb,url, null ,response, null  );
                        affilaeDriver.conversionsListWithLimitCaller(programId, response.body).then((resp) => {
                        resolve(resp);
                    }, function (erreur) {
                        reject(erreur);
                    })
                    //res.status(200).send(response.body);
                }


            });
        } catch (error) {
            console.log(PREFIX + " conversion request failed : " + error);
            reject(error);
        }


    });


    return Promise.all([
           p1.catch(error => {
               return(error); }),
           /*p2.catch(error => {
               return(error); }),*/
       ]).then(values => {
           //console.log(values[0]); // "p1_resolution_retardee"
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
                const username = AFFILAE_USER;
                const password = AFFILAE_PWD;

                const url = 'https://api.affilae.com/2.0/advertiser/' + programId + '/conversions?limit=' + limit;
                let verb = "GET";
                const auth = "Basic " + new Buffer(username + ":" + password).toString("base64");
                request.get(url, {
                    headers: {
                        "Authorization": auth
                    }
                }, function (error, response, body) {
                    if (error) {
                        console.log(PREFIX + error)
                        snooperAdd(snoopperAdvertiserConversionLimitFilePath, verb,url,null , null, error  );
                        reject(error);
                        //res.status(500).send('affilae response failed');
                    } else {
                        snooperAdd(snoopperAdvertiserConversionLimitFilePath, verb,url, null ,response, null  );
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
                const username = AFFILAE_USER;
                const password = AFFILAE_PWD;

                const url = 'https://api.affilae.com/2.0/advertiser/' + programId + '/conversions/' + id;
                let verb = "GET";
                const auth = "Basic " + new Buffer(username + ":" + password).toString("base64");
                request.get(url, {
                    headers: {
                        "Authorization": auth
                    }
                }, function (error, response, body) {
                    if (error) {
                        console.log(PREFIX + error)
                        snooperAdd(snoopperAdvertiserConversionByIdFilePath, verb,url,null , null, error  );
                        reject(error);
                        //res.status(500).send('affilae response failed');
                    } else {
                        snooperAdd(snoopperAdvertiserConversionByIdFilePath, verb,url, null ,response, null  );
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
                const username = AFFILAE_USER;
                const password = AFFILAE_PWD;


                var reqBody = {}
                reqBody.identifier = id;
                reqBody.partnership_id = partnership_id;
                reqBody.amount = amount;
                reqBody.commission = commission;
                reqBody.rule_id = rule_Id;

                let verb = "POST";

                const url = 'https://api.affilae.com/2.0/advertiser/' + programId + '/conversions/add';

                const auth = "Basic " + new Buffer(username + ":" + password).toString("base64");
                request.post(url, {
                    headers: {
                        "Authorization": auth,
                        'Content-Type': 'application/json'
                    },
                    body:JSON.stringify(reqBody)
                }, function (error, response, body) {
                    if (error) {
                        console.log(PREFIX + " add conversio failed: " + error)
                        snooperAdd(snoopperAdvertiserConversionAddFilePath, verb,url,JSON.stringify(reqBody) , null, error  );
                        reject(error);
                        //res.status(500).send('affilae response failed');
                    } else {
                        console.log(PREFIX + " add conversion sucessfuly: " + JSON.stringify(response));
                        snooperAdd(snoopperAdvertiserConversionAddFilePath, verb,url, JSON.stringify(reqBody) ,response, null  );
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




