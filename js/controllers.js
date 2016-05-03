var sitababyApp = angular.module('sitababyApp', ['firebase', 'ngRoute']);
var locations = [];

window.fbAsyncInit = function () {
    FB.init({
        appId: '986227158099684',
        cookie: true, // enables cookies to allow the server to access the session
        xfbml: true, //parse social plugins on this page
        version: 'v2.6' // use graph api version 2.5
    });
};

//Load the SDK asynchronously 
(function (d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) {
        return;
    }
    js = d.createElement(s);
    js.id = id;
    js.src = "//connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

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
                controller: "babysittersCtrl",
                authenticated: true
            })
            .when("/contact", {
                templateUrl: "partials/contact.html",
                controller: "contactCtrl",
                authenticated: true
            })
            .otherwise({
                redirectTo: "/home"
            });
}]);

sitababyApp.run(['$rootScope', '$location', 'authFact',
    function ($rootScope, $location, authFact) {
        $rootScope.$on('$routeChangeStart', function (event, next, current) {
            // if route is authenticated, then the user shoud access token
            console.log(next);
            if (next.$$route.authenticated) {
                var userAuth = authFact.getAccessToken();
                if (!userAuth) {
                    $location.path('/');
                }
            }
        });

    }]);

sitababyApp.factory('authFact', [function () {
    var authFact = {};

    authFact.setAccessToken = function (accessToken) {
        authFact.authToken = accessToken;
    };

    authFact.getAccessToken = function () {
        return authFact.authToken;

    };
    return authFact;
}]);

//HOME CONTROLLER
sitababyApp.controller('homeCtrl', ['$scope', 'authFact', '$location',
    function ($scope, authFact, $location) {
        $scope.name = 'Login please';
        $scope.FBLogin = function () {
            FB.login(function (response) {
                if (response.authResponse) {
                    console.log('Welcome!  Fetching your information.... ');
                    FB.api('/me', function (response) {
                        console.log('Successful login for: ' + response.name);

                        var accessToken = FB.getAuthResponse().accessToken;
                        console.log(accessToken);
                        authFact.setAccessToken(accessToken);

                        $location.path("/babysitters");
                        $scope.$apply();
                    });
                } else {
                    console.log('User cancelled login or did not fully authorize');
                }


            });
        };
}]);
/*// facebook login sdk
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
            FB.getLoginStatus(function (response) {
                statusChangeCallback(response);
            });
        }

        function testAPI() {
            console.log('Welcome!  Fetching your information.... ');
            FB.api('/me', function (response) {
                console.log('Successful login for: ' + response.name);
                document.getElementById('status').innerHTML =
                    'Thanks for logging in, ' + response.name + '!';

                var accessToken = FB.getAuthResponse().accessToken;
                console.log(accessToken);
                authFact.setAccessToken(accessToken);

                $location.path("partials/babysitters");
            });
        }
    }
]);
*/

//HOME CONTROLLER
sitababyApp.controller('indexCtrl', ['$scope',
    function ($scope) {

	}
]);

