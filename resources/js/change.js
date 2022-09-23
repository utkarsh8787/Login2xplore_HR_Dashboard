var connToken = "90937422|-31949292222132901|90942981";
function reset() {
    $("#oldpwd").val("");
    $("#newpwd").val("");
    $("#newpwd1").val("");
    return;
}

function checkPwd() {
    var oldpwd = $("#oldpwd").val();
    var new1 = $("#newpwd").val();
    var new2 = $("#newpwd1").val();
    if (oldpwd !== "" && new1 !== "" && new2 !== "") {
        var len1 = new1.length;
        var len2 = new2.length;
        if (len1 >= 6 && len2 >= 6) {
            if (new1 === new2) {
                changePwd(oldpwd, new1);
            } else {
                alert("Passwords don't match!");
            }
        } else {
            alert("Passwords must contain 6 characters minimum!");
        }

    } else {
        alert("Input missing!");
    }
    reset();
    return;
}

function changePwd(oldpwd, newpwd) {
    var email = localStorage.getItem("userID");
    var jsonObjStr = {
        email: email,
        password : oldpwd,
    };
    var getRecordRequest = createGET_BY_KEYRequest(connToken , "Employee", "user", JSON.stringify(jsonObjStr));
    jQuery.ajaxSetup({async: false});
    var jsonObj = executeCommand(getRecordRequest, irlPartUrl);
    if (jsonObj.status === 200) {
        
        var changeObj = {
            email:email,
            password: newpwd,
        };

        var setRequest = createSETRequest(connToken, JSON.stringify(changeObj), "Employee", "user", "DEFAULT", primaryKey=user_prim, uniqueKeys=user_unique);
        var responseObj = executeCommand(setRequest, "/api/iml/set");
        if (responseObj.status === 200) {
            alert("Password updated succesfully!");
            reset();
        }
        else{
            alert("Unable to change passowrd!");
            reset();
        }
    }
    jQuery.ajaxSetup({async: true});
    return;
}