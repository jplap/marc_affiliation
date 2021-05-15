const dotenv = require("dotenv");
var mariadb = require('mariadb');
var mysql = require('mysql');
var path = require('path');
import {Database} from "./Database";

//var direnv = __dirname + '/../config.env'
var direnv = path.join(__dirname, '..', 'config.env')
console.log("direnv: " + direnv);
dotenv.config({path: direnv});

console.log("DB_HOST: " + process.env.DB_HOST);
console.log("DB_USER: " + process.env.DB_USER);
console.log("DB_TABLE: " + process.env.DB_TABLE);

var DB_TABLE = process.env.DB_TABLE;
//const pool = mariadb.createPool({host: process.env.DB_HOST, user: process.env.DB_USER, password: process.env.DB_PASSWORD, database: process.env.DB_NAME, connectionLimit: 5});
//const connection = mysql.createConnection({host: process.env.DB_HOST, user: process.env.DB_USER, password: process.env.DB_PASSWORD, database: process.env.DB_NAME, connectionLimit: 5});


var database = new Database({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    connectionLimit: 5
})


const https = require('https');
var PREFIX = "idController: ";


exports.fetch = function (req, res) {
    console.log(PREFIX + "fetch");

    let someRows, otherRows;

    database.query('SELECT * FROM ' + DB_TABLE)
        .then(rows => {

            var cc = JSON.stringify(rows);
            //database.close();
            var results = {}
            results.results = JSON.parse(cc)

            console.log(PREFIX + "fetch result: " + JSON.stringify(results));
            res.send(results);


        })


}

exports.delete = function (req, res) {
    const idToDelete = req.params.id;
    var operationStatus = false;


    database.query('DELETE FROM ' + DB_TABLE + ' WHERE ' + " id = " + idToDelete)
        .then(rows => {
            operationStatus = true;
            if (operationStatus == false) {
                console.log(PREFIX + "delete id:" + idToDelete + " failed")
                res.status(204);
            } else {

                console.log(PREFIX + "delete id:" + idToDelete)
            }
            res.send();

        })


}

exports.add = function (req, res) {
    var data = req.body;
    if (data && !data[0].status) {
        data[0].status = 0;
    }
    //var size = Object.keys(data);
    if (data != null && data.length > 0) {
        foo.results.push(data[0]);
    }

    database.query("INSERT INTO " + DB_TABLE + " (formid,name,state)" + " VALUES ('" + data[0].id + "','" + data[0].name + "'," + 0 + ")")
        .then(rows => {
            console.log(PREFIX + "add done")
            res.send();

        })


    res.send();

}
exports.setStatus = function (req, res) {

    const id = req.params.id;
    const newstatus = req.params.status;

    var j = 0

    database.query('UPDATE ' + DB_TABLE + ' SET state = ' + newstatus + ' WHERE ' + " id = " + id)
        .then(rows => {


            console.log(PREFIX + "setStatus : " + newstatus + " on id:" + id)
            res.send();

        })


}

exports.action = function (req, res) {
    var data = req.body;
    var operationStatus = false;
    var id = -1;

    if (data && !data.id) {
        //nothing to do
        console.log(PREFIX + "action failed")
        res.status(204);
        res.send();

    } else {
        id = data.id;
        var newstatus = 2;

        database.query('UPDATE ' + DB_TABLE + ' SET state = ' + newstatus + ' WHERE ' + " id = " + id)
            .then(rows => {


                console.log(PREFIX + "action : " + newstatus + " on id:" + id)
                res.send();

            })

    }


}
