(function () {
    'use strict';

    var routes = [
        {
            url: '/',
            config: {
                templateUrl: 'modules/home/templates/home.htm',
                title: 'Accounts'
            }
        },
        {
            url: '/apple',
            config: {
                templateUrl: 'modules/clients/apple/templates/apple.htm',
                title: 'Google'
            }
        },
        {
            url: '/google',
            config: {
                templateUrl: 'modules/clients/google/templates/google.htm',
                title: 'Google'
            }
        },

        {
            url: '/microsoft',
            config: {
                templateUrl: 'modules/clients/microsoft/templates/microsoft.htm',
                title: 'Microsoft'
            }
        },
    ];
    angular.module('app').constant('routes', routes);

})();
