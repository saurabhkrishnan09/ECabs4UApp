function getBidTimeData(searchTime, bidTime) {
    var tm = searchTime.split(" ");

    var min = tm[1].split(":");
    var sh = min[0];
    var sm = min[1];
    var ss = min[2];
    if (sm > 49) {
        sh = parseInt(sh) + 1;
        sm = parseInt(sm) + 10;
        sm = parseInt(sm) - 60;
        if (ss === 00) {
            sm = parseInt(sm) + 1;
            ss = 00;
            $('#lblsearch').text(min[0] + ":" + min[1]);
            $('#lblexp').text(sh + ":" + sm);
        }
        else {
            $('#lblsearch').text(min[0] + ":" + min[1]);
            $('#lblexp').text(sh + ":" + sm);
        }
    }
    else {
        sm = parseInt(sm) + 10;
        if (ss === 00) {
            sm = parseInt(sm) + 1;
            ss = 00;
            $('#lblsearch').text(min[0] + ":" + min[1]);
            $('#lblexp').text(sh + ":" + sm);
        }
        else {
            $('#lblsearch').text(min[0] + ":" + min[1]);
            $('#lblexp').text(sh + ":" + sm);
        }
    }

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

function showLoading() {
    $(".km-loader").css("display", "block");
}

function hideLoading() {
    $(".km-loader").css("display", "none");
}

function checkConnection() {
    var networkState = navigator.connection.type;

    var states = {};
    states[Connection.NONE] = 'No network connection';

    if (states[networkState] === 'No network connection') {
        navigator.notification.alert(
       "No network connection found.",
       callBackFunctionB,
       'Alert',
       "OK"
       );
        function callBackFunctionB() {
            $('#txtPassword').val("");
            return false;
        }
    }
    else
        return true;
}
function confirmExit() {
    navigator.notification.confirm(
      'Do you want to close the app?',
      onCallback,
      'Confirm exit from Ecabs4u',
      'No, Yes'
    );
}
function onCallback(buttonIndex) {
    if (buttonIndex === 1) {
        return false;
    }
    else if (buttonIndex === 2) {
        navigator.app.exitApp();
        return true;
    }
}
function loadjscssfile(filename, filetype) {
    if (filetype === "js") {
        var fileref = document.createElement('script');
        fileref.setAttribute("type", "text/javascript");
        fileref.setAttribute("src", filename);
    }

    if (typeof fileref !== "undefined") {
        document.getElementsByTagName("head")[0].appendChild(fileref);
        console.log(fileref);
    }
}


//Check New Job For Every 5second//

function showConfirm(param, jobId) {
    var now = 1;
    //var later = 2;
    if (param === now) {
        navigator.notification.confirm('You have a "CAB NOW" job request.', onConfirm, 'NEW JOB', 'View,Reject');

        function onConfirm(buttonIndex) {
            jobID = jobId;
            if (buttonIndex == 2) {
                closeRequest();
            }
            else if (buttonIndex == 1) {
                window.clearInterval(jobCheckTime);
                seeRequest();
            }
        }
    }

}

function CheckNewJob() {
    $.ajax({
        url: 'http://ecabs4uservice.azurewebsites.net/ECabs4U.asmx/CheckNewJob',
        type: "POST",
        datatype: "json",
        data: "{'userID':'" + relatedId + "'}",
        contentType: "application/json; charset=utf-8",
        success: function (data) {
            var isTrue = data.d[0];
            if (isTrue === "True") {
                var jobType = data.d[1];
                var isvisited = data.d[2];
                var jobId = data.d[3];
                var isEngaged = data.d[4];
                if (isvisited === "False") {
                    console.log(jobType === "True" && isEngaged === "False");
                    if (jobType === "True" && isEngaged === "False") {

                        showConfirm(1, jobId);
                        playBeep();
                        window.clearInterval(jobCheckTime);
                    }
                    else if (jobType === "False") {
                        $('#btnPulsating').show();
                        $('#btnNormal').hide();
                    }
                }
            }
            //GetCancelledJobs();
        },
    });
}


function playBeep() {
    navigator.notification.beep(1);
    navigator.notification.vibrate(1000);
    return;
}

function seeRequest() {
    app.application.navigate('#JobDetailsNotification');
}

function closeRequest() {
    $.ajax({
        url: 'http://ecabs4uservice.azurewebsites.net/ECabs4U.asmx/CancelNewJobDNotification',
        type: "POST",
        datatype: "json",
        data: "{'relatedId':'" + relatedId + "','jobId':'" + jobID + "'}",
        contentType: "application/json; charset=utf-8",
        success: function () {
            jobCheckTime = setInterval(CheckNewJob, 5000);
        }
    });
}


function closeModalView() {
    $("#modalview-JobDetailWithFeedbackHistory").kendoMobileModalView("close");
    $("#modalview-CabLaterJobDetail").kendoMobileModalView("close");
    //$("#modalview-CabNowJobDetail").kendoMobileModalView("close");
    $("#modalview-ForDriverHomeJobDetail").kendoMobileModalView("close");
    $("#modalview-SpecReq").kendoMobileModalView("close");
    $("#modalview-divLargeImage").kendoMobileModalView("close");
    $("#modalview-BidExpiry").kendoMobileModalView("close");
    $("#modalview-Expiry").kendoMobileModalView("close");
    $("#modalview-CabCommission").kendoMobileModalView("close");
    $("#modalview-DriverRating").kendoMobileModalView("close");
    $("#modalview-login123").kendoMobileModalView("close");
    $("#modalview-CancelCabPopup").kendoMobileModalView("close");
    $("#modalview-CommentBox").kendoMobileModalView("close");
    $("#modalview-CabCommissionPayment").kendoMobileModalView("close");
}

GetCancelledJobsTimer = window.setInterval(GetCancelledJobs, 9000);
function GetCancelledJobs() {
    if (roleId > 0 && relatedId > 0) {
        if (app.application.view().id == "#Profile" || app.application.view().id == "#driverBids" || app.application.view().id == "#History" || app.application.view().id == "#driverHome")
            $.ajax({
                url: 'http://ecabs4uservice.azurewebsites.net/ECabs4U.asmx/GetAllCancelledJobs',
                type: "POST",
                datatype: "json",
                data: "{'relId':'" + relatedId + "','roleId':'" + roleId + "'}",
                contentType: "application/json; charset=utf-8",
                success: function (data) {
                    if (data != null)
                        for (var i = 0 ; i < data.d.length; i++) {
                            jobId = data.d[i].CustomeeRequestID;
                            expJobId = data.d[i].ID;
                            expReason = data.d[i].ExpiryReason;
                            expiryCount += 1;
                            cancelledBy = data.d[i].CancelledByID;
                            var textToShow = "Sorry the job " + jobId + " has been cancelled by ";
                            // if (roleId == 4) //For Customer show that driver has cancelled it.
                            // textToShow += "driver";
                            // else if (roleId == 7 || roleId == 3) //For Driver show that customer has cancelled it.
                            textToShow += "customer";
                            textToShow += ".\nReason- " + expReason;
                            if (parseInt(relatedId) === cancelledBy && roleId != 4) {
                                navigator.notification.confirm(textToShow, onOKDeleteExpiredJob(expJobId), 'Cancelled Job', 'OK');
                            }
                        }
                }
            });
        function onOKDeleteExpiredJob(expJobId) {
            if (expiryCount >= 2) {
                $.ajax({
                    url: 'http://ecabs4uservice.azurewebsites.net/ECabs4U.asmx/DeleteAnyCancelledJob',
                    type: "POST",
                    datatype: "json",
                    data: "{'expiredJobId':'" + expJobId + "'}",
                    contentType: "application/json; charset=utf-8",
                    success: function () {
                        expiryCount = 0;
                        if (roleId == 4)
                            app.application.navigate('#search');
                        else if (roleId == 7 || roleId == 3)
                            app.application.navigate('#driverHome');
                    }
                });
            }
        }
    }
    else
        window.clearInterval(GetCancelledJobsTimer);
}
function getProperTime(giventime) {
    var hrs = Number(giventime.split(":")[0]);
    var mnts = Number(giventime.split(":")[1]);
    var hours = hrs.toString();
    var minutes = mnts.toString();
    if (hrs < 10) hours = "0" + hours;
    if (mnts < 10) minutes = "0" + minutes;
    return (hrs + ":" + mnts);
}

function SpecShow(spec, clearTimerId) {
    $('#lblSpecialReq').text(spec);
    if (clearTimerId != '')
        window.clearInterval(clearTimerId);
    clearTimerId = '';
    $("#modalview-SpecReq").kendoMobileModalView("open");
}

//make image bigger
function ShowLargeImage(imgUrl, clearTimerId, intervalTime, funcToCall) {
    $("#btnCloseLargeImage").kendoButton();
    var closebutton = $("#btnCloseLargeImage").data("kendoButton");
    closebutton.bind("click", function (e) {
        closeModalView();
        if (clearTimerId != '') {
            reStartTimer(clearTimerId, intervalTime, funcToCall);
        }
        clearTimerId = '';
    });
    if (clearTimerId != '')
        window.clearInterval(clearTimerId);

    $('#imglarge').attr("src", imgUrl.src);
    $("#modalview-divLargeImage").kendoMobileModalView("open");
}

function reStartTimer(timerId, intervalTime, funcToCall) {
    if (timerId != "")
        timerId = window.setInterval(funcToCall, intervalTime);
}

function showRating(DriverID) {
    $.ajax({
        url: "http://ecabs4uservice.azurewebsites.net/ECabs4U.asmx/GetRatingFeedback",
        type: "POST",
        dataType: "Json",
        data: "{'driverID':'" + DriverID + "'}",
        contentType: "application/json; charset=utf-8",
        success: function (data) {

            $('#driverRating').empty();

            if (data.d.length == 0) {
                jAlert('Sorry!!! No comments found for this driver.', 'ECabs4U-Comments');
            }
            else {
                $("#modalview-DriverRating").kendoMobileModalView("open");
                $('#divDriverRating').html("");
                $('#divDriverRating').empty().append("");
                var table2 = "";
                table2 = '<table width="99%" cell-spacing="0" style="font-size:12px;">';
                table2 += '<thead>';
                table2 += '<th>Date</th>';
                table2 += '<th style="text-align:center">Rating</th>';
                table2 += '<th>Customer Comments</th>';
                table2 += '<th>Driver Comments</th>';
                table2 += '</thead>';

                for (var i = 0; i < data.d.length; i++) {
                    var ratingdriver = data.d[i]["DriverRating"];

                    table2 += '<tr>';
                    table2 += '<td style="text-align:left;width:25%">' + data.d[i]["StartDate"] + '</td>';
                    table2 += '<td style="width:25%;text-align:center;">';
                    if (ratingdriver === "1")
                        table2 += '<img src="img/1star.PNG" style="width:18%" />';
                    else if (ratingdriver == "2")
                        table2 += '<img src="img/2star.PNG" style="width:33%" />';
                    else if (ratingdriver == "3")
                        table2 += '<img src="img/3star.PNG" style="width:45%" />';
                    else if (ratingdriver == "4")
                        table2 += '<img src="img/4star.PNG" style="width:55%" />';
                    else if (ratingdriver == "5")
                        table2 += '<img src="img/5star.PNG" style="width:65%" />';
                    else
                        table2 += 'No Rating'
                    table2 += '</td>';

                    table2 += '<td style="text-align:left;width:25%"> ';
                    table2 += data.d[i]["CustomerFeedback"] == null ? '--' : data.d[i]["CustomerFeedback"];
                    table2 += ' </td>';

                    table2 += '<td style="text-align:left;width:25%"> ';
                    table2 += data.d[i]["DriverFeedback"] == null ? '--' : data.d[i]["DriverFeedback"];
                    table2 += ' </td>';
                }

                table2 += '</table>';
                $('#divDriverRating').empty();
                $('#divDriverRating').html("");
                $('#divDriverRating').empty().append("");
                $('#divDriverRating').append(table2);

            }

        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
        }
    });
}










////Failed Job Notification

var btnArrayDriver = ['Yes', 'No'];
var btnArraycustomer = ['Search', 'Alter', 'Cancel'];

//window.setInterval(checkFailedJob, 10000);
function checkFailedJob() {
    if (app.application.view().id == "#search" || app.application.view().id == "#Profile" || app.application.view().id == "#driverBids" || app.application.view().id == "#History" || app.application.view().id == "#customerBooking" || app.application.view().id == "#driverHome")
        $.ajax({
            url: "http://ecabs4uservice.azurewebsites.net/ECabs4U.asmx/GetFailedJobs",
            datatype: "JSON",
            type: "POST",
            data: "{'relatedId':'" + relatedId + "','role':'" + roleId + "'}",
            contentType: "application/json; charset=utf-8",
            success: function (data) {
                var count = data.d.length;
                if (count > 0) {
                    for (var i = 0; i < count; i++) {
                        jobID = data.d[i]["JobNumber"];

                    }

                    if (roleId == 4)//customer
                    {
                        navigator.notification.confirm(
                      "Cab search has failed for an unknown reason. Would you like to",
                       onCallbackCustomerFailedJob,
                      "Failed job notification",
                      btnArraycustomer
                     );
                    }
                    else if (roleId == 3)//driver
                    {
                        navigator.notification.confirm(
                        "You have some failed jobs. Do you want to re-initiate them?",
                         onCallbackDriverFailedJob,
                        "Failed job notification",
                        btnArrayDriver
                       );
                    }
                }
            }
        });
    //}, 1000);
}

//customer
function onCallbackCustomerFailedJob(buttonIndex) {
    if (buttonIndex == 1) {
        app.application.navigate('#customerFailedJobs');
    }
    else if (buttonIndex == 2) {
        //alert(jobID);
        jobID == jobID;
        //onbeforeSearch();
        app.application.navigate('#search');

    }
    else if (buttonIndex == 3) {
        //    window.clearInterval(check22);
        return false;
    }
}

//Driver
function onCallbackDriverFailedJob(buttonIndex) {
    if (buttonIndex == 2) {
        return false;
    }
    else if (buttonIndex == 1) {
        // if(roleId == 4) //Customer page
        // {
        //     window.location='CustomerFailedBooking.html?id='+userId+'&rid='+roleId+'&rrid='+relatedId;
        // }
        if (roleId == 3) //Driver page
        {
            app.application.navigate('#DriverFailedJobs');
            //   window.location = 'DriverFailedBookings.html?id=' + userId + '&rid=' + roleId + '&rrid=' + relatedId;
        }

    }
}



//Cancelled job for customer

GetCancelledJobsForCustomerTimer = window.setInterval(GetCancelledJobsForCustomer, 11000);


function GetCancelledJobsForCustomer() {
    if (roleId > 0 && roleId == 4) {
        if (app.application.view().id == "#search" || app.application.view().id == "#Profile" || app.application.view().id == "#History" || app.application.view().id == "#customerBooking")
            $.ajax({
            url: 'http://ecabs4uservice.azurewebsites.net/ECabs4U.asmx/GetCancelledJobsForCustomer',
            type: "POST",
            datatype: "json",
            data: "{'custId':'" + relatedId + "'}",
            contentType: "application/json; charset=utf-8",
            success: function (data) {


                for (var i = 0 ; i < data.d.length; i++) {
                    var jobId = data.d[i].CustomeeRequestID;
                    CustId = data.d[i].CustomerID;
                    CustexpJobId = data.d[i].ID;
                    drvId = data.d[i].DriverID;
                    expReason = data.d[i].ExpiryReason;
                    cancelledBy = data.d[i].CancelledByID;
                    var CabNow = data.d[i].isCabNow;
                    if (parseInt(relatedId) === cancelledBy) {
                        console.log("in");
                        cancelledBy = "";
                        // alert(CabNow);
                        //alert(CustexpJobId);
                        //Job still not booked and was in process then Go in IF condition below
                        if (CabNow == null) {
                            cancelledJOb = undefined;
                            navigator.notification.confirm(
                             "Sorry, JobNo " + jobId + " cancelled by driver. \nReason- " + expReason,
                              onOKDeleteExpiredJobForCustomer(CustexpJobId),
                             'Cancelled Job',
                             "OK"
                            );

                        }
                            //Job got booked but later on cancelled by driver then Go in ELSE condition below
                        else {

                            navigator.notification.confirm(
                                "Sorry, JobNo " + jobId + " cancelled by driver. \nReason- " + expReason,
                                onClickSearchagain,
                                "Confirm",
                                "Re-Search,OK"
                                );

                            function onClickSearchagain(buttonIndex) {
                                if (buttonIndex == 2) {
                                    onOKDeleteExpiredJobForCustomer(CustexpJobId);
                                }
                                else if (buttonIndex == 1) {
                                    if (CabNow === "True") {
                                        isCabNow = true;
                                    }
                                    else if (CabNow === "False") {
                                        isCabNow = false;
                                    }
                                    onOKDeleteExpiredJobForCustomer(CustexpJobId);

                                    jobID = cancelledJOb = jobId;
                                    console.log(cancelledJOb);
                                    console.log(jobID);
                                    console.log("going to Search page");
                                    app.application.navigate('#search');

                                }
                            }

                        }
                        function onOKDeleteExpiredJobForCustomer(CustexpJobId) {
                            console.log("in Delete ExpiredJob")
                            $.ajax({
                                url: 'http://ecabs4uservice.azurewebsites.net/ECabs4U.asmx/DeleteCancelledJob',
                                type: "POST",
                                datatype: "json",
                                data: "{'expiredJobId':'" + CustexpJobId + "','driverId':'" + relatedId + "'}",
                                contentType: "application/json; charset=utf-8",
                                success: function () {
                                    console.log("in Delete ExpiredJob DONE")
                                    //$('#transparent_div').hide();
                                    //app.application.navigate('#search');
                                }
                            });

                        }
                    }
                }
            }
        });
    }
    else
        window.clearInterval(GetCancelledJobsForCustomerTimer);
}


function clearAllTimerFunctions() {
    window.clearInterval(JobOffersTimer);
    window.clearInterval(driverBidTimer);
    window.clearInterval(customerBookingTimer);
    window.clearInterval(cancelledJobCustomerTimer);
    window.clearInterval(failedJObTimer);
    window.clearInterval(jobCheckTime);
}
function beforeRecovery() {
    $("#lblPasswordRecoveryMsg")[0].innerHTML = '';
    $("#lblUserNameMsg")[0].innerHTML = '';
}