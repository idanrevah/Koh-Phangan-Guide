  angular.module('kohPhanganApp')
    .controller('indexController', ['$scope','$rootScope' ,'IndexService','loginService',function ($scope ,  $rootScope ,IndexService,loginService) {
    
        $rootScope.object = { userNameIndex: "guest" ,favoritBoll: [], isLoggedIndex: false , mainTitleOnImg: "Tour Guide Koh Phangan, Thailand" , mainImgURL: "https://www.goatsontheroad.com/wp-content/uploads/2018/06/things-to-do-in-koh-phangan-header-1.jpg" }

        $scope.loginService = loginService;
        $scope.$watch('loginService.object',function(newValue,oldValue){
            if(newValue !== undefined){

                $rootScope.object.userNameIndex = newValue.userNameService;
                $rootScope.object.isLoggedIndex = newValue.isLoggedService;
               
            }
        })

        $scope.signOut = function() {
            loginService.signOut(); 
            $rootScope.object = { userNameIndex: "guest" , isLoggedIndex: false  }          
          };

    }]);

