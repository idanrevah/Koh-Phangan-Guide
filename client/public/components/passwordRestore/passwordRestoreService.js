angular.module('kohPhanganApp')
.service('passwordRestoreService',[ '$http','localStorageModel', function ($http,localStorageModel) {

self = this;
self.password = ''
let serverUrl = 'http://localhost:3000/'



self.restore = function (user) {
    // register user
    console.log('restore from service..')
    return $http.post(serverUrl + "users/restorePassword", user)
        .then(function (response) {
            return response.data[0].password;
        }, function (response) {
           // self.restore.content = "Something went wrong";
        });
}

}]);