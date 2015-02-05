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
      .state('messages.compose', {
        url: '/compose',
        templateUrl: 'app/messages/views/compose.html'
      })
      .state('messages.sent', {
        url: '/sent',
        templateUrl: 'app/messages/views/sent.html'
      })
      .state('messages.message', {
        url: '/:id',
        templateUrl: 'app/messages/views/message.html'
      });

  });
