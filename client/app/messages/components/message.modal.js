angular.module('tikrApp')
  .controller('ModalInstanceCtrl', function($scope, $state, $modal, $modalInstance, message) {
    $scope.message = message;

    $scope.close = function() {
      $modalInstance.close();
    };

    $scope.reply = function() {
      $scope.close();
      // $state.transitionTo('messages.compose');

      var modalInstance = $modal.open({
        templateUrl: 'app/components/compose-modal/compose.modal.html',
        controller: 'ComposeModalCtrl',
        size: 'large',
        resolve: {
          message: function() {
            return $scope.message;
          }
        }
      });
    };

  });
