const dotenv = require("dotenv");


var path = require('path');
//import {Database} from "./Database";
import {DBDriver} from "./DBDriver";


var PREFIX = "idController: ";

/*//var direnv = __dirname + '/../config.env'
var direnv = path.join(__dirname, '..', 'config.env')
console.log(PREFIX + "direnv: " + direnv);
dotenv.config({path: direnv});

console.log("DB_HOST: " + process.env.DB_HOST);
console.log("DB_USER: " + process.env.DB_USER);
console.log("DB_TABLE_IDFORM: " + process.env.DB_TABLE_IDFORM);
console.log("DB_TABLE_IDFORM_HISTORY: " + process.env.DB_TABLE_IDFORM_HISTORY);

var DB_TABLE_IDFORM = process.env.DB_TABLE_IDFORM;
var DB_TABLE_IDFORM_HISTORY = process.env.DB_TABLE_IDFORM_HISTORY;*/


//const pool = mariadb.createPool({host: process.env.DB_HOST, user: process.env.DB_USER, password: process.env.DB_PASSWORD, database: process.env.DB_NAME, connectionLimit: 5});
//const connection = mysql.createConnection({host: process.env.DB_HOST, user: process.env.DB_USER, password: process.env.DB_PASSWORD, database: process.env.DB_NAME, connectionLimit: 5});


/*var database = new Database({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    connectionLimit: 5
})*/

var dbDriver = new DBDriver ();

/*function DBDriver_addFormId(options /!* identifier, programId, status, theStrValue, escProram, historyChildExist*!/) {
    return new Promise((resolve, reject) => {
        try {
            var history = 0
            if (options.historyChildExist == true) {
                history = 1;
            }
            var created_at = options.created_at; //new Date("July 1, 1978 02:30:00");
            /!*if (options.created_at) {
                created_at = new Date(options.created_at * 1000).toLocaleDateString();
            }*!/
            //dbQueryStarted = dbQueryStarted + 1;
            var insertStr = "INSERT INTO " + DB_TABLE_IDFORM + " (formid,programTitle,programId,state,historyChild,affilae_data,creation_date)" + " VALUES ('" + options.identifier + "'," + options.escProram + ",'" + options.programId + "'," + 0 + "," + history + ",'" + options.theStrValue + "'," + created_at + ")"
            database.query( insertStr )
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



function DBDriver_iSChildExistInHistory ( id, options ){
    return new Promise( ( resolve, reject ) => {
        try {


            var SQLCheckHistory = "SELECT formid_original FROM " + DB_TABLE_IDFORM_HISTORY + " WHERE formid_original = '" + id + "'";
            console.log( "SQLCheckHistory: " + SQLCheckHistory );
            database.query(SQLCheckHistory)
                .then(rows => {
                    var status = false;
                    if ( rows && rows.length === 0 ){
                        console.log(PREFIX + "DBDriver_iSChildExistInHistory id: " + id + " FALSE in history table");
                    }else{
                        console.log(PREFIX + "DBDriver_iSChildExistInHistory id: " + id + " TRUE in history table\"");
                        status  = true;
                    }
                    options.historyChildExist = status;
                    resolve(options);


                }, function (error) {


                    console.log(PREFIX + "DBDriver_iSChildExistInHistory history select failed: " + JSON.stringify(erreur));
                    reject(error);

                })




        }catch(err){
            console.log(PREFIX + " conversion request failed : " + err);
            reject(err);
        }


    } );
}*/

function isAlreadyInDB(databaseContent, affilaeIdentifier) {

    var flag = false;
    for (var j = 0; j < databaseContent.length; j++) {
        if (databaseContent[j].formid === affilaeIdentifier) {
            // Deja dans la base
            flag = true;
            break;
        } else {
            // pas encore dans la base

        }
    }
    console.log("isAlreadyInDB flag: " + flag + " for : " + affilaeIdentifier + " database lg: " + databaseContent.length );
    return flag

}

