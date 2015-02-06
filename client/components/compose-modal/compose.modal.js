angular.module('tikrApp')
  .controller('ComposeModalCtrl', function($scope, $state, $modalInstance, message) {
    $scope.message = message;

    $scope.close = function() {
      $modalInstance.close();
    };

    $scope.reply = function() {
      $scope.close();
    };

  });
