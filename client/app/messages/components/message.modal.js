angular.module('tikrApp')
  .controller('ModalInstanceCtrl', function($scope, $state, $modalInstance, message) {
    $scope.message = message;

    $scope.close = function() {
      $modalInstance.close();
    };

    $scope.reply = function() {
      $scope.close();
      $state.transitionTo('messages.compose');
    };

  });