exports.synchronize = function (req, res) {
    console.log(PREFIX + "synchronize");

    var data = req.body;

    if (!data && !data.program || !data.program.title) {
        var ErrorBlk = {};
        ErrorBlk.msg = "No program tilte specified";
        result.info = ErrorBlk;
        res.setStatus(404).send(result);
    }
    var limit = 20;
    if ( data && data.limit ){
        limit = data.limit;
    }
    var currentProgramTitle = data.program.title;  //"Focus, L'école de préparation mentale"
    var programId = "";
    //var currentProgramId = "";
    var result = {};


    programListCaller().then((response) => {

        if (response.body) {

            var resp = JSON.parse(response.body);

            // Extraction du de l'id
            for (var i = 0; i < resp.length; i++) {
                if (resp[i].title === currentProgramTitle) {
                    programId = resp[i].id;
                }
            }


        }

        if (programId === "") {
            res.status(500).send('affilae response failed programId not found: ');

        }
        conversionsListCaller(programId, limit ).then((affilaeResponse) => {

            if (affilaeResponse && affilaeResponse.body) {
                var affilaeContent = JSON.parse(affilaeResponse.body);

                console.log("conversionsListCaller: " + affilaeResponse.body);
                var dbCounter = 0;
                var dbQueryStarted = 0;
                dbDriver.DBDriver_fetchFormTable()


                //database.query('SELECT * FROM ' + DB_TABLE_IDFORM)
                    .then(rows => {

                        var cc = JSON.stringify(rows);
                        //database.close();
                        var databaseContent = {}
                        databaseContent = JSON.parse(cc);

                        var nbrAffilaeBlk = affilaeContent.length;
                        var nbrDBBlkInitial = databaseContent.length;
                        var nbrBlkAdded = 0;

                        // Selection de ce qui n'est pas encore dans la base
                        var blkToAddInDB = [];
                        for (var i = 0; i < affilaeContent.length; i++) {
                            var stateDB = isAlreadyInDB(databaseContent, affilaeContent[i].identifier);
                            if (stateDB == false) {
                                blkToAddInDB.push(affilaeContent[i]);
                            }

                        }
                        console.log("nbr blk affilae:" + affilaeContent.length);
                        console.log("nbr blk not already in db:" + blkToAddInDB.length);

                        dbQueryStarted = blkToAddInDB.length;
                        // On met dans la base
                        if ( blkToAddInDB.length > 0 ) {
                            for (var i = 0; i < blkToAddInDB.length; i++) {


                                var escProram = "";
                                var theStrValue = "";
                                var identifier = "";
                                var created_at = "";

                                // pas encore dans la base
                                var MODE_BASIC = 1;



                                //if (MODE_BASIC == 1) {
                                    // Dans ce mode on fait une requete supplementaire
                                    var id = blkToAddInDB[i].id;
                                    conversionsByIdCaller(programId, id).then((affilaeConversionResponse) => {
                                        if (affilaeConversionResponse && affilaeConversionResponse.body) {
                                            var affilaeConversionById = JSON.parse(affilaeConversionResponse.body);

                                            escProram = dbDriver.DBDriver_escape(currentProgramTitle);
                                            theStrValue = affilaeConversionResponse.body;
                                            identifier = affilaeConversionById.identifier;

                                            if ( theStrValue ){
                                                var theStrValueStr = JSON.parse(theStrValue);
                                                if ( theStrValueStr && theStrValueStr.created_at){
                                                    created_at = theStrValueStr.created_at;
                                                }
                                            }
                                            var status = 0

                                            var options ={
                                                "escProram": escProram,
                                                "theStrValue" : theStrValue,
                                                "identifier" : identifier,
                                                "status" : status,
                                                "programId" : programId,
                                                "created_at" : created_at
                                            }



                                            dbDriver.DBDriver_iSChildExistInHistory(identifier, options )
                                                .then((opt) => {

                                                        console.log("historyChildExist: " + opt.historyChildExist );
                                                        dbDriver.DBDriver_addFormId ( opt )
                                                            .then((rows) => {
                                                                nbrBlkAdded++;
                                                                dbCounter = dbCounter + 1;
                                                                console.log(PREFIX + "mode 1. Insert done dbCounter: " + dbCounter + " dbQueryStarted: " + dbQueryStarted + " theStrValue:" + JSON.stringify(theStrValue));
                                                                if (dbCounter == dbQueryStarted) {
                                                                    console.log("on a finit et bien fini");
                                                                    var InfoBlk = {};
                                                                    InfoBlk.msg = "Database updated";
                                                                    InfoBlk.details = {};
                                                                    InfoBlk.details.DBInitialBlkNbr = nbrDBBlkInitial;
                                                                    InfoBlk.details.AffilaeBlkNbr = nbrAffilaeBlk;
                                                                    InfoBlk.details.DBBlkAdded = nbrBlkAdded;
                                                                    result.info = InfoBlk;
                                                                    res.status(200).send(result);
                                                                }

                                                            }, function (AddErreur) {

                                                                dbCounter = dbCounter + 1;

                                                                console.log(PREFIX + "mode 1. Insert Database Error dbCounter: " + dbCounter + " dbQueryStarted: " + dbQueryStarted + " Error: " + JSON.stringify(AddErreur));
                                                                if (dbCounter == dbQueryStarted) {
                                                                    console.log("on a finit et mal fini ");
                                                                    var InfoBlk = {};
                                                                    InfoBlk.msg = AddErreur;
                                                                    InfoBlk.details = {};
                                                                    InfoBlk.details.DBInitialBlkNbr = nbrDBBlkInitial;
                                                                    InfoBlk.details.AffilaeBlkNbr = nbrAffilaeBlk;
                                                                    InfoBlk.details.DBBlkAdded = nbrBlkAdded;
                                                                    result.info = InfoBlk;
                                                                    res.status(200).send(result);
                                                                }

                                                            })



                                                }, function (historyErreur) {
                                                    dbCounter = dbCounter + 1;

                                                    console.log(PREFIX + "mode 1. history Database Error dbCounter: " + dbCounter + " dbQueryStarted: " + dbQueryStarted + " Error: " + JSON.stringify(historyErreur));
                                                    if (dbCounter == dbQueryStarted) {
                                                        console.log("on a finit et mal fini history pb");
                                                        var InfoBlk = {};
                                                        InfoBlk.msg = historyErreur;
                                                        InfoBlk.details = {};
                                                        InfoBlk.details.DBInitialBlkNbr = nbrDBBlkInitial;
                                                        InfoBlk.details.AffilaeBlkNbr = nbrAffilaeBlk;
                                                        InfoBlk.details.DBBlkAdded = nbrBlkAdded;
                                                        result.info = InfoBlk;
                                                        res.status(200).send(result);
                                                    }

                                                })









/*                                            //dbQueryStarted = dbQueryStarted + 1;
                                            database.query("INSERT INTO " + DB_TABLE_IDFORM + " (formid,programTitle,programId,state,affilae_data)" + " VALUES ('" + identifier + "'," + escProram + ",'" + programId + "'," + 0 + ",'" + theStrValue + "')")
                                                .then(rows => {

                                                    nbrBlkAdded++;
                                                    dbCounter = dbCounter + 1;
                                                    console.log(PREFIX + "mode 1. Insert done dbCounter: " + dbCounter + " dbQueryStarted: " + dbQueryStarted + " theStrValue:" + JSON.stringify(theStrValue));
                                                    if (dbCounter == dbQueryStarted) {
                                                        console.log("on a finit et bien fini");
                                                        var InfoBlk = {};
                                                        InfoBlk.msg = "Database updated";
                                                        InfoBlk.details = {};
                                                        InfoBlk.details.DBInitialBlkNbr = nbrDBBlkInitial;
                                                        InfoBlk.details.AffilaeBlkNbr = nbrAffilaeBlk;
                                                        InfoBlk.details.DBBlkAdded = nbrBlkAdded;
                                                        result.info = InfoBlk;
                                                        res.status(200).send(result);
                                                    }


                                                }, function (erreur) {

                                                    dbCounter = dbCounter + 1;
                                                    /!*var ErrorBlk = {};
                                                    ErrorBlk.msg = "Insert Database Error: " + JSON.stringify(erreur);
                                                    result.info = ErrorBlk;*!/
                                                    console.log(PREFIX + "mode 1. Insert Database Error dbCounter: " + dbCounter + " dbQueryStarted: " + dbQueryStarted + " Error: " + JSON.stringify(erreur));
                                                    if (dbCounter == dbQueryStarted) {
                                                        console.log("on a finit et mal fini ");
                                                        var InfoBlk = {};
                                                        InfoBlk.msg = erreur;
                                                        InfoBlk.details = {};
                                                        InfoBlk.details.DBInitialBlkNbr = nbrDBBlkInitial;
                                                        InfoBlk.details.AffilaeBlkNbr = nbrAffilaeBlk;
                                                        InfoBlk.details.DBBlkAdded = nbrBlkAdded;
                                                        result.info = InfoBlk;
                                                        res.status(200).send(result);
                                                    }
                                                    //res.status(500).send(result);
                                                })*/


                                        } else {


                                        }


                                    }, function (erreur) {
                                        console.log("affilae response conversionsByIdCaller failed");
                                        var ErrorBlk = {};
                                        ErrorBlk.msg = 'affilae response conversionsByIdCaller failed: ' + erreur;
                                        result.error = ErrorBlk;
                                        res.status(500).send(result);

                                    })

                                /*} else {
                                    escProram = dbDriver.DBDriver_escape(currentProgramTitle);
                                    theStrValue = JSON.stringify(blkToAddInDB[i]);
                                    identifier = blkToAddInDB[i].identifier;


                                    dbQueryStarted = dbQueryStarted + 1;
                                    database.query("INSERT INTO " + DB_TABLE_IDFORM + " (formid,programTitle,programId,state,affilae_data)" + " VALUES ('" + identifier + "'," + escProram + ",'" + programId + "'," + 0 + ",'" + theStrValue + "')")
                                        .then(rows => {
                                            console.log(PREFIX + "insert done");
                                            nbrBlkAdded++;
                                            dbCounter = dbCounter + 1;
                                            if (dbCounter == dbQueryStarted) {
                                                console.log("on a finit et bien fini");
                                                var InfoBlk = {};
                                                InfoBlk.msg = "Database updated";
                                                InfoBlk.details = {};
                                                InfoBlk.details.DBInitialBlkNbr = nbrDBBlkInitial;
                                                InfoBlk.details.AffilaeBlkNbr = nbrAffilaeBlk;
                                                InfoBlk.details.DBBlkAdded = nbrBlkAdded;
                                                result.info = InfoBlk;
                                                res.status(200).send(result);
                                            }


                                        }, function (erreur) {
                                            console.log(PREFIX + " Insert Database Error: " + erreur);
                                            dbCounter = dbCounter + 1;
                                            var ErrorBlk = {};
                                            ErrorBlk.msg = "Insert Database Error: " + erreur;
                                            result.info = ErrorBlk;
                                            if (dbCounter == dbQueryStarted) {
                                                console.log("on a finit et mal fini");
                                                var InfoBlk = {};
                                                InfoBlk.msg = "Database updated but error detected: " + erreur;
                                                InfoBlk.details = {};
                                                InfoBlk.details.DBInitialBlkNbr = nbrDBBlkInitial;
                                                InfoBlk.details.AffilaeBlkNbr = nbrAffilaeBlk;
                                                InfoBlk.details.DBBlkAdded = nbrBlkAdded;
                                                result.info = InfoBlk;
                                                res.status(200).send(result);
                                            }
                                            //res.status(500).send(result);
                                        })

                                }
*/

                            }
                        }else{
                            // rien a mettre dans la base
                            console.log ("Database not updated because same as affilae");
                            var InfoBlk = {};
                            InfoBlk.msg = "Database not updated because same as affilae";
                            InfoBlk.details = {};
                            InfoBlk.details.DBInitialBlkNbr = nbrDBBlkInitial;
                            InfoBlk.details.AffilaeBlkNbr = nbrAffilaeBlk;
                            InfoBlk.details.DBBlkAdded = nbrBlkAdded;
                            result.info = InfoBlk;
                            res.status(200).send(result);

                        }
                        /*
                        var InfoBlk = {};
                        InfoBlk.msg = "Database updated";
                        InfoBlk.details = {};
                        InfoBlk.details.DBInitialBlkNbr = nbrDBBlkInitial;
                        InfoBlk.details.AffilaeBlkNbr = nbrAffilaeBlk;
                        InfoBlk.details.DBBlkAdded = nbrBlkAdded;
                        result.info = InfoBlk;
                        res.status(200).send(result);
                        */


                    })


            } else {
                // No data found in Affilae
                console.log("No data found in Affilae");
                var ErrorBlk = {};
                ErrorBlk.msg = "No data found in Affilae";
                result.info = ErrorBlk;
                res.status(200).send(result);
            }

        }, function (erreur) {
            console.log("affilae conversionsListCaller failed");
            var ErrorBlk = {};
            ErrorBlk.msg = 'affilae conversionsListCaller failed: ' + erreur;
            result.error = ErrorBlk;
            res.status(500).send(result);
        })


        /*console.log(PREFIX + " affilae response successfull");
        database.query('UPDATE ' + DB_TABLE_IDFORM + ' SET state = ' + newstatus + ' WHERE ' + " id = " + id)
            .then(rows => {


                console.log(PREFIX + "action : " + newstatus + " on id:" + id)
                res.send(response.body);
            }, function (erreur) {
                res.status(500).send('affilae response failed bad id: ' + erreur);
            })*/
        //res.send(response.body);
    }, function (erreur) {
        console.log("affilae response programListCaller failed");
        var ErrorBlk = {};
        ErrorBlk.msg = 'affilae response programListCaller failed: ' + erreur;
        result.error = ErrorBlk;
        res.status(500).send(result);

    })


}


