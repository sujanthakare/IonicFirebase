angular.module('songhop.services', [])
	.factory('User',function(Auth){

		var user = {
			favorites:[],
			newFavorites:0,
			userdetails: { }
		};

		user.addSongToFavorite = function(song){
			if (!song) { return false };
			user.favorites.unshift(song);
			user.newFavorites++;
		}

		user.removeFromFavorite = function(song, index){
			if (!song) { return false};
			user.favorites.splice(index, 1);
		};

		user.favoriteCount = function(){
			return user.newFavorites;
		};

		user.registerUser = function(userdetails){
			return	Auth.$createUser(user);
		};	

		user.authenticateUser = function(userdetails){
			return Auth.$authWithPassword(user);
		};

		user.destroySession = function(userdetails){
			 Auth.$unauth(userdetails);
			 Auth = null;
		};

		return user;
	})

	.factory('Auth',function($firebaseAuth, FirebaseUrl){
		var ref = new Firebase(FirebaseUrl);
		var auth = $firebaseAuth(ref);
		return auth;
	})


	.factory('Recommendations',function($http, $q, SERVER){

		var r = {
			queue:[]		
		};

		var media;

		r.init = function(){
			if (r.queue.length === 0)
			{
				return r.getNextSongs();
			}
			else
			{
				media.play()
			}
		};
		
		r.getNextSongs = function()
		{
			return $http({
				method:'GET',
				url:SERVER.url + '/recommendations'
			}).success(function(data){
				r.queue = r.queue.concat(data);
			});
		};

		r.getNextSong = function(){
			r.queue.shift();
			r.haltAudio();
			if (r.queue.length <= 3) {
				r.getNextSongs();
			};
		};

		r.playCurrentSong = function(){
			var defer = $q.defer();
			media = new Audio(r.queue[0].preview_url);

			media.addEventListener('loadeddata',function(){
				defer.resolve();
			});

			media.play();

			return defer.promise;
		};

		r.haltAudio = function(){
			if(media) media.pause();
		}

		return r;

	});
