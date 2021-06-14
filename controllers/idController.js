


import {DBDriver} from "./DBDriver";

const affilaeDriver = require('../controllers/affilaeDriver');

const PREFIX = "idController: ";


const dbDriver = new DBDriver();


const isAlreadyInDB = (databaseContent, affilaeIdentifier) => {

    let flag;
    flag = false;
    for (let j = 0; j < databaseContent.length; j++) {
        if (databaseContent[j] && databaseContent[j].formid === affilaeIdentifier) {
            // Deja dans la base
            flag = true;
            break;
        } else {
            // pas encore dans la base

        }
    }
    console.log("isAlreadyInDB flag: " + flag + " for : " + affilaeIdentifier + " database lg: " + databaseContent.length);
    return flag

};



exports.synchronize = function (req, res) {
    console.log(PREFIX + "synchronize");

    const data = req.body;

    if (!data && !data.program || !data.program.title) {
        const ErrorBlk = {};
        ErrorBlk.msg = "No program tilte specified";

        res.setStatus(404).send(ErrorBlk);
    }
    let limit = 20;
    if (data && data.limit) {
        limit = data.limit;
    }
    const currentProgramTitle = data.program.title;  //"Focus, L'école de préparation mentale"
    let programId = "";
    //var currentProgramId = "";
    const result = {};

    const ReturnErrorMgt = (msg, nbrDBBlkInitial, nbrAffilaeBlk, nbrBlkAdded ) => {
        const InfoBlk = {};
        InfoBlk.msg = "Database updated";
        InfoBlk.details = {};
        InfoBlk.details.DBInitialBlkNbr = nbrDBBlkInitial;
        InfoBlk.details.AffilaeBlkNbr = nbrAffilaeBlk;
        InfoBlk.details.DBBlkAdded = nbrBlkAdded;
        result.info = InfoBlk;
        res.status(200).send(result);
    };
    affilaeDriver.programListCaller().then((response) => {

        if (response.body) {

            const resp = JSON.parse(response.body);

            // Extraction du de l'id
            for (let i = 0; i < resp.length; i++) {
                if (resp[i].title === currentProgramTitle) {
                    programId = resp[i].id;
                }
            }


        }

        if (programId === "") res.status(500).send('affilae response failed programId not found: ');
        affilaeDriver.conversionsListCaller(programId, limit).then((affilaeResponse) => {

            if (affilaeResponse) {
                if (affilaeResponse.body) {
                    const affilaeContent = JSON.parse(affilaeResponse.body);

                    console.log("conversionsListCaller: " + affilaeResponse.body);
                    let dbCounter = 0;
                    let dbQueryStarted = 0;
                    dbDriver.DBDriver_fetchFormTable()


                        //database.query('SELECT * FROM ' + DB_TABLE_IDFORM)
                        .then(rows => {

                            let i;
                            const cc = JSON.stringify(rows);
                            //database.close();
                            let databaseContent;
                            databaseContent = JSON.parse(cc);

                            const nbrAffilaeBlk = affilaeContent.length;
                            const nbrDBBlkInitial = databaseContent.length;
                            let nbrBlkAdded = 0;

                            // Selection de ce qui n'est pas encore dans la base
                            const blkToAddInDB = [];
                            for (i = 0; i < affilaeContent.length; i++) {
                                let stateDB;
                                stateDB = isAlreadyInDB(databaseContent, affilaeContent[i].identifier);
                                if (stateDB === false) {
                                    blkToAddInDB.push(affilaeContent[i]);
                                }

                            }
                            console.log("nbr blk affilae:" + affilaeContent.length);
                            console.log("nbr blk not already in db:" + blkToAddInDB.length);

                            dbQueryStarted = blkToAddInDB.length;
                            // On met dans la base
                            if (blkToAddInDB.length <= 0) {
                                // rien a mettre dans la base
                                console.log("Database not updated because same as affilae");
                                ReturnErrorMgt("Database not updated because same as affilae", nbrDBBlkInitial, nbrAffilaeBlk, nbrBlkAdded);
                                /*const InfoBlk = {};
                                InfoBlk.msg = "Database not updated because same as affilae";
                                InfoBlk.details = {};
                                InfoBlk.details.DBInitialBlkNbr = nbrDBBlkInitial;
                                InfoBlk.details.AffilaeBlkNbr = nbrAffilaeBlk;
                                InfoBlk.details.DBBlkAdded = nbrBlkAdded;
                                result.info = InfoBlk;
                                res.status(200).send(result);*/

                            } else {
                                for (i = 0; i < blkToAddInDB.length; i++) {


                                    let escProram = "";
                                    let theStrValue = "";
                                    let identifier = "";
                                    let created_at = "";

                                    // pas encore dans la base
//if (MODE_BASIC == 1) {
                                    // Dans ce mode on fait une requete supplementaire
                                    const id = blkToAddInDB[i].id;
                                    affilaeDriver.conversionsByIdCaller(programId, id).then((affilaeConversionResponse) => {
                                        if (affilaeConversionResponse) {
                                            if (affilaeConversionResponse.body) {
                                                const affilaeConversionById = JSON.parse(affilaeConversionResponse.body);

                                                escProram = dbDriver.DBDriver_escape(currentProgramTitle);
                                                theStrValue = affilaeConversionResponse.body;
                                                identifier = affilaeConversionById.identifier;

                                                if (theStrValue) {
                                                    const theStrValueStr = JSON.parse(theStrValue);
                                                    if (theStrValueStr && theStrValueStr.created_at) {
                                                        created_at = theStrValueStr.created_at;
                                                    }
                                                }
                                                const status = 0;

                                                const options = {
                                                    "escProram": escProram,
                                                    "theStrValue": theStrValue,
                                                    "identifier": identifier,
                                                    "status": status,
                                                    "programId": programId,
                                                    "created_at": created_at
                                                }


                                                dbDriver.DBDriver_iSChildExistInHistory(identifier, options)
                                                    .then((opt) => {

                                                        console.log("historyChildExist: " + opt.historyChildExist);
                                                        dbDriver.DBDriver_addFormId(opt)
                                                            .then(() => {
                                                                nbrBlkAdded++;
                                                                dbCounter = dbCounter + 1;
                                                                console.log(PREFIX + "mode 1. Insert done dbCounter: " + dbCounter + " dbQueryStarted: " + dbQueryStarted + " theStrValue:" + JSON.stringify(theStrValue));
                                                                if (dbCounter === dbQueryStarted) {
                                                                    console.log("on a finit et bien fini");
                                                                    ReturnErrorMgt("Database updated", nbrDBBlkInitial, nbrAffilaeBlk, nbrBlkAdded);
                                                                    /*const InfoBlk = {};
                                                                    InfoBlk.msg = "Database updated";
                                                                    InfoBlk.details = {};
                                                                    InfoBlk.details.DBInitialBlkNbr = nbrDBBlkInitial;
                                                                    InfoBlk.details.AffilaeBlkNbr = nbrAffilaeBlk;
                                                                    InfoBlk.details.DBBlkAdded = nbrBlkAdded;
                                                                    result.info = InfoBlk;
                                                                    res.status(200).send(result);*/
                                                                }

                                                            }, function (AddErreur) {

                                                                dbCounter = dbCounter + 1;

                                                                console.log(PREFIX + "mode 1. Insert Database Error dbCounter: " + dbCounter + " dbQueryStarted: " + dbQueryStarted + " Error: " + JSON.stringify(AddErreur));
                                                                if (dbCounter === dbQueryStarted) {
                                                                    console.log("on a finit et mal fini ");
                                                                    ReturnErrorMgt(AddErreur, nbrDBBlkInitial, nbrAffilaeBlk, nbrBlkAdded);
                                                                    /*const InfoBlk = {};
                                                                    InfoBlk.msg = AddErreur;
                                                                    InfoBlk.details = {};
                                                                    InfoBlk.details.DBInitialBlkNbr = nbrDBBlkInitial;
                                                                    InfoBlk.details.AffilaeBlkNbr = nbrAffilaeBlk;
                                                                    InfoBlk.details.DBBlkAdded = nbrBlkAdded;
                                                                    result.info = InfoBlk;
                                                                    res.status(200).send(result);*/
                                                                }

                                                            })


                                                    }, function (historyErreur) {
                                                        dbCounter += 1;

                                                        console.log(PREFIX + "mode 1. history Database Error dbCounter: " + dbCounter + " dbQueryStarted: " + dbQueryStarted + " Error: " + JSON.stringify(historyErreur));
                                                        if (dbCounter === dbQueryStarted) {
                                                            console.log("on a finit et mal fini history pb");
                                                            ReturnErrorMgt(historyErreur, nbrDBBlkInitial, nbrAffilaeBlk, nbrBlkAdded);
                                                            /*const InfoBlk = {};
                                                            InfoBlk.msg = historyErreur;
                                                            InfoBlk.details = {};
                                                            InfoBlk.details.DBInitialBlkNbr = nbrDBBlkInitial;
                                                            InfoBlk.details.AffilaeBlkNbr = nbrAffilaeBlk;
                                                            InfoBlk.details.DBBlkAdded = nbrBlkAdded;
                                                            result.info = InfoBlk;
                                                            res.status(200).send(result);*/
                                                        }

                                                    })


                                            }
                                        }


                                    }, function (erreur) {
                                        console.log("affilae response conversionsByIdCaller failed");
                                        const ErrorBlk = {};
                                        ErrorBlk.msg = 'affilae response conversionsByIdCaller failed: ' + erreur;
                                        result.error = ErrorBlk;
                                        res.status(500).send(result);

                                    })


                                }
                            }


                        })


                } else {
                    // No data found in Affilae
                    console.log("No data found in Affilae");
                    const ErrorBlk = {};
                    ErrorBlk.msg = "No data found in Affilae";
                    result.info = ErrorBlk;
                    res.status(200).send(result);
                }
            } else {
                // No data found in Affilae
                console.log("No data found in Affilae");
                const ErrorBlk = {};
                ErrorBlk.msg = "No data found in Affilae";
                result.info = ErrorBlk;
                res.status(200).send(result);
            }

        }, function (erreur) {
            console.log("affilae conversionsListCaller failed");
            const ErrorBlk = {};
            ErrorBlk.msg = 'affilae conversionsListCaller failed: ' + erreur;
            result.error = ErrorBlk;
            res.status(500).send(result);
        })


    }, function (erreur) {
        console.log("affilae response programListCaller failed");
        const ErrorBlk = {};
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

            const cc = JSON.stringify(rows);
            //database.close();
            const results = {};
            results.results = JSON.parse(cc)

            //console.log(PREFIX + "fetch result: " + JSON.stringify(results));
            res.send(results);


        })


}

