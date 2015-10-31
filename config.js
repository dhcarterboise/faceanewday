(function () {
    'use strict';

    var app = angular.module('app');

    // Global Config
    var config = {
        pageTitle: 'SnapShot',
        version: '2.0.0',
        serviceUrl: 'http://localhost:57407/',
        debugMode: true, //Debug Mode - Set to true to expose debug info on specific pages.
        logLevel:'debug', //Default site log level. Options: debug/info/warn/error/success/none,
        clientId: ''
    };
    app.value('config', config);

})();