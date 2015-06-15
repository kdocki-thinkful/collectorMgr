'use strict';
angular.module('cmgrApp.home', [
	'ngRoute',
	'smoothScroll',
	'appLibrary'
])

	.config(['$routeProvider', function ($routeProvider) {
		$routeProvider.when('/', {
			templateUrl: 'home/home.html',
			controller: 'HomeCtrl',
			controllerAs: 'homeCtrl'
		});
	}])
	.controller('HomeCtrl', ['$scope', 'collectionService', '$timeout', '$window', function ($scope, collectionService, $timeout, $window) {
		var that = this;

		this.darkenSplash = false;
		this.collection = collectionService.getCollection();

		angular.element($window).bind("scroll", function () {
			console.log(this.pageYOffset);
			that.darkenSplash = this.pageYOffset !== 0;
			$scope.$apply();
		});

		this.darkenSlider = function (element) {

			// Add class so we do nto wait for Angular Digest to apply via ng-class
			angular.element(element).parent().find('.hideSplashOverLay').addClass('darken');
			that.darkenSplash = true;

			// Set focus on search box
			$timeout(function () {
				angular.element('.searchFormInput').focus();
			}, 1000);
		};
	}]);
