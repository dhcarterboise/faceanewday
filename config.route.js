(function () {
    'use strict';

    var routes = [
        {
            url: '/',
            config: {
                templateUrl: 'app/templates/home.htm',
                title: 'Home'
            }
        },
        {
            url: '/login',
            config: {
                templateUrl: 'app/templates/login.htm',
                title: 'Login'
            }
        },
        {
            url: '/pageOne',
            config: {
                templateUrl: 'app/templates/pageOne.htm',
                title: 'Page 1'
            }
        },
    ];
    angular.module('app').constant('routes', routes);

})();