exports.fetch = function (req, res) {
    console.log(PREFIX + "fetch");

    dbDriver.DBDriver_fetchFormTable()
    //database.query('SELECT * FROM ' + DB_TABLE_IDFORM)
        .then(rows => {

            var cc = JSON.stringify(rows);
            //database.close();
            var results = {}
            results.results = JSON.parse(cc)

            //console.log(PREFIX + "fetch result: " + JSON.stringify(results));
            res.send(results);


        })


}

exports.delete = function (req, res) {
    const idToDelete = req.params.id;
    var operationStatus = false;

    dbDriver.DBDriver_deleteFormTable ( idToDelete )
    //database.query('DELETE FROM ' + DB_TABLE_IDFORM + ' WHERE ' + " id = " + idToDelete)
        .then(rows => {
            operationStatus = true;
            if (operationStatus === false) {
                console.log(PREFIX + "delete id:" + idToDelete + " failed")
                res.status(204);
            } else {

                console.log(PREFIX + "delete id:" + idToDelete)
            }
            res.send();

        })


}

/*exports.add = function (req, res) {
    var data = req.body;
    if (data && !data[0].status) {
        data[0].status = 0;
    }
    //var size = Object.keys(data);
    if (data != null && data.length > 0) {


        database.query("INSERT INTO " + DB_TABLE_IDFORM + " (formid,name,state)" + " VALUES ('" + data[0].id + "','" + data[0].name + "'," + 0 + ")")
            .then(rows => {
                console.log(PREFIX + "add done")
                res.send();

            })

    } else {
        console.log(PREFIX + "add failed. no data in input")
        res.status(204);
    }
    res.send();

}*/
/*exports.setStatus = function (req, res) {

    const id = req.params.id;
    const newstatus = req.params.status;


    database.query('UPDATE ' + DB_TABLE_IDFORM + ' SET state = ' + newstatus + ' WHERE ' + " id = " + id)
        .then(rows => {


            console.log(PREFIX + "setStatus : " + newstatus + " on id:" + id)
            res.send();

        })


}*/

