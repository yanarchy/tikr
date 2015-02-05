'use strict';

angular.module('tikrApp')
  .controller('MessageCtrl', ['$scope', '$state', '$location', 'messageService', function($scope, $state, $location, messageService) {
    // Set $state on the scope to access it in the views.
    $scope.state = $state;
    $scope.location = $location;

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

    // Filters inbox to only show specific messages.
    $scope.filterInbox = function(filter) {
      $scope.search = {};
      if (filter) {
        var set = filter === 'read' ? false : true;
        $scope.search[filter] = set;
      }
    };

    // Fetches a specific message.
    $scope.show = function(message) {
      if (!message.read) {
        $scope.newCount--;
        messageService.update(message, {
          read: true
        }).then(function(doc) {
          $scope.message = doc;
          message.read = true;
        });
      }
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

    // Returns boolean of current state or hash.
    $scope.isActive = function(route) {
      if (route[0] === '/') return route === $location.path();
      else return route === $location.hash();
    };

    // Functions to load needed items based on state.
    var messageDirector = {
      '/inbox': {
        title: 'Inbox',
        fetch: function() {
          if (!$scope.search) $scope.filterInbox('new');
        }
      },
      '/sent': {
        title: 'Sent',
        fetch: $scope.getSent
      },
      '/compose': {
        title: 'Compose',
        fetch: null
      }
    };

    // On state change, if state is inbox, sent, or stared, fetch appropriate messages.
    $scope.$on('$stateChangeStart',
      function(event, toState, toParams, fromState, fromParams) {
        if (messageDirector[toState.url]) loadContent(toState.url);
        // If navigating away from an inbox view, save the hash so it is displayed if user returns to inbox.
        if (messageDirector[fromState.url]) {
          toParams.hash = $location.hash() || fromParams.hash;
        }
      }
    );

    // If navigating to an inbox view, load previous hash (or new if undefined.)
    $scope.$on('$stateChangeSuccess',
      function(event, toState, toParams, fromState, fromParams) {
        if (toState.url === '/inbox') {
          var target = fromParams.hash || 'new';
          $location.hash(target);
          $scope.filterInbox.bind(null, target);
        }
      }
    );

    // Load initial messages view.
    var loadContent = function(loadState) {
      // If no loadState is provided, default to inbox#new.
      loadState = loadState || '/inbox';
      var elements = messageDirector[loadState];
      if (elements) {
        $scope.getInbox();
        $scope.pageTitle = elements.title;
        if (elements.fetch) elements.fetch();
      }
    };
    loadContent($state.current.url);

  }]);
