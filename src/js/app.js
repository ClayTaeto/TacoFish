require("file?name=[name].[ext]!../index.html");
require("../css/layout.less");
const mThree = require("./mThree.js").default
const bSystem = require("./bSystem.js").default
const angular = require("angular")
const angularRoute = require("angular-route");
var app = angular.module('tacoFish', ['ngRoute'])
app.config(["$routeProvider", "$locationProvider", function($routeProvider, $locationProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'template/match3.html',
        })
        .when('/inventory', {
            templateUrl: 'template/inv.html',
            controller: 'invController'
        })
        .when('/travel', {
            templateUrl: 'template/travel.html',
            controller: 'invController'
        })
        .when('/fish', {
            templateUrl: 'template/fish.html',
            controller: 'invController'
        })
        .when('/shop', {
            templateUrl: 'template/shop.html',
            controller: 'invController'
        })
        .otherwise({redirectTo: '/'})
        $locationProvider.hashPrefix('');
}]);

app.controller('fishDebug', ['$scope', "$location", function ($scope, $location) {
	var ctrl = this
    ctrl.fish = bSystem.getFish($scope);
    ctrl.showCanvas = false
    ctrl.fishHp = function(){
    	console.log(ctrl.fish.hp)
    	return ctrl.fish.hp
    }
    //I don't want to rewrite everything to be able to drop in and drop out the canvas
    $scope.$on('showCanvas', function (event, arg) {
    	console.log(arg)
    	if(arg == "show"){
    		ctrl.showCanvas = true;
	    } else {
	    	ctrl.showCanvas = false;
	    }
  	});
}]);

app.controller('match3Controller', ['$scope', "$location", "$rootScope", function ($scope, $location, $rootScope) {
	var ctrl = this
	console.log("maaaatch Three")
    $rootScope.$broadcast('showCanvas', 'show');
    $scope.$on('$destroy', function() {
        console.log("match3 Getting destroyed")
        $rootScope.$broadcast('showCanvas', 'hide');
    });    
}]);

//TODO: move this out into it's own file

app.controller('invController', ['$scope', function ($scope) {
    
}]);

mThree.matchHook = bSystem.matchHook;
mThree.init();
bSystem.start();



