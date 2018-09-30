define(['jweixin', 'js/module.js', 'ngdialog', 'framework/jquery-asPieProgress.js', 'gagaka', 'radialIndicator'], function (wx, controllers, ngdialog, k, LuckyCard) {
    controllers.controller('controllerCpList', function ($scope, $rootScope, resourceService, $filter, $state, $localStorage, $anchorScroll, isWeixin, $timeout) {
    	/*初始菜单设置  1：首页  2：我要投资  3：我的账户  4：更多*/
        $localStorage.activeMenu = 2;
        $rootScope.title = "我要投资";
        delete $localStorage.coupon;
        delete $localStorage.cpCoupon;
        $filter('isPath')('main.bankBillList');
        var uid, userphone = '';
        if ($filter('isRegister')().user.member) {
            uid = $filter('isRegister')().user.member.uid;
            userphone = '&recommCode=' + $filter('isRegister')().user.member.mobilephone;
            $scope.eggMobilePhone = $filter('isRegister')().user.member.mobilephone;
            $scope.user = $filter('isRegister')().user.member;
        }
        var isLoad = true;
        var pageOn = 1;
        $scope.iszadan = true;
        $scope.cpList = [];
        $scope.cpList = [];
        $scope.eggs = {};
        $scope.type = 2;

        var objs = {};
        if (uid) { objs.uid = uid; }
        objs.type = $scope.type;
        resourceService.queryPost($scope, $filter('getUrl')('cplist'), {status:5,pageSize:30,type:2, productUseType: 0}, { name: '产品列表' });
        resourceService.queryPost($scope, $filter('getUrl')('cplist'), {status:5,pageSize:30,type:1}, { name: '抽奖活动产品列表' });
        $scope.loadMore = function (item) {
            if (item.id == $scope.cpList[$scope.cpList.length - 1].id) {
                if (isLoad) {
                    if (pageOn != $scope.page.pageOn) {
                        var obj = {
                            pageOn: pageOn,
                            pageSize: 10
                        };
                        obj.status = 5;
                        resourceService.queryPost($scope, $filter('getUrl')('cplist'), obj, { name: '产品列表' });
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

        // 投即送添加判断是投即送标还是其他
        // $scope.todetail = function (cp) {
        //     if (!cp.prizeId) {
        //         $state.go('cpDetail', { pid: cp.id });
        //     }
        //     else {
        //         $state.go('tjsdetail', { pid: cp.id, wap: true });
        //     }
        // }

        $scope.$on('resourceService.QUERY_POST_MYEVENT', function (event, data, eObj) {
            switch (eObj.name) {
                case '产品列表':
                    $scope.cp = data.map;
                    $scope.activityProduct = data.map.activityProduct;
                    $scope.cpList = data.map.page.rows;
                    if(data.map.pageJHS){
                        $scope.jhsList = data.map.pageJHS.rows;
                    }
                    // $scope.page = data.map.page;
                    // if (pageOn == $scope.page.pageOn) {
                    //     isLoad = true;
                    // }
                    // if (data.map.page.pageOn <= data.map.page.totalPage) {
                    //     pageOn = $scope.page.pageOn + 1;
                    //     for (var i = 0; i < data.map.page.rows.length; i++) {
                    //         $scope.cpList.push(data.map.page.rows[i]);
                    //     }
                    // } else {
                    //     isLoad = false;
                    // }
                    break;
                case '抽奖活动产品列表':
                    // $scope.cp = data.map;
                    // $scope.activityProduct = data.map.activityProduct;
                    $scope.cjhdList = data.map.page.rows;
                    if(data.map.pageJHS){
                        $scope.jhsList = data.map.pageJHS.rows;
                    }
                    break;
                case '砸蛋':
                    if (data.success) {
                        $scope.eggs.context.siblings('.chuizi').addClass('za');
                        setTimeout(function () {
                            $('.zjd').show();
                            $('.zjd-box1').show();
                            localStorage.sharezjd = true;
                            $scope.$apply(function () {
                                $scope.eggs.obj.isEgg = 2;
                                $scope.eggs.obj.maxActivityCoupon = data.map.newActivityCoupon.raisedRates;
                                $scope.iszadan = true;
                                $scope.eggs.context.siblings('.chuizi').removeClass('za');
                            })

                        }, 1000);
                        $scope.eggs.oldActivityCoupon = data.map.newActivityCoupon;
                    }
                    break;
                case '第二次砸蛋':
                    if (data.success) {
                        $scope.eggs.context.siblings('.chuizi').addClass('za');
                        $scope.eggs.oldActivityCoupon = data.map.oldActivityCoupon;
                        $scope.eggs.newActivityCoupon = data.map.newActivityCoupon;
                        setTimeout(function () {
                            $('.zjd-box4').show().siblings().hide();
                            $scope.iszadan = true;
                            $scope.eggs.context.siblings('.chuizi').removeClass('za');
                        }, 1000);
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
        $scope.zaEgg = function (e, item) {
            e.stopPropagation();
            $scope.eggs.id = item.id;
            $scope.eggs.context = $(e.currentTarget);
            if (item.isEgg == 1 && $scope.iszadan) {
                $scope.iszadan = false;
                $scope.eggs.obj = item;
                resourceService.queryPost($scope, $filter('getUrl')('zadan'), { uid: uid, id: item.id }, { name: '砸蛋' });
            } else if (item.isEgg != 1) {
                $state.go('cpDetail', { pid: item.id });
            }
        };
        $scope.share = function (e) {
            if (isWeixin()) {
                $('.zjd-box2').show();
            } else {
                $('.zjd-boxpc').show().siblings().hide();
                $scope.width = $('.zjd-boxpc').find('.erweima').children().width() - 20;
                $('.zjd-boxpc').find('canvas').css({ left: 10, bottom: 10 });
                $scope.finishsaoma = true;
                $timeout(function () { $scope.finishsaoma = false; }, 5000);
            }
        };
        $scope.finishshare = function () {
            $('.zjd-box3').show().siblings().hide(); localStorage.sharezjd = false;
        }
        $scope.zajindan = function (e) {
            $scope.eggs.context = $(e.currentTarget);
            if ($scope.iszadan) {
                resourceService.queryPost($scope, $filter('getUrl')('zadan'), { uid: uid, id: $scope.eggs.id }, { name: '第二次砸蛋' });
            }
        };
        $scope.closethis = function (e) {
            $(e.currentTarget).hide();
        }
        $scope.goinvestment = function () {
            var obj = {};
            obj.pid = $scope.eggs.id;
            resourceService.queryPost($scope, $filter('getUrl')('cpDetail'), obj, { name: 'goinvestment' });
        }
        $scope.cancelza = function (e) {
            e.stopPropagation();
        };
        $scope.closeEgg = function () {
            $('.zjd').hide();
            $('.zjd').children().hide();
        };
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

    /*刮刮卡*/
    controllers.controller('testGGKCtrl'
        , ['$scope', '$rootScope'
            , 'resourceService'
            , '$filter'
            , '$state'
            , '$localStorage'
            , '$anchorScroll'
            , function ($scope, $rootScope, resourceService, $filter, $state, $localStorage, $anchorScroll) {
                $rootScope.title = "guaguaka";
                LuckyCard.case({
                    ratio: .1,
                    // coverImg:'images/activity/act-rule.png'
                    coverImg: 'images/ggk/gg.png'
                }, function () {
                    // alert('至于你信不信，我反正不信！');
                    this.clearCover();
                });

                resourceService.queryPost($scope, $filter('getUrl')('cplist'), {}, { name: '产品列表' });
                $scope.$on('resourceService.QUERY_POST_MYEVENT', function (event, data, eObj) {
                    switch (eObj.name) {
                        case '产品列表':
                            $scope.jl = "$1000家园";
                            break;
                    };
                });
            }
        ])
})

