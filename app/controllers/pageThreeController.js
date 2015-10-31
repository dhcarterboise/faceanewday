(function () {

    'use strict';

    var controllerId = 'pageThree';
    angular.module('app').controller(controllerId, [
        '$scope',
        '$routeParams',
        '$timeout',
        'logService',
        pageThree
    ]);

    function pageThree($scope, $routeParams, $timeout, log) {

        var vm = this;

        function init() {

            log.debug("Page Three");

        }

        init();

    }



})();