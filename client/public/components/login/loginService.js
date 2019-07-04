angular.module('kohPhanganApp')
.service('loginService',[ '$http','localStorageModel','$location','$rootScope', function ($http,localStorageModel,$location,$rootScope) {

    self = this;
    let serverUrl = 'http://localhost:3000/'
    self.object = {userNameService: "guest", isLoggedService: false }
    self.token = "";
    self.myFav= false;

    self.checkIfLogg = function () {
        const currName = localStorageModel.getLocalStorage('username')
        const currToken = localStorageModel.getLocalStorage('token')
        if(currName && currToken){
            self.object = {userNameService: currName , isLoggedService: true }
            $http.defaults.headers.common[ 'authorization' ] = "Bearer "+currToken;
        }
    }

    self.checkIfLogg();

    self.login = function (user) {
        console.log("login service ... ")
        return $http.post(serverUrl + "users/login", user)
            .then(function (response) {
                console.log("here!!! " + response.data)
                self.token = response.data.token
                $http.defaults.headers.common[ 'authorization' ] = "Bearer "+self.token;
                $http.defaults.headers.delete = { 'Content-Type': 'application/json;charset=utf-8' };
                
                console.log("set token!!")
                localStorageModel.updateLocalStorage('token',response.data.token)
                localStorageModel.updateLocalStorage('username',user.username)
                self.object = {userNameService: user.username, isLoggedService: true  }
                return self.object;
            }, function(response){
                console.log("wrong!!!")
                alert(response.data.message);
            });
    }

    self.signOut = function () {
        $http.defaults.headers.common[ 'authorization' ] = "";
        localStorageModel.removeLocalStorage('token');
        localStorageModel.removeLocalStorage('username');
        localStorageModel.removeLocalStorage('favorits');
        self.object = {userNameService: "guest", isLoggedService: false  }
        self.myFav= false;        
        self.token = "";
        $location.path('/');
    }


    self.getMyFavorites = function(){
        if($rootScope.object.userNameIndex !== "guest") {
            return $http({
                method: 'POST',
                url: serverUrl + "POI/private/getMyPOI",
                headers: {
                    'x-auth-token': localStorageModel.getLocalStorage('token')
                },
                data: {
                    username: $rootScope.object.userNameIndex
                }
            })
                .then(function (response) {
                    return response.data

                }, function (response) {
                    console.log("wrong!!!")
                });
        }
    }

    if(self.object.isLoggedService === true){
        self.getMyFavorites();
    }

    self.getTopRecPointsToUser = function(){
        return $http({
            method: 'POST',
            url: serverUrl + "POI/private/RecommendedPOI",
            headers: {
                'x-auth-token' : localStorageModel.getLocalStorage('token')
            },
            data: {
                username: $rootScope.object.userNameIndex
            }
        })
        .then(function(response){
            return response.data
        }, function(response){
            console.log("wrong!!!")
        });
    }

    self.getLastFavoritsPointsToUser = function(){

        return $http({
            method: 'POST',
            url: serverUrl + "POI/private/getLastTwoPOI",
            headers: {
                'x-auth-token' : localStorageModel.getLocalStorage('token')
            },
            data: {
                username: $rootScope.object.userNameIndex
            }
        })
        .then(function(response){
            return response.data
        }, function(response){
            console.log("wrong!!!")
        });
    }

    self.deleteFromFavorits = function(point){
        console.log('loginService deleteFromFavorits...')
        return $http({
            method: 'POST',
            url: serverUrl + "POI/private/deletePOI",
            headers: {
                'x-auth-token' : localStorageModel.getLocalStorage('token')
            },
            data : {
                username: $rootScope.object.userNameIndex,
                POIID: point
            }
        })
            .then(function(response){
                console.log("deleteFromFavorits loginService " +response.data.message)
                return response.data
            }, function(response){
                console.log("wrong loginService deleteFromFavorits !!!")
            });
    }

    self.insertToFavorits = function(point){
        console.log('loginService insertToFavorits...')
        return $http({
            method: 'POST',
            url: serverUrl + "POI/private/addPOI",
            headers: {
                'x-auth-token' : localStorageModel.getLocalStorage('token')
            },
            data : {
                username: $rootScope.object.userNameIndex,
                POIID: point
            }
        })
        .then(function(response){
            return response.data
        }, function(response){
            console.log("wrong loginService insertToFavorits !!!")
        });
    }


    self.addReview = function(review){
        console.log('loginService add Review in service...')
        return $http({
            method: 'POST',
            url: serverUrl + "POI/private/addRank",
            headers: {
                'x-auth-token' : localStorageModel.getLocalStorage('token')
            },
            data : {
                username: $rootScope.object.userNameIndex,
                POIID: review.POIID,
                rank: review.rank,
                description: review.description
            }
        })
        .then(function(response){
            return response.data
        }, function(response){
            console.log("wrong loginService insertToFavorits !!!")
        });
    }
}]);
