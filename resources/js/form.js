var connToken = "90937422|-31949292222132901|90942981";
function disableCtrl(ctrl) {
    $("#new").prop("disabled", ctrl);
    $("#save").prop("disabled", ctrl);
    $("#edit").prop("disabled", ctrl);
    $("#change").prop("disabled", ctrl);
    $("#reset").prop("disabled", ctrl);
}

function disableNav(ctrl) {
    $("#first").prop("disabled", ctrl);
    $("#prev").prop("disabled", ctrl);
    $("#next").prop("disabled", ctrl);
    $("#last").prop("disabled", ctrl);
}

function setRecNo(jsonObj) {
    var data = JSON.parse(jsonObj.data);
    localStorage.setItem("rec_no", data.rec_no);
}

function checkID() {
    var empid = $("#empid").val();
    var jsonStr = {
        id: empid
    };
    var getRequest = createGET_BY_KEYRequest(connToken, "Employee", "index", JSON.stringify(jsonStr));
    jQuery.ajaxSetup({async: false});
    var jsonObj = executeCommand(getRequest, "/api/irl");
    jQuery.ajaxSetup({async: true});
    if (jsonObj.status === 400) {
        $("#save").prop("disabled", false);
        $("#reset").prop("disabled", false);
        $("#empname").focus();
    } else if (jsonObj.status === 200) {
        showData(jsonObj);
    }
}

function newForm() {
    $("#empid").val("");
    $("#empname").val("");
    $("#empsal").val("");
    $("#hra").val("");
    $("#da").val("");
    $("#deduct").val("");
    $("#empid").prop("disabled", false);
    $("#empname").prop("disabled", false);
    $("#empsal").prop("disabled", false);
    $("#hra").prop("disabled", false);
    $("#da").prop("disabled", false);
    $("#deduct").prop("disabled", false);
    $("#empid").focus();
    disableNav(true);
    disableCtrl(true);

    $("#save").prop("disabled", false);
    $("#reset").prop("disabled", false);
}

function resetForm() {

    var getCurRequest = createGET_BY_RECORDRequest(connToken, "Employee", "index", localStorage.getItem("rec_no"));
    jQuery.ajaxSetup({async: false});
    var result = executeCommand(getCurRequest, irlPartUrl);
    showData(result);
    disableCtrl(true);
    disableNav(true);
    $("#new").prop("disabled", false);
    $("#edit").prop("disabled", false);
    $("#first").prop("disabled", false);
    $("#prev").prop("disabled", false);
}

function showData(jsonObj) {
    if (jsonObj.message === "EOF") {
        $("#next").prop("disabled", true);
        $("#last").prop("disabled", true);
        return;
    } else if (jsonObj.message === "BOF") {
        $("#prev").prop("disabled", true);
        $("#first").prop("disabled", true);
        return;
    }
    setRecNo(jsonObj);

    var mydata = JSON.parse(jsonObj.data).record;
//    console.log(mydata);
    $("#empid").val(mydata.id);
    $("#empname").val(mydata.name);
    $("#empsal").val(mydata.salary);
    $("#hra").val(mydata.hra);
    $("#da").val(mydata.da);
    $("#deduct").val(mydata.deduction);

    disableNav(false);
    $("#empid").prop("disabled", true);
    $("#empname").prop("disabled", true);
    $("#empsal").prop("disabled", true);
    $("#hra").prop("disabled", true);
    $("#da").prop("disabled", true);
    $("#deduct").prop("disabled", true);
    $("#save").prop("disabled", true);
    $("#change").prop("disabled", true);

    $("#new").prop("disabled", false);
    $("#edit").prop("disabled", false);
    $("#reset").prop("disabled", false);
}

function validateData() {
    var empid, empname, empsal, hra, da, deduct;
    empid = $("#empid").val();
    empname = $("#empname").val();
    empsal = $("#empsal").val();
    hra = $("#hra").val();
    da = $("#da").val();
    deduct = $("#deduct").val();

    if (empid === "") {
        alert("Employee ID missing");
        $("#empid").focus();
        return "";
    }
    if (empname === "") {
        alert("Employee Name missing");
        $("#empname").focus();
        return "";
    }
    if (empsal === "") {
        alert("Employee salary missing");
        $("#empsal").focus();
        return "";
    }
    if (hra === "") {
        alert("HRA missing");
        $("#hra").focus();
        return "";
    }
    if (da === "") {
        alert("DA missing");
        $("#da").focus();
        return "";
    }
    if (deduct === "") {
        alert("Deduction missing");
        $("#deduct").focus();
        return "";
    }

    var jsonStrObj = {
        id: empid,
        name: empname,
        salary: empsal,
        hra: hra,
        da: da,
        deduction: deduct
    };
    return JSON.stringify(jsonStrObj);
}

