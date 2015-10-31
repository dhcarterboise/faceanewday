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

            config.headers = config.headers || {};

            var authData = localStorageService.get('authorizationDataVelma');

            if (authData) {
                config.headers.Authorization = 'Bearer ' + authData.access_token;
            }

            return config;
        };

        var _responseError = function (rejection) {
            return $q.reject(rejection);
        };

        authInterceptorServiceFactory.request = _request;
        authInterceptorServiceFactory.responseError = _responseError;

        return authInterceptorServiceFactory;
    }

})();