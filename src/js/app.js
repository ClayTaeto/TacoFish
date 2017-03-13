require("file?name=[name].[ext]!../index.html");
require("../css/layout.less");
const mThree = require("./mThree.js").default
const bSystem = require("./bSystem.js").default

const angular = require("angular")
const angularRoute = require("angular-route");
var app = angular.module('tacoFish', ['ngRoute'])

const inv = require("./inventory")(app)
const fish = require("./fish")(app)

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
            controller: 'recordController'
        })
        .when('/shop', {
            templateUrl: 'template/shop.html',
            controller: 'invController'
        })
        .otherwise({redirectTo: '/'})
        $locationProvider.hashPrefix('');
}]);

app.controller('fishDebug', ['$scope', "$location", "$interval", "fish", "inventory", function ($scope, $location, $interval, fish, inv) {
	var ctrl = this
    ctrl.fish = bSystem.getFish($scope);
    ctrl.showCanvas = false
    ctrl.stats = inv.statsCache
    //TODO: move into battle system
    ctrl.fishHp = function(){
        if(ctrl.fish.hp < 0){
            fish.registerFish(ctrl.fish)
            bSystem.fish()
        }
    	return ctrl.fish.hp
    }
    ctrl.clean = function(){
        fish.clean();
        inv.clean();
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

    //TODO: move into battle system
    $interval(function(){
        ctrl.fish.hp -= inv.statsCache.attack
    }, 461)
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

app.controller('invController', ['$scope', 'inventory', function ($scope, inv) {
    $scope.inv = inv;
    $scope.range = function(n) {
    	if(!n){
    		return []
    	}
        return new Array(n);
    };
}]);

app.controller('recordController', ['$scope', 'fish', function ($scope, fish) {
    $scope.fish = fish;
    $scope.range = function(n) {
        if(!n){
            return []
        }
        return new Array(n);
    };
}]);

mThree.matchHook = bSystem.matchHook;
mThree.init();
bSystem.start();



