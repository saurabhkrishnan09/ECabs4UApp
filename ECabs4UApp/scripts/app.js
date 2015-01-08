(function (global) {
    var app = global.app = global.app || {};
    app.application = new kendo.mobile.Application(document.body, {
        layout: "tabstrip-layout", platform: "ios7", transition: "slide",
        init: function () { }
    });

    document.addEventListener('deviceready', function () {
        app.changeSkin = function (e) {
            var mobileSkin = "";
            if (e.sender.element.text() === "Flat") {
                e.sender.element.text("Native");
                mobileSkin = "flat";
            } else {
                e.sender.element.text("Flat");
                mobileSkin = "";
            }
            app.application.skin(mobileSkin);
        };
        navigator.splashscreen.hide();
    }, false);
})(window);
