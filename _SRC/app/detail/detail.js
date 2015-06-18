'use strict';
angular.module('cmgrApp.detail', [])
	// Route Config
	.config(['$routeProvider', function ($routeProvider) {
		$routeProvider.when('/comic/:id', {
			templateUrl: 'detail/detail.html',
			controller: 'DetailCtrl',
			controllerAs: 'detailCtrl'
		});
	}])
	// Controller
	.controller('DetailCtrl', ['$scope', 'collectionService', '$timeout', '$window', '$routeParams', '$sce', function ($scope, collectionService, $timeout, $window, $routeParams, $sce) {

		var that = this;

		// Setup
		this.darkenElement = false;
		this.showBTT = false;


		this.comic = collectionService.getComic($routeParams.id);

		// It's on - Bind to window scroll event
		// Todo : Throttle call
		angular.element($window).bind("scroll", function(e) {

			// check if the darken element has moved
			// TODO : use the event to determine the element to watch
			that.darkenElement = this.pageYOffset !== 0;

			// Focus on the first found '.searchFormInput' if offset is !== 0
			// if offset is === 0 and focus on input, then blur the input
			if(this.pageYOffset !== 0){
				angular.element('.searchFormInput').focus();
				that.showBTT = true;
			} else if (this.pageYOffset === 0){
				angular.element('.searchFormInput').blur();
				that.showBTT = false;
			}

			// Run Apply to digest
			$scope.$apply();
		});

		// Darken Element Function
		this.darkenElementFn = function() {

			// Add set to true to add class to darken
			this.darkenElement = true;
			that.showBTT = true;

			// Set focus on search box after 500ms
			$timeout(function() {
				angular.element('.searchFormInput').focus();
			}, 500);
		};

		this.comicHtml = $sce.trustAsHtml(this.comic.description);
	}]);
