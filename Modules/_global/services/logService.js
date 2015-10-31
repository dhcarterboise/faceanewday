(function () {
    'use strict';

    //region Injectors
    var serviceId = 'logService';
    angular.module('app').factory(serviceId, [
        '$log',
        'config',
        logService
    ]);
    //endregion

    function logService($log, config) {

        //region Service Model
        var service = {
            error: error,
            warn: warn,
            info: info,
            success: success,
            debug: debug
        };
        //endregion

        //region Service Methods

        function error(message, data) { logMessage('error', message, data); }
        function warn(message, data) { logMessage('warn', message, data); }
        function info(message, data) { logMessage('info', message, data); }
        function success(message, data) { logMessage('success', message, data); }
        function debug(message, data) { logMessage('debug', message, data); }

        function logMessage(level, message, data) {

            //TODO: Implement config and/or url based filter
            //Ex. If >debug, skip debug logging

            switch(level) {
                case 'error':
                    $log.error(message);
                    if (data)
                        $log.error(data);
                    break;
                case 'warn':
                    $log.warn(message);
                    if (data)
                        $log.warn(data);
                    break;
                case 'info':
                    $log.info(message);
                    if (data)
                        $log.info(data);
                    break;
                case 'success':
                    $log.success(message);
                    if (data)
                        $log.success(data);
                    break;
                case 'debug':
                default:
                    $log.debug(message);
                    if (data)
                        $log.debug(data);
                    break;
            }
        }

        //endregion

        return service;
    }

})();

