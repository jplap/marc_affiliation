//const connection = mysql.createConnection({host: process.env.DB_HOST, user: process.env.DB_USER, password: process.env.DB_PASSWORD, DBDriver: process.env.DB_NAME, connectionLimit: 5});
//import {Database} from "./Database";

import dotenv from "dotenv";

const mysql = require('mysql');
const path = require('path');
const direnv = path.join(__dirname, '..', 'config.env');
console.log(PREFIX + "direnv: " + direnv);
dotenv.config({path: direnv});

console.log("DB_HOST: " + process.env.DB_HOST);
console.log("DB_USER: " + process.env.DB_USER);
console.log("DB_TABLE_IDFORM: " + process.env.DB_TABLE_IDFORM);
console.log("DB_TABLE_IDFORM_HISTORY: " + process.env.DB_TABLE_IDFORM_HISTORY);

const DB_TABLE_IDFORM = process.env.DB_TABLE_IDFORM;
const DB_TABLE_IDFORM_HISTORY = process.env.DB_TABLE_IDFORM_HISTORY;

var PREFIX = "DBDriver: ";

class DBDriver {
    constructor() {
        this.config = {
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            connectionLimit: 5
        }
        //this.database = new Database( this.config )
        this.connection = mysql.createConnection(this.config);

    }
    DBDriver_escape ( str ){
        return this.escape(str);
    }


    DBDriver_addFormId(options /* identifier, programId, status, theStrValue, escProram, historyChildExist*/) {
        return new Promise((resolve, reject) => {
            try {
                let history = 0;
                if (options.historyChildExist === true) {
                    history = 1;
                }
                const created_at = options.created_at; //new Date("July 1, 1978 02:30:00");
                /*if (options.created_at) {
                    created_at = new Date(options.created_at * 1000).toLocaleDateString();
                }*/
                //dbQueryStarted = dbQueryStarted + 1;
                const insertStr = "INSERT INTO " + DB_TABLE_IDFORM + " (formid,programTitle,programId,state,historyChild,affilae_data,creation_date)" + " VALUES ('" + options.identifier + "'," + options.escProram + ",'" + options.programId + "'," + 0 + "," + history + ",'" + options.theStrValue + "'," + created_at + ")";
                this.query( insertStr )
                    .then(rows => {

                        resolve(rows);


                    }, function (erreur) {
                        console.log(PREFIX + " insert request failed : " + erreur)
                        console.log(PREFIX + " insert request failed insertStr: " + insertStr);
                        reject(erreur);
                    })

            } catch (err) {
                console.log(PREFIX + " insert request failed : " + err);
                reject(err);
            }
        });
    }



    DBDriver_iSChildExistInHistory ( id, options ){
        return new Promise( ( resolve, reject ) => {
            try {


                const SQLCheckHistory = "SELECT formid_original FROM " + DB_TABLE_IDFORM_HISTORY + " WHERE formid_original = '" + id + "'";
                console.log( "SQLCheckHistory: " + SQLCheckHistory );
                this.query(SQLCheckHistory)
                    .then(rows => {
                        let status = false;
                        if ( rows && rows.length === 0 ){
                            console.log(PREFIX + "DBDriver_iSChildExistInHistory id: " + id + " FALSE in history table");
                        }else{
                            console.log(PREFIX + "DBDriver_iSChildExistInHistory id: " + id + " TRUE in history table\"");
                            status  = true;
                        }
                        options.historyChildExist = status;
                        resolve(options);


                    }, function (error) {


                        console.log(PREFIX + "DBDriver_iSChildExistInHistory history select failed: " + JSON.stringify(error));
                        reject(error);

                    })




            }catch(err){
                console.log(PREFIX + " conversion request failed : " + err);
                reject(err);
            }


        } );
    }
    DBDriver_findInHistory ( id ){
        return new Promise( ( resolve, reject ) => {
            try {


                const SQLSelectHistory = 'SELECT * FROM ' + DB_TABLE_IDFORM_HISTORY + ' WHERE ' + " formid_original = '" + id + "'";
                console.log( "DBDriver_findInHistory: " + SQLSelectHistory );
                this.query(SQLSelectHistory)
                    .then(rows => {

                        resolve(rows);


                    }, function (error) {


                        console.log(PREFIX + "DBDriver_iSChildExistInHistory history select failed: " + JSON.stringify(error));
                        reject(error);

                    })




            }catch(err){
                console.log(PREFIX + " conversion request failed : " + err);
                reject(err);
            }


        } );
    }
    DBDriver_fetchFormTable (  ){



        return new Promise( ( resolve, reject ) => {
            try {


                const SQLSelectFormTable = 'SELECT * FROM ' + DB_TABLE_IDFORM;
                console.log( "DBDriver_fetchFormTable: " + SQLSelectFormTable );
                this.query(SQLSelectFormTable)
                    .then(rows => {

                        resolve(rows);


                    }, function (error) {


                        console.log(PREFIX + "SQLSelectFormTable history select failed: " + JSON.stringify(error));
                        reject(error);

                    })




            }catch(err){
                console.log(PREFIX + " conversion request failed : " + err);
                reject(err);
            }


        } );

    }

