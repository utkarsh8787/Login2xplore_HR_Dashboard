var connToken = "90937422|-31949292222132901|90942981";

var myname, mystatus;
var index_prim = "id";
var user_prim = "email";
var user_unique = ["phone"];
function checkSession() {
    var isSession = isJpdbSessionTokenExists(connToken, "Employee", "user");
    if (isSession === 400) {
        if (mystatus === "in") {
            localStorage.setItem("req-url", window.location.href);
            window.location.href = "login.html";
        } else
            return;
    } else if (isSession === 200) {
        return;
    }
    return;
}

function loadName() {
    var email = localStorage.getItem("userID");
    $("#myUser").html(email);
    return;
}

function loadHeader() {
    $("#myHeader").load("resources/header.html");
    currentTab();
    loadName();
}

function currentTab() {
    if (myname === "home") {
        $("#myhome").prop("class", "active");
    }
    if (myname === "profile") {
        $("#myprofile").prop("class", "active");
    }
    if (myname === "change") {
        $("#mychange").prop("class", "active");
    }
    if (myname === "form") {
        $("#myform").prop("class", "active");
    }
    return;
}

function loadFooter() {
    $("#myFooter").load("resources/footer.html");
}

function deleteSession() {
    var removeSession = removeSessionTokenFromJPDB(connToken, "Employee", "user");
    if (removeSession === 200) {
        console.log("Session removed");
        localStorage.removeItem("rec_no");
        window.location.replace("login.html");
    } else
        return;
}
