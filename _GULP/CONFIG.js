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
		// Views
		gCfg.getSrcDir('view1/view1.js'),
		gCfg.getSrcDir('view2/view2.js')
	],
	// LESS source path vars
	less: [
		gCfg.getSrcDir('_less/*.less')
	],

	// HTML Sources to process
	html: [
		gCfg.getSrcDir('index.html'),
		gCfg.getSrcDir('view1/*.html'),
		gCfg.getSrcDir('view2/*.html')
	],
	// Files to Copy source path vars
	copy: [

		// Include everything
		gCfg.getSrcDir('**/**/*.*'),

		// Exclude pre-processor DIRs
		'!' + gCfg.getSrcDir('**/**/_coffee'),
		'!' + gCfg.getSrcDir('**/**/_coffee/**/**/'),
		'!' + gCfg.getSrcDir('**/**/_scss'),
		'!' + gCfg.getSrcDir('**/**/_scss/**/**/'),
		'!' + gCfg.getSrcDir('**/**/_less'),
		'!' + gCfg.getSrcDir('**/**/_less/**/**'),
		'!' + gCfg.getSrcDir('**/**/_sass'),
		'!' + gCfg.getSrcDir('**/**/_sass/**/**/'),
		'!' + gCfg.getSrcDir('**/**/_slim'),
		'!' + gCfg.getSrcDir('**/**/_slim/**/**/'),

		// SRC DIRs to exclude
		'!' + gCfg.getSrcDir('view1/**'),
		'!' + gCfg.getSrcDir('view2/**'),

		// Individual files and folders to include / exclude
		'!' + gCfg.getSrcDir('app.js'),
		'!' + gCfg.getSrcDir('index.html'),
		'!' + gCfg.getSrcDir('view1/*.html'),
		'!' + gCfg.getSrcDir('view2/*.html')
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
