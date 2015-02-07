'use strict';

angular.module('tikrApp')
  .controller('SearchCtrl', function($scope, $http, $q, $parse, User, Auth) {
    $scope.users = [];
    $scope.searchStarted = false;
    $scope.languageToSearch = 'JavaScript';
    $scope.searchType = 'userSearch';
    $scope.language = {};
    $scope.username = {};
    $scope.location = {};
    var user = Auth.getCurrentUser();

    // returns a promise
    $scope.fetchUsers = function(languageToSearch, userToSearch, locationToSearch, pageNumber) {
      if(languageToSearch && (languageToSearch.value || (languageToSearch.selected && languageToSearch.selected.value))){
        $scope.languageToSearch = languageToSearch.value || (languageToSearch.selected && languageToSearch.selected.value);
      } else {
        $scope.languageToSearch = " ";
      }

      if(userToSearch && (userToSearch.value || (userToSearch.selected && userToSearch.selected.value))){
        $scope.userToSearch = userToSearch.value || (userToSearch.selected && userToSearch.selected.value);
      } else {
        $scope.userToSearch = undefined;
      }

      if(locationToSearch && (locationToSearch.value || (locationToSearch.selected && locationToSearch.selected.value))){
        $scope.locationToSearch = locationToSearch.value || (locationToSearch.selected && locationToSearch.selected.value);
        $scope.locationToSearch = $scope.locationToSearch.split(",")[0];
      } else {
        $scope.locationToSearch = undefined;
      }

      user.$promise
        .then(function(user) {
          User.search({
            skill: $scope.languageToSearch,
            username: user.github.login,
            userToSearch: $scope.userToSearch,
            locationToSearch: $scope.locationToSearch,
            pageNumber: pageNumber || 1
          }, function(data) {
            $scope.searchStarted = true;
            $scope.data = data[0];
            $scope.users = $scope.data.items;

            //create array of Github usernames
            $scope.usernames = [];
            $scope.users.forEach(function(user) {
              $scope.usernames.push({value: user.login});
              $scope.permusernames = $scope.usernames;
            });

            //create array of Github locations
            $scope.locations = [];
            $scope.users.forEach(function(user) {
              if(user.userInfo && user.userInfo.location) {
                $scope.locations.push({value: user.userInfo.location});
                $scope.permlocations = $scope.locations;
              }
            });
          });
        });
    };

    $scope.entry = {};
    $scope.refreshTypeahead = function(input, type) {

      // Get the data
      var data = $scope.$eval('perm' + type) || [];
      var filtered = [];
      data.forEach(function(object) {
        if(object.value.toLowerCase().indexOf(input.toLowerCase()) !== -1) {
          filtered.push({value: object.value});
        }
      });

      filtered.sort(function(a, b) {
        if(a.value.indexOf(input) < b.value.indexOf(input)) return -1;
        else if(a.value.indexOf(input) > b.value.indexOf(input)) return 1;
        else return 0;
      });

      var model = $parse(type);
      model.assign($scope, filtered);
      // Apply it to the scope
      $scope.$apply();
    };

    $scope.clearLocationFilter = function() {
      $scope.location.selected = undefined;
      $scope.fetchUsers($scope.language, $scope.username, null);
    };

    $scope.clearUsernameFilter = function() {
      $scope.username.selected = undefined;
      $scope.fetchUsers($scope.language, null, $scope.location);
    };

    $scope.clearLanguageFilter = function() {
      $scope.language.selected = undefined;
      $scope.fetchUsers(null, $scope.username, $scope.location);
    };

    //init
    $scope.language.selected = {};
    $scope.language.selected.value = $scope.languageToSearch;
    $scope.fetchUsers({value: $scope.languageToSearch});

    $http.get('/api/languages').success(function(data) {
      $scope.languages = [];
      data.forEach(function(language) {
        $scope.languages.push({value: language.Name});
        $scope.permlanguages = $scope.languages;
      });
    });
  });
