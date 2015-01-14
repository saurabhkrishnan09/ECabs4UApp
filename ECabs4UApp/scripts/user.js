//login using cookie
function loginUsingCookie() {
    var name = window.localStorage.getItem('userName');
    var password = window.localStorage.getItem('userPassword');
    var remMe = window.localStorage.getItem('remember');

    if (remMe === "true") {
        $('#txtUserName').val(name);
        $('#txtPassword').val(password);
        login();
    }
}

function login() {
    var name = $('#txtUserName').val();
    var password = $('#txtPassword').val();

    if (name.length > 0) {
        $('#lblMsg').text("");
    }
    else if (name.length === 0) {
        $('#lblMsg').text("Please Enter Username.");
        $('#txtUserName').focus();
        return false;
    }
    if (password.length > 0) {
        $('#lblMsg').text("");
    }
    else if (password.length === 0) {
        $('#lblMsg').text("Please Enter Password.");
        $('#txtPassword').focus();
        return false;
    }
    var isTrue = checkConnection();
    if (isTrue) {
        var url = "http://ecabs4uservice.azurewebsites.net/ECabs4U.asmx/UserLogin";
        $.ajax(url, {
            beforeSend: function () {
                showLoading();
            },
            type: "POST",
            datatype: "json",
            data: "{'username':'" + name + "','userpassword':'" + password + "'}",
            contentType: "application/json; charset=utf-8",
            success: CheckMsg,
            error: function (XMLHttpRequest, textStatus, errorThrown) { },
            complete: function () { hideLoading(); }
        });
    }
}

function CheckMsg(data) {
    //console.log($("#imgLoader"));
    //hideLoading();
    var userID = data.d[1];
    var isChecked = $('#chkRem').prop('checked') ? true : false;
    if (data.d[0] === "true") {
        showLoading();

        var roleID = parseInt(data.d[2]);
        var relatedID = data.d[3];

        var name = $('#txtUserName').val();
        var password = $('#txtPassword').val();

        //creating Cookie       

        if (isChecked === true) {
            window.localStorage.setItem('userName', name);
            window.localStorage.setItem('userPassword', password);
            window.localStorage.setItem('remember', true);
        }
        else {
            window.localStorage.setItem('userName', '');
            window.localStorage.setItem('userPassword', '');
            window.localStorage.setItem('remember', false);
        }

        if (roleID == 3 || roleID == 7) {
            $("#CustomerFooter").hide();
            $("#DriverFooter").show();
        }
        else if (roleID == 4) {
            $("#DriverFooter").hide();
            $("#CustomerFooter").show();
        }

        switch (roleID) {
            //Role 3 --> Driver OR Role 7 --> OperatorCumDriver
            case 3:
            case 7:
                userId = userID;
                roleId = roleID;
                relatedId = relatedID;

                //check new job timer start
                jobCheckTime = window.setInterval(CheckNewJob, 5000);
                app.application.navigate('#driverHome');
                break;
                //Role 4 --> Customer
            case 4:
                userId = userID;
                roleId = roleID;
                relatedId = relatedID;
                cancelledJobCustomerTimer = window.setInterval(GetCancelledJobsForCustomer, 60000);
                app.application.navigate('#search');
                break;
        }

        //failed Job Timer start
        if (roleId > 0)
            failedJObTimer = window.setInterval(checkFailedJob, 13000);
        else
            window.clearInterval(failedJObTimer);
    }
    else {
        //hideLoading();
        var unauthorised = data.d[0];
        if (unauthorised == "EmailNotVerified") {
            $('#myInputhidden').val(data.d[1]);
            $('#txtPassword').val("");
            $('#lblMess1').show();
            $('#aEmailResndVerificationLink').show();
            $('#lblMess2').show();
        }
        else if (unauthorised == "BlockedLoginAttempt") {
            $('#myInputhidden').val(data.d[1]);
            $('#txtPassword').val("");
            $('#lblResMess1').show();
            $('#aresendResendpwdlink').show();
            $('#lblResMess2').show();
        }
        else {
            $('#lblMsg').text(data.d);
            $('#lblMsg').css("color", "#D70007");
            $('#lblMsg').css("font-size", "13");
            $('#txtPassword').val("");
        }
    }
    //hideLoading();
}
function GetCurrentLocation() {
    console.log(navigator.geolocation);
    if (navigator.geolocation) {
        console.log("getting current location");
        navigator.geolocation.getCurrentPosition(function (position) {
            var pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
            var geocoder = new google.maps.Geocoder();
            var latLng = pos;
            geocoder.geocode({ 'latLng': latLng }, function (results, status) {
                if (status === google.maps.GeocoderStatus.OK) {
                    if (results[1])
                        $('#txtCurrentFrom').val(results[0].formatted_address);
                }
                else
                    jAlert("No location found.", 'ECABS4U');
            });
        });
    }
}
function resendEmailVerification() {
    hideLoading();
    $('#lblResMess1').hide();
    $('#aresendResendpwdlink').hide();
    $('#lblResMess2').hide();
    $('#lblMess1').hide();
    $('#aEmailResndVerificationLink').hide();
    $('#lblMess2').hide();

    var userid = $('#myInputhidden').val();
    var intsOnly = /^\d+$/;
    if (intsOnly.test(userid)) {
        if (userid != "" || userid != " ") {
            var url = "http://ecabs4uservice.azurewebsites.net/ECabs4U.asmx/lnkbtnresendVerificationLink";
            $.ajax(url, {
                beforeSend: function () {
                    showLoading();
                },
                type: "POST",
                datatype: "json",
                data: "{'useridfromPage':'" + userid + "'}",
                contentType: "application/json; charset=utf-8",
                success: successEmailSend,
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                }
            });
        }
    }
}

