'use strict';
angular.module('cmgrApp.home', [
	'ngRoute',
	'smoothScroll',
	'appLibrary'
])
	// Route Config
	.config(['$routeProvider', function ($routeProvider) {
		$routeProvider.when('/', {
			templateUrl: 'home/home.html',
			controller: 'HomeCtrl',
			controllerAs: 'homeCtrl'
		});
	}])
	// Controller
	.controller('HomeCtrl', ['$scope', 'collectionService', '$timeout', '$window', function ($scope, collectionService, $timeout, $window) {
		this.collection = collectionService.getCollection();
	}]);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJob21lL2hvbWUuanMiXSwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnO1xuYW5ndWxhci5tb2R1bGUoJ2NtZ3JBcHAuaG9tZScsIFtcblx0J25nUm91dGUnLFxuXHQnc21vb3RoU2Nyb2xsJyxcblx0J2FwcExpYnJhcnknXG5dKVxuXHQvLyBSb3V0ZSBDb25maWdcblx0LmNvbmZpZyhbJyRyb3V0ZVByb3ZpZGVyJywgZnVuY3Rpb24gKCRyb3V0ZVByb3ZpZGVyKSB7XG5cdFx0JHJvdXRlUHJvdmlkZXIud2hlbignLycsIHtcblx0XHRcdHRlbXBsYXRlVXJsOiAnaG9tZS9ob21lLmh0bWwnLFxuXHRcdFx0Y29udHJvbGxlcjogJ0hvbWVDdHJsJyxcblx0XHRcdGNvbnRyb2xsZXJBczogJ2hvbWVDdHJsJ1xuXHRcdH0pO1xuXHR9XSlcblx0Ly8gQ29udHJvbGxlclxuXHQuY29udHJvbGxlcignSG9tZUN0cmwnLCBbJyRzY29wZScsICdjb2xsZWN0aW9uU2VydmljZScsICckdGltZW91dCcsICckd2luZG93JywgZnVuY3Rpb24gKCRzY29wZSwgY29sbGVjdGlvblNlcnZpY2UsICR0aW1lb3V0LCAkd2luZG93KSB7XG5cdFx0dGhpcy5jb2xsZWN0aW9uID0gY29sbGVjdGlvblNlcnZpY2UuZ2V0Q29sbGVjdGlvbigpO1xuXHR9XSk7XG4iXSwiZmlsZSI6ImhvbWUvaG9tZS5qcyIsInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9