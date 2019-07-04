angular.module('kohPhanganApp')
.controller('homeLoginController', ['$scope','$rootScope','IndexService','recPoints','favPoints','$q', function($scope,$rootScope ,IndexService,recPoints,favPoints,$q ) {


  $rootScope.object.mainTitleOnImg = "Nice To Have You Back!";
  $rootScope.object.mainImgURL = "https://bkkaruncloud.b-cdn.net/wp-content/uploads/2018/04/chumphon-to-koh-tao.jpg";

  self.currPointHomeLoginA = IndexService.currPoint
  $scope.currPointB ='';
  $scope.haveFav = false;

  $scope.recommedPointA = {}
  $scope.recommedPointB = {}
  $scope.recommedPointA.POIID = recPoints[0].POIID
  $scope.recommedPointB.POIID = recPoints[1].POIID

  if((favPoints !== undefined) && (favPoints.length > 0)){
    $scope.haveFav = true;
    $scope.favoritePointA = {POI_name: favPoints[0].POI_name,POIID: favPoints[0].POIID}
    if(favPoints.length > 1)
      $scope.favoritePointB = {POI_name: favPoints[1].POI_name,POIID: favPoints[1].POIID}
  }

  //getting the details of a specific POI
  $scope.getPointIMG_ToRec = function() {
    console.log('getPointIMG from controller..')
    var i;
    var j = 0;
    var promises = [];
    //getting all the photos to the POIs
    for (i = 0; i < recPoints.length; i++) {
      var promise = IndexService.getPointIMG(recPoints[i].POIID);
      promises.push(promise);
    }

    //waiting for all photos from DB:
    $q.all(promises).then(data => {
      //adding the photos to the POIs
        if(data[0] !== undefined) {
          if(recPoints[0].POIID === data[0][0].POIID)
            recPoints[0].url = data[0][0].url//adding the photo to the specific POI
          else
            recPoints[1].url = data[0][0].url//adding the photo to the specific POI
        }
        else {
          console.log("no photo for this poi");
          recPoints[0].url = "https://www.freeiconspng.com/uploads/no-image-icon-10.png";
        }



      if(data[1] !== undefined) {
        if(recPoints[1].POIID === data[1][0].POIID)
          recPoints[1].url = data[1][0].url//adding the photo to the specific POI
        else
          recPoints[0].url = data[1][0].url//adding the photo to the specific POI
      }
      else {
        console.log("no photo for this poi");
        recPoints[1].url = "https://www.freeiconspng.com/uploads/no-image-icon-10.png";
      }



      $scope.recommedPointA.url = recPoints[0].url;
      $scope.recommedPointB.url = recPoints[1].url;
    });
  };



  //getting the details of a specific POI
  $scope.getPointIMG_ToFav = function() {
    console.log('getPointIMG from controller..')
    var i;
    var j = 0;
    var promises = [];
    //getting all the photos to the POIs
    for (i = 0; i < favPoints.length; i++) {
      var promise = IndexService.getPointIMG(favPoints[i].POIID);
      promises.push(promise);
    }

    //waiting for all photos from DB:
    $q.all(promises).then(data => {
      //adding the photos to the POIs
      if(data[0] !== undefined) {
        if(favPoints[0].POIID === data[0][0].POIID)
          favPoints[0].url = data[0][0].url//adding the photo to the specific POI
        else
          favPoints[1].url = data[0][0].url//adding the photo to the specific POI
      }
      else {
        console.log("no photo for this poi");
        favPoints[0].url = "https://www.freeiconspng.com/uploads/no-image-icon-10.png";
      }



      if(data[1] !== undefined) {
        if(favPoints[1].POIID === data[1][0].POIID)
          favPoints[1].url = data[1][0].url//adding the photo to the specific POI
        else
          favPoints[0].url = data[1][0].url//adding the photo to the specific POI
      }
      else {
        console.log("no photo for this poi");
        favPoints[1].url = "https://www.freeiconspng.com/uploads/no-image-icon-10.png";
      }

      $scope.favoritePointA.url = favPoints[0].url;
      $scope.favoritePointB.url = favPoints[1].url;

    });
  };



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
  };




  $scope.getPointData = function(currPOI,type) {
    IndexService.getPoint(currPOI.POIID)
        .then((response, err) => {
          if(err)
            console.log("err");
          else{
            if(type === "A1") {
              $scope.recommedPointA.category = response[0].category;
              $scope.recommedPointA.description = response[0].description;
              $scope.recommedPointA.number_of_views = response[0].number_of_views;
              $scope.recommedPointA.POI_name = response[0].POI_name;
              $scope.recommedPointA.rate = response[0].rating;
            }
            else if (type === "B1") {
              $scope.recommedPointB.category = response[0].category;
              $scope.recommedPointB.description = response[0].description;
              $scope.recommedPointB.number_of_views = response[0].number_of_views;
              $scope.recommedPointB.POI_name = response[0].POI_name;
              $scope.recommedPointB.rate = response[0].rating;
            }
            else if (type === "A2") {
              $scope.favoritePointA.category = response[0].category;
              $scope.favoritePointA.description = response[0].description;
              $scope.favoritePointA.number_of_views = response[0].number_of_views;
              $scope.favoritePointA.POI_name = response[0].POI_name;
              $scope.favoritePointA.rating = response[0].rating;
            }
            else if (type === "B2") {
              $scope.favoritePointB.category = response[0].category;
              $scope.favoritePointB.description = response[0].description;
              $scope.favoritePointB.number_of_views = response[0].number_of_views;
              $scope.favoritePointB.POI_name = response[0].POI_name;
              $scope.favoritePointB.rating = response[0].rating;
            }
          }

        })
        .catch(function(err) {
          console.log("err");
        });
  };


  $scope.getPointData($scope.recommedPointA, "A1")
  $scope.getPointData($scope.recommedPointB, "B1")

  if((favPoints !== undefined) && (favPoints.length > 0)) {
    $scope.getPointData($scope.favoritePointA, "A2")
    if(favPoints.length > 1)
      $scope.getPointData($scope.favoritePointB, "B2")
  }

  $scope.getPointIMG_ToRec()
  if((favPoints !== undefined) && (favPoints.length > 0)) {
    $scope.getPointIMG_ToFav()
  }

  }]);

