angular.module('songhop.controllers', ['ionic', 'songhop.services'])


/*
Controller for the discover page
*/
.controller('DiscoverCtrl', function($scope, $timeout, $ionicLoading, User, Recommendations) {

	var showLoading = function(){
		$ionicLoading.show({
			template: '<i class="ion-loading-c"></i>',
			noBackdrop: true
		});
	};

	var hideLoading = function(){
		$ionicLoading.hide();
	};
	showLoading();

	

	Recommendations.init().then(function(){
		$scope.currentSong = Recommendations.queue[0];
		return Recommendations.playCurrentSong();	
	})
	.then(function(){
		hideLoading();
		$scope.currentSong.loaded = true;
	});


	$scope.nextAlbumImg = function(){
		if (Recommendations.queue.length > 1) {
			return Recommendations.queue[1].image_large;
		};
		return '';
	};

	$scope.sendFeedback = function(bool){
		
		if (bool){
			User.addSongToFavorite($scope.currentSong)
		};

		$scope.currentSong.rated = bool;
		$scope.currentSong.hide = true;

		Recommendations.getNextSong();
		
		$timeout(function() {
	       $scope.currentSong = Recommendations.queue[0];
	       $scope.currentSong.loaded = false;
	    	Recommendations.playCurrentSong().then(function(){
			$scope.currentSong.loaded = true;
		});
	    }, 250);
		
		
	};
})


/*
Controller for the favorites page
*/
.controller('FavoritesCtrl', function($scope, $location, User, Auth) {
	$scope.favorites = User.favorites;

	$scope.removeSong = function(song, index){
		User.removeFromFavorite(song,index);
	};

	$scope.logout= function(){
		Auth.$unauth();
		$location.path('/login');
		location.reload();
	};
})


/*
Controller for our tab bar
*/
.controller('TabsCtrl', function($scope, $location, User, Recommendations) {

	$scope.enteringToFavorite = function(){
		Recommendations.haltAudio();
	};

	$scope.leavingFavorites = function(){
		Recommendations.init();
		User.newFavorites = 0;	
	};

	$scope.favCount = function(){
		return User.favoriteCount();
	};;
})
.controller('AuthCtrl',function(Auth, User, $scope, $location, $ionicViewService){

	$scope.user = {
		email:"",
		password:''
	};
	
	$scope.register = function(){
		Auth.$createUser($scope.user).then(function(auth){
			$scope.login();
		},function(error){
			$scope.error = error;
			$location.path("/login")
		});
	};	

	$scope.login = function(){
		User.userDetails = $scope.user;
		Auth.$authWithPassword($scope.user).then(function(auth){
			$location.path("/tab/discover");
			$ionicViewService.nextViewOptions({
			    disableAnimate: true,
			    disableBack: true
			});
		},function(error){
			$scope.error = error;
			$location.path("/login")
		});
	};

	$scope.goToLogin  = function(){
		$location.path("/login")
	};

	$scope.goToSignUp  = function(){
		$location.path("/signup")
	};


})
.controller('LocationCtrl',function($scope, Auth, $cordovaGeolocation, $location){
	 var options = {timeout: 10000, enableHighAccuracy: true};
 
	  $cordovaGeolocation.getCurrentPosition(options).then(function(position){
	 
	    var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
	 
	    var mapOptions = {
	      center: latLng,
	      zoom: 15,
	      mapTypeId: google.maps.MapTypeId.ROADMAP
	    };
	 
	    $scope.map = new google.maps.Map(document.getElementById("map"), mapOptions);
	 
	  }, function(error){
	    console.log("Could not get location");
	  });

	  $scope.logout = function()
	  {
	  	 Auth.$unauth();
	  	 $location.path('/login');
	  	 location.reload();
	  };
});

