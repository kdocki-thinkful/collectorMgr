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

		var that = this;

		this.darkenSplash = false;
		this.collection = collectionService.getCollection();

		angular.element($window).bind("scroll", function (e) {
			that.darkenSplash = this.pageYOffset !== 0;
			angular.element('.searchFormInput').blur();
			$scope.$apply();
		});

		this.darkenSlider = function (element) {

			// Add set to true to add class to darken
			that.darkenSplash = true;

			// Set focus on search box
			$timeout(function () {
				angular.element('.searchFormInput').focus();
			}, 500);
		};
	}]);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJob21lL2hvbWUuanMiXSwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnO1xuYW5ndWxhci5tb2R1bGUoJ2NtZ3JBcHAuaG9tZScsIFtcblx0J25nUm91dGUnLFxuXHQnc21vb3RoU2Nyb2xsJyxcblx0J2FwcExpYnJhcnknXG5dKVxuXHQvLyBSb3V0ZSBDb25maWdcblx0LmNvbmZpZyhbJyRyb3V0ZVByb3ZpZGVyJywgZnVuY3Rpb24gKCRyb3V0ZVByb3ZpZGVyKSB7XG5cdFx0JHJvdXRlUHJvdmlkZXIud2hlbignLycsIHtcblx0XHRcdHRlbXBsYXRlVXJsOiAnaG9tZS9ob21lLmh0bWwnLFxuXHRcdFx0Y29udHJvbGxlcjogJ0hvbWVDdHJsJyxcblx0XHRcdGNvbnRyb2xsZXJBczogJ2hvbWVDdHJsJ1xuXHRcdH0pO1xuXHR9XSlcblx0Ly8gQ29udHJvbGxlclxuXHQuY29udHJvbGxlcignSG9tZUN0cmwnLCBbJyRzY29wZScsICdjb2xsZWN0aW9uU2VydmljZScsICckdGltZW91dCcsICckd2luZG93JywgZnVuY3Rpb24gKCRzY29wZSwgY29sbGVjdGlvblNlcnZpY2UsICR0aW1lb3V0LCAkd2luZG93KSB7XG5cblx0XHR2YXIgdGhhdCA9IHRoaXM7XG5cblx0XHR0aGlzLmRhcmtlblNwbGFzaCA9IGZhbHNlO1xuXHRcdHRoaXMuY29sbGVjdGlvbiA9IGNvbGxlY3Rpb25TZXJ2aWNlLmdldENvbGxlY3Rpb24oKTtcblxuXHRcdGFuZ3VsYXIuZWxlbWVudCgkd2luZG93KS5iaW5kKFwic2Nyb2xsXCIsIGZ1bmN0aW9uIChlKSB7XG5cdFx0XHR0aGF0LmRhcmtlblNwbGFzaCA9IHRoaXMucGFnZVlPZmZzZXQgIT09IDA7XG5cdFx0XHRhbmd1bGFyLmVsZW1lbnQoJy5zZWFyY2hGb3JtSW5wdXQnKS5ibHVyKCk7XG5cdFx0XHQkc2NvcGUuJGFwcGx5KCk7XG5cdFx0fSk7XG5cblx0XHR0aGlzLmRhcmtlblNsaWRlciA9IGZ1bmN0aW9uIChlbGVtZW50KSB7XG5cblx0XHRcdC8vIEFkZCBzZXQgdG8gdHJ1ZSB0byBhZGQgY2xhc3MgdG8gZGFya2VuXG5cdFx0XHR0aGF0LmRhcmtlblNwbGFzaCA9IHRydWU7XG5cblx0XHRcdC8vIFNldCBmb2N1cyBvbiBzZWFyY2ggYm94XG5cdFx0XHQkdGltZW91dChmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdGFuZ3VsYXIuZWxlbWVudCgnLnNlYXJjaEZvcm1JbnB1dCcpLmZvY3VzKCk7XG5cdFx0XHR9LCA1MDApO1xuXHRcdH07XG5cdH1dKTtcbiJdLCJmaWxlIjoiaG9tZS9ob21lLmpzIiwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=