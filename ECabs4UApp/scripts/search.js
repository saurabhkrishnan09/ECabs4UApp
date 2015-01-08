function onbeforeSearch() {
    GetCurrentLocation();
    if (jobID != undefined) {
        if (cancelledJOb != undefined) {
            $.ajax({
                url: "http://115.115.159.126/ecabs/ECabs4U.asmx/JobDetail",
                type: "POST",
                dataType: "Json",
                data: "{'jobId':'" + jobID + "'}",
                contentType: "application/json; charset=utf-8",
                success: cancelldJobFillAllData,
            error: function (XMLHttpRequest, textStatus, errorThrown) { }
            });
        }
        else {
            $.ajax({
                url: "http://115.115.159.126/ecabs/ECabs4U.asmx/FillJobSearchDetail",
                type: "POST",
                dataType: "Json",
                data: "{'requestID':'" + jobID + "'}",
                contentType: "application/json; charset=utf-8",
                success: FillAllData,
            error: function (XMLHttpRequest, textStatus, errorThrown) { }
            });
        }
    
       

    }
    else
        clearfields();
    //$('#imgLoader').hide();



    function FillAllData(data) {

        //var count = data.d.length;
        //if (count > 0) {
        //    for (var i = 0; i < count; i++) {
        //        $('#txtFrom').val(data.d[i]["FromPostcode"]);
        //        $('#txtTo').val(data.d[i]["ToPostcode"]);
        //        $('#txt2location').val(data.d[i]["Location2"]);
        //        $('#txt3location').val(data.d[i]["Location3"]);
        //        $('#txt4location').val(data.d[i]["Location4"]);
        //        $('#txt5location').val(data.d[i]["Location5"]);
        //        $('#txt6location').val(data.d[i]["Location6"]);
        //        $('#txt7location').val(data.d[i]["Location7"]);
        //        $('#txt8location').val(data.d[i]["Location8"]);
        //        $('#txtDistance').val(data.d[i]["DistanceInMile"]);
        //        $('#txtothereSpecialRequirement').val();
        //        $('#ddlpassenger').val();
        //        $('#ddllargecase').val();
        //        $('#ddlsmallcase').val();
        //        $('#ddlWheelchair').val();
        //        $('#ddlChidseats').val();
        //        $('#ddlChidbooster').val();
        //        //if (($('#ddlWheelchair').val()) != 0 || ($('#ddlChidseats').val()) != 0 || ($('#ddlChidbooster').val()) != 0 || ($('#txtothereSpecialRequirement').val(''))) {
        //        //    showReq();
        //        //}


        //    }
        //}

    }

    //For cancelled job binding
    function cancelldJobFillAllData(data) {   
        $('#txtFrom').val(data.d["FromLocation"]);
        $('#txtTo').val(data.d["ToLocation"]);
        $('#txt2location').val(data.d["Location2"]);
        $('#txt3location').val(data.d["Location3"]);
        $('#txt4location').val(data.d["Location4"]);
        $('#txt5location').val(data.d["Location5"]);
        $('#txt6location').val(data.d["Location6"]);
        $('#txt7location').val(data.d["Location7"]);
        $('#txt8location').val(data.d["Location8"]);
        $('#txtDistance').val(data.d["TravelDistance"]);
        $('#txtothereSpecialRequirement').val();
        $('#ddlpassenger').val();
        $('#ddllargecase').val();
        $('#ddlsmallcase').val();
        $('#ddlWheelchair').val();
        $('#ddlChidseats').val();
        $('#ddlChidbooster').val();
        //if (($('#ddlWheelchair').val()) != 0 || ($('#ddlChidseats').val()) != 0 || ($('#ddlChidbooster').val()) != 0 || ($('#txtothereSpecialRequirement').val(''))) {
        //    showReq();
        //}

        //For Return journey

        var ReturnFrom = data.d["ReturnFrom"];
        var ReturnTo = data.d["ReturnTo"];
        if (ReturnFrom && ReturnTo) {
            bookReturn();
            $('#returnJ').fadeIn("fast");
            $('#termCond').show();
            document.getElementById("chkNo").checked = true;
            document.getElementById("chkyes").checked = false;
            $('#returnJ2').hide();
        }
    }
}
function clearfields() {
    console.log("clearfields");
    From = To = fromloc = toloc = secondLoc = thirdLoc = fourthLoc =
    fifthLoc = sixthLoc = seventhLoc = eightLoc = toloc = distance = 
    totalpassenger = largecase = smallcase = WchairPassengers = childSeats = childBooster =
    otherSpeRequirement = '';

    $('#lblMessage').text("");
    $('#txtFrom').val('');
    $('#txtTo').val('');
    $('#txt2location').val('');
    $('#txt3location').val('');
    $('#txt4location').val('');
    $('#txt5location').val('');
    $('#txt6location').val('');
    $('#txt7location').val('');
    $('#txt8location').val('');
    $('#txtDistance').val('');
    $("#txtReturnFrom").val('');
    $("#txtReturnTo").val('');
    $("#rtPickDate").val('');
    $('#TravelTime').val('');
    $('#locfrom').val('');
    $('#locto').val('');
    $('#locone').val('');
    $('#loctwo').val('');
    $('#locthree').val('');
    $('#locfour').val('');
    $('#locfive').val('');
    $('#locsix').val('');
    $('#locseven').val('');
    IsCheckedTrue = false;
    isReturn = false;
    document.getElementById("RBcabNOW").checked =  true;
    isCabNow = true;
    isYes = true;
    isSpecReq = false;
    $('#ddlpassenger').val("1");
    $('#ddllargecase').val("0");
    $('#ddlsmallcase').val("0");
    $('#ddlWheelchair').val("0");
    $('#ddlChidseats').val("0");
    $('#ddlChidbooster').val("0");
    $('#txtothereSpecialRequirement').val('');
    $('#btnspecialreq').show();
    $('#btncancelreq').hide();
    $("#trSpReq").hide();
    $('#btnbookreturn').show();
    $("#trReturn").hide();
    jobID = "";
    document.getElementById("radcash").checked =  true;
    isCreditCard = false;
    isSameDriver = false;
    setCabNowLater(true);
    ClearAllLocationValues();
}