function successEmailSend(data) {
    hideLoading();
    $('#lblResMess1').hide();
    $('#aresendResendpwdlink').hide();
    $('#lblResMess2').hide();
    $('#lblMess1').hide();
    $('#aEmailResndVerificationLink').hide();
    $('#lblMess2').hide();
    $('#lblMsg').text(data.d[1]);
    $('#lblMsg').css("color", "#D70007");
    $('#lblMsg').css("font-size", "13");
    $('#myInputhidden').val("");
}

function resetpwdlnk() {
    hideLoading();
    $('#lblMess1').hide();
    $('#aEmailResndVerificationLink').hide();
    $('#lblMess2').hide();
    $('#lblResMess1').hide();
    $('#aresendResendpwdlink').hide();
    $('#lblResMess2').hide();

    var username = $('#myInputhidden').val();
    if (username != "" || username != " ") {
        var url = "http://ecabs4uservice.azurewebsites.net/ECabs4U.asmx/lnkbtnResendpwdlink";
        $.ajax(url, {
            beforeSend: function () { showLoading(); },
            complete: function () { hideLoading(); },
            type: "POST",
            datatype: "json",
            data: "{'usernamefrompage':'" + username + "'}",
            contentType: "application/json; charset=utf-8",
            success: successPWDLink,
            error: function (XMLHttpRequest, textStatus, errorThrown) {
            }
        });
    }
}

function successPWDLink(data) {
    hideLoading();
    $('#lblResMess1').hide();
    $('#aresendResendpwdlink').hide();
    $('#lblResMess2').hide();
    $('#lblMess1').hide();
    $('#aEmailResndVerificationLink').hide();
    $('#lblMess2').hide();
    $('#lblMsg').text(data.d[1]);
    $('#lblMsg').css("color", "#D70007");
    $('#lblMsg').css("font-size", "13");
    $('#myInputhidden').val("");
}

function onbeforeProfile() {
    if (roleId == 3 || roleId == 7) //For Driver
        getDrvProfile();
    if (roleId == 4) //For Customer
        getCustProfile();
    showHideProfileControls();
}

