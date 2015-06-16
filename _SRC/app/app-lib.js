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