exports.historyconversion = function (req, res) {

	console.log(PREFIX + "historyconversion");
	var data = req.body;
	if (!data || !data.formid) {
        //nothing to do
        console.log(PREFIX + "historyconversion failed")
        res.status(204);
        res.send();
	}else if (!data.formid) {
		console.log(PREFIX + "historyconversion failed formid input unknown")
        res.status(204);
        res.send();
    } else {

		console.log(PREFIX + "historyconversion id: " + data.formid )
        dbDriver.DBDriver_findInHistory(data.formid)
            .then(rows => {
                res.setHeader('content-type', "application/json");
                var cc = JSON.stringify(rows);
                //database.close();
                var results = {}
                results.results = JSON.parse(cc)

                console.log(PREFIX + "historyconversion result: " + JSON.stringify(results));
                res.send(JSON.stringify(results));


            })
		/*database.query('SELECT * FROM ' + DB_TABLE_IDFORM_HISTORY + ' WHERE ' + " formid_original = '" + data.formid + "'")
        .then(rows => {
			res.setHeader('content-type', "application/json");
            var cc = JSON.stringify(rows);
            //database.close();
            var results = {}
            results.results = JSON.parse(cc)

            console.log(PREFIX + "historyconversion result: " + JSON.stringify(results));
            res.send(JSON.stringify(results));


        })*/


	}
}