function initialize() {
    var mapOptions = {
        componentRestrictions: { country: 'UK' }
    };
    var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
    var PickupLocation = (document.getElementById('txtFrom'));
    var L2Location = (document.getElementById('txt2location'));
    var L3Location = (document.getElementById('txt3location'));
    var L4Location = (document.getElementById('txt4location'));
    var L5Location = (document.getElementById('txt5location'));
    var L6Location = (document.getElementById('txt6location'));
    var L7Location = (document.getElementById('txt7location'));
    var L8Location = (document.getElementById('txt8location'));
    var ToLocation = (document.getElementById('txtTo'));
    var types = document.getElementById('type-selector');
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(PickupLocation);
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(L2Location);
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(L3Location);
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(L4Location);
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(L5Location);
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(L6Location);
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(L7Location);
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(L8Location);
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(ToLocation);
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(types);

    var autocompletePick = new google.maps.places.Autocomplete(PickupLocation, mapOptions);
    google.maps.event.addListener(autocompletePick, 'place_changed', function () {
        var place = autocompletePick.getPlace();
        //console.log(place.formatted_address);
        $('#locfrom').val(place.formatted_address);
        CalculateTotalDistance();
        GetPostCode(place.formatted_address);
    });

    var autocompleteL2 = new google.maps.places.Autocomplete(L2Location, mapOptions);
    google.maps.event.addListener(autocompleteL2, 'place_changed', function () {
        var place = autocompleteL2.getPlace();
        //console.log(place.formatted_address);
        $('#locone').val(place.formatted_address);
        CalculateTotalDistance();
    });

    var autocompleteL3 = new google.maps.places.Autocomplete(L3Location, mapOptions);
    google.maps.event.addListener(autocompleteL3, 'place_changed', function () {
        var place = autocompleteL3.getPlace();
        //console.log(place.formatted_address);
        $('#loctwo').val(place.formatted_address);
        CalculateTotalDistance();
    });

    var autocompleteL4 = new google.maps.places.Autocomplete(L4Location, mapOptions);
    google.maps.event.addListener(autocompleteL4, 'place_changed', function () {
        var place = autocompleteL4.getPlace();
        //console.log(place.formatted_address);
        $('#locthree').val(place.formatted_address);
        CalculateTotalDistance();
    });

    var autocompleteL5 = new google.maps.places.Autocomplete(L5Location, mapOptions);
    google.maps.event.addListener(autocompleteL5, 'place_changed', function () {
        var place = autocompleteL5.getPlace();
        //console.log(place.formatted_address);
        $('#locfour').val(place.formatted_address);
        CalculateTotalDistance();
    });

    var autocompleteL6 = new google.maps.places.Autocomplete(L6Location, mapOptions);
    google.maps.event.addListener(autocompleteL6, 'place_changed', function () {
        var place = autocompleteL6.getPlace();
        //console.log(place.formatted_address);
        $('#locfive').val(place.formatted_address);
        CalculateTotalDistance();
    });

    var autocompleteL7 = new google.maps.places.Autocomplete(L7Location, mapOptions);
    google.maps.event.addListener(autocompleteL7, 'place_changed', function () {
        var place = autocompleteL7.getPlace();
        //console.log(place.formatted_address);
        $('#locsix').val(place.formatted_address);
        CalculateTotalDistance();
    });

    var autocompleteL8 = new google.maps.places.Autocomplete(L8Location, mapOptions);
    google.maps.event.addListener(autocompleteL8, 'place_changed', function () {
        var place = autocompleteL8.getPlace();
        //console.log(place.formatted_address);
        $('#locseven').val(place.formatted_address);
        CalculateTotalDistance();
    });

    var autocompleteTo = new google.maps.places.Autocomplete(ToLocation, mapOptions);
    google.maps.event.addListener(autocompleteTo, 'place_changed', function () {
        var place = autocompleteTo.getPlace();
        //console.log(place.formatted_address);
        $('#locto').val(place.formatted_address);
        GetPostCodeTo(place.formatted_address);
        CalculateTotalDistance();
    });

    autocompletePick.bindTo('bounds', map);
    autocompleteL2.bindTo('bounds', map);
    autocompleteL3.bindTo('bounds', map);
    autocompleteL4.bindTo('bounds', map);
    autocompleteL5.bindTo('bounds', map);
    autocompleteL6.bindTo('bounds', map);
    autocompleteL7.bindTo('bounds', map);
    autocompleteL8.bindTo('bounds', map);
    autocompleteTo.bindTo('bounds', map);

}
google.maps.event.addDomListener(window, 'load', initialize);
var fromDate, rtDate;



