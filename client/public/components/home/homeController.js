angular.module('kohPhanganApp')
.controller('homeController', ['$scope','$q','$rootScope','IndexService', 'randomPoints' , function($scope,$q, $rootScope,IndexService , randomPoints ) {


    // changing the main img and his title
    $rootScope.object.mainTitleOnImg = "Tour Guide Koh Phangan, Thailand";
    $rootScope.object.mainImgURL = "https://www.goatsontheroad.com/wp-content/uploads/2018/06/things-to-do-in-koh-phangan-header-1.jpg";


  self.currPointA = IndexService.currPoint
  $scope.currPointB ='';

  $scope.randomPoint = randomPoints;



  //getting the details of a specific POI
  $scope.getPoint = function(poi) {
    console.log('getPoint from controller..')
    IndexService.getPoint(poi)
    .then((response, err) => {
        if(err)
            console.log("err");
        else{
          $scope.currPointB = response;
            }

    })
    .catch(function(err) {
      console.log("err");
    });
};


    //getting the details of a specific POI
    $scope.setPoint = function(poi) {
        $scope.currPointB = poi;
    };

    /*
    //getting the details of a specific POI
    $scope.getPointIMG = function() {
        console.log('getPointIMG from controller..')
        var i;
        for (i = 0; i < $scope.randomPoint.length; i++) {
           IndexService.getPointIMG($scope.randomPoint[i].POIID)
               .then(function (response) {
                    //if there is a photo to this poi:
                   if(response !== undefined) {
                       console.log(i + " - poi id: " + $scope.randomPoint[i].POIID + "  url: " + response[0].url)
                       $scope.randomPoint[i].url = response[0].url;
                   }
               }, function (response) {
                   console.log("no photo for this poi");
                   $scope.randomPoint[i].url = "https://www.freeiconspng.com/uploads/no-image-icon-10.png";
               });
        }
    };
*/

    /*
    //getting the details of a specific POI
    $scope.getPointIMG = function() {
        console.log('getPointIMG from controller..')
        var i;
        var allIMG = new Array();
        var j = 0;
        var promises = [];
        //getting all the photos to the POIs
        for (i = 0; i < $scope.randomPoint.length; i++) {
            var promise = IndexService.getPointIMG($scope.randomPoint[i].POIID);
            promises.push(promise);

                .then(function (response) {
                    //if there is a photo to this poi:
                    if(response !== undefined) {
                        $scope.randomPoint[j].url = response[0].url;
                        j++;
                    }
                }, function (response) {
                    console.log("no photo for this poi");
                    $scope.randomPoint[j].url = "https://www.freeiconspng.com/uploads/no-image-icon-10.png";
                    j++;
                });
        }
        $q.all(promises).then(

        );


        //adding the photos to the POIs
        //for (i = 0; i < $scope.randomPoint.length; i++) {
        //    $scope.randomPoint[i].url = allIMG[i].url
        //}
    };
*/

    //getting the details of a specific POI
    $scope.getPointIMG = function() {
        console.log('getPointIMG from controller..')
        var i;
        var j = 0;
        var promises = [];
        //getting all the photos to the POIs
        for (i = 0; i < $scope.randomPoint.length; i++) {
            var promise = IndexService.getPointIMG($scope.randomPoint[i].POIID);
            promises.push(promise);
        }

        //waiting for all photos from DB:
        $q.all(promises).then(data => {
                //adding the photos to the POIs
                for (i = 0; i < $scope.randomPoint.length; i++) {
                    if(data[i] !== undefined) {
                        $scope.randomPoint[i].url = data[i][0].url//adding the photo to the specific POI
                    }
                    else {
                        console.log("no photo for this poi");
                        $scope.randomPoint[j].url = "https://www.freeiconspng.com/uploads/no-image-icon-10.png";
                    }
                }
            });
    };


$scope.getPointIMG()


  }]);

