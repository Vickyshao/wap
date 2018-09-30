define(['js/module.js'], function(controllers) {
    controllers.controller('eggSuccessCtrl', ['$scope', '$rootScope', '$filter', '$state','$stateParams', 'resourceService','$localStorage', function($scope, $rootScope, $filter, $state,$stateParams, resourceService,$localStorage) {
        $rootScope.title = "投资成功";
        document.getElementsByTagName('html')[0].scrollTop = 0;
        document.getElementsByTagName('body')[0].scrollTop = 0;
        $scope.data={};
        $scope.go= false;
        $scope.toback=function () {
            $filter('跳回上一页')();
        };
        $scope.toEgg =function () {
            $state.go('dropEgg',{allowDL:'false',toFrom:'egg'})
        };
        $scope.user = $filter('isRegister')().user.member;
        if(!$scope.user){$state.go('dl');return;}
        if($localStorage.successData){
            $scope.data=$localStorage.successData;
        }
        delete $localStorage.successData;
        delete $localStorage.drAwardMemberLog;
    }]);
})
