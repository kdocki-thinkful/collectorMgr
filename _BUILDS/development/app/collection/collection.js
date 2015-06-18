'use strict';
angular.module('cmgrApp.collection', ['ngRoute'])

	.config(['$routeProvider', function ($routeProvider) {
		$routeProvider.when('/collection', {
			templateUrl: 'collection/collection.html',
			controller: 'CollectionCtrl'
		});
	}])

	.controller('CollectionCtrl', [function () {


	}]);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJjb2xsZWN0aW9uL2NvbGxlY3Rpb24uanMiXSwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnO1xuYW5ndWxhci5tb2R1bGUoJ2NtZ3JBcHAuY29sbGVjdGlvbicsIFsnbmdSb3V0ZSddKVxuXG5cdC5jb25maWcoWyckcm91dGVQcm92aWRlcicsIGZ1bmN0aW9uICgkcm91dGVQcm92aWRlcikge1xuXHRcdCRyb3V0ZVByb3ZpZGVyLndoZW4oJy9jb2xsZWN0aW9uJywge1xuXHRcdFx0dGVtcGxhdGVVcmw6ICdjb2xsZWN0aW9uL2NvbGxlY3Rpb24uaHRtbCcsXG5cdFx0XHRjb250cm9sbGVyOiAnQ29sbGVjdGlvbkN0cmwnXG5cdFx0fSk7XG5cdH1dKVxuXG5cdC5jb250cm9sbGVyKCdDb2xsZWN0aW9uQ3RybCcsIFtmdW5jdGlvbiAoKSB7XG5cblxuXHR9XSk7XG4iXSwiZmlsZSI6ImNvbGxlY3Rpb24vY29sbGVjdGlvbi5qcyIsInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9