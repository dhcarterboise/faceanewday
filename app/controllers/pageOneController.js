(function () {

    'use strict';

    var controllerId = 'pageOne';
    angular.module('app').controller(controllerId, [
        '$scope',
        '$routeParams',
        '$timeout',
        'logService',
        pageOne
    ]);

    function pageOne($scope, $routeParams, $timeout, log) {

        var vm = this;

        function init() {

            log.debug("Page One");

        }

        init();

    }


})();