angular.module('tikrApp')
  .controller('ComposeModalCtrl', function($rootScope, $scope, $state, $modalInstance, message, messageService) {
    $scope.messageTo = message;

    $scope.close = function() {
      $modalInstance.close();
    };

    // Creates a new private message to a user.
    // Messages should be sent with the following properties:
    // to (github login), from (string: github login), title (string)
    $scope.send = function(newMessage) {
      newMessage.to = newMessage.to || $scope.messageTo;
      messageService.create(newMessage).then(function(doc) {
        // TODO: Notify user that message was sent.
        $modalInstance.close();
      }, function() {
        // TODO: Notify user that message was not sent.
        console.log('ERROR: Message not sent.')
      });
    };

  });
