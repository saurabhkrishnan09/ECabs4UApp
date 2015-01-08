document.addEventListener("deviceready", onDeviceReady, false);
$(document).ready(function () {    
    $("#tabstrip-Customer").kendoTabStrip();
    $("#tabstrip-Driver").kendoTabStrip();
    $("#tabstrip-DriverJoboffer").kendoTabStrip();
    $("#tabstrip-DriverBookedJob").kendoTabStrip();
});
$(function () {
    $.fn.raty.defaults.path = 'lib/img';
});

var specialReq;
function onDeviceReady() {
    navigator.splashscreen.hide();
    document.addEventListener("backbutton", confirmExit, false);

    var devicename = device.name;
    var platform = device.platform
    var deviceuuid = device.uuid
    var model = device.model
    var version = device.version


    $.ajax({
        url: "http://192.168.1.22/ECabs/ECabs4U.asmx/RegisterDevice",
        type: "post",
        datatype: "json",
        data: "{'devicename':'" + devicename + "', 'platform':'" + platform + "', 'deviceuuid':'" + deviceuuid + "', 'model':'" + model + "', 'version':'" + version + "'}",
        contentType: "application/json; charset=utf-8",
    });
    loginUsingCookie();
    checkConnection();
    $("#tabstrip").kendoTabStrip({
        animation: {
            open: {
                effects: "fadeIn"
            }
        }
    });
    $("input[type='button']").kendoButton();

    $(window).scroll(function () {
        if ($(this).scrollTop() > 100) {
            $('.scrollToTop').fadeIn();
        } else {
            $('.scrollToTop').fadeOut();
        }
    });

    //Click event to scroll to top
    $('.scrollToTop').click(function () {
        $('html, body').animate({ scrollTop: 0 }, 800);
        return false;
    });


}


function onbeforeCustomerBooking() {

    CustomerBooking();
    customerBookingTimer = window.setInterval(CustomerBooking, 10000);
    // getCablaterBooking();
    // getCabnowBooking();
}

function CustomerBooking() {
    getCablaterBooking();
    getCabnowBooking();
}
function getCablaterBooking() {
    var url = "http://192.168.1.22/ECabs/ECabs4U.asmx/CustomerCabLaterBooking";
    $.ajax(url, {
        type: "POST",
        datatype: "json",
        data: "{'relatedId':'" + relatedId + "'}",
        contentType: "application/json; charset=utf-8",
        success: function (data) {
            var count = data.d.length;
            if (count > 0) {
                $('#bookingmsglater').hide();
                var previousjobID = "";
                var html = '<table id="tbhist" cellspacing="0" cellpadding="0" width="100%">';
                html += '<tr class="thead-grid">';
                html += '<th>JobNo</th>';
                html += '<th colspan="2">From</th>';
                html += '<th>To</th>';
                html += '<th>Action</th>';
                html += '</tr>';
                for (var i = 0; i < count; i++) {
                    var jobID = data.d[i]["CustomerRequestID"];
                    var From = data.d[i]["From"];
                    var To = data.d[i]["To"];
                    var CustResponse = data.d[i]["CustomerResponse"];

                    var DriverName = data.d[i]["DriverName"];
                    var DriverPhoto = data.d[i]["DriverPhoto"];
                    var VehicleImages = data.d[i]["VehicleImages"];
                    var DriverSpecialReq = data.d[i]["DriverSpecialReq"];
                    var DriverID = data.d[i]["DriverID"];
                    var Fare = data.d[i]["NewFare"];
                    if (i > 0) {
                        previousjobID = data.d[i - 1]["CustomerRequestID"];
                    }

                    if (jobID !== previousjobID) {
                        html += '<tr>';
                        html += '<td colspan="5"><hr style="border:2px solid darkred; margin: -2px;" ></td>';
                        html += '</tr>';
                        html += '<tr style="font-size: 12px;height: 45px;">';
                        html += '<td><a  onclick="ShowDetailBooking(\'' + jobID + '\')" style="color:blue; font-size:15px;">' + jobID + '</a></td>';
                        html += "<td colspan='2' >" + From + "</td>";
                        html += "<td>" + To + "</td>";
                        html += '<td><input type="button" class="rejectbtn" value="Cancel Job" style="width:98%;-webkit-appearance:none;-moz-appearance:none;" onclick="CancelJob(\'' + jobID + '\')"/></td>';
                        html += '</tr>';
                        html += '<tr class="thead-grid2">';
                        html += '<td>Driver</td>';
                        html += '<td>Vehicle</td>';
                        html += '<td style="text-align:center;">Fare</td>';
                        html += '<td>Rating </td>';
                        html += '<td>Action </td>';
                        html += '</tr>';
                        isAnyDriverHired = false;
                        for (var j = 0; j < count; j++) {
                            if (data.d[j]["CustomerResponse"] === true && data.d[j]["CustomerRequestID"] === jobID) {
                                isAnyDriverHired = true;
                            }
                        }
                    }
                    html += '<tr style="border-bottom:1px solid black !important;">';
                    html += '<td style="width: 20%;text-align:left;">';
                    html += '<a  onclick="showRating(\'' + DriverID + '\')" style="color:blue; font-size: 17px;">' + DriverName + '</a><br/>';
                    html += '<img src="' + DriverPhoto + '" style="max-width:50px;max-height:50px;border-radius:4px;" onclick=\"ShowLargeImage(this,\'\',\'\',\'\')\"/>';
                    html += '</td>';
                    html += '<td style="width: 20%;text-align:left;"><br/><img src="' + VehicleImages + '" style="max-width:50px;max-height:50px;border-radius:4px;" onclick="ShowLargeImage(this,\'\',\'\',\'\')\"/></td>';
                    html += "<td style='width: 15%;height:35px;text-align:center;'>" + '&pound' + Fare + "</td>";
                    html += '<td style="width: 25%;text-align:left;"><input type="button" class="btn-tmp" value="Rating" style="width:98%;-webkit-appearance:none;-moz-appearance:none;" onclick="showRating(\'' + DriverID + '\')"/></td>';
                    if (Fare > 0) {
                        if (CustResponse !== true) {
                            if (isAnyDriverHired === false) {
                                html += "<td style='width: 20%;text-align:center;'>" + '<input type="button" id="check" style="-webkit-appearance:none;-moz-appearance:none;width:43%;margin-right:69px"  class="accept-btn2" value="Hire" onclick="HireDriverBooking(\'' + jobID + '\',\'' + DriverID + '\')"/>' + "</td>";
                            }
                            else {
                            }
                        }
                        else {
                            html += "<td style='width: 20%;text-align:center;'>" + 'Awaiting driver response <span style="color:green; font-size:16px;">Or</span><br/><input type="button" id="check" style="-webkit-appearance:none;-moz-appearance:none;" class="rejectbtn" value="Cancel Driver" onclick="CancelDriver(\'' + jobID + '\',\'' + DriverID + '\')"/>' + "</td>";
                        }
                    }
                    else {
                        html += "<td style='width: 20%;text-align:center;'>Awaiting Bids</td>";
                    }
                    html += '</tr>';
                }
                html += '</table>';
                $('#cablatercustomerbookings').html('');
                $('#cablatercustomerbookings').append(html);
            }
            else {
                $('#cablatercustomerbookings').empty().append("");
                $('#cablatercustomerbookings').html('');
                $('#bookingmsglater').show();
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) { }
    });
}


function getCabnowBooking() {
    $.ajax({
        url: "http://192.168.1.22/ECabs/ECabs4U.asmx/CustomerCabNowBooking",
        type: "POST",
        dataType: "Json",
        data: "{'relatedId':'" + relatedId + "'}",
        contentType: "application/json; charset=utf-8",
        success: getData,
        error: function (XMLHttpRequest, textStatus, errorThrown) { }
    });
}

function getData(data) {
    var count = data.d.length;
    var previousjobID = "", jobID = "";
    if (count > 0) {
        $('#bookingmsgnow').hide();
        $('#cabnowcustomerbookings').show();
        DisplayDriversData();
    }
    else {
        $('#cabnowcustomerbookings').empty().append("");
        $('#bookingmsgnow').show();
    }
    function DisplayDriversData() {
        $('#cabnowcustomerbookings').empty();
        $('#divbid').show();
        $('#divawait').hide();
        var html = '<table id="tbhist" cellspacing="0"  cellpadding="0" width="100%">';
        html += '<tr class="thead-grid">';
        html += '<th>JobNo</th>';
        html += '<th >From</th>';
        html += '<th>To</th>';
        html += '<th>Action</th>';
        html += '</tr>';
        for (var i = 0; i < count; i++) {
            jobID = data.d[i]["CustomerRequestID"];
            From = data.d[i]["From"];
            To = data.d[i]["To"];
            CustResponse = data.d[i]["CustomerResponse"];
            DriverName = data.d[i]["DriverName"];
            DriverPhoto = data.d[i]["DriverPicUrl"];
            VehicleImages = data.d[i]["VehicleImageUrl"];
            spec = data.d[i]["DriverSpecialReq"];
            specialReq = data.d[i]["DriverSpecialReq"];
            DriverID = data.d[i]["DriverID"];
            Fare = data.d[i]["Fare"];
            searchTime = data.d[i]["SearchTime"];
            bidTime = data.d[i]["BidTime"];
            getBidTimeData(searchTime, bidTime);

            if (i > 0) {
                previousjobID = data.d[i - 1]["CustomerRequestID"];
            }
            if (jobID !== previousjobID) {

                html += '<tr>';
                html += '<td colspan="5"><hr style="border:2px solid darkred; margin: -2px;" ></td>';
                html += '</tr>';
                html += '<tr style="font-size: 12px; height:45px;">';
                html += '<td><a onclick="ShowDetailBooking(\'' + jobID + '\')" style="color:blue;font-size:15px;">' + jobID + '</a></td>';
                html += "<td >" + From + "</td>";
                html += "<td >" + To + "</td>";
                html += '<td ><input type="button" class="rejectbtn" value="Cancel Job" onclick="CancelJob(\'' + jobID + '\')"/></td>';
                html += '</tr>';
                html += '<tr class="thead-grid2">';
                html += '<td style="text-align:center;">Fare</td>';
                html += '<td style="text-align:center;">Date</td>';
                html += '<td style="text-align:center;">Specs</td>';
                html += '<td style="text-align:center;">ETA</td>';
                html += '</tr>';
                isAnyDriverHired = false;
                for (var j = 0; j < count; j++) {
                    if (data.d[j]["CustomerResponse"] === true && data.d[j]["CustomerRequestID"] === jobID) {
                        isAnyDriverHired = true;
                    }
                }
            }
            html += '<tr style="border-bottom:1px solid black !important;">';
            html += "<td style='width: 15%;height:35px;text-align:center;'>" + '&pound' + Fare + "</td>";
            html += "<td width='25%' align='center'>" + '<a class="pulse" style="color:blue;" onclick="showExpiry()">(Exp)</a>' + '<a style="color:blue;" class="pulse" onclick="showBid()">(Bid)</a>' + "</td>";
            if (spec != "" && spec != null && spec != "undefined")
                html += "<td width='10%' align='center'>" + '<img src="img/sc.png" class="pulse" width="15" height="15" style="color:grey;" onclick="SpecShow(\'' + spec + '\')"/>' + "</td>";
            else
                html += "<td width='10%' align='center'>" + '<img src="img/spec.png"  width="15" height="15" style="color:grey;" onclick="SpecShow(\'Not Available\')"/>' + "</td>";
            html += "<td width='20%' align='center'>" + bidh + ":" + bidm + "</td>";
            html += "</tr>";
            html += '<tr style="border-bottom:1px solid black !important;font-size: 11px;">';
            html += '<td style="width: 20%;text-align:left;border-bottom:1px solid black !important;">';
            html += '<a onclick="showRating(\'' + DriverID + '\')" style="color:blue; font-size: 17px;">' + DriverName + '</a><br/>';
            html += '<img src="' + DriverPhoto + '" style="max-width:50px;max-height:50px;border-radius:4px;" onclick=\"ShowLargeImage(this,\'\',\'\',\'\')\"/>';
            html += '</td>';
            html += '<td style="width: 20%;text-align:left;border-bottom:1px solid black !important;"><br/><img src="' + VehicleImages + '" style="max-width:50px;max-height:50px;border-radius:4px;" onclick="ShowLargeImage(this,\'\',\'\',\'\')\"/></td>';
            html += '<td style="width: 25%;text-align:left;border-bottom:1px solid black !important;"><input type="button" class="btn-tmp" value="Rating" onclick="showRating(\'' + DriverID + '\')"/></td>';
            if (Fare > 0) {
                if (CustResponse !== true) {
                    if (isAnyDriverHired === false) {
                        html += "<td style='width: 20%;text-align:center;border-bottom:1px solid black !important;'>" + '<input type="button" id="check" style="-webkit-appearance:none;-moz-appearance:none;width:43%;margin-right:69px"  class="accept-btn2" value="Hire" onclick="HireDriverBooking(\'' + jobID + '\',\'' + DriverID + '\')"/>' + "</td>";
                    }
                    else {
                        html += "<td style='width: 20%;text-align:center;border-bottom:1px solid black !important;'></td";
                    }
                }
                else {
                    html += "<td style='width: 20%;text-align:center;border-bottom:1px solid black !important;'>" + 'Awaiting driver response <span style="color:green; font-size:16px;">Or</span><br/><input type="button" id="check" style="-webkit-appearance:none;-moz-appearance:none;" class="rejectbtn" value="Cancel Driver" onclick="CancelDriver(\'' + jobID + '\',\'' + DriverID + '\')"/>' + "</td>";
                }
            }
            else {
                html += "<td style='width: 20%;text-align:center;border-bottom:1px solid black !important;'>Awaiting Bids</td>";
            }
            html += '</tr>';
        }
        html += '</tbody>';
        html += '</table>';
        $('#cabnowcustomerbookings').html('');
        $('#cabnowcustomerbookings').append(html);
    }
}



function doLogout() {
    navigator.notification.confirm(
    "Do you want to logout?",
    onLogoutCallback,
    "Confirm",
    "Yes, No"
    );

    function onLogoutCallback(buttonIndex) {
        if (buttonIndex === 2) {
            return false;
        }
        else if (buttonIndex === 1) {
            $.ajax({
                beforeSend: function () { showLoading(); },
                complete: function () { hideLoading(); },
                url: "http://192.168.1.22/ECabs/ECabs4U.asmx/logout",
                type: "POST",
                dataType: "Json",
                data: "{'userID':'" + userId + "'}",
                contentType: "application/json; charset=utf-8",
                success: function () {
                    console.log("ghjgjhgj");
                    clearAllTimerFunctions();

                    roleId = "";
                    relatedId = "";
                    userId = "";
                    console.log("2");
                    window.localStorage.setItem('remember', false);
                    window.localStorage.clear();
                    //  window.clearInterval(JobList22);
                    //clearInterval = JobList22;
                    app.application.navigate("#listview-WelcomeScreen");
                },
            });
        }
    }
}
function ShowDetailBooking(jobNo, driverid) {
    //$('body').css('overflow', 'hidden');
    var url = "http://192.168.1.22/ECabs/ECabs4U.asmx/GetCCabLaterBooking";
    $.ajax(url, {
        type: "POST",
        datatype: "json",
        data: "{'customerReqID':'" + jobNo + "', 'driverid':'" + driverid + "'}",
        contentType: "application/json; charset=utf-8",
        success: showCabNowDetail,
        error: function (XMLHttpRequest, textStatus, errorThrown) {

        }
    });
}
function showCabNowDetail(data) {
    $("#modalview-login123").kendoMobileModalView("open");
    // alert(data.d[0]);
    $('#lblJobNoforCustomer').text(": " + data.d[0]);
    $('#lblStartDate').text(": " + data.d[1]);
    $('#lblStartTime').text(": " + data.d[2]);
    $('#lblSearchTime').text(": " + data.d[3]);

}
function showExpiry() {
    $("#modalview-Expiry").kendoMobileModalView("open");
    getBidTimeData(searchTime, bidTime);
}
function showBid() {
    $("#modalview-BidExpiry").kendoMobileModalView("open");
    GetbidExpiryTime(searchTime, bidTime);
}
function GetbidExpiryTime(searchTime, bidTime) {
    var bid = bidTime.split(" ");
    var bidmin = bid[1].split(":");
    bidh = bidmin[0];
    bidm = bidmin[1];
    var bids = bidmin[2];
    if (bidm > 56) {
        bidh = parseInt(bidh) + 1;
        bidm = 00;
        if (bids === 00) {
            bidm = parseInt(bidm) + 1;
            bids = 00;
            $('#lblbid').text(bidmin[0] + ":" + bidmin[1]);
            $('#lblpick').text(bidh + ":" + bidm);
        }
        else {
            $('#lblbid').text(bidmin[0] + ":" + bidmin[1]);
            $('#lblpick').text(bidh + ":" + bidm);
        }
    }
    else {
        bidm = parseInt(bidm) + 3;
        if (bids === 00) {
            sm = parseInt(sm) + 1;
            ss = 00;
            $('#lblbid').text(bidmin[0] + ":" + bidmin[1]);
            $('#lblpick').text(bidh + ":" + bidm);
        }
        else {
            $('#lblbid').text(bidmin[0] + ":" + bidmin[1]);
            $('#lblpick').text(bidh + ":" + bidm);
        }
    }
}

function forgotPassRecovery() {
    app.application.navigate("#listview-ForgotPassword");
}
function forgotPasswordRecoveryReq() {
    $('#lblPasswordRecoveryMsg').text('');
    $('#txtEmailforPasswordRecovery').text('');
    var email = $('#txtEmailforPasswordRecovery').val();
    var regExpEmail = "^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})$";
    var usertype;
    var ischkdri = $('#Passwordtypedriver').is(':checked');
    var ischkcust = $('#PasswordtypeCustomer').is(':checked');
    var len = $('.user:checked').length;

    if (len == 0) {
        $('#lblPasswordRecoveryMsg').text("Please select user type.");
        $('#lblPasswordRecoveryMsg').css("color", "#D70007");
        return false;
    }
    if (email.length > 0) {
        if (email.match(regExpEmail)) {
            $('#lblPasswordRecoveryMsg').text(" ");
        }
        else {
            $('#lblPasswordRecoveryMsg').text("Please enter a valid email address.");
            $('#lblPasswordRecoveryMsg').css("color", "#D70007");
            return false;
        }
    }
    else if (email.length == 0) {
        $('#lblPasswordRecoveryMsg').text("Please enter email address.");
        $('#lblPasswordRecoveryMsg').css("color", "#D70007");
        return false;
    }
    if (ischkdri) {
        usertype = 3;
        alert("3");
    }
    else if (ischkcust) {
        usertype = 4;
        alert("4");

    }
    console.log(usertype);
    $.ajax({
        cache: false,
        beforeSend: function () { showLoading(); },
        complete: function () { hideLoading(); },
        url: "http://192.168.1.22/ECabs/ECabs4U.asmx/ForgotPassword",
        datatype: "json",
        type: "POST",
        data: "{'emailid':'" + email + "', 'usertype':'" + usertype + "'}",
        contentType: "application/json; charset=utf-8",
        success: CheckMsgPasswordRecovery,
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            //  alert(errorThrown);
        }
    });
}
function CheckMsgPasswordRecovery(data) {
    if (data.d == "false") {
        $('#lblPasswordRecoveryMsg').text("Incorrect email id or user type.");
        $('#lblPasswordRecoveryMsg').css("color", "#D70007");
        $('#lblPasswordRecoveryMsg').css("font-size", "13");
        $('#txtEmailforPasswordRecovery').val("");

    }
    else if (data.d == "false2") {
        $('#lblPasswordRecoveryMsg').text("Oops!! error occurs, please try again.");
        $('#lblPasswordRecoveryMsg').css("color", "#D70007");
        $('#lblPasswordRecoveryMsg').css("font-size", "13");
        $('#txtEmailforPasswordRecovery').val("");
    }
    else {
        $('#lblPasswordRecoveryMsg').text("Password recovered, please check your mail.");
        $('#lblPasswordRecoveryMsg').css("color", "#237F0C");
        $('#lblPasswordRecoveryMsg').css("font-size", "13");
        $('#txtEmailforPasswordRecovery').val("");
        app.application.navigate("#listview-WelcomeScreen");
    }
}


