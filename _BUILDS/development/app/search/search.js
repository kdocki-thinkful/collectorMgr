'use strict';
angular.module('cmgrApp.search', ['ngRoute'])

	.config(['$routeProvider', function($routeProvider) {
		$routeProvider.when('/search', {
			templateUrl: 'search/search.html',
			controller: 'SearchCtrl'
		});
	}])

	.controller('SearchCtrl', [function() {

	}]);
