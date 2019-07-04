angular.module('kohPhanganApp')
.controller('registerController', ['$q','$scope','$rootScope','$location','IndexService', 'randomQuestions', 'all_cat', function($q,$scope,$rootScope,$location,IndexService,randomQuestions ,all_cat ) {


	$rootScope.object.mainTitleOnImg = "Join Us To Enjoy Our Service";
    $rootScope.object.mainImgURL = "http://static.asiawebdirect.com/m/phuket/portals/kosamui-com/homepage/ko-phangan/full-moon-party/allParagraphs/BucketComponent/ListingContainer/014/image/full-moon-party-thailand.jpg";


	$scope.randomQuestions = randomQuestions;

	//loading the categories:
	var allcat = all_cat;
	$scope.categories = [];
	$scope.myCat = [];
	var i;
	for (i = 0; i < all_cat.length; i++) {
    	$scope.categories[i] = allcat[i].category_name;
	}

	//loading the countries:
	$scope.countries = [];
	console.log('loadXMLDoc..')
	var file,xmlhttp,xmlDoc
	xmlhttp = new XMLHttpRequest();
	xmlhttp.open("GET", "components/register/countries.xml", false);
	xmlhttp.send();
	xmlDoc = xmlhttp.responseXML; 
	file = xmlDoc.getElementsByTagName("Country");

	for (i = 0; i < file.length; i++) {
			$scope.countries.push(file[i].getElementsByTagName("Name")[0].childNodes[0].nodeValue) ;
	}

	$scope.addMyCat = function(category) {
		$scope.myCat.push(category);
	}

//	$scope.items = [1,2,3,4,5];
  $scope.selected = [];

  $scope.toggle = function (item, list) {
		var idx = list.indexOf(item);
		if (idx > -1) {
			list.splice(idx, 1);
		}
		else {
			list.push(item);
		}
	};

  $scope.exists = function (item, list) {
    return list.indexOf(item) > -1;
  };



	
//when we click on the submit:
	$scope.submitForm = function(isValid) {
    // check to make sure the form is completely valid
    if (isValid) {
			console.log('submitForm in from controller..')
		//adding the questions to the user:
			$scope.user.quesID1 = $scope.randomQuestions[0].quesID;
			$scope.user.quesID2 = $scope.randomQuestions[1].quesID;


			//adding the categories to the user:
			$scope.user.categories = [];
			for (i = 0; i < $scope.selected.length; i++) {
				$scope.user.categories[i] = $scope.selected[i];
			}

			$scope.register();
		}
		else{
			alert("Something went wrong - $scope.submitForm");
		}

	};


	$scope.register = function() {
		console.log('register in from controller..')
			IndexService.register($scope.user)
			.then(function (response) {
				if(response === true) {//if we added the user to DB
					$scope.addMyCategoriesToServer();//we add the categories to the user
				}
				else{
						alert("Something went wrong - $scope.register")
				}

		}, function (response) {
				self.getPoint.content = "Something went wrong - $scope.register2!";
		}); 
	};



	//adding the categories to the user:
	$scope.addMyCategoriesToServer = function() {
		console.log('add category in from controller..')
		var promises = [];
		//add each category:
		for (i = 0; i < $scope.selected.length; i++) {
			var promise = IndexService.addCategoriesToUser({username: $scope.user.username, categoryName: $scope.selected[i]})
			promises.push(promise);
		}

		$q.all(promises).then(data => {
			alert("Successfully added user: " + $scope.user.username)
			$location.path('/');
		});
	};



  }]);


