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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJhcHAuanMiXSwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnO1xuLy8gTWFpbiBBcHAgTW9kdWxlXG5hbmd1bGFyLm1vZHVsZSgnY21nckFwcCcsIFtcblx0J2FwcExpYnJhcnknLFxuXHQnbmdSb3V0ZScsXG5cdCdjbWdyQXBwLmhvbWUnLFxuXHQnY21nckFwcC5jb2xsZWN0aW9uJyxcblx0J2NtZ3JBcHAuZmF2b3JpdGVzJyxcblx0J2NtZ3JBcHAuc2VhcmNoJyxcblx0J2NtZ3JBcHAuZGV0YWlsJyxcblx0J2NtZ3JBcHAudmVyc2lvbidcbl0pXG5cdC8vIENvbmZpZ1xuXHQuY29uZmlnKGZ1bmN0aW9uKCRyb3V0ZVByb3ZpZGVyLCAkaHR0cFByb3ZpZGVyKSB7XG5cdFx0JGh0dHBQcm92aWRlci5kZWZhdWx0cy51c2VYRG9tYWluID0gdHJ1ZTtcblx0fSlcblx0Ly8gQ29uc3RhbnRzXG5cdC5jb25zdGFudCgnVkVSU0lPTicsIDEpXG5cdC5jb25zdGFudCgnTVNHX05PX0NPTExFQ1RJT04nLCAnU29ycnkgeW91IGhhdmUgbm8gaXRlbXMgaW4geW91ciBjb2xsZWN0aW9uLicpO1xuIl0sImZpbGUiOiJhcHAuanMiLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==