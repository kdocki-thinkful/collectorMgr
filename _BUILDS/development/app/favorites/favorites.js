'use strict';

angular.module('cmgrApp.favorites', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/favorites', {
    templateUrl: 'favorites/favorites.html',
    controller: 'FavoritesCtrl'
  });
}])

.controller('FavoritesCtrl', [function() {

}]);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJmYXZvcml0ZXMvZmF2b3JpdGVzLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0JztcblxuYW5ndWxhci5tb2R1bGUoJ2NtZ3JBcHAuZmF2b3JpdGVzJywgWyduZ1JvdXRlJ10pXG5cbi5jb25maWcoWyckcm91dGVQcm92aWRlcicsIGZ1bmN0aW9uKCRyb3V0ZVByb3ZpZGVyKSB7XG4gICRyb3V0ZVByb3ZpZGVyLndoZW4oJy9mYXZvcml0ZXMnLCB7XG4gICAgdGVtcGxhdGVVcmw6ICdmYXZvcml0ZXMvZmF2b3JpdGVzLmh0bWwnLFxuICAgIGNvbnRyb2xsZXI6ICdGYXZvcml0ZXNDdHJsJ1xuICB9KTtcbn1dKVxuXG4uY29udHJvbGxlcignRmF2b3JpdGVzQ3RybCcsIFtmdW5jdGlvbigpIHtcblxufV0pO1xuIl0sImZpbGUiOiJmYXZvcml0ZXMvZmF2b3JpdGVzLmpzIiwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=