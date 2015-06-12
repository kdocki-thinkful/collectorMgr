'use strict';
angular.module('cmgrApp.home', ['ngRoute'])

	.config(['$routeProvider', function ($routeProvider) {
		$routeProvider.when('/', {
			templateUrl: 'home/home.html',
			controller: 'HomeCtrl'
		});
	}])

	.controller('HomeCtrl', [function () {


	}]);
