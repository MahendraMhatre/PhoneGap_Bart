/**
 * Created by mahendramhatre on 3/2/17.
 */


var app = angular.module('BartModule', []);

 app.controller('MainCtrl', function($scope, $http) {

        this.source ="";
        this.destination = "";
        this.stationInfo = "";
        $scope.hello = "Hello";
        this.setSource = function(newValue){
            this.source = newValue;
        };

        this.setDestination = function(newValue){
            this.destination = newValue;
        };

        $http.get("http://bart.mahendramhatre.com/stations").success(function(result) {
            $scope.resultGet = result;
        }).error(function() {
            console.log("error");
        });

        $scope.getTrips = function() {

            $http.get("http://bart.mahendramhatre.com/stations").success(function(result) {
                console.log("Success", result);
                $scope.resultGet = result;
            }).error(function() {
                console.log("error");
            });
        };


        $scope.getStation = function(station) {

            $http.get("http://bart.mahendramhatre.com/station?source="+station).success(function(result) {
                console.log("Success", result);
                $scope.resultS = result;

            }).error(function() {
                console.log("error");
            });
        };


     $scope.tab = 1;

     $scope.setTab = function(newValue){
         $scope.tab = newValue;
     };

     $scope.isSet = function(tabName){
         return $scope.tab === tabName;
     };

     $scope.lat1 =  37.765062;
     $scope.long1 = -122.419694;

     var cities = [
         {
             city : 'SFO',
             desc : 'This city is live!',
             lat :  this.lat1,
             long : this.long1
         }
     ];
     var mapOptions = {
         zoom: 15,
         center: new google.maps.LatLng( $scope.lat1, $scope.long1),
         mapTypeId: google.maps.MapTypeId.TERRAIN
     }


     var marker = "";
     $scope.map ="";
     $scope.createMarker = function (){
         mapOptions.center = new google.maps.LatLng($scope.lat1, $scope.long1);
         $scope.map = new google.maps.Map(document.getElementById('mapElement'), mapOptions);
         marker = new google.maps.Marker({
             map: $scope.map,
             position: new google.maps.LatLng($scope.lat1, $scope.long1)

         });

     };

     $scope.change = function(sLat, sLong) {
         $scope.lat1 = sLat;
         $scope.long1 = sLong;
     };

     $scope.createMarker();


 });







