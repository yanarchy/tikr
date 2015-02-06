angular.module('tikrApp')
  .controller('ModalInstanceCtrl', function($scope, $state, $modal, $modalInstance, message) {
    $scope.message = message;

    $scope.close = function() {
      $modalInstance.close();
    };

    // Modal for sending messages.
    $scope.reply = function() {

      var modalInstance = $modal.open({
        templateUrl: 'components/compose-modal/compose.modal.html',
        controller: 'ComposeModalCtrl',
        size: 'large',
        resolve: {
          message: function() {
            return $scope.message.from;
          }
        }
      });

      $scope.close();
    };

  });
