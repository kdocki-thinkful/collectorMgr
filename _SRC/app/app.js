'use strict';
// Main App Module
angular.module('cmgrApp', [
	'appLibrary',
	'ngRoute',
	'cmgrApp.home',
	'cmgrApp.collection',
	'cmgrApp.favorites',
	'cmgrApp.search',
	'cmgrApp.detail',
	'cmgrApp.version'
])
	// Config
	.config(function($routeProvider, $httpProvider) {
		$httpProvider.defaults.useXDomain = true;
	})
	// Constants
	.constant('VERSION', 1)
	.constant('MSG_NO_COLLECTION', 'Sorry you have no items in your collection.');
