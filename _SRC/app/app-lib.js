"use strict";
angular.module('appLibrary', [
	'LocalStorageModule'
])
	.constant('CV_API_PREFIX', 'http://www.comicvine.com/api/')
	.constant('CV_API_KEY', '?api_key=53820f5b37c27da61f6280ed4c829146ed191aa4')
	.constant('CV_DEFAULT_LIMIT', '&limit=100')
	.constant('CV_TYPE', '&format=jsonp')
	// App Level Util Dirs
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
	.factory('collectionService', [ 'localStorageService', 'cvRequest', function(localStorageService, cvRequest) {
		return {
			hasCollection : function() {
				return this.getCollection().length > 0;
			},
			getCollection : function(collectionName) {
				if( !localStorageService.isSupported ) {
					console.log('LS NOT SUPPORTED - WTF???');
					return false;
				} else {
					var collection = localStorageService.get(collectionName) || [];

					if( collection ) {
						// set scope variable for collection

						// get top 10 items ?

						// add to slider

						// done
					}

					return collection;
				}
			},
			getComic : function(id) {

				// Get ls collection or empty array
				var tmpCollection = (localStorageService.get('mine') || []) && (localStorageService.get('search') ? localStorageService.get('search').results : []);
				console.log(tmpCollection)
				// Check to see if empty array
				if (tmpCollection.length>0){
					// Not empty, loop through results find one that matches id
					for( var i = 0, len = tmpCollection.length; i < len; i++ ) {
						if( tmpCollection[i].hasOwnProperty('id') ) {
							if( tmpCollection[ i ].id === Number(id) ) {
								return tmpCollection[ i ];
							}
						}
					}
				} else{
					// No ls, Query comic vine

					// Send off request to service with options and wait for promise
					cvRequest('search', {
						query : id,
						limit : 1
					}).then(function(data) {
						return false;
					});
				}
			},
			add : function(item, collection) {
				var collectionType = collection || 'mine',
					tmpCollection = localStorageService.get(collectionType) || [];
				tmpCollection.push(item);
				localStorageService.set(collectionType, tmpCollection);
				return tmpCollection;
			},
			remove : function(item, collection) {

				var collectionType = collection || 'mine',
					tmpCollection = localStorageService.get(collectionType) || [];

				for( var i = 0, len = tmpCollection.length; i < len; i++ ) {
					if( tmpCollection[ i ].hasOwnProperty('id') ) {
						if( tmpCollection[ i ].id === item.id ) {
							tmpCollection.splice(i, 1);
							break;
						}
					}
				}

				localStorageService.set(collectionType, tmpCollection);
				return tmpCollection;
			}
		};
	} ])
	.factory('usrCfgService', [ 'localStorageService', function(localStorageService) {
		return {
			get : function() {
				return localStorageService.get('usrCfg');
			},
			set : function(key, value) {
				if( !localStorageService.isSupported || !value || !key ) {
					return false;
				} else {
					var uc = localStorageService.get('usrCfg');
					uc[ key ] = value;
					return localStorageService.set(key, value);
				}
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
	.directive('comicVineRibbon', [ function() {
		return {
			restrict : 'E',
			transclude : true,
			templateUrl : '/components/directives/comicVineRibbon/comicVineRibbon.html'
		};
	} ])
	.directive('searchForm', [ 'collectionService', 'cvRequest', '$window', '$timeout', 'localStorageService', 'usrCfgService', function(collectionService, cvRequest, $window, $timeout, localStorageService, usrCfgService) {
		return {
			restrict : 'E',
			templateUrl : '/components/directives/searchForm/searchForm.html',
			link : function(scope, element, attrs) {

				// Setup
				scope.search = {
					searching : false,
					results : [],
					type : "any"
				};

				// Check for Darken on Scroll
				if( attrs.darkenOnScroll ) {
					// It's on - Bind to window scroll event
					// Todo : Throttle call
					angular.element($window).bind("scroll", function(e) {

						// check if the darken element has moved
						// TODO : use the event to determine the element to watch
						scope.search.darkenElement = this.pageYOffset !== 0;

						// Focus on the first found '.searchFormInput' if offset is !== 0
						// if offset is === 0 and focus on input, then blur the input
						if(attrs.focusOnInput && this.pageYOffset !== 0){
							angular.element('.searchFormInput').focus();
						} else if (attrs.focusOnInput && this.pageYOffset === 0){
							angular.element('.searchFormInput').blur();
						}

						// Run Apply to digest
						scope.$apply();
					});
				}

				// Darken Element Function
				scope.search.darkenElementFn = function() {

					// Add set to true to add class to darken
					scope.search.darkenElement = true;

					// Set focus on search box after 500ms
					$timeout(function() {
						angular.element('.searchFormInput').focus();
					}, 500);
				};

				// Form submit to search Comic Vine
				scope.search.searchComicVine = function(form) {
					// Check if form is valid
					if( form.$valid ) {

						// Reset search results and searching status
						scope.search.results = [];
						scope.search.searching = true;

						// Set resources to search, if 'any' send STRING of 'issue,character' else
						// send the type selected
						var resources = scope.search.type === 'any' ? 'issue,character' : scope.search.type;

						// Send off request to service with options and wait for promise
						cvRequest('search', {
							query : scope.search.searchString,
							limit : 1,
							resource_type : scope.search.type,
							resources : resources
						}).then(function(data) {
							console.log(data.results[0]);
							// Store response in LS
							localStorageService.set('search', data);
							// Set search results == to data.results
							scope.search.results = data.results || [];
							// Set searching status false
							scope.search.searching = false;
						});

					}

				};

				// Form Reset
				scope.search.resetForm = function(form) {
					scope.search.searching = false;
					scope.search.results = [];
					scope.search.type = "any";
					form.$setPristine();
					form.$setUntouched();
				};

				// Add to item to Collection and update the 'mine' collection scope var
				scope.search.addToCollection = function(item) {
					scope.collection.mine = collectionService.add(item, scope.collection.viewType);
				};

			}
		};
	} ])
	.directive('addForm', [ 'collectionService', 'localStorageService', 'usrCfgService', function(collectionService, localStorageService, usrCfgService) {
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
	.directive('contentGrid', [ function() {
		return {
			restrict : 'E',
			templateUrl : '/components/directives/contentGrid/contentGrid.html'
		};
	} ])
	.directive('contentControls', [ 'collectionService', function(collectionService) {
		return {
			restrict : 'E',
			templateUrl : '/components/directives/contentControls/contentControls.html'
		};
	} ])
	.directive('collectionSlider', [ 'collectionService', function(collectionService) {
		return {
			restrict : 'E',
			templateUrl : '/components/directives/collectionSlider/collectionSlider.html'
		};
	} ])
	.directive('collection', [ 'collectionService', 'localStorageService', function(collectionService, localStorageService) {
		return {
			restrict : 'E',
			templateUrl : '/components/directives/collection/collection.html',
			link : function(scope, element, attrs) {

				// Get LS collection or return empty array
				var lsTemp = localStorageService.get(attrs.viewCollection) || [];

				// Setup scope collection object
				scope.collection = {
					mine : [],
					search : [],
					favorites: [],
					viewMode : attrs.viewMode.toLowerCase() || 'grid',
					viewHeader : attrs.viewHeader || 'Collection',
					viewType : attrs.viewCollection.toLowerCase() || 'mine'
				};


				switch( scope.collection.viewType ) {
					case 'search' :
					{
						if( lsTemp ) {
							// last search was found
							scope.collection.search = lsTemp.results;
						}
						break;
					}

					case 'favorites' :
					case 'mine' :
					{
						if( lsTemp ) {
							// last search was found
							scope.collection[ scope.collection.viewType ] = lsTemp;
						}
						break;
					}

				}

				scope.removeFromCollection = function(item) {
					scope.collection[ scope.collection.viewType ] = collectionService.remove(item, scope.collection.viewType);
				};
			}
		};
	} ]);
