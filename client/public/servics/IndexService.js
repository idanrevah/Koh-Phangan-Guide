angular.module('kohPhanganApp')
.service('IndexService',[ '$http','localStorageModel', function ($http,localStorageModel) {
  
    
    self = this;    
    self.currPoint = 'false-currPoint'
    thresH = {threshold: '50'};
    

  /* self.directToPOI = function () {
        $location.path('/allPoi')
    }*/

    let serverUrl = 'http://localhost:3000/'


    // register user
    self.register = function (user) {
        console.log('register to sign up in from service..')
        return $http.post(serverUrl + "users/register", user)
        .then(function (response) {
            console.log("response.data.message"+response.data.message);
            if(response.data.message === 'user added')
            {
                return true;
            }
            return false

        }, function (response) {
            console.log("Something went wrong" + response.data.message);
            return false;
        });
    }


    // adding the categories to the user
    self.addCategoriesToUser = function (userAndCat) {
        console.log('add categories index service..')
        return $http.post(serverUrl + "users/addUsersCategory", userAndCat)
            .then(function (response) {
                console.log("response.data.message"+response.data.message);
                if(response.data.message === 'category add successfully')
                {
                    return true;
                }
                return false

            }, function (response) {
                console.log("Something went wrong" + response.data.message);
                return false;
            });
    }

    //getting 2 random questions from server
    self.getRandomQuestions = function () {
        console.log('getRandomalQuestions from service..'+thresH.threshold)
        return $http.get(serverUrl + "users/getTwoRandomQuestions", thresH)
            .then(function (response) {
                return response.data
            }, function (response) {
                self.getRandomQuestions.content = "Something went wrong";
            });
    }

    // getting my questions
    self.getMyQuestions = function (user) {
        console.log('getting questions from service..')
        return $http.post(serverUrl + "users/getMyQuestions", user)
            .then(function (response) {
                console.log("got response from questions");
                return response;
            }, function (response) {
                console.log("Something went wrong" + response.data.message);
                return false;
            });

    }

    self.getAllPoints = function(){
        return $http.get(serverUrl + "POI/getAllPOI")
        .then(function(response){
            return response.data
        }, function(response){
            console.log("wrong!!!")
        });
    }

    self.getCategories = function(){
        console.log('getAllcategories...')
        return $http.get(serverUrl + "POI/getListOfCategory")
        .then(function(response){
            return response.data
        }, function(response){
            console.log("wrong!!!")
        });
    }

    //we don't use rank because the API that we took uses a constant rank of 3.5
    self.getRandomPopularPoints = function (rank) {
        console.log('getRandomalPoints from service..'+thresH.threshold)
        return $http.get(serverUrl + "POI/getRandomPOI", thresH)
            .then(function (response) {
                return response.data
            }, function (response) {
                self.getPoint.content = "Something went wrong";
            });
    }

    self.getPoint = function (point) {
        return $http.get(serverUrl + "POI/getPOI/" + point)
            .then(function (response) {
                //self.currPoint =  response.data
                return response.data;
            }, function (response) {
                self.getPoint.content = "Something went wrong";
            });
    }


    self.getLastReview = function (point) {
        return $http.get(serverUrl + "POI/getLastPOIReviews/" + point)
            .then(function (response) {
                return response.data;
            }, function (response) {
                self.getPoint.content = "Something went wrong";
            });
    }

/*
    //getting the image of the current POI
    self.getPointIMG = function (pointID) {
         return $http.get(serverUrl + "POI/getPOIPicture/" + pointID)
             .then(function (response) {
                return response.data;
            }, function (response) {
                self.getPointIMG.content = "Something went wrong";
            });
    }



        //getting the image of the current POI
    self.getPointIMG = function (pointID) {
        return $http({
            method: 'GET',
            url: "localhost:3000/POI/getPOIPicture/" + pointID
        })
            .then(function (response) {
                return response.data;
            }, function (response) {
                self.getPointIMG.content = "Something went wrong";
            });
    }
*/
     self.getPointIMG = function (pointID) {
        console.log('getPointIMG from service..' + thresH.threshold)
        return $http.get(serverUrl + "POI/getPOIPicture/" + pointID, thresH)
            .then(function (response) {
                //console.log('poi data: ' + response.data[0].url)
                return response.data;
            });
    }


   /* self.addTokenToLocalStorage = function () {
        localStorageModel.addLocalStorage('token', self.login.content)
    }*/

}]);


