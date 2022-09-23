var connToken = "90937422|-31949292222132901|90942981";
function validateData() {
    var name, email, phone, mypwd, mypwd1;
    name = $("#regname").val();
    email = $("#regemail").val();
    phone = $("#regphone").val();
    mypwd = $("#regpwd").val();
    mypwd1 = $("#regpwd1").val();

    var pwdlen = mypwd.length;
    var pwd1len = mypwd1.length;

    if (name === "") {
        alert("Name missing");
        $("#regname").focus();
        return "";
    }
    if (email === "") {
        alert("Email missing");
        $("#regemail").focus();
        return "";
    }
    if (phone === "") {
        alert("Phone Number missing");
        $("#regphone").focus();
        return "";
    }
    if (mypwd === "" || pwdlen < 6) {
        alert("Password inappropriate! Minimum 6 characters required");
        $("#regpwd").focus();
        return "";
    }
    if (mypwd1 === "" || pwd1len < 6) {
        alert("Password inappropriate! Minimum 6 characters required");
        $("#regpwd1").focus();
        return "";
    }
    if (mypwd !== mypwd1) {
        alert("Passwords don't match");
        $("#regpwd").val("");
        $("#regpwd1").val("");
        $("#regpwd").focus();
        return "";
    }

    var jsonStrObj = {
        name: name,
        email: email,
        phone: phone,
        password: mypwd
    };
    return JSON.stringify(jsonStrObj);
}

function resetLogin() {
    $("#regemail").val("");
    $("#regname").val("");
    $("#regphone").val("");
    $("#regpwd").val("");
    $("#regpwd1").val("");
    $("#regname").focus();
}

function saveData() {
    var jsonStr = validateData();
    if (jsonStr === "") {
        return;
    }
    var setRequest = createSETRequest(connToken, jsonStr, "Employee", "user", "PUT", user_prim, user_unique);
    console.log(setRequest);
    jQuery.ajaxSetup({async: false});
    var jsonObj = executeCommand(setRequest, "/api/iml/set");
    jQuery.ajaxSetup({async: true});
    if (jsonObj.status === 200) {
        $("#myRegFormMsg").prop("class", "alert-success");
        $("#myRegFormMsg").html("Succesfully registered!");
        setInterval(function () {
            window.location.replace("login.html");
        }, 2000);
    }
    else{
        $("#myRegFormMsg").html("Succesfully registered!");
        $("#myRegFormMsg").fadeOut(3000);
        resetLogin();
    }
}

function checkEmail()
{
    var e = $("#regemail").val();
    var jsonStr = {
        email: e
    };
    var getRequest = createGET_BY_KEYRequest(connToken, "Employee", "user", JSON.stringify(jsonStr));
    jQuery.ajaxSetup({async: false});
    var jsonObj = executeCommand(getRequest, "/api/irl");
    jQuery.ajaxSetup({async: true});
    if (jsonObj.status === 200) {
        $("#myRegFormMsg").html("Email ID already registered!");
        setInterval(function(){
            $("#myRegFormMsg").html("");
        }, 3000);
        $("#regemail").val("");
        $("#regemail").focus();
    }

}

function checkPhone()
{
    var p = $("#regphone").val();
    var jsonStr = {
        phone: p
    };
    var getRequest = createGET_BY_KEYRequest(connToken, "Employee", "user", JSON.stringify(jsonStr));
    jQuery.ajaxSetup({async: false});
    var jsonObj = executeCommand(getRequest, "/api/irl");
    jQuery.ajaxSetup({async: true});
    if (jsonObj.status === 200) {
        $("#myRegFormMsg").html("Phone Number already registered!");
        setInterval(function(){
            $("#myRegFormMsg").html("");
        }, 3000);
        $("#regphone").val("");
        $("#regphone").focus();
    }
}