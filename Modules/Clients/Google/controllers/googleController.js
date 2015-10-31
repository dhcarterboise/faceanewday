(function () {
    'use strict';

    //region Injectors
    var controllerId = 'google';
    angular.module('app').controller(controllerId, [
        '$location',
        '$routeParams',
        '$timeout',
        'sessionService',
        'logService',
        'localStorageService',
        'googleService',
        'config',
        google
    ]);
    //endregion

    function google($location, $routeParams, $timeout, session,
                   log, localStorageService, googleService, config) {

        //region View Model
        var vm = this;
        vm.loginUsername = (session.config.debugMode) ? 'google@velmatools.com' : '';
        vm.loginPassword = (session.config.debugMode) ? 'password' : '';

        vm.isLoggedIn = false;
        vm.tokenExpiration = 0;
        vm.stuff = [];
        vm.server = null;
        vm.clientId = "googleWeb";
        vm.googleAuthData = {};

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

        vm.authDataGoogle = {};
        vm.servers = [
            { name: "Snapshot", url: 'http://localhost:57407/' },
            { name: "Velma", url: 'http://localhost:56735/' }
        ];
        vm.users = [
            { name: "google@velmatools.com", password: 'password'},
            { name: "googleAdmin@velmatools.com", password: 'password'}
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
            if (vm.googleAuthData) {
                // Try Refresh Token Login
                log.debug("Google Init with Refresh Token Login");
                refreshToken();
            } else {
                log.debug("Google Init");
            }

        }
        //endregion

        // region Page Methods

        function PopulateSessionData() {
            vm.googleAuthData = localStorageService.get("authorizationDataGoogle");
            vm.isLoggedIn = session.connectionStatus.googleWeb.loggedIn;
            vm.server = session.connectionStatus.googleWeb.server;
            vm.tokenExpiration = session.connectionStatus.googleWeb.tokenExpiration;
            if (vm.isLoggedIn) {
                vm.statusMessage = 'Logged In!';
                tokenExpirationTimer();
            }
        }

        function changeServer() {

            session.connectionStatus.googleWeb.server = vm.server;

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
            log.debug("Submit Google Login");

            // Reset status
            vm.isLoggedIn = false;
            vm.statusType = 'alert alert-info';
            vm.statusMessage = 'Logging In...';

            // Call login function
            session.login(vm.loginUsername, vm.loginPassword, vm.server.url, vm.clientId).then(
                function (data) {

                    vm.errors = null;
                    vm.loginType = "Username/Password";
                    log.debug('Google Post Success - Setting Authorization Data to Local Storage', data);

                    vm.googleAuthData = localStorageService.get("authorizationDataGoogle");

                    session.connectionStatus.googleWeb.loggedIn = true;
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
            var authData = localStorageService.get("authorizationDataGoogle");

            if (!authData) {
                vm.errors = "Auth Data not found";
                return;
            }

            session.refreshToken(authData.refresh_token, vm.clientId,  vm.server.url).then(
                function (data) {

                    vm.loginType = "Refresh Token";
                    session.connectionStatus.googleWeb.loggedIn = true;
                    vm.googleAuthData = localStorageService.get("authorizationDataGoogle");
                    vm.isLoggedIn = true;

                    clearStatus();

                    vm.statusType = 'alert alert-success';
                    vm.statusMessage = 'Logged In!';
                    vm.isSaving = false;

                    log.debug("Refresh Auth Data Received: ", vm.googleAuthData);
                    //log.debug("Expires In: ",vm.googleAuthData.expires_in);

                    vm.tokenExpiration = vm.googleAuthData.expires_in;
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

            vm.googleAuthData = {};
            vm.isLoggedIn = false;
            session.connectionStatus.googleWeb.loggedIn = false;
            session.connectionStatus.googleWeb.server = {};
            vm.server = null;
            vm.errors = null;
            clearStatus();
        }

        // ClearStatus: Clears any existing status messages
        function clearStatus() {
            vm.statusType = 'alert alert-info';
            vm.statusMessage = '';
            vm.isSaving = false;
        }

        function getStuff(stuffid) {

            log.debug("Google Get Stuff");

            vm.stuff = [];

            if (!vm.server.url) {
                vm.server.url = vm.servers[0].url;
            }

            googleService.getStuff(vm.server.url, stuffid).then(
                function(data) {
                    vm.stuff = data;
                    vm.errors = null;
                },
                function(error) {
                    vm.errors = error;
                }
            );
        }

        function tokenExpirationTimer() {
            $timeout(function() {
                if (vm.tokenExpiration <= 0)
                    return;
                vm.tokenExpiration--;
                session.connectionStatus.googleWeb.tokenExpiration = vm.tokenExpiration;
                tokenExpirationTimer();
            }, 1000);
        }

        //endregion
    }

})();

