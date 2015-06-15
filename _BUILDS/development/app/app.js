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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJhcHAuanMiXSwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnO1xuLy8gTWFpbiBBcHAgTW9kdWxlXG5hbmd1bGFyLm1vZHVsZSgnY21nckFwcCcsIFtcblx0J2FwcExpYnJhcnknLFxuXHQnbmdSb3V0ZScsXG5cdCdjbWdyQXBwLmhvbWUnLFxuXHQnY21nckFwcC5jb2xsZWN0aW9uJyxcblx0J2NtZ3JBcHAuZmF2b3JpdGVzJyxcblx0J2NtZ3JBcHAuc2VhcmNoJyxcblx0J2NtZ3JBcHAudmVyc2lvbidcbl0pXG5cdC8vIENvbnN0YW50c1xuXHQuY29uc3RhbnQoJ1ZFUlNJT04nLCAxKVxuXHQuY29uc3RhbnQoJ01TR19OT19DT0xMRUNUSU9OJywgJ1NvcnJ5IHlvdSBoYXZlIG5vIGl0ZW1zIGluIHlvdXIgY29sbGVjdGlvbi4nKTtcbiJdLCJmaWxlIjoiYXBwLmpzIiwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=