define(['js/module.js'], function (controllers) {
    controllers.controller('tjsaddressController', ['$scope', '$rootScope', '$filter', '$state', 'resourceService', '$timeout', '$location', '$anchorScroll', '$stateParams', function ($scope, $rootScope, $filter, $state, resourceService, $timeout, $location, $anchorScroll, $stateParams) {
        $scope.wap = $stateParams.wap;
        $scope.userOBJ = $filter('isRegister')();
        $scope.user = $scope.userOBJ.user.member;
        if ($scope.userOBJ.register) {
            $scope.investId = $stateParams.investId;
            // $scope.hasaddress = false;
            resourceService.queryPost($scope, $filter('getUrl')('tjs获取地址'), {
                uid: $scope.user.uid,
                prizeType: $stateParams.type
            }, '投即送获取收货地址');
        } else {
            $state.go('dl', { returnurl: 'mytjs' });
            return;
        };
        if ($stateParams.type == '1') {
            $rootScope.title = $scope.title = '填写号码';
        }
        else{
            $rootScope.title = $scope.title = '填写地址';
        }
        $scope.type = parseInt($stateParams.type);
        $scope.data = {};
        $scope.data.uid = $scope.userOBJ.user.member.uid;
        $scope.data.investId = $scope.investId;
        $scope.saveAddress = function (tegForm) {
            if ($scope.type == 1) {
                if (!tegForm.phone.$error.required && !tegForm.phone.$error.minlength && !tegForm.phone.$error.pattern) {
                    resourceService.queryPost($scope, $filter('getUrl')('tjs添加地址'), $scope.data , '投即送添加收货地址');
                }
                else {
                    $rootScope.errorText = '请填写有效手机号码';
                    $rootScope.maskError = true;
                }
            }
            else {
                if (!tegForm.name.$error.required) {
                    if (!tegForm.phone.$error.required && !tegForm.phone.$error.minlength && !tegForm.phone.$error.pattern) {
                        if (!tegForm.address.$error.required && !tegForm.address.$error.minlength) {
                            // if ($scope.hasaddress == true) {
                            //     resourceService.queryPost($scope, $filter('getUrl')('tjs修改地址'), {
                            //         uid: $scope.userOBJ.user.member.uid,
                            //         name: $scope.name,
                            //         address: $scope.address,
                            //         phone: $scope.phone
                            //     }, '投即送修改收货地址');
                            // }
                            // else {
                            resourceService.queryPost($scope, $filter('getUrl')('tjs添加地址'), $scope.data , '投即送添加收货地址');
                            // }
                        }
                        else {
                            $rootScope.errorText = '请正确填写有效地址';
                            $rootScope.maskError = true;
                        }
                    }
                    else {
                        $rootScope.errorText = '请填写有效手机号码';
                        $rootScope.maskError = true;
                    }
                }
                else {
                    $rootScope.errorText = '请填写姓名';
                    $rootScope.maskError = true;
                }
            }
        }
        $scope.$on('resourceService.QUERY_POST_MYEVENT', function (event, data, type) {
            switch (type) {
                case '投即送获取收货地址':
                    if (data.success) {
                        if (data.map.jsMemberInfo) {
                            // $scope.hasaddress = true;
                            if($scope.type==1){
                                if(data.map.jsMemberInfo.phone){
                                    $scope.data.phone = data.map.jsMemberInfo.phone;
                                }
                            }
                            else{
                                if(data.map.jsMemberInfo.phone){
                                    $scope.data.phone = data.map.jsMemberInfo.phone;
                                }
                                if(data.map.jsMemberInfo.address){
                                    $scope.data.address = data.map.jsMemberInfo.address;
                                }
                                if(data.map.jsMemberInfo.name){
                                    $scope.data.name = data.map.jsMemberInfo.name;
                                }
                            }
                        }
                    } else {
                        $filter('服务器信息')(data.errorCode, $scope, 'y');
                    }
                    break;
                case '投即送添加收货地址':
                    if (data.success) {
                        $state.go('mytjs', { wap: true });
                    } else {
                        $filter('服务器信息')(data.errorCode, $scope, 'y');
                    }
                    break;
                case '投即送修改收货地址':
                    if (data.success) {
                        $state.go('mytjs', { wap: true });
                    } else {
                        $filter('服务器信息')(data.errorCode, $scope, 'y');
                    }
                    break;
            }
        })
    }])
})
