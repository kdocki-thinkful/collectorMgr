// <editor-fold desc="Variables">
'use strict';
// *********************************************************************************************************************
// Variables
// *********************************************************************************************************************
// noinspection JSUnresolvedVariable
var gulp = require('gulp'),
	gutil = require('gulp-util'),
	gulpif = require('gulp-if'),
	connect = require('gulp-connect'),
	uglify = require('gulp-uglify'),
	minifyhtml = require('gulp-minify-html'),
	clean = require('gulp-clean'),
	sourcemaps = require('gulp-sourcemaps'),
	less = require('gulp-less'),
	gCfg = require('./_GULP/CONFIG');

// </editor-fold>

// <editor-fold desc="Tasks">
// *********************************************************************************************************************
// TASKS
// *********************************************************************************************************************
// Default Task - Build and Watch **************************************************************************************
gulp.task('default', ['envCheck', 'less', 'js', 'html', 'copy', 'connect', 'watch']);

// Build Only Task *****************************************************************************************************
gulp.task('build', ['envCheck', 'less', 'js', 'html', 'copy']);

// Watch Task **********************************************************************************************************
gulp.task('watch', ['build', 'connect'], function () {
	gulp.watch(gCfg.sources.js, ['js']);
	gulp.watch(gCfg.sources.less, ['less']);
	gulp.watch(gCfg.sources.html, ['html']);
});

// Environment Check Task **********************************************************************************************
gulp.task('envCheck', function () {

	return gutil.log(gCfg.fn.cLog('Generating ' + gCfg.fn.capitalize(gCfg.env) + ' Build' +
		'\n********************************************' +
		'\nBuild DIR :: ' + gCfg.getBuildDir() +
		'\nBuild CSS DIR :: ' + gCfg.getBuildDir('css') +
		'\nSRC DIR :: ' + gCfg.getSrcDir() +
		'\nSRC CSS DIR :: ' + gCfg.getSrcDir('css')
	));
});

// JS Task *************************************************************************************************************
gulp.task('js', function () {

	gulp.src(gCfg.sources.js, {
		base: gCfg.getSrcDir()
	})
		.pipe(gulpif(gCfg.env === 'development', sourcemaps.init()))
		.pipe(uglify())
		.pipe(gulpif(gCfg.env === 'development', sourcemaps.write()))
		.pipe(gulp.dest(gCfg.getBuildDir()))
		.pipe(connect.reload());
});

// SASS Task ***********************************************************************************************************
gulp.task('less', function () {

	gulp.src(gCfg.sources.less)
		.pipe(gulpif(gCfg.env === 'development', sourcemaps.init()))
		.pipe(less({compress: true}))
		.pipe(gulpif(gCfg.env === 'development', sourcemaps.write()))
		.pipe(gulp.dest(gCfg.getBuildDir('css')))
		.pipe(gulp.dest(gCfg.getSrcDir('css')))
		.pipe(connect.reload());
});

// ProcessHTML Task ****************************************************************************************************
gulp.task('html', function () {

	return gulp.src(gCfg.sources.html, {
		base: gCfg.getSrcDir()
	})
		.pipe(gulpif(gCfg.env === 'production', minifyhtml()))
		.pipe(gulp.dest(gCfg.getBuildDir()))
		.pipe(connect.reload());
});

// Copy All Task *******************************************************************************************************
gulp.task('copy', ['less', 'html'], function () {

	return gulp.src(gCfg.sources.copy, {
		base: gCfg.getSrcDir()
	})
		.pipe(gulp.dest(gCfg.getBuildDir()))
		.pipe(connect.reload());
});

// Connect Task ********************************************************************************************************
gulp.task('connect', function () {

	return connect.server(gCfg.serverOptions());

	// run some headless tests with phantomjs
	// when process exits:
	// connect.serverClose();
});

// Clean Build Folder **************************************************************************************************
gulp.task('clean', function () {

	return gulp.src(gCfg.getBuildDir())
		.pipe(clean({force: true}));
});

// </editor-fold>
