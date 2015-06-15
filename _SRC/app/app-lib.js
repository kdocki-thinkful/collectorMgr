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