$(function () {
    function startChange() {
        var startDate = start.value(),
                        endDate = end.value();
        if (startDate) {
            startDate = new Date(startDate);
            startDate.setDate(startDate.getDate());
            end.min(startDate);
        } else if (endDate) {
            start.max(new Date(endDate));
        } else {
            endDate = new Date();
            start.max(endDate);
            end.min(endDate);
        }
    }
    function endChange() {
        var endDate = end.value(),
                     startDate = start.value();
        if (endDate) {
            endDate = new Date(endDate);
            endDate.setDate(endDate.getDate());
            start.max(endDate);
        } else if (startDate) {
            end.min(new Date(startDate));
        } else {
            endDate = new Date();
            start.max(endDate);
            end.min(endDate);
        }
    }
    var today = new Date(wholeMinute._d);
    isSameDriver = false;
    var start = $("#pickDate").kendoDateTimePicker({
        value: today,
        change: startChange,
        format: "dd/MM/yyyy HH:mm",
        interval: 15,
        min: today
    }).data("kendoDateTimePicker");
    var end = $("#rtPickDate").kendoDateTimePicker({
        change: endChange,
        format: "dd/MM/yyyy HH:mm",
        interval: 15,
        min: start.value()
    }).data("kendoDateTimePicker");

    fromDate = $("#pickDate").data("kendoDateTimePicker");
    rtDate = $("#rtPickDate").data("kendoDateTimePicker");
});
function bookReturn() {
    $('#btnbookreturn').hide();
    $("#trReturn").show();
    $("#txtReturnFrom").val($("#txtTo").val());
    $("#txtReturnTo").val($("#txtFrom").val());
    isReturn = true;
}
function cancelBookReturn() {
    $('#btnbookreturn').show();
    $("#trReturn").hide();
    $("#txtReturnFrom").val('');
    $("#txtReturnTo").val('');
    $("#rtPickDate").val('');
    IsCheckedTrue = false;
    isReturn = false;
}

