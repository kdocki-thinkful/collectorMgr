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
	.controller('DetailCtrl', ['$scope', 'collectionService', '$timeout', '$window', '$routeParams', function ($scope, collectionService, $timeout, $window, $routeParams) {
		this.comic = collectionService.getComic($routeParams.id);
	}]);
