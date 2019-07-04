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

.controller('favoriteController', ['$scope','$rootScope','loginService' ,'IndexService','localStorageModel', 'all_fav','$route', function($scope,$rootScope,loginService,IndexService,localStorageModel ,all_fav,$route) {

  self = this;
  self.currPointA = IndexService.currPoint
  $scope.currPointB ='';
  $scope.sortType = 'id'; // set the default sort type
  $scope.sortReverse = false;  // set the default sort order
  $scope.favorites = [];
    $scope.myRank = "";
    $scope.myReview = "";

    $rootScope.object.mainTitleOnImg = "Your Favorite Places Saved Right Here!";
    $rootScope.object.mainImgURL = "https://steemitimages.com/DQmZY6hafkH92tH7uSfg5v87rvvU9wtX6LwQxnfD7wh8F5g/kpsunset1.jpg";
    $rootScope.object.favoritBoll = [];


    $scope.favorites = all_fav;

for (fp in  $scope.favorites){
      $rootScope.object.favoritBoll[$scope.favorites[fp].POIID] = true;
}

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

$scope.saveFavorite = function() {
  console.log('saveFavorite..') 
  var curr = localStorageModel.getLocalStorage('favorits'); 
  var chang = "";

  for(x in curr){

    //chang order
    if(curr[x].intoData === true && curr[x].ifDelete === false && curr[x].ifOrder === true)
    {
      //chang = chang+curr[x].PointName+":"+curr[x].order+",";
      chang = chang+curr[x].PointName+":"+curr[x].order;
      changArr = { Orders: chang }
      console.log('chang order..' + chang)
      loginService.updateUserFavoritList(changArr)
      .then((response, err) => {
          if(err)
              console.log("err");            
          else{
                console.log("updateUserFavoritList in controller"); 
                localStorageModel.removeLocalStorage('favorits');
                $route.reload();  
              }
          
      })
      .catch(function(err) {
        console.log("err");
      });
    }

     //delete from DB
     if(curr[x].intoData === true && curr[x].ifDelete === true)
     {
      console.log('delete from DB..') 
       loginService.deleteFromFavorits(curr[x])
       .then((response, err) => {
           if(err)
               console.log("err");            
           else{
                 console.log("delete into save"); 
                 localStorageModel.removeLocalStorage('favorits');
                $route.reload();  
               }
           
       })
       .catch(function(err) {
         console.log("err");
       });
     }

    //insert to DB
    else if(curr[x].intoData === false && curr[x].ifDelete === false)
    {
      console.log('insert to DB..') 
      loginService.insertToFavorits(curr[x])
      .then((response, err) => {
          if(err)
              console.log("err");            
          else{
                console.log("insert into save"); 
                localStorageModel.removeLocalStorage('favorits');
                $route.reload(); 
              }
          
      })
      .catch(function(err) {
        console.log("err");
      });
    }
     
  }
  

};
$scope.changOrder = function(poi) {
  console.log('changOrder in from controller..') 
  
  var curr = localStorageModel.getLocalStorage('favorits'); 
  newFavToLocal = [];

  for(x in curr){
    
    if(curr[x].POI_name === poi.POI_name)
    {

      favPoint = { POIID: curr[x].POIID , POI_name: poi.POI_name , order: poi.order , intoData: curr[x].intoData , ifDelete:  curr[x].ifDelete , ifOrder: true};
      newFavToLocal.push(favPoint);
    } 
    
    else{
      newFavToLocal.push(curr[x]);
    }

  }

  localStorageModel.updateLocalStorage('favorits',newFavToLocal); 

};




  
}]);
