define(['js/module.js'], function (controllers) {
    controllers.controller('myDepositoryController', function ($scope, $rootScope, $filter, $state, resourceService, $stateParams, postcallService) {
        $rootScope.title = "存管账户";
        if($stateParams.wap){
            $scope.wap = $stateParams.wap;
            $filter('isPath')('myDepository');
            $scope.userOBJ = $filter('isRegister')();
            $scope.userForm = {};
            $scope.userForm.uid = $scope.userOBJ.user.member.uid;
        }
        else {
            $scope.userForm = {};
            $scope.userForm.uid = $stateParams.uid;
            $scope.userForm.token = $stateParams.token;
            $scope.userForm.channel = $stateParams.channel;
            $scope.userForm.version = $stateParams.version;
        }
        resourceService.queryPost($scope, $filter('getUrl')('我的存管账户'), $scope.userForm, '我的存管账户');
        $scope.$on('resourceService.QUERY_POST_MYEVENT', function (event, data, type) {
            switch (type) {
                case '我的存管账户':
                    if (data.success) {
                        $scope.user = data.map;
                    } else {
                        $filter('服务器信息')(data.errorCode, $scope, 'y');
                    }
                    break;
                case '重置存管交易密码':
                    if (data.success) {
                        postcallService(data.map.fuiouUrl,data.map.signature);
                    } 
                    else{
                        $rootScope.errorText = data.errorMsg;
                        $rootScope.maskError = true;
                    }
                    break;
            };
        });

        $scope.resetDepPwd = function(){
            $scope.userForm.busi_tp = 3;
            resourceService.queryPost($scope, $filter('getUrl')('重置存管交易密码'), $scope.userForm, '重置存管交易密码');
        }

        $scope.toback = function () {
            $filter('跳回上一页')(2);
        };

        $scope.out = function (argument) {
            switch (argument) {
                case 'out':
                    $filter('清空缓存')();
                    $state.go('main.home');
                    break;
            };
        };
    });
})