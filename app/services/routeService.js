(function () {
    'use strict';

    angular.module('app').config([
        '$routeProvider',
        'routes',
        routeConfigurator]);

    function routeConfigurator($routeProvider, routes) {

        init();

        //region Methods

        function init() {

            // Add each route to the route provider
            routes.forEach(function (r) {
                setRoute(r.url, r.config);
            });

            $routeProvider.otherwise({ redirectTo: '/' });
        }

        /* SetRoute: Adds the specified route to the route provider */
        function setRoute(url, config) {

            // Add url to route provider
            $routeProvider.when(url, config);
            return $routeProvider;
        }

    }

})();
