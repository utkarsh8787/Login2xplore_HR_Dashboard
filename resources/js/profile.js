var connToken = "90937422|-31949292222132901|90942981";
function showUser() {
    var email = localStorage.getItem("userID");
    var jsonStr = {
        email: email
    };
    var getRequest = createGET_BY_KEYRequest(connToken, "Employee", "user", JSON.stringify(jsonStr));
    jQuery.ajaxSetup({async: false});
    var jsonObj = executeCommand(getRequest, irlPartUrl);
    if (jsonObj.status === 200) {
        var data = JSON.parse(jsonObj.data).record;
        $("#proemail").val(data.email);
        $("#proname").val(data.name);
        $("#prophone").val(data.phone);
    }
    jQuery.ajaxSetup({async: true});
    return;
}

function enableChange() {
    $("#proname").prop("disabled", false);
    $("#prophone").prop("disabled", false);
    $("#save").prop("disabled", false);
    $("#edit").prop("disabled", true);
    $("#name").focus();
    alert("You can change only name and contact no.");
}

function changeData() {
    var name = $("#proname").val();
    var phone = $("#prophone").val();
    jQuery.ajaxSetup({async: false});
    var changeObj = {
        email: localStorage.getItem("userID"),
        name: name,
        phone: phone
    };

    var setRequest = createSETRequest(connToken, JSON.stringify(changeObj), "Employee", "user", "DEFAULT", primaryKey = user_prim, uniqueKeys = user_unique);
    var responseObj = executeCommand(setRequest, "/api/iml/set");
    if (responseObj.status === 200) {
        alert("Update succesful!");
        $("#proname").prop("disabled", true);
        $("#prophone").prop("disabled", true);
        $("#save").prop("disabled", true);
        $("#edit").prop("disabled", false);
    } else {
        alert("Unable to make changes");
        window.location.reload();
    }
    jQuery.ajaxSetup({async: true});
    return;
}