function forgotUserRecovery() {
    app.application.navigate("#listview-UserNameRecovery");
}
function forgotUserNameRecovery() {
    $('#lblUserNameMsg').text('');
    $('#txtUserNameEmail').text('');
    var regExpEmail = "^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})$";
    var email = $('#txtUserNameEmail').val();
    var usertype;
    var ischkdri = $('#Usernametypedriver').is(':checked');
    var ischkcust = $('#Usernamecustomerdriver').is(':checked');
    var len = $('.user:checked').length;

    if (len == 0) {
        $('#lblUserNameMsg').text("Please select user type.");
        $('#lblUserNameMsg').css("color", "#D70007");
        return false;
    }
    if (email.length > 0) {
        if (email.match(regExpEmail)) {
            $('#lblUserNameMsg').text(" ");
        }
        else {
            $('#lblUserNameMsg').text("Please enter a valid email address.");
            $('#lblUserNameMsg').css("color", "#D70007");
            return false;
        }
    }
    else if (email.length == 0) {
        $('#lblUserNameMsg').text("Please enter email address.");
        $('#lblUserNameMsg').css("color", "#D70007");
        return false;
    }
    if (ischkdri) {
        usertype = 3;
    }
    else if (ischkcust) {
        usertype = 4;
    }
    console.log(usertype);
    $.ajax({
        cache: false,
        beforeSend: function () { showLoading(); },
        complete: function () { hideLoading(); },
        url: "http://192.168.1.22/ECabs/ECabs4U.asmx/ForgotUsername",
        datatype: "json",
        type: "POST",
        data: "{'emailid':'" + email + "', 'usertype':'" + usertype + "'}",
        contentType: "application/json; charset=utf-8",
        success: CheckMsgForUsernameRecovery,
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            //alert(errorThrown);
        }
    });
}
function CheckMsgForUsernameRecovery(data) {
    if (data.d == "false") {
        $('#lblUserNameMsg').text("Incorrect email id or user type.");
        $('#lblUserNameMsg').css("color", "#D70007");
        $('#lblUserNameMsg').css("font-size", "13");
        $('#txtUserNameEmail').val("");

    }
    else if (data.d == "false2") {
        $('#lblUserNameMsg').text("Oops!! error occurs, please try again.");
        $('#lblUserNameMsg').css("color", "#D70007");
        $('#lblUserNameMsg').css("font-size", "13");
        $('#txtUserNameEmail').val("");
    }
    else {
        $('#lblUserNameMsg').text("Username recovered, please check your mail.");
        $('#lblUserNameMsg').css("color", "#237F0C");
        $('#lblUserNameMsg').css("font-size", "13");
        $('#txtUserNameEmail').val("");
        app.application.navigate("#listview-WelcomeScreen");
    }
}

function Registercustomer() {

    var txt1 = $('#txtCustomerFirstName').val();
    var txt2 = $('#txtCustomerLastName').val();
    var txt3 = $('#txtCustomerPhone').val();
    var txt4 = $('#txtCustomerEmail').val();
    //var txt5 =$('#txtPost').val();
    var txt6 = $('#txtCustomerUserName').val();
    var txt7 = $('#txtCustomerPassword').val();
    var txt8 = $('#txtCustomerConfirmPassword').val();
    var phoneno = /^\d{11}$/;
    var regExpEmail = /^([_a-zA-Z0-9_]+)(\.[_a-zA-Z0-9-]+)*@([a-zA-Z0-9-]+\.)+(\.[a-zA-Z0-9-]+)*([a-zA-Z]{2,4})$/;
    //var pass = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,16}$/;

    if (!txt1) {
        $('#lblRegistrationMsg').text("Please enter your first name.");
        $('#txtCustomerFirstName').focus();
        return false;
    }
    if (!txt2) {
        $('#lblRegistrationMsg').text("Please enter your last name.");
        $('#txtCustomerLastName').focus();
        return false;
    }
    if (txt3.length > 0) {
        if (phoneno.test(txt3)) {
            $('#lblRegistrationMsg').text(" ");
        }
        else {
            $('#lblRegistrationMsg').text("Please enter a valid Mobile number.");
            $('#txtCustomerPhone').focus();
            return false;
        }
    }
    else if (txt3.length == 0) {
        $('#lblRegistrationMsg').text("Please enter a Mobile number.");
        $('#txtCustomerPhone').focus();
        return false;
    }

    if (txt4.length > 0) {
        if (txt4.match(regExpEmail)) {
            $('#lblRegistrationMsg').text(" ");
        }
        else {
            $('#lblRegistrationMsg').text("Please enter a valid email address.");
            $('#txtCustomerEmail').focus();
            return false;
        }
    }
    else if (txt4.length == 0) {
        $('#lblRegistrationMsg').text("Please enter a email address.");
        $('#txtCustomerEmail').focus();
        return false;
    }
    if (!txt6) {
        $('#lblRegistrationMsg').text("Please enter username.");
        $('#txtCustomerUserName').focus();
        return false;
    }
    if (txt7.length > 0) {
        if (txt7.length < 8 && txt7.length > 20) {

            $('#lblRegistrationMsg').text("Password must be in between 8 to 20 characters.");
            $('#txt7').focus();
            return false;
        }
    }
    else {
        $('#lblRegistrationMsg').text("Please enter your password.");
        $('#txtCustomerPassword').focus();
        return false;
    }


    if (!txt8) {
        $('#lblRegistrationMsg').text("Please enter confirm password.");
        $('#txtCustomerConfirmPassword').focus();
        return false;
    }

    if (txt8.length > 0) {
        if (txt7 == txt8) {
            $('#lblRegistrationMsg').text("");
        }
        else {
            $('#lblRegistrationMsg').text("Password mismatch.");
            $('#txtCustomerPassword').focus();
            $('#txtCustomerPassword').val("");
            $('#txtCustomerConfirmPassword').val("");
            return false;
        }
    }

    $.ajax({
        cache: false,
        beforeSend: function () { showLoading(); },
        complete: function () { hideLoading(); },
        url: "http://192.168.1.22/ECabs/ECabs4U.asmx/RegisterCustomer",
        type: "POST",
        dataType: "json",
        data: "{ 'fname': '" + txt1 + "','lname': '" + txt2 + "','email': '" + txt4 + "','userID': '" + txt6 + "','password': '" + txt7 + "','contactNumber': '" + txt3 + "'}",
        contentType: "application/json; charset=utf-8",
        success: CheckDataforRegistration,
        error: function (XMLHttpRequest, textStatus, errorThrown) { }
    });
}

function CheckDataforRegistration(data) {
    if (data.d == "true") {
        var timeOut = 5;
        setInterval(function () {
            $('#divcustomerreg').hide();
            document.getElementById('divSucessfulcustomer').innerHTML = "Registration successful.";
            document.getElementById('divMsgcustomer').innerHTML = "Please wait " + --timeOut + "s for login screen.";
            if (timeOut <= 0) {
                app.application.navigate("listview-WelcomeScreen");
            }
        }, 1000);
    }
    else {
        $('#lblRegistrationMsg').text(data.d);
        $('#lblRegistrationMsg').css("color", "#D70007");
        $('#lblRegistrationMsg').css("font-size", "13");
    }
}

function CancelforgotPasswordRecoveryReq() {
    app.application.navigate("#listview-WelcomeScreen");
}


//Driver Home
function onbeforeDriverHomeshow() {
    hideLoading();
    // $('#divDeal').show();
    // $("#modalview-DriverJobDeal").kendoMobileModalView("open");
    $.ajax({
        url: "http://192.168.1.22/ECabs/ECabs4U.asmx/DriverAvaibalility",
        type: "POST",
        dataType: "Json",
        data: "{'relatedId':'" + relatedId + "'}",
        contentType: "application/json; charset=utf-8",
        success: ShowDataDriverStatus,
        error: function (XMLHttpRequest, textStatus, errorThrown) { }
    });
}

//Driver Status check(Engaged/Available)

function ShowDataDriverStatus(data) {
    for (var i = 0; i < data.d.length; i++) {

        if (data.d[0] === "True") {
            // alert("in1");
            // alert(data.d[1])

            if (data.d[1] === "True") {
                $('#btnJobDetails').show();
                $('#lblEngaged').show();
                $('#lblEngaged').text("Engaged");
                $('#btnEngage').hide();
                $('#btnabort').show();
                $('#btnclear').show();
                //notEnroutebutton show
                $('#btnnotEnroute').hide();

                $('#btnnavigation').show();
                $('#btnOffline').hide();

                $('#btnNormal').show();
                $('#btnPulsating').hide();

                // loadjscssfile("Common/UpdatePostcode.js", "js");
                upadatePostcode();
            }
            else if (data.d[1] === "False") {
                $('#btnJobDetails').show();
                $('#lblEngaged').show();
                $('#lblEngaged').text("Engaged");
                $('#btnEngage').hide();
                $('#btnabort').show();
                $('#btnclear').show();
                //notEnroutebutton show
                $('#btnnotEnroute').show();

                $('#btnnavigation').show();
                $('#btnOffline').hide();

                $('#btnNormal').show();
                $('#btnPulsating').hide();

                // loadjscssfile("Common/UpdatePostcode.js", "js");
                upadatePostcode();
            }

        }
        else {
            //alert("in2");
            $('#btnJobDetails').hide();
            $('#lblEngaged').show();
            $('#lblEngaged').text("Available");

            $('#btnEngage').show();
            $('#btnabort').hide();
            $('#btnclear').hide();
            $('#btnnotEnroute').hide();
            $('#btnnavigation').hide();
            $('#btnOffline').show();

            $('#btnNormal').show();
            $('#btnPulsating').hide();


        }


    }
}

function AbortJobDriverHome() {
    navigator.notification.confirm(
    "Do you want to abort this job?",
    onAbortCallbackDriverHome,
    "Confirm",
    "Yes,No"
    );
}

function onAbortCallbackDriverHome(buttonIndex) {
    if (buttonIndex === 2) {
        return false;
    }
    else if (buttonIndex === 1) {
        // $('#transparent_div').show();
        // //$('#btnOffline').show();
        // $('#popup_box1').show();
        // $('#divAbortTask').show();
        // $('#divJobDetails2').hide();
        $("#modalview-ForDriverHomeJobDetail").kendoMobileModalView("close");
        $("#modalview-AbortPopupDriverHome").kendoMobileModalView("open");
        $('#popup_boxDriverHome').fadeIn("fast");
        $('#divAbortTaskDriverHome').fadeIn("fast");

    }
}

function Offline() {
    navigator.notification.confirm(
    "Whilst unavailable you will not receive any 'Cab Now' job offers. Do you wish to continue?",
    onUnAvailableCallback,
    "Warning",
    'Yes,No'
    );
}

function onUnAvailableCallback(buttonIndex) {
    if (buttonIndex === 2) {
        return false;
    }
    else if (buttonIndex === 1) {
        $.ajax({
            url: "http://192.168.1.22/ECabs/ECabs4U.asmx/MakeOffline",
            type: "POST",
            dataType: "Json",
            data: "{'relatedId':'" + relatedId + "'}",
            contentType: "application/json; charset=utf-8",
            success: function (data) {
                $('#btnOffline').hide();
                $('#btnOnline').show();
                $('#lblStaus').show();
                $('#lblStaus').text("Unavailable");
                $('#lblStaus').css("color", "red");
                $('#lblEngaged').hide();
                $('#btnJobDetails').hide();

            },

            error: function (XMLHttpRequest, textStatus, errorThrown) { }
        });
    }
}

function Online() {
    $.ajax({
        url: "http://192.168.1.22/ECabs/ECabs4U.asmx/MakeOnline",
        type: "POST",
        dataType: "Json",
        data: "{'relatedId':'" + relatedId + "'}",
        contentType: "application/json; charset=utf-8",
        success: function (data) {
            $('#btnOffline').show();
            $('#btnOnline').hide();
            $('#lblStaus').hide();
            $('#btnJobDetails').hide();
            $('#lblEngaged').show();
        },

        error: function (XMLHttpRequest, textStatus, errorThrown) { }
    });
}


function SubmitAbortDriverHome() {
    var abortMessage = $('#txtAbortmsgDriverHome').val();
    if (!abortMessage) {
        navigator.notification.alert(
        "Please enter a reason.",
        abortValidation,
        'ECABS4U',
        "OK"
        );
        function abortValidation()
        { }
        return false;

    }
    var url = "http://192.168.1.22/ECabs/ECabs4U.asmx/AbortCurrentJob";

    $.ajax(url, {
        beforeSend: function () { showLoading(); },
        complete: function () { hideLoading(); },
        type: "POST",
        datatype: "json",
        data: "{'relatedId':'" + relatedId + "','abortMessage':'" + abortMessage + "'}",
        contentType: "application/json; charset=utf-8",
        success: function () {
            //if(data.d === "true")
            //{                            
            $('#popup_boxDriverHome').hide();
            $('#divAbortTaskDriverHome').hide();
            $("#modalview-AbortPopupDriverHome").kendoMobileModalView("close");
            $('#txtAbortmsgDriverHome').val("");

            navigator.notification.alert(
            "Job aborted successfully.",
            abortJobDone,
            'ECABS4U',
            "OK"
            );
            function abortJobDone() {
                //window.location = 'driverHome.html?id=' + userId + '&rid=' + roleId + '&rrid=' + relatedId;
                onbeforeDriverHomeshow();
            }
            //}                         
        },
    });
}

function cancelAbortDriverHome() {
    $('#popup_boxDriverHome').hide();
    $('#divAbortTaskDriverHome').hide();
    $('#txtAbortmsgDriverHome').val("");
    //$('#transparent_div').hide();
    $("#modalview-AbortPopupDriverHome").kendoMobileModalView("close");
}

function clearJob() {
    navigator.notification.confirm(
    "Can you confirm you have completed this job?",
    onClearCallback,
    "Confirm",
    "Yes,No"
    );
}

function onClearCallback(buttonIndex) {
    if (buttonIndex === 2) {
        return false;
    }
    else if (buttonIndex === 1) {
        showLoading();
        $('#btnOffline').show();
        $.ajax({
            url: "http://192.168.1.22/ECabs/ECabs4U.asmx/ClearDriverStatus",
            type: "POST",
            datatype: "json",
            data: "{'relatedId':'" + relatedId + "'}",
            contentType: "application/json; charset=utf-8",
            success: function (data) {
                if (data.d === true) {

                    // window.location = 'driverHome.html?id=' + userId + '&rid=' + roleId + '&rrid=' + relatedId;
                    $('#btnJobDetails').hide();
                    $('#lblEngaged').show();
                    $('#lblEngaged').text("Available");
                    onbeforeDriverHomeshow();
                    //app.application.navigate('#driverHome');
                    //var app = new kendo.mobile.Application();
                    //app.navigate("#driverHome");
                    //app.application.navigate('#driverHome', 'slide:right');
                    //onbeforeDriverHomeshow();


                }
            },
        });
    }
}