exports.delete = function (req, res) {
    const idToDelete = req.params.id;
    let operationStatus = false;

    dbDriver.DBDriver_deleteFormTable(idToDelete)
        //database.query('DELETE FROM ' + DB_TABLE_IDFORM + ' WHERE ' + " id = " + idToDelete)
        .then(() => {
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


exports.historyconversion = function (req, res) {

    console.log(PREFIX + "historyconversion");
    const data = req.body;
    if (!data || !data.formid) {
        //nothing to do
        console.log(PREFIX + "historyconversion failed")
        res.status(204);
        res.send();
    } else if (!data.formid) {
        console.log(PREFIX + "historyconversion failed formid input unknown")
        res.status(204);
        res.send();
    } else {

        console.log(PREFIX + "historyconversion id: " + data.formid)
        dbDriver.DBDriver_findInHistory(data.formid)
            .then(rows => {
                res.setHeader('content-type', "application/json");
                const cc = JSON.stringify(rows);
                //database.close();
                const results = {};
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
    const data = req.body;

    let id = -1;

    if (!data) {
        //nothing to do
        console.log(PREFIX + "addConversion failed")
        res.status(204);
        res.send();

    } else {
        id = data.formId;
        let idtoAdd = id;
        if (data.prefix) {
            idtoAdd = id + data.prefix;
        }
        console.log(PREFIX + "addConversion idform:<" + id + "> idform prefixed: " + idtoAdd)
        const newstatus = 2;
        let partnership_id = "";
        const amount = data.amount;
        const commission = data.commission;
        const rule_Id = "6086a760e302e67e42610b6a";
        let programId = "";
        if (data.previousrequest && data.previousrequest.programId) {
            programId = data.previousrequest.programId;
        }


        const dataLine = JSON.parse(req.body.previousrequest.affilae_data);
        if (dataLine && dataLine.funnel) {
            for (let i = 0; i < dataLine.funnel.length; i++) {
                if (dataLine.funnel[i] && dataLine.funnel[i].partnership) {

                    if (dataLine.funnel[i].percent && dataLine.funnel[i].percent === 100) {

                        if (partnership_id = dataLine.funnel[i].partnership.id) {
                            partnership_id = dataLine.funnel[i].partnership.id;
                            console.log("partnership_id: " + partnership_id);
                        }
                    }

                }

            }

        }

        affilaeDriver.addConversionCaller(programId, idtoAdd, partnership_id, amount, commission, rule_Id).then((affilaeConversionAddResponse) => {
            res.setHeader('content-type', "application/json");
            if (affilaeConversionAddResponse.statusCode === 200 && affilaeConversionAddResponse && affilaeConversionAddResponse.body) {
                const affilaeConversion = JSON.parse(affilaeConversionAddResponse.body);
                if (affilaeConversion.status === "done") {
                    // Reponse correcte. Changement du status en base

                    console.log(PREFIX + " addConversion response successfull");
                    dbDriver.DBDriver_updateState(id, newstatus)
                        //database.query('UPDATE ' + DB_TABLE_IDFORM + ' SET state = ' + newstatus + ' WHERE ' + " formid = '" + id + "'")
                        .then(() => {


                            console.log(PREFIX + "addConversion change status successfuly : " + newstatus + " on id:" + id)
                            //res.send(response.body);
                        }, function (erreur) {
                            console.log(PREFIX + "addConversion <" + id + "> change status failed : " + erreur)
                            //res.status(500).send('affilae response failed bad id: ' + erreur);
                        })

                    // On met les dernieres données de conversion
                    //
                    /*
                    var SQLStr = 'UPDATE ' + DB_TABLE_IDFORM + ' SET affilae_conversion = ' + JSON.stringify(affilaeConversionAddResponse.body) + ' WHERE ' + " formid = '" + id + "'"
                    console.log("SQLStr: " + SQLStr);
                    database.query(SQLStr)
                        .then(rows => {


                            console.log(PREFIX + "addConversion update affilae_conversion successfuly on id:" + id)
                            //res.send(response.body);
                        }, function (erreur) {
                            console.log(PREFIX + "addConversion update <" + id + ">  affilae_conversion failed : " + erreur)
                            //res.status(500).send('affilae response failed bad id: ' + erreur);
                        })
                    */
                    // On mets les données de conversion dans historize
                    //
                    const theStrValue = affilaeConversionAddResponse.body;
                    let theNewFormId = "";
                    if (affilaeConversion['conversion'] && affilaeConversion['conversion'].identifier) {
                        theNewFormId = affilaeConversion['conversion'].identifier
                    }

                    dbDriver.DBDriver_addInHistory(id, theNewFormId, theStrValue)
                        .then(() => {


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
                const ErrorBlk = {};
                ErrorBlk.msg = 'addConversion failed. Bad response format. json expected ';
                if (affilaeConversionAddResponse.statusCode) {
                    ErrorBlk.statusCode = affilaeConversionAddResponse.statusCode;
                }
                if (affilaeConversionAddResponse.statusMessage) {
                    ErrorBlk.statusMessage = affilaeConversionAddResponse.statusMessage;
                }
                ErrorBlk.status = "failed";
                ErrorBlk.message = ErrorBlk.statusMessage;
                res.status(500).send(ErrorBlk);

            }


        }, function (erreur) {
            const ErrorBlk = {};
            ErrorBlk.msg = 'addConversion failed: ' + erreur;
            ErrorBlk.status = "failed";

            res.status(500).send(ErrorBlk);
        })


    }


}


