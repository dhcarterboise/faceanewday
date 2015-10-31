(function () {
    'use strict';

    var controllerId = 'baseController';
    angular.module('app').controller(controllerId, [
        '$scope', 
        '$location', 
        '$window', 
        '$q', 
        '$http', 
        '$filter',
        baseController
    ]);

    // Base Controller
    function baseController($scope, $location, $window, $q, $http, $filter) {

        // Auto-hide menu dropdown (small-form factor only)
        $('.navbar-nav li a').click(function() {
            if ($('.navbar-collapse').hasClass('in'))
                $('.navbar-collapse').collapse('hide');
        });

        /* IsActive: Indicates whether specified view is the current one */
        $scope.isActive = function (viewLocation, containsHandling) {
       
            //console.log('Path=' + $location.path());
            if (containsHandling)
                return $location.path().indexOf(viewLocation) > -1;
            else
                return viewLocation === $location.path();
        };
    }
})();