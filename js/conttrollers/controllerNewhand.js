/*
 * @Author: lee
 * @Date:   2016-01-10 23:29:04
 * @Last Modified by:   Ellie
 * @Last Modified time: 2018-04-04 18:24:56
 */
define([
    'jweixin'
    , 'js/module.js'
    , 'jquery'
    , 'ngdialog'
]
    , function (wx, controllers, $, ngdialog) {
        /*新手详情*/
        controllers.controller('controllerNewhand'
            , ['$scope', '$rootScope'
                , 'resourceService'
                , '$filter'
                , '$state'
                , '$stateParams'
                , '$localStorage'
                , function ($scope, $rootScope, resourceService, $filter, $state, $stateParams, $localStorage) {
                    $scope.wap = $stateParams.wap;
                    $scope.platform = $rootScope.getUrlParam('platform');
                    if ($stateParams.pid) {
                        $scope.pid = $stateParams.pid;
                    }
                    if($scope.wap == 'false' || $scope.platform == 'i' || $scope.platform == 'A') {
                        $('.newhandbox').css('margin-top','0');
                    }
                    $scope.toInvest = function(){
                        if($scope.cpObj.isFuiou==0){
                            $scope.depositoryShow = true;
                        }
                        else{
                            $state.go('investment',{wap:true,pid:$scope.cp.id});
                        }
                    };
                    $filter('isPath')('newhand');
                    $('body').scrollTop(0);
                    $scope.toback = function () {
                        if ($rootScope.getUrlParam('from') == 'coupon') {
                            $state.go('myCoupon');
                        } else {
                            $filter('跳回上一页')(2);
                        }
                    };
                    $scope.gologin = function () {
                        // $state.go('dl', { returnurl: 'newhand?pid=' + $scope.cp.id + "&wap=true" });
                        $state.go('dl', { returnurl: 'newhand?wap=true' });
                    };
                    var user = $filter('isRegister')();
                    $scope.mainbox = true;
                    $scope.$on('resourceService.QUERY_POST_MYEVENT', function (event, data, eObj) {
                        switch (eObj.name) {
                            case 'newH':
                                $localStorage.cp = data.map;
                                $scope.cpObj = data.map;
                                $scope.cp = data.map.info;
                                $rootScope.title = $scope.cp.fullName;
                                if ($scope.cp.endDate != undefined) {
                                    var date3 = $scope.cp.endDate - Date.parse(new Date());
                                    var day = Math.floor(date3 / (24 * 3600 * 1000));
                                    var hh = Math.floor(date3 / (3600 * 1000));
                                    if (day > 0) {
                                        $scope.nowTimer = day + '天';
                                    } else
                                        if (day == 0 && hh > 1) {
                                            $scope.nowTimer = hh + '小时';
                                        } else
                                            if (day == 0 && hh < 1) {
                                                $scope.nowTimer = '1小时内'
                                            } else
                                                if (hh < 0) {
                                                    if ($scope.cp.status == 5) {
                                                        $scope.nowTimer = '无限制';
                                                    } else {
                                                        $scope.nowTimer = '已结束';
                                                    }
                                                }
                                } else {
                                    $scope.nowTimer = '已结束';
                                };
                                break;
                            case 'cpPicAndInvest':
                                $scope.cp = data.map.info;
                                break;
                        };
                    });

                    var obj = {};
                    obj.pid = $stateParams.pid;
                    if (user.register) {
                        obj.uid = user.user.member.uid;
                    }
                    resourceService.queryPost($scope, $filter('getUrl')('cpDetail'), obj, { name: 'newH' });
                }
            ])

        /*产品详情*/
        controllers.controller('controllerCpDrtail'
            , ['$scope', '$rootScope'
                , 'resourceService'
                , '$filter'
                , '$state'
                , '$stateParams'
                , '$location'
                , '$localStorage'
                , function ($scope, $rootScope, resourceService, $filter, $state, $stateParams, $location, $localStorage) {
                    delete $localStorage.coupon;
                    $filter('isPath')('cpDetail');
                    $rootScope.title = "优选产品";
                    $scope.toback = function () {
                        if ($rootScope.getUrlParam('from') == 'coupon') {
                            $state.go('myCoupon');
                        }
                        else if ($rootScope.getUrlParam('from') == 'newyearact1') {
                            $state.go('newyearact1', { wap: true });
                        }
                        else {
                            $filter('跳回上一页')(2);
                        }
                    };
                    $scope.yuebiao = {};
                    $scope.mainbox = true;
                    var user = $filter('isRegister')();
                    $scope.toFrom = $rootScope.getUrlParam('toFrom');
                    $scope.active = 0;
                    $scope.isShowRule = false;
                    $scope.showBigImg = false;
                    var $win = $(window);
                    $("html,body").animate({ scrollTop: $("body").offset().top });
                    $win.on('load resize scroll', function () {
                        // $('.check-img-wrap').height($('body').height());
                        $('.check-img-wrap').height($win.height()).width($win.width());
                        $('.check-img-wrap img').css('max-height', $win.height()).css('max-width', $win.width());
                    });
                    $scope.showImg = function (event) {
                        $scope.bigImgSrc = $(event.currentTarget).attr('src');
                        $scope.showBigImg = true;
                    };
                    $scope.slideToggle = function (e) {
                        $(e.currentTarget).parent().siblings("p").stop().slideToggle(200);
                        if ($(e.currentTarget).hasClass('slideDown')) {
                            $(e.currentTarget).removeClass('slideDown')
                        } else { $(e.currentTarget).addClass('slideDown') }
                    };
                    $scope.closeRealverify = function () {
                        $scope.isRealverify = false;
                    };
                    $scope.gologin = function () {
                        $state.go('dl', { returnurl: 'cpDetail?pid=' + $scope.cp.id });
                    };
                    $scope.toInvest = function () {
			       	 	if ($scope.map.realVerify) {
                            if($stateParams.rid) {
							    $state.go('investment',{rid: $stateParams.rid,toFrom: $scope.toFrom});
                            } else {
							    $state.go('investment',{toFrom: $scope.toFrom});
                            }
			            }
			            else {
							$state.go('authRecharge');
			            }
			//          if ($scope.accunt.isFuiou == 0) {
			//              $('.depository').fadeIn(200);
			//          }
			//          else {
			////              $state.go('recharge', { from: 'home', wap: true });
			//          }
			        }
                    $scope.$on('resourceService.QUERY_POST_MYEVENT', function (event, data, eObj) {
                        switch (eObj.name) {
                            case 'cpDetail':
                                if(data.map.specialRate) {
                                    data.map.specialRate = parseFloat(data.map.specialRate);
                                }
                                $localStorage.cp = data.map;
                                $scope.yuebiao.name = data.map.name;
                                $scope.yuebiao.isReservation = data.map.isReservation;
                                $scope.yuebiao.prid = data.map.prid;
                                $scope.yuebiao.realverify = data.map.realverify;
                                $scope.linkURL = data.map.linkURL;
                                $scope.appTitle = data.map.appTitle;
                                $scope.cp = data.map.info;

                                //判断不是普通标
                                if($scope.cp && $scope.cp.productUseType && $scope.cp.productUseType != "0"){
                                    $scope.isNoNormal = true;
                                }

                                $scope.type = data.map.info.type;
                                if ($scope.type == 1) {
                                    $scope.interestmode = '满标后次日计息';
                                } else {
                                    $scope.interestmode = '投资后次日计息';
                                }

                                if($scope.cp.repayType==3 || $scope.cp.repayType==4){
                                    $rootScope.title = "聚划算";
                                }
                                // 双蛋活动添加
                                $scope.doubleEggrule = data.map.doubleEggrule;
                                $scope.specialRate = parseFloat(data.map.specialRate);
                                $scope.isOldUser = data.map.isOldUser;
                                if ($scope.specialRate > 0) {
                                    $scope.isshuangdan = true;
                                }
                                else {
                                    $scope.isshuangdan = false;
                                }

                                if ($scope.cp.atid) { $rootScope.title = "产品投资"; }
                                $rootScope.cpInfo = data.map.repair;
                                $scope.extendInfos = data.map.extendInfos;
                                if ($scope.cp.establish != undefined) {
                                    var date3 = $scope.cp.establish - Date.parse(new Date());
                                    var day = Math.floor(date3 / (24 * 3600 * 1000));
                                    var hh = Math.floor(date3 / (3600 * 1000));
                                    if (day > 0) {
                                        $scope.nowTimer = day + '天';
                                        // $scope.isFinish = true;
                                    } else
                                        if (day == 0 && hh > 1) {
                                            $scope.nowTimer = hh + '小时';
                                            // $scope.isFinish = true;
                                            $scope.isBuTimer = true;
                                        } else
                                            if (day == 0 && hh < 1) {
                                                $scope.nowTimer = '1小时内'
                                                // $scope.isFinish = true;
                                            } else
                                                if (hh < 0) {
                                                    if ($scope.cp.type == 1) {
                                                        $scope.nowTimer = '无限制';
                                                    } else {
                                                        $scope.nowTimer = '已结束';
                                                    }
                                                    $scope.isFinish = true;
                                                }
                                } else {
                                    $scope.nowTimer = '已结束';
                                    $scope.isFinish = true;
                                };

                                /*补标弹窗显示*/
                                if ($stateParams.isShowRule == undefined) {
                                    if ($scope.cpInfo != undefined && $scope.cp.isRepair == 1 && $scope.cp.surplusAmount > 0) {
                                        $rootScope.isShowRule = true;
                                    }
                                } else {
                                    $scope.isShowRule = false;
                                }
                                if ($stateParams.pid) {
                                    resourceService.queryPost($scope, $filter('getUrl')('cpPicAndInvest'), {
                                        pid: $stateParams.pid,
                                        type: $scope.cp.type
                                    }, { name: 'cpPicAndInvest' });
                                }
                                break;
                            case 'cpPicAndInvest':
                                $scope.picList = data.map.picList;
                                $scope.investList = data.map.investList;
                                break;
                            case '是否认证':
                                $scope.map = data.map;
                                break;
                            case '砸蛋':
                                if (data.success) {
                                    $scope.eggs.context.siblings('.chuizi').addClass('za');
                                    setTimeout(function () {
                                        $('.zjd').show();
                                        $('.zjd-box1').show();
                                        localStorage.sharezjd = false;
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
                                    $scope.eggs.obj.maxActivityCoupon = data.map.newActivityCoupon.raisedRates;
                                    setTimeout(function () {
                                        $('.zjd-box4').show().siblings().hide();
                                        $scope.iszadan = true;
                                        $scope.eggs.context.siblings('.chuizi').removeClass('za');
                                    }, 1000);
                                }
                                break;
                        };
                    });

                    $scope.panel1 = {
                        isAction: 1
                    }
                    $scope.panel2 = {
                        isAction: 1
                    }
                    $scope.panel3 = {
                        isAction: 1
                    }
                    $scope.panel4 = {
                        isAction: 1
                    }
                    $scope.onClick = function (name) {
                        switch (name) {
                            case 'closeRule':
                                $scope.isShowRule = false;
                                break;
                        };
                    };
                    $scope.setAction = function (item) {
                        if (item.isAction == 1) {
                            item.isAction = 0;
                        } else {
                            item.isAction = 1;
                        }
                    };

                    $scope.goyuebiao = function () {
                        if ($scope.yuebiao.realverify) {
                            $state.go('yuebiao', { prid: $scope.yuebiao.prid, name: $scope.yuebiao.name, toState: $state.current.name, pid: $stateParams.pid });
                        } else {
                            $scope.isRealverify = true;
                        }
                    };
                    if ($stateParams.pid != null || $stateParams.rid) {
                        var obj = {};
                        obj.pid = $stateParams.pid;
                        if (user.register) {
                            obj.uid = user.user.member.uid;
                            resourceService.queryPost($scope, $filter('getUrl')('我的信息'), {
                                uid: user.user.member.uid
                            }, { name: '是否认证' });
                        }
                        resourceService.queryPost($scope, $filter('getUrl')('cpDetail'), obj, { name: 'cpDetail' });
                    } else {
                        $filter('跳回上一页')(1);
                    };
                    var uid;
                    if (user.user.member) { uid = user.user.member.uid; }
                    $scope.iszadan = true;
                    $scope.eggs = {};
                    $scope.zaEgg = function (e, item) {
                        e.stopPropagation();
                        $scope.eggs.id = item.id;
                        $scope.eggs.context = $(e.currentTarget);
                        if (item.isEgg == 1 && $scope.iszadan) {
                            $scope.iszadan = false;
                            $scope.eggs.obj = item;
                            resourceService.queryPost($scope, $filter('getUrl')('zadan'), { uid: uid, id: item.id }, { name: '砸蛋' });
                        }
                    };
                    $scope.share = function (e) {
                        $('.zjd-box2').show();
                        //setTimeout(function(){$('.zjd-box3').show().siblings().hide();localStorage.sharezjd=false;}, 5000);
                        //$('.zjd-box3').show().siblings().hide();
                    };
                    $scope.zajindan = function (e) {
                        $scope.eggs.context = $(e.currentTarget);
                        if ($scope.iszadan) {
                            resourceService.queryPost($scope, $filter('getUrl')('zadan'), { uid: uid, id: $scope.eggs.id }, { name: '第二次砸蛋' });
                        }
                    };
                    $scope.closethis = function (e) {
                        $(e.currentTarget).hide();
                    }
                    $scope.cancelza = function (e) {
                        e.stopPropagation();
                    };
                    $scope.closeEgg = function () {
                        $('.zjd').hide();
                        $('.zjd').children().hide();
                    };
                    var userphone = "";
                    if ($filter('isRegister')().user.member) { userphone = '&recommCode=' + $filter('isRegister')().user.member.mobilephone; }
                    localStorage.sharezjd = false;
                    wx.ready(function () {
                        wx.onMenuShareTimeline({
                            title: '撸起袖子加油赚，想财富自由先来领第一桶金！', // 分享标题
                            link: 'https://hushenlc.cn/newcomer?wap=true&toFrom=zjdfxfx' + userphone, // 分享链接
                            imgUrl: 'https://hushenlc.cn/images/activity/zjd/shareico.png', // 分享图标
                            success: function () {
                                alert('分享成功！');
                                if (localStorage.sharezjd) { $('.zjd-box3').show().siblings().hide(); localStorage.sharezjd = false; }
                            },
                            cancel: function () {
                                alert('您取消了分享！');
                            }
                        });
                        wx.onMenuShareAppMessage({
                            title: '撸起袖子加油赚，想财富自由先来领第一桶金！', // 分享标题
                            desc: '撸起袖子加油赚，想财富自由先来领第一桶金！', // 分享描述
                            link: 'https://hushenlc.cn/newcomer?wap=true&toFrom=zjdfxfx' + userphone, // 分享链接
                            imgUrl: 'https://hushenlc.cn/images/activity/zjd/shareico.png', // 分享图标
                            success: function () {
                                alert('分享成功！');
                                if (localStorage.sharezjd) { $('.zjd-box3').show().siblings().hide(); localStorage.sharezjd = false; }
                            },
                            cancel: function () {
                                alert('您取消了分享！');
                            }
                        });
                        wx.onMenuShareQQ({
                            title: '撸起袖子加油赚，想财富自由先来领第一桶金！', // 分享标题
                            desc: '撸起袖子加油赚，想财富自由先来领第一桶金！', // 分享描述
                            link: 'https://hushenlc.cn/newcomer?wap=true&toFrom=zjdfxfx' + userphone, // 分享链接
                            imgUrl: 'https://hushenlc.cn/images/activity/zjd/shareico.png', // 分享图标
                            success: function () {
                                alert('分享成功！');
                                if (localStorage.sharezjd) { $('.zjd-box3').show().siblings().hide(); localStorage.sharezjd = false; }
                            },
                            cancel: function () {
                                alert('您取消了分享！');
                            }
                        });
                        wx.onMenuShareWeibo({
                            title: '撸起袖子加油赚，想财富自由先来领第一桶金！', // 分享标题
                            desc: '撸起袖子加油赚，想财富自由先来领第一桶金！', // 分享描述
                            link: 'https://hushenlc.cn/newcomer?wap=true&toFrom=zjdfxfx' + userphone, // 分享链接
                            imgUrl: 'https://hushenlc.cn/images/activity/zjd/shareico.png', // 分享图标
                            success: function () {
                                alert('分享成功！');
                                if (localStorage.sharezjd) { $('.zjd-box3').show().siblings().hide(); localStorage.sharezjd = false; }
                            },
                            cancel: function () {
                                alert('您取消了分享！');
                            }
                        });
                        wx.onMenuShareQZone({
                            title: '撸起袖子加油赚，想财富自由先来领第一桶金！', // 分享标题
                            desc: '撸起袖子加油赚，想财富自由先来领第一桶金！', // 分享描述
                            link: 'https://hushenlc.cn/newcomer?wap=true&toFrom=zjdfxfx' + userphone, // 分享链接
                            imgUrl: 'https://hushenlc.cn/images/activity/zjd/shareico.png', // 分享图标
                            success: function () {
                                alert('分享成功！');
                                if (localStorage.sharezjd) { $('.zjd-box3').show().siblings().hide(); localStorage.sharezjd = false; }
                            },
                            cancel: function () {
                                alert('您取消了分享！');
                            }
                        });
                    })

                }
            ])

        controllers.controller('controllerInvestDrtail'
            , ['$scope', '$rootScope'
                , 'resourceService'
                , '$filter'
                , '$state'
                , '$stateParams'
                , '$location'
                , '$localStorage'
                , function ($scope, $rootScope, resourceService, $filter, $state, $stateParams, $location, $localStorage) {
                    delete $localStorage.coupon;
                    $filter('isPath')('cpInvestDetail');
                    // $rootScope.title = "优选理财";
                    document.getElementsByTagName('html')[0].scrollTop = 0;
                    document.getElementsByTagName('body')[0].scrollTop = 0;
                    $scope.pid = $location.$$search.pid;
                    $scope.user = $filter('isRegister')().user;
                    $scope.reviewEvaluation = function () {
                        $scope.closeDialog();
                        $state.go('startEvaluation',{fromPage:'ceping', pid: $scope.pid});
                    }
                    $scope.toback = function () {
                        if ($rootScope.getUrlParam('from') == 'coupon') {
                            $state.go('myCoupon');
                        }
                        else if ($rootScope.getUrlParam('from') == 'newyearact1') {
                            $state.go('newyearact1', { wap: true });
                        }
                        else {
                            $filter('跳回上一页')(2);
                        }
                    };
                    $scope.toRender =  function () {
                        $scope.closeDialog();
                        $state.go('reminder');
                    }
                    $scope.toDl = function () {
                        $state.go('dl')
                    }
                    $scope.cpCoupon = {};
                    $scope.cpCoupon.type = 0;
                    $scope.yuebiao = {};
                    $scope.mainbox = true;
                    $scope.agree = true;
                    $scope.amount = '';
                    $localStorage.userTypes = {};
                    $scope.tixie = {};
                    $scope.tixieIncome = 0;
                    $scope.tixieId = null;
                    var user = $filter('isRegister')();
                    $scope.userInfo = $filter('isRegister')();
                    $scope.toFrom = $rootScope.getUrlParam('toFrom');
                    $scope.active = 0;
                    $scope.isShowRule = false;
                    $scope.showBigImg = false;
                    $scope.expect = '0.00';
                    var $win = $(window);
                    $("html,body").animate({ scrollTop: $("body").offset().top });
                    $win.on('load resize scroll', function () {
                        // $('.check-img-wrap').height($('body').height());
                        $('.check-img-wrap').height($win.height()).width($win.width());
                        $('.check-img-wrap img').css('max-height', $win.height()).css('max-width', $win.width());
                    });
                    // 计算输入金额时的基本计息
                    $scope.shouyi = function () {
                        $scope.shouyiJc = $filter('wisNumber2')($scope.amount * $scope.cp.info.rate / 100 / 360 * $scope.cp.info.deadline);
                        $scope.shoujiHd = $filter('wisNumber2')($scope.amount*$scope.cp.info.activityRate/100 /360 * $scope.cp.info.deadline);
                        $scope.shouyiTs = $filter('wisNumber2')($scope.amount * $scope.cp.info.specialRate / 100 / 360 * $scope.cp.info.deadline);
                        if ($scope.cpCoupon) {
                            $scope.countYhq($scope.cpCoupon);
                        } else {
                            $scope.shouyiYhq = 0;
                        }
                        $scope.expect = $filter('wisNumber2')($scope.shouyiJc + $scope.shoujiHd + $scope.shouyiTs);
                    }
                    $scope.isShow = false;
                    $scope.onChange = function () {
                        if ($scope.tixie) {
                            // $scope.tixieIncome = $filter('isNumber2')($scope.amount * ($scope.tixie.percent1));
                            $scope.tixieIncome = $filter('isNumber2')(($scope.amount * ($scope.tixie.percent1/100)/360)*$scope.cp.info.deadline);
                        }
                        $scope.isShow = true;
                        angular.forEach($scope.cop, function (value, indexInList) {
                            if($scope.amount < value.enableAmount){
                                value.status = 0;
                                $scope.cpCoupon = null;
                                // $localStorage.cp.fid = $scope.cp.info.fid = null;
                            }
                        });
                        if ($scope.cp) {$scope.shouyi();
                        }
                    };
                    if ($localStorage.cpCoupon) {
                        delete $localStorage.cpCoupon;
                    }
                    if ($localStorage.amount) {
                        $scope.amount = $localStorage.amount;
                        delete $localStorage.amount;
                    }
                    $scope.showImg = function (event) {
                        $scope.bigImgSrc = $(event.currentTarget).attr('src');
                        $scope.showBigImg = true;
                    };
                    $scope.slideToggle = function (e) {
                        $(e.currentTarget).parent().siblings("p").stop().slideToggle(200);
                        if ($(e.currentTarget).hasClass('slideDown')) {
                            $(e.currentTarget).removeClass('slideDown')
                        } else { $(e.currentTarget).addClass('slideDown') }
                    };
                    $scope.toweibiao = function () {
                        if ($scope.amount) {
                            $localStorage.amount = $scope.amount;
                        }
                        $state.go('tailawardDetail')
                    };
                    $scope.closeRealverify = function () {
                        $scope.isRealverify = false;
                    };
                    $scope.gologin = function () {
                        $state.go('dl', { returnurl: 'cpInvestDetail?pid=' + $scope.cp.info.id });
                    };
                    $scope.toInvest = function () {
                        // $scope.expectAll = $filter('wisNumber2')($scope.shouyiJc + $scope.shoujiHd + $scope.shouyiTs + $scope.shouyiYhq);
                        if ($scope.amount >= $scope.cp.info.leastaAmount) {
                            if ($scope.amount%$scope.cp.info.increasAmount == 0) {
                                if ($scope.map.realVerify) {
                                    //判断余额是否充足
                                    if ($scope.amount <= $scope.balance) {
                                        // 弹出风险提示弹窗
                                        if($scope.cp.showDialog) {
                                            $scope.showRiskDialog = false;
                                            $filter('测评提示弹窗')($scope);
                                        } else {
                                            if($scope.cp.allowInvest) {
                                                $scope.isBalanceSufficient = true;
                                                $filter('支付弹窗')($scope);
                                            } else {
                                                $scope.showRiskDialog = true;
                                                $filter('测评提示弹窗')($scope);
                                            }
                                        }
                                    } else {
                                        $scope.isBalanceSufficient = false;
                                        $filter('支付弹窗')($scope);
                                    }
                                } else {
                                    $localStorage.cpCoupon = $scope.cpCoupon;
                                    $state.go('investAuthentication',{amount: $scope.amount,expect:$scope.expect});
                                }


                            } else {
                                $filter('investAmountError')('1002','投资金额需为' +  $scope.cp.info.increasAmount + '的整数倍');
                            }
                        } else if ($scope.amount < $scope.cp.info.leastaAmount && $scope.amount != '') {
                            $filter('investAmountError')('1002',"投资金额最少为" + $scope.cp.info.leastaAmount);
                        } else if ( !$scope.amount) {
                            $filter('investAmountError')('1001');
                        }
                    }
                    // 去支付
                    $scope.zhifu = function () {
                        $scope.closeDialog();
                        resourceService.queryPost($scope, $filter('getUrl')('我的信息'), {uid: $scope.user.member.uid}, {name: '我的信息'});
                        $filter('设置交易密码弹窗')($scope);
                    };
                    $scope.$watch('amount',function(newValue,oldValue){
                        if (newValue == null) {
                            $scope.isShow = false;
                        }
                        if ($scope.cp) {
                            if(newValue > $scope.cp.info.surplusAmount) {
                                $scope.amount = oldValue;
                                $scope.onChange();
                            }
                        }

                    });
                    /****
                     *优惠券列表
                     */
                    $scope.useCoupon = function () {
                        if(!$scope.amount) {
                            $filter('investAmountError')('1001');
                        } else {
                            $filter('优惠券列表弹窗')($scope);
                            resourceService.queryPost($scope, $filter('getUrl')('产品可用优惠券'), {
                                'uid': $scope.user.member.uid,
                                'pid': $localStorage.cp.info.id
                            }, '产品可用优惠券');
                        }
                    };
                    if($scope.amount >= 5000) {
                        $scope.select = true;
                    }
                    else {
                        $scope.select = false;
                    }
                    $scope.choosenTicket = function (event, item) {
                        if(item.status == 1){
                            item.status = 0;
                            $scope.curTicket = $scope.cpCoupon = null;
                            $localStorage.cp.fid = $scope.cp.info.fid = null;
                            $localStorage.cp.rewardProfit = null;
                            $filter('orderBy')($scope.cop, ['status','suitable','profitAmount','expireDate','addtime'],[false,false,false,false]);
                            $scope.closeDialog();
                            return;
                        } else {
                            $scope.cpCoupon = item;
                            $localStorage.cp.fid = $scope.cp.info.fid = item.id;
                        }
                        if(!$scope.amount || item.enableAmount > $scope.amount){
                            $scope.amount = item.enableAmount;
                        }
                        $localStorage.cp.fid = $scope.cp.info.fid = item.id;
                        $scope.cpCoupon = item;
                        $scope.sortComboxCouponList(item);
                        $scope.closeDialog();
                        $scope.countYhq($scope.cpCoupon);
                        $scope.shouyi();
                    };
                    $scope.countYhq = function (cpCoupon) {
                        if (cpCoupon.type == 1) {                               //返现券
                            $scope.shouyiYhq = cpCoupon.amount;
                        } else if (cpCoupon.type == 2) {                        //加息券
                            $scope.shouyiYhq = $filter('wisNumber2')(cpCoupon.raisedRates/100 / 360 * $scope.amount * $scope.cp.info.deadline);
                        } else if (cpCoupon.type == 4) {                        //翻倍券
                            $scope.shouyiYhq = $filter('wisNumber2')($scope.amount * $scope.cp.info.rate*(cpCoupon.multiple-1)/100 / 360 * $scope.cp.info.deadline);
                        }
                    }
                    /**
                     * 计算优惠券列表状态和收益
                     * @param selectedCoupon
                     */
                    $scope.sortComboxCouponList = function(selectedCoupon){
                        var investAmount = $scope.amount? $scope.amount: 0;
                        // console.log(selectedCoupon);
                        angular.forEach($scope.cop, function (value, indexInList) {
                            // 选择优惠券时金额计算
                            switch (value.type) {
                                case 1:
                                    //返现
                                    value.profitAmount = value.amount;
                                    break;
                                case 2:
                                    // 加息券  金额*加息券利率/360/100*30
                                    value.profitAmount = investAmount*value.raisedRates/(360*100)*$scope.cp.info.deadline;
                                    break;
                                case 4:
                                    // 翻倍券  金额*(基础利率*翻倍+平台加息)/360/100*30
                                    value.profitAmount = investAmount*($scope.cp.info.rate * value.multiple - $scope.cp.info.rate)/(360*100)*$scope.cp.info.deadline;
                                    break;
                            } ;
                            if(selectedCoupon && selectedCoupon.id == value.id){
                                value.status = 1;
                                $scope.cpCoupon = value;
                                $scope.cp.info.rewardProfit = value.profitAmount;
                            }else{
                                value.status = 0;
                            }
                            $scope.cop[indexInList] = value;
                        });
                        $filter('orderBy')($scope.cop, ['status','suitable','profitAmount','expireDate','addtime'],[false,false,false,true]);
                        $scope.closeDialog();
                    };

                    $scope.sendRequest = function () {
                        $scope.closeDialog();
                        $scope.params = {
                            'pid': $localStorage.cp.info.id,
                            'tpwd': $localStorage.userTypes.passWord,
                            'amount': $scope.amount,
                            'uid': $filter('isRegister')().user.member.uid,
                            'activityType': 0,
                            'cid': $scope.tixieId
                        }
                        if($localStorage.latestActiveNotReimbursedRecord){
                            $scope.params.rid = $localStorage.latestActiveNotReimbursedRecord.id;
                        }
                        if($scope.cpCoupon){
                            $scope.params.fid = $scope.cpCoupon.id;
                        }
                        if (sessionStorage.getItem('AMLId')) {
                            $scope.params.AMLId = sessionStorage.getItem('AMLId')
                        }
                        resourceService.queryPost($scope, $filter('getUrl')('购买产品'), $scope.params, {name: '购买产品'});
                    }

                    $scope.firstSetPwd = false;
                    $scope.enterPassword =function (flag) {
                        var ul = $(".pwd li");
                        $scope.pwd = $('#tradePwd').val();
                        var len = $scope.pwd.length;
                        for(var i=0;i<6;i++){
                            if(i < len){
                                $(ul[i]).addClass("active");
                            }else{
                                $(ul[i]).removeClass("active");
                            }
                        }
                        if(len == 6 && flag == 1){
                            if($scope.firstSetPwd) {
                                if($localStorage.userTypes.passWord1 == $scope.pwd) {
                                    $localStorage.userTypes.passWord = $scope.pwd;
                                    resourceService.queryPost($scope, $filter('getUrl')('设置交易密码'),{
                                        tpwd: $localStorage.userTypes.passWord,
                                        chkSmsCode: false,
                                        uid: $scope.user.member.uid
                                    },{ name: '设置交易密码'  });
                                } else {
                                    $filter('investAmountError')('1003');
                                    $scope.firstSetPwd = false;
                                }
                            } else {
                                $localStorage.userTypes.passWord1 = $scope.pwd;
                                $scope.firstSetPwd = !$scope.firstSetPwd;
                            }
                        }
                        if(len == 6 && flag == 2){
                            $localStorage.userTypes.passWord = $scope.pwd;
                            $scope.sendRequest();
                        }
                    };
                    // 忘记密码
                    $scope.toRetPwd = function () {
                        $scope.closeDialog();
                        $state.go('resetTradePwd',{firstset:false});
                    };
                    $scope.$on('resourceService.QUERY_POST_MYEVENT', function (event, data, eObj) {
                        switch (eObj.name) {
                            case 'cpDetail':
                                //贴息
                                if (data.map.memberDiscount) {
                                    $scope.tixie = data.map.memberDiscount;
                                    $scope.tixieId = data.map.memberDiscount.id;
                                }
                                //贴息活动提示框
                                $scope.hot = data.map.hot;
                                $scope.balance = data.map.balance;
                                $scope.cfcaSwitchFlag = data.map.cfcaSwitchFlag;
                                console.log(data);
                                if(data.map.specialRate) {
                                    data.map.specialRate = parseFloat(data.map.specialRate);
                                }
                                $localStorage.cp = data.map;
                                $scope.yuebiao.name = data.map.name;
                                $scope.yuebiao.isReservation = data.map.isReservation;
                                $scope.yuebiao.prid = data.map.prid;
                                $scope.yuebiao.realverify = data.map.realverify;
                                $scope.linkURL = data.map.linkURL;
                                $scope.appTitle = data.map.appTitle;
                                $scope.cp = data.map;
                                $scope.riskname = ($scope.cp.info.riskname == '' ||$scope.cp.info.riskname == null || $scope.cp.info.riskname == undefined) ? false:true;

                                //判断不是普通标
                                if($scope.cp.info && $scope.cp.info.productUseType && $scope.cp.info.productUseType != "0"){
                                    $scope.isNoNormal = true;
                                }
                                if ($scope.amount) {
                                    $scope.onChange();
                                }

                                $scope.type = data.map.info.type;
                                if ($scope.type == 1) {
                                    $scope.interestmode = '满标后次日计息';
                                } else {
                                    $scope.interestmode = '次日计息';
                                }

                                if($scope.cp.info.repayType==3 || $scope.cp.info.repayType==4){
                                    $rootScope.title = "聚划算";
                                }
                                // 双蛋活动添加
                                $scope.doubleEggrule = data.map.doubleEggrule;
                                $scope.specialRate = parseFloat(data.map.specialRate);
                                $scope.isOldUser = data.map.isOldUser;
                                if ($scope.specialRate > 0) {
                                    $scope.isshuangdan = true;
                                }
                                else {
                                    $scope.isshuangdan = false;
                                }

                                if ($scope.cp.info.atid) { $rootScope.title = "产品投资"; }
                                $rootScope.cpInfo = data.map.repair;
                                $scope.extendInfos = data.map.extendInfos;
                                if ($scope.cp.info.establish != undefined) {
                                    var date3 = $scope.cp.info.establish - Date.parse(new Date());
                                    var day = Math.floor(date3 / (24 * 3600 * 1000));
                                    var hh = Math.floor(date3 / (3600 * 1000));
                                    if (day > 0) {
                                        $scope.nowTimer = day + '天';
                                        // $scope.isFinish = true;
                                    } else
                                    if (day == 0 && hh > 1) {
                                        $scope.nowTimer = hh + '小时';
                                        // $scope.isFinish = true;
                                        $scope.isBuTimer = true;
                                    } else
                                    if (day == 0 && hh < 1) {
                                        $scope.nowTimer = '1小时内'
                                        // $scope.isFinish = true;
                                    } else
                                    if (hh < 0) {
                                        if ($scope.cp.info.type == 1) {
                                            $scope.nowTimer = '无限制';
                                        } else {
                                            $scope.nowTimer = '已结束';
                                        }
                                        $scope.isFinish = true;
                                    }
                                } else {
                                    $scope.nowTimer = '已结束';
                                    $scope.isFinish = true;
                                };

                                /*补标弹窗显示*/
                                if ($stateParams.isShowRule == undefined) {
                                    if ($scope.cpInfo != undefined && $scope.cp.info.isRepair == 1 && $scope.cp.info.surplusAmount > 0) {
                                        $rootScope.isShowRule = true;
                                    }
                                } else {
                                    $scope.isShowRule = false;
                                }
                                if ($stateParams.pid) {
                                    resourceService.queryPost($scope, $filter('getUrl')('cpPicAndInvest'), {
                                        pid: $stateParams.pid,
                                        type: $scope.cp.info.type
                                    }, { name: 'cpPicAndInvest' });
                                }

                                if ($scope.userInfo.register) {
                                    if ($scope.cp.info.repayType != 3 && $scope.cp.info.repayType != 4) {
                                        resourceService.queryPost($scope, $filter('getUrl')('产品可用优惠券'), {
                                            'uid': $filter('isRegister')().user.member.uid,
                                            'pid': $scope.cp.info.id
                                        }, {name: '产品可用优惠券'});
                                    }
                                }
                                // type==0
                                if ($scope.repair != undefined) {
                                    if ($scope.repair.type == 2) {
                                        $scope.noHBJiaXi = true;
                                    } else if ($scope.repair.type == 1) {
                                        $scope.noHBFanXian = true;
                                    }
                                } else {
                                    $scope.noHBshouyi = true;
                                }
                                break;
                            case 'cpPicAndInvest':
                                $scope.picList = data.map.picList;
                                $scope.investList = data.map.investList;
                                break;
                            case '是否认证':
                                $scope.map = data.map;
                                break;
                            case '我的信息':
                                if(data.success) {
                                    $scope.tpwdFlag = data.map.tpwdFlag;
                                    $scope.pwdFlag = $scope.tpwdFlag == 1 ? true:false;
                                }
                                break;
                            case '砸蛋':
                                if (data.success) {
                                    $scope.eggs.context.siblings('.chuizi').addClass('za');
                                    setTimeout(function () {
                                        $('.zjd').show();
                                        $('.zjd-box1').show();
                                        localStorage.sharezjd = false;
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
                                    $scope.eggs.obj.maxActivityCoupon = data.map.newActivityCoupon.raisedRates;
                                    setTimeout(function () {
                                        $('.zjd-box4').show().siblings().hide();
                                        $scope.iszadan = true;
                                        $scope.eggs.context.siblings('.chuizi').removeClass('za');
                                    }, 1000);
                                }
                                break;
                            case '产品可用优惠券':
                                var couponAmount = {};
                                couponAmount.amount = 0;
                                if (data.success) {
                                    $localStorage.coupons = $scope.cop = data.map.list;
                                    if ($stateParams.cpid != undefined && $scope.cop.length > 0) {
                                        for (var i = 0; i < $scope.cop.length; i++) {
                                            if ($scope.cop[i].id == $stateParams.cpid) {
                                                $scope.cpCoupon = $scope.cop[i];

                                                $scope.cpCoupon.amount = $scope.cop[i].amount;
                                            }
                                        };
                                    }
                                    else if ($localStorage.fromJY != undefined && $scope.cop.length > 0) {//设置密码回来后回填
                                        for (var i = 0; i < $scope.cop.length; i++) {
                                            if ($scope.cop[i].id == $localStorage.fromJY.cpid) {
                                                $scope.cpCoupon = $scope.cop[i];
                                            }
                                        };
                                        $scope.amount = $localStorage.fromJY.amount;
                                        $scope.cp.info.id = $localStorage.fromJY.cpInfoId;
                                        if ($scope.amount >= 5000) {
                                            $scope.select = true;
                                        }
                                        else {
                                            $scope.select = false;
                                        }
                                        delete $localStorage.fromJY;
                                    }
                                    else {
                                        $scope.cpCoupon.type = 0;
                                    };

                                    if (!$stateParams.pid) {
                                        for (var j = 0; j < $scope.cop.length; j++) {
                                            if ($scope.cop[j].pid && !$localStorage.coupon) {
                                                $scope.cpCoupon = $scope.cop[j];
                                            }
                                        }
                                    }
                                } else {
                                    $filter('服务器信息')(data.errorCode, $scope, 'y')
                                }
                                break;
                            case '购买产品':
                                if (data.success) {
                                    $scope.successData = $scope.cp;
                                    $scope.successData.shouyi = data.map.shouyi;
                                    $scope.successData.investAmount = $scope.amount;
                                    $scope.successData.coupon = $scope.cpCoupon ? $scope.cpCoupon : 0;
                                    if ($scope.cpCoupon) {
                                        $scope.successData.raisedRates = $scope.cpCoupon.raisedRates;
                                        $scope.successData.multiple = $scope.cpCoupon.multiple;
                                    }
                                    if (data.map.wxGetSize) {
                                        $scope.successData.wxGetSize = data.map.wxGetSize;
                                    }
                                    if (sessionStorage.getItem('AMLId')) {
                                        sessionStorage.removeItem('AMLId');
                                        sessionStorage.setItem('wxhuhd','wxhuhd')
                                    }
                                    $scope.successData.investTime = data.map.investTime;
                                    $scope.successData.isRepeats = data.map.isRepeats;
                                    $scope.successData.luckCodeCount = data.map.luckCodeCount;
                                    $scope.successData.luckCodes = data.map.luckCodes;
                                    $scope.successData.activityURL = data.map.activityURL;
                                    $scope.successData.jumpURL = data.map.jumpURL;
                                    $scope.successData.cfcaSwitchFlag = data.map.cfcaSwitchFlag;
                                    $scope.successData.isGivenLotteryOpp = data.map.isGivenLotteryOpp;
                                    $localStorage.successData = $scope.successData;
                                    // 春节活动期间投资成功跳到特定成功页面
                                    $scope.isInNewYearActivityTime = data.map.isInNewYearActivityTime;
                                    if ($scope.isInNewYearActivityTime) {
                                        $state.go('newYInvestSuc');
                                    } else {
                                        $state.go('investSuccess');
                                    }

                                } else {
                                    if (data.errorCode == '2001') {
                                        $filter('投资交易密码错误信息')($scope);
                                    } else if (data.errorCode == '1007'){
                                        if($localStorage.latestActiveNotReimbursedRecord){
                                            $scope.rid = $localStorage.latestActiveNotReimbursedRecord.id;
                                        }
                                        $filter('投资错误信息')(data.errorCode, $scope, 'y',data.errorMsg);
                                        setTimeout(function () {
                                            $state.go('recharge',{wap:'true',rid: $scope.rid,amount: $scope.amount});
                                        }, 2000);
                                    } else {
                                        $filter('投资错误信息')(data.errorCode, $scope, 'y',data.errorMsg);
                                    }
                                }
                                break;
                            case '设置交易密码':
                                if (data.success) {
                                    $scope.sendRequest();
                                } else {
                                    if(data.errorMsg) {
                                        ngDialog.open({
                                            template: '<p class="error-msg">' + data.errorMsg + '</p>',
                                            showClose: false,
                                            closeByDocument: true,
                                            plain: true
                                        });
                                        setTimeout(function () {
                                            ngDialog.closeAll();
                                        }, 1500);
                                    } else {
                                        $filter('重置交易密码错误信息')(data.errorCode,$scope)
                                    }
                                }
                                break;
                        };
                    });

                    $scope.onClick = function (name) {
                        switch (name) {
                            case 'closeRule':
                                $scope.isShowRule = false;
                                break;
                        };
                    };
                    $scope.setAction = function (item) {
                        if (item.isAction == 1) {
                            item.isAction = 0;
                        } else {
                            item.isAction = 1;
                        }
                    };
                    $scope.toXq = function () {
                        $scope.xqinfo = {
                            amount: $scope.amount,
                            expect: $scope.expect
                        };
                        if ($scope.cpCoupon) {
                            $localStorage.cpCoupon = $scope.cpCoupon;
                        }
                        $localStorage.cp.xqinfo = $scope.xqinfo;
                        $state.go('cpInvestInfo')
                    };

                    $scope.goyuebiao = function () {
                        if ($scope.yuebiao.realverify) {
                            $state.go('yuebiao', { prid: $scope.yuebiao.prid, name: $scope.yuebiao.name, toState: $state.current.name, pid: $stateParams.pid });
                        } else {
                            $scope.isRealverify = true;
                        }
                    };
                    if ($stateParams.pid != null || $stateParams.rid) {
                        var obj = {};
                        obj.pid = $stateParams.pid;
                        if (user.register) {
                            obj.uid = user.user.member.uid;
                            resourceService.queryPost($scope, $filter('getUrl')('我的信息'), {
                                uid: user.user.member.uid
                            }, { name: '是否认证' });
                        }
                        resourceService.queryPost($scope, $filter('getUrl')('cpDetail'), obj, { name: 'cpDetail' });
                    } else {
                        $filter('跳回上一页')(1);
                    };
                    var uid;
                    if (user.user.member) { uid = user.user.member.uid; }
                    $scope.iszadan = true;
                    $scope.eggs = {};
                    $scope.zaEgg = function (e, item) {
                        e.stopPropagation();
                        $scope.eggs.id = item.id;
                        $scope.eggs.context = $(e.currentTarget);
                        if (item.isEgg == 1 && $scope.iszadan) {
                            $scope.iszadan = false;
                            $scope.eggs.obj = item;
                            resourceService.queryPost($scope, $filter('getUrl')('zadan'), { uid: uid, id: item.id }, { name: '砸蛋' });
                        }
                    };
                    $scope.share = function (e) {
                        $('.zjd-box2').show();
                        //setTimeout(function(){$('.zjd-box3').show().siblings().hide();localStorage.sharezjd=false;}, 5000);
                        //$('.zjd-box3').show().siblings().hide();
                    };
                    $scope.zajindan = function (e) {
                        $scope.eggs.context = $(e.currentTarget);
                        if ($scope.iszadan) {
                            resourceService.queryPost($scope, $filter('getUrl')('zadan'), { uid: uid, id: $scope.eggs.id }, { name: '第二次砸蛋' });
                        }
                    };
                    $scope.closethis = function (e) {
                        $(e.currentTarget).hide();
                    }
                    $scope.cancelza = function (e) {
                        e.stopPropagation();
                    };
                    $scope.closeEgg = function () {
                        $('.zjd').hide();
                        $('.zjd').children().hide();
                    };
                    var userphone = "";
                    if ($filter('isRegister')().user.member) { userphone = '&recommCode=' + $filter('isRegister')().user.member.mobilephone; }
                    localStorage.sharezjd = false;
                    wx.ready(function () {
                        wx.onMenuShareTimeline({
                            title: '撸起袖子加油赚，想财富自由先来领第一桶金！', // 分享标题
                            link: 'https://hushenlc.cn/newcomer?wap=true&toFrom=zjdfxfx' + userphone, // 分享链接
                            imgUrl: 'https://hushenlc.cn/images/activity/zjd/shareico.png', // 分享图标
                            success: function () {
                                alert('分享成功！');
                                if (localStorage.sharezjd) { $('.zjd-box3').show().siblings().hide(); localStorage.sharezjd = false; }
                            },
                            cancel: function () {
                                alert('您取消了分享！');
                            }
                        });
                        wx.onMenuShareAppMessage({
                            title: '撸起袖子加油赚，想财富自由先来领第一桶金！', // 分享标题
                            desc: '撸起袖子加油赚，想财富自由先来领第一桶金！', // 分享描述
                            link: 'https://hushenlc.cn/newcomer?wap=true&toFrom=zjdfxfx' + userphone, // 分享链接
                            imgUrl: 'https://hushenlc.cn/images/activity/zjd/shareico.png', // 分享图标
                            success: function () {
                                alert('分享成功！');
                                if (localStorage.sharezjd) { $('.zjd-box3').show().siblings().hide(); localStorage.sharezjd = false; }
                            },
                            cancel: function () {
                                alert('您取消了分享！');
                            }
                        });
                        wx.onMenuShareQQ({
                            title: '撸起袖子加油赚，想财富自由先来领第一桶金！', // 分享标题
                            desc: '撸起袖子加油赚，想财富自由先来领第一桶金！', // 分享描述
                            link: 'https://hushenlc.cn/newcomer?wap=true&toFrom=zjdfxfx' + userphone, // 分享链接
                            imgUrl: 'https://hushenlc.cn/images/activity/zjd/shareico.png', // 分享图标
                            success: function () {
                                alert('分享成功！');
                                if (localStorage.sharezjd) { $('.zjd-box3').show().siblings().hide(); localStorage.sharezjd = false; }
                            },
                            cancel: function () {
                                alert('您取消了分享！');
                            }
                        });
                        wx.onMenuShareWeibo({
                            title: '撸起袖子加油赚，想财富自由先来领第一桶金！', // 分享标题
                            desc: '撸起袖子加油赚，想财富自由先来领第一桶金！', // 分享描述
                            link: 'https://hushenlc.cn/newcomer?wap=true&toFrom=zjdfxfx' + userphone, // 分享链接
                            imgUrl: 'https://hushenlc.cn/images/activity/zjd/shareico.png', // 分享图标
                            success: function () {
                                alert('分享成功！');
                                if (localStorage.sharezjd) { $('.zjd-box3').show().siblings().hide(); localStorage.sharezjd = false; }
                            },
                            cancel: function () {
                                alert('您取消了分享！');
                            }
                        });
                        wx.onMenuShareQZone({
                            title: '撸起袖子加油赚，想财富自由先来领第一桶金！', // 分享标题
                            desc: '撸起袖子加油赚，想财富自由先来领第一桶金！', // 分享描述
                            link: 'https://hushenlc.cn/newcomer?wap=true&toFrom=zjdfxfx' + userphone, // 分享链接
                            imgUrl: 'https://hushenlc.cn/images/activity/zjd/shareico.png', // 分享图标
                            success: function () {
                                alert('分享成功！');
                                if (localStorage.sharezjd) { $('.zjd-box3').show().siblings().hide(); localStorage.sharezjd = false; }
                            },
                            cancel: function () {
                                alert('您取消了分享！');
                            }
                        });
                    })

                }
            ])

        /*特殊产品详情*/
        controllers.controller('exclusiveCtrl'
            , ['$scope', '$rootScope'
                , 'resourceService'
                , '$filter'
                , '$state'
                , '$stateParams'
                , '$location'
                , '$localStorage'
                , function ($scope, $rootScope, resourceService, $filter, $state, $stateParams, $location, $localStorage) {
                    delete $localStorage.coupon;
                    $filter('isPath')('exclusiveCpDetail');
                    $rootScope.title = "专属产品";
                    $scope.toback = function () {
                        if ($rootScope.getUrlParam('from') == 'coupon') {
                            $state.go('myCoupon');
                        }
                        else if ($rootScope.getUrlParam('from') == 'newyearact1') {
                            $state.go('newyearact1', { wap: true });
                        }
                        else {
                            $filter('跳回上一页')(2);
                        }
                    };
                    $scope.yuebiao = {};
                    $scope.mainbox = true;
                    var user = $filter('isRegister')();
                    $scope.toFrom = $rootScope.getUrlParam('toFrom');
                    $scope.active = 0;
                    $scope.isShowRule = false;
                    $scope.showBigImg = false;
                    var $win = $(window);
                    $("html,body").animate({ scrollTop: $("body").offset().top });
                    $win.on('load resize scroll', function () {
                        // $('.check-img-wrap').height($('body').height());
                        $('.check-img-wrap').height($win.height()).width($win.width());
                        $('.check-img-wrap img').css('max-height', $win.height()).css('max-width', $win.width());
                    });
                    $scope.showImg = function (event) {
                        $scope.bigImgSrc = $(event.currentTarget).attr('src');
                        $scope.showBigImg = true;
                    };
                    $scope.slideToggle = function (e) {
                        $(e.currentTarget).parent().siblings("p").stop().slideToggle(200);
                        if ($(e.currentTarget).hasClass('slideDown')) {
                            $(e.currentTarget).removeClass('slideDown')
                        } else { $(e.currentTarget).addClass('slideDown') }
                    };
                    $scope.closeRealverify = function () {
                        $scope.isRealverify = false;
                    };
                    $scope.gologin = function () {
                        $state.go('dl', { returnurl: 'cpDetail?pid=' + $scope.cp.id });
                    };
                    $scope.toInvest = function () {
                        if ($scope.map.realVerify) {
                            if($stateParams.rid) {
                                $state.go('investment',{rid: $stateParams.rid,toFrom: $scope.toFrom});
                            } else {
                                $state.go('investment',{toFrom: $scope.toFrom});
                            }
                        }
                        else {
                            $state.go('authRecharge');
                        }
                    }
                    $scope.$on('resourceService.QUERY_POST_MYEVENT', function (event, data, eObj) {
                        switch (eObj.name) {
                            case 'cpDetail':
                                if(data.map.specialRate) {
                                    data.map.specialRate = parseFloat(data.map.specialRate);
                                }
                                $localStorage.cp = data.map;
                                $scope.yuebiao.name = data.map.name;
                                $scope.yuebiao.isReservation = data.map.isReservation;
                                $scope.yuebiao.prid = data.map.prid;
                                $scope.yuebiao.realverify = data.map.realverify;
                                $scope.linkURL = data.map.linkURL;
                                $scope.appTitle = data.map.appTitle;
                                $scope.cp = data.map.info;

                                $scope.type = data.map.info.type;
                                if ($scope.type == 1) {
                                    $scope.interestmode = '满标后次日计息';
                                } else {
                                    $scope.interestmode = '投资后次日计息';
                                }

                                if($scope.cp.repayType==3 || $scope.cp.repayType==4){
                                    $rootScope.title = "聚划算";
                                }
                                // 双蛋活动添加
                                $scope.doubleEggrule = data.map.doubleEggrule;
                                $scope.specialRate = parseFloat(data.map.specialRate);
                                $scope.isOldUser = data.map.isOldUser;
                                if ($scope.specialRate > 0) {
                                    $scope.isshuangdan = true;
                                }
                                else {
                                    $scope.isshuangdan = false;
                                }

                                if ($scope.cp.atid) { $rootScope.title = "产品投资"; }
                                $rootScope.cpInfo = data.map.repair;
                                $scope.extendInfos = data.map.extendInfos;
                                if ($scope.cp.establish != undefined) {
                                    var date3 = $scope.cp.establish - Date.parse(new Date());
                                    var day = Math.floor(date3 / (24 * 3600 * 1000));
                                    var hh = Math.floor(date3 / (3600 * 1000));
                                    if (day > 0) {
                                        $scope.nowTimer = day + '天';
                                        // $scope.isFinish = true;
                                    } else
                                    if (day == 0 && hh > 1) {
                                        $scope.nowTimer = hh + '小时';
                                        // $scope.isFinish = true;
                                        $scope.isBuTimer = true;
                                    } else
                                    if (day == 0 && hh < 1) {
                                        $scope.nowTimer = '1小时内'
                                        // $scope.isFinish = true;
                                    } else
                                    if (hh < 0) {
                                        if ($scope.cp.type == 1) {
                                            $scope.nowTimer = '无限制';
                                        } else {
                                            $scope.nowTimer = '已结束';
                                        }
                                        $scope.isFinish = true;
                                    }
                                } else {
                                    $scope.nowTimer = '已结束';
                                    $scope.isFinish = true;
                                };

                                /*补标弹窗显示*/
                                if ($stateParams.isShowRule == undefined) {
                                    if ($scope.cpInfo != undefined && $scope.cp.isRepair == 1 && $scope.cp.surplusAmount > 0) {
                                        $rootScope.isShowRule = true;
                                    }
                                } else {
                                    $scope.isShowRule = false;
                                }
                                if ($stateParams.pid) {
                                    resourceService.queryPost($scope, $filter('getUrl')('cpPicAndInvest'), {
                                        pid: $stateParams.pid,
                                        type: $scope.cp.type
                                    }, { name: 'cpPicAndInvest' });
                                }
                                break;
                            case 'cpPicAndInvest':
                                $scope.picList = data.map.picList;
                                $scope.investList = data.map.investList;
                                break;
                            case '是否认证':
                                $scope.map = data.map;
                                break;
                            case '砸蛋':
                                if (data.success) {
                                    $scope.eggs.context.siblings('.chuizi').addClass('za');
                                    setTimeout(function () {
                                        $('.zjd').show();
                                        $('.zjd-box1').show();
                                        localStorage.sharezjd = false;
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
                                    $scope.eggs.obj.maxActivityCoupon = data.map.newActivityCoupon.raisedRates;
                                    setTimeout(function () {
                                        $('.zjd-box4').show().siblings().hide();
                                        $scope.iszadan = true;
                                        $scope.eggs.context.siblings('.chuizi').removeClass('za');
                                    }, 1000);
                                }
                                break;
                        };
                    });

                    $scope.panel1 = {
                        isAction: 1
                    }
                    $scope.panel2 = {
                        isAction: 1
                    }
                    $scope.panel3 = {
                        isAction: 1
                    }
                    $scope.panel4 = {
                        isAction: 1
                    }
                    $scope.onClick = function (name) {
                        switch (name) {
                            case 'closeRule':
                                $scope.isShowRule = false;
                                break;
                        };
                    };
                    $scope.setAction = function (item) {
                        if (item.isAction == 1) {
                            item.isAction = 0;
                        } else {
                            item.isAction = 1;
                        }
                    };

                    $scope.goyuebiao = function () {
                        if ($scope.yuebiao.realverify) {
                            $state.go('yuebiao', { prid: $scope.yuebiao.prid, name: $scope.yuebiao.name, toState: $state.current.name, pid: $stateParams.pid });
                        } else {
                            $scope.isRealverify = true;
                        }
                    };
                    if ($stateParams.pid != null || $stateParams.rid) {
                        var obj = {};
                        obj.pid = $stateParams.pid;
                        if (user.register) {
                            obj.uid = user.user.member.uid;
                            resourceService.queryPost($scope, $filter('getUrl')('我的信息'), {
                                uid: user.user.member.uid
                            }, { name: '是否认证' });
                        }
                        resourceService.queryPost($scope, $filter('getUrl')('cpDetail'), obj, { name: 'cpDetail' });
                    } else {
                        $filter('跳回上一页')(1);
                    };
                    var uid;
                    if (user.user.member) { uid = user.user.member.uid; }
                    $scope.iszadan = true;
                    $scope.eggs = {};
                    $scope.zaEgg = function (e, item) {
                        e.stopPropagation();
                        $scope.eggs.id = item.id;
                        $scope.eggs.context = $(e.currentTarget);
                        if (item.isEgg == 1 && $scope.iszadan) {
                            $scope.iszadan = false;
                            $scope.eggs.obj = item;
                            resourceService.queryPost($scope, $filter('getUrl')('zadan'), { uid: uid, id: item.id }, { name: '砸蛋' });
                        }
                    };
                    $scope.share = function (e) {
                        $('.zjd-box2').show();
                        //setTimeout(function(){$('.zjd-box3').show().siblings().hide();localStorage.sharezjd=false;}, 5000);
                        //$('.zjd-box3').show().siblings().hide();
                    };
                    $scope.zajindan = function (e) {
                        $scope.eggs.context = $(e.currentTarget);
                        if ($scope.iszadan) {
                            resourceService.queryPost($scope, $filter('getUrl')('zadan'), { uid: uid, id: $scope.eggs.id }, { name: '第二次砸蛋' });
                        }
                    };
                    $scope.closethis = function (e) {
                        $(e.currentTarget).hide();
                    }
                    $scope.cancelza = function (e) {
                        e.stopPropagation();
                    };
                    $scope.closeEgg = function () {
                        $('.zjd').hide();
                        $('.zjd').children().hide();
                    };
                    var userphone = "";
                    if ($filter('isRegister')().user.member) { userphone = '&recommCode=' + $filter('isRegister')().user.member.mobilephone; }
                    localStorage.sharezjd = false;
                }
            ])
        // 产品信息详情
        controllers.controller('controllerCpInvestInfo'
            , ['$scope', '$rootScope'
                , 'resourceService'
                , '$filter'
                , '$state'
                , '$stateParams'
                , '$location'
                , '$localStorage'
                , function ($scope, $rootScope, resourceService, $filter, $state, $stateParams, $location, $localStorage) {
                    $filter('isPath')('cpInvestInfo');
                    $scope.user = $filter('isRegister')().user;
                    $scope.pid = $location.$$search.pid;
                    if ($localStorage.cp) {
                        $scope.cp = $localStorage.cp;
                        $scope.balance = $scope.cp.balance;
                        $scope.amount = $scope.cp.xqinfo.amount;
                        resourceService.queryPost($scope, $filter('getUrl')('cpPicAndInvest'), {
                            pid: $scope.cp.info.id,
                            type: $scope.cp.info.type
                        }, { name: 'cpPicAndInvest' });
                    } else {
                        if ($stateParams.pid) {
                            var obj = {};
                            obj.pid = $stateParams.pid;

                        }
                    }
                    if ($stateParams.amount) {
                        $scope.amount = $stateParams.amount;
                        $scope.expect = $stateParams.expect?$stateParams.expect:0;
                    }
                    $scope.isAct = 1;
                    $scope.toback = function () {
                        $filter('跳回上一页')(2);
                    };
                    $scope.reviewEvaluation = function () {
                        $scope.closeDialog();
                        $state.go('startEvaluation',{fromPage:'ceping',pid: $scope.pid});
                    }
                    $scope.yuebiao = {};
                    $scope.mainbox = true;
                    var user = $filter('isRegister')();
                    $scope.toFrom = $rootScope.getUrlParam('toFrom');
                    $scope.active = 0;
                    $scope.isShowRule = false;
                    $scope.showBigImg = false;
                    var $win = $(window);
                    $("html,body").animate({ scrollTop: $("body").offset().top });
                    $win.on('load resize scroll', function () {
                        // $('.check-img-wrap').height($('body').height());
                        $('.check-img-wrap').height($win.height()).width($win.width());
                        $('.check-img-wrap img').css('max-height', $win.height()).css('max-width', $win.width());
                    });
                    if (user.register) {
                        resourceService.queryPost($scope, $filter('getUrl')('我的信息'), {
                            uid: user.user.member.uid
                        }, { name: '是否认证' });
                    }
                    $scope.showImg = function (event) {
                        $scope.bigImgSrc = $(event.currentTarget).attr('src');
                        $scope.showBigImg = true;
                    };
                    $scope.slideToggle = function (e) {
                        $(e.currentTarget).parent().siblings("p").stop().slideToggle(200);
                        if ($(e.currentTarget).hasClass('slideDown')) {
                            $(e.currentTarget).removeClass('slideDown')
                        } else { $(e.currentTarget).addClass('slideDown') }
                    };
                    $scope.closeRealverify = function () {
                        $scope.isRealverify = false;
                    };
                    $scope.gologin = function () {
                        $state.go('dl', { returnurl: 'cpInvestDetail?pid=' + $scope.cp.info.id });
                    };
                    /*$scope.toInvest = function () {
                        if ($scope.map.realVerify) {
                            if($stateParams.rid) {
                                $state.go('investment',{rid: $stateParams.rid,toFrom: $scope.toFrom});
                            } else {
                                $state.go('investment',{toFrom: $scope.toFrom});
                            }
                        }
                        else {
                            $state.go('authRecharge');
                        }
                    }*/
                    $scope.toInvest = function () {
                        // $scope.expectAll = $filter('wisNumber2')($scope.shouyiJc + $scope.shoujiHd + $scope.shouyiTs + $scope.shouyiYhq);
                        if ($scope.cp.xqinfo.amount >= $scope.cp.info.leastaAmount) {
                            if ($scope.cp.xqinfo.amount%$scope.cp.info.increasAmount == 0) {
                                if ($scope.map.realVerify) {
                                    //判断余额是否充足
                                    if ($scope.cp.xqinfo.amount < $scope.cp.balance) {
                                        // 弹出风险提示弹窗
                                        if($scope.cp.showDialog) {
                                            $scope.showRiskDialog = false;
                                            $filter('测评提示弹窗')($scope);
                                        } else {
                                            if($scope.cp.allowInvest) {
                                                $scope.isBalanceSufficient = true;
                                                $filter('支付弹窗')($scope);
                                            } else {
                                                $scope.showRiskDialog = true;
                                                $filter('测评提示弹窗')($scope);
                                            }
                                        }
                                    } else {
                                        $scope.isBalanceSufficient = false;
                                        $filter('支付弹窗')($scope);
                                    }
                                } else {
                                    // $localStorage.cpCoupon = $scope.cpCoupon;
                                    $state.go('investAuthentication',{amount: $scope.cp.xqinfo.amount,expect:$scope.cp.xqinfo.expect});
                                }
                            } else {
                                $filter('investAmountError')('1002','投资金额需为' +  $scope.cp.info.increasAmount + '的整数倍');
                            }
                        } else if ($scope.cp.xqinfo.amount < $scope.cp.info.leastaAmount && $scope.cp.xqinfo.amount != '') {
                            $filter('investAmountError')('1002',"投资金额最少为" + $scope.cp.info.leastaAmount);
                        } else if ( !$scope.cp.xqinfo.amount) {
                            $filter('investAmountError')('1001');
                        }
                    }
                    // 去支付
                    $scope.zhifu = function () {
                        $scope.closeDialog();
                        resourceService.queryPost($scope, $filter('getUrl')('我的信息'), {uid: $scope.user.member.uid}, {name: '我的信息'});
                        $filter('设置交易密码弹窗')($scope);
                    };
                    /*$scope.$watch('amount',function(newValue,oldValue){
                        if ($scope.cp) {
                            if(newValue > $scope.cp.info.surplusAmount) {
                                $scope.amount = oldValue;
                            }
                        }

                    });*/
                    $scope.sendRequest = function () {
                        $scope.closeDialog();
                        $scope.params = {
                            'pid': $localStorage.cp.info.id,
                            'tpwd': $localStorage.userTypes.passWord,
                            'amount': $scope.cp.xqinfo.amount,
                            'uid': $filter('isRegister')().user.member.uid,
                            'activityType': 0
                        }
                        if($localStorage.latestActiveNotReimbursedRecord){
                            $scope.params.rid = $localStorage.latestActiveNotReimbursedRecord.id;
                        }
                        if($scope.cp.fid){
                            $scope.params.fid = $scope.cp.fid;
                        }
                        if (sessionStorage.getItem('AMLId')) {
                            $scope.params.AMLId = sessionStorage.getItem('AMLId');
                        }
                        resourceService.queryPost($scope, $filter('getUrl')('购买产品'), $scope.params, {name: '购买产品'});
                    }

                    $scope.firstSetPwd = false;
                    $scope.enterPassword =function (flag) {
                        var ul = $(".pwd li");
                        $scope.pwd = $('#tradePwd').val();
                        var len = $scope.pwd.length;
                        for(var i=0;i<6;i++){
                            if(i < len){
                                $(ul[i]).addClass("active");
                            }else{
                                $(ul[i]).removeClass("active");
                            }
                        }
                        if(len == 6 && flag == 1){
                            if($scope.firstSetPwd) {
                                if($localStorage.userTypes.passWord1 == $scope.pwd) {
                                    $localStorage.userTypes.passWord = $scope.pwd;
                                    resourceService.queryPost($scope, $filter('getUrl')('设置交易密码'),{
                                        tpwd: $localStorage.userTypes.passWord,
                                        chkSmsCode: false,
                                        uid: $scope.user.member.uid
                                    },{ name: '设置交易密码'  });
                                } else {
                                    $filter('investAmountError')('1003');
                                    $scope.firstSetPwd = false;
                                }
                            } else {
                                $localStorage.userTypes.passWord1 = $scope.pwd;
                                $scope.firstSetPwd = !$scope.firstSetPwd;
                            }
                        }
                        if(len == 6 && flag == 2){
                            $localStorage.userTypes.passWord = $scope.pwd;
                            $scope.sendRequest();
                        }
                    };
                    // 忘记密码
                    $scope.toRetPwd = function () {
                        $scope.closeDialog();
                        $state.go('resetTradePwd',{firstset:false});
                    };
                    $scope.$on('resourceService.QUERY_POST_MYEVENT', function (event, data, eObj) {
                        switch (eObj.name) {
                            case 'cpDetail':
                                if(data.map.specialRate) {
                                    data.map.specialRate = parseFloat(data.map.specialRate);
                                }
                                $scope.cp = data.map;
                                $scope.riskname = ($scope.cp.info.riskname == '' ||$scope.cp.info.riskname == null || $scope.cp.info.riskname == undefined) ? false:true;
                                break;
                            case 'cpPicAndInvest':
                                $scope.picList = data.map.picList;
                                $scope.investList = data.map.investList;
                                break;
                            case '是否认证':
                                $scope.map = data.map;
                                break;
                            case '我的信息':
                                if(data.success) {
                                    $scope.tpwdFlag = data.map.tpwdFlag;
                                    $scope.pwdFlag = $scope.tpwdFlag == 1 ? true:false;
                                }
                                break;
                            case '购买产品':
                                if (data.success) {
                                    $scope.successData = $scope.cp;
                                    $scope.successData.shouyi = data.map.shouyi;
                                    $scope.successData.investAmount = $scope.cp.xqinfo.amount;
                                    $scope.successData.coupon = $scope.cpCoupon ? $scope.cpCoupon : 0;
                                    if ($scope.cpCoupon) {
                                        $scope.successData.raisedRates = $scope.cpCoupon.raisedRates;
                                        $scope.successData.multiple = $scope.cpCoupon.multiple;
                                    }
                                    if (data.map.wxGetSize) {
                                        $scope.successData.wxGetSize = data.map.wxGetSize;
                                    }
                                    if (sessionStorage.getItem('AMLId')) {
                                        sessionStorage.removeItem('AMLId');
                                        sessionStorage.setItem('wxhuhd','wxhuhd')
                                    }
                                    $scope.successData.investTime = data.map.investTime;
                                    $scope.successData.isRepeats = data.map.isRepeats;
                                    $scope.successData.luckCodeCount = data.map.luckCodeCount;
                                    $scope.successData.luckCodes = data.map.luckCodes;
                                    $scope.successData.activityURL = data.map.activityURL;
                                    $scope.successData.jumpURL = data.map.jumpURL;
                                    $scope.successData.isGivenLotteryOpp = data.map.isGivenLotteryOpp;
                                    $scope.successData.cfcaSwitchFlag = data.map.cfcaSwitchFlag;
                                    $localStorage.successData = $scope.successData;
                                    // 春节活动期间投资成功跳到特定成功页面
                                    $scope.isInNewYearActivityTime = data.map.isInNewYearActivityTime;
                                    if ($scope.isInNewYearActivityTime) {
                                        $state.go('newYInvestSuc');
                                    } else {
                                        if ($scope.cp.info.fullName.indexOf('恩弗') != -1) {
                                            $scope.successData = $scope.cp;
                                            $scope.successData.enFuConvertCode = data.map.enFuConvertCode;
                                            $scope.successData.pid = data.map.pid;
                                            $scope.successData.shouyi = data.map.shouyi;
                                            $scope.successData.rate = $scope.cp.info.rate;
                                            $scope.successData.fullName = $scope.cp.info.fullName;
                                            $scope.successData.deadline = $scope.cp.info.deadline;
                                            $localStorage.successEnfu = $scope.successData;
                                            $localStorage.user.enFuProductId = $scope.cp.info.id;
                                            ngDialog.closeAll();
                                            $state.go('enfuInvestSuc',{});
                                        } else {
                                            $state.go('investSuccess');
                                        }
                                    }

                                } else {
                                    if (data.errorCode == '2001') {
                                        $filter('投资交易密码错误信息')($scope);
                                    } else if (data.errorCode == '1007'){
                                        if($localStorage.latestActiveNotReimbursedRecord){
                                            $scope.rid = $localStorage.latestActiveNotReimbursedRecord.id;
                                        }
                                        $filter('投资错误信息')(data.errorCode, $scope, 'y',data.errorMsg);
                                        setTimeout(function () {
                                            $state.go('recharge',{wap:'true',rid: $scope.rid,amount: $scope.amount});
                                        }, 2000);
                                    } else {
                                        $filter('投资错误信息')(data.errorCode, $scope, 'y',data.errorMsg);
                                    }
                                }
                                break;
                            case '设置交易密码':
                                if (data.success) {
                                    $scope.sendRequest();
                                } else {
                                    if(data.errorMsg) {
                                        ngDialog.open({
                                            template: '<p class="error-msg">' + data.errorMsg + '</p>',
                                            showClose: false,
                                            closeByDocument: true,
                                            plain: true
                                        });
                                        setTimeout(function () {
                                            ngDialog.closeAll();
                                        }, 1500);
                                    } else {
                                        $filter('重置交易密码错误信息')(data.errorCode,$scope)
                                    }
                                }
                                break;
                        }
                    });

                    $scope.panel1 = {
                        isAction: 1
                    }
                    $scope.panel2 = {
                        isAction: 1
                    }
                    $scope.panel3 = {
                        isAction: 1
                    }
                    $scope.panel4 = {
                        isAction: 1
                    }
                    $scope.onClick = function (name) {
                        switch (name) {
                            case 'closeRule':
                                $scope.isShowRule = false;
                                break;
                        };
                    };
                    $scope.setAction = function (item) {
                        if (item.isAction == 1) {
                            item.isAction = 0;
                        } else {
                            item.isAction = 1;
                        }
                    };
                    console.log($scope.amount)


                }
            ])
    })