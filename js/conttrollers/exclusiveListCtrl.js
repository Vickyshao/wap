define(['jweixin', 'js/module.js', 'ngdialog', 'framework/jquery-asPieProgress.js', 'gagaka', 'radialIndicator'], function (wx, controllers, ngdialog, k, LuckyCard) {
    controllers.controller('exclusiveListCtrl', function ($scope, $rootScope, resourceService, $filter, $state, $localStorage, $anchorScroll, isWeixin, $timeout,ngDialog) {
    	/*初始菜单设置  1：首页  2：我要投资  3：我的账户  4：更多*/
        $localStorage.activeMenu = 5;
        $rootScope.title = "我要投资";
        $rootScope.tip = true;
        delete $localStorage.coupon;
        $filter('isPath')('main.exclusiveList');
        var uid, userphone = '';
        if ($filter('isRegister')().user.member) {
            uid = $filter('isRegister')().user.member.uid;
            userphone = '&recommCode=' + $filter('isRegister')().user.member.mobilephone;
            $scope.eggMobilePhone = $filter('isRegister')().user.member.mobilephone;
            $scope.user = $filter('isRegister')().user.member;
        }

        // 当天首次登录提示专属标不参与其他活动
        var zhuanshueveryday = "'" + new Date().getFullYear() + new Date().getMonth() + new Date().getDate() + "'";
        if(zhuanshueveryday != $localStorage.zhuanshueveryday) {
            $('.exclusive-tips').fadeIn();
            setTimeout(function () {
                $('.exclusive-tips').fadeOut();
            }, 3000);
            $localStorage.zhuanshueveryday = zhuanshueveryday;
        }
        var isLoad = true;
        var pageOn = 1;
        $scope.iszadan = true;
        $scope.cpList = [];
        $scope.cpList = [];
        $scope.eggs = {};
        $scope.type = 2;

        var objs = {
            pageOn: 1,
            pageSize: 30
    };
        if (uid) { objs.uid = uid; }
        objs.type = $scope.type;
        objs.productUseType =2;
        resourceService.queryPost($scope, $filter('getUrl')('cplist'), objs, { name: '产品列表' });
        $scope.loadMore = function (item) {
            if (item.id == $scope.cpList[$scope.cpList.length - 1].id) {
                if (isLoad) {
                    if (pageOn != $scope.page.pageOn) {
                        objs.status = 5;
                        resourceService.queryPost($scope, $filter('getUrl')('cplist'), objs, { name: '产品列表' });
                        isLoad = false;
                    }
                };
            };
        };
        var objuser = {};
        if ($scope.user) { objuser.uid = $scope.user.uid; }
        resourceService.queryPost($scope, $filter('getUrl')('shouYe'),objuser, { name: 'index' });
        $scope.$on('resourceService.QUERY_POST_MYEVENT', function (event, data, eObj) {
            switch (eObj.name) {
                case 'index':
                    $scope.index = data.map;
                    $scope.newHand = data.map.newHand;
                    $scope.newHandInvested = data.map.newHandInvested;
                    if ($scope.index.newHand) {
                        $localStorage.newHand = $scope.index.newHand;
                        $scope.newHand = $scope.index.newHand;
                        $scope.newHandShow = true;

                    } else {
                        $scope.newHandShow = false;
                    }
                    break;
            };
        });
        $scope.$on('resourceService.QUERY_POST_MYEVENT', function (event, data, eObj) {
            switch (eObj.name) {
                case '产品列表':
                    $scope.cp = data.map;
                    $scope.activityProduct = data.map.activityProduct;
                    $scope.cpList = data.map.page.rows;
                    if(data.map.pageJHS){
                        $scope.jhsList = data.map.pageJHS.rows;
                    }
                    break;
                case 'goinvestment':
                    if (data.success) {
                        $localStorage.cp = data.map;
                        $state.go('investment');
                    }
                    break;
            };
        });
        $scope.radius = $('.rem-rule').width();
        // old
        $scope.showList = function (type) {
            if ($scope.type != type) {
                $scope.type = type;
                $scope.cpList = [];
                objs.type = $scope.type;
                resourceService.queryPost($scope, $filter('getUrl')('cplist'), objs, { name: '产品列表' });
            }
        }
        $scope.goinvestment = function () {
            var obj = {};
            obj.pid = $scope.eggs.id;
            resourceService.queryPost($scope, $filter('getUrl')('cpDetail'), obj, { name: 'goinvestment' });
        }
    })
    .directive('progressCircle', function () {
            return {
                restrict: 'A',
                scope: true,
                link: function ($scope, element, attrs) {
                    var config = {
                        radius: ($scope.radius - 8)/2,
                        barWidth: 4,
                        barBgColor: '#EBEBEB',
                        percentage: true,
                        displayNumber: false,
                        roundCorner: true,
                        initValue: 0,
                        interpolate: true,
                        barColor:'#a7dbff', 
                        frameTime: (1000 / attrs.progress)
                    }
                    if (attrs.progress >= 100) {
                        config.initValue = 100;
                        config.barColor = '#D6D6D6';
                    }
                    else if(attrs.progress <= 0) {
                        config.roundCorner = false;
                    }
                    var radialObj = $(element).radialIndicator(config).data('radialIndicator');
                    radialObj.animate(attrs.progress);
                }
            }
        });
})

