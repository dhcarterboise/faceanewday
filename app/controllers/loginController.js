(function () {

    'use strict';

    var controllerId = 'login';
    angular.module('app').controller(controllerId, [
        '$scope',
        '$routeParams',
        '$timeout',
        'logService',
        login
    ]);

    function login($scope, $routeParams, $timeout, log) {

        var vm = this;

        vm.isLoggedIn = false;
        vm.pageMessage = '';
        vm.loginUsername = 'user';
        vm.loginPassword = 'password';

        vm.login = login;

        function login() {

            log.debug("Login");

            vm.pageMessage = 'Clicked Login';

        }

    }



})();