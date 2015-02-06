'use strict';

angular.module('tikrApp')
	.controller('MainCtrl', function($scope, $http, $window, Auth) {
		$scope.isLinkedIn = Auth.isLinkedIn;

		$scope.loginOauth = function(provider) {
			$window.location.href = '/auth/' + provider;
		};
	});