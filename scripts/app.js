(function () {
'use strict';


// Declare app level module which depends on filters, and services
angular
	.module('myApp', [
		'ngRoute',
		'myApp.filters',
		'myApp.services',
		'myApp.directives',
		'myApp.controllers',
		'ui.bootstrap'
	])

	// allow DI for use in controllers, unit tests
	.constant('_', window._)

	// use in views, ng-repeat="x in _.range(3)"
	.run(function ($rootScope) {
		$rootScope._ = window._;
	})

	.config(['$routeProvider',
		function($routeProvider) {
			$routeProvider
				.when('/landing', {
					templateUrl: 'partials/landing.html',
					controller: 'LandingController'
				})
				.when('/overview', {
					templateUrl: 'partials/overview.html',
					controller: 'OverViewController'
				})
				.when('/detail/:id', {
					templateUrl: 'partials/detail.html',
					controller: 'DetailController'
				})
				.when('/breakdown/:parent/:level', {
					templateUrl: 'partials/Modal.html',
					controller: 'BreakdownController'
				})
				.otherwise({redirectTo: '/landing'});
		}
	]);
})();
