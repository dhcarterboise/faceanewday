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

            // To eliminate #slash in urls:
            // Use the HTML5 History API
            // Ex. Add <base href='/your_folder/> to the Head section
            //$locationProvider.html5Mode(true);
        }

        /* SetRoute: Adds the specified route to the route provider */
        function setRoute(url, config) {

            // Do we need to inject route security checking?
            // Options:
            // - config.authRequired: If false, no security checking - i.e. page is allowed for everyone.
            // - config.authData: Formatted list of roles allowed/blocked/etc for this route.
            //   ex. { AllowedRoles: [ 'Administrator', 'BusinessOwner' ], ExcludedRoles: [ 'Product_WJBradley', 'Product_NJLenders' ] }
            // Note: If no auth data, authenticated users only will be allowed.
            //if ((!config.resolve) && (config.authRequired != false)) {
            //    config.resolve = {
            //        data: ['$q', '$location', '$timeout',
            //            function ($q, $location, $timeout) {
            //
            //            }
            //        ]};
            //}

            // Add url to route provider
            $routeProvider.when(url, config);
            return $routeProvider;
        }

    }

})();
