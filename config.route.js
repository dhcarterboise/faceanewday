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
            url: '/serviceMenu',
            config: {
                templateUrl: 'app/templates/serviceMenu.htm',
                title: 'Service Menu'
            }
        },
        {
            url: '/about',
            config: {
                templateUrl: 'app/templates/about.htm',
                title: 'About'
            }
        },
        {
            url: '/products',
            config: {
                templateUrl: 'app/templates/products.htm',
                title: 'Products'
            }
        },
        {
            url: '/contact',
            config: {
                templateUrl: 'app/templates/contact.htm',
                title: 'Contact'
            }
        },
        {
            url: '/login',
            config: {
                templateUrl: 'app/templates/login.htm',
                title: 'Login'
            }
        },

    ];
    angular.module('app').constant('routes', routes);

})();
