var sitababyApp = angular.module('sitababyApp', ['firebase', 'ngRoute']);


// ROUTING CONTROLLER
sitababyApp.config(['$routeProvider',
	function ($routeProvider) {
        $routeProvider
            .when("/home", {
                templateUrl: "partials/home.html",
                controller: "homeCtrl"
            })
            .when("/babysitters", {
                templateUrl: "partials/babysitters.html",
                controller: "babysittersCtrl"
            })
            .when("/contact", {
                templateUrl: "partials/contact.html",
                controller: "contactCtrl"
            })
}]);

//HOME CONTROLLER
sitababyApp.controller('homeCtrl', ['$scope',
	function ($scope) {

	}
]);

//BABYSITTERS CONTROLLER
sitababyApp.controller('babysittersCtrl', ["$scope", "$firebaseArray",
    function ($scope, $firebaseArray) {
        var refUrl = new Firebase("https://glaring-fire-6779.firebaseio.com/babysitters");
        // create a synchronized array
        $scope.babysitters = $firebaseArray(refUrl);

        $scope.sorteren = 'name';
    }
]);

//CONTACT CONTROLLER
sitababyApp.controller('contactCtrl', ['$scope',
	function ($scope) {

	}
]);
/*
//FB LOGIN CONTROLLER
sitababyApp.controller("facebookLogin", function ($scope) {
    $scope.getData = function () {
        var deferred = $scope.defer();
        FB.api('/me', (
            fields: 'last_name'
        ), function (response) {
            if (!response || response.error) {
                deferred.reject('Error occured!');
            } else {
                deferred.resolve(response);
            }
        });
        return deferred.promise;
    }
    $scope.getMyLastName = function () {
        facebookLogin.getData()
            .then(function (response) {
                $scope.last_name = response.last_name;
            });
    };

});*/
//GOOGLE MAPS
var map;

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {
            lat: 51.369468,
            lng: 4.466014
        },
        zoom: 13,
        mapTypeId: google.maps.MapTypeId.ROAD
    });
}
