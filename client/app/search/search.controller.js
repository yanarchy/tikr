'use strict';

angular.module('tikrApp')
  .controller('SearchCtrl', function($scope, $http, $q, User, Auth) {
    $scope.users = [];
    $scope.searchStarted = false;
    $scope.selected = 'javascript';
    var user = Auth.getCurrentUser();

    // returns a promise
    $scope.fetchUsers = function(language, pageNumber) {
      $scope.selected = language;

      user.$promise
        .then(function(user){
          User.search({
            skill: language,
            username: $scope.TEST_USER || user.github.login,
            pageNumber: pageNumber
          }, function(data) {
            $scope.searchStarted = true;
            $scope.data = data[0];
            $scope.users = $scope.data.items;
          });
        });
    };

    $scope.entry = {};
    $scope.refreshTypeahead = function(input) {

      $http.get('/api/languages').success(function(data) {
        $scope.languages = [];
        data.forEach(function(language) {
          $scope.languages.push(language.Name);
        });

        if(!input){
          return;
        }

        var filtered = [];
        $scope.languages.forEach(function(language) {
          if(language.toLowerCase().indexOf(input.toLowerCase()) !== -1) {
            filtered.push(language);
          }
        });

        filtered.sort(function(a,b){
          if(a.indexOf(input) < b.indexOf(input)) return -1;
          else if(a.indexOf(input) > b.indexOf(input)) return 1;
          else return 0;
        });

        $scope.languages = filtered;
      });
    };

    //init
    $scope.fetchUsers($scope.selected);
  });
