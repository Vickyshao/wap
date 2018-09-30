define(['js/module.js'], function(controllers) {
    controllers.controller('tyjSuccessController', ['$scope', '$rootScope', '$filter', '$state','$stateParams', 'resourceService','$localStorage', function($scope, $rootScope, $filter, $state,$stateParams, resourceService,$localStorage) {
        $rootScope.title = "投资成功";
        document.getElementsByTagName('html')[0].scrollTop = 0;
        document.getElementsByTagName('body')[0].scrollTop = 0;
        $scope.toback=function () {
            $filter('跳回上一页')();
        };
        $scope.data={};
        $scope.user = $filter('isRegister')().user.member;
        if(!$scope.user){$state.go('dl');return;}
        if($localStorage.tyjSuccessData){
            $scope.data=$localStorage.tyjSuccessData;
        }
        delete $localStorage.tyjSuccessData;

        if($stateParams.dsEcType == 1) {
            $scope.dsEcType = true;
        } else if($stateParams.dsEcType == 2){
            $scope.dsEcType = false;
        }

    }]);
    controllers.controller('eleStrategyCtrl',['$scope', '$rootScope', '$filter', '$state', 'resourceService','$localStorage', function($scope, $rootScope, $filter, $state, resourceService,$localStorage) {
        $rootScope.title = "活动攻略";
        document.getElementsByTagName('html')[0].scrollTop = 0;
        document.getElementsByTagName('body')[0].scrollTop = 0;
        $scope.toback=function () {
            $filter('跳回上一页')();
        };
        if($rootScope.fromNative) {
            $('.topbox').removeClass('headerTop');
        }
    }]);
    controllers.controller('newYInvestSucCtrl',['$scope', '$rootScope', '$filter', '$state', 'resourceService','$stateParams','$localStorage', function($scope, $rootScope, $filter, $state, resourceService,$stateParams,$localStorage) {
        $rootScope.title = "";
        document.getElementsByTagName('html')[0].scrollTop = 0;
        document.getElementsByTagName('body')[0].scrollTop = 0;
        $scope.user = $filter('isRegister')().user.member;
        $scope.toback=function () {
            $filter('跳回上一页')();
        };
        if($rootScope.fromNative) {
            $('.tyjSuccess').removeClass('headerTop');
            $scope.investAmount = $stateParams.investAmount;
        } else {
            if($localStorage.successData){
                $scope.successData=$localStorage.successData;
                $scope.investAmount = $scope.successData.investAmount;
            }
            delete $localStorage.successData;
        }

        $scope.toMyInvest = function () {
            if($rootScope.fromNative) {
                document.location='hushentomyinvest:';
            } else {
                $state.go('myInvest');
            }
        };
        $scope.toChunJieAct = function () {
            if($rootScope.fromNative) {
                document.location='hushentochunjieactivity:';
            } else {
                $state.go('chunjie2018',{uid: $scope.user.uid});
            }
        }
    }]);
})
