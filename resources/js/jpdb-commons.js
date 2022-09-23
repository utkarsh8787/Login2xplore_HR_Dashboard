var baseUrl = "http://api.login2explore.com:5577";
var connToken = "90937422|-31949292222132901|90942981";
function setBaseUrl(baseUrlArg) {
    baseUrl = baseUrlArg;
}

var imlPartUrl = "/api/iml";
var irlPartUrl = "/api/irl";
var islPartUrl = "/api/isl";

var FILE_STATUS_OK = "OK";
var FILE_STATUS_EOF = "EOF";
var FILE_STATUS_BOF = "BOF";
var RELATION_IS_EMPTY = "RELATION_IS_EMPTY";
var DATA_HAS_BEEN_RETRIEVED_FROM_PI = "DATA_HAS_BEEN_RETRIEVED_FROM_PI";
var INVALID_RECORD = "INVALID_RECORD";
var DATA_NOT_FOUND = "DATA_NOT_FOUND";
var SUCCESS = "Success";
var FAILURE = "Faliure";
var COLUMN_EXIST = "COLUMN EXIST";
var COLUMN_DOES_NOT_EXIST = "COLUMN DOES NOT EXIST";
var RES_STATUS_SUCCESS = 200;
var RES_STATUS_FAILURE = 400;
var TRUE = "true";
var FALSE = "false";
var RELATION_DOES_NOT_EXIST = "RELATION DOES NOT EXIST";

function insertFormData2JPDB(formID) {

    var $form = $("#" + formID + "");
    var formDataInJson = getFormDataInJson($form);          //jpdb-commons.js method
    var formJsonStr = JSON.stringify(formDataInJson);

    $.ajaxSetup({async: false});
    var msgDivID = $("#" + formID + "").attr('data-response-div-id');
    var connToken = $("#" + formID + "").attr('data-connection-token');
    if (connToken === "" || connToken === undefined) {
        if (msgDivID === "" || msgDivID === undefined) {
            alert("JPDB Connection Token Missing!");
        } else {
            $("#" + msgDivID + '').html('JPDB Connection Token Missing!').fadeIn().delay(3000).fadeOut();
        }
        return false;
    }
    var dbName = $("#" + formID + "").attr('data-db-name');
    if (dbName === undefined) {
        dbName = "";
    }
    var relName = $("#" + formID + "").attr('data-table-name');
    if (relName === undefined) {
        relName = "";
    }

    var successMsg = $("#" + formID + "").attr('data-success-msg');
    var errorMsg = $("#" + formID + "").attr('data-error-msg');

    var putReq = createPUTRequest(connToken, formJsonStr, dbName, relName);

    var imlPartUrl = "/api/iml";                           // API End-Point URL
    var respJson = executeCommand(putReq, imlPartUrl);

    var status = respJson.status;
    var statusMsg = "";
    if (status === 200) {
        if (successMsg === "" || successMsg === undefined) {
            statusMsg = respJson.message;
        } else {
            statusMsg = successMsg;
        }
    } else {
        if (errorMsg === "" || errorMsg === undefined) {
            statusMsg = respJson.message;
        } else {
            statusMsg = errorMsg;
        }
    }
    if (msgDivID === "" || msgDivID === undefined) {
        alert(statusMsg);
    } else {
        $("#" + msgDivID + '').html(statusMsg).fadeIn().delay(3000).fadeOut();
    }

    document.getElementById(formID).reset();
    $.ajaxSetup({async: true});

    return false;
}

function createPUTRequest(connToken, jsonObj, dbName, relName) {
    var putRequest = "{\n"
            + "\"token\" : \""
            + connToken
            + "\","
            + "\"dbName\": \""
            + dbName
            + "\",\n" + "\"cmd\" : \"PUT\",\n"
            + "\"rel\" : \""
            + relName + "\","
            + "\"jsonStr\": \n"
            + jsonObj
            + "\n"
            + "}";
    return putRequest;
}

