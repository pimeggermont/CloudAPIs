var sitababyApp = angular.module('sitababyApp', ['ngRoute', 'ngAnimate', 'ui.bootstrap']);


sitababyApp.controller('indexCtrl', ['$scope',
    function ($scope) {}]);

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
            })
            .when("/login", {
                templateUrl: "partials/login.html",
                controller: "loginCtrl"
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
                redirectTo: "/login"
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

//LOGIN CONTROLLER
sitababyApp.controller('loginCtrl', ['$scope', 'authFact', '$location',
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

                        $location.path("/home");
                        $scope.$apply();
                    });
                } else {
                    console.log('User cancelled login or did not fully authorize');
                }


            });
        };
}]);


//HOME CONTROLLER

//BABYSITTERS CONTROLLER
sitababyApp.controller('babysittersCtrl', ["$scope",
    function ($scope) {
        // DATEPICKER
        $scope.today = function () {
            $scope.dt = new Date();
        };
        $scope.today();

        $scope.clear = function () {
            $scope.dt = null;
        };

        $scope.options = {
            customClass: getDayClass,
            minDate: new Date(),
            showWeeks: true
        };

        $scope.toggleMin = function () {
            $scope.options.minDate = $scope.options.minDate ? null : new Date();
        };

        $scope.toggleMin();

        $scope.setDate = function (year, month, day) {
            $scope.dt = new Date(year, month, day);
        };

        var tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        var afterTomorrow = new Date(tomorrow);
        afterTomorrow.setDate(tomorrow.getDate() + 1);
        $scope.events = [];

        function getDayClass(data) {
            var date = data.date,
                mode = data.mode;
            if (mode === 'day') {
                var dayToCheck = new Date(date).setHours(0, 0, 0, 0);

                for (var i = 0; i < $scope.events.length; i++) {
                    var currentDay = new Date($scope.events[i].date).setHours(0, 0, 0, 0);

                    if (dayToCheck === currentDay) {
                        return $scope.events[i].status;
                    }
                }
            }

            return '';
        }
        
        // DATA UIT FIREBASE HALEN, EERSTE ELEMENT WEGHALEN OMDAT DIE UNDIFIEND
        var ref = new Firebase("https://glaring-fire-6779.firebaseio.com/babysitters");
        ref.on("value", function (snapshot) {
            var a = snapshot.val();
            $scope.babysitters = a;
            $scope.$digest();
        }, function (errorObject) {
            console.log("The read failed: " + errorObject.code);
        });

        $scope.sorteren = 'name';
        $scope.currentLat = 51.369406;
        $scope.currentLng = 4.465898;

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function (position) {
                $scope.currentLat = position.coords.latitude;
                $scope.currentLng = position.coords.longitude;
                var map = new google.maps.Map(document.getElementById('map2'), {
                    zoom: 16,
                    center: new google.maps.LatLng($scope.currentLat, $scope.currentLng),
                    scrollwheel: true,
                    draggable: true,
                    mapTypeId: google.maps.MapTypeId.ROAD

                });
                var marker = new google.maps.Marker({
                    map: map,
                    position: new google.maps.LatLng($scope.currentLat, $scope.currentLng)
                });
            }, function (error) {
                console.log(error);
            })
        }

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
