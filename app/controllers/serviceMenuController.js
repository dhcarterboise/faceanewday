(function () {

    'use strict';

    var controllerId = 'serviceMenu';
    angular.module('app').controller(controllerId, [
        '$scope',
        '$routeParams',
        '$timeout',
        'logService',
        serviceMenu
    ]);

    function serviceMenu($scope, $routeParams, $timeout, log) {

        var vm = this;

        function init() {

            log.debug("Page One");

        }

        init();

    }


})();