    DBDriver_deleteFormTable ( id ){



        return new Promise( ( resolve, reject ) => {
            try {


                const SQL_deleteFormTable = 'DELETE FROM ' + DB_TABLE_IDFORM + ' WHERE ' + ' id = ' + id;
                console.log( "DBDriver_fetchFormTable: " + SQL_deleteFormTable );
                this.query(SQL_deleteFormTable)
                    .then(rows => {

                        resolve(rows);


                    }, function (error) {


                        console.log(PREFIX + "DBDriver_deleteFormTable history select failed: " + JSON.stringify(error));
                        reject(error);

                    })




            }catch(err){
                console.log(PREFIX + " conversion request failed : " + err);
                reject(err);
            }


        } );

    }
    DBDriver_addInHistory ( id, theNewFormId, theStrValue ){



        return new Promise( ( resolve, reject ) => {
            try {

                const SQLInsertHistory = "INSERT INTO " + DB_TABLE_IDFORM_HISTORY + " (formid_original,formid,affilae_conversion)" + " VALUES ('" + id + "','" + theNewFormId + "','" + theStrValue + "')";

                console.log( "DBDriver_addInHistory: " + SQLInsertHistory );
                this.query(SQLInsertHistory)
                    .then(rows => {

                        resolve(rows);


                    }, function (error) {


                        console.log(PREFIX + "DBDriver_addInHistory history select failed: " + JSON.stringify(error));
                        reject(error);

                    })




            }catch(err){
                console.log(PREFIX + " DBDriver_addInHistory request failed : " + err);
                reject(err);
            }


        } );

    }
    DBDriver_updateState ( id, newstatus ){



        return new Promise( ( resolve, reject ) => {
            try {

                const SQLUpdate = 'UPDATE ' + DB_TABLE_IDFORM + ' SET state = ' + newstatus + ' WHERE ' + " formid = '" + id + "'";

                console.log( "DBDriver_updateState: " + SQLUpdate );
                this.query(SQLUpdate)
                    .then(rows => {

                        resolve(rows);


                    }, function (error) {


                        console.log(PREFIX + "DBDriver_updateState history select failed: " + JSON.stringify(error));
                        reject(error);

                    })




            }catch(err){
                console.log(PREFIX + " DBDriver_updateState request failed : " + err);
                reject(err);
            }


        } );

    }
    DBDriver_updateHistoryChild( id, newstatus ){



        return new Promise( ( resolve, reject ) => {
            try {

                const SQLUpdate = 'UPDATE ' + DB_TABLE_IDFORM + ' SET historyChild = ' + newstatus + ' WHERE ' + " formid = '" + id + "'";

                console.log( "DBDriver_updateHistoryChild: " + SQLUpdate );
                this.query(SQLUpdate)
                    .then(rows => {

                        resolve(rows);


                    }, function (error) {


                        console.log(PREFIX + "DBDriver_updateHistoryChild history select failed: " + JSON.stringify(error));
                        reject(error);

                    })




            }catch(err){
                console.log(PREFIX + " DBDriver_updateHistoryChild request failed : " + err);
                reject(err);
            }


        } );

    }
    escape(str) {
        return mysql.escape(str);
    }

    query(sql, args) {

        return new Promise((resolve, reject) => {
            this.connection.query(sql, args, (err, rows) => {
                if (err)
                    return reject(err);
                resolve(rows);
            });
        });

    }

    close() {
        return new Promise((resolve, reject) => {
            this.connection.end(err => {
                if (err)
                    return reject(err);
                resolve();
            });
        });
    }


}

export {DBDriver};
