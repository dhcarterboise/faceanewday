(function () {
    'use strict';

    //region Injectors
    var controllerId = 'apple';
    angular.module('app').controller(controllerId, [
        '$location',
        '$routeParams',
        '$timeout',
        'sessionService',
        'logService',
        'localStorageService',
        'appleService',
        'config',
        apple
    ]);
    //endregion

    function apple($location, $routeParams, $timeout, session,
                   log, localStorageService, appleService, config) {

        //region View Model
        var vm = this;
        vm.loginUsername = (session.config.debugMode) ? 'glucas' : '';
        vm.loginPassword = (session.config.debugMode) ? 'password' : '';

        vm.isLoggedIn = false;
        vm.tokenExpiration = 0;
        vm.stuff = [];
        vm.server = null;
        vm.clientId = "appleWeb";
        vm.appleAuthData = {};

        vm.statusType = 'alert alert-info';
        vm.statusMessage = '';

        vm.submitLogin = submitLogin;
        vm.logoff = logoff;
        vm.refreshToken = refreshToken;
        vm.clearStatus = clearStatus;
        vm.getStuff = getStuff;
        vm.changeServer = changeServer;
        vm.changeUser = changeUser;
        vm.hideData = hideData;

        vm.authDataApple = {};
        vm.servers = [
            { name: "Velma", url: 'http://localhost:56735/' }
        ];
        vm.users = [
            { name: "glucas", password: 'password'},
            { name: "admin", password: '909overland'}
        ];
        vm.user = {};
        vm.loginType = "Username/Password";
        vm.hideShow = "Hide";
        vm.hide = false;

        //endregion

        //region Initialization
        init();

        function init() {


            PopulateSessionData();

            vm.server = vm.servers[0];


            if (vm.appleAuthData) {
                // Try Refresh Token Login
                log.debug("Apple Init with Refresh Token Login");
                refreshToken();
            } else {
                log.debug("Apple Init");
            }

        }
        //endregion

        // region Page Methods

        function PopulateSessionData() {
            vm.appleAuthData = localStorageService.get("authorizationDataApple");

            log.debug("PopulateSessionData: ", vm.appleAuthData);
            vm.isLoggedIn = session.connectionStatus.appleWeb.loggedIn;
            vm.server = session.connectionStatus.appleWeb.server;
            vm.tokenExpiration = session.connectionStatus.appleWeb.tokenExpiration;
            if (vm.isLoggedIn) {
                vm.statusMessage = 'Logged In!';
                tokenExpirationTimer();
            }
        }

        function changeServer() {

            session.connectionStatus.appleWeb.server = vm.server;

        }

        function changeUser() {

            vm.loginUsername = vm.user.name;
            vm.loginPassword = vm.user.password;
        }

        function hideData() {

            vm.hide = !vm.hide;
            if (vm.hide)
                vm.hideShow = "Show";
            else
                vm.hideShow = "Hide";

        }

        // SubmitLogin: Requests login for the specified user
        function submitLogin() {

            config.clientId = vm.clientId;
            log.debug("Submit Apple Login");

            // Reset status
            vm.isLoggedIn = false;
            vm.statusType = 'alert alert-info';
            vm.statusMessage = 'Logging In...';

            // Call login function
            session.login(vm.loginUsername, vm.loginPassword, vm.server.url, vm.clientId).then(
                function (data) {


                    vm.errors = null;
                    vm.loginType = "Username/Password";
                    log.debug('Apple Post Success - Setting Authorization Data to Local Storage', data);

                    vm.appleAuthData = localStorageService.get("authorizationDataApple");

                   // console.log("Expires in " + data.expires_in);

                    session.connectionStatus.appleWeb.loggedIn = true;
                    vm.isLoggedIn = true;

                    // Clear the status message
                    clearStatus();

                    vm.statusType = 'alert alert-success';
                    vm.statusMessage = 'Logged In!';
                    vm.isSaving = false;
                    vm.tokenExpiration = data.expires_in;
                    tokenExpirationTimer();

                },
                function (error) {

                    vm.isLoggedIn = false;

                    if (error.error == "invalid_grant")
                        vm.errors = "Refresh Token Might Have expired";
                    else if (error.error == "invalid_clientId")
                        vm.errors = "Invalid Client ID or Access has been Revoked";
                    else if (!error)
                        vm.errors = "You do not have access to the requested resource";

                    // If failed, force logoff then display the error
                    vm.statusType = 'alert alert-danger';
                    vm.statusMessage = vm.errors;
                    vm.isSaving = false;

                });
        }

        // RefreshToken: Re-authenticates using existing refresh token
        function refreshToken() {

            config.clientId = vm.clientId;
            var authData = localStorageService.get("authorizationDataApple");

            if (!authData) {
                vm.errors = "Auth Data not found";
                return;
            }

            session.refreshToken(authData.refresh_token, vm.clientId,  vm.server.url).then(
                function (data) {

                    vm.loginType = "Refresh Token";
                    session.connectionStatus.appleWeb.loggedIn = true;
                    vm.appleAuthData = localStorageService.get("authorizationDataApple");
                    vm.isLoggedIn = true;

                    clearStatus();

                    vm.statusType = 'alert alert-success';
                    vm.statusMessage = 'Logged In!';
                    vm.isSaving = false;

                    log.debug("Refresh Auth Data Received: ", vm.appleAuthData);
                    //log.debug("Expires In: ",vm.appleAuthData.expires_in);

                    vm.tokenExpiration = vm.appleAuthData.expires_in;
                    tokenExpirationTimer();

                }, function (error) {

                    vm.isLoggedIn = false;

                    if (error.error == "invalid_grant")
                        vm.errors = "Refresh Token Might Have expired";
                    else if (error.error == "invalid_clientId")
                        vm.errors = "Invalid Client ID or Access has been Revoked";
                    else if (!error)
                        vm.errors = "You do not have access to the requested resource";

                    // If failed, force logoff then display the error
                    vm.statusType = 'alert alert-danger';
                    vm.statusMessage = vm.errors;
                    vm.isSaving = false;

                }
            );
        }

        // SubmitLogoff: Requests logoff for the current user (if any)
        function logoff() {

            vm.appleAuthData = {};
            vm.isLoggedIn = false;
            session.connectionStatus.appleWeb.loggedIn = false;
            session.connectionStatus.appleWeb.server = {};
            vm.server = null;
            vm.errors = null;
            clearStatus();
        }

        // ClearStatus: Clears any existing status messages
        function clearStatus() {
            vm.errors = null;
            vm.statusType = 'alert alert-info';
            vm.statusMessage = '';
            vm.isSaving = false;
        }

        function getStuff(stuffid) {

            log.debug("Apple Get Stuff");

            vm.stuff = [];

            if (!vm.server.url) {
                vm.server.url = vm.servers[0].url;
            }

            appleService.getStuff(vm.server.url, stuffid).then(
                function(data) {
                    vm.stuff = data;
                    vm.errors = null;
                },
                function(error) {
                    vm.errors = error;
                  //  log.error('Get Stuff Failed...', error);
               //     alert('Unable to get Stuff.');
                }
            );
        }

        function tokenExpirationTimer() {
            $timeout(function() {
                if (vm.tokenExpiration <= 0)
                    return;
                vm.tokenExpiration--;
                session.connectionStatus.appleWeb.tokenExpiration = vm.tokenExpiration;
                tokenExpirationTimer();
            }, 1000);
        }

        //endregion
    }

})();

