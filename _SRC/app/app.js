'use strict';
// Main App Module
angular.module('cmgrApp', [
	'appLibrary',
	'ngRoute',
	'cmgrApp.home',
	'cmgrApp.collection',
	'cmgrApp.favorites',
	'cmgrApp.search',
	'cmgrApp.version'
])
	// Constants
	.constant('VERSION', 1)
	.constant('MSG_NO_COLLECTION', 'Sorry you have no items in your collection.');
