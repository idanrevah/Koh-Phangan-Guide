angular.module('kohPhanganApp')
.controller('aboutController', ['$scope' ,'$rootScope', function($scope , $rootScope) {

    var caro =angular.element(document.querySelector('#myCarousel'))

    $rootScope.object.mainTitleOnImg = "Learn About Koh Phangan";
    $rootScope.object.mainImgURL = "http://www.backpackerbanter.com/blog/wp-content/uploads/2017/10/eastern-thai-island-thailand-koh-tao-koh-samui-koh-phangan-guide.jpg";


    $scope.prev = function(){
      caro.carousel('prev')
    }
    $scope.next = function(){
      caro.carousel('next')
    }

    $scope.count = 0;
    $scope.myFunc = function() {
      $scope.count++;
    };
  }]);