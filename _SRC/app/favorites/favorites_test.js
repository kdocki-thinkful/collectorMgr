'use strict';

describe('myApp.favorites module', function() {

  beforeEach(module('myApp.favorites'));

  describe('view2 controller', function(){

    it('should ....', inject(function($controller) {
      //spec body
      var view2Ctrl = $controller('FavoritesCtrl');
      expect(view2Ctrl).toBeDefined();
    }));

  });
});