function showReq() {
    $('#btnspecialreq').hide();
    $('#btncancelreq').show();
    $("#trSpReq").show();
    isSpecReq = true;
}
function cancelSpReq() {
    $('#btnspecialreq').show();
    $('#btncancelreq').hide();
    $("#trSpReq").hide();
    app.application.navigate("#search");
    isSpecReq = false;
}
function chkYesNoChange() {
    var isYes = $("#chkYes").is(":checked");
    var isNo = $("#chkNo").is(":checked");
    if (isYes == true) {
        $("#spanYesNoText").text("I want separate bids from all operators for my return journey.");
        $("#divCompBids").hide();
        isSameDriver = false;
    }
    else if (isNo == true) {
        $("#spanYesNoText").text("I want both journeys carried out by same operator.");
        $("#divCompBids").show();
        isSameDriver = true;
    }
    $("#chkConfirm").attr('checked', false);
    IsCheckedTrue = false;
}
function secondLocation() {
    $('#2location').show();
    $('#secondLoc').hide();
    $('#thirdLoc').show();
    $('#txtTo').css("width", "100%");
    $('#txt2location').css("width", "85%");
    $('#cancelAddLocation').show();
}
function thirdLocation() {
    $('#3location').show();
    $('#thirdLoc').hide();
    $('#fourLoc').show();
    $('#txt2location').css("width", "100%");
    $('#txt3location').css("width", "85%");
    $('#cancelAddLocation').show();
}
function fourthLocation() {
    $('#4location').show();
    $('#fourLoc').hide();
    $('#fiveLoc').show();
    $('#txt2location').css("width", "100%");
    $('#txt3location').css("width", "100%");
    $('#txt4location').css("width", "85%");
    $('#cancelAddLocation').show();
}
function fifthLocation() {
    $('#5location').show();
    $('#fiveLoc').hide();
    $('#sixLoc').show();
    $('#txt2location').css("width", "100%");
    $('#txt3location').css("width", "100%");
    $('#txt4location').css("width", "100%");
    $('#txt5location').css("width", "85%");
    $('#cancelAddLocation').show();
}
function sixthLocation() {
    $('#6location').show();
    $('#sixLoc').hide();
    $('#sevenLoc').show();
    $('#txt2location').css("width", "100%");
    $('#txt3location').css("width", "100%");
    $('#txt4location').css("width", "100%");
    $('#txt5location').css("width", "100%");
    $('#txt6location').css("width", "85%");
    $('#cancelAddLocation').show();
}
function sevenLocation() {
    $('#7location').show();
    $('#sevenLoc').hide();
    $('#eightLoc').show();
    $('#txt2location').css("width", "100%");
    $('#txt3location').css("width", "100%");
    $('#txt4location').css("width", "100%");
    $('#txt5location').css("width", "100%");
    $('#txt6location').css("width", "100%");
    $('#txt7location').css("width", "85%");
    $('#cancelAddLocation').show();
}
function eightLocation() {
    $('#8location').show();
    $('#eightLoc').hide();
    $('#txt2location').css("width", "100%");
    $('#txt3location').css("width", "100%");
    $('#txt4location').css("width", "100%");
    $('#txt5location').css("width", "100%");
    $('#txt6location').css("width", "100%");
    $('#txt7location').css("width", "100%");
    $('#txt8location').css("width", "100%");
    $('#cancelAddLocation').show();
}
function cancelAddLocation() {
    ClearAllLocationValues();
    $('#txtTo').css("width", "85%");
    $('#8location').hide();
    $('#7location').hide();
    $('#6location').hide();
    $('#5location').hide();
    $('#4location').hide();
    $('#3location').hide();
    $('#2location').hide();
    $('#cancelAddLocation').hide();
    $('#secondLoc').show();
    $('#txt2location').val('');
    $('#txt3location').val('');
    $('#txt4location').val('');
    $('#txt5location').val('');
    $('#txt6location').val('');
    $('#txt7location').val('');
    $('#txt8location').val('');

    CalculateTotalDistance();
}
function ClearAllLocationValues() {
    $("#locone").val("");
    $("#loctwo").val("");
    $("#locthree").val("");
    $("#locfour").val("");
    $("#locfive").val("");
    $("#locsix").val("");
    $("#locseven").val("");
}
function setCabNowLater(isCabNowLater) {
    isCabNow = isCabNowLater;
    if (isCabNow)
        $("#divPickDateTime").hide();
    else
        $("#divPickDateTime").show();
    //setAllDateTime();
}
function showLoctxt() {
    isChecked = $('#chkFromLocation').is(":checked") ? true : false;
    if (isChecked == true) {
        $('#currentPos').show();
        $('#Fromloc').hide();
    }
    else if (isChecked == false) {
        $('#currentPos').hide();
        $('#Fromloc').show();
    }
}
function Duration() {
    var isChecked = $('#chkFromLocation').attr('checked') ? true : false;
    if (isChecked === false) {
        fromloc = $('#txtFrom').val();
    }
    else if (isChecked === true) {
        fromloc = $('#txtCurrentFrom').val();
    }
    toloc = $('#txtTo').val();
    CalculateDuration(fromloc, toloc);
    Validate();
}
function CalculateDuration(fromLocation, toLocation) {
    var rendererOptions = {
        draggable: true
    };
    var directionsDisplay = new google.maps.DirectionsRenderer(rendererOptions);
    var directionsService = new google.maps.DirectionsService();

    google.maps.event.addListener(directionsDisplay, 'directions_changed', function () {
        var time = computeTotalDistance(directionsDisplay.directions);
        $('#TravelTime').val(time);
    });
    calcRoute();
    function calcRoute() {
        var start = fromLocation;
        var end = toLocation;
        var request = {
            origin: start,
            destination: end,
            travelMode: google.maps.DirectionsTravelMode.DRIVING
        };
        directionsService.route(request, function (response, status) {
            if (status === google.maps.DirectionsStatus.OK) {
                directionsDisplay.setDirections(response);
            }
        });
    }
    function computeTotalDistance(result) {
        var time = 0;
        var myroute = result.routes[0];
        for (var i = 0; i < myroute.legs.length; i++) {
            time += myroute.legs[i].duration.value;
        }
        var total = parseInt(time / 60); //time in minutes
        return total;
    }
}
function Validate() {
    if (!fromloc) {
        $('#lblMessage').text("Please enter From location.");
        navigator.notification.alert(
       'Please enter From location.',
        noFromLoc,
        'ECABS4U',
        "OK"
        );
        function noFromLoc()
        { }
        return false;
    }

    else if (($("#txt2location").is(":visible")) && !($('#txt2location').val())) {
        $('#lblMessage').text("Please enter Second destination.");
        navigator.notification.alert(
       'Please enter Second destination.',
        noSecondLoc,
        'ECABS4U',
        "OK"
        );
        function noSecondLoc()
        { }
        return false;
    }
    else if (($("#txt3location").is(":visible")) && !($('#txt3location').val())) {
        $('#lblMessage').text("Please enter Third destination.");
        navigator.notification.alert(
       'Please enter Third destination.',
        noThirdLoc,
        'ECABS4U',
        "OK"
        );
        function noThirdLoc()
        { }
        return false;
    }
    else if (($("#txt4location").is(":visible")) && !($('#txt4location').val())) {
        $('#lblMessage').text("Please enter Fourth destination.");
        navigator.notification.alert(
       'Please enter Fourth destination.',
        noFourthLoc,
        'ECABS4U',
        "OK"
        );
        function noFourthLoc()
        { }
        return false;
    }
    else if (($("#txt5location").is(":visible")) && !($('#txt5location').val())) {
        $('#lblMessage').text("Please enter Fifth destination.");
        navigator.notification.alert(
       'Please enter Fifth destination.',
        noFifthLoc,
        'ECABS4U',
        "OK"
        );
        function noFifthLoc()
        { }
        return false;
    }
    else if (($("#txt6location").is(":visible")) && !($('#txt6location').val())) {
        $('#lblMessage').text("Please enter Sixth destination.");
        navigator.notification.alert(
       'Please enter Sixth destination.',
       noSixthLoc,
        'ECABS4U',
        "OK"
        );
        function noSixthLoc()
        { }
        return false;
    }
    else if (($("#txt7location").is(":visible")) && !($('#txt7location').val())) {
        $('#lblMessage').text("Please enter Seven destination.");
        navigator.notification.alert(
       'Please enter Seven destination.',
        noSevenLoc,
        'ECABS4U',
        "OK"
        );
        function noSevenLoc()
        { }
        return false;
    }
    else if (($("#txt8location").is(":visible")) && !($('#txt8location').val())) {
        $('#lblMessage').text("Please enter Eigth destination.");
        navigator.notification.alert(
       'Please enter Eigth destination.',
        noEigthLoc,
        'ECABS4U',
        "OK"
        );
        function noEigthLoc()
        { }
        return false;
    }
    else if (!toloc) {
        $('#lblMessage').text("Please enter Final destination.");
        navigator.notification.alert(
       'Please enter Final destination.',
        noToLoc,
        'ECABS4U',
        "OK"
        );
        function noToLoc()
        { }
        return false;
    }
       
    else if ($("#txtDistance").val() === "0.00 miles") {
        $('#lblMessage').text("Please select proper locations so as to calculate distance between them.");
        return false;
    }
    
    else if (($("#btnbookreturn").is(":hidden")) && !($("#rtPickDate").val())) {

        $('#lblMessage').text("Please enter return Date.");
        navigator.notification.alert(
       'Please enter return Date.',
        noreturnDate,
        'ECABS4U',
        "OK"
        );
        function noreturnDate()
        { }
        return false;

    }

    else if (($("#trReturn").is(":visible")) && IsCheckedTrue == false) {
        $('#lblMessage').text("Please check confirm box.");
        navigator.notification.alert(
       'Please check confirm box.',
        noCheckConfirm,
        'ECABS4U',
        "OK"
        );
        function noCheckConfirm()
        { }
        return false;
    }
    else {
        $('#lblMessage').text("");
        window.setTimeout(availabledriver, 500);
    }

}
function availabledriver() {
    //multiple Destination
    secondLoc = $('#txt2location').val();
    thirdLoc = $('#txt3location').val();
    fourthLoc = $('#txt4location').val();
    fifthLoc = $('#txt5location').val();
    sixthLoc = $('#txt6location').val();
    seventhLoc = $('#txt7location').val();
    eightLoc = $('#txt8location').val();
                       
    toloc = $('#txtTo').val();
    distance = $('#txtDistance').val();
    if (isCabNow == true) {
        var currentDate = new Date()
        var d = currentDate.getDate();
        var m = currentDate.getMonth() + 1;
        var y = currentDate.getFullYear();
        var h = currentDate.getHours();
        var mn = currentDate.getMinutes();
                    }
                    else {
        var pickDateTime = fromDate.value();
        var d = pickDateTime.getDate();
        var m = pickDateTime.getMonth() + 1;
        var y = pickDateTime.getFullYear();
        var h = pickDateTime.getHours();
        var mn = pickDateTime.getMinutes();
        }
    pickdate = (d + "/" + m + "/" + y);
    picktime = (h + ":" + mn);
    totalpassenger = $("#ddlpassenger option:selected").text();
    largecase = $("#ddllargecase option:selected").text();
    smallcase = $("#ddlsmallcase option:selected").text();
    if ($('#radCrditcard:checked').val() == 1) {
        isCreditCard = true;
    }
    else if ($('#radcash:checked').val() == 2) {
        isCreditCard = false;
    }
    //special
    WchairPassengers = $("#ddlWheelchair option:selected").text();
    childSeats = $("#ddlChidseats option:selected").text();
    childBooster = $("#ddlChidbooster option:selected").text();
    otherSpeRequirement = $("#txtothereSpecialRequirement").val();
    //for return
    if (isReturn == true) {
        var returnDateTime = rtDate.value();
        var rd = returnDateTime.getDate();
        var rm = returnDateTime.getMonth() + 1;
        var ry = returnDateTime.getFullYear();
        var rh = returnDateTime.getHours();
        var rmn = returnDateTime.getMinutes();
        rtPickedDate = (rd + "/" + rm + "/" + ry);
        rtPickedTime = (rh + ":" + rmn);
    }
    travelTime = $('#TravelTime').val();
    laterpostcode = $('#locfrom_postcode').val();
    latertopostcode = $('#locto_postcode').val();
    console.log(laterpostcode);
    $.ajax({
        url: "http://192.168.1.22/ECabs/ECabs4U.asmx/CustomerSearchRequest",
        cache: false,
        beforeSend: function () { showLoading(); },
        complete: function () { hideLoading(); },
        type: "POST",
        dataType: "Json",
        data: "{'userID':'" + relatedId + "','isCabNow':'" + isCabNow + "','frompost':'" + fromloc + "', 'topost':'" + toloc + "','distance':'" + distance + "','pickDate':'" + pickdate + "','pickTime':'" + picktime + "','passenger':'" + totalpassenger + "','lcase':'" + largecase + "','scase':'" + smallcase + "','isCreditCard':'" + isCreditCard + "','WchairPassengers':'" + WchairPassengers + "','childSeats':'" + childSeats + "','childBooster':'" + childBooster + "','otherSpeRequirement':'" + otherSpeRequirement + "','IsReturnTrue':'" + isReturn + "','returnfromloc':'" + toloc + "','returntoloc':'" + fromloc + "','returnDate':'" + rtPickedDate + "','returnTime':'" + rtPickedTime + "','travelTime':'" + travelTime + "','samedriver':'" + isSameDriver + "','laterpostcode':'" + laterpostcode + "','latertopostcode':'" + latertopostcode + "','secondL':'" + secondLoc + "','thirdLoc':'" + thirdLoc + "','fourthLoc':'" + fourthLoc + "','fifthLoc':'" + fifthLoc + "','sixthLoc':'" + sixthLoc + "','seventhLoc':'" + seventhLoc + "','eightLoc':'" + eightLoc + "'}",
        contentType: "application/json; charset=utf-8",
        success: function (data) {
            if (data.d[0] !== "Error") {
                var reqID = data.d[0];
                if (isCabNow == true)
                    app.application.navigate('#customerSearchList');
                else {
                    navigator.notification.alert(
                  "Awaiting bids. Please check later.",
                    searchLater,
                     'ECABS4U',
                      "OK"
                  );
                    function searchLater() {
                        clearfields();
                        //app.application.navigate('#Profile');
                    }
                }
                jobID = reqID;
            }
            else {
                //alert(data.d[1]);
                navigator.notification.alert(
                data.d[1],
              searchError,
               'ECABS4U',
                "OK"
                );
                function searchError()
                { }
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
        }
    });
}
function checkConfirm() {
    IsCheckedTrue = $("#chkConfirm").is(":checked");
    console.log(IsCheckedTrue);
}

function showExpaBox() {
    $("#modalview-CommentBox").kendoMobileModalView("open");
}