exports.addConversion = function (req, res) {
    var data = req.body;

    var id = -1;

    if (!data) {
        //nothing to do
        console.log(PREFIX + "addConversion failed")
        res.status(204);
        res.send();

    } else {
        id = data.formId;
		var idtoAdd = id;
		if ( data.prefix ){
			idtoAdd = id + data.prefix;
		}
		console.log(PREFIX + "addConversion idform:<" + id + "> idform prefixed: " +  idtoAdd)
        var newstatus = 2;
        var partnership_id = "";
        var amount = data.amount;
        var commission = data.commission;
        var rule_Id = "6086a760e302e67e42610b6a";
        var programId = "";
        if ( data.previousrequest.programId){
            programId = data.previousrequest.programId;
        }


        var dataLine = JSON.parse(req.body.previousrequest.affilae_data)
        if (dataLine && dataLine.funnel ){
            for ( var i = 0; i<dataLine.funnel.length; i++){
                if ( dataLine.funnel[i] && dataLine.funnel[i].partnership ){

                    if ( dataLine.funnel[i].percent && dataLine.funnel[i].percent === 100 ){

                        if ( partnership_id = dataLine.funnel[i].partnership.id ) {
                            partnership_id = dataLine.funnel[i].partnership.id;
                            console.log("partnership_id: " + partnership_id);
                        }
                    }

                }

            }

        }

        addConversionCaller(programId, idtoAdd, partnership_id, amount, commission, rule_Id).then((affilaeConversionAddResponse) => {
            res.setHeader('content-type', "application/json");
            if (affilaeConversionAddResponse.statusCode == 200 && affilaeConversionAddResponse && affilaeConversionAddResponse.body) {
                var affilaeConversion = JSON.parse(affilaeConversionAddResponse.body);
                if (affilaeConversion.status === "done") {
                    // Reponse correcte. Changement du status en base

                    console.log(PREFIX + " addConversion response successfull");
                    database.query('UPDATE ' + DB_TABLE_IDFORM + ' SET state = ' + newstatus + ' WHERE ' + " formid = '" + id + "'")
                        .then(rows => {


                            console.log(PREFIX + "addConversion change status successfuly : " + newstatus + " on id:" + id)
                            //res.send(response.body);
                        }, function (erreur) {
                            console.log(PREFIX + "addConversion <" + id + "> change status failed : " + erreur)
                            //res.status(500).send('affilae response failed bad id: ' + erreur);
                        })

						// On met les dernieres données de conversion
						//
						var SQLStr = 'UPDATE ' + DB_TABLE_IDFORM + ' SET affilae_conversion = ' +  JSON.stringify(affilaeConversionAddResponse.body) + ' WHERE ' + " formid = '" + id + "'"
						console.log( "SQLStr: " + SQLStr );
						database.query(SQLStr)
                        .then(rows => {


                            console.log(PREFIX + "addConversion update affilae_conversion successfuly on id:" + id)
                            //res.send(response.body);
                        }, function (erreur) {
                            console.log(PREFIX + "addConversion update <" + id + ">  affilae_conversion failed : " + erreur)
                            //res.status(500).send('affilae response failed bad id: ' + erreur);
                        })

						// On mets les données de conversion dans l'historique
						//
						var theStrValue = affilaeConversionAddResponse.body;
						var theNewFormId = "";
						if (affilaeConversion['conversion'] && affilaeConversion['conversion'].identifier){
                            theNewFormId = affilaeConversion['conversion'].identifier
                        }
						var SQLInsertHistory = "INSERT INTO " + DB_TABLE_IDFORM_HISTORY + " (formid_original,formid,affilae_conversion)" + " VALUES ('" + id + "','" + theNewFormId + "','" + theStrValue + "')"
						console.log( "SQLInsertHistory: " + SQLInsertHistory );
						database.query(SQLInsertHistory)
							.then(rows => {


								console.log(PREFIX + "addConversion insert in history table done");


							}, function (erreur) {


								console.log(PREFIX + "addConversion insert in history table failed: " + JSON.stringify(erreur));

							})



                    res.send(affilaeConversion);
                } else {
                    // Reponse correcte.  Mais Ca c'est mal passé
                    res.send(affilaeConversion);

                }


            } else {
                // Reponse incorrecte
                var ErrorBlk = {};
                ErrorBlk.msg = 'addConversion failed. Bad response format. json expected ';
                if ( affilaeConversionAddResponse.statusCode ){
                    ErrorBlk.statusCode = affilaeConversionAddResponse.statusCode;
                }
                if ( affilaeConversionAddResponse.statusMessage ){
                    ErrorBlk.statusMessage = affilaeConversionAddResponse.statusMessage;
                }
                ErrorBlk.status = "failed";
                ErrorBlk.message = ErrorBlk.statusMessage;
                res.status(500).send(ErrorBlk);

            }


        }, function (erreur) {
            var ErrorBlk = {};
            ErrorBlk.msg = 'addConversion failed: ' + erreur;
            ErrorBlk.status = "failed";

            res.status(500).send(ErrorBlk);
        })


    }


}


