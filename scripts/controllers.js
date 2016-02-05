(function () {

'use strict';


var lorem = "Issue description or pitch. Phasellus quis ligula ut enim pretium ornare nec nec est. Vestibulum eget ipsum fringilla, scelerisque velit vel, cursus eros. Curabitur ullamcorper interdum sapien quis pretium. In eget tristique massa. In lacinia risus sed ullamcorper bibendum. Sed consectetur nec sem at venenatis. Integer sed lacinia risus, eu malesuada lectus. In dignissim congue massa, eu eleifend dui tristique maximus. Sed vehicula ante ut mauris vehicula, non laoreet arcu dapibus.";

angular.module('myApp.controllers', [])
	.controller('LandingController', ['$scope', '$http', '$location',
		function($scope, $http, $location) {
		}
	])
	.controller('OverViewController', ['$scope', '$http', '$location',
		function($scope, $http, $location) {
			$scope.foo = "hello";

		var container = document.querySelector('#container');
	      var msnry = new Masonry( "#container", {
	        // options
	        columnWidth: 140,
	        itemSelector: '.item'
	      });

			$scope.viewDetail = function (id) {
				$location.url('/detail/' + id);
			}

			$http
				.get('/api/cards')
				.then(function(data) {
					if(data.status === 200 && data.data)
						$scope.cards = data.data.map(function(item){
							return {
								title: item.name,
								author: 'Jean-Pierre',
								description: item.description,
								key: item.key,
								stars: 30,
								upvotes: 14,
								tags: ['climate', 'ebola', 'help'],
								image_url: item.image_url
							}
						});
				});
		}
	])
	.controller('DetailController', ['$scope', '$http', '$location', '$routeParams',
		function($scope, $http, $location, $routeParams) {

			var id = $routeParams.id;

			$scope.card = {}

			$http
				.get('/api/cards/one?id=' + id)
				.then(function(data){
					if(data && data.data.length)
					{
						var card = data.data[0];
						$scope.card = {
							stars: Math.floor(Math.random()*100),
							upvotes: Math.floor(Math.random()*100),
							title: card.name,
							author: 'Jean-Pierre',
							description: card.description,
							tags: ['ebola', 'seirra-leone'],
							level: card.level,
							id: card.key,
							image_url: card.image_url
						};

						// now lets pull children
						$http
							.get('/api/cards/children?id=' + id)
							.then(function(data){
								if(data && data.data.length)
								{
									$scope.children = data.data.map(function(item)
									{
										return {
											key: item.key,
											title: item.name,
											tags: item.tags,
											level: item.level,
											description: item.description,
										}
									});
								}
							});

					};
				});

			$scope.children = [];

			$scope.drillDown = function(id) {
				$location.url('/detail/' + id);
			}

			$scope.doBreakdown = function () {
				$scope.openModal($scope.card.id, $scope.card.level)
			}

			$scope.doStar = function () {
				$scope.card.stars += 1;
			}
		}
	])
	.controller('BreakdownController', ['$scope', '$http', '$location', '$routeParams',
		function($scope, $http, $location, $routeParams) {
			var parent = $routeParams.parent;
			var level = $routeParams.level;

			$scope.card = {
				author: 'You',
				child_of: [parent],
				level: (parseInt(level) + 1)
			};

			$scope.addCard = function() {
				console.log($scope.card);
				$http
					.post('/api/cards/update?level=' + $scope.card.level, $scope.card)
					.then(function(data){
						console.log(data);
						$location.url('/detail/' + data.data.key);
					})
			}
		}
	])
	.controller('RootController', ['$scope', '$http', '$location', '$modal',
		function($scope, $http, $location, $modal) {
			$scope.location = function() {
				return $location.path();
			};

			$scope.openModal = function(key, level) {
				$location.url('/breakdown/' + key + '/' + level);
			}
		}
	])
})();