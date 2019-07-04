angular.module('kohPhanganApp')
.filter('unique',function(){
  return function(collection,keyname){
    var output = [];
    var keys = [];
    angular.forEach(collection,function(item){
      var key = item[keyname];
      if(keys.indexOf(key) === -1){
        keys.push(key);
        output.push(item);
      }
    });
    return output;
  };
})

.controller('allPoiController', ['$scope', '$rootScope','IndexService','loginService' ,'localStorageModel', 'all_poi','myFav', function($scope, $rootScope,IndexService,loginService ,localStorageModel,all_poi,myFav) {
  


  // changing the main img and his title
  $rootScope.object.mainTitleOnImg = "Enjoy The Attractions Here";
  $rootScope.object.mainImgURL = "https://homeiswhereyourbagis.com/wp-content/uploads/2018/08/Full-Moon-Party-Koh-Phangan-Feier-01.jpg";
  $rootScope.object.favoritBoll = [];

  $scope.myRank = "";
  $scope.myReview = "";
  self.currPointA = IndexService.currPoint;
  $scope.currPointB = {};

  $scope.sortType = 'PointName'; // set the default sort type
  $scope.sortReverse = false;  // set the default sort order
  $scope.searchPoint = '';     // set the default search/filter term
  $scope.isLoggedIn =  $rootScope.object.isLoggedIndex;

  $scope.kohPhanganView = [];

  $scope.allPoints = all_poi;
  $scope.myFavoritePOI = myFav;

  for(x in $scope.allPoints){
    if(x < $scope.allPoints.length - 1){
      $scope.kohPhanganView.push($scope.allPoints[x]);
      $rootScope.object.favoritBoll[$scope.allPoints[x].POIID] = false;
    }
  }

  //making the favorite hearts to full
      for (fp in $scope.myFavoritePOI){
          $rootScope.object.favoritBoll[$scope.myFavoritePOI[fp].POIID] = true;
      }


  //getting the details of a specific POI
  $scope.addReview = function() {
    if($rootScope.object.userNameIndex !== "guest") {
      if (($scope.myReview !== "") && ($scope.myRank !== "")) {
        loginService.addReview({description: $scope.myReview, rank: $scope.myRank, POIID: $scope.currPointB.POIID});
      } else {
        alert("You must insert a rank & review first!")
      }
    }
    else {
      alert("ONLY logged users can add Review to an attraction!")
    }
  };



  //getting the details of a specific POI
  $scope.getPoint = function(poi) {
    $scope.currPointB = poi;

    IndexService.getLastReview(poi.POIID)
        .then((response, err) => {
          if(err)
            console.log("err");
          else{
            $scope.currPointB.review1 = "No review has been written yet";
            $scope.currPointB.review2 = "No review has been written yet";
            if (response.length > 0){
              $scope.currPointB.review1 = response[0].description;
              $scope.currPointB.dateOfReview1 = response[0].Date;
            }
            if (response.length > 1){
              $scope.currPointB.review2 = response[1].description;
              $scope.currPointB.dateOfReview2 = response[1].Date;
            }
            console.log(response);
          }

        })
        .catch(function(err) {
          console.log("err");
        });
    $scope.getPointIMG();
  };


  //getting the details of a specific POI
  $scope.getPointIMG = function() {
    console.log('getPointIMG from controller..')
    IndexService.getPointIMG($scope.currPointB.POIID)
        .then(data => {
          $scope.currPointB.url = data[0].url
        })

  };



  $scope.delete = function(poi) {
    console.log('delete in from controller..')
    loginService.deleteFromFavorits(poi.POIID)
    $rootScope.object.favoritBoll[poi.POIID] = false;
  };

$scope.insert = function(poi) {
  console.log('insert in from controller..')
  loginService.insertToFavorits(poi.POIID)
  $rootScope.object.favoritBoll[poi.POIID] = true;
};



// setting default map to koh- phangan
var mymap = L.map('mapid').setView([	9.7378, 	100.0136], 13);
//var marker = L.marker([52.36264,4.92230]).addTo(mymap);
L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox.streets',
    accessToken: 'pk.eyJ1IjoiaGFkYXJoYXphbjkzIiwiYSI6ImNqaW4zOGpiNDA3NTQzcXBkZzZ6ZnRneDEifQ.7e6Qxz0wDzrxy8q87o6Q3Q'
}).addTo(mymap);

var greenIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.3.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.3.1/dist/images/marker-shadow.png",

  iconSize:     [19, 47], // size of the icon
  shadowSize:   [25, 32], // size of the shadow
  iconAnchor:   [11, 47], // point of the icon which will correspond to marker's location
  shadowAnchor: [2, 31],  // the same for the shadow
  popupAnchor:  [-2, -38] // point from which the popup should open relative to the iconAnchor
});


// set all poi's in map
L.marker([9.7247882,99.9764962], {icon: greenIcon}).addTo(mymap);
L.marker([9.7247882,99.9764962], {icon: greenIcon}).addTo(mymap).bindPopup("Amstedam Bar");

L.marker([9.6801218,100.0585234], {icon: greenIcon}).addTo(mymap);
L.marker([9.6801218,100.0585234], {icon: greenIcon}).addTo(mymap).bindPopup("The Coast");

L.marker([9.6770304,100.0653211], {icon: greenIcon}).addTo(mymap);
L.marker([9.6770304,100.0653211], {icon: greenIcon}).addTo(mymap).bindPopup("sunrise hotel");

L.marker([9.7842846,100.0570035], {icon: greenIcon}).addTo(mymap);
L.marker([9.7842846,100.0570035], {icon: greenIcon}).addTo(mymap).bindPopup("santhiya resort");

L.marker([9.7594324,99.9634955], {icon: greenIcon}).addTo(mymap);
L.marker([9.7594324,99.9634955], {icon: greenIcon}).addTo(mymap).bindPopup("paprika");

L.marker([9.7770832,100.053491], {icon: greenIcon}).addTo(mymap);
L.marker([9.7770832,100.053491], {icon: greenIcon}).addTo(mymap).bindPopup("panviman resort");

L.marker([9.6757324,100.0650192], {icon: greenIcon}).addTo(mymap);
L.marker([9.6757324,100.0650192], {icon: greenIcon}).addTo(mymap).bindPopup("Mamas Schnitzel");

L.marker([9.6766843,100.0632167], {icon: greenIcon}).addTo(mymap);
L.marker([9.6766843,100.0632167], {icon: greenIcon}).addTo(mymap).bindPopup("israeli house");

L.marker([9.7778566,100.0518844], {icon: greenIcon}).addTo(mymap);
L.marker([9.7778566,100.0518844], {icon: greenIcon}).addTo(mymap).bindPopup("Handsome burgers");

L.marker([9.7477524,99.9732682], {icon: greenIcon}).addTo(mymap);
L.marker([9.7477524,99.9732682], {icon: greenIcon}).addTo(mymap).bindPopup("Gecko Bar");

L.marker([9.7149188,100.0261956], {icon: greenIcon}).addTo(mymap);
L.marker([9.7149188,100.0261956], {icon: greenIcon}).addTo(mymap).bindPopup("Half Moon Festival");

L.marker([9.7778446,100.051352], {icon: greenIcon}).addTo(mymap);
L.marker([9.7778446,100.051352], {icon: greenIcon}).addTo(mymap).bindPopup("Bob Marley");

L.marker([9.6968713,100.0249667], {icon: greenIcon}).addTo(mymap);
L.marker([9.6968713,100.0249667], {icon: greenIcon}).addTo(mymap).bindPopup("Full moon party");


}]);
