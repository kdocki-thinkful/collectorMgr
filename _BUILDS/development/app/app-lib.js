angular.module('appLibrary', [])
	.constant('CV_API_PREFIX', 'http://api.geonames.org/')
	.constant('CV_API_CREDS', '?username=red2678&')
	.factory('cvRequest', function (countryCache, $http, $q, GEO_API_PREFIX, GEO_API_CREDS) {
		return function (path, options) {
			function formUrl (obj){
				var str = "";
				for (var key in obj) {
					if (str != "") {
						str += "&";
					}
					str += key + "=" +  encodeURIComponent(obj[key]);
				}
				return str;

			}
			var defer = $q.defer();
			$http.get(GEO_API_PREFIX + path + GEO_API_CREDS + formUrl(options), {cache: true})
				.success(function (data) {
					defer.resolve(data);
				});
			return defer.promise;
		}
	})
	.factory('cache', ['$cacheFactory', function ($cacheFactory) {
		return $cacheFactory('countries');
	}]);
