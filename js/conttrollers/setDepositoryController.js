define(['js/module.js', 'jquery', 'ngdialog'], function (controllers, $, ngdialog) {
    controllers.controller('setDepositoryController', function ($scope, resourceService, $filter, $http, $state, $rootScope, $localStorage, ngDialog, $stateParams, postcallService) {
        $rootScope.title = "存管账户";
        if($stateParams.wap){
            $scope.wap = $stateParams.wap;
            var user = $filter('isRegister')();
            $filter('isPath')('setDepository');
            $scope.userForm = {};
            $scope.userForm.uid = user.user.member.uid;
            $scope.phone = user.user.member.mobilephone;
        }
        else{
            $scope.userForm = {};
            $scope.userForm.uid = $stateParams.uid;
            $scope.userForm.token = $stateParams.token;
            $scope.userForm.channel = $stateParams.channel;
            $scope.userForm.version = $stateParams.version;
            $scope.phone = $stateParams.phone;
        }
        resourceService.queryPost($scope, $filter('getUrl')('我的信息'), {
            uid: $scope.userForm.uid,
            token: $scope.userForm.token,
            channel: $scope.userForm.channel,
            version: $scope.userForm.version
        }, {name:'我的信息'});
        $scope.$on('resourceService.QUERY_POST_MYEVENT', function (event, data, type) {
            switch (type.name) {
                case '存管开户':
                    if (data.success) {
                        postcallService(data.map.fuiouUrl,data.map.signature);
                    } 
                    else{
                        $rootScope.errorText = data.errorMsg;
                        $rootScope.maskError = true;
                    }
                    break;
                case '我的信息':
                    if (data.success) {
                        $scope.userData = data.map;
                        $scope.userForm.realName = data.map.realName;
                        $scope.userForm.idCards = data.map.idCards;
                    }
                    break;
            };
        });
        $scope.toback = function () {
            $filter('跳回上一页')(2);
        };
        $scope.onClick = function () {
            ngDialog.closeAll();
        };
        $scope.submit = function (tegForm) {
            // $scope.userForm.checkbox = true;
            if (tegForm.$valid) {
                resourceService.queryPost($scope, $filter('getUrl')('存管开户'), $scope.userForm, { name: '存管开户', tegForm: tegForm });
            } else {
                $rootScope.errorText = '请正确填写以上信息';
                $rootScope.maskError = true;
            }
        }
    })
})
