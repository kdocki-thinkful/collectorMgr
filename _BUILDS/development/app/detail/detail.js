'use strict';
angular.module('cmgrApp.detail', [])
	// Route Config
	.config(['$routeProvider', function ($routeProvider) {
		$routeProvider.when('/comic/:id', {
			templateUrl: 'detail/detail.html',
			controller: 'DetailCtrl',
			controllerAs: 'detailCtrl'
		});
	}])
	// Controller
	.controller('DetailCtrl', ['$scope', 'collectionService', '$timeout', '$window', '$routeParams', '$sce', function ($scope, collectionService, $timeout, $window, $routeParams, $sce) {

		var that = this;

		// Setup
		this.darkenElement = false;
		this.showBTT = false;


		this.comic = collectionService.getComic($routeParams.id);

		// It's on - Bind to window scroll event
		// Todo : Throttle call
		angular.element($window).bind("scroll", function(e) {

			// check if the darken element has moved
			// TODO : use the event to determine the element to watch
			that.darkenElement = this.pageYOffset !== 0;

			// Focus on the first found '.searchFormInput' if offset is !== 0
			// if offset is === 0 and focus on input, then blur the input
			if(this.pageYOffset !== 0){
				angular.element('.searchFormInput').focus();
				that.showBTT = true;
			} else if (this.pageYOffset === 0){
				angular.element('.searchFormInput').blur();
				that.showBTT = false;
			}

			// Run Apply to digest
			$scope.$apply();
		});

		// Darken Element Function
		this.darkenElementFn = function() {

			// Add set to true to add class to darken
			this.darkenElement = true;
			that.showBTT = true;

			// Set focus on search box after 500ms
			$timeout(function() {
				angular.element('.searchFormInput').focus();
			}, 500);
		};

		this.comicHtml = $sce.trustAsHtml(this.comic.description);
	}]);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJkZXRhaWwvZGV0YWlsLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0JztcbmFuZ3VsYXIubW9kdWxlKCdjbWdyQXBwLmRldGFpbCcsIFtdKVxuXHQvLyBSb3V0ZSBDb25maWdcblx0LmNvbmZpZyhbJyRyb3V0ZVByb3ZpZGVyJywgZnVuY3Rpb24gKCRyb3V0ZVByb3ZpZGVyKSB7XG5cdFx0JHJvdXRlUHJvdmlkZXIud2hlbignL2NvbWljLzppZCcsIHtcblx0XHRcdHRlbXBsYXRlVXJsOiAnZGV0YWlsL2RldGFpbC5odG1sJyxcblx0XHRcdGNvbnRyb2xsZXI6ICdEZXRhaWxDdHJsJyxcblx0XHRcdGNvbnRyb2xsZXJBczogJ2RldGFpbEN0cmwnXG5cdFx0fSk7XG5cdH1dKVxuXHQvLyBDb250cm9sbGVyXG5cdC5jb250cm9sbGVyKCdEZXRhaWxDdHJsJywgWyckc2NvcGUnLCAnY29sbGVjdGlvblNlcnZpY2UnLCAnJHRpbWVvdXQnLCAnJHdpbmRvdycsICckcm91dGVQYXJhbXMnLCAnJHNjZScsIGZ1bmN0aW9uICgkc2NvcGUsIGNvbGxlY3Rpb25TZXJ2aWNlLCAkdGltZW91dCwgJHdpbmRvdywgJHJvdXRlUGFyYW1zLCAkc2NlKSB7XG5cblx0XHR2YXIgdGhhdCA9IHRoaXM7XG5cblx0XHQvLyBTZXR1cFxuXHRcdHRoaXMuZGFya2VuRWxlbWVudCA9IGZhbHNlO1xuXHRcdHRoaXMuc2hvd0JUVCA9IGZhbHNlO1xuXG5cblx0XHR0aGlzLmNvbWljID0gY29sbGVjdGlvblNlcnZpY2UuZ2V0Q29taWMoJHJvdXRlUGFyYW1zLmlkKTtcblxuXHRcdC8vIEl0J3Mgb24gLSBCaW5kIHRvIHdpbmRvdyBzY3JvbGwgZXZlbnRcblx0XHQvLyBUb2RvIDogVGhyb3R0bGUgY2FsbFxuXHRcdGFuZ3VsYXIuZWxlbWVudCgkd2luZG93KS5iaW5kKFwic2Nyb2xsXCIsIGZ1bmN0aW9uKGUpIHtcblxuXHRcdFx0Ly8gY2hlY2sgaWYgdGhlIGRhcmtlbiBlbGVtZW50IGhhcyBtb3ZlZFxuXHRcdFx0Ly8gVE9ETyA6IHVzZSB0aGUgZXZlbnQgdG8gZGV0ZXJtaW5lIHRoZSBlbGVtZW50IHRvIHdhdGNoXG5cdFx0XHR0aGF0LmRhcmtlbkVsZW1lbnQgPSB0aGlzLnBhZ2VZT2Zmc2V0ICE9PSAwO1xuXG5cdFx0XHQvLyBGb2N1cyBvbiB0aGUgZmlyc3QgZm91bmQgJy5zZWFyY2hGb3JtSW5wdXQnIGlmIG9mZnNldCBpcyAhPT0gMFxuXHRcdFx0Ly8gaWYgb2Zmc2V0IGlzID09PSAwIGFuZCBmb2N1cyBvbiBpbnB1dCwgdGhlbiBibHVyIHRoZSBpbnB1dFxuXHRcdFx0aWYodGhpcy5wYWdlWU9mZnNldCAhPT0gMCl7XG5cdFx0XHRcdGFuZ3VsYXIuZWxlbWVudCgnLnNlYXJjaEZvcm1JbnB1dCcpLmZvY3VzKCk7XG5cdFx0XHRcdHRoYXQuc2hvd0JUVCA9IHRydWU7XG5cdFx0XHR9IGVsc2UgaWYgKHRoaXMucGFnZVlPZmZzZXQgPT09IDApe1xuXHRcdFx0XHRhbmd1bGFyLmVsZW1lbnQoJy5zZWFyY2hGb3JtSW5wdXQnKS5ibHVyKCk7XG5cdFx0XHRcdHRoYXQuc2hvd0JUVCA9IGZhbHNlO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBSdW4gQXBwbHkgdG8gZGlnZXN0XG5cdFx0XHQkc2NvcGUuJGFwcGx5KCk7XG5cdFx0fSk7XG5cblx0XHQvLyBEYXJrZW4gRWxlbWVudCBGdW5jdGlvblxuXHRcdHRoaXMuZGFya2VuRWxlbWVudEZuID0gZnVuY3Rpb24oKSB7XG5cblx0XHRcdC8vIEFkZCBzZXQgdG8gdHJ1ZSB0byBhZGQgY2xhc3MgdG8gZGFya2VuXG5cdFx0XHR0aGlzLmRhcmtlbkVsZW1lbnQgPSB0cnVlO1xuXHRcdFx0dGhhdC5zaG93QlRUID0gdHJ1ZTtcblxuXHRcdFx0Ly8gU2V0IGZvY3VzIG9uIHNlYXJjaCBib3ggYWZ0ZXIgNTAwbXNcblx0XHRcdCR0aW1lb3V0KGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRhbmd1bGFyLmVsZW1lbnQoJy5zZWFyY2hGb3JtSW5wdXQnKS5mb2N1cygpO1xuXHRcdFx0fSwgNTAwKTtcblx0XHR9O1xuXG5cdFx0dGhpcy5jb21pY0h0bWwgPSAkc2NlLnRydXN0QXNIdG1sKHRoaXMuY29taWMuZGVzY3JpcHRpb24pO1xuXHR9XSk7XG4iXSwiZmlsZSI6ImRldGFpbC9kZXRhaWwuanMiLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==