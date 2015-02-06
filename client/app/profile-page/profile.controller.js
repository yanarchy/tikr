'use strict';

angular.module('tikrApp')
  .controller('ProfileCtrl', function($scope, $http, $rootScope, $modal, messageService, $stateParams, $location, Auth, User) {

    $scope.languages = {};
    $scope.currentUsername = $stateParams.username;
    $scope.showFormToAddSkills = false;

    // TODO: Move server request logic to appropriate service in client/components/auth.
    // Server requests should be processed in the auth or user service, not directly in these controllers.
    $scope.getUserProfile = function() {
      var githubUsername = $stateParams.username;
      var url = 'api/users/profiles/' + githubUsername;

      return $http({
        method: 'GET',
        url: url
      }).
      success(function(profile /*, status, headers, config*/ ) {
        $scope.userProfile = profile;
        $scope.languages = profile.languages;
        var totalBytes = _.reduce($scope.languages, function(totalBytes, bytes) {
          return totalBytes += bytes;
        }, 0);
        _.map($scope.languages, function(bytes, key) {
          var pct = (bytes / totalBytes * 100);
          return $scope.languages[key] = [bytes, pct];
        });

        $scope.setupChart();

        return;
      }).
      error(function(data, status /*headers, config*/ ) {
        console.log('There has been an error', data);
        if (status === 404) {
          $location.path('/pagenotfound');
        }
        return data;
      });
    };

    $scope.isLoggedInAsCurrentUser = function() {
      var currentUserPage = $stateParams.username;
      var loggedInUser = Auth.getCurrentUser();
      if (loggedInUser.github && loggedInUser.github.login) {
        if (loggedInUser.github.login === currentUserPage) {
          return true;
        }
      }
      return false;
    };

    $scope.showAddSkillsForm = function() {
      $scope.showFormToAddSkills = true;
    };

    // TODO: Move server request logic to appropriate service in client/components/auth.
    // Server requests should be processed in the auth or user service, not directly in these controllers.
    $scope.addASkill = function(formdata) {
      $scope.showFormToAddSkills = false;
      var newSkillName = $scope.skillname;
      var newSkillLink = $scope.githublink;
      //console.log(formdata);
      if (formdata.$valid) {
        //submit POST request to server to add a skill to the current user's profile
        var githubUsername = $stateParams.username;
        var url = 'api/users/profiles/' + githubUsername;

        $http.post(url, {
          skillname: newSkillName,
          githublink: newSkillLink
        }).
        success(function(profile /*status, headers, config*/ ) {
          $scope.userProfile = profile;
        }).
        error(function(data, status, headers, config) {
          console.log("Error adding skill", data, status);
        });
      }
    };

    // Modal for sending messages.
    $scope.sendMessageTo = function(user) {
      var modalInstance = $modal.open({
        templateUrl: 'components/compose-modal/compose.modal.html',
        controller: 'ComposeModalCtrl',
        size: 'large',
        resolve: {
          message: function() {
            return user.github.login;
          }
        }
      });
    };

    $scope.setupChart = function() {
      var data = [];
      _.each($scope.languages, function(val, key) {
        data.push([key, val[1], 'test']);
      });

      var chart = c3.generate({
        data: {
          // Example:
          // columns: [
          //   ['data1',40, 30, 200, 100, 400, 150, 250, 50, 100, 250,67,190,48,123,76,54,254],
          //   ['x','Travel and Hospitality','Life Science and Pharma', 'Saas and Cloud', 'Hi-tech Manufacturing', 'Software', 'Business Services', 'Govt/Public Sector', 'Energy', 'Manufacturing', 'Healthcare','Media','Internet','Retail','Biotech','Automobile','Consumer Goods','Financial Services']
          // ],
          columns: data,
          type: 'donut',
        },
        pie: {
          width: 20,
          zerobased: true,
          title: "Languages"
        }
      });
    };

    $scope.getUserProfile();

    $scope.hasSkills = function() {
      if ($scope.userProfile && $scope.userProfile.skills) {
        return true;
      } else {
        return false;
      }
    };

  });
