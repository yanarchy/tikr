'use strict';

angular.module('tikrApp')
  .controller('MessageCtrl', ['$scope', '$state', '$location', 'messageService', function($scope, $state, $location, messageService) {
    $scope.starred = 0;

    // Set $state on the scope to access it in the views.
    $scope.$state = $state;

    // Defines the side menu properties.
    // TODO: Refactor sidebar to populate with ng-repeat.
    $scope.sidebar = [{
      'title': 'Inbox',
      'sref': 'messages.inbox',
      'link': '/messages/inbox',
      'badge': $scope.messages ? $scope.messages.length : 0
    }, {
      'title': 'Sent',
      'sref': 'messages.sent',
      'link': '/messages/sent'
    }, {
      'title': 'Starred',
      'sref': 'messages.starred',
      'link': '/messages/starred',
      'badge': $scope.starred || 0
    }];

    // Returns boolean of current state.
    $scope.isActive = function(route) {
      return route === $location.path();
    };

    // Fetches a messages list that belongs to the authenticated user.
    $scope.inbox = function() {
      messageService.inbox().then(function(messages) {
        $scope.messages = messages;
        console.log(messages);
      });
    };

    // Fetches a specific message.
    $scope.show = function(message) {
      messageService.update(message, {
        read: true
      }).then(function(doc) {
        $scope.message = doc;
        message.read = true;
      });
    };

    // Prioritizes the message for the user.
    $scope.starred = function(message) {
      messageService.update(message, {
        starred: true
      }).then(function(doc) {
        message.starred = true;
      });
    };

    // Creates a new private message to a user.
    $scope.create = function(newMessage) {
      messageService.create(newMessage).then(function(doc) {
        $scope.messages.push(doc);
        $state.transitionTo('messages.inbox');
      }, function() {
        $state.transitionTo('messages.compose');
      });
    };

    $scope.inbox();
    $state.transitionTo('messages.inbox');

  }]);
