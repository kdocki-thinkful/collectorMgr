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

		var that = this;

		this.darkenSplash = false;
		this.collection = collectionService.getCollection();

		angular.element($window).bind("scroll", function (e) {
			that.darkenSplash = this.pageYOffset !== 0;
			angular.element('.searchFormInput').blur();
			$scope.$apply();
		});

		this.darkenSlider = function (element) {

			// Add set to true to add class to darken
			that.darkenSplash = true;

			// Set focus on search box
			$timeout(function () {
				angular.element('.searchFormInput').focus();
			}, 500);
		};
	}]);
