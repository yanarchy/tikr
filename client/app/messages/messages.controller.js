'use strict';

angular.module('tikrApp')
  .controller('MessageCtrl', ['$scope', '$state', '$location', 'messageService', function($scope, $state, $location, messageService) {
    $scope.inboxFilter = 'null';
    // Set $state on the scope to access it in the views.
    $scope.$state = $state;

    // Defines the side menu properties.
    // TODO: Refactor sidebar to populate with ng-repeat.
    $scope.sidebar = [{
      'title': 'Inbox',
      'sref': 'messages.inbox',
      'link': '/messages/inbox',
      'badge': $scope.newCount || 0
    }, {
      'title': 'Sent',
      'sref': 'messages.sent',
      'link': '/messages/sent'
    }];

    var titles = {
      '/inbox': 'Inbox',
      '/sent': 'Sent',
      '/compose': 'Compose'
    };

    // Returns boolean of current state or hash.
    $scope.isActive = function(route) {
      if (route[0] === '/') return route === $location.path();
      else return route === $location.hash();
    };

    // Fetches a messages list that belongs to the authenticated user.
    $scope.getInbox = function() {
      messageService.getInbox().then(function(messages) {
        $scope.messages = messages;
        $scope.starCount = 0;
        $scope.newCount = 0;
        for (var i = 0; i < messages.length; i++) {
          if (!!messages[i].starred) $scope.starCount++;
          if (!messages[i].read) $scope.newCount++;
        }
      });
    };

    // Fetches list of message objects of messages that were sent by the user.
    $scope.getSent = function() {
      messageService.getSent().then(function(messages) {
        $scope.sentMessages = messages;
      });
    };

    // Filters inbox to only show new messages.
    $scope.filterNew = function() {

    };

    // Filters inbox to only show starred messages.
    $scope.filterStarred = function() {
      //
    };

    // Clear message filters for inbox view.
    $scope.clearFilter = function() {
      //
    };

    // Fetches a specific message.
    $scope.show = function(message) {
      $scope.newCount--;
      messageService.update(message, {
        read: true
      }).then(function(doc) {
        $scope.message = doc;
        message.read = true;
      });
    };

    // Marks the message as 'starred' for the user.
    $scope.star = function(message) {
      var starred = message.starred;
      !message.starred ? $scope.starCount++ : $scope.starCount--;
      messageService.update(message, {
        starred: !starred
      }).then(function(doc) {
        message.starred = !message.starred;
      });
    };

    // Creates a new private message to a user.
    // Messages should be sent with the following properties:
    // to (github login), from (string: github login), title (string)
    $scope.create = function(newMessage) {
      // TODO: Notify user that the message was sent or not.
      messageService.create(newMessage).then(function(doc) {
        $scope.messages.push(doc);
        $state.transitionTo('messages.inbox');
      }, function() {
        $state.transitionTo('messages.compose');
      });
    };

    // Functions to load needed messages based on state.
    var fetchDirector = {
      'messages': $scope.getInbox,
      'messages.inbox': $scope.getInbox,
      'messages.sent': $scope.getSent,
      'messages.starred': $scope.getStarred
    };

    // On state change, if state is inbox, sent, or stared, fetch appropriate messages.
    $scope.$on('$stateChangeStart',
      function(event, toState, toParams, fromState, fromParams) {
        if (titles[toState.url]) $scope.pageTitle = titles[toState.url];
        if (fetchDirector[toState.name]) fetchDirector[toState.name]();
      }
    );

    // Load inbox for initial messages view.
    $scope.getInbox();
    $scope.pageTitle = titles[$state.current.url];

  }]);
