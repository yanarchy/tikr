'use strict';

angular.module('tikrApp')
  .config(function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.when('/messages', '/messages/inbox');

    $stateProvider
      .state('messages', {
        url: '/messages',
        controller: 'MessageCtrl',
        templateUrl: 'app/messages/messages.html',
        abstract: true
      })
      .state('messages.inbox', {
        url: '/inbox',
        templateUrl: 'app/messages/views/inbox.html'
      })
      .state('messages.sent', {
        url: '/sent',
        templateUrl: 'app/messages/views/sent.html'
      });

  });
