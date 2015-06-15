'use strict';
angular.module('cmgrApp.home', [
	'ngRoute',
	'smoothScroll',
	'appLibrary'
])

	.config(['$routeProvider', function ($routeProvider) {
		$routeProvider.when('/', {
			templateUrl: 'home/home.html',
			controller: 'HomeCtrl',
			controllerAs: 'homeCtrl'
		});
	}])
	.controller('HomeCtrl', ['$scope', 'collectionService', '$timeout', '$window', function ($scope, collectionService, $timeout, $window) {
		var that = this;

		this.darkenSplash = false;
		this.collection = collectionService.getCollection();

		angular.element($window).bind("scroll", function () {
			console.log(this.pageYOffset);
			that.darkenSplash = this.pageYOffset !== 0;
			$scope.$apply();
		});

		this.darkenSlider = function (element) {

			// Add class so we do nto wait for Angular Digest to apply via ng-class
			angular.element(element).parent().find('.hideSplashOverLay').addClass('darken');
			that.darkenSplash = true;

			// Set focus on search box
			$timeout(function () {
				angular.element('.searchFormInput').focus();
			}, 1000);
		};
	}]);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJob21lL2hvbWUuanMiXSwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnO1xuYW5ndWxhci5tb2R1bGUoJ2NtZ3JBcHAuaG9tZScsIFtcblx0J25nUm91dGUnLFxuXHQnc21vb3RoU2Nyb2xsJyxcblx0J2FwcExpYnJhcnknXG5dKVxuXG5cdC5jb25maWcoWyckcm91dGVQcm92aWRlcicsIGZ1bmN0aW9uICgkcm91dGVQcm92aWRlcikge1xuXHRcdCRyb3V0ZVByb3ZpZGVyLndoZW4oJy8nLCB7XG5cdFx0XHR0ZW1wbGF0ZVVybDogJ2hvbWUvaG9tZS5odG1sJyxcblx0XHRcdGNvbnRyb2xsZXI6ICdIb21lQ3RybCcsXG5cdFx0XHRjb250cm9sbGVyQXM6ICdob21lQ3RybCdcblx0XHR9KTtcblx0fV0pXG5cdC5jb250cm9sbGVyKCdIb21lQ3RybCcsIFsnJHNjb3BlJywgJ2NvbGxlY3Rpb25TZXJ2aWNlJywgJyR0aW1lb3V0JywgJyR3aW5kb3cnLCBmdW5jdGlvbiAoJHNjb3BlLCBjb2xsZWN0aW9uU2VydmljZSwgJHRpbWVvdXQsICR3aW5kb3cpIHtcblx0XHR2YXIgdGhhdCA9IHRoaXM7XG5cblx0XHR0aGlzLmRhcmtlblNwbGFzaCA9IGZhbHNlO1xuXHRcdHRoaXMuY29sbGVjdGlvbiA9IGNvbGxlY3Rpb25TZXJ2aWNlLmdldENvbGxlY3Rpb24oKTtcblxuXHRcdGFuZ3VsYXIuZWxlbWVudCgkd2luZG93KS5iaW5kKFwic2Nyb2xsXCIsIGZ1bmN0aW9uICgpIHtcblx0XHRcdGNvbnNvbGUubG9nKHRoaXMucGFnZVlPZmZzZXQpO1xuXHRcdFx0dGhhdC5kYXJrZW5TcGxhc2ggPSB0aGlzLnBhZ2VZT2Zmc2V0ICE9PSAwO1xuXHRcdFx0JHNjb3BlLiRhcHBseSgpO1xuXHRcdH0pO1xuXG5cdFx0dGhpcy5kYXJrZW5TbGlkZXIgPSBmdW5jdGlvbiAoZWxlbWVudCkge1xuXG5cdFx0XHQvLyBBZGQgY2xhc3Mgc28gd2UgZG8gbnRvIHdhaXQgZm9yIEFuZ3VsYXIgRGlnZXN0IHRvIGFwcGx5IHZpYSBuZy1jbGFzc1xuXHRcdFx0YW5ndWxhci5lbGVtZW50KGVsZW1lbnQpLnBhcmVudCgpLmZpbmQoJy5oaWRlU3BsYXNoT3ZlckxheScpLmFkZENsYXNzKCdkYXJrZW4nKTtcblx0XHRcdHRoYXQuZGFya2VuU3BsYXNoID0gdHJ1ZTtcblxuXHRcdFx0Ly8gU2V0IGZvY3VzIG9uIHNlYXJjaCBib3hcblx0XHRcdCR0aW1lb3V0KGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0YW5ndWxhci5lbGVtZW50KCcuc2VhcmNoRm9ybUlucHV0JykuZm9jdXMoKTtcblx0XHRcdH0sIDEwMDApO1xuXHRcdH07XG5cdH1dKTtcbiJdLCJmaWxlIjoiaG9tZS9ob21lLmpzIiwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=