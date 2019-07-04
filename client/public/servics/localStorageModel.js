angular.module("kohPhanganApp")
    .service('localStorageModel', ['localStorageService', function(localStorageService) {

        var self=this;

        self.addLocalStorage = function (key, value) {
            var dataVal = localStorageService.get(key);
            console.log("dataVal "+dataVal)
            if (dataVal !== null)
            {
                if (localStorageService.set(key, value)) {
                    console.log("data added")
                    console.log(key)
                    console.log(value)
                }
            }
            
            else
                console.log('failed to add the data');
        }

        self.getLocalStorage= function (key)
        {
           return  localStorageService.get(key)
        }

        self.updateLocalStorage = function (key,value)
        {
            localStorageService.remove(key);
            localStorageService.set(key,value);
        }

        self.removeLocalStorage = function (key)
        {
            localStorageService.remove(key);
        }



    }]);