function executeCommandAtGivenBaseUrl(reqString, dbBaseUrl, apiEndPointUrl) {
    var url = dbBaseUrl + apiEndPointUrl;
    var jsonObj;
    $.post(url, reqString, function (result) {
        jsonObj = JSON.parse(result);
    }).fail(function (result) {
        var dataJsonObj = result.responseText;
        jsonObj = JSON.parse(dataJsonObj);
    });
    return jsonObj;
}

function executeCommand(reqString, apiEndPointUrl) {
    var url = baseUrl + apiEndPointUrl;
    var jsonObj;
    $.post(url, reqString, function (result) {
        jsonObj = JSON.parse(result);
    }).fail(function (result) {
        var dataJsonObj = result.responseText;
        jsonObj = JSON.parse(dataJsonObj);
    });
    return jsonObj;
}

function getFormDataInJson($form) {
    var unindexed_array = $form.serializeArray();
    var indexed_array = {};
    $.map(unindexed_array, function (n, i) {
        indexed_array[n['name']] = n['value'];
    });
    return indexed_array;
}

function createIS_COLUMN_EXISTRequest(token, dbname, relationName, colName) {
    var req = "{\n"
            + "\"token\" : \""
            + token
            + "\","
            + "\"dbName\": \""
            + dbname
            + "\",\n" + "\"cmd\" : \"IS_COLUMN_EXIST\",\n"
            + "\"rel\" : \""
            + relationName
            + "\",\n"
            + "\"colName\" : \""
            + colName
            + "\",\n"
            + "\n"
            + "}";
    return req;
}

function createGETALLSyncRecordRequest(token, dbName, relName, timeStamp, pageNo, pageSize, createTime, updateTime) {
    if (createTime !== undefined) {
        if (createTime !== true) {
            createTime = false;
        }
    } else {
        createTime = false;
    }
    if (updateTime !== undefined) {
        if (updateTime !== true) {
            updateTime = false;
        }
    } else {
        updateTime = false;
    }
    var req = "{\n"
            + "\"token\" : \""
            + token
            + "\","
            + "\"dbName\": \""
            + dbName
            + "\",\n" + "\"cmd\" : \"GETALL\",\n"
            + "\"rel\" : \""
            + relName
            + "\",\n" + "\"timeStamp\": "
            + timeStamp
            + ",\n" + "\"pageNo\":"
            + pageNo
            + "," + "\"pageSize\":"
            + pageSize
            + "\,"
            + "\"createTime\":"
            + createTime
            + "\,"
            + "\"updateTime\":"
            + updateTime
            + "\n"
            + "}";
    return req;
}

function createGETALLRecordRequest(token, dbName, relName, pageNo, pageSize, createTime, updateTime) {
    if (createTime !== undefined) {
        if (createTime !== true) {
            createTime = false;
        }
    } else {
        createTime = false;
    }
    if (updateTime !== undefined) {
        if (updateTime !== true) {
            updateTime = false;
        }
    } else {
        updateTime = false;
    }
    var req = "{\n"
            + "\"token\" : \""
            + token
            + "\","
            + "\"dbName\": \""
            + dbName
            + "\",\n" + "\"cmd\" : \"GETALL\",\n"
            + "\"rel\" : \""
            + relName
            + "\",\n" + "\"pageNo\":"
            + pageNo
            + "," + "\"pageSize\":"
            + pageSize
            + "\,"
            + "\"createTime\":"
            + createTime
            + "\,"
            + "\"updateTime\":"
            + updateTime
            + "\n"
            + "}";
    return req;
}

function createGETALLCOLRequest(token, dbName, relName) {
    var req = "{\n"
            + "\"token\" : \""
            + token
            + "\","
            + "\"dbName\": \""
            + dbName
            + "\",\n" + "\"cmd\" : \"GETALLCOL\",\n"
            + "\"rel\" : \""
            + relName
            + "\"\n"
            + "}";
    return req;
}

function createGETRequest(token, dbname, relationName, jsonObjStr) {
    var value1 = "{\n"
            + "\"token\" : \""
            + token
            + "\",\n" + "\"cmd\" : \"GET\",\n"
            + "\"dbName\": \""
            + dbname
            + "\",\n"
            + "\"rel\" : \""
            + relationName
            + "\",\n"
            + "\"jsonStr\":\n"
            + jsonObjStr
            + "\n"
            + "}";
    return value1;
}

