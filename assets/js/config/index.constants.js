/* global malarkey:false, moment:false */
(function() {
  'use strict';

  angular
    .module('angular')
    .constant('moment', moment)
    .constant('ORDER_STATUS', {
      canceled: 'order-canceled',
      failed: 'order-failed',
      pending: 'order-pending',
      accepted: 'order-accepted',
      ready: 'order-ready',
      completed: 'order-completed',
    });

})();
