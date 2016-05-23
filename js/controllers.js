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
                        var ref = new Firebase("https://glaring-fire-6779.firebaseio.com/");
                        var usersRef = ref.child("users");
                        usersRef.child(response.id).set({
                            Full_name: response.name,
                            Email: response.email,
                            Gender: response.gender,
                            TypeOfUser: $scope.typeuser
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
        console.log("USERID: " + userid);
        var ref = new Firebase("https://glaring-fire-6779.firebaseio.com/users");
        ref.orderByKey().startAt(userid).endAt(userid).on("value", function (snapshot) {
            $scope.profileData = snapshot.val();
            console.log($scope.profileData);
        }, function (errorObject) {
            console.log("The read failed: " + errorObject.code);
        });
        
        $scope.writeUserInfo = function(){
            var ref = new Firebase("https://glaring-fire-6779.firebaseio.com/");
                        var usersRef = ref.child("users");
                        usersRef.child(userid).set({
                            Full_name: $scope.fullname,
                            Email: $scope.email,
                            Birthday: $scope.birthday,
                            Education: $scope.education,
                            Gender: $scope.gender
                        });
            console.log("Testje");
        }
    }]);

//BABYSITTERS CONTROLLER
//var babysitters = [];
sitababyApp.controller('babysittersCtrl', ["$scope", "$http",
    function ($scope, $http) {
        //BOL api 
        $http.get("https://api.bol.com/catalog/v4/products/1004004011187773?apikey={'F0F28A4ABBC47534A8004A1A9A5BD4C61234452F2A89ADC24C8EA668F5A2C2598E4672D5DC4259E08F79D32F44BFC60A45755AC00E1B2CE474CD05B1444004892BD6F131AA5CB615CCE3342E3CE4B551A79D81E320D5C6D5DDD015EB84512B4914012D1DC1CA7DB7DB8AE8CF0E8BA719F60918E4C4A8A9823914A7903AE0D4F5'}&offers=cheapest&includeAttributes=false&format=json")
            .then(function (response) {
                $scope.bol = response.data;

            });

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