function createGET_BY_KEYRequest(token, dbname, relationName, jsonObjStr, createTime, updateTime) {
    if (createTime !== undefined) {
        if (createTime !== true) {
            createTime = false;
        }
    } else {
        createTime = false;
    }
    if (updateTime !== undefined) {
        if (updateTime !== true) {
            updateTime = false;
        }
    } else {
        updateTime = false;
    }
    var value1 = "{\n"
            + "\"token\" : \""
            + token
            + "\",\n" + "\"cmd\" : \"GET_BY_KEY\",\n"
            + "\"dbName\": \""
            + dbname
            + "\",\n"
            + "\"rel\" : \""
            + relationName
            + "\",\n"
            + "\"jsonStr\":\n"
            + jsonObjStr
            + "\,"
            + "\"createTime\":"
            + createTime
            + "\,"
            + "\"updateTime\":"
            + updateTime
            + "\n"
            + "}";
    return value1;
}

function createGET_RECORDRequest(token, dbName, relName, reqId) {
    var req = "{\n"
            + "\"token\" : \""
            + token
            + "\","
            + "\"dbName\": \""
            + dbName
            + "\",\n" + "\"cmd\" : \"GET_RECORD\",\n"
            + "\"rel\" : \""
            + relName
            + "\",\n" + "\"record\":"
            + reqId
            + "\n"
            + "}";
    return req;
}

function createGET_BY_RECORDRequest(token, dbName, relName, reqId, createTime, updateTime) {
    if (createTime !== undefined) {
        if (createTime !== true) {
            createTime = false;
        }
    } else {
        createTime = false;
    }
    if (updateTime !== undefined) {
        if (updateTime !== true) {
            updateTime = false;
        }
    } else {
        updateTime = false;
    }
    var req = "{\n"
            + "\"token\" : \""
            + token
            + "\","
            + "\"dbName\": \""
            + dbName
            + "\",\n" + "\"cmd\" : \"GET_BY_RECORD\",\n"
            + "\"rel\" : \""
            + relName
            + "\",\n" + "\"record\":"
            + reqId
            + "\,"
            + "\"createTime\":"
            + createTime
            + "\,"
            + "\"updateTime\":"
            + updateTime
            + "\n"
            + "}";
    return req;
}

function createGET_RELATION_SIZERequest(token, dbname, relationName) {
    var value1 = "{\n"
            + "\"token\" : \""
            + token
            + "\",\n" + "\"cmd\" : \"GET_RELATION_SIZE\",\n"
            + "\"dbName\": \""
            + dbname
            + "\",\n"
            + "\"rel\" : \""
            + relationName
            + "\",\n"
            + "\n"
            + "}";
    return value1;
}

function createGET_RELATION_STATSRequest(token, dbname, relationName) {
    var value1 = "{\n"
            + "\"token\" : \""
            + token
            + "\",\n" + "\"cmd\" : \"GET_RELATION_STATS\",\n"
            + "\"dbName\": \""
            + dbname
            + "\",\n"
            + "\"rel\" : \""
            + relationName
            + "\",\n"
            + "\n"
            + "}";
    return value1;
}

function createGETALLRELRequest(token, dbName) {
    var req = "{\n"
            + "\"token\" : \""
            + token
            + "\","
            + "\"dbName\": \""
            + dbName
            + "\",\n" + "\"cmd\" : \"GETALLREL\"\n"
            + "}";
    return req;
}

function createGET_ALL_RELATIONRequest(token, dbName) {
    var req = "{\n"
            + "\"token\" : \""
            + token
            + "\","
            + "\"dbName\": \""
            + dbName
            + "\",\n" + "\"cmd\" : \"GET_ALL_RELATION\"\n"
            + "}";
    return req;
}

