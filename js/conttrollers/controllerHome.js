/* 
* @Author: lee
* @Date:   2016-01-10 23:29:04
* @Last Modified by:   Ellie
* @Last Modified time: 2018-02-01 16:20:42
*/

'use strict';
define(['js/module.js', 'jquery', 'ngdialog', 'countup', 'waypoints'], function (controllers, $, ngdialog, countup, waypoints) {
    'use strict';
    controllers.controller('pageHomeCtrl', function ($scope, $rootScope,$localStorage,$filter,resourceService) {
        //控制器的具体js
        $rootScope.title = "沪深理财";
        document.getElementsByTagName('html')[0].scrollTop = 0;
        document.getElementsByTagName('body')[0].scrollTop = 0;
        $scope.home = 'main.home';
        if ($localStorage.activeMenu!=undefined) {
        	$scope.activeMenu = $localStorage.activeMenu;
        }
        $scope.actived = function (e) {
            $(e.currentTarget).addClass('current').siblings('.button').removeClass('current');
            $localStorage.activeMenu = $scope.activeMenu = $(e.currentTarget).attr('data-active');
        };
        $scope.isLogin = $filter('isRegister')().register;
        if($scope.isLogin) {
            $rootScope.exclusiveUser = $localStorage.user.member.userType == '1' ? true:false;
            $rootScope.enfuUser = $localStorage.user.member.userType == '2' ? true:false;
        } else {
            $rootScope.exclusiveUser = false;
            $rootScope.enfuUser = false;
        }
        resourceService.queryPost($scope, $filter('getUrl')('pageIcon'), {}, { name: 'pageIcon' });
         $scope.$on('resourceService.QUERY_POST_MYEVENT', function (event, data, eObj) {
            switch (eObj.name) {
                case 'pageIcon':
                    if (data.success) {
                        $scope.isInDoubleEggActivity = data.map.isInDoubleEggActivity;
                    }
                    break;
            };
        });
        $scope.$on('CHANGE_MENU', function () {
            $scope.activeMenu = $localStorage.activeMenu;
        });
    });
    controllers.controller('controllerHome', ['$scope', '$rootScope', 'resourceService', '$filter', '$state', '$localStorage', '$location', '$timeout', 'ngDialog', function ($scope, $rootScope, resourceService, $filter, $state, $localStorage, $location, $timeout, ngDialog) {
    	/*初始菜单设置  1：首页  2：我要投资  3：我的账户  4：更多*/
        document.getElementsByTagName('html')[0].scrollTop = 0;
        document.getElementsByTagName('body')[0].scrollTop = 0;
        $localStorage.activeMenu = 1;
        //控制器的具体js
        //$scope.pageHome=true;
        $(".two").countUp();
        setTimeout(function() {
            $('.two').css('display', 'none');
            $('.special').removeClass('hide');
        }, 1000);
        $filter('isPath')('main.home');
        $scope.loginBox = true;
        $scope.showLogin = false;
        $scope.videoplay = false;
        $scope.active = 2;
        $scope.isLogin = $filter('isRegister')().register;
        $scope.realVerity = false;
        $scope.rongziActStartTime = new Date('2018/02/01 00:00:00').getTime();
        $scope.rongziActEndTime = new Date('2018/02/06 00:00:00').getTime();
        $scope.regLimitTime = new Date('2018/01/31 00:00:00').getTime();
        $scope.isInvestedCommonBidder = false;
        //贴息活动弹窗，每天只弹一次
        var nowDate=new Date().getTime();
        var endDate=new Date('2018/04/30 23:59:59').getTime();
        var year=new Date().getFullYear();
        var month=new Date().getMonth() + 1;
        var day=new Date().getDate();
        if(nowDate<endDate){
            if($rootScope.fromNative) {
                $scope.interestAlertTime=year + "/" + month + "/" + day+ $rootScope.getUrlParam('uid');
                if($localStorage.interestAlertTime){
                    if($scope.interestAlertTime!=$localStorage.interestAlertTime){
                        $filter('首页贴息活动弹窗')($scope);
                        $localStorage.interestAlertTime=$scope.interestAlertTime;
                    }
                }else{
                    $filter('首页贴息活动弹窗')($scope);
                    $localStorage.interestAlertTime=$scope.interestAlertTime;
                }
            } else{
                if($scope.isLogin) {
                    $scope.interestAlertTime=year + "/" + month + "/" + day+ $filter('isRegister')().user.member.uid;
                    if($localStorage.interestAlertTime){
                        if($scope.interestAlertTime!=$localStorage.interestAlertTime){
                            $filter('首页贴息活动弹窗')($scope);
                            $localStorage.interestAlertTime=$scope.interestAlertTime;
                        }
                    }else{
                        $filter('首页贴息活动弹窗')($scope);
                        $localStorage.interestAlertTime=$scope.interestAlertTime;
                    }
                }
            }

        }



        if ($scope.isLogin) {
            $scope.user = $filter('isRegister')().user.member;
            $scope.regDate = $scope.user.regDate;
            $scope.timestamp = (new Date()).valueOf();
            // 融资弹框
            if ($scope.regDate < $scope.regLimitTime && $scope.rongziActStartTime < $scope.timestamp && $scope.timestamp < $scope.rongziActEndTime) {
                $scope.isAlertRongzi = $localStorage.isAlertRongzi == undefined?true : false;
            }
            $scope.realInfo = $scope.user.realVerify == '1' ? $scope.user.realName : $scope.user.mobilephone;
            //   首页暂时不做评测弹窗
            // resourceService.queryPost($scope, $filter('getUrl')('首次评测显示'), {uid: $scope.user.uid}, { name: '首次评测显示' });
        }
        /*console.log( '当前时间：'+new Date($scope.timestamp))
        console.log( '注册时间:'+new Date($scope.regDate))*/
        $scope.newHandShow = true;
        $scope.activeMenu = function () {
            $localStorage.activeMenu = 2;
            $scope.$emit('CHANGE_MENU_STATUS');
        };
        $scope.toLogin = function () {
            $state.go('dl');
        };
        $scope.toCouponList = function () {
            $scope.isAlertRongzi = false;
            $localStorage.isAlertRongzi = false;
            $state.go('myCouponList',{page:3});
        };
        $scope.closerongzi = function () {
            $scope.isAlertRongzi = false;
            $localStorage.isAlertRongzi = false;
        };
        $scope.toWay = function () {
            $state.go('whymeApp');
        };
        $scope.activefn = function (i) {
            $scope.active = i;
        };
        $scope.toRegister = function () {
            if(!$scope.isLogin) {
                // $state.go('zhuce');
                if($localStorage.webFormPath != undefined || $localStorage.webFormPath != null){
                    if ($localStorage.webFormPath.toFrom != undefined) {
                        $state.go('zhuce',{toFrom: $localStorage.webFormPath.toFrom});
                    } else {
                        $state.go('zhuce');
                    }
                }else{
                    $state.go('zhuce');
                }
            }
        };
        $scope.toBindCard = function () {
            if(!$scope.isLogin) {
                $state.go('dl');
            } else if($scope.isLogin && !$scope.realVerity) {
                $state.go('authRecharge');
            } else {
                return false;
            }
        };
        $scope.toFirstInvest = function () {
            if(!$scope.isLogin) {
                $state.go('dl');
            } else if($scope.isLogin && !$scope.isInvestedCommonBidder) {
                $state.go('main.bankBillList');
            } else {
               return false;
            }
        };
        if (localStorage.userid) {
            $scope.phone = localStorage.phone;
            $scope.loginBox = false;
            $scope.showLogin = true;
        }
        if ($location.$$search.toFrom != undefined || $location.$$search.recommCode != undefined || $location.$$search.tid != undefined) {
            $localStorage.webFormPath = $location.$$search;
        };
        if ($localStorage.yuandanIsAlert) {
            $scope.yuandanIsAlert = true;
        } else {
            $scope.yuandanIsAlert = false;
        }
        $scope.reviewEvaluation = function () {
            $state.go('startEvaluation',{fromPage:'ceping'});
            $scope.closeDialog();
        }
        $scope.tomyaccount = function () {
            $state.go('myaccountHome');
        }
        $scope.goyuebiao = function () {
            $state.go("cpDetail", { pid: $scope.index.activity.pid, wap: true });
        };
        // 公告
        resourceService.queryPost($scope, $filter('getUrl')('网站公告'), { proId: 14, limit: 3 }, { name: '公告列表' });
        resourceService.queryPost($scope, $filter('getUrl')('首页统计'), {}, { name: '首页统计' });
        $scope.$on('resourceService.QUERY_POST_MYEVENT', function (event, data, eObj) {
            switch (eObj.name) {
                case 'index':
                    $scope.index = data.map;
                    $scope.banner = data.map.banner;
                    $scope.isAlert = data.map.isAlter;
                    $scope.activityRate = data.map.investSendPrize.activityRate;
                    $scope.minRate = data.map.preferredInvest.minRate;
                    $scope.maxRate = data.map.preferredInvest.maxRate;
                    $scope.minactiverate = parseFloat($scope.minRate) + parseFloat($scope.activityRate);
                    $scope.maxactiverate = parseFloat($scope.maxRate) + parseFloat($scope.activityRate);
                    $scope.isInvestedCommonBidder = $scope.index.isInvestedCommonBidder;
                    $scope.realVerity = $scope.index.realVerity == '1' ? true:false;
                    if ($scope.index.newHand) {
                        $localStorage.newHand = $scope.index.newHand;
                        $scope.newHand = $scope.index.newHand;
                        $scope.newHandShow = true;

                    } else {
                        $scope.newHandShow = false;
                    }
                    var shuangdaneveryday = "'" + new Date().getFullYear() + new Date().getMonth() + new Date().getDate() + "'";
                    var newhandeveryday = "'" + new Date().getFullYear() + new Date().getMonth() + new Date().getDate() + "'";
                    if ($scope.index.activityImgUrl) {
                        if (shuangdaneveryday == $localStorage.shuangdaneveryday) {
                            // $scope.shuangdanBox = false;
                            $scope.yuandanBox = false;
                        }
                        else {
                            // $scope.shuangdanBox = true;
                            $localStorage.shuangdaneveryday = shuangdaneveryday;
                        }
                    }
                    else {
                        // $scope.shuangdanBox = false;
                    }
                    if(!$scope.isLogin) {
                        if(newhandeveryday == $localStorage.newhandeveryday) {
                            $scope.newhandBox = false;
                        } else {
                            $scope.newhandBox = true;
                            $localStorage.newhandeveryday = newhandeveryday;
                        }
                    }

                    // 已登录但是未绑卡
                    if($scope.isLogin ) {
                        $scope.loginClass = 2;
                        $scope.cardClass = 1;
                        if($scope.realVerity) {
                            $scope.cardClass = 2;
                            $scope.vestClass = 1;
                            if($scope.isInvestedCommonBidder) {
                                $scope.vestClass = 2;
                                return false;
                            }
                        } else {
                            $scope.vestClass = 0;
                        }
                    } else {
                        $scope.loginClass = 0;
                        $scope.cardClass = 0;
                        $scope.vestClass = 0;
                    }

                    break;
                case '公告列表':
                    if (data.success) {
                        $scope.gglist = data.map.page.rows.slice(0, 3);
                    }
                    break;
                case '首页统计':
                    if (data.success) {
                        $scope.investCumulative = data.map.investCumulative;
                    }
                    break;
                case '首次评测显示':
                    if (data.success) {
                        $scope.evaluateData= data.map;
                        $scope.evaluateStatus = data.map.show;

                        var evaluateEvery = "'" + new Date().getFullYear() + new Date().getMonth() + new Date().getDate() + "'";
                        if($scope.evaluateStatus) {
                            if(evaluateEvery != $localStorage.evaluateEvery) {
                                $scope.showRiskDialog = false;
                                $filter('测评提示弹窗')($scope);
                            }
                            $localStorage.evaluateEvery = evaluateEvery;
                        }
                    }
                    break;
            };
        });
        var obj = {};
        if ($scope.user) { obj.uid = $scope.user.uid; }

        resourceService.queryPost($scope, $filter('getUrl')('shouYe'), obj, { name: 'index' });
        $scope.closeshuangdan = function () {
            $scope.shuangdanBox = false;
            $scope.newhandBox = false;
            $("body,html").css({ "overflow": "auto", "height": "auto" });
        };
        $scope.closeyuandan = function () {
            $scope.isAlert = false;
            $scope.yuandanIsAlert = false;
            if ($localStorage.yuandanIsAlert) {
                $localStorage.yuandanIsAlert = false;
            }
            $("body,html").css({ "overflow": "auto", "height": "auto" });
        };
        $scope.toYuandan = function () {
            $scope.isAlert = false;
            $scope.yuandanIsAlert = false;
            if ($localStorage.yuandanIsAlert) {
                $localStorage.yuandanIsAlert = false;
            }
            $("body,html").css({ "overflow": "auto", "height": "auto" });
            $state.go('newYear2018');
        };
        $scope.playvideo = function(){
            $("body,html").css({ "overflow": "hidden", "height": "100%" });
            $scope.videoplay = true;
        }
        $scope.closevideo = function(){
            $("body,html").css({ "overflow": "auto", "height": "auto" });
            $scope.videoplay = false;
        }
    }])
        .directive("repeatFinish", function () {
            return {
                link: function (scope, element, attr) {
                    if (scope.$last == true) {
                        scope.$eval(attr.repeatFinish);
                    }
                }
            }
        })
        .directive('homescrollText', function () {
            var temp = '<span repeat-finish="finish()" ng-repeat="item in gglist" ui-sref="siteNotice">{{item.title}}</span>'
            return {
                template: temp,
                scope: true,
                transclude: true,
                link: function ($scope, element, attrs) {
                    var a = 1;
                    $scope.finish = function () {
                        if(a==1){
                            a++;
                            var height;
                            $('.notice-box').find('span').each(function (i) {
                                height = parseFloat($(this).css('height'));
                                $(this).css({
                                    top: (i * height) + 'px'
                                })
                                var that = this;
                                setInterval(function () {
                                    var top = parseFloat($(that).css('top'));
                                    $(that).animate({
                                        top: (top - height) + 'px'
                                    }, 500, function () {
                                        var top = parseFloat($(that).css('top'));
                                        if (top <= (height * (-1))) {
                                            $(that).css({ top: ($scope.gglist.length - 1) * height + 'px' });
                                        }
                                        if (top == 0) {
                                            $(that).css({ zIndex: 50 });
                                        }
                                        else{
                                            $(that).css({ zIndex: 0 });
                                        }
                                    })
                                }, 2500)
                            })
                        }
                        

                    }
                }
            }
        })
        // 拖拽金蛋
        .directive('eggDrag', function () {
            return {
                restrict:'A', //ECMA        E元素  C类名 M注释 A属性
                link: function(scope,element,attr){

                    var disX,disY,x,y;
                    element.on('touchstart',function(e){
                        
                        var touch=e.touches[0];
                        disX = touch.clientX - $(this).offset().left; 
                        disY = touch.clientY - $(this).offset().top+$(document).scrollTop();

                    })
                    element.on('touchmove',function(e){
                        e.preventDefault();
                        var touchb = e.touches[0];
                        x=touchb.clientX-disX;
                        y=touchb.clientY-disY;
                        if(x<0){
                            x=0;
                        }
                        if(x>$(".home-wrapper").width()-$(this).width()){
                            x=$(".home-wrapper").width()-$(this).width();
                        }
                        if(y<0){
                            y=0;
                        }
                        if(y>$(window).height()-$(this).height()-$('.sign_box_bottom').height()){
                            y=$(window).height()-$(this).height()-$('.sign_box_bottom').height();
                        }
                    
                        $(this).css({
                            "right": "initial",
                            "left":x+"px",
                            "top":y+"px"
                        });
                        
                    });
                    element.on('touchend',function(e){
                          
                        if(x<$(".home-wrapper").width()*0.5){
                            $(this).css({
                                "right": "initial",
                                "left":0,
                                "top":y+"px"
                            });
                        }else{
                            $(this).css({
                                "left": "initial",
                                "right":0,
                                "top":y+"px"
                            });
                        }
                        
                    })
                }
                
            }
        })
        
        
})