/*
var locations[];

var sitABaby = angular.module("sitABaby", []);

sitABaby.controller("babySitController", function ($scope, $http) {
    

});
*/
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