function createSYNC_DBRequest(token, dbName, relTimestampObjStr, createTime, updateTime) {
    if (createTime !== undefined) {
        if (createTime !== true) {
            createTime = false;
        }
    } else {
        createTime = false;
    }
    if (updateTime !== undefined) {
        if (updateTime !== true) {
            updateTime = false;
        }
    } else {
        updateTime = false;
    }
    var req = "{\n"
            + "\"token\" : \""
            + token
            + "\","
            + "\"dbName\": \""
            + dbName
            + "\",\n" + "\"cmd\" : \"SYNC_DB\",\n"
            + "\"relTsJson\":"
            + "{\n"
            + relTimestampObjStr
            + "\n"
            + "}"
            + "\,"
            + "\"createTime\":"
            + createTime
            + "\,"
            + "\"updateTime\":"
            + updateTime
            + "}";
    return req;
}

function createREMOVERecordRequest(token, dbName, relName, reqId) {
    var req = "{\n"
            + "\"token\" : \""
            + token
            + "\","
            + "\"dbName\": \""
            + dbName
            + "\",\n" + "\"cmd\" : \"REMOVE\",\n"
            + "\"rel\" : \""
            + relName
            + "\",\n" + "\"record\":"
            + reqId
            + "\n"
            + "}";
    return req;
}

function createUPDATERecordRequest(token, jsonObj, dbName, relName, reqId) {
    var req = "{\n"
            + "\"token\" : \""
            + token
            + "\","
            + "\"dbName\": \""
            + dbName
            + "\",\n" + "\"cmd\" : \"UPDATE\",\n"
            + "\"rel\" : \""
            + relName
            + "\",\n"
            + "\"jsonStr\":{ \""
            + reqId
            + "\":\n"
            + jsonObj
            + "\n"
            + "}}";
    return req;
}

function createSETRequest(token, jsonStr, dbName, relName, type, primaryKey, uniqueKeys) {
    if (type === undefined) {
        type = "DEFAULT";
    }
    var req = {
        token: token,
        cmd: "SET",
        dbName: dbName,
        rel: relName,
        type: type,
        jsonStr: JSON.parse(jsonStr)
    };
    if (primaryKey !== undefined) {
        req.primaryKey = primaryKey;
    }
    if (uniqueKeys !== undefined) {
        req.uniqueKeys = uniqueKeys;
    }
    req = JSON.stringify(req);
    return req;
}

function createFIND_RECORDRequest(token, dbName, relName, jsonObjStr, createTime, updateTime) {
    if (createTime !== undefined) {
        if (createTime !== true) {
            createTime = false;
        }
    } else {
        createTime = false;
    }
    if (updateTime !== undefined) {
        if (updateTime !== true) {
            updateTime = false;
        }
    } else {
        updateTime = false;
    }
    var req = "{\n"
            + "\"token\" : \""
            + token
            + "\","
            + "\"dbName\": \""
            + dbName
            + "\",\n" + "\"cmd\" : \"FIND_RECORD\",\n"
            + "\"rel\" : \""
            + relName
            + "\",\n"
            + "\"jsonStr\":\n"
            + jsonObjStr
            + "\,"
            + "\"createTime\":"
            + createTime
            + "\,"
            + "\"updateTime\":"
            + updateTime
            + "\n"
            + "}";
    return req;
}

function createFIND_ALL_RECORDSRequest(token, dbName, relName, jsonObjStr, createTime, updateTime) {
    if (createTime !== undefined) {
        if (createTime !== true) {
            createTime = false;
        }
    } else {
        createTime = false;
    }
    if (updateTime !== undefined) {
        if (updateTime !== true) {
            updateTime = false;
        }
    } else {
        updateTime = false;
    }
    var req = "{\n"
            + "\"token\" : \""
            + token
            + "\","
            + "\"dbName\": \""
            + dbName
            + "\",\n" + "\"cmd\" : \"FIND_ALL_RECORDS\",\n"
            + "\"rel\" : \""
            + relName
            + "\",\n"
            + "\"jsonStr\":\n"
            + jsonObjStr
            + "\,"
            + "\"createTime\":"
            + createTime
            + "\,"
            + "\"updateTime\":"
            + updateTime
            + "\n"
            + "}";
    return req;
}

function createNEXT_RECORDRequest(token, dbName, relName, recordNumber, createTime, updateTime) {
    return createNavReq(token, dbName, relName, "NEXT_RECORD", recordNumber, createTime, updateTime);
}

