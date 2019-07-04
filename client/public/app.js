let app = angular.module('kohPhanganApp', ["ngRoute", 'LocalStorageModule']);


//before app run
app.config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider)  {


    $locationProvider.hashPrefix('');


    $routeProvider
    .when('/', {
        templateUrl: 'components/home/home.html',
        controller : 'homeController as homeCtrl',
        resolve: {
            randomPoints: function (IndexService){
                return IndexService.getRandomPopularPoints();
            }
        }
    })
    .when('/about', {
        templateUrl: 'components/about/about.html',
        controller : 'aboutController as abtCtrl'
    })
    .when('/poi', {
        templateUrl: 'components/poi/poi.html',
        controller : 'poiController as poiCtrl'
    })
    .when('/register', {
        templateUrl: 'components/register/register.html',
        controller : 'registerController as registerCtrl',
        resolve: {
            all_cat: function (IndexService){
                return IndexService.getCategories();
            },
            randomQuestions: function (IndexService) {
                return IndexService.getRandomQuestions();
            }
        }
    })
    .when('/login', {
        templateUrl: 'components/login/login.html',
        controller : 'loginController as loginCtrl'
    })
    .when('/favorite', {
        templateUrl: 'components/favorite/favorite.html',
        controller : 'favoriteController as favoriteCtrl',
        resolve: {
            all_fav: function (loginService){
                return loginService.getMyFavorites();
            }
        }
    })
    .when('/homeLogin', {
        templateUrl: 'components/homeLogin/homeLogin.html',
        controller : 'homeLoginController as homeLoginCtrl',
        resolve: {
            recPoints: function (loginService){
                return loginService.getTopRecPointsToUser();
            },
            favPoints: function (loginService){
                return loginService.getLastFavoritsPointsToUser();
            },
             function (loginService){
                loginService.getMyFavorites();
            }
        }
    })
    .when('/passwordRestore', {
        templateUrl: 'components/passwordRestore/passwordRestore.html',
        controller : 'passwordRestoreController as passwordRestoreCtrl'
    })
    .when('/allPoi', {
        templateUrl: 'components/allPoi/allPoi.html',
        controller : 'allPoiController as allPoiCtrl',
        resolve: {
            all_poi: function (IndexService){
                return IndexService.getAllPoints();
            },
            myFav: function (loginService){
                return loginService.getMyFavorites();
            }
        }
    })

    
   

    .otherwise({ redirectTo: '/' });

        
}]);











