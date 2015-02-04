'use strict';

angular.module('tikrApp')
	.controller('MsgComponentsCtrl', function($scope, $location, Auth, $stateParams, User) {

		$scope.isCollapsed = true;
		$scope.isLoggedIn = Auth.isLoggedIn;
		$scope.isAdmin = Auth.isAdmin;
		$scope.getCurrentUser = Auth.getCurrentUser;

		// Defines the side menu properties.
		$scope.menu = [{
			'title': 'Inbox',
			'link': '/inbox'
		}, {
			'title': 'Sent',
			'link': '/sent'
		}, {
			'title': 'Starred',
			'link': '/starred'
		}];

		// Returns boolean of current state.
		$scope.isActive = function(route) {
			return route === $location.path();
		};

	});
