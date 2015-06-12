'use strict';
// Declare app level module which depends on views, and components
angular.module('cmgrApp', [
	'appLibrary',
	'ngRoute',
	'smoothScroll',
	'LocalStorageModule',
	'cmgrApp.home',
	'cmgrApp.collection',
	'cmgrApp.favorites',
	'cmgrApp.search',
	'cmgrApp.version'
])
	.constant('VERSION', 1)
	.constant('MSG_NO_COLLECTION', 'Sorry you have no items in your collection.')
	.config(['$routeProvider', 'localStorageServiceProvider', function ($routeProvider, localStorageServiceProvider) {
		$routeProvider.otherwise({redirectTo: '/'});
		localStorageServiceProvider
			.setPrefix('cmgrApp')
			.setNotify(true, true);
	}])
	.controller('MainCtrl', ['$scope', 'localStorageService', function($scope, storage){
		$scope.hasCollection = false;

		if(!storage.isSupported) {
			console.log('LS NOT SUPPORTED - WTF???');
		} else {
			console.log('LS SUPPORTED - GTG!!');
			var collection = storage.get('collection');

			if (collection){
				// Set has Collection true
				$scope.hasCollection = true;

				// set scope variable for collection
				$scope.collection = collection;

				// get top 10 items ?

				// add to slider

				// done
			}

			console.log(collection);
		}
	}]);
