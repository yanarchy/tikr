'use strict';

angular.module('tikrApp')
  .config(function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.when('/messages', '/messages/inbox');

    $stateProvider
      .state('inbox', {
        url: '/messages/inbox',
        controller: 'MessageCtrl',
        templateUrl: 'app/messages/messages.html'
      })
      .state('inbox.messages', {
        views: {
          'sidebar': {
            templateUrl: 'app/messages/components/sidebar.html'
          },
          'messages': {
            templateUrl: 'app/messages/views/inbox.html'
          }
        }
      })
      .state('inbox.messages.show', {
        url: '/:id',
        templateUrl: 'app/messages/views/message.html'
      })
      .state('inbox.messages.create', {
        url: '/compose',
        templateUrl: 'app/messages/views/compose.html'
      });

  });
