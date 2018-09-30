/**
 * Created by Eva on 2017/10/25.
 */
define(['jweixin', 'js/module.js', 'jquery', 'ngdialog', 'SHR256'],function (wx, controllers, $, ngdialog, SHR256, weixin) {
    controllers.controller('reimburseCtrl',['$scope', '$rootScope', 'resourceService', '$filter', '$state', 'ngDialog', '$location', 'md5', '$localStorage', '$stateParams', function ($scope, $rootScope, resourceService, $filter, $state, ngDialog, $location, md5, $localStorage, $stateParams) {
        $filter('isPath')('reimburse');
        document.getElementsByTagName('html')[0].scrollTop = 0;
        document.getElementsByTagName('body')[0].scrollTop = 0;
        $rootScope.title = '我要报销';
        $scope.user = $filter('isRegister')().user;
        // 如果用户未登录，返回登录页
        if(!$rootScope.fromNative) {
            if(!$scope.user.member) {
                $state.go('dl');
            }
        }
        $scope.toback=function () {
            $localStorage.pathUrl.pop();
            $filter('跳回上一页')();
        };
        if($rootScope.fromNative) {
            $('.reimburse').removeClass('headerTop');
        }

        // 去报销
        $scope.toReimburse = function () {
            if($rootScope.fromNative) {
                document.location = "hushentoreimburse:";
            } else {
                $state.go('staging');
            }
        }
        // 去提现
        $scope.toWithdraw = function () {
            if($rootScope.fromNative) {
                document.location = "hushentowithdraw:";
            } else {
                $state.go('getCash');
            }
        }


        var obj = {};
        // 分平台传UID
        if($rootScope.fromNative) {
            obj.token = $rootScope.getUrlParam('token');
            obj.uid = $rootScope.getUrlParam('uid');
        } else {
            if ($scope.user) {
                obj.uid = $scope.user.member.uid;
            }
        }
        resourceService.queryPost($scope, $filter('getUrl')('我要报销'), obj , { name: 'reimburse'});
        $scope.$on('resourceService.QUERY_POST_MYEVENT',function (event, data,type) {
            switch (type.name) {
                case 'reimburse':
                    if(data.success) {
                        $scope.reimburse = data.map;
                        $scope.isProcessing = data.map.isProcessing;
                        $scope.isUserCarried = data.map.isUserCarried;
                        $scope.type =  $scope.reimburse.type;
                    } else {
                        $state.go('main.home');
                    }
                    break;
                }
            }
        )



    }]);
})