function createPREV_RECORDRequest(token, dbName, relName, recordNumber, createTime, updateTime) {
    return createNavReq(token, dbName, relName, "PREV_RECORD", recordNumber, createTime, updateTime);
}

function createFIRST_RECORDRequest(token, dbName, relName, createTime, updateTime) {
    return createNavReq(token, dbName, relName, "FIRST_RECORD", 0, createTime, updateTime);
}

function createLAST_RECORDRequest(token, dbName, relName, createTime, updateTime) {
    return createNavReq(token, dbName, relName, "LAST_RECORD", 0, createTime, updateTime);
}

//function createNavReq(token, dbName, relName, nav, recNo, isCreateTime, isUpdateTime) {
function createNavReq(token, dbName, relName, nav, recNo, createTime, updateTime) {
    if (createTime !== undefined) {
        if (createTime !== true) {
            createTime = false;
        }
    } else {
        createTime = false;
    }
    if (updateTime !== undefined) {
        if (updateTime !== true) {
            updateTime = false;
        }
    } else {
        updateTime = false;
    }
    var partNavReq = "";

    if (nav === "NEXT_RECORD" || nav === "PREV_RECORD") {
        partNavReq = ",\n"
                + "\"record\":"
                + recNo;
    }
    var req = "{\n"
            + "\"token\" : \""
            + token
            + "\","
            + "\"dbName\": \""
            + dbName
            + "\",\n" + "\"cmd\" : \"" + nav + "\",\n"
            + "\"rel\" : \""
            + relName
            + '"'
            + partNavReq
            + "\,"
            + "\"createTime\":"
            + createTime
            + "\,"
            + "\"updateTime\":"
            + updateTime
            + "\n}";
    return req;
}

function createEmailToSendReq(token, jsonStr) {
    var sendEmailRequest = "{\n"
            + "\"token\" : \""
            + token
            + "\",\n"
            + "\"jsonStr\" : \n"
            + jsonStr
            + "\n"
            + "}";
    return sendEmailRequest;
}

var JPDB_SUCCESS_CODE = 200;
var JPDB_INVALID_TOKEN_CODE = 401;
var JPDB_ERROR_CODE = 400;


function createJpdbSessionToken(token, seedValue, dbName, relName, userEmail) {
    var getSessionReq = "{\n"
            + "\"token\":\"" + token + "\",\n"
            + "\"jsonStr\":{\"seedValue\":" + seedValue + "}\n}";

    var respSessionReq = executeCommand(getSessionReq, "/serverless/get_new_session");

    var getSessionTokenStatus = respSessionReq.status;

    if (getSessionTokenStatus === JPDB_SUCCESS_CODE) {
        var data = respSessionReq.data;
        var dataObj = JSON.parse(data);
        var jpdbSessionToken = dataObj.sessionToken;

        var dataToPut = {
            jpdbUserSessionToken: jpdbSessionToken,
            email: userEmail
        };
        var dataPutObj = JSON.stringify(dataToPut);
        var sessionRelName = relName + "_session";
        var putReqStr = createPUTRequest(token, dataPutObj, dbName, sessionRelName);
        var respPUTReq = executeCommand(putReqStr, "/api/iml");

        var putStatus = respPUTReq.status;
        if (putStatus === 200) {
            localStorage.setItem('jpdbUserSessionToken', jpdbSessionToken);
            localStorage.setItem("userID", userEmail);
            return JPDB_SUCCESS_CODE;
        }
        return putStatus;
    }
    return getSessionTokenStatus;
}

function getJpdbSessionToken() {
    return localStorage.getItem('jpdbUserSessionToken');
}

function validateJpdbSessionToken(token, jpdbSessionToken) {
    var validSessionReq = "{\n"
            + "\"token\":\"" + token + "\",\n"
            + "\"jsonStr\": {\"sessionToken\": \"" + jpdbSessionToken + "\"}}";
    var resValidSessionReq = executeCommand(validSessionReq, "/serverless/validate_session");

    var validateSessionStatus = resValidSessionReq.status;
    return validateSessionStatus;
}

