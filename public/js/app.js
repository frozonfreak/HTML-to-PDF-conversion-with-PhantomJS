var smApp = angular.module('smApp',['ui.router']);

smApp.config(function($stateProvider, $urlRouterProvider) {

  // Now set up the states
  $stateProvider
    .state('home', {
      url: "/",
      templateUrl: "partials/home.html",
      controller: "appController",
    })
    .state('404', {
      url: "/404",
      templateUrl: "404.html",
      controller: 'app404Controller',
    })
    // For any unmatched url, redirect to /state1
     $urlRouterProvider.otherwise("/");

});
//Handle all HTTP calls to server
smApp.factory('appSession', function($http){
    return {
        convertToPDF: function(URLText) {
            return $http.post('/services', { 
                type        : 'convertToPDF',
                URLText     : URLText
            });
        }
    }
});


//controller
smApp.controller('appController', function($scope, $location, appSession){
	$scope.URLText;
        $scope.showDownloadLink = false;
        $scope.showProcessingIcon = false;
        $scope.showErrorConsole = false;
        $scope.ErrorMessage='';
        $scope.displaySuccess = function(data, status){
            $scope.showProcessingIcon = false;
            
            if(data['status'] == 1){
              $scope.showDownloadLink = true;
            }
            else{
              $scope.showErrorConsole = true;
              $scope.ErrorMessage = data['status'];
            }
            console.log(data);
        };
        $scope.displayError = function(data, status){
            $scope.showProcessingIcon = false;
            console.log(data);
            $scope.showErrorConsole = true;
            $scope.ErrorMessage = data;
        };

        $scope.convertPDF = function(){
        
          $scope.showProcessingIcon = true;
          appSession.convertToPDF($scope.URLText).success($scope.displaySuccess).error($scope.displayError);
        };
       
          //Initializer
        init();
        function init(){
            console.log($location.path());
                
        };
	
});

//404 Controller
smApp.controller('app404Controller', function($scope){

});
