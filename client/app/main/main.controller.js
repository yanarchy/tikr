'use strict';

angular.module('tikrApp')
  .controller('MainCtrl', function ($scope, $http, $window, Auth) {
    $scope.isLoggedIn = Auth.isLoggedIn;

    $scope.loginOauth = function(provider) {
      $window.location.href = '/auth/' + provider;
    };
  });
