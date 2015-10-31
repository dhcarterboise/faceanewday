(function () {
    'use strict';

    //region Injectors
    var serviceId = 'sessionService';
    angular.module('app').factory(serviceId, [
        '$rootScope',
        '$http',
        '$q',
        'config',
        'logService',
        'localStorageService',
        sessionService
    ]);
    //endregion

    function sessionService($rootScope, $http, $q, config, log, localStorageService) {

        //region Service Model
        var service = {
            // Entities
            config: config,
            clientId: '',
            connectionStatus: {
              appleWeb: {
                  loggedIn: false,
                  server: {},
                  tokenExpiration: 60
              },
              googleWeb: {
                  loggedIn: false,
                  server: {},
                  tokenExpiration: 60
              },
              microsoftWeb: {
                    loggedIn: false,
                    server: {},
                    tokenExpiration: 60
                },
            },
            // Methods
            login: login,
            refreshToken: refreshToken
        };
        //endregion

        //region Service Methods

        // Login: Authenticates user credentials and returns OAuth access token.
        function login(username, password, serverUrl, clientId) {

            log.debug('Attempting Login... User=' + username + " ServiceUrl: " + serverUrl + 'api/token');
            log.debug('With username: ' + username + " & Password: " + password);

            var deferred = $q.defer();

            $http({
                method: 'POST',
                url: serverUrl + 'api/token',
                headers: {},
                data: "userName=" + username + "&password=" + password + "&client_id=" + clientId + "&grant_type=password"
            }).success(function (data) {

                // Set Local Storage Value
                switch(clientId) {

                    case 'appleWeb':
                        localStorageService.set('authorizationDataApple', data);
                        break;
                    case 'googleWeb':
                        localStorageService.set('authorizationDataGoogle', data);
                        break;
                    case 'microsoftWeb':
                        localStorageService.set('authorizationDataMicrosoft', data);
                        break;
                }

                deferred.resolve(data);

            }).error(function (error) {
                deferred.reject(error);
            });

            return deferred.promise;
        }


        // RefreshToken: Re-authenticates existing OAuth refresh token.
        function refreshToken(refreshToken, clientId, serverUrl) {

            var deferred = $q.defer();

            $http({
                method: 'POST',
                url: serverUrl + 'api/token',
                headers: { },
                data: "refresh_token=" + refreshToken + "&client_id=" + clientId  + "&grant_type=refresh_token"
            }).success(function (data) {

                // Set Local Storage Value
                switch(clientId) {

                    case 'appleWeb':
                        localStorageService.set('authorizationDataApple', data);
                        break;
                    case 'googleWeb':
                        localStorageService.set('authorizationDataGoogle', data);
                        break;
                    case 'microsoftWeb':
                        localStorageService.set('authorizationDataMicrosoft', data);
                        break;
                }

                deferred.resolve(data);

            }).error(function (error) {
                deferred.reject(error);
            });

            return deferred.promise;
        }

        //endregion

        return service;
    }

})();