function isJpdbSessionTokenExists(token, dbName, relName) {

    var jpdbSessionToken = getJpdbSessionToken();
    if (jpdbSessionToken === "")
        return;
    var dataToSend = {
        jpdbUserSessionToken: jpdbSessionToken
    };
    var dataObjStr = JSON.stringify(dataToSend);
    var sessionRelName = relName + "_session";

    var findRecReq = createFIND_RECORDRequest(token, dbName, sessionRelName, dataObjStr);

    $.ajaxSetup({async: false});
    var respFindRecReq = executeCommand(findRecReq, "/api/irl");

    var findRecStatus = respFindRecReq.status;
    if (findRecStatus === JPDB_SUCCESS_CODE) {
        var validSessionTokenStatus = validateJpdbSessionToken(token, jpdbSessionToken);

        if (validSessionTokenStatus === JPDB_ERROR_CODE) {
            var data = respFindRecReq.data;

            $.each(data, function (index, row) {

                var recordNo = row['rec_no'];
                var removeReqStr = createREMOVERecordRequest(token, dbName, sessionRelName, recordNo);
                var respRemoveRecord = executeCommand(removeReqStr, "/api/iml");
                $.ajaxSetup({async: true});

                var removeStatus = respRemoveRecord.status;
                if (removeStatus === JPDB_SUCCESS_CODE) {
                    if (getJpdbSessionToken() !== null) {
                        localStorage.removeItem('jpdbUserSessionToken');
                    }
                    return JPDB_ERROR_CODE;
                }
                return removeStatus;
            });
            return validSessionTokenStatus;
        }
        return validSessionTokenStatus;
    }
    $.ajaxSetup({async: true});
    if (findRecStatus === JPDB_ERROR_CODE) {
        localStorage.removeItem('jpdbUserSessionToken');
        return JPDB_ERROR_CODE;
    }
    return findRecStatus;
}


function removeJpdbSessionToken(token, jpdbSessionToken) {

    var removeSessionTokenReq = "{\n"
            + "\"token\":\"" + token + "\",\n"
            + "\"jsonStr\": {\"sessionToken\": \"" + jpdbSessionToken + "\"}}";
    var resRemoveSessionToken = executeCommand(removeSessionTokenReq, "/serverless/remove_session");

    var removeSessionStatus = resRemoveSessionToken.status;
    return removeSessionStatus;
}


function removeSessionTokenFromJPDB(token, dbName, relName) {
    var jpdbSessionToken = getJpdbSessionToken();
    $.ajaxSetup({async: false});
    var respRemoveSession = removeJpdbSessionToken(token, jpdbSessionToken);

    if (respRemoveSession === JPDB_SUCCESS_CODE) {

        localStorage.removeItem('jpdbUserSessionToken');
        localStorage.removeItem('userID');

        var dataToSend = {
            jpdbUserSessionToken: jpdbSessionToken
        };
        var dataObjStr = JSON.stringify(dataToSend);
        var sessionRelName = relName + "_session";
        var findRecReq = createFIND_RECORDRequest(token, dbName, sessionRelName, dataObjStr);
        var respFindRecReq = executeCommand(findRecReq, "/api/irl");

        var findRecStatus = respFindRecReq.status;

        if (findRecStatus === JPDB_SUCCESS_CODE) {
            var data = respFindRecReq.data;

            $.each(data, function (index, row) {
                var recordNo = row['rec_no'];
                var removeReqStr = createREMOVERecordRequest(token, dbName, sessionRelName, recordNo);
                var respRemoveRecord = executeCommand(removeReqStr, "/api/iml");
                $.ajaxSetup({async: true});

                var removeStatus = respRemoveRecord.status;
                if (removeStatus === JPDB_SUCCESS_CODE) {
                    return JPDB_SUCCESS_CODE;
                }
                return removeStatus;
            });
            return JPDB_SUCCESS_CODE;
        }

        $.ajaxSetup({async: true});

        if (findRecStatus === 401) {
            return JPDB_INVALID_TOKEN_CODE;
        } else {
            return findRecStatus;
        }
    }
    return respRemoveSession;
}