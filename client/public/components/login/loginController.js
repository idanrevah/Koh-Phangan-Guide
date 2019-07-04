angular.module('kohPhanganApp')
.controller('loginController', ['$scope','$rootScope' ,'$location','$window', 'loginService', function($scope ,$rootScope, $location ,$window,loginService ) {



  $rootScope.object.mainTitleOnImg = "Long Time No See!";
  $rootScope.object.mainImgURL = "https://luxurytravelinasia.com/wp-content/uploads/2017/12/koh-phangan.jpg";

  $scope.user = {}

  //if the user clicked the login button
  $scope.login = function() {
    console.log('logging in from login controller..')

    //checking the fields
    if($scope.user.username === undefined || $scope.user.password === undefined )
    {
      $window.alert("You must fill all the fields");
    }
    else{
        loginService.login($scope.user)
        .then(function (response) {
          if(response !== undefined){
            $rootScope.object.isLoggedIndex = true;
            $rootScope.object.userNameIndex = $scope.user.username ;
            $location.path('/homeLogin');
          }          

      }, function (response) {
          console.log("Something went wrong");
          $window.alert(response);
      });
    }
  };

  
  }]);

 
      
  

