"use strict";
angular.module('appLibrary', [
	'LocalStorageModule'
])
	.constant('CV_API_PREFIX', 'http://api.geonames.org/')
	.constant('CV_API_CREDS', '?username=red2678&')
	// App Level Factories
	.factory('cvRequest', function ($http, $q, GEO_API_PREFIX, GEO_API_CREDS) {
		return function (path, options) {
			// Function to form QS params
			function formUrl(obj) {
				var str = "";
				for (var key in obj) {
					if (str !== "") {
						str += "&";
					}
					if (obj.hasOwnProperty(key)) {
						str += key + "=" + encodeURIComponent(obj[key]);
					}
				}
				return str;
			}

			// Return Promise
			var defer = $q.defer();
			// HTTP Action
			$http.get(GEO_API_PREFIX + path + GEO_API_CREDS + formUrl(options), {cache: true})
				.success(function (data) {
					defer.resolve(data);
				})
				.fail(function (data) {
					defer.resolve(data);
				});
			// Return Promise
			return defer.promise;
		};
	})
	.factory('collectionService', ['localStorageService', function (localStorageService) {
		return {
			hasCollection: function () {
				return this.getCollection().length > 0;
			},
			getCollection: function () {
				if (!localStorageService.isSupported) {
					console.log('LS NOT SUPPORTED - WTF???');
					return false;
				} else {
					console.log('LS SUPPORTED - GTG!!');
					var collection = localStorageService.get('collection') || [];

					if (collection) {
						// set scope variable for collection


						// get top 10 items ?

						// add to slider

						// done
					}

					return collection;
				}
			}
		};
	}])
	// App Level Directives
	.directive('collectionSlider', ['collectionService', function (collectionService) {
		return {
			restrict: 'E',
			templateUrl: '/components/directives/collectionSlider/collectionSlider.html'
		};
	}])
	.directive('searchForm', ['collectionService', function (collectionService) {
		return {
			restrict: 'E',
			templateUrl: '/components/directives/searchForm/searchForm.html'
		};
	}]);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJhcHAtbGliLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIlwidXNlIHN0cmljdFwiO1xuYW5ndWxhci5tb2R1bGUoJ2FwcExpYnJhcnknLCBbXG5cdCdMb2NhbFN0b3JhZ2VNb2R1bGUnXG5dKVxuXHQuY29uc3RhbnQoJ0NWX0FQSV9QUkVGSVgnLCAnaHR0cDovL2FwaS5nZW9uYW1lcy5vcmcvJylcblx0LmNvbnN0YW50KCdDVl9BUElfQ1JFRFMnLCAnP3VzZXJuYW1lPXJlZDI2NzgmJylcblx0Ly8gQXBwIExldmVsIEZhY3Rvcmllc1xuXHQuZmFjdG9yeSgnY3ZSZXF1ZXN0JywgZnVuY3Rpb24gKCRodHRwLCAkcSwgR0VPX0FQSV9QUkVGSVgsIEdFT19BUElfQ1JFRFMpIHtcblx0XHRyZXR1cm4gZnVuY3Rpb24gKHBhdGgsIG9wdGlvbnMpIHtcblx0XHRcdC8vIEZ1bmN0aW9uIHRvIGZvcm0gUVMgcGFyYW1zXG5cdFx0XHRmdW5jdGlvbiBmb3JtVXJsKG9iaikge1xuXHRcdFx0XHR2YXIgc3RyID0gXCJcIjtcblx0XHRcdFx0Zm9yICh2YXIga2V5IGluIG9iaikge1xuXHRcdFx0XHRcdGlmIChzdHIgIT09IFwiXCIpIHtcblx0XHRcdFx0XHRcdHN0ciArPSBcIiZcIjtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0aWYgKG9iai5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG5cdFx0XHRcdFx0XHRzdHIgKz0ga2V5ICsgXCI9XCIgKyBlbmNvZGVVUklDb21wb25lbnQob2JqW2tleV0pO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0XHRyZXR1cm4gc3RyO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBSZXR1cm4gUHJvbWlzZVxuXHRcdFx0dmFyIGRlZmVyID0gJHEuZGVmZXIoKTtcblx0XHRcdC8vIEhUVFAgQWN0aW9uXG5cdFx0XHQkaHR0cC5nZXQoR0VPX0FQSV9QUkVGSVggKyBwYXRoICsgR0VPX0FQSV9DUkVEUyArIGZvcm1Vcmwob3B0aW9ucyksIHtjYWNoZTogdHJ1ZX0pXG5cdFx0XHRcdC5zdWNjZXNzKGZ1bmN0aW9uIChkYXRhKSB7XG5cdFx0XHRcdFx0ZGVmZXIucmVzb2x2ZShkYXRhKTtcblx0XHRcdFx0fSlcblx0XHRcdFx0LmZhaWwoZnVuY3Rpb24gKGRhdGEpIHtcblx0XHRcdFx0XHRkZWZlci5yZXNvbHZlKGRhdGEpO1xuXHRcdFx0XHR9KTtcblx0XHRcdC8vIFJldHVybiBQcm9taXNlXG5cdFx0XHRyZXR1cm4gZGVmZXIucHJvbWlzZTtcblx0XHR9O1xuXHR9KVxuXHQuZmFjdG9yeSgnY29sbGVjdGlvblNlcnZpY2UnLCBbJ2xvY2FsU3RvcmFnZVNlcnZpY2UnLCBmdW5jdGlvbiAobG9jYWxTdG9yYWdlU2VydmljZSkge1xuXHRcdHJldHVybiB7XG5cdFx0XHRoYXNDb2xsZWN0aW9uOiBmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdHJldHVybiB0aGlzLmdldENvbGxlY3Rpb24oKS5sZW5ndGggPiAwO1xuXHRcdFx0fSxcblx0XHRcdGdldENvbGxlY3Rpb246IGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0aWYgKCFsb2NhbFN0b3JhZ2VTZXJ2aWNlLmlzU3VwcG9ydGVkKSB7XG5cdFx0XHRcdFx0Y29uc29sZS5sb2coJ0xTIE5PVCBTVVBQT1JURUQgLSBXVEY/Pz8nKTtcblx0XHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0Y29uc29sZS5sb2coJ0xTIFNVUFBPUlRFRCAtIEdURyEhJyk7XG5cdFx0XHRcdFx0dmFyIGNvbGxlY3Rpb24gPSBsb2NhbFN0b3JhZ2VTZXJ2aWNlLmdldCgnY29sbGVjdGlvbicpIHx8IFtdO1xuXG5cdFx0XHRcdFx0aWYgKGNvbGxlY3Rpb24pIHtcblx0XHRcdFx0XHRcdC8vIHNldCBzY29wZSB2YXJpYWJsZSBmb3IgY29sbGVjdGlvblxuXG5cblx0XHRcdFx0XHRcdC8vIGdldCB0b3AgMTAgaXRlbXMgP1xuXG5cdFx0XHRcdFx0XHQvLyBhZGQgdG8gc2xpZGVyXG5cblx0XHRcdFx0XHRcdC8vIGRvbmVcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRyZXR1cm4gY29sbGVjdGlvbjtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH07XG5cdH1dKVxuXHQvLyBBcHAgTGV2ZWwgRGlyZWN0aXZlc1xuXHQuZGlyZWN0aXZlKCdjb2xsZWN0aW9uU2xpZGVyJywgWydjb2xsZWN0aW9uU2VydmljZScsIGZ1bmN0aW9uIChjb2xsZWN0aW9uU2VydmljZSkge1xuXHRcdHJldHVybiB7XG5cdFx0XHRyZXN0cmljdDogJ0UnLFxuXHRcdFx0dGVtcGxhdGVVcmw6ICcvY29tcG9uZW50cy9kaXJlY3RpdmVzL2NvbGxlY3Rpb25TbGlkZXIvY29sbGVjdGlvblNsaWRlci5odG1sJ1xuXHRcdH07XG5cdH1dKVxuXHQuZGlyZWN0aXZlKCdzZWFyY2hGb3JtJywgWydjb2xsZWN0aW9uU2VydmljZScsIGZ1bmN0aW9uIChjb2xsZWN0aW9uU2VydmljZSkge1xuXHRcdHJldHVybiB7XG5cdFx0XHRyZXN0cmljdDogJ0UnLFxuXHRcdFx0dGVtcGxhdGVVcmw6ICcvY29tcG9uZW50cy9kaXJlY3RpdmVzL3NlYXJjaEZvcm0vc2VhcmNoRm9ybS5odG1sJ1xuXHRcdH07XG5cdH1dKTtcbiJdLCJmaWxlIjoiYXBwLWxpYi5qcyIsInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9