define(['jweixin', 'js/module.js', 'jquery', 'ngdialog', 'SHR256'], function (wx, controllers, $, ngdialog, SHR256, weixin) {
    controllers.controller('newYearWController', ['$scope', '$rootScope', 'resourceService', '$filter', '$state', 'ngDialog', '$location', 'md5', '$localStorage', '$stateParams', 'isWeixin', function ($scope, $rootScope, resourceService, $filter, $state, ngDialog, $location, md5, $localStorage, $stateParams, isWeixin) {
        $filter('isPath')('newYear2018');
        $rootScope.title = '2018开福袋';
        $scope.login = {};
        $scope.isLogin = $filter('isRegister')().register;
        $scope.isShow = false;

        var objData = {};
        /*var userObj = {
            uid : $rootScope.getUrlParam('uid'),
            token : $rootScope.getUrlParam('token')
        }*/
        if($rootScope.getUrlParam('source')) {
            $('.newYear2018').removeClass('headerTop');
            $scope.fromNative = true;
        };
        if($rootScope.fromNative) {
            $('.newYear2018').removeClass('headerTop');
            objData.uid = $rootScope.getUrlParam('uid');
            objData.token = $rootScope.getUrlParam('token');
            if (objData.uid) {
                $scope.isShow = true;
            }
        } else{
            if($scope.isLogin) {
                objData.uid = $filter('isRegister')().user.member.uid;
            }
        }

        // 13号之后元旦下线
        var year =  new Date().getFullYear();
        var month = new Date().getMonth()+1;
        var day =  new Date().getDate();
        var _today = ''+ year +''+ month +'' + day;
        if(_today >= '2018113') {
            $('.deline').css('display','block');
        } else {
            $('.deline').css('display','none');
        }

        $scope.toLogin = function () {
            if($rootScope.fromNative) {
                document.location='hushentologin:';
            } else {
                $state.go('dl',{returnurl: 'newYear2018'});
            }
        };
        $scope.toMyCoupon = function () {
            if($rootScope.fromNative) {
                if (objData.uid && objData.token){
                    document.location='hushenlicaiyouhuiquan:';
                } else {
                    document.location='hushentologin:';
                }
            } else {
                if ($scope.isLogin) {
                    $state.go('myCoupon');
                } else {
                    $state.go('dl',{returnurl: 'newYear2018'});
                }
            }
            ngDialog.closeAll();
        };
        $scope.toDetail = function () {
            if($rootScope.fromNative) {
                document.location='hushenlist:';
            } else {
                $state.go('main.bankBillList');
            }
            ngDialog.closeAll();
        };
        $scope.openFu = function () {
            if($rootScope.fromNative) {
                if(objData.uid && objData.token) {
                    if($scope.chanceNum){
                        resourceService.queryPost($scope, $filter('getUrl')('福袋抽奖'),objData, { name: '福袋抽奖' });

                    } else {
                        $filter('元旦奖品无')($scope);
                    }
                } else {
                    document.location='hushentologin:';
                }
            } else {
                if ($scope.isLogin) {
                    if($scope.chanceNum){
                        // $filter('元旦奖品弹窗')($scope);
                        resourceService.queryPost($scope, $filter('getUrl')('福袋抽奖'),objData, { name: '福袋抽奖' });
                    } else {
                        $filter('元旦奖品无')($scope);
                    }
                } else {
                    $state.go('dl',{returnurl: 'newYear2018'});
                }
            }
        };
        if ($scope.isLogin || (objData.uid && objData.token)) {
            resourceService.queryPost($scope, $filter('getUrl')('福袋每日机会判断'),objData, { name: '福袋每日机会判断' });
        }
       /* $scope.$watch('$scope.chanceNum',function(newValue){
            $scope.chanceNum = newValue;
        });*/
        // 分享
        $scope.share = function() {
            if (isWeixin()) {
                $('.activity-tjs-boxweixin').fadeIn(200);
            } else {
                $('.activity-tjs-boxh5').fadeIn(200);
            }
        };
        $scope.copyShare = function() {
            var e = document.getElementById("shareurl"); //对象是contents
            e.select(); //选择对象
            document.execCommand("Copy");
            $scope.isCopy = true;
            if (IsPC()) {
                $scope.isCopytext = '链接已复制';
            } else {
                $scope.isCopytext = '长按文字全选复制链接';
            }
        };
        $scope.closeshare = function() {
            $('.activity-tjs-boxh5').fadeOut(200);
        }
        $scope.toback = function() {
            $filter('跳回上一页')(2);
        };
        $scope.default = function(e) {
            e.stopPropagation();
        }
        $scope.closeshareweixin = function() {
            $('.activity-tjs-boxweixin').fadeOut(200);
        };

        var $table = $(".massage .getRed table");
        $scope.$on('resourceService.QUERY_POST_MYEVENT', function (event, data, type) {
            switch (type.name) {
                case '新年活动人数':
                    $scope.peopleList = data.map.list;
                    $scope.peopleTotle = data.map.size;
                    if ($scope.peopleList.length > 2) {
                        setInterval(function() {
                            $table.animate({'margin-top':'-3.3rem'},500,function() {
                                $table.find('tr').eq(0).appendTo($table);
                                $table.css('margin-top',0);
                            })
                        },5000);
                    }
                    break;
                case '福袋抽奖':
                    // $scope.cjhd = data.map.list;
                    $scope.drAward = data.map.drAwardMemberLog.drAward;
                    $filter('元旦奖品弹窗')($scope);
                    $scope.chanceNum = 0;
                    resourceService.queryPost($scope, $filter('getUrl')('福袋活动参与人'),{pageOn:1,pageSize:10}, { name: '新年活动人数' });
                    break;
                case '福袋每日机会判断':
                    $scope.chanceNum = data.map.opptunity;
                    break;
            };
        });
        resourceService.queryPost($scope, $filter('getUrl')('福袋活动参与人'),{pageOn:1,pageSize:10}, { name: '新年活动人数' });
    }])
})