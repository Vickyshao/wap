define(['js/module.js'], function (controllers) {
    controllers.controller('reminderController', function ($scope, $filter, $rootScope,$stateParams) {
        $rootScope.title = "优惠券温馨提示";
        if($stateParams.wap){
            $scope.wap = $stateParams.wap;
        }
        if($stateParams.platform == 'i' || $stateParams.platform == 'A'){
            $('.common-head').css({'display':'none'});
            $('.reminder main').css({'margin-top': 0});
        }
        $scope.toback = function () {
            $filter('跳回上一页')();
        };
    })
})
