(function () {
    'use strict';

    var app = angular.module('app');

    // Global Config
    var config = {
        pageTitle: 'FaceANewDay',
        version: '2.0.0',
        velmaUrl: 'https://app.velma.com/',
        debugMode: true, //Debug Mode - Set to true to expose debug info on specific pages.
        logLevel:'debug', //Default site log level. Options: debug/info/warn/error/success/none,
        clientId: ''
    };
    app.value('config', config);

})();