function showHideProfileControls() {
    if (roleId == 3 || roleId == 7) //For Driver
    {
        $('#DrvVehicles').show();
        $('#DrvFooter').show();
        $('#CustomerFooterProfile').hide();

        $("#lblLocation").show();
        $("#lblLocation2").show();
        $("#lblPostcode").show();
    }
    if (roleId == 4) //For Customer
    {
        $('#DrvVehicles').hide();
        $('#DrvFooter').hide();
        $('#CustomerFooterProfile').show();
    }
    $("#txtFirstname").hide();
    $("#txtLastname").hide();
    $("#txtEmailID").hide();
    $("#txtMobileno").hide();
    $("#txtLocation").hide();
    $("#txtLocation2").hide();
    $("#txtpostcode").hide();
    $("#lblValidation").hide();
    $("#trBtnUpdate").hide();

    $("#lblMobileNo").show();
    $("#lblEmailID").show();
    $('#lblname').show();
    $('#lblLastname').show();
    $("#btnEdit").show();
}
function getCustProfile() {
    var url = "http://ecabs4uservice.azurewebsites.net/ECabs4U.asmx/GetCustomerrDetails";
    $.ajax(url, {
        beforeSend: function () { showLoading(); },
        complete: function () { hideLoading(); },
        type: "POST",
        dataType: "Json",
        data: "{'userID':'" + relatedId + "'}",
        contentType: "application/json; charset=utf-8",
        success: ShowCustData,
        error: function (XMLHttpRequest, textStatus, errorThrown) { }
    });
}
function getDrvProfile() {
    var url = "http://ecabs4uservice.azurewebsites.net/ECabs4U.asmx/GetDriverDetails";
    $.ajax(url, {
        beforeSend: function () { showLoading(); },
        complete: function () { hideLoading(); },
        type: "POST",
        dataType: "Json",
        data: "{'userID':'" + relatedId + "'}",
        contentType: "application/json; charset=utf-8",
        success: ShowDriverData
    });
}

