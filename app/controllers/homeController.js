(function () {
    'use strict';

    var controllerId = 'home';
    angular.module('app').controller(controllerId, [
        '$scope',
        '$routeParams',
        '$timeout',
        'logService',
        home
    ]);

    function home($scope, $routeParams, $timeout, log) {

        //region View Model
        var vm = this;
        vm.init = init;
        //endregion

        //region Initialization
        init();


        function init() {

        }
        //endregion

    }
})();