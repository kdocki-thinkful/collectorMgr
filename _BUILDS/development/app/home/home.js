'use strict';
angular.module('cmgrApp.home', [
	'ngRoute',
	'smoothScroll',
	'appLibrary'
])
	// Route Config
	.config(['$routeProvider', function ($routeProvider) {
		$routeProvider.when('/', {
			templateUrl: 'home/home.html',
			controller: 'HomeCtrl',
			controllerAs: 'homeCtrl'
		});
	}])
	// Controller
	.controller('HomeCtrl', ['$scope', 'collectionService', '$timeout', '$window', function ($scope, collectionService, $timeout, $window) {
		this.collection = collectionService.getCollection();
	}]);
