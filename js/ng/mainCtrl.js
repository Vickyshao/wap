var mainModule = angular.module('mainModule', [ 'ngStorage' ]);
mainModule.controller('mainCtrl', [ '$scope', '$rootScope', '$http', '$state', '$stateParams', '$localStorage','$sessionStorage', 'BHserver','resourceService','$filter',function($scope, $rootScope, $http, $state, $stateParams, $localStorage,$sessionStorage, BHserver,resourceService,$filter) {
	
	$scope.version='test 1.0';
	$scope.title=$rootScope.title;
	$scope.roomWorkBox=false;
	$scope.messageMenuBox=false;
	$scope.test = function() {
		var url = "user/toLogin";
		var data = {
			parentFunctionMenu : {
				id : 0
			}
		};
		BHserver.testAjax('authority/toMenuPage', 'post', data);
	};
	$scope.$on('TEST.UPDATA', function(event, Datas) {
		$scope.Datas = Datas;
	});	
	$scope.whiteCollarApartmentName = $localStorage.whiteCollarApartmentName;
	$scope.name = $localStorage.name;
	if($scope.whiteCollarApartmentName==null){
		$scope.messageMenuBox=true;
	}else{$scope.roomWorkBox=true;}
	$scope.relogin=function(){
		$state.go('Login');
	};
	resourceService.getJsonServer($scope,$filter('getJsonPath')('address.json'),{},"省市区地址");
	$scope.$on('resourceService_GET_JSON.MYEVENT', function(event,data,type) {
			$localStorage.address=data.result;
			$localStorage.area = data.result;
	});
}])
.controller('updatePwdCtrl', [ '$scope', '$rootScope', '$http', '$state', '$stateParams', 'BHserver', function($scope, $rootScope, $http, $state, $stateParams, BHserver) {
	$scope.user = {};
	$scope.message={};
	$scope.message.showcloseThisDialog = true;
	$scope.message.errormessage="";
	$scope.updatePwd = function() {
		BHserver.updatePwd('user/updateUserPassword', 'POST', $scope.user);
	};
} ]);

var app = angular.module('fileUpload', [ 'ngFileUpload','ngStorage' ]);

