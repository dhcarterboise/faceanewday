(function () {

    //region Injectors
    'use strict';

    var serviceId = 'appleService';

    angular.module('app').factory(serviceId, [
        '$http',
        '$q',
        'sessionService',
        appleService]);
    //endregion

    function appleService($http, $q, session) {

        // region Service Model
        var service = {
            getStuff: getStuff
        };
        // endregion

        //region Service Methods
        function getStuff(serverUrl, stuffid) {
            var deferred = $q.defer();

            var route;

            switch(stuffid) {

                case 1:
                    route = 'api/accounts/publiclist';
                    break;
                case 2:
                    route = 'api/accounts/privatelist';
                    break;
                case 3:
                    route = 'api/accounts/adminlist';
                    break;
            }

            console.log(serverUrl + route);

            $http({
                method: 'GET',
                url: serverUrl + route
            }).success(function (data) {
                deferred.resolve(data);
            }).error(function (data) {
                deferred.reject(data);
            });

            return deferred.promise;
        }

        //endregion

        return service;
    }

})();