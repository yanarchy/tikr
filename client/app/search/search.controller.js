'use strict';

angular.module('tikrApp')
  .controller('SearchCtrl', function($scope, $http, $q, User) {
    $scope.users = [];
    $scope.skill = 'javascript';
    $scope.searchStarted = false;

    // returns a promise
    $scope.fetchUsers = function() {

      User.search({
        skill: $scope.skill
      }, function(data) {
        $scope.searchStarted = true;
        $scope.data = data[0];
        $scope.users = $scope.data.items;
      });
    };

    //init
    $scope.fetchUsers();
  });
