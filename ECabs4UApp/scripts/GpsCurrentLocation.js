$(document).ready(function () {
    if (roleId > 0 && roleId != 4) {
        window.onload = UpdateLocation();
        $.ajax({
            url: "http://ecabs4uservice.azurewebsites.net/ECabs4U.asmx/GetGPSTime",    //Get Response from driver
            type: "POST",
            dataType: "Json",
            data: "",
            contentType: "application/json; charset=utf-8",
            success: UpdatePostCode,
            error: function (XMLHttpRequest, textStatus, errorThrown) { }
        });
    }

});
var postCodeFetchTime;

function UpdatePostCode(data) {
    postCodeFetchTime = (data.d) * 10000;
    setInterval(function () {
        UpdateLocation();
    }, postCodeFetchTime);
}

function UpdateLocation() {
    console.log('In update location function');
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            var pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
            var geocoder = new google.maps.Geocoder();
            var latLng = pos;
            geocoder.geocode({ 'latLng': latLng }, function (results, status) {
                if (status == google.maps.GeocoderStatus.OK) {
                    if (results[0]) {
                        var postalCode = extractFromAdress(results[0].address_components, "postal_code");
                        var address = results[1].formatted_address;
                        function extractFromAdress(components, type) {
                            for (var i = 0; i < components.length; i++)
                                for (var j = 0; j < components[i].types.length; j++)
                                    if (components[i].types[j] == type)
                                        return components[i].long_name;
                            return "";
                        }
                        updatePostCode(postalCode, address);
                    }
                }

            });
        });
    }
}

function updatePostCode(postalCode, address) {
    console.log('Updating location..updated');
    $.ajax({
        url: 'http://ecabs4uservice.azurewebsites.net/ECabs4U.asmx/UpdateLocationMapping',
        type: "post",
        dataType: "json",
        data: "{'postalCode':'" + postalCode + "','Id':'" + relatedId + "', 'address':'" + address + "'}",
        contentType: "application/json; charset=utf-8",
        success: function (data) {
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
        }
    });
}