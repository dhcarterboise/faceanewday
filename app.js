(function () {
    'use strict';

    var app = angular.module('app',
        [
            // Angular
            'ngAnimate',            // animations
            'ngRoute',              // routing
            'ngSanitize',           // sanitizes html bindings (ex: sidebar.js)
            'LocalStorageModule'    // angular-local-storage: HTML5 storage, cookies for older browsers
            // Custom modules 

            // 3rd Party Modules

        ]);

    // Application Data
    app.value('appData', {
        siteTitle: 'Velma Clients',
        pageTitle: 'Velma CliSnapShot Postcard',
        copyrightText: new Date().getFullYear() + ' NSN Solutions, Inc. All rights reserved.'
    });

    // Site Initialization
    // Add user credentials and other info to rootScope for easy access throughout the app!
    // Note: We should minimize the amount of data stored in this way.
    app.run(['$window', '$http', '$rootScope', 'appData',
        function ($window, $http, $rootScope, appData) {

            // Save app-level data to rootScope
            $rootScope.appData = appData;

            // Update page title
            $rootScope.$on('$routeChangeSuccess', function (event, current, previous) {

                // Update page title
                appData.pageTitle = ((current.$$route) && (current.$$route.title))
                    ? current.$$route.title.replace('$$SiteTitle$$', appData.siteTitle)  //ex. Velma - Contact List
                    : appData.siteTitle;  //ex. Velma
            });
        }
    ]);

    // Local Storage - Configuration for saved values
    app.config(['localStorageServiceProvider', function(localStorageServiceProvider){
        localStorageServiceProvider.setPrefix('velma');
        localStorageServiceProvider.setStorageCookieDomain('velma.com');
        //localStorageServiceProvider.setStorageType('sessionStorage'); //default=localStorage
    }]);

    app.config(function ($httpProvider) {
        $httpProvider.interceptors.push('authInterceptorService');
    });




})();