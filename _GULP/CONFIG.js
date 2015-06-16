// *********************************************************************************************************************
// Main Config Obj
// *********************************************************************************************************************
// noinspection JSUnusedGlobalSymbols
'use strict';

var gCfg = {
	env: (process.env.NODE_ENV || 'development').toLowerCase(),
	buildUrl: function buildUrl() {
		return './_BUILDS/' + this.env + '/app/';
	},
	getBuildDir: function getBuildDir(dir) {
		var d = typeof dir !== 'undefined' ? dir : '';
		return this.buildUrl() + d;
	},
	srcUrl: function srcUrl() {
		return './_SRC/app/';
	},
	getSrcDir: function getSrcDir(dir) {
		var d = typeof dir !== 'undefined' ? dir : '';
		return this.srcUrl() + d;
	},
	serverOptions: function serverOptions() {
		var that = this;
		return {
			root: that.buildUrl(),
			livereload: true,
			port: 64033
		};
	}
};

// *********************************************************************************************************************
// Sources
// *********************************************************************************************************************
gCfg.sources = {

	// JS source path vars
	js: [
		// Entry
		gCfg.getSrcDir('app.js'),
		gCfg.getSrcDir('app-lib.js'),
		// Views
		gCfg.getSrcDir('home/home.js'),
		gCfg.getSrcDir('collection/collection.js'),
		gCfg.getSrcDir('favorites/favorites.js'),
		gCfg.getSrcDir('detail/detail.js')
	],
	// LESS source path vars
	less: [
		gCfg.getSrcDir('less/*.less'),
		'!' + gCfg.getSrcDir('less/**/_*.less')
	],

	// HTML Sources to process
	html: [
		gCfg.getSrcDir('*.html'),
		gCfg.getSrcDir('home/**/*.html'),
		gCfg.getSrcDir('collection/**/*.html'),
		gCfg.getSrcDir('favorites/**/*.html'),
		gCfg.getSrcDir('detail/**/*.html'),
		gCfg.getSrcDir('components/directives/**/*.html')
	],
	// Files to Copy source path vars
	copy: [

		// Include everything
		gCfg.getSrcDir('**/**'),

		// Exclude pre-processor DIRs
		'!' + gCfg.getSrcDir('less'),
		'!' + gCfg.getSrcDir('less/**'),

		// SRC DIRs to exclude

		// Individual files and folders to include / exclude
		'!' + gCfg.getSrcDir('app.js'),
		'!' + gCfg.getSrcDir('app-lib.js'),
		'!' + gCfg.getSrcDir('index.html'),
		'!' + gCfg.getSrcDir('home/home.html'),
		'!' + gCfg.getSrcDir('home/*_test.js'),
		'!' + gCfg.getSrcDir('collection/collection.html'),
		'!' + gCfg.getSrcDir('collection/*_test.js'),
		'!' + gCfg.getSrcDir('favorites/favorites.html'),
		'!' + gCfg.getSrcDir('favorites/*_test.js')
	],

	// JS Lib Order
	jsLibs: [],

	// CSS Lib Order
	cssLibs: [],

	// Libs Assets

	imgLibs: [],

	// Libs Assets
	fontsLibs: []

};

// *********************************************************************************************************************
// Functions
// *********************************************************************************************************************
gCfg.fn = {
	capitalize: function capitalize(str) {

		// Capitalize first letter of string
		return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
	},

	cLog: function cLog(message) {

		// Console Log Message Function
		return '\n********************************************\n' + 'LOG :: ' + message + '\n********************************************';
	}
};

module.exports = gCfg;
