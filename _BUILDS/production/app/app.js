"use strict";angular.module("myApp",["ngRoute","myApp.view1","myApp.view2","myApp.version"]).config(["$routeProvider",function(e){e.otherwise({redirectTo:"/view1"})}]);