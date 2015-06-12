angular.module('appLibrary', [])
	.constant('CV_API_PREFIX', 'http://api.geonames.org/')
	.constant('CV_API_CREDS', '?username=red2678&')
	.factory('cvRequest', function (countryCache, $http, $q, GEO_API_PREFIX, GEO_API_CREDS) {
		"use strict";
		return function (path, options) {
			// Function to form QS params
			function formUrl(obj) {
				var str = "";
				for (var key in obj) {
					if (str !== "") {
						str += "&";
					}
					if(obj.hasOwnProperty(key)){
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
	});
