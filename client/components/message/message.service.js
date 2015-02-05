'use strict';

angular.module('tikrApp')
  .factory('messageService', ['$http', '$q', '$state', 'Auth', function($http, $q, $state, Auth) {

    return {

      // Get the users messages.
      inbox: function() {
        var deffered = $q.defer();
        $http.get('/api/messages/inbox')
          .success(function(data) {
            deffered.resolve(data);
          })
          .error(function(data) {
            deffered.reject(data);
          });

        return deffered.promise;
      },

      // Get messages that the user sent.
      sent: function() {
        var deffered = $q.defer();
        $http.get('/api/messages/sent')
          .success(function(data) {
            deffered.resolve(data);
          })
          .error(function(data) {
            deffered.reject(data);
          });

        return deffered.promise;
      },

      // Updates the properties on the message.
      update: function(message, property) {
        var deffered = $q.defer();
        $http.put('/api/messages/update', {
            message: message,
            property: property
          })
          .success(function(message) {
            deffered.resolve(message);
          })
          .error(function() {
            deffered.reject(false);
          });

        return deffered.promise;
      },

      // Param Object message JS Object of a new message to post.
      // Returns a {promise}.
      create: function(newMessage) {
        var deffered = $q.defer();
        var message = {
          to: newMessage.to,
          from: Auth.getCurrentUser().github.login,
          title: newMessage.title,
          content: newMessage.message.replace(/\n/g, '<br />')
        };

        $http.post('/api/messages/create', message)
          .success(function(doc) {
            deffered.resolve(doc);
          })
          .error(function() {
            deffered.reject(false);
          });

        return deffered.promise;
      }

    };

  }]);
