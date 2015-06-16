"use strict";
angular.module('appLibrary', [
	'LocalStorageModule'
])
	.constant('CV_API_PREFIX', 'http://www.comicvine.com/api/')
	.constant('CV_API_KEY', '?api_key=53820f5b37c27da61f6280ed4c829146ed191aa4')
	.constant('CV_DEFAULT_LIMIT', '&limit=100')
	.constant('CV_TYPE', '&format=jsonp')
	// App Level Util Dirs
	.directive('hoverClass', function() {
		return {
			restrict : 'A',
			scope : {
				hoverClass : '@'
			},
			link : function(scope, element) {
				element.on('mouseenter', function() {
					element.addClass(scope.hoverClass);
				});
				element.on('mouseleave', function() {
					element.removeClass(scope.hoverClass);
				});
			}
		};
	})
	// App Level Factories
	.factory('cvRequest', [ '$http', '$q', 'CV_API_PREFIX', 'CV_API_KEY', 'CV_DEFAULT_LIMIT', 'CV_TYPE',
		function($http, $q, CV_API_PREFIX, CV_API_KEY, CV_DEFAULT_LIMIT, CV_TYPE) {
			return function(path, options, cache) {

				// Return Promise
				var defer = $q.defer(),
					url = CV_API_PREFIX + path + CV_API_KEY + CV_TYPE;

				options.limit = options.limit || CV_DEFAULT_LIMIT;

				// HTTP Action
				$http.jsonp(url, {
					params : options,
					cache : cache
				})
					.success(function(data) {
						defer.resolve(data);
					})
					.error(function() {
						defer.resolve({
							error : 'API call error'
						});
					});

				// Return Promise
				return defer.promise;
			};
		} ])
	.factory('collectionService', [ 'localStorageService', function(localStorageService) {
		return {
			hasCollection : function() {
				return this.getCollection().length > 0;
			},
			getCollection : function() {
				if( !localStorageService.isSupported ) {
					console.log('LS NOT SUPPORTED - WTF???');
					return false;
				} else {
					console.log('LS SUPPORTED - GTG!!');
					var collection = localStorageService.get('collection') || [];

					if( collection ) {
						// set scope variable for collection

						// get top 10 items ?

						// add to slider

						// done
					}

					return collection;
				}
			},
			addToCollection : function(item) {
				var collection = localStorageService.get('collection') || [];
				collection.push(item);
				localStorageService.set('collection', collection);
			}
		};
	} ])
	// App Level Directives
	.directive('ribbon', [ function() {
		return {
			restrict : 'E',
			transclude : true,
			templateUrl : '/components/directives/ribbon/ribbon.html'
		};
	} ])
	.directive('collectionSlider', [ 'collectionService', function(collectionService) {
		return {
			restrict : 'E',
			templateUrl : '/components/directives/collectionSlider/collectionSlider.html'
		};
	} ])
	.directive('searchForm', [ 'collectionService', 'cvRequest', function(collectionService, cvRequest) {
		return {
			restrict : 'E',
			templateUrl : '/components/directives/searchForm/searchForm.html',
			link : function(scope, element, attrs) {

				// Setup
				scope.searching = false;
				scope.searchResults = [];
				scope.searchType = "any";

				// Form submit
				scope.searchComicVine = function(form) {
					if( form.$valid ) {

						scope.searchResults = [];
						scope.searching = true;

						var resourceType = scope.searchType,
							resources = scope.searchType;

						if( scope.searchType === 'any' ) {
							resources = 'issue,character';
							resourceType = scope.searchType;
						} else {
							resourceType = scope.searchType;
							resources = scope.searchType;
						}

						var results = cvRequest('search', {
							query : scope.searchString,
							json_callback : 'JSON_CALLBACK',
							limit : 1,
							resource_type : resourceType,
							resources : resources
						});

						results.then(function(data) {
							scope.searchResults = data.results;
							scope.searching = false;
						});

					}

				};

				// Form Reset
				scope.resetForm = function(form) {
					scope.searching = false;
					scope.searchResults = [];
					scope.searchType = "Character";
					form.$setPristine();
					form.$setUntouched();
				};

			}
		};
	} ])
	.directive('addForm', [ 'collectionService', function(collectionService) {
		return {
			restrict : 'E',
			templateUrl : '/components/directives/addForm/addForm.html',
			link : function(scope, element, attrs) {

				scope.addItem = {};

				// Reset all data
				scope.resetData = function() {
					scope.addItem = {};
				};

				// Form submit
				scope.submit = function(form) {
					if( form.$valid ) {
						console.log('The form is valid');
						console.log('Add to collection on LS!!!!!!!!!!!!!!!!!');
						collectionService.addToCollection(scope.addItem);
						scope.resetData();
						form.$setPristine();
						form.$setUntouched();

					} else {
						console.log('The form is invalid - FUBAR >:D');
						scope.addFormInValid = true;
					}
				};

				// Form reset
				scope.reset = function(form) {
					if( form ) {
						form.$setPristine();
						form.$setUntouched();
					}
					scope.resetData();
				};

				// Run reset once to init
				scope.resetData();

			}
		};
	} ])
	.directive('sideBar', [ 'collectionService', function(collectionService) {
		return {
			restrict : 'AE',
			templateUrl : '/components/directives/sideBar/sideBar.html'
		};
	} ])
	.directive('contentGrid', [ 'collectionService', function(collectionService) {
		return {
			restrict : 'E',
			templateUrl : '/components/directives/contentGrid/contentGrid.html'
		};
	} ])
	.directive('collection', [ 'collectionService', function(collectionService) {
		return {
			restrict : 'E',
			templateUrl : '/components/directives/collection/collection.html'
		};
	} ]);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJhcHAtbGliLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIlwidXNlIHN0cmljdFwiO1xuYW5ndWxhci5tb2R1bGUoJ2FwcExpYnJhcnknLCBbXG5cdCdMb2NhbFN0b3JhZ2VNb2R1bGUnXG5dKVxuXHQuY29uc3RhbnQoJ0NWX0FQSV9QUkVGSVgnLCAnaHR0cDovL3d3dy5jb21pY3ZpbmUuY29tL2FwaS8nKVxuXHQuY29uc3RhbnQoJ0NWX0FQSV9LRVknLCAnP2FwaV9rZXk9NTM4MjBmNWIzN2MyN2RhNjFmNjI4MGVkNGM4MjkxNDZlZDE5MWFhNCcpXG5cdC5jb25zdGFudCgnQ1ZfREVGQVVMVF9MSU1JVCcsICcmbGltaXQ9MTAwJylcblx0LmNvbnN0YW50KCdDVl9UWVBFJywgJyZmb3JtYXQ9anNvbnAnKVxuXHQvLyBBcHAgTGV2ZWwgVXRpbCBEaXJzXG5cdC5kaXJlY3RpdmUoJ2hvdmVyQ2xhc3MnLCBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4ge1xuXHRcdFx0cmVzdHJpY3QgOiAnQScsXG5cdFx0XHRzY29wZSA6IHtcblx0XHRcdFx0aG92ZXJDbGFzcyA6ICdAJ1xuXHRcdFx0fSxcblx0XHRcdGxpbmsgOiBmdW5jdGlvbihzY29wZSwgZWxlbWVudCkge1xuXHRcdFx0XHRlbGVtZW50Lm9uKCdtb3VzZWVudGVyJywgZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0ZWxlbWVudC5hZGRDbGFzcyhzY29wZS5ob3ZlckNsYXNzKTtcblx0XHRcdFx0fSk7XG5cdFx0XHRcdGVsZW1lbnQub24oJ21vdXNlbGVhdmUnLCBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRlbGVtZW50LnJlbW92ZUNsYXNzKHNjb3BlLmhvdmVyQ2xhc3MpO1xuXHRcdFx0XHR9KTtcblx0XHRcdH1cblx0XHR9O1xuXHR9KVxuXHQvLyBBcHAgTGV2ZWwgRmFjdG9yaWVzXG5cdC5mYWN0b3J5KCdjdlJlcXVlc3QnLCBbICckaHR0cCcsICckcScsICdDVl9BUElfUFJFRklYJywgJ0NWX0FQSV9LRVknLCAnQ1ZfREVGQVVMVF9MSU1JVCcsICdDVl9UWVBFJyxcblx0XHRmdW5jdGlvbigkaHR0cCwgJHEsIENWX0FQSV9QUkVGSVgsIENWX0FQSV9LRVksIENWX0RFRkFVTFRfTElNSVQsIENWX1RZUEUpIHtcblx0XHRcdHJldHVybiBmdW5jdGlvbihwYXRoLCBvcHRpb25zLCBjYWNoZSkge1xuXG5cdFx0XHRcdC8vIFJldHVybiBQcm9taXNlXG5cdFx0XHRcdHZhciBkZWZlciA9ICRxLmRlZmVyKCksXG5cdFx0XHRcdFx0dXJsID0gQ1ZfQVBJX1BSRUZJWCArIHBhdGggKyBDVl9BUElfS0VZICsgQ1ZfVFlQRTtcblxuXHRcdFx0XHRvcHRpb25zLmxpbWl0ID0gb3B0aW9ucy5saW1pdCB8fCBDVl9ERUZBVUxUX0xJTUlUO1xuXG5cdFx0XHRcdC8vIEhUVFAgQWN0aW9uXG5cdFx0XHRcdCRodHRwLmpzb25wKHVybCwge1xuXHRcdFx0XHRcdHBhcmFtcyA6IG9wdGlvbnMsXG5cdFx0XHRcdFx0Y2FjaGUgOiBjYWNoZVxuXHRcdFx0XHR9KVxuXHRcdFx0XHRcdC5zdWNjZXNzKGZ1bmN0aW9uKGRhdGEpIHtcblx0XHRcdFx0XHRcdGRlZmVyLnJlc29sdmUoZGF0YSk7XG5cdFx0XHRcdFx0fSlcblx0XHRcdFx0XHQuZXJyb3IoZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0XHRkZWZlci5yZXNvbHZlKHtcblx0XHRcdFx0XHRcdFx0ZXJyb3IgOiAnQVBJIGNhbGwgZXJyb3InXG5cdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHR9KTtcblxuXHRcdFx0XHQvLyBSZXR1cm4gUHJvbWlzZVxuXHRcdFx0XHRyZXR1cm4gZGVmZXIucHJvbWlzZTtcblx0XHRcdH07XG5cdFx0fSBdKVxuXHQuZmFjdG9yeSgnY29sbGVjdGlvblNlcnZpY2UnLCBbICdsb2NhbFN0b3JhZ2VTZXJ2aWNlJywgZnVuY3Rpb24obG9jYWxTdG9yYWdlU2VydmljZSkge1xuXHRcdHJldHVybiB7XG5cdFx0XHRoYXNDb2xsZWN0aW9uIDogZnVuY3Rpb24oKSB7XG5cdFx0XHRcdHJldHVybiB0aGlzLmdldENvbGxlY3Rpb24oKS5sZW5ndGggPiAwO1xuXHRcdFx0fSxcblx0XHRcdGdldENvbGxlY3Rpb24gOiBmdW5jdGlvbigpIHtcblx0XHRcdFx0aWYoICFsb2NhbFN0b3JhZ2VTZXJ2aWNlLmlzU3VwcG9ydGVkICkge1xuXHRcdFx0XHRcdGNvbnNvbGUubG9nKCdMUyBOT1QgU1VQUE9SVEVEIC0gV1RGPz8/Jyk7XG5cdFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdGNvbnNvbGUubG9nKCdMUyBTVVBQT1JURUQgLSBHVEchIScpO1xuXHRcdFx0XHRcdHZhciBjb2xsZWN0aW9uID0gbG9jYWxTdG9yYWdlU2VydmljZS5nZXQoJ2NvbGxlY3Rpb24nKSB8fCBbXTtcblxuXHRcdFx0XHRcdGlmKCBjb2xsZWN0aW9uICkge1xuXHRcdFx0XHRcdFx0Ly8gc2V0IHNjb3BlIHZhcmlhYmxlIGZvciBjb2xsZWN0aW9uXG5cblx0XHRcdFx0XHRcdC8vIGdldCB0b3AgMTAgaXRlbXMgP1xuXG5cdFx0XHRcdFx0XHQvLyBhZGQgdG8gc2xpZGVyXG5cblx0XHRcdFx0XHRcdC8vIGRvbmVcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRyZXR1cm4gY29sbGVjdGlvbjtcblx0XHRcdFx0fVxuXHRcdFx0fSxcblx0XHRcdGFkZFRvQ29sbGVjdGlvbiA6IGZ1bmN0aW9uKGl0ZW0pIHtcblx0XHRcdFx0dmFyIGNvbGxlY3Rpb24gPSBsb2NhbFN0b3JhZ2VTZXJ2aWNlLmdldCgnY29sbGVjdGlvbicpIHx8IFtdO1xuXHRcdFx0XHRjb2xsZWN0aW9uLnB1c2goaXRlbSk7XG5cdFx0XHRcdGxvY2FsU3RvcmFnZVNlcnZpY2Uuc2V0KCdjb2xsZWN0aW9uJywgY29sbGVjdGlvbik7XG5cdFx0XHR9XG5cdFx0fTtcblx0fSBdKVxuXHQvLyBBcHAgTGV2ZWwgRGlyZWN0aXZlc1xuXHQuZGlyZWN0aXZlKCdyaWJib24nLCBbIGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiB7XG5cdFx0XHRyZXN0cmljdCA6ICdFJyxcblx0XHRcdHRyYW5zY2x1ZGUgOiB0cnVlLFxuXHRcdFx0dGVtcGxhdGVVcmwgOiAnL2NvbXBvbmVudHMvZGlyZWN0aXZlcy9yaWJib24vcmliYm9uLmh0bWwnXG5cdFx0fTtcblx0fSBdKVxuXHQuZGlyZWN0aXZlKCdjb2xsZWN0aW9uU2xpZGVyJywgWyAnY29sbGVjdGlvblNlcnZpY2UnLCBmdW5jdGlvbihjb2xsZWN0aW9uU2VydmljZSkge1xuXHRcdHJldHVybiB7XG5cdFx0XHRyZXN0cmljdCA6ICdFJyxcblx0XHRcdHRlbXBsYXRlVXJsIDogJy9jb21wb25lbnRzL2RpcmVjdGl2ZXMvY29sbGVjdGlvblNsaWRlci9jb2xsZWN0aW9uU2xpZGVyLmh0bWwnXG5cdFx0fTtcblx0fSBdKVxuXHQuZGlyZWN0aXZlKCdzZWFyY2hGb3JtJywgWyAnY29sbGVjdGlvblNlcnZpY2UnLCAnY3ZSZXF1ZXN0JywgZnVuY3Rpb24oY29sbGVjdGlvblNlcnZpY2UsIGN2UmVxdWVzdCkge1xuXHRcdHJldHVybiB7XG5cdFx0XHRyZXN0cmljdCA6ICdFJyxcblx0XHRcdHRlbXBsYXRlVXJsIDogJy9jb21wb25lbnRzL2RpcmVjdGl2ZXMvc2VhcmNoRm9ybS9zZWFyY2hGb3JtLmh0bWwnLFxuXHRcdFx0bGluayA6IGZ1bmN0aW9uKHNjb3BlLCBlbGVtZW50LCBhdHRycykge1xuXG5cdFx0XHRcdC8vIFNldHVwXG5cdFx0XHRcdHNjb3BlLnNlYXJjaGluZyA9IGZhbHNlO1xuXHRcdFx0XHRzY29wZS5zZWFyY2hSZXN1bHRzID0gW107XG5cdFx0XHRcdHNjb3BlLnNlYXJjaFR5cGUgPSBcImFueVwiO1xuXG5cdFx0XHRcdC8vIEZvcm0gc3VibWl0XG5cdFx0XHRcdHNjb3BlLnNlYXJjaENvbWljVmluZSA9IGZ1bmN0aW9uKGZvcm0pIHtcblx0XHRcdFx0XHRpZiggZm9ybS4kdmFsaWQgKSB7XG5cblx0XHRcdFx0XHRcdHNjb3BlLnNlYXJjaFJlc3VsdHMgPSBbXTtcblx0XHRcdFx0XHRcdHNjb3BlLnNlYXJjaGluZyA9IHRydWU7XG5cblx0XHRcdFx0XHRcdHZhciByZXNvdXJjZVR5cGUgPSBzY29wZS5zZWFyY2hUeXBlLFxuXHRcdFx0XHRcdFx0XHRyZXNvdXJjZXMgPSBzY29wZS5zZWFyY2hUeXBlO1xuXG5cdFx0XHRcdFx0XHRpZiggc2NvcGUuc2VhcmNoVHlwZSA9PT0gJ2FueScgKSB7XG5cdFx0XHRcdFx0XHRcdHJlc291cmNlcyA9ICdpc3N1ZSxjaGFyYWN0ZXInO1xuXHRcdFx0XHRcdFx0XHRyZXNvdXJjZVR5cGUgPSBzY29wZS5zZWFyY2hUeXBlO1xuXHRcdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdFx0cmVzb3VyY2VUeXBlID0gc2NvcGUuc2VhcmNoVHlwZTtcblx0XHRcdFx0XHRcdFx0cmVzb3VyY2VzID0gc2NvcGUuc2VhcmNoVHlwZTtcblx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0dmFyIHJlc3VsdHMgPSBjdlJlcXVlc3QoJ3NlYXJjaCcsIHtcblx0XHRcdFx0XHRcdFx0cXVlcnkgOiBzY29wZS5zZWFyY2hTdHJpbmcsXG5cdFx0XHRcdFx0XHRcdGpzb25fY2FsbGJhY2sgOiAnSlNPTl9DQUxMQkFDSycsXG5cdFx0XHRcdFx0XHRcdGxpbWl0IDogMSxcblx0XHRcdFx0XHRcdFx0cmVzb3VyY2VfdHlwZSA6IHJlc291cmNlVHlwZSxcblx0XHRcdFx0XHRcdFx0cmVzb3VyY2VzIDogcmVzb3VyY2VzXG5cdFx0XHRcdFx0XHR9KTtcblxuXHRcdFx0XHRcdFx0cmVzdWx0cy50aGVuKGZ1bmN0aW9uKGRhdGEpIHtcblx0XHRcdFx0XHRcdFx0c2NvcGUuc2VhcmNoUmVzdWx0cyA9IGRhdGEucmVzdWx0cztcblx0XHRcdFx0XHRcdFx0c2NvcGUuc2VhcmNoaW5nID0gZmFsc2U7XG5cdFx0XHRcdFx0XHR9KTtcblxuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHR9O1xuXG5cdFx0XHRcdC8vIEZvcm0gUmVzZXRcblx0XHRcdFx0c2NvcGUucmVzZXRGb3JtID0gZnVuY3Rpb24oZm9ybSkge1xuXHRcdFx0XHRcdHNjb3BlLnNlYXJjaGluZyA9IGZhbHNlO1xuXHRcdFx0XHRcdHNjb3BlLnNlYXJjaFJlc3VsdHMgPSBbXTtcblx0XHRcdFx0XHRzY29wZS5zZWFyY2hUeXBlID0gXCJDaGFyYWN0ZXJcIjtcblx0XHRcdFx0XHRmb3JtLiRzZXRQcmlzdGluZSgpO1xuXHRcdFx0XHRcdGZvcm0uJHNldFVudG91Y2hlZCgpO1xuXHRcdFx0XHR9O1xuXG5cdFx0XHR9XG5cdFx0fTtcblx0fSBdKVxuXHQuZGlyZWN0aXZlKCdhZGRGb3JtJywgWyAnY29sbGVjdGlvblNlcnZpY2UnLCBmdW5jdGlvbihjb2xsZWN0aW9uU2VydmljZSkge1xuXHRcdHJldHVybiB7XG5cdFx0XHRyZXN0cmljdCA6ICdFJyxcblx0XHRcdHRlbXBsYXRlVXJsIDogJy9jb21wb25lbnRzL2RpcmVjdGl2ZXMvYWRkRm9ybS9hZGRGb3JtLmh0bWwnLFxuXHRcdFx0bGluayA6IGZ1bmN0aW9uKHNjb3BlLCBlbGVtZW50LCBhdHRycykge1xuXG5cdFx0XHRcdHNjb3BlLmFkZEl0ZW0gPSB7fTtcblxuXHRcdFx0XHQvLyBSZXNldCBhbGwgZGF0YVxuXHRcdFx0XHRzY29wZS5yZXNldERhdGEgPSBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRzY29wZS5hZGRJdGVtID0ge307XG5cdFx0XHRcdH07XG5cblx0XHRcdFx0Ly8gRm9ybSBzdWJtaXRcblx0XHRcdFx0c2NvcGUuc3VibWl0ID0gZnVuY3Rpb24oZm9ybSkge1xuXHRcdFx0XHRcdGlmKCBmb3JtLiR2YWxpZCApIHtcblx0XHRcdFx0XHRcdGNvbnNvbGUubG9nKCdUaGUgZm9ybSBpcyB2YWxpZCcpO1xuXHRcdFx0XHRcdFx0Y29uc29sZS5sb2coJ0FkZCB0byBjb2xsZWN0aW9uIG9uIExTISEhISEhISEhISEhISEhISEnKTtcblx0XHRcdFx0XHRcdGNvbGxlY3Rpb25TZXJ2aWNlLmFkZFRvQ29sbGVjdGlvbihzY29wZS5hZGRJdGVtKTtcblx0XHRcdFx0XHRcdHNjb3BlLnJlc2V0RGF0YSgpO1xuXHRcdFx0XHRcdFx0Zm9ybS4kc2V0UHJpc3RpbmUoKTtcblx0XHRcdFx0XHRcdGZvcm0uJHNldFVudG91Y2hlZCgpO1xuXG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdGNvbnNvbGUubG9nKCdUaGUgZm9ybSBpcyBpbnZhbGlkIC0gRlVCQVIgPjpEJyk7XG5cdFx0XHRcdFx0XHRzY29wZS5hZGRGb3JtSW5WYWxpZCA9IHRydWU7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9O1xuXG5cdFx0XHRcdC8vIEZvcm0gcmVzZXRcblx0XHRcdFx0c2NvcGUucmVzZXQgPSBmdW5jdGlvbihmb3JtKSB7XG5cdFx0XHRcdFx0aWYoIGZvcm0gKSB7XG5cdFx0XHRcdFx0XHRmb3JtLiRzZXRQcmlzdGluZSgpO1xuXHRcdFx0XHRcdFx0Zm9ybS4kc2V0VW50b3VjaGVkKCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdHNjb3BlLnJlc2V0RGF0YSgpO1xuXHRcdFx0XHR9O1xuXG5cdFx0XHRcdC8vIFJ1biByZXNldCBvbmNlIHRvIGluaXRcblx0XHRcdFx0c2NvcGUucmVzZXREYXRhKCk7XG5cblx0XHRcdH1cblx0XHR9O1xuXHR9IF0pXG5cdC5kaXJlY3RpdmUoJ3NpZGVCYXInLCBbICdjb2xsZWN0aW9uU2VydmljZScsIGZ1bmN0aW9uKGNvbGxlY3Rpb25TZXJ2aWNlKSB7XG5cdFx0cmV0dXJuIHtcblx0XHRcdHJlc3RyaWN0IDogJ0FFJyxcblx0XHRcdHRlbXBsYXRlVXJsIDogJy9jb21wb25lbnRzL2RpcmVjdGl2ZXMvc2lkZUJhci9zaWRlQmFyLmh0bWwnXG5cdFx0fTtcblx0fSBdKVxuXHQuZGlyZWN0aXZlKCdjb250ZW50R3JpZCcsIFsgJ2NvbGxlY3Rpb25TZXJ2aWNlJywgZnVuY3Rpb24oY29sbGVjdGlvblNlcnZpY2UpIHtcblx0XHRyZXR1cm4ge1xuXHRcdFx0cmVzdHJpY3QgOiAnRScsXG5cdFx0XHR0ZW1wbGF0ZVVybCA6ICcvY29tcG9uZW50cy9kaXJlY3RpdmVzL2NvbnRlbnRHcmlkL2NvbnRlbnRHcmlkLmh0bWwnXG5cdFx0fTtcblx0fSBdKVxuXHQuZGlyZWN0aXZlKCdjb2xsZWN0aW9uJywgWyAnY29sbGVjdGlvblNlcnZpY2UnLCBmdW5jdGlvbihjb2xsZWN0aW9uU2VydmljZSkge1xuXHRcdHJldHVybiB7XG5cdFx0XHRyZXN0cmljdCA6ICdFJyxcblx0XHRcdHRlbXBsYXRlVXJsIDogJy9jb21wb25lbnRzL2RpcmVjdGl2ZXMvY29sbGVjdGlvbi9jb2xsZWN0aW9uLmh0bWwnXG5cdFx0fTtcblx0fSBdKTtcbiJdLCJmaWxlIjoiYXBwLWxpYi5qcyIsInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9