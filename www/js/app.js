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

app.controller('detailsCtrl', function($scope, $http, $interval, $timeout) {

    this.isTrue = function() {
        return false;
    };


    $scope.timeFound = false;
    $scope.noTrainFound = false;
    $scope.countTime = 0;
    var mytimeout;
    $scope.getTimer = function (ans) {
        var currentTime = new Date().getTime();
        var loopRun = true;
        var realDate = currentTime;
        angular.forEach(ans.schedule.request.trip, function (trip) {
            if(loopRun){
                var dateString = trip["@attributes"].origTimeDate + trip["@attributes"].origTimeMin;
                realDate = new Date(dateString);
                realDate = realDate.getTime();
                if(realDate > currentTime) {
                    loopRun = false;
                }
            }

        });

        var tempCounter = 60 + Math.floor((realDate - currentTime) / 1000);
        if( tempCounter < 0) {
            $scope.countTime = 0;
            $scope.noTrainFound = true;
            $scope.timeFound = false;
        } else {
            $scope.noTrainFound = false;
            $scope.countTime = tempCounter;
            $scope.timeFound = true;

        }
        if (!(mytimeout === undefined)) {
            $timeout.cancel(mytimeout);

        }
        $scope.onTimeout = function () {
            if($scope.countTime <= 0) {
                $scope.countTime = 0;
                $scope.noTrainFound = true;
                $scope.timeFound = false;

            }
            else {
                $scope.countTime--;
                $scope.noTrainFound = false;
                $scope.timeFound = true;

            }
            mytimeout = $timeout($scope.onTimeout, 1000);
        };
        mytimeout = $timeout($scope.onTimeout, 1000);
    };

    $scope.getDetails = function(org , dest) {

        if(!(org === undefined) && !(dest === undefined)) {

            $http.get("http://bart.mahendramhatre.com/trains?source=" + org.abbr + "&dest=" + dest.abbr).success(function (result) {
                console.log("Success", result);
                $scope.resultTrip = result;

                if(!($scope.resultTrip.schedule === undefined) ){
                    $scope.getTimer($scope.resultTrip);
                }
                else {
                    $scope.countTime= 0;
                    $timeout.cancel(mytimeout);
                }

            }).error(function () {
                console.log("error");
            });


        };

    };



});

app.filter('formatTimer', function () {
    return function (input) {
        function z(n) {
            return (n < 10 ? '0' : '') + n;
        }

        var seconds = input % 60;
        var minutes = Math.floor(input / 60);
        var hours = Math.floor(minutes / 60);
        return (z(hours) + ':' + z(minutes) + ':' + z(seconds));
    };
});