function ShowLaterJobOffers() {
    app.application.navigate('#driverCabLaterNowJobOffers');
}

function engageMe() {
    app.application.navigate('#driverCabLaterJobs');
}

var sec = 15;
//ERROR not en route button click
function notEnroute() {
    navigator.notification.confirm(
     "Please confirm your choice.",
      onErrorEnRoute22,
     "Confirm",
     " Not-EnRoute , Keep EnRoute  "
     );
}

function onErrorEnRoute22(buttonIndex) {
    if (buttonIndex === 2) {
        return false;
    }
    else if (buttonIndex === 1) {
        $('#divRejectJob').show();
        $("#modalview-EnroutePopupDriverHome").kendoMobileModalView("open");
        countDown();
    }
}

function countDown() {
    //alert('in');
    $("#transparent_div").show();
    if (sec < 10) $("#myTimer").text("0" + sec);
    else $("#myTimer").text(sec);

    if (sec <= 0) {

        //$("#myTimer").fadeTo(2500, 0);
        $('#btnOffline').show();
        $.ajax({
            url: "http://192.168.1.22/ECabs/ECabs4U.asmx/UnEngageDriver",
            type: "POST",
            datatype: "json",
            data: "{'relatedId':'" + relatedId + "'}",
            contentType: "application/json; charset=utf-8",
            success: function (data) {
                if (data.d === true) {
                    $('#divRejectJob').hide();
                    $("#modalview-EnroutePopupDriverHome").kendoMobileModalView("close");
                    $('#btnJobDetails').hide();
                    $('#lblEngaged').show();
                    $('#lblEngaged').text("Available");
                    $("#transparent_div").hide();
                    sec = 15;
                    app.application.navigate('#driverCabLaterJobs');

                    // window.location = 'DriverCabLaterJobs.html?id=' + userId + '&rid=' + roleId + '&rrid=' + relatedId;
                }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                alert(errorThrown);
            }
        });
        return;
    }
    sec -= 1;
    window.setTimeout(countDown, 1000);
}

function closeEnroutePopup() {
    $("#modalview-EnroutePopupDriverHome").kendoMobileModalView("close");
    sec = 15;
}
function upadatePostcode() {
    $.ajax({
        url: "http://192.168.1.22/ECabs/ECabs4U.asmx/GetPostcodeFetchTime",
        type: "POST",
        dataType: "Json",
        data: "",
        contentType: "application/json; charset=utf-8",
        success: DeviationTime,
        error: function (XMLHttpRequest, textStatus, errorThrown) { }
    });

    function DeviationTime(data) {
        var deviationTime = (data.d) * 1000;
        window.setInterval(UpdateCurrentDistrictCode, deviationTime);
    }

    function UpdateCurrentDistrictCode() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function (position) {
                var pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
                var geocoder = new google.maps.Geocoder();
                var latLng = pos;
                geocoder.geocode({ 'latLng': latLng }, function (results, status) {
                    if (status === google.maps.GeocoderStatus.OK) {
                        if (results[0]) {
                            var postalCode = extractFromAdress(results[0].address_components, "postal_code");
                            function extractFromAdress(components, type) {
                                for (var i = 0; i < components.length; i++)
                                    for (var j = 0; j < components[i].types.length; j++)
                                        if (components[i].types[j] === type)
                                            return components[i].long_name;
                                return "";
                            }
                            UpdateThis(postalCode);
                        }
                    }

                });
            });
        }
    }

    function UpdateThis(postalCode) {
        console.log('Updating district post');
        $.ajax({
            url: 'http://192.168.1.22/ECabs/ECabs4U.asmx/UpdateDistrictCode',
            type: "post",
            dataType: "json",
            data: "{'postalCode':'" + postalCode + "','relatedId':'" + relatedId + "'}",
            contentType: "application/json; charset=utf-8",
            success: function (data) { },
            error: function (XMLHttpRequest, textStatus, errorThrown) { }
        });
    }
}

function showJobDetails() {
    var url = "http://192.168.1.22/ECabs/ECabs4U.asmx/DriverEngagedJob";
    $.ajax(url, {
        type: "POST",
        datatype: "json",
        data: "{'driverId':'" + relatedId + "'}",
        contentType: "application/json; charset=utf-8",
        success: driverHomeshowJobDetail,
        error: function (XMLHttpRequest, textStatus, errorThrown)
        { }
    });
}
function makeCall() {
    var number = $('#lblCustomerContactforDriverHome').text();
    window.location.href = "tel:" + number;
}

function driverHomeshowJobDetail(data) {

    $("#modalview-ForDriverHomeJobDetail").kendoMobileModalView("open");

    $('#lblJobNoforDriverHome').text(": " + data.d[0]);
    $('#lblFareforDriverHome').html(": " + '&pound' + data.d[1]);
    $('#lblDateforDriverHome').text(": " + data.d[2]);
    //Conversion of time formate.

    var time = getProperTime(data.d[3]);
    $('#lblTimeforDriverHome').text(": " + time);

    $('#lblFromforDriverHome').text(": " + data.d[4]);
    $('#lblToforDriverHome').text(": " + data.d[5]);
    $('#lblCustomerNameforDriverHome').text(": " + data.d[6]);

    $('#lblCustomerContactforDriverHome').text(": " + data.d[7]);
    $('#lblCustomerContactforDriverHome').css("font-weight", 900);


    $('#lblDriverNameforDriverHome').text(": " + data.d[6]);

    $('#lblDriverContactforDriverHome').text(": " + data.d[7]);
    $('#lblDriverContactforDriverHome').css("font-weight", 900);


    $('#lblPassengersCountforDriverHome').text(": " + data.d[8]);


    if (data.d[13] !== "") {
        $('#driverrating').show();
        $('#starrating').raty({
            score: data.d[13], readOnly: true
        });
        console.log("stars=" + $('#hiddenstar').val());
    }
    else {
        $('#driverrating').hide();
    }
    if (data.d[9] !== "No Customer Feedback") {
        $('#labelline').show();
        $('#custFeedback').show();
        $('#lblCustomerFeedback').text(": " + data.d[9]);
    }
    else {
        $('#custFeedback').hide();
        $('#MyFeedback').hide();
        $('#labelline').hide();
    }


    if (data.d[10] !== "No Return") {
        $('#rtnfromDriverHome').show();
        $('#lblreturnfromDriverHome').text(": " + data.d[10]);
    }
    else {
        $('#rtnfromDriverHome').hide();
    }
    if (data.d[11] !== "No Return") {
        $('#rtntoDriverHome').show();
        $('#lblreturntoDriverHome').text(": " + data.d[11]);
    }
    else {
        $('#rtntoDriverHome').hide();
    }
    if (data.d[12] !== "No Driver Comments") {
        $('#MyFeedback').show();
        $('#labelline').show();
        $('#lblMyFeedback').text(": " + data.d[12]);
    }
    else {
        $('#MyFeedback').hide();
    }

    if (roleId == 4) {
        $("#trCustomerNameContact").hide();
        $("#trDriverNameContact").show();
    }
    else {
        $("#trCustomerNameContact").show();
        $("#trDriverNameContact").hide();
    }
    $("#modalview-AbortPopupDriverHome").kendoMobileModalView("close");
}
function Cancel() {
    $("#popup_box1").fadeOut("fast");
    $('#divJobDetails2').fadeOut("fast");
    $('#transparent_div').hide();
}


