(function () {
    'use strict';

    //region Injectors
    var serviceId = 'authInterceptorService';
    angular.module('app').factory(serviceId, [
        '$q',
        '$location',
        'localStorageService',
        'logService',
        'config',
        authInterceptorService
    ]);
    //endregion

    function authInterceptorService($q, $location, localStorageService, log, configure) {

        var authInterceptorServiceFactory = {};

        var _request = function (config) {

            //session.clientId

            config.headers = config.headers || {};

            var authData;
            switch(configure.clientId) {
                case "appleWeb":
                    authData = localStorageService.get('authorizationDataApple');
                    break;
                case "googleWeb":
                    authData = localStorageService.get('authorizationDataGoogle');
                    break;
                case "microsoftWeb":
                    authData = localStorageService.get('authorizationDataMicrosoft');
                    break;
            }

            if (authData) {

                //log.debug(configure.clientId +  "Interceptor Auth Data ", authData.access_token);
                config.headers.Authorization = 'Bearer ' + authData.access_token;
            }

            return config;
        };

        var _responseError = function (rejection) {
            //if (rejection.status === 401) {
            //    $location.path('/login');
            //}
            return $q.reject(rejection);
        };

        authInterceptorServiceFactory.request = _request;
        authInterceptorServiceFactory.responseError = _responseError;

        return authInterceptorServiceFactory;
    }

})();