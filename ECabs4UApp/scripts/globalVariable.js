var userId;
var roleId;
var relatedId;
var jobID;
var From;
var To;
var CustResponse;
var DriverName;
var DriverPhoto;
var VehicleImages;
var DriverSpecialReq;
var DriverID;
var Fare;
var getCustomerHistory;
var isAnyDriverHired = false;
var viewid;
var id;
var bidh;
var bidm;
var spec;
var searchTime;
var bidTime;
var isChecked;
var waypts = [];
var directionsDisplay;
var map;
var arrLoc = new Array();
var dis1, dis2, dis3, dis4, dis5, dis6, dis8, dis9, dis11, dis13, dis14, dis15;
var locFrom, loc2, loc3, loc4, loc5, loc6, loc7, loc8, locTo;
var isCabNow = true;
var pickedDate;
var travelTime;
var latertopostcode;
var laterpostcode;
var pickedTime;
var rtPickedDate;
var rtPickedTime;
var isReturn=false;
var isSpecReq;
var isSameDriver;
var secondLoc;
var thirdLoc;
var fourthLoc;
var fifthLoc;
var sixthLoc;
var seventhLoc;
var eightLoc;
var fromloc;
var toloc;
var totalpassenger;
var largecase;
var smallcase;
var WchairPassengers;
var childSeats;
var childBooster;
var otherSpeRequirement;
var isCreditCard = null;
var retunD;
var IsCheckedTrue=false;
var distance;
var timeOut;
var expiryCount = 0;
var myVehicles = "";
var sec = 15;
var RegistrationNo = "", PlateNo = "", Capacity = "", vehImgUrl = "", vehAllocatedID = "", isAuthorised = "false";
var driverImgUrl;
var timerId, checkDealResp, anyMoreDriver = true;
var timer;
var reinitiateCounter;
var dId, reqId, specS;

var clearTimerId = '';

var finalrating = 0;
var cancelledJOb;

var JobOffersTimer;
var driverBidTimer;
var customerBookingTimer;
var cancelledJobCustomerTimer;
var failedJObTimer;
var jobCheckTime;

//Function for DateTime Calculation and can be used globally in full app 'STARTS'
var currentdatetime = new Date();
var todayDate = moment(new Date(), "DD-MM-YYYY");
var currentTime = moment(new Date(), "HH:mm");
var wholeMinute = moment(new Date());
var hh = new Date().getHours() + 1;
wholeMinute.hour(hh);
if (wholeMinute.minute() > 30) {
    wholeMinute.hour(hh + 1);
    wholeMinute.minute(0);
}
else
    wholeMinute.minute(30);
//Function for DateTime Calculation and can be used globally in full app 'ENDS'

