/*
Note: This is a template copied from main
*/
'use strict';

angular.module('tikrApp')
  .controller('SkillsCtrl', function ($scope, $http, Auth) {
    $scope.awesomekills = [];

    $http.get('/api/skills').success(function(awesomeSkills) {
      $scope.awesomeSkills = awesomeSkills;
    });

    $scope.isCollapsed = true;
    $scope.isLoggedIn = Auth.isLoggedIn;
    $scope.isAdmin = Auth.isAdmin;
    $scope.getCurrentUser = Auth.getCurrentUser;

    $scope.addSkill = function() {
      if($scope.newSkill === '') {
        return;
      }
      $http.post('/api/skills', { name: $scope.newSkills });
      $scope.newSkill = '';
    };

    $scope.loginOauth = function(provider) {
      $window.location.href = '/auth/' + provider;
    };

    $scope.deleteSkill = function(skill) {
      $http.delete('/api/skills/' + skill._id);
    };
  });
