function CancelJob(jobId) {
    navigator.notification.confirm(
    "Are you sure to cancel this job?.",
    canceljob, // Specify a function to be called 
    'ECABS4U',
    "OK,Cancel"
    );

    function canceljob(buttonIndex) {
        if (buttonIndex === 2) {

            return false;
        }
        else if (buttonIndex === 1) {

            var url = "http://ecabs4uservice.azurewebsites.net/ECabs4U.asmx/CancelJob";

            $.ajax(url, {
                beforeSend: function () {
                    showLoading();
                },
                complete: function () {
                    hideLoading();
                },
                type: "POST",
                datatype: "json",
                data: "{'jobID':'" + jobId + "','customerID':'" + relatedId + "'}",
                contentType: "application/json; charset=utf-8",
                success: function (data) {
                    navigator.notification.alert(
                   'Job cancelled successfully.',
                    jobCancelled22,
                    'ECABS4U',
                    "OK"
                    );
                    function jobCancelled22()
                    {
                        getCablaterBooking();
                        getCabnowBooking();
                    }
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) { }
            });

        }
    }
}

function CancelDriver(jobID, driverid) {
    navigator.notification.confirm(
                 "Are you sure to cancel this driver?.",
                  canceldriver33,
                  'ECABS4U',
                 "OK,Cancel"
                  );

    function canceldriver33(buttonIndex) {
        if (buttonIndex === 2) {

            return false;
        }
        else if (buttonIndex === 1) {
            $.ajax({
                url: "http://ecabs4uservice.azurewebsites.net/ECabs4U.asmx/CancelDriverForJob",
                type: "POST",
                datatype: "json",
                data: "{'jobID':'" + jobID + "','driverID':'" + driverid + "','customerID':'" + relatedId + "'}",
                contentType: "application/json; charset=utf-8",
                success: function () {
                    navigator.notification.alert(
                   'Driver cancelled for this job.',
                    cancelDriverFoJob,
                    'ECABS4U',
                    "OK"
                    );
                    function cancelDriverFoJob()
                    {
                        getCablaterBooking();
                        getCabnowBooking();
                    }
                },
                error: function (XMLHttpRequest, textStatus, errorThrown)
                { }
            });

        }
    }
}
