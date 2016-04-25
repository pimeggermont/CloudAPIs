var sitababyApp = angular.module('sitababyApp', ['firebase', 'ngRoute']);


// ROUTING CONTROLLER
sitababyApp.config(['$routeProvider', '$locationProvider',
	function ($routeProvider, $locationProvider) {
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
            .otherwise({
                redirectTo: "/home"
            });
}]);

/**
*sitababyApp.service('userService', function() {
*     return {
*       setUser: function() {
*            user = 
*        }
*    }
*})
**/

//Index CONTROLLER
sitababyApp.controller('indexCtrl', ['$scope', '$location',
    function ($scope, $location){
        
        // facebook login sdk
        function statusChangeCallback(response) {
            console.log('statusChangeCallback');
            console.log(response);
            if (response.status === 'connected') {
            // Logged into your app and Facebook.
            testAPI();
            // userService.setUser(response);
            } else if (response.status === 'not_authorized') {
            // The person is logged into Facebook, but not your app.
            document.getElementById('status').innerHTML = 'Please log ' +
            'into this app.';
            } else {
            // The person is not logged into Facebook, so we're not sure if
            // they are logged into this app or not.
            document.getElementById('status').innerHTML = 'Please log ' +
            'into Facebook.';
            }
        }

        // This function is called when someone finishes with the Login
        // Button.  See the onlogin handler attached to it in the sample
        // code below.
        function checkLoginState() {
            FB.getLoginStatus(function(response) {
            statusChangeCallback(response);
            });
        }

        window.fbAsyncInit = function() {
            FB.init({
                appId      : '986227158099684',
                cookie     : true, // enables cookies to allow the server to access the session
                xfbml      : true, //parse social plugins on this page
                version    : 'v2.6' // use graph api version 2.5
            });

            FB.getLoginStatus(function(response) {
                statusChangeCallback(response);
            });    
        };
        
        //Load the SDK asynchronously 
        (function(d, s, id){
            var js, fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) {return;}
            js = d.createElement(s); js.id = id;
            js.src = "//connect.facebook.net/en_US/sdk.js";
            fjs.parentNode.insertBefore(js, fjs);
        }(document, 'script', 'facebook-jssdk'));

        function testAPI() {
            console.log('Welcome!  Fetching your information.... ');
            FB.api('/me', function(response) {
                console.log('Successful login for: ' + response.name);
                document.getElementById('status').innerHTML =
                    'Thanks for logging in, ' + response.name + '!';
            });
        }
    }
]);

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
