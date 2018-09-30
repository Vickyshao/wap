define(['jweixin', 'js/module.js', 'jquery', 'ngdialog', 'SHR256'], function (wx, controllers, $, ngdialog, SHR256, weixin) {
    controllers.controller('tyjRegSuccessController', ['$scope', '$rootScope', 'resourceService', '$filter', '$state', 'ngDialog', '$location', 'md5', '$localStorage', '$stateParams', function ($scope, $rootScope, resourceService, $filter, $state, ngDialog, $location, md5, $localStorage, $stateParams) {
        $rootScope.title = '沪深理财-网贷投资，国企控股平台';
        document.getElementsByTagName('html')[0].scrollTop = 0;
        document.getElementsByTagName('body')[0].scrollTop = 0;
        if($rootScope.fromNative){
            $('.tyjRegSuccess main').css('top','0');
        }
        if($localStorage.webFormPath && $localStorage.webFormPath.toFrom) {
            $scope.isShowUpload = true;
        }

        // 新手专享去注册
        $scope.toZhuce = function () {
            if($rootScope.fromNative) {
                document.location = 'hushenlicaizhuce:';
            } else {
                if ($localStorage.webFormPath && $localStorage.webFormPath.toFrom) {
                    if ($localStorage.webFormPath.toFrom != undefined) {
                        //$scope.login.toFrom = $localStorage.webFormPath.toFrom;
                        $state.go('zhuce',{toFrom: $localStorage.webFormPath.toFrom,source: 'tyjReg'});
                    };
                }else{
                    //从本页面进入注册页面不允许出现已有账号请登录字样
                    $state.go('zhuce',{source: 'tyjReg'});
                }
            }
        };
        $scope.toHome = function () {
            if($rootScope.fromNative) {
                document.location = 'hushenlicaitohome:';
            } else {
                if ($stateParams.returnurl) {
                    $state.go($state.params.returnurl);
                } else {
                    $state.go('main.home');
                }
            }
        };
        $scope.toList = function () {
            if($rootScope.fromNative) {
                document.location = 'hushenlist:';
            } else {
                $state.go('main.bankBillList');
            }
        };
        $scope.tobingCard = function () {
            $scope.returnurl = $stateParams.returnurl?$stateParams.returnurl:'';
            if($rootScope.fromNative) {
                document.location = 'hushenbindcard:';
            } else {
                $state.go('authRecharge',{ returnurl: $scope.returnurl });
            }
        };


        // 跳到首投详情页
        $scope.toCpDetail  =function () {
            if($rootScope.fromNative) {
                var hushendetail = {
                    pid:$scope.newhand.id,
                    ptype:1
                }
                document.location = 'hushendetail:' + angular.toJson(hushendetail);
            } else {
                $state.go('cpDetail', { pid: $scope.newhand.id });
            }
        }

        // 返回首页
        $scope.toHome = function () {
            if($rootScope.fromNative) {
                document.location = 'hushenlicaitohome:';
            } else {
                if ($state.params.returnurl) {
                    $state.go($state.params.returnurl);
                } else {
                    $state.go('main.home');
                }
            }
        }

        var obj = {};
        if ($scope.user) { obj.uid = $scope.user.uid; }

        resourceService.queryPost($scope, $filter('getUrl')('shouYe'), obj, { name: 'index' });
        $scope.$on('resourceService.QUERY_POST_MYEVENT', function (event, data, eObj) {
            switch (eObj.name) {
                case 'index':
                    $scope.index = data.map;
                    $scope.regCount = data.map.regCount;
                    $scope.newhand = data.map.newHand;
                    break;
            };
        });

    }])
})