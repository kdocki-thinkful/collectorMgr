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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJhcHAtbGliLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIlwidXNlIHN0cmljdFwiO1xuYW5ndWxhci5tb2R1bGUoJ2FwcExpYnJhcnknLCBbXG5cdCdMb2NhbFN0b3JhZ2VNb2R1bGUnXG5dKVxuXHQuY29uc3RhbnQoJ0NWX0FQSV9QUkVGSVgnLCAnaHR0cDovL3d3dy5jb21pY3ZpbmUuY29tL2FwaS8nKVxuXHQuY29uc3RhbnQoJ0NWX0FQSV9LRVknLCAnP2FwaV9rZXk9NTM4MjBmNWIzN2MyN2RhNjFmNjI4MGVkNGM4MjkxNDZlZDE5MWFhNCcpXG5cdC5jb25zdGFudCgnQ1ZfREVGQVVMVF9MSU1JVCcsICcmbGltaXQ9MTAwJylcblx0LmNvbnN0YW50KCdDVl9UWVBFJywgJyZmb3JtYXQ9anNvbnAnKVxuXHQvLyBBcHAgTGV2ZWwgVXRpbCBEaXJzXG5cdC8vIEFwcCBMZXZlbCBGYWN0b3JpZXNcblx0LmZhY3RvcnkoJ2N2UmVxdWVzdCcsIFsgJyRodHRwJywgJyRxJywgJ0NWX0FQSV9QUkVGSVgnLCAnQ1ZfQVBJX0tFWScsICdDVl9ERUZBVUxUX0xJTUlUJywgJ0NWX1RZUEUnLCAnbG9jYWxTdG9yYWdlU2VydmljZScsXG5cdFx0ZnVuY3Rpb24oJGh0dHAsICRxLCBDVl9BUElfUFJFRklYLCBDVl9BUElfS0VZLCBDVl9ERUZBVUxUX0xJTUlULCBDVl9UWVBFLCBsb2NhbFN0b3JhZ2VTZXJ2aWNlKSB7XG5cdFx0XHRyZXR1cm4gZnVuY3Rpb24ocGF0aCwgb3B0aW9ucywgY2FjaGUpIHtcblxuXHRcdFx0XHQvLyBSZXR1cm4gUHJvbWlzZVxuXHRcdFx0XHR2YXIgZGVmZXIgPSAkcS5kZWZlcigpLFxuXHRcdFx0XHRcdHVybCA9IENWX0FQSV9QUkVGSVggKyBwYXRoICsgQ1ZfQVBJX0tFWSArIENWX1RZUEU7XG5cblx0XHRcdFx0b3B0aW9ucy5saW1pdCA9IG9wdGlvbnMubGltaXQgfHwgQ1ZfREVGQVVMVF9MSU1JVDtcblx0XHRcdFx0b3B0aW9ucy5qc29uX2NhbGxiYWNrID0gJ0pTT05fQ0FMTEJBQ0snO1xuXG5cdFx0XHRcdC8vIEhUVFAgQWN0aW9uXG5cdFx0XHRcdCRodHRwLmpzb25wKHVybCwge1xuXHRcdFx0XHRcdHBhcmFtcyA6IG9wdGlvbnMsXG5cdFx0XHRcdFx0Y2FjaGUgOiBjYWNoZVxuXHRcdFx0XHR9KVxuXHRcdFx0XHRcdC5zdWNjZXNzKGZ1bmN0aW9uKGRhdGEpIHtcblx0XHRcdFx0XHRcdGRlZmVyLnJlc29sdmUoZGF0YSk7XG5cdFx0XHRcdFx0fSlcblx0XHRcdFx0XHQuZXJyb3IoZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0XHRkZWZlci5yZXNvbHZlKHtcblx0XHRcdFx0XHRcdFx0ZXJyb3IgOiAnQVBJIGNhbGwgZXJyb3InXG5cdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHR9KTtcblxuXHRcdFx0XHQvLyBSZXR1cm4gUHJvbWlzZVxuXHRcdFx0XHRyZXR1cm4gZGVmZXIucHJvbWlzZTtcblx0XHRcdH07XG5cdFx0fSBdKVxuXHQuZmFjdG9yeSgnY29sbGVjdGlvblNlcnZpY2UnLCBbICdsb2NhbFN0b3JhZ2VTZXJ2aWNlJywgJ2N2UmVxdWVzdCcsIGZ1bmN0aW9uKGxvY2FsU3RvcmFnZVNlcnZpY2UsIGN2UmVxdWVzdCkge1xuXHRcdHJldHVybiB7XG5cdFx0XHRoYXNDb2xsZWN0aW9uIDogZnVuY3Rpb24oKSB7XG5cdFx0XHRcdHJldHVybiB0aGlzLmdldENvbGxlY3Rpb24oKS5sZW5ndGggPiAwO1xuXHRcdFx0fSxcblx0XHRcdGdldENvbGxlY3Rpb24gOiBmdW5jdGlvbihjb2xsZWN0aW9uTmFtZSkge1xuXHRcdFx0XHRpZiggIWxvY2FsU3RvcmFnZVNlcnZpY2UuaXNTdXBwb3J0ZWQgKSB7XG5cdFx0XHRcdFx0Y29uc29sZS5sb2coJ0xTIE5PVCBTVVBQT1JURUQgLSBXVEY/Pz8nKTtcblx0XHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0dmFyIGNvbGxlY3Rpb24gPSBsb2NhbFN0b3JhZ2VTZXJ2aWNlLmdldChjb2xsZWN0aW9uTmFtZSkgfHwgW107XG5cblx0XHRcdFx0XHRpZiggY29sbGVjdGlvbiApIHtcblx0XHRcdFx0XHRcdC8vIHNldCBzY29wZSB2YXJpYWJsZSBmb3IgY29sbGVjdGlvblxuXG5cdFx0XHRcdFx0XHQvLyBnZXQgdG9wIDEwIGl0ZW1zID9cblxuXHRcdFx0XHRcdFx0Ly8gYWRkIHRvIHNsaWRlclxuXG5cdFx0XHRcdFx0XHQvLyBkb25lXG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0cmV0dXJuIGNvbGxlY3Rpb247XG5cdFx0XHRcdH1cblx0XHRcdH0sXG5cdFx0XHRnZXRDb21pYyA6IGZ1bmN0aW9uKGlkKSB7XG5cblx0XHRcdFx0Ly8gR2V0IGxzIGNvbGxlY3Rpb24gb3IgZW1wdHkgYXJyYXlcblx0XHRcdFx0dmFyIHRtcENvbGxlY3Rpb24gPSAobG9jYWxTdG9yYWdlU2VydmljZS5nZXQoJ21pbmUnKSB8fCBbXSkgJiYgKGxvY2FsU3RvcmFnZVNlcnZpY2UuZ2V0KCdzZWFyY2gnKSA/IGxvY2FsU3RvcmFnZVNlcnZpY2UuZ2V0KCdzZWFyY2gnKS5yZXN1bHRzIDogW10pO1xuXHRcdFx0XHRjb25zb2xlLmxvZyh0bXBDb2xsZWN0aW9uKVxuXHRcdFx0XHQvLyBDaGVjayB0byBzZWUgaWYgZW1wdHkgYXJyYXlcblx0XHRcdFx0aWYgKHRtcENvbGxlY3Rpb24ubGVuZ3RoPjApe1xuXHRcdFx0XHRcdC8vIE5vdCBlbXB0eSwgbG9vcCB0aHJvdWdoIHJlc3VsdHMgZmluZCBvbmUgdGhhdCBtYXRjaGVzIGlkXG5cdFx0XHRcdFx0Zm9yKCB2YXIgaSA9IDAsIGxlbiA9IHRtcENvbGxlY3Rpb24ubGVuZ3RoOyBpIDwgbGVuOyBpKysgKSB7XG5cdFx0XHRcdFx0XHRpZiggdG1wQ29sbGVjdGlvbltpXS5oYXNPd25Qcm9wZXJ0eSgnaWQnKSApIHtcblx0XHRcdFx0XHRcdFx0aWYoIHRtcENvbGxlY3Rpb25bIGkgXS5pZCA9PT0gTnVtYmVyKGlkKSApIHtcblx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gdG1wQ29sbGVjdGlvblsgaSBdO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9IGVsc2V7XG5cdFx0XHRcdFx0Ly8gTm8gbHMsIFF1ZXJ5IGNvbWljIHZpbmVcblxuXHRcdFx0XHRcdC8vIFNlbmQgb2ZmIHJlcXVlc3QgdG8gc2VydmljZSB3aXRoIG9wdGlvbnMgYW5kIHdhaXQgZm9yIHByb21pc2Vcblx0XHRcdFx0XHRjdlJlcXVlc3QoJ3NlYXJjaCcsIHtcblx0XHRcdFx0XHRcdHF1ZXJ5IDogaWQsXG5cdFx0XHRcdFx0XHRsaW1pdCA6IDFcblx0XHRcdFx0XHR9KS50aGVuKGZ1bmN0aW9uKGRhdGEpIHtcblx0XHRcdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fVxuXHRcdFx0fSxcblx0XHRcdGFkZCA6IGZ1bmN0aW9uKGl0ZW0sIGNvbGxlY3Rpb24pIHtcblx0XHRcdFx0dmFyIGNvbGxlY3Rpb25UeXBlID0gY29sbGVjdGlvbiB8fCAnbWluZScsXG5cdFx0XHRcdFx0dG1wQ29sbGVjdGlvbiA9IGxvY2FsU3RvcmFnZVNlcnZpY2UuZ2V0KGNvbGxlY3Rpb25UeXBlKSB8fCBbXTtcblx0XHRcdFx0dG1wQ29sbGVjdGlvbi5wdXNoKGl0ZW0pO1xuXHRcdFx0XHRsb2NhbFN0b3JhZ2VTZXJ2aWNlLnNldChjb2xsZWN0aW9uVHlwZSwgdG1wQ29sbGVjdGlvbik7XG5cdFx0XHRcdHJldHVybiB0bXBDb2xsZWN0aW9uO1xuXHRcdFx0fSxcblx0XHRcdHJlbW92ZSA6IGZ1bmN0aW9uKGl0ZW0sIGNvbGxlY3Rpb24pIHtcblxuXHRcdFx0XHR2YXIgY29sbGVjdGlvblR5cGUgPSBjb2xsZWN0aW9uIHx8ICdtaW5lJyxcblx0XHRcdFx0XHR0bXBDb2xsZWN0aW9uID0gbG9jYWxTdG9yYWdlU2VydmljZS5nZXQoY29sbGVjdGlvblR5cGUpIHx8IFtdO1xuXG5cdFx0XHRcdGZvciggdmFyIGkgPSAwLCBsZW4gPSB0bXBDb2xsZWN0aW9uLmxlbmd0aDsgaSA8IGxlbjsgaSsrICkge1xuXHRcdFx0XHRcdGlmKCB0bXBDb2xsZWN0aW9uWyBpIF0uaGFzT3duUHJvcGVydHkoJ2lkJykgKSB7XG5cdFx0XHRcdFx0XHRpZiggdG1wQ29sbGVjdGlvblsgaSBdLmlkID09PSBpdGVtLmlkICkge1xuXHRcdFx0XHRcdFx0XHR0bXBDb2xsZWN0aW9uLnNwbGljZShpLCAxKTtcblx0XHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cblx0XHRcdFx0bG9jYWxTdG9yYWdlU2VydmljZS5zZXQoY29sbGVjdGlvblR5cGUsIHRtcENvbGxlY3Rpb24pO1xuXHRcdFx0XHRyZXR1cm4gdG1wQ29sbGVjdGlvbjtcblx0XHRcdH1cblx0XHR9O1xuXHR9IF0pXG5cdC5mYWN0b3J5KCd1c3JDZmdTZXJ2aWNlJywgWyAnbG9jYWxTdG9yYWdlU2VydmljZScsIGZ1bmN0aW9uKGxvY2FsU3RvcmFnZVNlcnZpY2UpIHtcblx0XHRyZXR1cm4ge1xuXHRcdFx0Z2V0IDogZnVuY3Rpb24oKSB7XG5cdFx0XHRcdHJldHVybiBsb2NhbFN0b3JhZ2VTZXJ2aWNlLmdldCgndXNyQ2ZnJyk7XG5cdFx0XHR9LFxuXHRcdFx0c2V0IDogZnVuY3Rpb24oa2V5LCB2YWx1ZSkge1xuXHRcdFx0XHRpZiggIWxvY2FsU3RvcmFnZVNlcnZpY2UuaXNTdXBwb3J0ZWQgfHwgIXZhbHVlIHx8ICFrZXkgKSB7XG5cdFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdHZhciB1YyA9IGxvY2FsU3RvcmFnZVNlcnZpY2UuZ2V0KCd1c3JDZmcnKTtcblx0XHRcdFx0XHR1Y1sga2V5IF0gPSB2YWx1ZTtcblx0XHRcdFx0XHRyZXR1cm4gbG9jYWxTdG9yYWdlU2VydmljZS5zZXQoa2V5LCB2YWx1ZSk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9O1xuXHR9IF0pXG5cdC8vIEFwcCBMZXZlbCBEaXJlY3RpdmVzXG5cdC5kaXJlY3RpdmUoJ3JpYmJvbicsIFsgZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIHtcblx0XHRcdHJlc3RyaWN0IDogJ0UnLFxuXHRcdFx0dHJhbnNjbHVkZSA6IHRydWUsXG5cdFx0XHR0ZW1wbGF0ZVVybCA6ICcvY29tcG9uZW50cy9kaXJlY3RpdmVzL3JpYmJvbi9yaWJib24uaHRtbCdcblx0XHR9O1xuXHR9IF0pXG5cdC5kaXJlY3RpdmUoJ2NvbWljVmluZVJpYmJvbicsIFsgZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIHtcblx0XHRcdHJlc3RyaWN0IDogJ0UnLFxuXHRcdFx0dHJhbnNjbHVkZSA6IHRydWUsXG5cdFx0XHR0ZW1wbGF0ZVVybCA6ICcvY29tcG9uZW50cy9kaXJlY3RpdmVzL2NvbWljVmluZVJpYmJvbi9jb21pY1ZpbmVSaWJib24uaHRtbCdcblx0XHR9O1xuXHR9IF0pXG5cdC5kaXJlY3RpdmUoJ3NlYXJjaEZvcm0nLCBbICdjb2xsZWN0aW9uU2VydmljZScsICdjdlJlcXVlc3QnLCAnJHdpbmRvdycsICckdGltZW91dCcsICdsb2NhbFN0b3JhZ2VTZXJ2aWNlJywgJ3VzckNmZ1NlcnZpY2UnLCBmdW5jdGlvbihjb2xsZWN0aW9uU2VydmljZSwgY3ZSZXF1ZXN0LCAkd2luZG93LCAkdGltZW91dCwgbG9jYWxTdG9yYWdlU2VydmljZSwgdXNyQ2ZnU2VydmljZSkge1xuXHRcdHJldHVybiB7XG5cdFx0XHRyZXN0cmljdCA6ICdFJyxcblx0XHRcdHRlbXBsYXRlVXJsIDogJy9jb21wb25lbnRzL2RpcmVjdGl2ZXMvc2VhcmNoRm9ybS9zZWFyY2hGb3JtLmh0bWwnLFxuXHRcdFx0bGluayA6IGZ1bmN0aW9uKHNjb3BlLCBlbGVtZW50LCBhdHRycykge1xuXG5cdFx0XHRcdC8vIFNldHVwXG5cdFx0XHRcdHNjb3BlLnNlYXJjaCA9IHtcblx0XHRcdFx0XHRzZWFyY2hpbmcgOiBmYWxzZSxcblx0XHRcdFx0XHRyZXN1bHRzIDogW10sXG5cdFx0XHRcdFx0dHlwZSA6IFwiYW55XCJcblx0XHRcdFx0fTtcblxuXHRcdFx0XHQvLyBDaGVjayBmb3IgRGFya2VuIG9uIFNjcm9sbFxuXHRcdFx0XHRpZiggYXR0cnMuZGFya2VuT25TY3JvbGwgKSB7XG5cdFx0XHRcdFx0Ly8gSXQncyBvbiAtIEJpbmQgdG8gd2luZG93IHNjcm9sbCBldmVudFxuXHRcdFx0XHRcdC8vIFRvZG8gOiBUaHJvdHRsZSBjYWxsXG5cdFx0XHRcdFx0YW5ndWxhci5lbGVtZW50KCR3aW5kb3cpLmJpbmQoXCJzY3JvbGxcIiwgZnVuY3Rpb24oZSkge1xuXG5cdFx0XHRcdFx0XHQvLyBjaGVjayBpZiB0aGUgZGFya2VuIGVsZW1lbnQgaGFzIG1vdmVkXG5cdFx0XHRcdFx0XHQvLyBUT0RPIDogdXNlIHRoZSBldmVudCB0byBkZXRlcm1pbmUgdGhlIGVsZW1lbnQgdG8gd2F0Y2hcblx0XHRcdFx0XHRcdHNjb3BlLnNlYXJjaC5kYXJrZW5FbGVtZW50ID0gdGhpcy5wYWdlWU9mZnNldCAhPT0gMDtcblxuXHRcdFx0XHRcdFx0Ly8gRm9jdXMgb24gdGhlIGZpcnN0IGZvdW5kICcuc2VhcmNoRm9ybUlucHV0JyBpZiBvZmZzZXQgaXMgIT09IDBcblx0XHRcdFx0XHRcdC8vIGlmIG9mZnNldCBpcyA9PT0gMCBhbmQgZm9jdXMgb24gaW5wdXQsIHRoZW4gYmx1ciB0aGUgaW5wdXRcblx0XHRcdFx0XHRcdGlmKGF0dHJzLmZvY3VzT25JbnB1dCAmJiB0aGlzLnBhZ2VZT2Zmc2V0ICE9PSAwKXtcblx0XHRcdFx0XHRcdFx0YW5ndWxhci5lbGVtZW50KCcuc2VhcmNoRm9ybUlucHV0JykuZm9jdXMoKTtcblx0XHRcdFx0XHRcdH0gZWxzZSBpZiAoYXR0cnMuZm9jdXNPbklucHV0ICYmIHRoaXMucGFnZVlPZmZzZXQgPT09IDApe1xuXHRcdFx0XHRcdFx0XHRhbmd1bGFyLmVsZW1lbnQoJy5zZWFyY2hGb3JtSW5wdXQnKS5ibHVyKCk7XG5cdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdC8vIFJ1biBBcHBseSB0byBkaWdlc3Rcblx0XHRcdFx0XHRcdHNjb3BlLiRhcHBseSgpO1xuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0Ly8gRGFya2VuIEVsZW1lbnQgRnVuY3Rpb25cblx0XHRcdFx0c2NvcGUuc2VhcmNoLmRhcmtlbkVsZW1lbnRGbiA9IGZ1bmN0aW9uKCkge1xuXG5cdFx0XHRcdFx0Ly8gQWRkIHNldCB0byB0cnVlIHRvIGFkZCBjbGFzcyB0byBkYXJrZW5cblx0XHRcdFx0XHRzY29wZS5zZWFyY2guZGFya2VuRWxlbWVudCA9IHRydWU7XG5cblx0XHRcdFx0XHQvLyBTZXQgZm9jdXMgb24gc2VhcmNoIGJveCBhZnRlciA1MDBtc1xuXHRcdFx0XHRcdCR0aW1lb3V0KGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdFx0YW5ndWxhci5lbGVtZW50KCcuc2VhcmNoRm9ybUlucHV0JykuZm9jdXMoKTtcblx0XHRcdFx0XHR9LCA1MDApO1xuXHRcdFx0XHR9O1xuXG5cdFx0XHRcdC8vIEZvcm0gc3VibWl0IHRvIHNlYXJjaCBDb21pYyBWaW5lXG5cdFx0XHRcdHNjb3BlLnNlYXJjaC5zZWFyY2hDb21pY1ZpbmUgPSBmdW5jdGlvbihmb3JtKSB7XG5cdFx0XHRcdFx0Ly8gQ2hlY2sgaWYgZm9ybSBpcyB2YWxpZFxuXHRcdFx0XHRcdGlmKCBmb3JtLiR2YWxpZCApIHtcblxuXHRcdFx0XHRcdFx0Ly8gUmVzZXQgc2VhcmNoIHJlc3VsdHMgYW5kIHNlYXJjaGluZyBzdGF0dXNcblx0XHRcdFx0XHRcdHNjb3BlLnNlYXJjaC5yZXN1bHRzID0gW107XG5cdFx0XHRcdFx0XHRzY29wZS5zZWFyY2guc2VhcmNoaW5nID0gdHJ1ZTtcblxuXHRcdFx0XHRcdFx0Ly8gU2V0IHJlc291cmNlcyB0byBzZWFyY2gsIGlmICdhbnknIHNlbmQgU1RSSU5HIG9mICdpc3N1ZSxjaGFyYWN0ZXInIGVsc2Vcblx0XHRcdFx0XHRcdC8vIHNlbmQgdGhlIHR5cGUgc2VsZWN0ZWRcblx0XHRcdFx0XHRcdHZhciByZXNvdXJjZXMgPSBzY29wZS5zZWFyY2gudHlwZSA9PT0gJ2FueScgPyAnaXNzdWUsY2hhcmFjdGVyJyA6IHNjb3BlLnNlYXJjaC50eXBlO1xuXG5cdFx0XHRcdFx0XHQvLyBTZW5kIG9mZiByZXF1ZXN0IHRvIHNlcnZpY2Ugd2l0aCBvcHRpb25zIGFuZCB3YWl0IGZvciBwcm9taXNlXG5cdFx0XHRcdFx0XHRjdlJlcXVlc3QoJ3NlYXJjaCcsIHtcblx0XHRcdFx0XHRcdFx0cXVlcnkgOiBzY29wZS5zZWFyY2guc2VhcmNoU3RyaW5nLFxuXHRcdFx0XHRcdFx0XHRsaW1pdCA6IDEsXG5cdFx0XHRcdFx0XHRcdHJlc291cmNlX3R5cGUgOiBzY29wZS5zZWFyY2gudHlwZSxcblx0XHRcdFx0XHRcdFx0cmVzb3VyY2VzIDogcmVzb3VyY2VzXG5cdFx0XHRcdFx0XHR9KS50aGVuKGZ1bmN0aW9uKGRhdGEpIHtcblx0XHRcdFx0XHRcdFx0Y29uc29sZS5sb2coZGF0YS5yZXN1bHRzWzBdKTtcblx0XHRcdFx0XHRcdFx0Ly8gU3RvcmUgcmVzcG9uc2UgaW4gTFNcblx0XHRcdFx0XHRcdFx0bG9jYWxTdG9yYWdlU2VydmljZS5zZXQoJ3NlYXJjaCcsIGRhdGEpO1xuXHRcdFx0XHRcdFx0XHQvLyBTZXQgc2VhcmNoIHJlc3VsdHMgPT0gdG8gZGF0YS5yZXN1bHRzXG5cdFx0XHRcdFx0XHRcdHNjb3BlLnNlYXJjaC5yZXN1bHRzID0gZGF0YS5yZXN1bHRzIHx8IFtdO1xuXHRcdFx0XHRcdFx0XHQvLyBTZXQgc2VhcmNoaW5nIHN0YXR1cyBmYWxzZVxuXHRcdFx0XHRcdFx0XHRzY29wZS5zZWFyY2guc2VhcmNoaW5nID0gZmFsc2U7XG5cdFx0XHRcdFx0XHR9KTtcblxuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHR9O1xuXG5cdFx0XHRcdC8vIEZvcm0gUmVzZXRcblx0XHRcdFx0c2NvcGUuc2VhcmNoLnJlc2V0Rm9ybSA9IGZ1bmN0aW9uKGZvcm0pIHtcblx0XHRcdFx0XHRzY29wZS5zZWFyY2guc2VhcmNoaW5nID0gZmFsc2U7XG5cdFx0XHRcdFx0c2NvcGUuc2VhcmNoLnJlc3VsdHMgPSBbXTtcblx0XHRcdFx0XHRzY29wZS5zZWFyY2gudHlwZSA9IFwiYW55XCI7XG5cdFx0XHRcdFx0Zm9ybS4kc2V0UHJpc3RpbmUoKTtcblx0XHRcdFx0XHRmb3JtLiRzZXRVbnRvdWNoZWQoKTtcblx0XHRcdFx0fTtcblxuXHRcdFx0XHQvLyBBZGQgdG8gaXRlbSB0byBDb2xsZWN0aW9uIGFuZCB1cGRhdGUgdGhlICdtaW5lJyBjb2xsZWN0aW9uIHNjb3BlIHZhclxuXHRcdFx0XHRzY29wZS5zZWFyY2guYWRkVG9Db2xsZWN0aW9uID0gZnVuY3Rpb24oaXRlbSkge1xuXHRcdFx0XHRcdHNjb3BlLmNvbGxlY3Rpb24ubWluZSA9IGNvbGxlY3Rpb25TZXJ2aWNlLmFkZChpdGVtLCBzY29wZS5jb2xsZWN0aW9uLnZpZXdUeXBlKTtcblx0XHRcdFx0fTtcblxuXHRcdFx0fVxuXHRcdH07XG5cdH0gXSlcblx0LmRpcmVjdGl2ZSgnYWRkRm9ybScsIFsgJ2NvbGxlY3Rpb25TZXJ2aWNlJywgJ2xvY2FsU3RvcmFnZVNlcnZpY2UnLCAndXNyQ2ZnU2VydmljZScsIGZ1bmN0aW9uKGNvbGxlY3Rpb25TZXJ2aWNlLCBsb2NhbFN0b3JhZ2VTZXJ2aWNlLCB1c3JDZmdTZXJ2aWNlKSB7XG5cdFx0cmV0dXJuIHtcblx0XHRcdHJlc3RyaWN0IDogJ0UnLFxuXHRcdFx0dGVtcGxhdGVVcmwgOiAnL2NvbXBvbmVudHMvZGlyZWN0aXZlcy9hZGRGb3JtL2FkZEZvcm0uaHRtbCcsXG5cdFx0XHRsaW5rIDogZnVuY3Rpb24oc2NvcGUsIGVsZW1lbnQsIGF0dHJzKSB7XG5cblx0XHRcdFx0c2NvcGUuYWRkSXRlbSA9IHt9O1xuXG5cdFx0XHRcdC8vIFJlc2V0IGFsbCBkYXRhXG5cdFx0XHRcdHNjb3BlLnJlc2V0RGF0YSA9IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdHNjb3BlLmFkZEl0ZW0gPSB7fTtcblx0XHRcdFx0fTtcblxuXHRcdFx0XHQvLyBGb3JtIHN1Ym1pdFxuXHRcdFx0XHRzY29wZS5zdWJtaXQgPSBmdW5jdGlvbihmb3JtKSB7XG5cdFx0XHRcdFx0aWYoIGZvcm0uJHZhbGlkICkge1xuXHRcdFx0XHRcdFx0Y29uc29sZS5sb2coJ1RoZSBmb3JtIGlzIHZhbGlkJyk7XG5cdFx0XHRcdFx0XHRjb25zb2xlLmxvZygnQWRkIHRvIGNvbGxlY3Rpb24gb24gTFMhISEhISEhISEhISEhISEhIScpO1xuXHRcdFx0XHRcdFx0Y29sbGVjdGlvblNlcnZpY2UuYWRkVG9Db2xsZWN0aW9uKHNjb3BlLmFkZEl0ZW0pO1xuXHRcdFx0XHRcdFx0c2NvcGUucmVzZXREYXRhKCk7XG5cdFx0XHRcdFx0XHRmb3JtLiRzZXRQcmlzdGluZSgpO1xuXHRcdFx0XHRcdFx0Zm9ybS4kc2V0VW50b3VjaGVkKCk7XG5cblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0Y29uc29sZS5sb2coJ1RoZSBmb3JtIGlzIGludmFsaWQgLSBGVUJBUiA+OkQnKTtcblx0XHRcdFx0XHRcdHNjb3BlLmFkZEZvcm1JblZhbGlkID0gdHJ1ZTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH07XG5cblx0XHRcdFx0Ly8gRm9ybSByZXNldFxuXHRcdFx0XHRzY29wZS5yZXNldCA9IGZ1bmN0aW9uKGZvcm0pIHtcblx0XHRcdFx0XHRpZiggZm9ybSApIHtcblx0XHRcdFx0XHRcdGZvcm0uJHNldFByaXN0aW5lKCk7XG5cdFx0XHRcdFx0XHRmb3JtLiRzZXRVbnRvdWNoZWQoKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0c2NvcGUucmVzZXREYXRhKCk7XG5cdFx0XHRcdH07XG5cblx0XHRcdFx0Ly8gUnVuIHJlc2V0IG9uY2UgdG8gaW5pdFxuXHRcdFx0XHRzY29wZS5yZXNldERhdGEoKTtcblxuXHRcdFx0fVxuXHRcdH07XG5cdH0gXSlcblx0LmRpcmVjdGl2ZSgnc2lkZUJhcicsIFsgJ2NvbGxlY3Rpb25TZXJ2aWNlJywgZnVuY3Rpb24oY29sbGVjdGlvblNlcnZpY2UpIHtcblx0XHRyZXR1cm4ge1xuXHRcdFx0cmVzdHJpY3QgOiAnQUUnLFxuXHRcdFx0dGVtcGxhdGVVcmwgOiAnL2NvbXBvbmVudHMvZGlyZWN0aXZlcy9zaWRlQmFyL3NpZGVCYXIuaHRtbCdcblx0XHR9O1xuXHR9IF0pXG5cdC5kaXJlY3RpdmUoJ2NvbnRlbnRHcmlkJywgWyBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4ge1xuXHRcdFx0cmVzdHJpY3QgOiAnRScsXG5cdFx0XHR0ZW1wbGF0ZVVybCA6ICcvY29tcG9uZW50cy9kaXJlY3RpdmVzL2NvbnRlbnRHcmlkL2NvbnRlbnRHcmlkLmh0bWwnXG5cdFx0fTtcblx0fSBdKVxuXHQuZGlyZWN0aXZlKCdjb250ZW50Q29udHJvbHMnLCBbICdjb2xsZWN0aW9uU2VydmljZScsIGZ1bmN0aW9uKGNvbGxlY3Rpb25TZXJ2aWNlKSB7XG5cdFx0cmV0dXJuIHtcblx0XHRcdHJlc3RyaWN0IDogJ0UnLFxuXHRcdFx0dGVtcGxhdGVVcmwgOiAnL2NvbXBvbmVudHMvZGlyZWN0aXZlcy9jb250ZW50Q29udHJvbHMvY29udGVudENvbnRyb2xzLmh0bWwnXG5cdFx0fTtcblx0fSBdKVxuXHQuZGlyZWN0aXZlKCdjb2xsZWN0aW9uU2xpZGVyJywgWyAnY29sbGVjdGlvblNlcnZpY2UnLCBmdW5jdGlvbihjb2xsZWN0aW9uU2VydmljZSkge1xuXHRcdHJldHVybiB7XG5cdFx0XHRyZXN0cmljdCA6ICdFJyxcblx0XHRcdHRlbXBsYXRlVXJsIDogJy9jb21wb25lbnRzL2RpcmVjdGl2ZXMvY29sbGVjdGlvblNsaWRlci9jb2xsZWN0aW9uU2xpZGVyLmh0bWwnXG5cdFx0fTtcblx0fSBdKVxuXHQuZGlyZWN0aXZlKCdjb2xsZWN0aW9uJywgWyAnY29sbGVjdGlvblNlcnZpY2UnLCAnbG9jYWxTdG9yYWdlU2VydmljZScsIGZ1bmN0aW9uKGNvbGxlY3Rpb25TZXJ2aWNlLCBsb2NhbFN0b3JhZ2VTZXJ2aWNlKSB7XG5cdFx0cmV0dXJuIHtcblx0XHRcdHJlc3RyaWN0IDogJ0UnLFxuXHRcdFx0dGVtcGxhdGVVcmwgOiAnL2NvbXBvbmVudHMvZGlyZWN0aXZlcy9jb2xsZWN0aW9uL2NvbGxlY3Rpb24uaHRtbCcsXG5cdFx0XHRsaW5rIDogZnVuY3Rpb24oc2NvcGUsIGVsZW1lbnQsIGF0dHJzKSB7XG5cblx0XHRcdFx0Ly8gR2V0IExTIGNvbGxlY3Rpb24gb3IgcmV0dXJuIGVtcHR5IGFycmF5XG5cdFx0XHRcdHZhciBsc1RlbXAgPSBsb2NhbFN0b3JhZ2VTZXJ2aWNlLmdldChhdHRycy52aWV3Q29sbGVjdGlvbikgfHwgW107XG5cblx0XHRcdFx0Ly8gU2V0dXAgc2NvcGUgY29sbGVjdGlvbiBvYmplY3Rcblx0XHRcdFx0c2NvcGUuY29sbGVjdGlvbiA9IHtcblx0XHRcdFx0XHRtaW5lIDogW10sXG5cdFx0XHRcdFx0c2VhcmNoIDogW10sXG5cdFx0XHRcdFx0ZmF2b3JpdGVzOiBbXSxcblx0XHRcdFx0XHR2aWV3TW9kZSA6IGF0dHJzLnZpZXdNb2RlLnRvTG93ZXJDYXNlKCkgfHwgJ2dyaWQnLFxuXHRcdFx0XHRcdHZpZXdIZWFkZXIgOiBhdHRycy52aWV3SGVhZGVyIHx8ICdDb2xsZWN0aW9uJyxcblx0XHRcdFx0XHR2aWV3VHlwZSA6IGF0dHJzLnZpZXdDb2xsZWN0aW9uLnRvTG93ZXJDYXNlKCkgfHwgJ21pbmUnXG5cdFx0XHRcdH07XG5cblxuXHRcdFx0XHRzd2l0Y2goIHNjb3BlLmNvbGxlY3Rpb24udmlld1R5cGUgKSB7XG5cdFx0XHRcdFx0Y2FzZSAnc2VhcmNoJyA6XG5cdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0aWYoIGxzVGVtcCApIHtcblx0XHRcdFx0XHRcdFx0Ly8gbGFzdCBzZWFyY2ggd2FzIGZvdW5kXG5cdFx0XHRcdFx0XHRcdHNjb3BlLmNvbGxlY3Rpb24uc2VhcmNoID0gbHNUZW1wLnJlc3VsdHM7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRjYXNlICdmYXZvcml0ZXMnIDpcblx0XHRcdFx0XHRjYXNlICdtaW5lJyA6XG5cdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0aWYoIGxzVGVtcCApIHtcblx0XHRcdFx0XHRcdFx0Ly8gbGFzdCBzZWFyY2ggd2FzIGZvdW5kXG5cdFx0XHRcdFx0XHRcdHNjb3BlLmNvbGxlY3Rpb25bIHNjb3BlLmNvbGxlY3Rpb24udmlld1R5cGUgXSA9IGxzVGVtcDtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHR9XG5cblx0XHRcdFx0c2NvcGUucmVtb3ZlRnJvbUNvbGxlY3Rpb24gPSBmdW5jdGlvbihpdGVtKSB7XG5cdFx0XHRcdFx0c2NvcGUuY29sbGVjdGlvblsgc2NvcGUuY29sbGVjdGlvbi52aWV3VHlwZSBdID0gY29sbGVjdGlvblNlcnZpY2UucmVtb3ZlKGl0ZW0sIHNjb3BlLmNvbGxlY3Rpb24udmlld1R5cGUpO1xuXHRcdFx0XHR9O1xuXHRcdFx0fVxuXHRcdH07XG5cdH0gXSk7XG4iXSwiZmlsZSI6ImFwcC1saWIuanMiLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==