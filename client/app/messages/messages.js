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
        // controller: 'MessageCtrl',
        templateUrl: 'app/messages/views/inbox.html'
      })
      .state('messages.message', {
        url: '/:id',
        templateUrl: 'app/messages/views/message.html'
      })
      .state('messages.compose', {
        url: '/compose',
        templateUrl: 'app/messages/views/compose.html'
      });

  });
