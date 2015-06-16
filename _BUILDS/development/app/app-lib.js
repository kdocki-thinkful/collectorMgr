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
	.factory('cvRequest', [ '$http', '$q', 'CV_API_PREFIX', 'CV_API_KEY', 'CV_DEFAULT_LIMIT', 'CV_TYPE', 'localStorageService',
		function($http, $q, CV_API_PREFIX, CV_API_KEY, CV_DEFAULT_LIMIT, CV_TYPE, localStorageService) {
			return function(path, options, cache) {

				// Return Promise
				var defer = $q.defer(),
					url = CV_API_PREFIX + path + CV_API_KEY + CV_TYPE;

				options.limit = options.limit || CV_DEFAULT_LIMIT;
				options.json_callback = 'JSON_CALLBACK';

				// HTTP Action
				$http.jsonp(url, {
					params : options,
					cache : cache
				})
					.success(function(data) {
						localStorageService.set('lastSearch', data);
						defer.resolve(data);
					})
					.error(function() {
						var err = {
							error : 'API call error'
						};
						localStorageService.set('lastSearch', err);
						defer.resolve(err);
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
			getCommic : function() {

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
	.directive('searchForm', [ 'collectionService', 'cvRequest', '$window', '$timeout', function(collectionService, cvRequest, $window, $timeout) {
		return {
			restrict : 'E',
			templateUrl : '/components/directives/searchForm/searchForm.html',
			link : function(scope, element, attrs) {

				if( attrs.darkenOnScroll ) {
					angular.element($window).bind("scroll", function(e) {
						scope.darkenElement = this.pageYOffset !== 0;
						angular.element('.searchFormInput').blur();
						scope.$apply();
					});
				}

				scope.darkenSlider = function(element) {

					// Add set to true to add class to darken
					scope.darkenElement = true;

					// Set focus on search box
					$timeout(function() {
						angular.element('.searchFormInput').focus();
					}, 500);
				};

				// Setup
				scope.searching = false;
				scope.searchResults = [];
				scope.searchType = "any";

				// Form submit
				scope.searchComicVine = function(form) {
					if( form.$valid ) {

						scope.searchResults = [];
						scope.searching = true;

						var resources = scope.searchType === 'any' ? 'issue,character' : scope.searchType,
							results = cvRequest('search', {
								query : scope.searchString,
								limit : 1,
								resource_type : scope.searchType,
								resources : resources
							});

						results.then(function(data) {
							console.log(data.results[0]);
							scope.searchResults = data.results;
							scope.searching = false;
						});

					}

				};

				// Form Reset
				scope.resetForm = function(form) {
					scope.searching = false;
					scope.searchResults = [];
					scope.searchType = "any";
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJhcHAtbGliLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIlwidXNlIHN0cmljdFwiO1xuYW5ndWxhci5tb2R1bGUoJ2FwcExpYnJhcnknLCBbXG5cdCdMb2NhbFN0b3JhZ2VNb2R1bGUnXG5dKVxuXHQuY29uc3RhbnQoJ0NWX0FQSV9QUkVGSVgnLCAnaHR0cDovL3d3dy5jb21pY3ZpbmUuY29tL2FwaS8nKVxuXHQuY29uc3RhbnQoJ0NWX0FQSV9LRVknLCAnP2FwaV9rZXk9NTM4MjBmNWIzN2MyN2RhNjFmNjI4MGVkNGM4MjkxNDZlZDE5MWFhNCcpXG5cdC5jb25zdGFudCgnQ1ZfREVGQVVMVF9MSU1JVCcsICcmbGltaXQ9MTAwJylcblx0LmNvbnN0YW50KCdDVl9UWVBFJywgJyZmb3JtYXQ9anNvbnAnKVxuXHQvLyBBcHAgTGV2ZWwgVXRpbCBEaXJzXG5cdC5kaXJlY3RpdmUoJ2hvdmVyQ2xhc3MnLCBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4ge1xuXHRcdFx0cmVzdHJpY3QgOiAnQScsXG5cdFx0XHRzY29wZSA6IHtcblx0XHRcdFx0aG92ZXJDbGFzcyA6ICdAJ1xuXHRcdFx0fSxcblx0XHRcdGxpbmsgOiBmdW5jdGlvbihzY29wZSwgZWxlbWVudCkge1xuXHRcdFx0XHRlbGVtZW50Lm9uKCdtb3VzZWVudGVyJywgZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0ZWxlbWVudC5hZGRDbGFzcyhzY29wZS5ob3ZlckNsYXNzKTtcblx0XHRcdFx0fSk7XG5cdFx0XHRcdGVsZW1lbnQub24oJ21vdXNlbGVhdmUnLCBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRlbGVtZW50LnJlbW92ZUNsYXNzKHNjb3BlLmhvdmVyQ2xhc3MpO1xuXHRcdFx0XHR9KTtcblx0XHRcdH1cblx0XHR9O1xuXHR9KVxuXHQvLyBBcHAgTGV2ZWwgRmFjdG9yaWVzXG5cdC5mYWN0b3J5KCdjdlJlcXVlc3QnLCBbICckaHR0cCcsICckcScsICdDVl9BUElfUFJFRklYJywgJ0NWX0FQSV9LRVknLCAnQ1ZfREVGQVVMVF9MSU1JVCcsICdDVl9UWVBFJywgJ2xvY2FsU3RvcmFnZVNlcnZpY2UnLFxuXHRcdGZ1bmN0aW9uKCRodHRwLCAkcSwgQ1ZfQVBJX1BSRUZJWCwgQ1ZfQVBJX0tFWSwgQ1ZfREVGQVVMVF9MSU1JVCwgQ1ZfVFlQRSwgbG9jYWxTdG9yYWdlU2VydmljZSkge1xuXHRcdFx0cmV0dXJuIGZ1bmN0aW9uKHBhdGgsIG9wdGlvbnMsIGNhY2hlKSB7XG5cblx0XHRcdFx0Ly8gUmV0dXJuIFByb21pc2Vcblx0XHRcdFx0dmFyIGRlZmVyID0gJHEuZGVmZXIoKSxcblx0XHRcdFx0XHR1cmwgPSBDVl9BUElfUFJFRklYICsgcGF0aCArIENWX0FQSV9LRVkgKyBDVl9UWVBFO1xuXG5cdFx0XHRcdG9wdGlvbnMubGltaXQgPSBvcHRpb25zLmxpbWl0IHx8IENWX0RFRkFVTFRfTElNSVQ7XG5cdFx0XHRcdG9wdGlvbnMuanNvbl9jYWxsYmFjayA9ICdKU09OX0NBTExCQUNLJztcblxuXHRcdFx0XHQvLyBIVFRQIEFjdGlvblxuXHRcdFx0XHQkaHR0cC5qc29ucCh1cmwsIHtcblx0XHRcdFx0XHRwYXJhbXMgOiBvcHRpb25zLFxuXHRcdFx0XHRcdGNhY2hlIDogY2FjaGVcblx0XHRcdFx0fSlcblx0XHRcdFx0XHQuc3VjY2VzcyhmdW5jdGlvbihkYXRhKSB7XG5cdFx0XHRcdFx0XHRsb2NhbFN0b3JhZ2VTZXJ2aWNlLnNldCgnbGFzdFNlYXJjaCcsIGRhdGEpO1xuXHRcdFx0XHRcdFx0ZGVmZXIucmVzb2x2ZShkYXRhKTtcblx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdC5lcnJvcihmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRcdHZhciBlcnIgPSB7XG5cdFx0XHRcdFx0XHRcdGVycm9yIDogJ0FQSSBjYWxsIGVycm9yJ1xuXHRcdFx0XHRcdFx0fTtcblx0XHRcdFx0XHRcdGxvY2FsU3RvcmFnZVNlcnZpY2Uuc2V0KCdsYXN0U2VhcmNoJywgZXJyKTtcblx0XHRcdFx0XHRcdGRlZmVyLnJlc29sdmUoZXJyKTtcblx0XHRcdFx0XHR9KTtcblxuXHRcdFx0XHQvLyBSZXR1cm4gUHJvbWlzZVxuXHRcdFx0XHRyZXR1cm4gZGVmZXIucHJvbWlzZTtcblx0XHRcdH07XG5cdFx0fSBdKVxuXHQuZmFjdG9yeSgnY29sbGVjdGlvblNlcnZpY2UnLCBbICdsb2NhbFN0b3JhZ2VTZXJ2aWNlJywgZnVuY3Rpb24obG9jYWxTdG9yYWdlU2VydmljZSkge1xuXHRcdHJldHVybiB7XG5cdFx0XHRoYXNDb2xsZWN0aW9uIDogZnVuY3Rpb24oKSB7XG5cdFx0XHRcdHJldHVybiB0aGlzLmdldENvbGxlY3Rpb24oKS5sZW5ndGggPiAwO1xuXHRcdFx0fSxcblx0XHRcdGdldENvbGxlY3Rpb24gOiBmdW5jdGlvbigpIHtcblx0XHRcdFx0aWYoICFsb2NhbFN0b3JhZ2VTZXJ2aWNlLmlzU3VwcG9ydGVkICkge1xuXHRcdFx0XHRcdGNvbnNvbGUubG9nKCdMUyBOT1QgU1VQUE9SVEVEIC0gV1RGPz8/Jyk7XG5cdFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdGNvbnNvbGUubG9nKCdMUyBTVVBQT1JURUQgLSBHVEchIScpO1xuXHRcdFx0XHRcdHZhciBjb2xsZWN0aW9uID0gbG9jYWxTdG9yYWdlU2VydmljZS5nZXQoJ2NvbGxlY3Rpb24nKSB8fCBbXTtcblxuXHRcdFx0XHRcdGlmKCBjb2xsZWN0aW9uICkge1xuXHRcdFx0XHRcdFx0Ly8gc2V0IHNjb3BlIHZhcmlhYmxlIGZvciBjb2xsZWN0aW9uXG5cblx0XHRcdFx0XHRcdC8vIGdldCB0b3AgMTAgaXRlbXMgP1xuXG5cdFx0XHRcdFx0XHQvLyBhZGQgdG8gc2xpZGVyXG5cblx0XHRcdFx0XHRcdC8vIGRvbmVcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRyZXR1cm4gY29sbGVjdGlvbjtcblx0XHRcdFx0fVxuXHRcdFx0fSxcblx0XHRcdGdldENvbW1pYyA6IGZ1bmN0aW9uKCkge1xuXG5cdFx0XHR9LFxuXHRcdFx0YWRkVG9Db2xsZWN0aW9uIDogZnVuY3Rpb24oaXRlbSkge1xuXHRcdFx0XHR2YXIgY29sbGVjdGlvbiA9IGxvY2FsU3RvcmFnZVNlcnZpY2UuZ2V0KCdjb2xsZWN0aW9uJykgfHwgW107XG5cdFx0XHRcdGNvbGxlY3Rpb24ucHVzaChpdGVtKTtcblx0XHRcdFx0bG9jYWxTdG9yYWdlU2VydmljZS5zZXQoJ2NvbGxlY3Rpb24nLCBjb2xsZWN0aW9uKTtcblx0XHRcdH1cblx0XHR9O1xuXHR9IF0pXG5cdC8vIEFwcCBMZXZlbCBEaXJlY3RpdmVzXG5cdC5kaXJlY3RpdmUoJ3JpYmJvbicsIFsgZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIHtcblx0XHRcdHJlc3RyaWN0IDogJ0UnLFxuXHRcdFx0dHJhbnNjbHVkZSA6IHRydWUsXG5cdFx0XHR0ZW1wbGF0ZVVybCA6ICcvY29tcG9uZW50cy9kaXJlY3RpdmVzL3JpYmJvbi9yaWJib24uaHRtbCdcblx0XHR9O1xuXHR9IF0pXG5cdC5kaXJlY3RpdmUoJ2NvbGxlY3Rpb25TbGlkZXInLCBbICdjb2xsZWN0aW9uU2VydmljZScsIGZ1bmN0aW9uKGNvbGxlY3Rpb25TZXJ2aWNlKSB7XG5cdFx0cmV0dXJuIHtcblx0XHRcdHJlc3RyaWN0IDogJ0UnLFxuXHRcdFx0dGVtcGxhdGVVcmwgOiAnL2NvbXBvbmVudHMvZGlyZWN0aXZlcy9jb2xsZWN0aW9uU2xpZGVyL2NvbGxlY3Rpb25TbGlkZXIuaHRtbCdcblx0XHR9O1xuXHR9IF0pXG5cdC5kaXJlY3RpdmUoJ3NlYXJjaEZvcm0nLCBbICdjb2xsZWN0aW9uU2VydmljZScsICdjdlJlcXVlc3QnLCAnJHdpbmRvdycsICckdGltZW91dCcsIGZ1bmN0aW9uKGNvbGxlY3Rpb25TZXJ2aWNlLCBjdlJlcXVlc3QsICR3aW5kb3csICR0aW1lb3V0KSB7XG5cdFx0cmV0dXJuIHtcblx0XHRcdHJlc3RyaWN0IDogJ0UnLFxuXHRcdFx0dGVtcGxhdGVVcmwgOiAnL2NvbXBvbmVudHMvZGlyZWN0aXZlcy9zZWFyY2hGb3JtL3NlYXJjaEZvcm0uaHRtbCcsXG5cdFx0XHRsaW5rIDogZnVuY3Rpb24oc2NvcGUsIGVsZW1lbnQsIGF0dHJzKSB7XG5cblx0XHRcdFx0aWYoIGF0dHJzLmRhcmtlbk9uU2Nyb2xsICkge1xuXHRcdFx0XHRcdGFuZ3VsYXIuZWxlbWVudCgkd2luZG93KS5iaW5kKFwic2Nyb2xsXCIsIGZ1bmN0aW9uKGUpIHtcblx0XHRcdFx0XHRcdHNjb3BlLmRhcmtlbkVsZW1lbnQgPSB0aGlzLnBhZ2VZT2Zmc2V0ICE9PSAwO1xuXHRcdFx0XHRcdFx0YW5ndWxhci5lbGVtZW50KCcuc2VhcmNoRm9ybUlucHV0JykuYmx1cigpO1xuXHRcdFx0XHRcdFx0c2NvcGUuJGFwcGx5KCk7XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRzY29wZS5kYXJrZW5TbGlkZXIgPSBmdW5jdGlvbihlbGVtZW50KSB7XG5cblx0XHRcdFx0XHQvLyBBZGQgc2V0IHRvIHRydWUgdG8gYWRkIGNsYXNzIHRvIGRhcmtlblxuXHRcdFx0XHRcdHNjb3BlLmRhcmtlbkVsZW1lbnQgPSB0cnVlO1xuXG5cdFx0XHRcdFx0Ly8gU2V0IGZvY3VzIG9uIHNlYXJjaCBib3hcblx0XHRcdFx0XHQkdGltZW91dChmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRcdGFuZ3VsYXIuZWxlbWVudCgnLnNlYXJjaEZvcm1JbnB1dCcpLmZvY3VzKCk7XG5cdFx0XHRcdFx0fSwgNTAwKTtcblx0XHRcdFx0fTtcblxuXHRcdFx0XHQvLyBTZXR1cFxuXHRcdFx0XHRzY29wZS5zZWFyY2hpbmcgPSBmYWxzZTtcblx0XHRcdFx0c2NvcGUuc2VhcmNoUmVzdWx0cyA9IFtdO1xuXHRcdFx0XHRzY29wZS5zZWFyY2hUeXBlID0gXCJhbnlcIjtcblxuXHRcdFx0XHQvLyBGb3JtIHN1Ym1pdFxuXHRcdFx0XHRzY29wZS5zZWFyY2hDb21pY1ZpbmUgPSBmdW5jdGlvbihmb3JtKSB7XG5cdFx0XHRcdFx0aWYoIGZvcm0uJHZhbGlkICkge1xuXG5cdFx0XHRcdFx0XHRzY29wZS5zZWFyY2hSZXN1bHRzID0gW107XG5cdFx0XHRcdFx0XHRzY29wZS5zZWFyY2hpbmcgPSB0cnVlO1xuXG5cdFx0XHRcdFx0XHR2YXIgcmVzb3VyY2VzID0gc2NvcGUuc2VhcmNoVHlwZSA9PT0gJ2FueScgPyAnaXNzdWUsY2hhcmFjdGVyJyA6IHNjb3BlLnNlYXJjaFR5cGUsXG5cdFx0XHRcdFx0XHRcdHJlc3VsdHMgPSBjdlJlcXVlc3QoJ3NlYXJjaCcsIHtcblx0XHRcdFx0XHRcdFx0XHRxdWVyeSA6IHNjb3BlLnNlYXJjaFN0cmluZyxcblx0XHRcdFx0XHRcdFx0XHRsaW1pdCA6IDEsXG5cdFx0XHRcdFx0XHRcdFx0cmVzb3VyY2VfdHlwZSA6IHNjb3BlLnNlYXJjaFR5cGUsXG5cdFx0XHRcdFx0XHRcdFx0cmVzb3VyY2VzIDogcmVzb3VyY2VzXG5cdFx0XHRcdFx0XHRcdH0pO1xuXG5cdFx0XHRcdFx0XHRyZXN1bHRzLnRoZW4oZnVuY3Rpb24oZGF0YSkge1xuXHRcdFx0XHRcdFx0XHRjb25zb2xlLmxvZyhkYXRhLnJlc3VsdHNbMF0pO1xuXHRcdFx0XHRcdFx0XHRzY29wZS5zZWFyY2hSZXN1bHRzID0gZGF0YS5yZXN1bHRzO1xuXHRcdFx0XHRcdFx0XHRzY29wZS5zZWFyY2hpbmcgPSBmYWxzZTtcblx0XHRcdFx0XHRcdH0pO1xuXG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdH07XG5cblx0XHRcdFx0Ly8gRm9ybSBSZXNldFxuXHRcdFx0XHRzY29wZS5yZXNldEZvcm0gPSBmdW5jdGlvbihmb3JtKSB7XG5cdFx0XHRcdFx0c2NvcGUuc2VhcmNoaW5nID0gZmFsc2U7XG5cdFx0XHRcdFx0c2NvcGUuc2VhcmNoUmVzdWx0cyA9IFtdO1xuXHRcdFx0XHRcdHNjb3BlLnNlYXJjaFR5cGUgPSBcImFueVwiO1xuXHRcdFx0XHRcdGZvcm0uJHNldFByaXN0aW5lKCk7XG5cdFx0XHRcdFx0Zm9ybS4kc2V0VW50b3VjaGVkKCk7XG5cdFx0XHRcdH07XG5cblx0XHRcdH1cblx0XHR9O1xuXHR9IF0pXG5cdC5kaXJlY3RpdmUoJ2FkZEZvcm0nLCBbICdjb2xsZWN0aW9uU2VydmljZScsIGZ1bmN0aW9uKGNvbGxlY3Rpb25TZXJ2aWNlKSB7XG5cdFx0cmV0dXJuIHtcblx0XHRcdHJlc3RyaWN0IDogJ0UnLFxuXHRcdFx0dGVtcGxhdGVVcmwgOiAnL2NvbXBvbmVudHMvZGlyZWN0aXZlcy9hZGRGb3JtL2FkZEZvcm0uaHRtbCcsXG5cdFx0XHRsaW5rIDogZnVuY3Rpb24oc2NvcGUsIGVsZW1lbnQsIGF0dHJzKSB7XG5cblx0XHRcdFx0c2NvcGUuYWRkSXRlbSA9IHt9O1xuXG5cdFx0XHRcdC8vIFJlc2V0IGFsbCBkYXRhXG5cdFx0XHRcdHNjb3BlLnJlc2V0RGF0YSA9IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdHNjb3BlLmFkZEl0ZW0gPSB7fTtcblx0XHRcdFx0fTtcblxuXHRcdFx0XHQvLyBGb3JtIHN1Ym1pdFxuXHRcdFx0XHRzY29wZS5zdWJtaXQgPSBmdW5jdGlvbihmb3JtKSB7XG5cdFx0XHRcdFx0aWYoIGZvcm0uJHZhbGlkICkge1xuXHRcdFx0XHRcdFx0Y29uc29sZS5sb2coJ1RoZSBmb3JtIGlzIHZhbGlkJyk7XG5cdFx0XHRcdFx0XHRjb25zb2xlLmxvZygnQWRkIHRvIGNvbGxlY3Rpb24gb24gTFMhISEhISEhISEhISEhISEhIScpO1xuXHRcdFx0XHRcdFx0Y29sbGVjdGlvblNlcnZpY2UuYWRkVG9Db2xsZWN0aW9uKHNjb3BlLmFkZEl0ZW0pO1xuXHRcdFx0XHRcdFx0c2NvcGUucmVzZXREYXRhKCk7XG5cdFx0XHRcdFx0XHRmb3JtLiRzZXRQcmlzdGluZSgpO1xuXHRcdFx0XHRcdFx0Zm9ybS4kc2V0VW50b3VjaGVkKCk7XG5cblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0Y29uc29sZS5sb2coJ1RoZSBmb3JtIGlzIGludmFsaWQgLSBGVUJBUiA+OkQnKTtcblx0XHRcdFx0XHRcdHNjb3BlLmFkZEZvcm1JblZhbGlkID0gdHJ1ZTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH07XG5cblx0XHRcdFx0Ly8gRm9ybSByZXNldFxuXHRcdFx0XHRzY29wZS5yZXNldCA9IGZ1bmN0aW9uKGZvcm0pIHtcblx0XHRcdFx0XHRpZiggZm9ybSApIHtcblx0XHRcdFx0XHRcdGZvcm0uJHNldFByaXN0aW5lKCk7XG5cdFx0XHRcdFx0XHRmb3JtLiRzZXRVbnRvdWNoZWQoKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0c2NvcGUucmVzZXREYXRhKCk7XG5cdFx0XHRcdH07XG5cblx0XHRcdFx0Ly8gUnVuIHJlc2V0IG9uY2UgdG8gaW5pdFxuXHRcdFx0XHRzY29wZS5yZXNldERhdGEoKTtcblxuXHRcdFx0fVxuXHRcdH07XG5cdH0gXSlcblx0LmRpcmVjdGl2ZSgnc2lkZUJhcicsIFsgJ2NvbGxlY3Rpb25TZXJ2aWNlJywgZnVuY3Rpb24oY29sbGVjdGlvblNlcnZpY2UpIHtcblx0XHRyZXR1cm4ge1xuXHRcdFx0cmVzdHJpY3QgOiAnQUUnLFxuXHRcdFx0dGVtcGxhdGVVcmwgOiAnL2NvbXBvbmVudHMvZGlyZWN0aXZlcy9zaWRlQmFyL3NpZGVCYXIuaHRtbCdcblx0XHR9O1xuXHR9IF0pXG5cdC5kaXJlY3RpdmUoJ2NvbnRlbnRHcmlkJywgWyAnY29sbGVjdGlvblNlcnZpY2UnLCBmdW5jdGlvbihjb2xsZWN0aW9uU2VydmljZSkge1xuXHRcdHJldHVybiB7XG5cdFx0XHRyZXN0cmljdCA6ICdFJyxcblx0XHRcdHRlbXBsYXRlVXJsIDogJy9jb21wb25lbnRzL2RpcmVjdGl2ZXMvY29udGVudEdyaWQvY29udGVudEdyaWQuaHRtbCdcblx0XHR9O1xuXHR9IF0pXG5cdC5kaXJlY3RpdmUoJ2NvbGxlY3Rpb24nLCBbICdjb2xsZWN0aW9uU2VydmljZScsIGZ1bmN0aW9uKGNvbGxlY3Rpb25TZXJ2aWNlKSB7XG5cdFx0cmV0dXJuIHtcblx0XHRcdHJlc3RyaWN0IDogJ0UnLFxuXHRcdFx0dGVtcGxhdGVVcmwgOiAnL2NvbXBvbmVudHMvZGlyZWN0aXZlcy9jb2xsZWN0aW9uL2NvbGxlY3Rpb24uaHRtbCdcblx0XHR9O1xuXHR9IF0pO1xuIl0sImZpbGUiOiJhcHAtbGliLmpzIiwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=