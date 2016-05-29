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
                controller: "homeCtrl"
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
            .when("/profile", {
                templateUrl: "partials/profile.html",
                controller: "profileCtrl",
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
var userid;
var usertyp;
//LOGIN CONTROLLER
sitababyApp.controller('loginCtrl', ['$scope', 'authFact', '$location',
    function ($scope, authFact, $location) {
        $scope.name = 'Login please';
        $scope.FBLogin = function () {
            FB.login(function (response) {
                if (response.authResponse) {
                    console.log('Welcome!  Fetching your information.... ');
                    FB.api('/me?fields=id,name,email,gender', function (response) {
                        console.log('Successful login for: ' + response.name);
                        console.log(response);
                        userid = response.id;
                        usertyp = $scope.typeuser;
                        var ref = new Firebase("https://glaring-fire-6779.firebaseio.com/");
                        var usersRef = ref.child("users");
                        usersRef.child(response.id).set({
                            full_name: response.name,
                            email: response.email,
                            gender: response.gender,
                            typeofuser: $scope.typeuser,
                         
                        });

                        var accessToken = FB.getAuthResponse().accessToken;
                        console.log(accessToken);
                        authFact.setAccessToken(accessToken);

                        $location.path("/home");
                        $scope.$apply();
                    });
                } else {
                    console.log('User cancelled login or did not fully authorize');
                }
            }, {
                scope: 'public_profile,email'
            });
        };
}]);


//PROFILE CONTROLLER
sitababyApp.controller('profileCtrl', ["$scope",
    function ($scope) {
        $scope.uptodate = "";
        console.log("USERID: " + userid);
        var ref = new Firebase("https://glaring-fire-6779.firebaseio.com/users");
        ref.orderByKey().startAt(userid).endAt(userid).on("child_added", function (snapshot) {
            $scope.profileData = snapshot.val();
            console.log($scope.profileData);
            $scope.$apply();
        }, function (errorObject) {
            console.log("The read failed: " + errorObject.code);
        });

        $scope.writeUserInfo = function () {
            var ref = new Firebase("https://glaring-fire-6779.firebaseio.com/");
            var usersRef = ref.child("users");
            usersRef.child(userid).set({
                full_name: $scope.profileData.full_name,
                birthday: $scope.profileData.birthday,
                email: $scope.profileData.email,
                education: $scope.profileData.education,
                school: $scope.profileData.school,
                gender: $scope.profileData.gender,
                typeofuser: $scope.profileData.typeofuser,
            });
            $scope.uptodate = "Profile is up to date! Have a nice day!";
        }
    }]);
//HOME CONTROLLER
sitababyApp.controller('homeCtrl', ["$scope", "$http",
    function ($scope, $http){
          //twitter api
        $scope.myTwitterData = [];
        $http.get("http://localhost:3000/tweets")
        .then(function(response) {
            console.log(response.data);
            $scope.myTwitterData = response.data.statuses;
            console.log($scope.myTwitterData);
        });   
    }])
//BABYSITTERS CONTROLLER
//var babysitters = [];
sitababyApp.controller('babysittersCtrl', ["$scope", "$http",
    function ($scope, $http) {

        // DATEPICKER
        $scope.today = function () {
            $scope.dt = new Date();
        };
        $scope.today();
        $scope.options = {
            customClass: getDayClass,
            minDate: new Date(),
            showWeeks: true
        };
        $scope.setDate = function (year, month, day) {
            $scope.dt = new Date(year, month, day);
        };
        var today = new Date();
        today.setDate(today.getDate());
        $scope.events = [{
            date: today,
            status: 'full'
            }];

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

        // DATA UIT FIREBASE HALEN, EERSTE ELEMENT WEGHALEN OMDAT DIE UNDIFINED IS
        var ref = new Firebase("https://glaring-fire-6779.firebaseio.com/users");
        $scope.babysitters = [];
        ref.on("child_added", function (snapshot) {
            $scope.babysitters.push(snapshot.val());
            console.log($scope.babysitters);
            /*for (i = 0; i < a.length; i++) {
                babysitters[i] = a[i];
            }
            babysitters.splice(0,1);*/
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
                    zoom: 14,
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
