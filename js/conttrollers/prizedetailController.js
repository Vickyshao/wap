define(['js/module.js'], function(controllers) {
    controllers.controller('prizedetailController', ['$scope', '$rootScope', '$filter', '$state', 'resourceService', '$timeout', '$location', '$anchorScroll', '$stateParams', '$localStorage', function($scope, $rootScope, $filter, $state, resourceService, $timeout, $location, $anchorScroll, $stateParams, $localStorage) {
        $scope.title = '礼品详情';
        $scope.userOBJ = $filter('isRegister')();
        $scope.user = $scope.userOBJ.user.member;
        $scope.pid = $localStorage.cp.info.id;
        $scope.wap = $stateParams.wap;
        $scope.prize = $localStorage.prize;
        $filter('isPath')('prizedetail');
        $scope.toback = function () {
            $filter('跳回上一页')(2);
        };
    }])
})