(function () {

    'use strict';

    var controllerId = 'pageTwo';
    angular.module('app').controller(controllerId, [
        '$scope',
        '$routeParams',
        '$timeout',
        'logService',
        pageTwo
    ]);

    function pageTwo($scope, $routeParams, $timeout, log) {

        var vm = this;

        function init() {

            log.debug("Page Two");

        }

        init();

    }



})();