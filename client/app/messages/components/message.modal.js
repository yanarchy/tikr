angular.module('tikrApp')
  .controller('ModalInstanceCtrl', function($scope, $modalInstance, message) {
    $scope.message = message;

    $scope.close = function() {
      $modalInstance.close();
    };

    $scope.reply = function() {
      //
    };

    $scope.delete = function() {
      //
    };

  });
