'use strict';

angular.module('tikrApp')
	.controller('MsgComponentsCtrl', function($scope, $location, Auth, $stateParams, User) {

		$scope.isCollapsed = true;
		$scope.isLoggedIn = Auth.isLoggedIn;
		$scope.isAdmin = Auth.isAdmin;
		$scope.getCurrentUser = Auth.getCurrentUser;

		// Defines the side menu properties.
		$scope.sidebar = [{
			'title': 'Inbox',
			'sref': 'messages.inbox',
			'link': 'inbox',
			'badge': $scope.messages ? $scope.messages.length : 0
		}, {
			'title': 'Sent',
			'sref': 'messages.sent',
			'link': 'sent'
		}, {
			'title': 'Starred',
			'sref': 'messages.starred',
			'link': 'starred',
			'badge': $scope.starred || 0
		}];

		// Returns boolean of current state.
		$scope.isActive = function(route) {
			return route === $location.path();
		};

		console.log('in comp', $scope.messages);

	});
