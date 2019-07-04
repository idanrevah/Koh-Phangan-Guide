angular.module('kohPhanganApp')
.controller('passwordRestoreController', ['$scope','passwordRestoreService','IndexService', function($scope ,passwordRestoreService,IndexService ) {
    self = this;
    $scope.user = {}
    $scope.user.questions= []
    $scope.myVar = false;
    self.password = passwordRestoreService.password

    $scope.restore = function() {
        console.log('restore in from controller..')
        passwordRestoreService.restore({username : $scope.user.username, quesID1 : $scope.userQuestions.data[0].quesID, quesID2 : $scope.userQuestions.data[1].quesID, ans1 : $scope.user.ansewer1, ans2 : $scope.user.ansewer2})
            .then (data => {
                if (data == undefined) {
                    alert("answers are not correct !")
                }
                else{
                $scope.user.password = data;
                }

            })
    };


    $scope.getMyQuestions = function () {
        IndexService.getMyQuestions({username : $scope.user.username})
            .then(data =>{
                if (data == false) {
                    alert("user doesn't exists!")
                }
                else {
                $scope.userQuestions = data;
                $scope.myVar = true;
                }
                }
            )
    }
  }]);