//BABYSITTERS CONTROLLER
sitababyApp.controller('babysittersCtrl', ["$scope", "$firebaseArray",
    function ($scope, $firebaseArray) {

        // DATA UIT FIREBASE HALEN, EERSTE ELEMENT WEGHALEN OMDAT DIE UNDIFIEND
        var ref = new Firebase("https://glaring-fire-6779.firebaseio.com/babysitters");
        ref.on("value", function (snapshot) {
            $scope.$apply(function () {
                var a = snapshot.val();
                a.shift();

                console.log(a);
                $scope.babysitters = a;
            });
        }, function (errorObject) {
            console.log("The read failed: " + errorObject.code);
        });

        $scope.sorteren = 'name';
        $scope.currentLat = 51.369406;
        $scope.currentLng = 4.465898;
        /*
        function initMap() {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function (position) {
                    $scope.currentLat = position.coords.latitude
                    $scope.currentLng = position.coords.longitude
                    map.setCenter($scope.currentLat,$scope.currentLng);
                    var marker = new google.maps.Marker({
                        map: $scope.map,
                        position: new google.maps.LatLng($scope.currentLat, $scope.currentLng),
                    });
                }, function () {
                    handleLocationError(true, infoWindow, map.getCenter());
                });
            } else {
                console.log("geen locatie ondersteuning");
            }
            var map = new google.maps.Map(document.getElementById('map'), {
                center: {
                    lat: $scope.currentLat,
                    lng: $scope.currentLng
                },
                zoom: 16
            });
            
        }*/

        function getMap() {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function (position) {
                    $scope.currentLat = position.coords.latitude;
                    $scope.currentLng = position.coords.longitude;
                }, function (error) {
                    console.log(error);
                });
            }
            var mapoptions = {
                zoom: 16,
                center: new google.maps.LatLng($scope.currentLat, $scope.currentLng),
                scrollwheel: true,
                draggable: true,
                mapTypeId: google.maps.MapTypeId.ROAD

            }
            var map = new google.maps.Map(document.getElementById('map'), mapoptions);
            var marker = new google.maps.Marker({
                map: map,
                position: new google.maps.LatLng($scope.currentLat, $scope.currentLng)
            });
        }
        getMap();
        /*
        function getLocation() {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition($scope.showPosition, $scope.showError);
            }
        };
        $scope.showPosition = function (position) {
            $scope.currentLat = position.coords.latitude;
            $scope.currentLng = position.coords.longitude;
        };
        $scope.showError = function (error) {
            console.log(error);
        }
        getLocation();
        var mapoptions = {
            zoom: 16,
            center: new google.maps.LatLng($scope.currentLat, $scope.currentLng),
            scrollwheel: true,
            draggable: true,
            mapTypeId: google.maps.MapTypeId.ROAD

        }*/
/*
        $scope.map = new google.maps.Map(document.getElementById('map'), mapoptions); 
        //$scope.markers = [];
        var infoWindow = new google.maps.InfoWindow();
        */
        //functie voor als we plaatsen van babysitters moeten inladen.
        /*
        var createMarker = function (info) {
                        var marker = new google.maps.Marker({
                            map: $scope.map,
                            position: new google.maps.LatLng(info.lat, info.long),
                            title: info.naam
                        });
                        marker.content = '<div class="infoWindowContent">' + info.naam + '</div>';

                        google.maps.event.addListener(marker, 'click', function () {
                            infoWindow.setContent('<h2>' + marker.title + '</h2>' + marker.content);
                            infoWindow.open($scope.map, marker);
                        });

                        $scope.markers.push(marker);

                    }
        
                    for (i = 0; i < babysitters.length; i++) {
                        createMarker(babysitters[i]);
                    }
        
                    $scope.openInfoWindow = function(e, selectedMarker){
                    e.preventDefault();
                    google.maps.event.trigger(selectedMarker, 'click');
                    }
        */
        /*
        var marker = new google.maps.Marker({
            map: $scope.map,
            position: new google.maps.LatLng($scope.currentLat, $scope.currentLng),
            title: "Uw huidige locatie",
            naam: "Thuis"
        });
        
        console.log($scope.currentLat);
        console.log($scope.currentLng);
        */
}]);

//CONTACT CONTROLLER
sitababyApp.controller('contactCtrl', ['$scope',
    function ($scope) {
        var mapoptions = {
            zoom: 16,
            center: new google.maps.LatLng(51.230056, 4.415792),
            mapTypeId: google.maps.MapTypeId.ROAD
        }

        $scope.map = new google.maps.Map(document.getElementById('map'), mapoptions);
        //$scope.markers = [];

        var marker = new google.maps.Marker({
            map: $scope.map,
            position: new google.maps.LatLng(51.230056, 4.415792),
            title: "AP-hogeschool Antwerpen"
        });
}]);