//Driver Profile
function SelectVehicle(vehAllocatedID) {
    var url = "http://192.168.1.22/ECabs/ECabs4U.asmx/SelectVehicleABC";
    $.ajax(url, {
        beforeSend: function () { showLoading(); },
        complete: function () { hideLoading(); },
        type: "POST",
        dataType: "Json",
        data: "{'vehAllocatedID':'" + vehAllocatedID + "','relatedId':'" + relatedId + "'}",
        contentType: "application/json; charset=utf-8",
        success: function (data) {
            if (data.d !== "") {
                getDrvProfile();
                jAlert("You have selected " + data.d + " to drive.", 'ECABS4U');
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) { }
    });
}

function GetHistory() {
    if (roleId == 4) {
        $('#DrvFooterHistory').hide();
        $('#CustomerFooterHistory').show();
    }
    else {
        $('#DrvFooterHistory').show();
        $('#CustomerFooterHistory').hide();
    }
    var tempRowCount = 0;
    var url = "http://192.168.1.22/ECabs/ECabs4U.asmx/GetHistory";
    $.ajax(url, {
        beforeSend: function () { showLoading(); },
        complete: function () { hideLoading(); },
        type: "POST",
        datatype: "json",
        data: "{'relatedId':'" + relatedId + "','roleId':'" + roleId + "'}",
        contentType: "application/json; charset=utf-8",
        success: function (data) {
            var count = data.d.length;
            if (count > 0) {
                var html = '<table id="tbhist" cellspacing="0"; cellpadding="0">';
                html += '<thead class="thead-grid">';
                html += '<tr>';
                html += '<th>JobNo</th>';

                html += '<th>Job Date</th>';
                html += '<th>Feedback</th>';
                html += '<th>Status</th>';
                html += '</tr>';
                html += '</thead>';
                html += '<tbody class="tbody-grid altColor">';
                var isRecentJob, isCabNow, isJobAlive, donotshowthisrow = false;
                for (var i = 0; i < count; i++) {
                    $('#lbljobFeed').text(data.d[i]["JobNo"]);
                    isCabNow = data.d[i]["isCabNow"];
                    isJobAlive = data.d[i]["isJobAlive"];
                    isRecentJob = data.d[i]["isRecentJob"];
                    donotshowthisrow = true;
                    if (roleId != 4)
                        if (isJobAlive == true)
                            donotshowthisrow = false;
                    if (donotshowthisrow) {
                        tempRowCount++;
                        html += '<tr>';
                        // html += "<td width='30%' height='35px' style='color:blue;' align='center'>" + data.d[i]["JobNo"];
                        html += "<td style='width:30%;height:35px;text-align:center;'>" + '<a  onclick="DriverCabLaterBookedJobDetail(\'' + data.d[i]["JobNo"] + '\')" style="color:blue;">' + data.d[i]["JobNo"] + '</a>';
                        if (isRecentJob && roleId == 4)
                            html += "<img src='img/StarBlinking.gif' style='height: 15px;float:right;position: fixed;'></img>";
                        html += "</td>";

                        html += "<td width='30%' height='35px' align='center'>" + data.d[i]["StartDate"] + "</td>";

                        html += "<td width='5%' height='35px' align='center'>" + '<img src="img/feedbackicon.png" onclick="JobDetailWithFeedback(\'' + data.d[i]["JobNo"] + '\',' + data.d[i]["isJobCompleted"] + ')"</img>' + "</td>"

                        html += "<td width='25%' height='35px' align='center'>";
                        if (data.d[i]["isJobCompleted"] == true)
                            html += '<label style="color:green">Completed</label>';
                        else {
                            if (isJobAlive == true) {
                                html += '<input type="button" class="reject-btn" value="' + (roleId != 4 ? 'Abort' : 'Cancel') + ' Job" onclick="AbortJob(\'' + data.d[i]["JobNo"] + '\')"/>';
                            }
                            else if (isJobAlive == false)
                                html += "<label style='color:red'>Cancelled</label>";
                        }
                        html += '</td></tr>';
                    }
                }
                html += '</tbody>';
                html += '</table>';
                $('#divHistory').html('');
                if (tempRowCount > 0)
                    $('#divHistory').append(html);
                else
                    $('#divNoHistory').show();
            }
            else {
                $('#divNoHistory').show();
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) { }
    });

}

function JobDetailWithFeedback(jobid, isJobCompleted) {
    if (!isJobCompleted) {
        jAlert("Feedback is not allowed for incomplete or cancelled jobs.", "ECabs4U");
    }
    else {
        var url = "http://192.168.1.22/ECabs/ECabs4U.asmx/JobDetailWithFeedback";
        $.ajax(url, {
            beforeSend: function () {
                showLoading();
            },
            complete: function () {
                hideLoading();
            },
            type: "POST",
            datatype: "json",
            data: "{'reqId':'" + jobid + "','roleId':'" + roleId + "'}",
            contentType: "application/json; charset=utf-8",
            success: showFeedbackHistory,
            error: function (XMLHttpRequest, textStatus, errorThrown) {
            }
        });
    }
}

function showFeedbackHistory(data) {
    $("#modalview-JobDetailHistory").kendoMobileModalView("open");
    jobID = data.d["jobNo"];
    $('#lblFeedJobNo').text(": " + data.d["jobNo"]);
    $('#lblFeedJobFare').html(": " + '&pound' + data.d["Fare"]);
    $('#lblFeedJobStartDate').text(": " + data.d["StartDate"]);
    //Conversion of time format.
    var time = getProperTime(data.d["StartTime"]);
    $('#lblFeedJobStartTime').text(": " + time);

    $('#lblFeedJobFrom').text(": " + data.d["FromLocation"]);
    $('#lblFeedJobTo').text(": " + data.d["ToLocation"]);
    $('#lblFeedContact').text(": " + data.d["MobileNumber"]);

    if (roleId == 4) {
        $('#lblName').text("Driver Name");
        $('#lblNameValue').text(": " + data.d["DriverName"]);
    }
    else {
        $('#lblName').text("Customer Name");
        $('#lblNameValue').text(": " + data.d["CustomerName"]);
    }


    $('#lblPassengersCountHistory').text(": " + data.d["NumberOfPassenger"]);

    if (data.d["ReturnFrom"] == "No Return" && data.d["ReturnTo"] == "No Return") {
        $('#trRtFrom').hide();
        $('#trRtTo').hide();
    }
    else {
        $('#trRtFrom').show();
        $('#lblFeedJobRtFrom').text(": " + data.d["ReturnFrom"]);
        $('#trRtTo').show();
        $('#lblFeedJobRtTo').text(": " + data.d["ReturnTo"]);
    }
    if (data.d["DriverComments"] == "No Driver Comments") {

    }
    $('#trStarRating').hide();

    if (data.d["DriverRating"] == "") {
        if (roleId == 4) {
            $('#trStarRating').show();
            $('#starrating').raty({
                target: '#hiddenstar',
                targetType: 'number',
                score: 0,
                click: function (score, evt) {
                    finalrating = score;
                },
                readOnly: false
            });
        }
    } else {
        $('#starrating').raty({
            score: data.d["DriverRating"], readOnly: true
        });
        $('#trStarRating').show();
    }

    $('#trCustomerFeedback').hide();
    $('#trDriverFeedback').hide();
    $('#trGiveComments').hide();
    $('#btnHistoryFeedOK').hide();
    $('#btnHistoryFeedPost').hide();
    $('#btnHistoryFeedCancel').hide();
    $('#lblValueCustomerFeedback').text(data.d["CustomerFeedback"]);
    $('#lblValueDriverFeedback').text(data.d["DriverFeedback"]);
    $('#txtarComments').val('');


    var df = data.d["DriverFeedback"] == "No Driver Feedback" ? "" : data.d["DriverFeedback"];
    var cf = data.d["CustomerFeedback"] == "No Customer Feedback" ? "" : data.d["CustomerFeedback"];

    if (cf == "") $('#trCustomerFeedback').hide();
    else $('#trCustomerFeedback').show();

    if (df == "") $('#trDriverFeedback').hide();
    else $('#trDriverFeedback').show();

    if (roleId == 4) {
        if (cf == "") {
            $('#trGiveComments').show();
            $('#btnHistoryFeedPost').show();
            $('#btnHistoryFeedCancel').show();
        }
        else
            $('#btnHistoryFeedOK').show();
    }
    else {
        if (df == "") {
            $('#trGiveComments').show();
            $('#btnHistoryFeedPost').show();
            $('#btnHistoryFeedCancel').show();
        }
        else
            $('#btnHistoryFeedOK').show();
    }

    if (roleId == 4) {
        $('#lblCustomerFeedback').text("My Comments");
        $('#lblDriverFeedback').text("Driver's Comments");
    }
    else {
        $('#lblCustomerFeedback').text("Customer's Comments");
        $('#lblDriverFeedback').text("My Comments");
    }
    $("#modalview-JobDetailWithFeedbackHistory").kendoMobileModalView("open");
}

function Makecall() {
    var number = $('#lblDriverContactforCustomerHistory').text();
    window.location.href = "tel:" + number;
}

function SubmitReject() {
    var jobNumber = $('#lblJobNumber').val();
    var abortMessage = $('#txtAbortmsg').val();
    if (!abortMessage) {
        jAlert('Please enter your reason.', 'ECabs4U-Abort Job');
        return false;
    }

    //TODO: write service to abort the job and send email to the customer
    var url = roleId == 4 ? "http://192.168.1.22/ECabs/ECabs4U.asmx/AbortCurrentJobCustomer" : "http://192.168.1.22/ECabs/ECabs4U.asmx/AbortCurrentJobDriver";

    $.ajax(url, {
        beforeSend: function () { showLoading(); },
        complete: function () { hideLoading(); },
        type: "POST",
        datatype: "json",
        data: "{'relatedId':'" + relatedId + "','abortMessage':'" + abortMessage + "','jobNumber':'" + jobNumber + "'}",
        contentType: "application/json; charset=utf-8",
        success: function (data) {
            if (data.d === "true") {

                $('#popup_box1').fadeOut("fast");
                $('#divAbortTask').fadeOut("fast");
                $('#txtAbortmsg').val("");
                $("#modalview-CancelCabPopup").kendoMobileModalView("close");
                jAlert("Job cancelled successfully.", 'ECABS4U');
                // app.application.navigate('#History');
                GetHistory();


            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) { }
    });
}

//feedback post for any both customer as well as driver
function PostFeedBack() {
    if (roleId == 4 && (finalrating == 0)) {
        jAlert('Please select rating.', 'ECabs4U');
        return false;
    }
    var getComments = $('#txtarComments').val();
    if (getComments.trim() == "") {
        jAlert('Please enter comments.', 'ECabs4U');
        return false;
    }

    $.ajax({
        url: "http://192.168.1.22/ECabs/ECabs4U.asmx/PostFeedback",
        beforeSend: function () { showLoading(); },
        complete: function () { hideLoading(); },
        type: "POST",
        dataType: "Json",
        data: "{'roleID':'" + roleId + "','relatedID':'" + relatedId + "','reqID':'" + jobID + "','rating':'" + finalrating + "','feedback':'" + getComments + "'}",
        contentType: "application/json; charset=utf-8",
        success: function (data) {
            jAlert("Feedback has been added successfully.", "ECabs4U", function () {
                closeModalView();
            });
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) { }
    });
}

//driver bids
//var BidList;
function onbeforeDriverBidsShow() {
    DriverBid();
    driverBidTimer = window.setInterval(DriverBid, 10000);

}

function DriverBid() {
    getCabNowJobs();
    getCabLaterJobs();

}

//CabLater bids
function getCabLaterJobs() {
    $.ajax({
        url: 'http://192.168.1.22/ECabs/ECabs4U.asmx/DriverCabLaterBooking',
        type: 'post',
        dataType: 'json',
        data: "{'relatedId':'" + relatedId + "'}",
        contentType: "application/json; charset=utf-8",
        success: function (data) {
            var count = data.d.length;
            var hasfare = false;
            if (count > 0) {
                var isCustomerAccepted = "";
                for (var i = 0; i < count; i++) {
                    if (data.d[i]["CustomerResponse"] === true) {
                        isCustomerAccepted = true;
                    }
                    if (data.d[i]["Fare"] !== null) {
                        hasfare = true;
                    }
                }
                if (hasfare) {
                    $('#cablaterdriverbookingsmsg').hide();
                    $('#cablaterdriverbookings').html("");

                    var html = '<table id="tbhist" cellspacing="0"; width="100%"  style="border-collaspe:collaspe;">';
                    html += '<thead class="thead-grid">';
                    html += '<tr>';
                    html += '<th>JobNo</th>';
                    //if(isCustomerAccepted === true)
                    {
                        html += '<th>Fare</th>';
                    }
                    html += '<th>From</th>';
                    html += '<th>To</th>';
                    html += '<th>Status</th>';
                    html += '</tr>';
                    html += '</thead>';
                    html += '<tbody class="altColor">';
                    for (var i = 0; i < count; i++) {

                        var customerID = data.d[i]["CustomerID"];
                        var fare = data.d[i]["Fare"];
                        if (fare !== null) {
                            isCustomerAccepted = data.d[i]["CustomerResponse"];
                            html += '<tr>';
                            html += "<td width='25%' height='30px' align='center' style='border-bottom:1px solid #0080FF;'>" + '<a  onclick="ShowDetailBookingLater(\'' + data.d[i]["CustomerRequestID"] + '\',\'' + data.d[i]["CustomerID"] + '\')" style="color:blue;">' + data.d[i]["CustomerRequestID"] + '</a>' + "</td>";
                            //if(isCustomerAccepted === true)
                            {
                                html += "<td width='15%' height='30px' align='center' style='border-bottom:1px solid #0080FF;'>" + '&pound' + data.d[i]["Fare"] + "</td>";
                            }
                            html += "<td width='25%' height='30px' align='center' style='border-bottom:1px solid #0080FF;'>" + data.d[i]["From"] + "</td>";
                            html += "<td width='25%' height='30px' align='center' style='border-bottom:1px solid #0080FF;'>" + data.d[i]["To"] + "</td>";
                            if (isCustomerAccepted === false) {
                                html += "<td colspan='2' style='width:25%;height:35px;text-align:center;border-bottom:1px solid #0080FF'>Awaiting customer response</td>";
                            }
                            else if (isCustomerAccepted === true) {
                                html += "<td colspan='2' style='border-bottom:1px solid #0080FF;'>"
                                     + '<input type="button" value="Accept" class="accept-btn" onclick="AcceptJob(\'' + data.d[i]["CustomerRequestID"] + '\',\'' + fare + '\')"/><br/><div style="height:3px"></div>'
                                     + '<input type="button" value="Reject" class="reject-btn" onclick="RejectJobLater(\'' + data.d[i]["CustomerRequestID"] + '\')"/>'
                                     + "</td>";
                            }

                            html += '</tr>';
                        }
                    }

                    html += '</tbody>';
                    html += '</table>';
                    // $('#cablaterdriverbookings').html('');
                    $('#cablaterdriverbookings').append(html);
                }
                else {
                    $('#cablaterdriverbookings').empty().append("");
                    $('#cablaterdriverbookingsmsg').show();

                }
            }
            else {
                $('#cablaterdriverbookings').empty().append("");
                $('#cablaterdriverbookingsmsg').show();
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) { }
    });
}

function ShowDetailBookingLater(data, customerid) {
    var url = "http://192.168.1.22/ECabs/ECabs4U.asmx/GetDCabLaterBooking";
    $.ajax(url, {
        type: "POST",
        datatype: "json",
        data: "{'customerReqID':'" + data + "', 'customerid':'" + customerid + "', 'relatedId':'" + relatedId + "'}",
        contentType: "application/json; charset=utf-8",
        success: showDetailLater,
        error: function (XMLHttpRequest, textStatus, errorThrown) { }
    });
}

function showDetailLater(data) {
    $("#modalview-CabLaterJobDetail").kendoMobileModalView("open");
    $('#lblCabLaterJobNo').text(": " + data.d[0]);
    $('#lblCabLaterFare').html(": " + '&pound' + data.d[1]);
    $('#lblCabLaterCustomerName').text(": " + data.d[2]);
    $('#lblCabLaterStartDate').text(": " + data.d[3]);
    $('#lblCabLaterStartTime').text(": " + data.d[4]);
    $('#lblCabLaterSearchTime').text(": " + data.d[5]);
    $('#lblCabLaterBidTime').text(": " + data.d[6]);
}


function RejectJobLater(data) {
    navigator.notification.confirm(
    "Confirm you want to reject this job offer?.",
    canceljobLater,
    'ECABS4U',
    "OK,Cancel"
    );

    function canceljobLater(buttonIndex) {
        if (buttonIndex === 2) {

            return false;
        }
        else if (buttonIndex === 1) {


            var rid = data;
            var status = "Bid rejected by driver for JobNo " + rid;
            $.ajax({
                beforeSend: function () {
                    showLoading();
                },
                complete: function () {
                    hideLoading();
                },
                url: "http://192.168.1.22/ECabs/ECabs4U.asmx/RejectResponse",
                type: "POST",
                dataType: "Json",
                data: "{'userID':'" + relatedId + "','reqid':'" + rid + "','status':'" + status + "'}",
                contentType: "application/json; charset=utf-8",
                success: function (data) {
                    $('body').css('overflow', 'auto');
                    //  alert("Job rejected successfully.");
                    //  window.location = 'DriverCabLaterBooking.html?id='+userId+'&rid='+roleId+'&rrid='+relatedId;
                    navigator.notification.alert(
                    "Job rejected successfully.",
                  Jobreject221,
                   'ECABS4U',
                    "OK"
                        );
                    function Jobreject221() {
                        app.application.navigate('#driverHome');
                    }
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                }
            });

        }
    }

}

function Confirmcommission() {
    $.ajax({
        beforeSend: function () {
            showLoading();
        },
        complete: function () {
            hideLoading();
            $("#modalview-CabCommissionPayment").kendoMobileModalView("close");
        },
        url: "http://192.168.1.22/ECabs/ECabs4U.asmx/CabJobBookedWithCommission",
        type: "POST",
        dataType: "Json",
        data: "{'userID':'" + relatedId + "','reqid':'" + jobID + "'}",
        contentType: "application/json; charset=utf-8",
        success: function (data) {
            if (data.d !== "") {
                var returnvalue = data.d;
                if (returnvalue.match(/"Error:"/g) > 0) {
                    jAlert(returnvalue, "ECabs4U", function () {
                        app.application.navigate('#driverHome');
                    });
                }
                else if (returnvalue.substring(0, 4) === "Job " || returnvalue.substring(0, 4) === "Plea") {
                    jAlert(data.d, "ECabs4U", function () {
                        app.application.navigate('#driverHome');
                    });
                }
                else {
                    jAlert("Sorry some error occurred during payment. Please try again or contact admin.", "ECabs4U", function () {
                        app.application.navigate('#driverHome');
                    });
                }
            }
            else {
                jAlert("Unable to do payment. Please try again.", "ECabs4U");
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            console.log("error occurred.");
        }
    });


}

//CabNow Bids
function getCabNowJobs() {
    $.ajax({
        url: 'http://192.168.1.22/ECabs/ECabs4U.asmx/DriverCabNowBooking',
        type: 'post',
        dataType: 'json',
        data: "{'relatedId':'" + relatedId + "'}",
        contentType: "application/json; charset=utf-8",
        success: bindBidsGridNow,
        error: function (XMLHttpRequest, textStatus, errorThrown) { }
    });
}

function bindBidsGridNow(data) {
    var count = data.d.length;
    if (count > 0) {
        $('#msg').html("");
        var isCustomerAccepted = "";
        for (var i = 0; i < count; i++) {
            if (data.d[i]["CustomerResponse"] === true) {
                isCustomerAccepted = true;
            }
        }

        $('#cabnowdriverbookingmsg').hide();
        $('#cabnowdriverbooking').html("");
        var html = '<table cellspacing="0">';
        html += '<thead class="thead-grid">';
        html += '<tr>';
        html += '<th>JobNo</th>';
        html += '<th>Fare</th>';
        html += '<th>From</th>';
        html += '<th>To</th>';
        html += '<th>Status</th>';
        html += '</tr>';
        html += '</thead>';
        html += '<tbody class="altColor">';
        for (var i = 0; i < count; i++) {

            isCustomerAccepted = data.d[i]["CustomerResponse"];
            var customerID = data.d[i]["CustomerID"];
            html += '<tr>';
            html += "<td width='25%' height='30px' align='center'>" + '<a onclick="ShowDetailBookingNow(\'' + data.d[i]["CustomerRequestID"] + '\',\'' + data.d[i]["CustomerID"] + '\')" style="color:blue;">' + data.d[i]["CustomerRequestID"] + '</a>' + "</td>";
            html += "<td width='10%' height='30px' align='center'>";
            html += data.d[i]["Fare"] != null ? '&pound' + data.d[i]["Fare"] : "--";
            html += "</td>";
            html += "<td width='25%' height='30px' align='center'>" + data.d[i]["From"] + "</td>";
            html += "<td width='25%' height='30px' align='center'>" + data.d[i]["To"] + "</td>";
            if (isCustomerAccepted === true) {
                html += "<td>"
                + '<input type="button" value="Accept" class="accept-btn" onclick="AcceptJob(\'' + data.d[i]["CustomerRequestID"] + '\',\'' + data.d[i]["Fare"] + '\')"/><br/><div style="height:3px"></div>'
                + '<input type="button" value="Reject" class="reject-btn" onclick="RejectJobNow(\'' + data.d[i]["CustomerRequestID"] + '\')"/>'
                + "</td>";
            }
            else if (isCustomerAccepted === false) {
                html += "<td width='10%' height='30px' align='center'>Awaiting customer response</td>";
            }
            html += '</tr>';
        }
        html += '</tbody>';
        html += '</table>';
        $('#cabnowdriverbooking').append(html);
    }
    else {
        $('#cabnowdriverbooking').empty().append("");
        $('#cabnowdriverbookingmsg').show();
    }
}
function AcceptJob(jobno, fare) {
    $("#modalview-CabCommissionPayment").kendoMobileModalView("close");
    jobID = jobno;
    $('#lblCommisionFare').html('&pound' + fare);
    $('#lblCommisionJobNo').text(jobno);
    if (fare >= 11) {
        $("#modalview-CabCommissionPayment").kendoMobileModalView("open");
        if (fare >= 11 && fare <= 20)
            $('#lblCommissionAmt').html('1');
        else if (fare >= 21)
            $('#lblCommissionAmt').html('5%');
    }
    else {
        $.ajax({
            beforeSend: function () {
                showLoading();
            },
            complete: function () {
                hideLoading();
            },
            url: "http://192.168.1.22/ECabs/ECabs4U.asmx/CabNowJobBooked",
            type: "POST",
            dataType: "Json",
            data: "{'userID':'" + relatedId + "','reqid':'" + jobID + "'}",
            contentType: "application/json; charset=utf-8",
            success: function (data) {
                if (data.d == "true") {
                    jAlert("Job booked successfully.", 'ECABS4U', function () {
                        app.application.navigate('#driverHome');
                    });
                }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                jAlert("Some error occurred during booking and payment. Please try again.", 'ECABS4U');
            }
        });
    }
}

function ShowDetailBookingNow(data, customerid) {
    var url = "http://192.168.1.22/ECabs/ECabs4U.asmx/GetDCabNowBooking";
    $.ajax(url, {
        beforeSend: function () { showLoading(); },
        complete: function () { hideLoading(); },
        type: "POST",
        datatype: "json",
        data: "{'customerReqID':'" + data + "', 'customerid':'" + customerid + "', 'relatedId':'" + relatedId + "'}",
        contentType: "application/json; charset=utf-8",
        success: showDetailNow,
        error: function (XMLHttpRequest, textStatus, errorThrown) {

        }
    });
}

function showDetailNow(data) {

    $("#modalview-CabLaterJobDetail").kendoMobileModalView("open");
    $('#lblCabLaterJobNo').text(": " + data.d[0]);
    $('#lblCabLaterFare').html(": " + '&pound' + data.d[1]);
    $('#lblCabLaterCustomerName').text(": " + data.d[2]);
    $('#lblCabLaterStartDate').text(": " + data.d[3]);
    $('#lblCabLaterStartTime').text(": " + data.d[4]);
    $('#lblCabLaterSearchTime').text(": " + data.d[5]);
    $('#lblCabLaterBidTime').text(": " + data.d[6]);
}


function RejectJobNow(data) {
    $('body').css('overflow', 'hidden');
    navigator.notification.confirm(
    "Confirm you want to reject this job offer?.",
    canceljobNow,
    'ECABS4U',
    "OK,Cancel"
    );

    function canceljobNow(buttonIndex) {
        if (buttonIndex === 2) {
            return false;
        }
        else if (buttonIndex === 1) {
            jobID = data;
            var status = "Bid rejected by driver for JobNo " + jobID;
            $.ajax({
                beforeSend: function () {
                    showLoading();
                },
                complete: function () {
                    hideLoading();
                },
                url: "http://192.168.1.22/ECabs/ECabs4U.asmx/RejectResponse",
                type: "POST",
                dataType: "Json",
                data: "{'userID':'" + relatedId + "','reqid':'" + jobID + "','status':'" + status + "'}",
                contentType: "application/json; charset=utf-8",
                success: function (data) {
                    $('body').css('overflow', 'auto');
                    // alert("Job rejected successfully.");
                    //  window.location = 'DriverCabLaterBooking.html?id='+userId+'&rid='+roleId+'&rrid='+relatedId;
                    navigator.notification.alert(
                        "Job rejected successfully.",
                      Jobreject222,
                       'ECABS4U',
                        "OK"
                            );
                    function Jobreject222() {
                        app.application.navigate('#driverHome');
                    }
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                }
            });


        }
    }

}

///Booking Hire Driver///
function HireDriverBooking(jobID, driverid) {
    navigator.notification.confirm("Are you sure to hire this driver?", hireDriverJob, 'ECABS4U', "OK,Cancel");
    function hireDriverJob(buttonIndex) {
        if (buttonIndex === 2) {
            return false;
        }
        else if (buttonIndex === 1) {
            DriverID = driverid;
            var url = "http://192.168.1.22/ECabs/ECabs4U.asmx/HireDriverResponse";
            $.ajax(url, {
                beforeSend: function () {
                    showLoading();
                },
                complete: function () {
                    hideLoading();
                },
                type: "POST",
                datatype: "json",
                data: "{'driverId':'" + DriverID + "','requestId':'" + jobID + "'}",
                contentType: "application/json; charset=utf-8",
                success: function (data) {
                    navigator.notification.alert('Cab selected. Waiting for your driver to confirm he will carry out this transfer.', cabSelected, 'ECABS4U', "OK");
                    function cabSelected() {
                        getCablaterBooking();
                        getCabnowBooking();
                        app.application.navigate("#customerBooking");
                    }
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                }
            });

        }
    }
}
function AbortJob(data) {
    var btnarray = ["Yes", "No"];
    jobID = data;
    $("#lblJobNumber").val(jobID);
    navigator.notification.confirm("Are you sure to cancel the current cab order?", onAbortCallback, "Confirm", btnarray);

    function onAbortCallback(btnIndex) {
        if (btnIndex === 2) {
            return false;
        }
        else if (btnIndex === 1) {
            $("#modalview-CancelCabPopup").kendoMobileModalView("open");
        }
    }
}





//Driver Job Offers var JobList;

function onbeforeDriverJobOffersList() {
    DriverJobOffer();
    JobOffersTimer = window.setInterval(DriverJobOffer, 10000);
}
function DriverJobOffer() {
    DriverCabNowJobList();
    getCablaterBookingJobList();
}

//For Later
function getCablaterBookingJobList() {


    var url = "http://192.168.1.22/ECabs/ECabs4U.asmx/GetCabLaterJobOffered";
    $.ajax(url, {
        type: "POST",
        datatype: "json",
        data: "{'relatedId':'" + relatedId + "'}",
        contentType: "application/json; charset=utf-8",
        success: bindGridLaterJobList,
        error: function (XMLHttpRequest, textStatus, errorThrown) { }
    });

}
function bindGridLaterJobList(data) {
    var count = data.d.length;
    if (count > 0) {
        //alert(count);
        $('#bookingmsgLaterJobList').hide();
        $('#msgLaterJobList').html("");
        var html = '<table id="tbhist" cellspacing="0"; width="100%">';
        html += '<thead class="thead-grid">';
        html += '<tr>';
        html += '<th>JobNo</th>';
        html += '<th>From</th>';
        html += '<th>To</th>';
        html += '<th>Status</th>';
        html += '</tr>';
        html += '</thead>';
        html += '<tbody class="altColor">';
        for (var i = 0; i < count; i++) {
            var isCustomerAccepted = data.d[i]["CustomerResponse"];
            var fare = data.d[i]["Fare"];

            $('#lbljobFeed').text(data.d[i]["JobNumber"]);

            if (isCustomerAccepted === "False" && fare === null) {
                html += '<tr>';
                html += "<td style='width:20%;height:35px;text-align:center;border-bottom:1px solid #0080FF'>" + data.d[i]["JobNumber"] + "</td>";
                html += "<td style='width:25%;height:35px;text-align:center;border-bottom:1px solid #0080FF'>" + data.d[i]["From"] + "</td>";
                html += "<td style='width:25%;height:35px;text-align:center;border-bottom:1px solid #0080FF'>" + data.d[i]["To"] + "</td>";


                html += "<td colspan='2' style='width:25%;height:35px;text-align:center;border-bottom:1px solid #0080FF'>"
                + '<input type="button" style="-webkit-appearance:none;-moz-appearance:none;" value="View" class="accept-btn" onclick="AcceptJobLaterList(\'' + data.d[i]["JobNumber"] + '\')"/><br/><div style="height:3px"></div>'
                + '<input type="button" style="-webkit-appearance:none;-moz-appearance:none;" value="Reject" class="reject-btn" onclick="CancelJobLaterList(\'' + data.d[i]["JobNumber"] + '\')"/>'
                + "</td>";
            }
            else if (isCustomerAccepted === "False") {
                html += '<tr>';
                html += "<td style='width:20%;height:35px;text-align:center;border-bottom:1px solid #0080FF'>" + data.d[i]["JobNumber"] + "</td>";
                html += "<td style='width:25%;height:35px;text-align:center;border-bottom:1px solid #0080FF'>" + data.d[i]["From"] + "</td>";
                html += "<td style='width:25%;height:35px;text-align:center;border-bottom:1px solid #0080FF'>" + data.d[i]["To"] + "</td>";
                html += "<td style='width: 20%;text-align:center;'>" + 'Awaiting driver response <span style="color:green; font-size:16px;">Or</span><br/>'
                     + '<input type="button" style="-webkit-appearance:none;-moz-appearance:none;" value="Reject" class="reject-btn" onclick="CancelJobLaterList(\'' + data.d[i]["JobNumber"] + '\')"/>'
                     + "</td>";


            }
        }
        html += '</tbody>';
        html += '</table>';
        $('#msgLaterJobList').append(html);
    }
    else {
        $('#msgLaterJobList').empty().append("");
        $('#bookingmsgLaterJobList').show();
    }

}

function AcceptJobLaterList(jobnumber) {

    $('#hdnJobno').val(jobnumber);
    jobID = jobnumber;
    app.application.navigate('#JobDetailsNotification');
    //window.location = 'DriverJob.html?id=' + userId + '&rid=' + roleId + '&rrid=' + relatedId + '&Jobid=' + jobnumber;
}

function CancelJobLaterList(jobnumber) {
    navigator.notification.confirm(
   "Do you really want to reject this job?",
    onClickReject22,
   "Confirm",
   "Yes,No"
   );

    function onClickReject22(buttonIndex) {
        if (buttonIndex === 2) {
            return false;
        }
        else if (buttonIndex === 1) {

            $.ajax({
                url: 'http://192.168.1.22/ECabs/ECabs4U.asmx/CancelNewJob',
                type: "POST",
                datatype: "json",
                data: "{'relatedId':'" + relatedId + "', 'jobnumber':'" + jobnumber + "'}",
                contentType: "application/json; charset=utf-8",
                success: function (data) {
                    //jAlert('Job cancelled successfully.', 'Alert');
                    // alert('Job cancelled successfully.');
                    //window.location='driverHome.html?id='+userId+'&rid='+roleId+'&rrid='+relatedId;
                    navigator.notification.alert(
                     'Job rejected successfully.',
                      jobCancelled22, // Specify a function to be called 
                      'ECABS4U',
                      "OK"
                          );
                    function jobCancelled22() {
                        // window.location = 'driverHome.html?id=' + userId + '&rid=' + roleId + '&rrid=' + relatedId;
                        onbeforeDriverJobOffersList();
                    }

                }
            });


        }

    }
}


//For Now
function DriverCabNowJobList() {
    //alert("in2");
    $.ajax({
        url: 'http://192.168.1.22/ECabs/ECabs4U.asmx/DriverCabNowBooking',
        type: 'post',
        dataType: 'json',
        data: "{'relatedId':'" + relatedId + "'}",
        contentType: "application/json; charset=utf-8",
        success: bindGridNowJobList,
        error: function (XMLHttpRequest, textStatus, errorThrown) { }
    });
}

function bindGridNowJobList(data) {
    var count = data.d.length;
    if (count > 0) {
        $('#bookingmsgNowJobList').hide();
        $('#msgNowJobList').html("");
        var isCustomerAccepted = "";
        var Bidfare = "";
        for (var i = 0; i < count; i++) {
            if (data.d[i]["CustomerResponse"] === true) {
                isCustomerAccepted = true;


            }
        }
        var html = '<table id="tbhist" cellspacing="0"; width="100%"  style="border-collaspe:collaspe;">';
        html += '<thead class="thead-grid">';
        html += '<tr>';
        html += '<th>JobNo</th>';
        //if (isCustomerAccepted === true) {
        //    html += '<th>Fare</th>';
        //}
        html += '<th>From</th>';
        html += '<th>To</th>';
        html += '<th>Status</th>';
        html += '</tr>';
        html += '</thead>';
        html += '<tbody class="altColor">';
        for (var i = 0; i < count; i++) {
            isCustomerAccepted = data.d[i]["CustomerResponse"];
            if (isCustomerAccepted === false) {
                var customerID = data.d[i]["CustomerID"];
                html += '<tr>';

                html += "<td style='width:20%;height:35px;text-align:center;border-bottom:1px solid #0080FF'>" + data.d[i]["CustomerRequestID"] + "</td>";
                // if (isCustomerAccepted === true) {
                //     html += "<td width='15%' height='30px' align='center'>" + '&pound' + data.d[i]["Fare"] + "</td>";
                // }
                html += "<td style='width:20%;height:35px;text-align:center;border-bottom:1px solid #0080FF'>" + data.d[i]["From"] + "</td>";
                html += "<td style='width:20%;height:35px;text-align:center;border-bottom:1px solid #0080FF'>" + data.d[i]["To"] + "</td>";

                if (isCustomerAccepted === false && data.d[i]["Fare"] === null) {
                    // html += "<td  colspan='2' width='10%' height='30px' align='center'>Awaiting customer response</td>";
                    html += "<td colspan='2' style='width:20%;height:35px;text-align:center;border-bottom:1px solid #0080FF'>"
                    + '<input type="button" style="-webkit-appearance:none;-moz-appearance:none;" value="Accept" class="accept-btn" onclick="seeRequestJobNow(\'' + data.d[i]["CustomerRequestID"] + '\')"/><br/><div style="height:3px"></div>'
                    + '<input type="button" style="-webkit-appearance:none;-moz-appearance:none;" value="Reject" class="reject-btn" onclick="closeRequestJobNow(\'' + data.d[i]["CustomerRequestID"] + '\')"/>'
                    + "</td>";
                }
                else {
                    html += "<td style='width: 20%;text-align:center;'>" + 'Awaiting driver response <span style="color:green; font-size:16px;">Or</span><br/>'
                    + '<input type="button" style="-webkit-appearance:none;-moz-appearance:none;" value="Reject" class="reject-btn" onclick="closeRequestJobNow(\'' + data.d[i]["CustomerRequestID"] + '\')"/>'
                    + "</td>";
                }
                html += '</tr>';
            }
        }
        html += '</tbody>';
        html += '</table>';
        $('#msgNowJobList').append(html);

    }
    else {
        $('#msgNowJobList').empty().append("");
        $('#bookingmsgNowJobList').show();

    }
}

function seeRequestJobNow(jobnumber) {
    jobID = jobnumber;
    app.application.navigate('#JobDetailsNotification');
}

function closeRequestJobNow(jobId) {
    navigator.notification.confirm(
   "Do you really want to reject this job?",
    onClickRejectNow,
   "Confirm",
   "Yes,No"
   );

    function onClickRejectNow(buttonIndex) {
        if (buttonIndex === 2) {
            return false;
        }
        else if (buttonIndex === 1) {
            $.ajax({
                url: 'http://192.168.1.22/ECabs/ECabs4U.asmx/CancelNewJobDNotification',
                type: "POST",
                datatype: "json",
                data: "{'relatedId':'" + relatedId + "','jobId':'" + jobId + "'}",
                contentType: "application/json; charset=utf-8",
                success: function () {
                    navigator.notification.alert(
                       'Job rejected successfully.',
                        jobCancelledNow22,
                        'ECABS4U',
                        "OK"
                            );
                    function jobCancelledNow22() {
                        onbeforeDriverJobOffersList();
                    }

                }
            });

        }
    }


}

//SearchList
function onbeforeSearchListShow() {
    $.ajax({
        url: "http://115.115.159.126/ecabs/ECabs4U.asmx/GetJobTimeOutTime",
        type: "POST",
        dataType: "Json",
        data: "{'requestID':'" + jobID + "'}",
        contentType: "application/json; charset=utf-8",
        success: JobExpiryTime,
        error: function (XMLHttpRequest, textStatus, errorThrown) { }
    });
    timerId = window.setInterval(getResponse, 10000);
    //$('#divNoDriver').hide();
    //$("#Searchbookingmsg244").hide();modalview-NoResponseDriver
    if (roleId == 4)
        $("#modalview-SearchJob").kendoMobileModalView("open");
    $("#Searchbookingmsg").hide();
    function JobExpiryTime(data) {
        timeOut = data.d;
        console.log(timeOut);
    }
    timer = setInterval(function () {
        --timeOut;
        if (timeOut <= 0) {
            window.clearInterval(timerId);
            window.clearInterval(timer);
            window.clearInterval(reinitiateCounter);
            $('#Searchbookingmsg').hide();
            navigator.notification.alert('No driver found Please search again.', noDriver1, 'ECABS4U', "OK");
            function noDriver1() {
                Destroy();
            }
        }
    }, 1000);

    var a = 0;
    function CheckJobCount() {
        a++;
        console.log(a);
        if (a === 60) {
            console.log("timer for 60s auto initiation");
            return true;
        }
        return false;
    }

    reinitiateCounter = setInterval(function () {

        var isTrue = CheckJobCount();
        if (isTrue) {
            SearchDriverAgain();
        }
    }, 1000);

}
function Destroy() {
    $("#modalview-NoResponseDriver").kendoMobileModalView("open");
    $('#NoDriverMessage').show();
    $('#NoResponseMessage').hide();
    $('#Searchbookingmsg').hide();
    window.clearInterval(timer);
    window.clearInterval(timerId);
    window.clearInterval(reinitiateCounter);
    $("#modalview-SearchJob").kendoMobileModalView("close");
    $('#loading').hide();
    $('#Searchmsg').hide();
}

function getResponse() {
    $.ajax({
        url: "http://115.115.159.126/ecabs/ECabs4U.asmx/GetResponseData",
        type: "POST",
        dataType: "Json",
        data: "{'requestID':'" + jobID + "'}",
        contentType: "application/json; charset=utf-8",
        success: getDriverData,
        error: function (XMLHttpRequest, textStatus, errorThrown) { }
    });
}
function SearchAgain() {
    $('#Searchbookingmsg').hide();
    $('#Searchmsg').show();
    window.clearInterval(timerId);
    timerId = window.setInterval(getResponse, 10000);
    anyMoreDriver = false;
    getResponse();
}

function getDriverData(data) {
    var count = data.d.length;
    console.log(count);

    if (count > 0) {
        window.clearInterval(timer);
        window.clearInterval(reinitiateCounter);
        $('#Searchbookingmsg').hide();
        $('#Searchmsg').show();
        DisplayDriverData();
    }
    else {
        $('#Searchmsg').empty().append("");
        $('#Searchmsg').hide();
        $('#Searchbookingmsg').show();
        $("#modalview-DriverHireReject").kendoMobileModalView("close")
        if (anyMoreDriver == false) {
            anyMoreDriver = true;
            jAlert('Sorry!!! No more driver available to hire. Please search again.', 'ECABS4U');
        }
    }

    function DisplayDriverData() {
        window.clearInterval(timer);
        window.clearInterval(reinitiateCounter);
        console.log('in display driver data');
        $('#Searchmsg').empty();
        $("#modalview-SearchJob").kendoMobileModalView("close");
        customerReqIdJOB = data.d[0]["CustomerRequestID"];

        var html = '<table width="100%" style="border-collapse:collapse;">';
        html += '<thead class="header-style">';
        html += '<tr style="background-color:lightgray; color:black;">';
        html += '<td style="width:20%;height:35px!important;padding-left:5px;font-size:18px" colspan="4">Job No - ' + customerReqIdJOB + '</td>';
        html += '<td style="width:20%;height:35px;text-align:center;" colspan="3"><input type="button" class="reject-btn" value="Cancel Job" style="width:98%;" onclick="CancelJobRequest(\'' + customerReqIdJOB + '\')"/></td>';
        html += '</tr>';
        html += '<tr>';
        html += '<th>Fare</th>';
        html += '<th>Date</th>';
        html += '<th>Specs</th>';
        html += '<th>ETA</th>';
        html += '<th></th>';
        html += '</tr>';
        html += '</thead>';
        html += '<tbody>';
        for (var i = 0; i < count; i++) {
            var driverID = data.d[i]["DriverID"];
            var customerReqId = data.d[i]["CustomerRequestID"];
            spec = data.d[i]["DriverSpecialReq"];
            searchTime = data.d[i]["SearchTime"];
            driverImgUrl = data.d[i]["DriverPicUrl"];
            vehImgUrl = data.d[i]["VehicleImageUrl"];
            console.log(driverImgUrl);
            console.log(vehImgUrl);
            bidTime = data.d[i]["BidTime"];
            getBidTimeData(searchTime, bidTime);
            html += '<tr>';
            html += "<td width='10%' align='center'> &pound " + data.d[i]["Fare"] + "</td>";
            html += "<td width='25%' align='center'>" + '<a class="pulse" style="color:blue;" onclick="showExpiry()">(Exp)</a> &nbsp; <a style="color:blue;" class="pulse" onclick="showBid()">(Bid)</a>' + "</td>";
            //html += "<td width='20%' align='center'>" + data.d[i]["CustomerRequestID"] + "</td>";
            html += "<td width='10%' align='center'><img width='15' height='15' style='color:grey;' ";
            if (spec != null)
                html += 'src="img/sc.png" class="pulse" onclick="SpecShow(\'' + spec + '\')"/>';
            else if (spec == null)
                html += 'src="img/spec.png" onclick="SpecShow(\'Not Available\')"/>';
            html += "</td>";
            html += "<td width='20%' align='center'>" + bidh + ":" + bidm + "</td>";
            html += "<td width='15%' align='center'>" + '<input type="button" class="disableBtn accept-btn" value="Hire" id= "' + driverID + '"';
            if (spec == null)
                html += '" onclick = "Hireme(\'' + driverID + '\',\'' + customerReqId + '\',\'Not Available\');"/>';
            else if (spec != null)
                html += '" onclick = "Hireme(\'' + driverID + '\',\'' + customerReqId + '\',\'' + spec + '\');"/>';
            html += "</td>";
            html += '</tr>';
            html += '<tr>';
            html += '<td style="width:100%;text-align:left;" colspan="2"><img src="' + driverImgUrl + '" style="max-width:50px;max-height:50px;border-radius:4px;" onclick=\"ShowLargeImage(this)\"/>'
            html += '<img src="' + vehImgUrl + '" style="max-width:50px;max-height:50px;border-radius:4px;" onclick=\"ShowLargeImage(this)\"/>'
            html += '<td style="width:100%;text-align:center;" colspan="2"><input type="button" class="btn-tmp" value="Rating" style="width:80%;" onclick="showRating( \'' + driverID + '\')"></td>';
            html += '</tr>';
        }
        html += '</tbody>';
        html += '</table>';
        html += '<br/>';
        html += '<div>';
        html += '<table>';
        html += '<tr>';
        html += '<td>';
        html += '<input type="button" id="searchAgain" class="reject-btn" value="InSufficient Drivers" onclick="SearchDriverAgain()"/>';
        html += '</td></tr>';
        html += '</table>';
        html += '</div>';
        $('#Searchmsg').show();
        $('#Searchbookingmsg').hide();
        $('#Searchmsg').append(html);
    }
}


function SearchDriverAgain() {
    $('#Searchmsg').empty();
    if (roleId == 4)
        $("#modalview-SearchJob").kendoMobileModalView("open");
    window.clearInterval(reinitiateCounter);
    $('#statusMessage').html("Searching for more drivers...");
    $('#statusMessage').css("color", "blue");
    $.ajax({
        url: "http://115.115.159.126/ecabs/ECabs4U.asmx/GetNewResponseData",
        type: "POST",
        dataType: "Json",
        data: "{'requestID':'" + jobID + "'}",
        contentType: "application/json; charset=utf-8",
        success: getDriverData,
        error: function (XMLHttpRequest, textStatus, errorThrown) { }
    });
}

function SpecialReqShow(specreq) {
    $("#modalview-DriverHireReject").kendoMobileModalView("open")
    $('#lblDriverSpecialReq').text(specreq);
    timerId = window.setInterval(getResponse, 10000);
}
function HireDriver() {
    $("#modalview-DriverHireReject").kendoMobileModalView("close")
    window.clearInterval(timerId);
    HireCurrentDriver();

}

function RejectDriver() {
    $("#modalview-DriverHireReject").kendoMobileModalView("close")
    //var driverId = dId;
    //var requestId = reqId;
    //var status = "Bid rejected by customer.";
    //$.ajax({
    //    url: "http://115.115.159.126/ecabs/ECabs4U.asmx/RejectResponseByCustomer",
    //    type: "POST",
    //    dataType: "Json",
    //    data: "{'userID':'" + driverId + "','reqid':'" + requestId + "','status':'" + status + "'}",
    //    contentType: "application/json; charset=utf-8",
    //    success: function (data) {
    //        getResponse();
    //        if (data.d === true) {
    //            $('#Searchbookingmsg').show();
    //        }
    //        else {
    //            console.log('Exception in RejectResponse');
    //            app.application.navigate('#driverHome');
    //        }
    //    },
    //});
}

function getResponseFromDriver(data) {
    checkDealResp = window.setInterval(checkDeal, 1000);    
}
function checkDeal() {
    $.ajax({
        url: "http://115.115.159.126/ecabs/ECabs4U.asmx/CheckdealResponse",
        type: "POST",
        dataType: "Json",
        data: "{'driverId':'" + DriverID + "','requestId':'" + jobID + "'}",
        contentType: "application/json; charset=utf-8",
        success: function (data) {
            var getBooked = data.d[2];
            if (getBooked === "True") {
                $.ajax({
                    url: "http://115.115.159.126/ecabs/ECabs4U.asmx/GetConfirmData",
                    type: "POST",
                    dataType: "Json",
                    data: "{'requestID':'" + jobID + "'}",
                    contentType: "application/json; charset=utf-8",
                    success: function (data) {
                        $('#loading').hide();
                        if (roleId == 4)
                            $("#modalview-CabBooked").kendoMobileModalView("open")
                        $('#lblCabBookedJobNo').text(data.d[0]);
                        $('#lblCabDriverName').text(data.d[1]);
                        $('#lblCabFrom').text(data.d[2]);
                        $('#lblCabTo').text(data.d[3]);
                        $('#lblCabDistanceTravel').text(data.d[4]);
                        $('#lblCabPickDate').text(data.d[5]);
                        $('#lblCabPickTime').text(data.d[6]);
                        $('#lblCabFare').text(data.d[7]);
                        $('#lblCabDriverPhoneNo').text(data.d[8]);
                        $('#divselect').hide();
                    },
                    complete: function () {
                        window.clearInterval(checkDealResp);
                    },
                    error: function (XMLHttpRequest, textStatus, errorThrown) {
                    }
                });
            }
            else if (getBooked === "False") {
                getResponseFalse();
                $('#loading').hide();
            }
            else if (getBooked === "") {
                jobs1 = window.setInterval(getResponseExpire, 200000);

            }
            else {
                $('#loading').show();
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) { }
    });

}


function getResponseFalse() {
    window.clearInterval(checkDealResp);
    $('#Searchmsg').hide();
    $("#Searchbookingmsg").show();
    $("#modalview-SearchJob").kendoMobileModalView("close");
}

function getResponseExpire() {
    window.clearInterval(checkDealResp);
    $('#loading').hide();
    window.clearInterval(jobs1);
    $('#Searchmsg').hide();
    $("#Searchbookingmsg").hide();
    $("#modalview-NoResponseDriver").kendoMobileModalView("open");
    $("#NoResponseMessage").show();
    $('#NoDriverMessage').hide();
}
function calOk() {
    $("#modalview-CabBooked").kendoMobileModalView("close");
    window.clearInterval(checkDealResp);
    navigator.notification.alert("Cab booked successfully.", cabBookedSuccess, 'ECABS4U', "OK");
    function cabBookedSuccess() {
        app.application.navigate('#History');
    }
}

function CancelJobRequest(jobid) {
    console.log('in cancelled job ' + jobid);
    cancelledJOb = jobid != '' ? jobid : '';
    jConfirm('Do you really want to cancel this job?', 'ECabs4U Confirmation', function (r) {
        onClickCancel(r);
    });
    //navigator.notification.confirm("", onClickCancel, "Confirm", "Yes,No");
}

function onClickCancel(isCancelTrue) {
    if (isCancelTrue == true) {
        window.clearInterval(timer);
        window.clearInterval(timerId);
        window.clearInterval(reinitiateCounter);
        $("#modalview-SearchJob").kendoMobileModalView("close");
        var cause = cancelledJOb == '' ? '' : "Job cancelled by customer.";
        DeleteJob(cause);
    }
}

function ReInitiateJob() {
    navigator.notification.confirm("Do you want to reinitiate this job?", onreinitiateCallback, "Confirm", "Yes,No");
}

function onreinitiateCallback(buttonIndex) {
    if (buttonIndex === 2) {
        return false;
    }
    else if (buttonIndex === 1) {
        window.clearInterval(timer);
        window.clearInterval(timerId);
        window.clearInterval(reinitiateCounter);
        $("#modalview-SearchJob").kendoMobileModalView("close");
        app.application.navigate('#search');
    }
}

function AlterJob() {   
    window.clearInterval(timer);
    window.clearInterval(timerId);
    window.clearInterval(reinitiateCounter);
    $('#statusMessage').html("Waiting for bids...");
    $('#statusMessage').css("color", "Black");
    $("#modalview-NoResponseDriver").kendoMobileModalView("close");
    app.application.navigate('#search');
}

function DeleteJob(cause) {
    $.ajax({
        beforeSend: function () { showLoading(); },
        complete: function () { hideLoading(); },
        url: "http://115.115.159.126/ecabs/ECabs4U.asmx/CancelCurrentJob",
        type: "POST",
        dataType: "Json",
        data: "{'requestID':'" + jobID + "','relatedId':'" + relatedId + "','cause':'" + cause + "'}",
        contentType: "application/json; charset=utf-8",
        success: function (data) {
            navigator.notification.alert(data.d, cabCancledSuccess, 'ECABS4U', "OK");

            function cabCancledSuccess() {
                $("#modalview-SearchJob").kendoMobileModalView("close");
                clearfields();
                app.application.navigate('#search');
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) { }
    });
}

function Hireme(driID, reqID, spec) {
    DriverID = driID;
    jobID = reqID;
    window.clearInterval(timerId);
    if (spec == "Not Available") {
        $("#modalview-DriverHireReject").kendoMobileModalView("close")
        HireCurrentDriver();
    }
    else {
        SpecialReqShow(spec);
    }
}

function HireCurrentDriver() {
    $('#loading').show();
    $.ajax({
        url: "http://115.115.159.126/ecabs/ECabs4U.asmx/HireDriverResponse",
        type: "POST",
        dataType: "Json",
        data: "{'driverId':'" + DriverID + "','requestId':'" + jobID + "'}",
        contentType: "application/json; charset=utf-8",
        success: getResponseFromDriver,
        error: function (XMLHttpRequest, textStatus, errorThrown) { }
    });
}

//Job Deatils On CheckNewJob Notification click//
function MyDetailsShow() {
    $('#txtbidFare').bind('keypress', function (e) {
        if ((e.keyCode < 48 || e.keyCode > 57) && e.keyCode !== 46) {
            e.stopPropagation();
            return false;
        }
    });
    $('.sourceValidation').keyup(function () {
        if (!this.value.match(/^([0-9]{0,3})$/)) {
            this.value = this.value.replace(/[^0-9]/g, '').substring(0, 2);
        }
    });
    $.ajax({
        url: 'http://192.168.1.22/ECabs/ECabs4U.asmx/CheckResponse',
        type: "POST",
        datatype: "json",
        data: "{'userID':'" + relatedId + "'}",
        contentType: "application/json; charset=utf-8",
        success: function (data) {
            if (data.d[0] !== "Error") {
                var getID = data.d[0];
                if (jobID !== "")
                    getID = jobID;

                var getValue = data.d[1];

                if (getValue === "False") {
                    $.ajax({
                        url: "http://192.168.1.22/ECabs/ECabs4U.asmx/GetData",
                        type: "POST",
                        dataType: "Json",
                        data: "{'userID':'" + getID + "', 'driverID':'" + relatedId + "'}",
                        contentType: "application/json; charset=utf-8",
                        success: function (data) {
                            if (data.d[0][0] !== null) {
                                $('#tbdetails').show();
                                $('#button-table').show();
                                $('#hdnJobno1').text(data.d[0][0]);
                                $('#lbljobnumber1').text(data.d[0][0]);
                                $('#lblFromLoc').text(data.d[0][1]);
                                $('#lblToLoc').text(data.d[0][2]);
                                $('#lblDistance').text(": " + data.d[0][5]);
                                $('#lblpickDateDriver').text(": " + data.d[0][6]);
                                $('#lblpickTime').text(": " + data.d[0][7]);
                                $('#hiddenIsCabnow').val(data.d[0][20]);
                                var hiddin = $('#hiddenIsCabnow').val();
                                if (hiddin == "True") {
                                    $('#trselectvehicle').hide();
                                    $('#lblpickTime').hide();
                                    $('#lblpickTimetext').show();
                                }
                                else {
                                    $('#lblpickTime').show();
                                    $('#lblpickTimetext').hide();
                                }

                                $('#lblpassengercount').text(": " + data.d[0][8]);
                                $('#lbllargecase').text(": " + data.d[0][9]);
                                $('#lblsmallcase').text(": " + data.d[0][10]);
                                $('#lblwheelchair').text(": " + data.d[0][11]);
                                $('#lblchildseat').text(": " + data.d[0][12]);
                                $('#lblchildbooster').text(": " + data.d[0][13]);

                                if (data.d[0][3] !== null) {
                                    $('#loc1').show();
                                    $('#lblLoc1').text(data.d[0][3]);
                                }
                                else
                                    $('#lblLoc1').text(null);

                                if (data.d[0][4] !== null) {
                                    $('#loc2').show();
                                    $('#lblLoc2').text(data.d[0][4]);
                                }
                                else
                                    $('#lblLoc2').text(null);

                                if (data.d[0][21] !== null) {
                                    $('#loc3').show();
                                    $('#lblLoc3').text(data.d[0][21]);
                                }
                                else
                                    $('#lblLoc3').text(null);

                                if (data.d[0][22] !== null) {
                                    $('#loc4').show();
                                    $('#lblLoc4').text(data.d[0][22]);
                                } else
                                    $('#lblLoc4').text(null);

                                if (data.d[0][23] !== null) {
                                    $('#loc5').show();
                                    $('#lblLoc5').text(data.d[0][23]);
                                }
                                else
                                    $('#lblLoc5').text(null);

                                if (data.d[0][24] !== null) {
                                    $('#loc6').show();
                                    $('#lblLoc6').text(data.d[0][24]);
                                } else
                                    $('#lblLoc6').text(null);

                                if (data.d[0][25] !== null) {
                                    $('#loc7').show();
                                    $('#lblLoc7').text(data.d[0][25]);
                                } else
                                    $('#lblLoc7').text(null);

                                $("#ddlselectedvehicle").empty();
                                for (var i = 0; i < data.d.length; i++) {
                                    $("#ddlselectedvehicle").append("<option value='" + data.d[i][26] + "'>" + data.d[i][27] + " - " + data.d[i][28] + "</option>");
                                }

                                if (data.d[0][14] === "True") {
                                    $('#lblisReturnJourney').text(": " + "Yes");
                                    if (data.d[0][15] !== null) {
                                        $('#returnTo').show();
                                        $('#lblrtnto2').text(": " + data.d[0][16]);
                                    } else
                                        $('#returnTo').hide();

                                    if (data.d[0][16] !== null) {
                                        $('#returnFrom').show();
                                        $('#lblreturnfro').text(": " + data.d[0][15]);
                                    } else
                                        $('#returnFrom').hide();

                                    if (data.d[0][17] !== null) {
                                        $('#returnDate').show();
                                        $('#lblreturnDate').text(": " + data.d[0][17]);
                                    } else
                                        $('#returnDate').hide();

                                    if (data.d[0][18] !== null) {
                                        $('#returnTime').show();
                                        $('#lblreturnTime').text(": " + data.d[0][18]);
                                    } else
                                        $('#returnTime').hide();

                                }
                                else if (data.d[0][14] === "False")
                                    $('#lblisReturnJourney').text(": " + "No");

                                if (data.d[0][19] !== null) {
                                    $('#trSpecialtxt').show();
                                    $('#trOtherspec').show();
                                    $('#otherReq').text(data.d[0][19]);
                                } else {
                                    $('#trOtherspec').hide();
                                    $('#trSpecialtxt').hide();
                                }

                                if (data.d[0][3] !== null) {
                                    var sec = data.d[0][3];
                                    $('#lblpopthird').text(sec);
                                    $('#otherLoc').show();
                                    if (data.d[0][4] !== null) {
                                        var third = data.d[0][4];
                                        $('#lblpopfour').text(third);
                                        $('#otherLoc').show();
                                    }
                                } else
                                    $('#otherLoc').hide();

                            }
                            else {
                                $('#tbdetails').hide();
                                jAlert("Sorry, this job has been passed out some time before.", 'ECABS4U', function () {
                                    app.application.navigate("#driverHome");
                                });
                            }
                        },
                        error: function (XMLHttpRequest, textStatus, errorThrown) {
                            $('#tbdetails').hide();
                            jAlert("We are extremely sorry for your inconvenience due to some error occurred in the system.", 'ECABS4U', function () {
                                app.application.navigate("#driverHome");
                            });
                        }
                    });
                } else if (data.d[0][0] === "Error") {
                    $('#tbdetails').hide();
                    jAlert("Sorry, this job has been passed out some time before.", 'ECABS4U', function () {
                        app.application.navigate("#driverHome");
                    });
                }
            }
            else {
                $('#tbdetails').hide();
                $('#jobPassed').show();
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            $('#tbdetails').hide();
            jAlert("Sorry, this job has been passed out some time before.", 'ECABS4U', function () {
                app.application.navigate("#driverHome");
            });
        }
    });



};


//Job Details Bid//
function showDriverBidDetails() {
    $("#modalview-MakeBid").kendoMobileModalView("open");
    $('#trmakebid').show();
    var job = $('#lbljobnumber1').text();
    var distance = $('#lblDistance').text();
    var from = $('#lblFromLoc').text();
    var to = $('#lblToLoc').text();
    $('#lblbidjob').text(job);
    $('#lblbiddistance').text(distance);
    $('#lblbidfrom').text(from);
    $('#lblbidto').text(to);
    var fare = $('#txtbidFare').val();
    $('#lblfare').text(fare);
    //Return data 
    //Bid popup
    var returnfrom = $('#lblreturnfro').text();
    var returnto = $('#lblrtnto2').text();

    if (!returnfrom) {
        $('#trreturnfrom').hide();
    }
    else {
        $('#lblbidreturnfrom').text(returnfrom);
    }
    if (!returnto) {
        $('#trreturnto').hide();

    }
    else {
        $('#lblbidreturnto').text(returnto);
    }


    $('#lblbidjob').text(job);
    $('#lblbiddistance').text(distance);
    $('#lblbidfrom').text(from);
    $('#lblbidto').text(to);
    var fare = $('#txtbidFare').val();
    $('#lblfare').text(fare);

    $('#txtbidFare').val('');
    $('#txtSpecialReq1').val('');

}
function bidCancel() {
    $("#modalview-MakeBid").kendoMobileModalView("close");
    $('#trmakebid').hide();
}

function bidSubmit() {

    isCabNow = $('#hiddenIsCabnow').val();
    var selectedvehicle = document.getElementById("ddlselectedvehicle");
    var selectedcab = selectedvehicle.options[selectedvehicle.selectedIndex].value;

    var fare = $('#txtbidFare').val();
    if (fare.length <= 0 || parseInt(fare.trim()) == 0 || fare.charAt(0) == "0") {
        jAlert('Please enter correct fare amount.');
        return false;
    }

    jobID = $('#lbljobnumber1').text();
    var distance = $('#lblDistance').text();
    From = $('#lblFromLoc').text();
    To = $('#lblToLoc').text();
    spec = $('#txtSpecialReq1').val();
    $('#lblbidjob').text(jobID);
    $('#lblbiddistance').text(distance);
    $('#lblbidfrom').text(From);
    $('#lblbidto').text(To);

    $('#lblfare').text(fare);

    $('#trmakebid').hide();
    $.ajax({
        beforeSend: function () { showLoading(); },
        complete: function () { hideLoading(); },
        url: "http://115.115.159.126/ECabs/ECabs4U.asmx/setDriverResponse",
        type: "POST",
        dataType: "Json",
        data: "{'userID':'" + relatedId + "','reqid':'" + jobID + "','isCabnow':'" + isCabNow + "','price':'" + fare + "','specialReq':'" + spec + "','selectedVehicle':'" + selectedcab + "'}",
        contentType: "application/json; charset=utf-8",
        success: function (data) {
            if (isCabNow == "True") {
                if (fare.length > 0)
                    SubmitDeal();
            }
            else if (isCabNow == "False") {
                if (data.d == true) {
                    hideLoading();
                    jAlert("In progress. Awaiting customer response.", 'ECABS4U', function () {
                        jobCheckTime = setInterval(CheckNewJob, 5000);
                        app.application.navigate("#driverHome")
                    });
                }
                else if (data.d == false) {
                    jAlert("Unknown error. Please try again.", 'ECABS4U', function () {
                        jobCheckTime = setInterval(CheckNewJob, 5000);
                        app.application.navigate("#driverHome")
                    });
                }
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            jobCheckTime = setInterval(CheckNewJob, 5000);
            console.log("Exception in BidSubmit");
        }
    });

    $("#modalview-MakeBid").kendoMobileModalView("close");
}
var timereOut;
function SubmitDeal() {
    $("#modalview-divJobDetail").kendoMobileModalView("close");
    $("#modalview-driverAwaitingForCustomer").kendoMobileModalView("open");
    timereOut = window.setInterval(function () {
        $("#modalview-MakeBid").kendoMobileModalView("close");
        //$("#modalview-DriverJobDeal").kendoMobileModalView("close");

        $.ajax({
            url: "http://192.168.1.22/ECabs/ECabs4U.asmx/DealResponse",
            type: "POST",
            dataType: "Json",
            data: "{'userID':'" + relatedId + "', 'jobNo':'" + jobID + "'}",
            contentType: "application/json; charset=utf-8",
            success: function (data) {
                jobID = data.d[0];
                var popUpDisplay = data.d[1];
                var customerResponse = data.d[2];
                var isJobAlive = data.d[3];
                if (popUpDisplay === "False") {
                    $.ajax({
                        url: "http://192.168.1.22/ECabs/ECabs4U.asmx/GetDealData",
                        type: "POST",
                        dataType: "Json",
                        data: "{'JobNo':'" + jobID + "','driverId':'" + relatedId + "'}",
                        contentType: "application/json; charset=utf-8",
                        success: function (data) {
                            //alert("do");
                            if (data.d[0] !== "Error" && isJobAlive === "True") {
                                console.log("In 1");
                                $("#modalview-driverAwaitingForCustomer").kendoMobileModalView("close");
                                //$('#divDeal').show();
                                $('#lbldealjob').text(data.d[0]);
                                $('#lbldealfrom').text(data.d[1]);
                                $('#lbldealto').text(data.d[2]);
                                $('#lbldealdistance').text(data.d[3]);
                                $('#lbldealdate').text(data.d[4]);
                                $('#lbldealtime').text(data.d[5]);
                                $('#lbldealfare').text(data.d[6]);
                                $('#isReturnJourney').val(data.d[7]);
                                var returnfromdeal = $('#lblreturnfro').text();
                                var returntodeal = $('#lblrtnto2').text();
                                var returnDatedeal = $('#lblreturnDate').text();
                                var returnTimedeal = $('#lblreturnTime').text();
                                if (!returnfromdeal || !returntodeal) {
                                    $('#rdealFrom').hide();
                                    $('#rdealTo').hide();
                                    $('#rdealDate').hide();
                                    $('#rdealTime').hide();
                                }
                                else {
                                    $('#rdealFrom').show();
                                    $('#rdealTo').show();
                                    $('#rdealDate').show();

                                    $('#rdealTime').show();
                                    $('#lbldealreturnFrom').text(returnfromdeal);
                                    $('#lbldealreturnTo').text(returntodeal);
                                    $('#lbldealreturnDate').text(returnDatedeal);
                                    $('#lbldealreturnTime').text(returnTimedeal);
                                }
                                $("#modalview-DriverJobDeal").kendoMobileModalView("open");
                            }
                            else if (data.d[0] === "Error") {
                                console.log("In 2");
                                $("#modalview-MakeBid").kendoMobileModalView("close");
                                $("#modalview-DriverJobDeal").kendoMobileModalView("close");
                                $("#modalview-driverAwaitingForCustomer").kendoMobileModalView("open");
                            }
                        },
                        error: function (XMLHttpRequest, textStatus, errorThrown) {
                        }
                    });

                }
                else {
                    console.log("In 3");
                    $.ajax({
                        url: "http://192.168.1.22/ECabs/ECabs4U.asmx/JobStatus",
                        type: "POST",
                        dataType: "Json",
                        data: "{'JobNo':'" + jobID + "','driverId':'" + relatedId + "'}",
                        contentType: "application/json; charset=utf-8",
                        success: function (data) {
                            console.log(data.d)
                            if (data.d === "False") {
                                $("#modalview-driverAwaitingForCustomer").kendoMobileModalView("close");
                                $('#button-table').hide();
                                jAlert("Sorry, you have not been selected for this job.", 'ECABS4U', function () {
                                    DestroyMe();
                                    $('#tbdetails').hide();
                                    $('#button-table').hide();
                                    app.application.navigate("#driverHome");
                                });
                            }
                        },
                    });
                }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                console.log("In 4");
                $("#modalview-DriverJobDeal").kendoMobileModalView("close");
                DestroyMe();
                $('#divDealload').hide();
            }
        });
    }, 15000);


}
function DestroyMe() {
    $("#modalview-DriverJobDeal").kendoMobileModalView("close");
    window.clearInterval(timereOut);
}

function RejectCommission() {
    $("#modalview-CabCommissionPayment").kendoMobileModalView("close");
    jobID = $('#hdnJobno1').val();
    var status = jobID + " Rejected at commission time.";
    $.ajax({
        url: "http://192.168.1.22/ECabs/ECabs4U.asmx/RejectResponse",
        type: "POST",
        dataType: "Json",
        data: "{'userID':'" + relatedId + "','reqid':'" + jobID + "','status':'" + status + "'}",
        contentType: "application/json; charset=utf-8",
        success: function (data) {
            app.application.navigate("#driverHome");
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) { }
    });
}

function btnAbort() {
    $("#modalview-MakeBid").kendoMobileModalView("open");
    $("#modalview-divabort").kendoMobileModalView("open");
}
function abortcancel() {
    $("#modalview-MakeBid").kendoMobileModalView("close");
    $("#modalview-divabort").kendoMobileModalView("close");
}
function dealSubmit() {
    window.clearInterval(timereOut);
    $("#modalview-DriverJobDeal").kendoMobileModalView("close");
    var getIsReturnJourney = $('#isReturnJourney').val();
    var getFare = $('#lbldealfare').text();
    jobID = $('#lbldealjob').text();
    if (getFare >= 11)
        AcceptJob(jobID, getFare);
    else
        SaveDataOfCurrentJob();
}
function SaveDataOfCurrentJob() {
    $.ajax({
        beforeSend: function () { showLoading(); },
        complete: function () { hideLoading(); },
        url: "http://192.168.1.22/ECabs/ECabs4U.asmx/SaveData",
        type: "POST",
        dataType: "Json",
        data: "{'driverId':'" + relatedId + "','requestId':'" + jobID + "'}",
        contentType: "application/json; charset=utf-8",
        success: function (data) {
            if (data.d == true) {
                $.ajax({
                    url: "http://192.168.1.22/ECabs/ECabs4U.asmx/JobBooked",
                    beforeSend: function () { showLoading(); },
                    complete: function () { hideLoading(); },
                    type: "POST",
                    dataType: "Json",
                    data: "{'userID':'" + relatedId + "','reqid':'" + jobID + "'}",
                    contentType: "application/json; charset=utf-8",
                    success: function () {
                        $('#button-table').hide();
                        jAlert("Congratulations! We recommend you contact the customer directly to confirm the pickup details.", 'ECABS4U');
                        app.application.navigate("#driverHome");
                    },
                });
            }
        },
    });
}
function closeCommission() {
    $("#modalview-CabCommissionPayment").kendoMobileModalView("close");
    var viewid = app.application.view().id;
    if (viewid != "#driverBids") {
        $("#modalview-DriverJobDeal").kendoMobileModalView("open");
    }
}
//Reject Job Starts
function reqReject(sendToCustomer) {
    navigator.notification.confirm("Do you want to reject the job?", onRejectCallback, "Confirm", "Yes,No");

    function onRejectCallback(buttonIndex) {
        if (buttonIndex === 2) {
            return false;
        }
        else if (buttonIndex === 1) {
            DestroyMe();
            var status = "";
            if (isCabNow === "False")
                status = "Bid rejected by driver for JobNo " + rid + ".";
            if (sendToCustomer === 1)
                status = "";
            $.ajax({
                beforeSend: function () {
                    showLoading();
                },
                complete: function () {
                    hideLoading();
                },
                url: "http://192.168.1.22/ECabs/ECabs4U.asmx/RejectResponse",
                type: "POST",
                dataType: "Json",
                data: "{'userID':'" + relatedId + "','reqid':'" + jobID + "','status':'" + status + "'}",
                contentType: "application/json; charset=utf-8",
                success: function (data) {
                    $("#modalview-driverAwaitingForCustomer").kendoMobileModalView("close");
                    jobCheckTime = setInterval(CheckNewJob, 5000);
                    app.application.navigate("#driverHome");
                },
            });
        }
    }

}
//Reject Job Ends

function jobPassed() {
    $("#jobPassed").hide();
    jobCheckTime = setInterval(CheckNewJob, 5000);
    app.application.navigate("#driverHome");
}
//Job Details Bid End Here//




//Customer Failed Job
function onbeforeCustomerFailedJob() {
    $.ajax({
        url: "http://192.168.1.22/ECabs/ECabs4U.asmx/GetFailedJobs",
        datatype: "JSON",
        type: "POST",
        data: "{'relatedId':'" + relatedId + "','role':'" + roleId + "'}",
        contentType: "application/json; charset=utf-8",
        success: CustomerFailedJobDisplayResult
    });
}

function CustomerFailedJobDisplayResult(data) {
    var count = data.d.length;
    if (count > 0) {
        $('#CustomerFailedbookingmsg').hide();
        $('#msgCustomerFailedJob').html("");

        var html = '<table id="tbhist" cellspacing="0"; width="100%"  style="border-collaspe:collaspe;">';
        html += '<thead class="thead-grid">';
        html += '<tr>';
        html += '<th>JobNo</th>';
        html += '<th>From</th>';
        html += '<th>To</th>';
        html += '<th>Status</th>';
        html += '</tr>';
        html += '</thead>';
        html += '<tbody class="tbody-grid altColor">';
        for (var i = 0; i < count; i++) {
            var jobno = data.d[i]["JobNumber"];
            var from = data.d[i]["From"];
            var to = data.d[i]["To"];
            html += '<tr>';
            html += "<td width='15%' height='30px' align='center'>" + jobno + "</td>";
            html += "<td width='25%' height='30px' align='center'>" + from + "</td>";
            html += "<td width='25%' height='30px' align='center'>" + to + "</td>";
            html += "<td width='30%' height='30px' align='center'>"
                 + '<input type="button" style="-webkit-appearance:none;-moz-appearance:none;" class="accept-btn" value="Re-initialize" onclick="customerFailedInitiateJob(\'' + jobno + '\')"/>' + '<br/>'
                 + '<input type="button" style="-webkit-appearance:none;-moz-appearance:none;" class="reject-btn" value="Cancel" onclick="customerFailedCancelJob(\'' + jobno + '\')"/>'
             + "</td>";
            html += '</tr>';
        }
        html += '</tbody>';
        html += '</table>';
        $('#msgCustomerFailedJob').append(html);
    }
    else {
        $('#msgCustomerFailedJob').empty().append("");
        $('#CustomerFailedbookingmsg').show();

    }
}

function customerFailedInitiateJob(reqID) {
    requestID = reqID;
    app.application.navigate('#customerSearchList');

    // window.location = 'customerSearchList.html?id=' + userId + '&rid=' + roleId + '&rrid=' + relatedId + '&reqid=' + reqID;
}

function customerFailedCancelJob(jobno) {
    var cause = "Not opted for re-initiate";
    $.ajax({
        url: "http://192.168.1.22/ECabs/ECabs4U.asmx/CancelCurrentJob",
        type: "POST",
        datatype: "json",
        data: "{'requestID':'" + jobno + "', 'relatedId':'" + relatedId + "', 'cause':'" + cause + "'}",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            navigator.notification.alert(
            data.d,
            FailedJobCustomer,
            'ECABS4U',
            "OK"
                );
            function FailedJobCustomer() {
                app.application.navigate('#Profile');
            }
        },
    });
}


//Show full Job detail in cabNow booking time and Failed Job booking time
function showFullJobDetail() {

    $("#modalview-DriverJobDeal").kendoMobileModalView("close");
    var data = $('#lbljobno1').text();
    $.ajax({
        url: "http://192.168.1.22/ECabs/ECabs4U.asmx/FullJobDetail",
        type: "POST",
        datatype: "json",
        data: "{'JobNo':'" + data + "','driverId':'" + relatedId + "'}",
        contentType: "application/json; charset=utf-8",
        success: customerJobFullDeatil,
        error: function (XMLHttpRequest, textStatus, errorThrown) { }
    });


}

function customerJobFullDeatil(data) {
    $('#lblJobNo').text(": " + data.d[0]);
    $('#lblFrom').text(": " + data.d[1]);
    $('#lblTo').text(": " + data.d[2]);
    $('#lblDistancepopup').text(": " + data.d[3]);

    $('#lbltDate').text(": " + data.d[4]);
    $('#lblTime').text(": " + data.d[5]);
    $('#lblFare').html(": " + '&pound' + data.d[6]);
    $('#lblCustomerName').text(": " + data.d[8] + " " + data.d[9]);
    // $('#lblreturnfrom2').text(": "+data.d[10]);
    //$('#lblreturnto2').text(": "+data.d[11]);
    $('#lblNoOfPassenger').text(": " + data.d[12]);
    $('#lblWheelchair').text(":" + data.d[13]);
    $('#lblLargeCase').text(":" + data.d[14]);
    $('#lblSmallCase').text(":" + data.d[15]);
    $('#lblSpecialReq').text(":" + data.d[16]);
    $('#lblChildBoosters').text(":" + data.d[17]);
    $('#lblChildSeats').text(":" + data.d[18]);


    if (data.d[7] === "True") {
        $('#rtnfrom2').show();
        $('#lblreturnfrom2').text(": " + data.d[10]);
        $('#rtnto2').show();
        $('#lblreturnto2').text(": " + data.d[11]);
    }
    else {
        $('#rtnfrom2').hide();
        $('#rtnto2').hide();
    }


    $("#modalview-divJobDetail").kendoMobileModalView("open");
    //  $('#popup_box22').show();
    //$('#transparent_div').show();
    //  $('#divJobDetail').show();

}

function CancelFullDetail() {

    //$('#popup_box22').fadeOut("fast");
    //$('#divJobDetail').hide();
    //$('#transparent_div').hide();

    $("#modalview-divJobDetail").kendoMobileModalView("close");
    SubmitDeal();
}


//Navigation Fuction Start Here//
function NavigateToMap() {

    var networkState = navigator.connection.type;
    var states = {
    };
    states[Connection.NONE] = 'Please enable your mobile network connection.';
    if (states[networkState] === 'Please enable your mobile network connection.') {
        alert("contain");
        $('#lblInternetconnection').text(states[networkState]);

        // alert('No network connection found.');
        return false;
    }
    else
        app.application.navigate("#driverRouteMap");
}

function backToMap() {
    app.application.navigate("#driverHome");
}


var locFrom, loc2, loc3, loc4, loc5, loc6, loc7, loc8, locTo;

var waypts = [];

//window.onload = getLocation();
function getLocation() {
    $.ajax({
        url: "http://192.168.1.22/ECabs/ECabs4U.asmx/GetLocations",
        type: "POST",
        dataType: "Json",
        data: "{'relatedId':'" + relatedId + "'}",
        contentType: "application/json; charset=utf-8",
        success: setLocation,
        error: function (XMLHttpRequest, textStatus, errorThrown) { },
    });
}
function setLocation(data) {
    locFrom = data.d[0];
    arrLoc[0] = data.d[1];
    arrLoc[1] = data.d[2];
    arrLoc[2] = data.d[3];
    arrLoc[3] = data.d[4];
    arrLoc[4] = data.d[5];
    arrLoc[5] = data.d[6];
    arrLoc[6] = data.d[7];
    locTo = data.d[8];
    InitializeMap();
}

function InitializeMap() {
    console.log(arrLoc.length);
    for (var i = 0; i < arrLoc.length; i++) {
        if (arrLoc[i] !== null) {
            waypts.push({
                location: arrLoc[i],
                stopover: true
            });
        }
    }
    console.log(waypts.length);
    if (waypts.length > 0) {
        console.log('In if part');
        ShowMyMapDetails();
    }
    else {
        console.log('In else part');
        ShowMyMapDetails2();
    }
};

function ShowMyMapDetails() {
    var latitude, longitude;
    directionsDisplay = new google.maps.DirectionsRenderer();
    var geocoder = new google.maps.Geocoder();
    var address = locFrom;
    geocoder.geocode({
        'address': address
    }, function (results, status) {
        if (status === google.maps.GeocoderStatus.OK) {
            latitude = results[0].geometry.location.lat();
            longitude = results[0].geometry.location.lng();

        }
        else {
            navigator.notification.alert(
               "No location found.",
            locationNotFound5,
             'ECABS4U',
             "OK"
              );
            function locationNotFound5() {
            }
        }
        directionsDisplay = new google.maps.DirectionsRenderer();
        myLocation = new google.maps.LatLng(latitude, longitude);
        var mapOptions = {
            zoom: 25,
            //navigationControl: true,
            //draggable: true,
            //zoomControl: true,
            //scaleControl: true,
            //scrollwheel: true,
            //disableDoubleClickZoom: false,  
            mapTypeId: google.maps.MapTypeId.ROADMAP
            //unitSystem: google.maps.UnitSystem.IMPERIAL

        };

        map = new google.maps.Map(document.getElementById('map-canvas1'), mapOptions);
        directionsDisplay.setMap(map);
        // var checkdist=document.getElementById('directions-panel').value;
        //alert(checkdist);
        //console.log(checkdist);
        $('#directions-panel1').empty();
        directionsDisplay.setPanel(document.getElementById('directions-panel1'));
        calcDriverMapRoute();
    });
}

function ShowMyMapDetails2() {
    var latitude, longitude;
    directionsDisplay = new google.maps.DirectionsRenderer();
    var geocoder = new google.maps.Geocoder();
    var address = locFrom;
    geocoder.geocode({
        'address': address
    }, function (results, status) {
        if (status === google.maps.GeocoderStatus.OK) {
            latitude = results[0].geometry.location.lat();
            longitude = results[0].geometry.location.lng();
            alert(latitude);
            alert(longitude);
        }
        else {
            navigator.notification.alert(
               "No location found.",
            locationNotFound6,
             'ECABS4U',
             "OK"
              );
            function locationNotFound6() {

            }
        }

        directionsDisplay = new google.maps.DirectionsRenderer();
        //myLocation = new google.maps.LatLng(latitude, longitude);
        myLocation = new google.maps.LatLng(latitude, longitude);
        var mapOptions = {
            zoom: 25,
            center: myLocation,
            //panControl: true,
            //navigationControl: true,
            //draggable: true,
            //zoomControl: true,
            //scaleControl: true,
            //scrollwheel: true,
            //disableDoubleClickZoom: false,
            mapTypeId: google.maps.MapTypeId.ROADMAP
            //unitSystem: google.maps.UnitSystem.IMPERIAL


        }
        map = new google.maps.Map(document.getElementById('map-canvas1'), mapOptions);
        directionsDisplay.setMap(map);
        //var cc=document.getElementById('directions-panel');
        // alert(cc);
        //console.log(cc);
        $('#directions-panel1').empty();
        directionsDisplay.setPanel(document.getElementById('directions-panel1'));
        calcDriverMapRoute2();
    });
}
function toggleBounce() {
    if (marker.getAnimation() !== null) {
        marker.setAnimation(null);
    } else {
        marker.setAnimation(google.maps.Animation.BOUNCE);
    }
}

function calcDriverMapRoute2() {
    console.log("in calcRoute2 part");
    var request = {
        origin: locFrom,
        destination: locTo,
        travelMode: google.maps.TravelMode.DRIVING,
        unitSystem: google.maps.UnitSystem.IMPERIAL
    };

    directionsService.route(request, function (response, status) {
        if (status === google.maps.DirectionsStatus.OK) {
            directionsDisplay.setDirections(response);
        }
    });
}

function calcDriverMapRoute() {
    console.log('In calc Route');
    var request = {
        origin: locFrom,
        destination: locTo,
        waypoints: waypts,
        optimizeWaypoints: true,
        travelMode: google.maps.TravelMode.DRIVING,
        unitSystem: google.maps.UnitSystem.IMPERIAL
    };

    directionsService.route(request, function (response, status) {
        if (status === google.maps.DirectionsStatus.OK) {
            directionsDisplay.setDirections(response);
        }
    });
}

//    directionsService.route(request, function (response, status) {
//        if (status === google.maps.DirectionsStatus.OK) {
//            directionsDisplay.setDirections(response);
//        }
//    });
//}
////Navigation Fuction End Here//


//Driver Failed Job

function onbeforeDriverFailedJob() {
    $.ajax({
        url: "http://192.168.1.22/ECabs/ECabs4U.asmx/GetFailedJobs",
        datatype: "JSON",
        type: "POST",
        data: "{'relatedId':'" + relatedId + "','role':'" + roleId + "'}",
        contentType: "application/json; charset=utf-8",
        success: driverFailedJobdisplayResult
    });
}


function driverFailedJobdisplayResult(data) {
    var count = data.d.length;
    if (count > 0) {
        $('#driverFailedbookingmsg').hide();
        $('#msgDriverFailedJob').html("");

        var html = '<table id="tbhist" cellspacing="0"; width="100%"  style="border-collaspe:collaspe;">';
        html += '<thead class="thead-grid">';
        html += '<tr>';
        html += '<th>JobNo</th>';
        html += '<th>From</th>';
        html += '<th>To</th>';
        html += '<th>Status</th>';
        html += '</tr>';
        html += '</thead>';
        html += '<tbody class="tbody-grid altColor">';
        for (var i = 0; i < count; i++) {
            var jobno = data.d[i]["JobNumber"];
            var from = data.d[i]["From"];
            var to = data.d[i]["To"];
            html += '<tr>';
            html += "<td width='15%' height='30px' align='center'>" + jobno + "</td>";
            html += "<td width='25%' height='30px' align='center'>" + from + "</td>";
            html += "<td width='25%' height='30px' align='center'>" + to + "</td>";
            html += "<td width='30%' height='30px' align='center'>"
                 + '<input type="button" style="-webkit-appearance:none;-moz-appearance:none;" class="accept-btn" value="Re-initiate" onclick="DriverFailedBookingInitiateJob(\'' + jobno + '\')"/>' + '<br/>'
                 + '<input type="button" style="-webkit-appearance:none;-moz-appearance:none;" class="reject-btn" value="Cancel" onclick="DriverFailedBookingCancelJob(\'' + jobno + '\')"/>' + "</td>";
            html += '</tr>';
        }
        html += '</tbody>';
        html += '</table>';
        $('#msgDriverFailedJob').append(html);
    }
    else {
        $('#msgDriverFailedJob').empty().append("");
        $('#driverFailedbookingmsg').show();

    }
}

function DriverFailedBookingInitiateJob(jobno) {
    $('#hdnJobno1').val(jobno);
    SubmitDeal();
}

function DriverFailedBookingCancelJob(jobno) {
    var cause = "Not opted for re-initiate";
    $.ajax({
        url: "http://192.168.1.22/ECabs/ECabs4U.asmx/CancelCurrentJob",
        type: "POST",
        datatype: "json",
        data: "{'requestID':'" + jobno + "', 'relatedId':'" + relatedId + "', 'cause':'" + cause + "'}",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            navigator.notification.alert(
            data.d,
            driverFailedJob,
            'ECABS4U',
            "OK"
                    );
            function driverFailedJob() {
                app.application.navigate('#driverHome');
                //  window.location = 'driverHome.html?id=' + userId + '&rid=' + roleId + '&rrid=' + relatedId;
            }

        },
    });
}


//Driver CabLaterBooked Jobs(Bookings)
function onbeforeDriverCabLaterBookedJob() {
    CabLaterBookedJob();

}

function CabLaterBookedJob() {
    $.ajax({
        url: "http://192.168.1.22/ECabs/ECabs4U.asmx/GetCabLaterJobs",
        type: "POST",
        datatype: "json",
        data: "{'relatedId':'" + relatedId + "'}",
        contentType: "application/json; charset=utf-8",
        success: function (data) { showTodayJobs(data); showFutureJobs(data); },
        error: function (XMLHttpRequest, textStatus, errorThrown) { }
    });
}

function showTodayJobs(data) {
    var count = data.d.length;
    var isAnyTodayJob = false;
    $('#msgBooked').empty();
    $('#msgBooked').hide();
    $('#CabLaterbookingmsg').show();
    if (count > 0) {
        var html = '<table id="tbhist" cellspacing="0"; width="100%"  style="border-collaspe:collaspe;">';
        html += '<thead class="thead-grid">';
        html += '<tr>';
        html += '<th>JobNo</th>';
        html += '<th>From</th>';
        html += '<th>To</th>';
        html += '<th>Action</th>';
        html += '</tr>';
        html += '</thead>';
        html += '<tbody class="altColor">';
        for (var i = 0; i < count && data.d[i]["isTodayJob"] == true; i++) {
            isAnyTodayJob = true;
            $('#lbljobFeed').text(data.d[i]["JobNumber"]);
            html += '<tr>';
            html += "<td style='width:20%;height:35px;text-align:center;border-bottom:1px solid #0080FF'>" + '<a  onclick="DriverCabLaterBookedJobDetail(\'' + data.d[i]["JobNumber"] + '\')" style="color:blue;">' + data.d[i]["JobNumber"] + '</a>' + "</td>";
            // html += "<td style='width:20%;height:35px;text-align:center;border-bottom:1px solid #0080FF'>" + '<a  onclick="DriverHistoryJobDetail(\'' + data.d[i]["JobNumber"] + '\')" style="color:blue;">' + data.d[i]["JobNumber"] + '</a>' + "</td>";
            html += "<td style='width:25%;height:35px;text-align:center;border-bottom:1px solid #0080FF'>" + data.d[i]["From"] + "</td>";
            html += "<td style='width:25%;height:35px;text-align:center;border-bottom:1px solid #0080FF'>" + data.d[i]["To"] + "</td>";
            html += "<td style='width:25%;height:35px;text-align:center;border-bottom:1px solid #0080FF'>"
                + '<input type="button" style="-webkit-appearance:none;-moz-appearance:none;" class="accept-btn" value="En route" onclick="Engage(\'' + data.d[i]["JobNumber"] + '\')"/><br/><div style="height:3px"></div>'
                + '<input type="button" style="-webkit-appearance:none;-moz-appearance:none;" class="reject-btn" value="Abort job" onclick="BookingsAbortJob(\'' + data.d[i]["JobNumber"] + '\')"/>'
                + "</td>";
            html += '</tr>';
        }
        html += '</tbody>';
        html += '</table>';
        if (isAnyTodayJob) {
            $('#msgBooked').append(html)
            $('#msgBooked').show();
            $('#CabLaterbookingmsg').hide();
        }
    }
}

function Engage(data) {
    jobNo = data;
    navigator.notification.confirm(
  "Do you want to en-route this job?",
  EngageDriver,
  "Confirm",
  "Yes,No"
  );

    function EngageDriver(buttonIndex) {
        if (buttonIndex === 2) {
            return false;
        }
        else if (buttonIndex === 1) {
            $.ajax({
                url: "http://192.168.1.22/ECabs/ECabs4U.asmx/EngageDriver",
                type: "POST",
                datatype: "json",
                data: "{'relatedId':'" + relatedId + "','jobNo':'" + jobNo + "'}",
                contentType: "application/json; charset=utf-8",
                success: function (data) {

                    app.application.navigate('#driverHome');

                    // window.location = 'driverHome.html?id=' + userId + '&rid=' + roleId + '&rrid=' + relatedId;
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                }
            });
        }
    }

}

function BookingsAbortJob(data) {

    navigator.notification.confirm(
    "Do you want to abort this job?",
    onAbortCallbackDriverBookings,
    "Confirm",
    "Yes,No"
    );


    function onAbortCallbackDriverBookings(buttonIndex) {
        if (buttonIndex === 2) {
            return false;
        }
        else if (buttonIndex === 1) {

            $('#hdnJobnoBooking').val(data);
            $("#modalview-ForDriverHomeJobDetail").kendoMobileModalView("close");
            $("#modalview-AbortPopupDriverHome").kendoMobileModalView("close");
            $("#modalview-AbortPopupDriverBookings").kendoMobileModalView("open");
            $('#popup_boxDriverBookings').fadeIn("fast");
            $('#divAbortTaskDriverBookings').fadeIn("fast");

        }
    }



}

function SubmitAbortDriverBookings() {
    var jobNo = $('#hdnJobnoBooking').val();

    var abortMessage22 = $('#txtAbortmsgDriverBookings').val();
    if (!abortMessage22) {
        navigator.notification.alert(
        "Please enter a reason.",
        abortValidation,
        'ECABS4U',
        "OK"
        );
        function abortValidation() {
        }
        return false;

    }
    var url = "http://192.168.1.22/ECabs/ECabs4U.asmx/AbortCurrentJobDriver";

    $.ajax(url, {
        beforeSend: function () { showLoading(); },
        complete: function () { hideLoading(); },
        type: "POST",
        datatype: "json",
        data: "{'relatedId':'" + relatedId + "','abortMessage':'" + abortMessage22 + "','jobNumber':'" + jobNo + "'}",
        contentType: "application/json; charset=utf-8",
        success: function () {
            //if(data.d === "true")
            //{                            
            $('#popup_boxDriverBookings').hide();
            $('#divAbortTaskDriverBookings').hide();
            $("#modalview-AbortPopupDriverBookings").kendoMobileModalView("close");
            $('#txtAbortmsgDriverBookings').val("");

            navigator.notification.alert(
            "Job aborted successfully.",
            abortJobDoneBookings,
            'ECABS4U',
            "OK"
                );
            function abortJobDoneBookings() {
                //window.location = 'driverHome.html?id=' + userId + '&rid=' + roleId + '&rrid=' + relatedId;
                onbeforeDriverCabLaterBookedJob();
            }
            //}                         
        },
    });
}

function cancelAbortDriverBookings() {
    $('#popup_boxDriverBookings').hide();
    $('#divAbortTaskDriverBookings').hide();
    $('#txtAbortmsgDriverBookings').val("");
    $("#modalview-AbortPopupDriverBookings").kendoMobileModalView("close");
}

function showFutureJobs(data) {
    var count = data.d.length;
    var isAnyFutureJob = false;
    $('#msgBookedFuture').empty();
    $('#msgBookedFuture').hide();
    $('#CabLaterbookingmsgFuture').show();
    if (count > 0) {
        var html = '<table id="tbhist" cellspacing="0"; width="100%"  style="border-collaspe:collaspe;">';
        html += '<thead class="thead-grid">';
        html += '<tr>';
        html += '<th>JobNo</th>';
        html += '<th>From</th>';
        html += '<th>To</th>';
        html += '<th>Action</th>';
        html += '</tr>';
        html += '</thead>';
        html += '<tbody class="altColor">';
        for (var j = 0; j < count; j++)
            if (data.d[j]["isTodayJob"] == false) {
                console.log(isAnyFutureJob);
                isAnyFutureJob = true;
                $('#lbljobFeed').text(data.d[j]["JobNumber"]);
                html += '<tr>';
                html += "<td style='width:20%;height:35px;text-align:center;border-bottom:1px solid #0080FF'>" + '<a  onclick="DriverCabLaterBookedJobDetail(\'' + data.d[j]["JobNumber"] + '\')" style="color:blue;">' + data.d[j]["JobNumber"] + '</a>' + "</td>";
                // html += "<td style='width:20%;height:35px;text-align:center;border-bottom:1px solid #0080FF'>" + '<a  onclick="DriverHistoryJobDetail(\'' + data.d[j]["JobNumber"] + '\')" style="color:blue;">' + data.d[j]["JobNumber"] + '</a>' + "</td>";
                html += "<td style='width:25%;height:35px;text-align:center;border-bottom:1px solid #0080FF'>" + data.d[j]["From"] + "</td>";
                html += "<td style='width:25%;height:35px;text-align:center;border-bottom:1px solid #0080FF'>" + data.d[j]["To"] + "</td>";
                html += "<td style='width:25%;height:35px;text-align:center;border-bottom:1px solid #0080FF'>"
                  //  + '<input type="button" style="-webkit-appearance:none;-moz-appearance:none;" class="accept-btn" value="En route" onclick="Engage(\'' + data.d[j]["JobNumber"] + '\')"/><br/><div style="height:3px"></div>'
                    + '<input type="button" style="-webkit-appearance:none;-moz-appearance:none;" class="reject-btn" value="Abort job" onclick="BookingsAbortJob(\'' + data.d[j]["JobNumber"] + '\')"/>'
                    + "</td>";
                html += "</tr>";
            }
        html += '</tbody>';
        html += '</table>';
        if (isAnyFutureJob) {
            $('#msgBookedFuture').append(html);
            $('#msgBookedFuture').show();
            $('#CabLaterbookingmsgFuture').hide();
        }
    }
}


//For detail pop up
function DriverCabLaterBookedJobDetail(jobid) {
    var url = "http://192.168.1.22/ECabs/ECabs4U.asmx/JobDetailDriver";
    $.ajax(url, {
        type: "POST",
        datatype: "json",
        data: "{'customerReqID':'" + jobid + "','roleId':'" + roleId + "'}",
        contentType: "application/json; charset=utf-8",
        success: driverHomeshowJobDetail,
        error: function (XMLHttpRequest, textStatus, errorThrown) { }
    });
}