function ShowDriverData(data) {
    $('#vehiclecount').text(data.d.length);
    $('#lblname').text(data.d[0][0] + " " + data.d[0][1]);
    $('#lblLocation').text(data.d[0][2]);
    $('#lblLocation2').text(data.d[0][3]);
    $('#lblMobileNo').text(data.d[0][4]);
    $('#lblEmailID').text(data.d[0][5]);
    $('#lblPostcode').text(data.d[0][6]);
    driverImgUrl = data.d[0][7];
    $('#imgUser').attr("src", driverImgUrl);
    $('#divAllVehicle').empty();
    $('#divAllVehicle').empty().append("");
    var myVehicles = "";
    myVehicles = "<table style='width:100%;color: black;'>";
    for (var i = 0; i < data.d.length; i++) {
        if (data.d[i][8] !== undefined || data.d[i][9] !== undefined) {
            RegistrationNo = data.d[i][8];
            PlateNo = data.d[i][9];
            Capacity = data.d[i][10];
            vehImgUrl = data.d[i][11];
            vehAllocatedID = data.d[i][12];
            isAuthorised = data.d[i][13];

            myVehicles += "<tr>";
            myVehicles += "<td style='text-align:center;width:7%;'>" + (i + 1) + "</td>";
            myVehicles += "<td style='width:20%;text-align:center;height:20px;color:black'><img style='height:45px;width:40px;border-radius:4px' alt='vehImage' src='" + vehImgUrl + "' /></td>";
            myVehicles += "<td style='width:20%;text-align:left;height:20px;color:black'>" + RegistrationNo + "</td>";
            myVehicles += "<td style='width:20%;text-align:center;height:20px;color:black'>" + PlateNo + "</td>";
            myVehicles += "<td style='width:8%;text-align:center;height:20px;color:black'>" + Capacity + "</td>";
            myVehicles += "<td style='width:25%;text-align:center;height:20px;color:black'> ";
            if (isAuthorised === "false" || isAuthorised === "False") {
                myVehicles += '<input type="button" class="specialBtn" value="Select"  style="float:right;width:80%;" onclick="SelectVehicle(\'' + vehAllocatedID + '\')"/></td>';
            }
            myVehicles += "</tr>";
        }
        else {
            myVehicles += "<tr><td><br/>No Vehicle Allocated.</td></tr>";
        }

    }
    myVehicles += "</table>";
    $('#divAllVehicle').html('');
    $('#divAllVehicle').append(myVehicles);
}
function ShowCustData(data) {
    $('#lblname').text(data.d[0] + " " + data.d[1]);
    $('#lblMobileNo').text(data.d[2]);
    $('#lblEmailID').text(data.d[3]);
    $('#imgUser').attr("src", "img/man.png");
}
function EditProfile() {
    var fullname = $('#lblname').text();
    var namearray = fullname.split(" ");

    var name = namearray[0];
    var lastname = namearray[1];
    var mobile = $('#lblMobileNo').text();
    var email = $('#lblEmailID').text();
    var postcode = $('#lblPostcode').text();
    var location = $('#lblLocation').text();
    var location2 = $('#lblLocation2').text();
    $("#lblValidation").text('');

    $("#txtMobileno").show();
    $("#lblValidation").hide();
    $("#trBtnUpdate").show();

    $("#btnEdit").hide();
    $("#lblEmailID").hide();
    $("#lblMobileNo").hide();
    $("#lblLocation").hide();
    $("#lblLocation2").hide();
    $("#lblPostcode").hide();
    $("#txtEmailID").hide();
    $("#txtLocation").hide();
    $("#txtLocation2").hide();
    $("#txtpostcode").hide();
    $('#txtFirstname').hide();
    $('#txtLastname').hide();
    $("#lblValidation").val('');

    $('#txtMobileno').val(mobile);
    $('#txtEmailID').val(email);

    if (roleId == 4) {
        $('#txtFirstname').val(name);
        $('#txtLastname').val(lastname);
        $('#lblname').hide();
        $('#lblLastname').hide();
        $('#txtFirstname').show();
        $('#txtLastname').show();
        $("#txtEmailID").show();
    }
    else if (roleId == 3 || roleId == 7) {
        $('#lblEmailID').show();
        $('#txtpostcode').val(postcode);
        $('#txtLocation').val(location);
        $('#txtLocation2').val(location2);
        $("#txtLocation").show();
        $("#txtLocation2").show();
        $("#txtpostcode").show();
    }
}
function UpdateProfile() {
    var name = $('#txtFirstname').val();
    var lastname = $('#txtLastname').val();
    var email = $('#txtEmailID').val();
    var address1 = $('#txtLocation').val();
    var address2 = $('#txtLocation2').val();
    var phoneno = $('#txtMobileno').val();
    var postcode = $('#txtpostcode').val();
    console.log(name);
    console.log(lastname);
    console.log(email);
    console.log(address1);
    console.log(address2);
    console.log(phoneno);
    console.log(postcode);

    var phoneno2 = /^\d{11}$/;
    var regExpEmail = /^([_a-zA-Z0-9_]+)(\.[_a-zA-Z0-9-]+)*@([a-zA-Z0-9-]+\.)+(\.[a-zA-Z0-9-]+)*([a-zA-Z]{2,4})$/;
    if (roleId == 4) {
        if (name.length == 0) {
            $("#lblValidation").show();
            $("#lblValidation").text('Please enter your name.');
            $('#txtname').focus();
            return false;
        }

        if (phoneno.length > 0) {
            if (phoneno2.test(phoneno)) { }
            else if (phoneno.length < 11) {
                $("#lblValidation").show();
                $("#lblValidation").text('Please enter a valid contact number.');
                $('#txtMobileno').focus();
                return false;
            } else {
                $("#lblValidation").show();
                $("#lblValidation").text('Please enter a valid Mobile number.');
                $('#txtMobileno').focus();
                return false;
            }
        }
        else if (phoneno.length === 0) {
            $("#lblValidation").show();
            $("#lblValidation").text('Please enter contact number.');
            $('#txtMobileno').focus();
            return false;
        }
        if (email.length > 0) {
            if (!email.match(regExpEmail)) {
                $("#lblValidation").show();
                $("#lblValidation").text('Please enter a valid email address.');
                $('txtEmailID').focus();
                return false;
            }
        }
        else if (email.length == 0) {
            $("#lblValidation").show();
            $("#lblValidation").text('Please enter email address.');
            $('txtEmailID').focus();
            return false;
        }
    }
    if (roleId == 3 || roleId == 7) {
        if (address1.length == 0) {
            jAlert('Please enter address line1.', 'ECABS4U');
            $('#txtLocation').focus();
            return false;
        }
        if (address2.trim().length == 0) {
            jAlert('Please enter address line2.', 'ECABS4U');
            $('#txtLocation2').focus();
            return false;
        }
        if (!postcode) {
            jAlert('Please enter postcode.', 'ECABS4U');
            $('#txtpostcode').focus();
            return false;
        }
    }
    $.ajax({
        beforeSend: function () { showLoading(); },
        complete: function () { hideLoading(); },
        url: "http://ecabs4uservice.azurewebsites.net/ECabs4U.asmx/UpdateProfile",
        type: "post",
        dataType: "Json",
        data: "{'roleId':'" + roleId + "','relatedId':'" + relatedId + "','name':'" + name + "','lastname':'" + lastname + "','email':'" + email + "','phoneno':'" + phoneno + "','address1':'" + address1 + "','address2':'" + address2 + "','postcode':'" + postcode + "'}",
        contentType: "application/json; charset=utf-8",
        success: onbeforeProfile,
        error: function (XMLHttpRequest, textStatus, errorThrown) { }
    });
}
function CancelProfile() {
    showHideProfileControls();
}
function ChangePaswords() {
    var currentPass = $("#curentpswd").val();
    var newPass = $('#txtNew').val();
    var confirm = $('#txtConform').val();
    var pass = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,16}$/;

    if (currentPass.length > 0) {
        $('#lblMsgPass').val("");
    }
    else if (currentPass.length === 0) {
        $('#lblMsgPass').text("Please enter current password.");
        $('#curentpswd').focus();
        return false;
    }

    if (newPass.length > 0) {
        if (newPass.match(pass)) {
            $('#lblMsgPass').text(" ");
        }
        else {
            $('#lblMsgPass').text("Password must be in between 8 to 16 characters which contain at least one numeric digit, one uppercase and one lowercase letter.");
            $('#newPass').focus();
            return false;
        }
    }
    else if (newPass.length == 0) {
        $('#lblMsgPass').text("Please enter new password.");
        $('#txtNew').focus();
        return false;
    }

    if (confirm.length > 0) {
        if (newPass == confirm) {
            $('#lblMsgPass').text(" ");
        }
        else {
            $('#lblMsgPass').text("Password mismatch.");
            return false;
        }
    }
    else if (confirm.length == 0) {
        $('#lblMsgPass').text("Please re-enter confirm password.");
        return false;
    }

    var url = "http://ecabs4uservice.azurewebsites.net/ECabs4U.asmx/ChangePassword";
    $.ajax(url, {
        beforeSend: function () { showLoading(); },
        complete: function () { hideLoading(); },
        datatype: "JSON",
        type: "POST",
        data: "{'userid':'" + userId + "','oldpassword':'" + currentPass + "','newpassword':'" + newPass + "'}",
        contentType: "application/json; charset=utf-8",
        success: ShowStatus,
        error: function (XMLHttpRequest, textStatus, errorThrown) { }
    });
}
function ShowStatus(data) {
    if (data.d === "False") {
        $('#lblMsgPass').text("Incorrect current password.");
        $('#lblMsgPass').css("color", "#FE2E2E");
        $('#lblMsgPass').css("font-size", "13");
        $('#curentpswd').val("");
        $('#txtNew').val("");
        $('#txtConform').val("");
    }
    else if (data.d === "Error") {
        $('#lblMsgPass').text("Error occurs, please try again.");
        $('#lblMsgPass').css("color", "#FE2E2E");
        $('#lblMsgPass').css("font-size", "13");
        $('#curentpswd').val("");
        $('#txtNew').val("");
        $('#txtConform').val("");
    }
    else {
        $('#lblMsgPass').text(data.d);
        $('#lblMsgPass').css("color", "#0B610B");
        $('#lblMsgPass').css("font-size", "13");
        $('#txtConform').val("");
        $('#curentpswd').val("");
        $('#txtNew').val("");
    }
}
function onbeforeChangePassword() {
    if (roleId == 3 || roleId == 7) //For Driver
    {
        $('#DrvFooterChgPass').show();
        $('#CustomerFooterChgPass').hide();
    }
    else // for Customer
    {
        $('#DrvFooterChgPass').hide();
        $('#CustomerFooterChgPass').show();
    }
}