function getFirst() {
    var getFirstRequest = createFIRST_RECORDRequest(connToken, "Employee", "index");
    jQuery.ajaxSetup({async: false});
    var result = executeCommand(getFirstRequest, irlPartUrl);
    showData(result);
    jQuery.ajaxSetup({async: true});
    $("#empid").prop("disabled", true);
    $("#first").prop("disabled", true);
    $("#prev").prop("disabled", true);
    $("#next").prop("disabled", false);
    $("#save").prop("disabled", true);
}

function getPrev() {
    var r = localStorage.getItem("rec_no");
    if (r === 1)
    {
        $("#prev").prop("disabled", true);
        $("#first").prop("disabled", true);
    }
    var getPrevRequest = createPREV_RECORDRequest(connToken, "Employee", "index", r);
    jQuery.ajaxSetup({async: false});
    var result = executeCommand(getPrevRequest, irlPartUrl);
    showData(result);
    jQuery.ajaxSetup({async: true});
    var r = localStorage.getItem("rec_no");
    if (r === 1) {
        $("#first").prop("disabled", true);
        $("#prev").prop("disabled", true);
    }
    $("#save").prop("disabled", true);
}

function getNext() {
    var r = localStorage.getItem("rec_no");

    var getPrevRequest = createNEXT_RECORDRequest(connToken, "Employee", "index", r);
    jQuery.ajaxSetup({async: false});
    var result = executeCommand(getPrevRequest, irlPartUrl);
    showData(result);
    jQuery.ajaxSetup({async: true});
    $("#save").prop("disabled", true);
}

function getLast() {
    var getLastRequest = createLAST_RECORDRequest(connToken, "Employee", "index");
    jQuery.ajaxSetup({async: false});
    var result = executeCommand(getLastRequest, irlPartUrl);
    if (result.status === 200) {
        showData(result);
        $("#first").prop("disabled", false);
        $("#prev").prop("disabled", false);
        $("#last").prop("disabled", true);
        $("#next").prop("disabled", true);
        $("#reset").prop("disabled", true);
        $("#save").prop("disabled", true);
    } else {
        $("#myEmpFormMsg").prop("class", "alert-warning");
        $("#myEmpFormMsg").html("Please add the first record!");
        $("#myEmpFormMsg").fadeOut(3000);
        $("#empid").focus();
    }
    jQuery.ajaxSetup({async: true});

}

function saveData() {
    var jsonStrObj = validateData();
    if (jsonStrObj === "") {
        return "";
    }
    var setRequest = createSETRequest(connToken, jsonStrObj, "Employee", "index", "PUT", index_prim);
    jQuery.ajaxSetup({async: false});
    var jsonObj = executeCommand(setRequest, "/api/iml/set");
    if (jsonObj.status !== 200) {
        $("#myEmpFormMsg").html("ID not available!");
        $("#myEmpFormMsg").fadeOut(3000);
        resetForm();
    }
    if (jsonObj.status === 200) {
       resetForm();
    }
    jQuery.ajaxSetup({async: true});
    resetForm();
}

function editData() {
    $("#empid").prop("disabled", true);
    $("#empname").prop("disabled", false);
    $("#empsal").prop("disabled", false);
    $("#hra").prop("disabled", false);
    $("#da").prop("disabled", false);
    $("#deduct").prop("disabled", false);
    $("#empname").focus();

    disableNav(true);
    disableCtrl(true);
    $("#change").prop("disabled", false);
    $("#reset").prop("disabled", false);
}

function changeData() {

    jsonChg = validateData();
    var setRequest = createSETRequest(connToken, jsonChg, "Employee", "index", "UPDATE", index_prim);
    jQuery.ajaxSetup({async: false});
    var jsonObj = executeCommand(setRequest, "/api/iml/set");
    jQuery.ajaxSetup({async: true});
    resetForm();
    $("#empid").focus();
    $("#edit").focus();
}

localStorage.removeItem("size");
