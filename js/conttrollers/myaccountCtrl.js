define(['jweixin', 'js/module.js', 'jquery', 'ngdialog'], function (wx, controllers, $, ngdialog) {
    'use strict';
    controllers.controller('accountHomeCtrl', ['$scope', 'resourceService', '$filter', '$state', '$rootScope', '$localStorage', 'ngDialog', 'isWeixin', '$timeout', '$stateParams', function ($scope, resourceService, $filter, $state, $rootScope, $localStorage, ngDialog, isWeixin, $timeout, $stateParams) {
    	/*初始菜单设置  1：首页  2：我要投资  3：我的账户  4：更多*/
        $filter('isPath')('main.myaccountHome');
        document.getElementsByTagName('html')[0].scrollTop = 0;
        document.getElementsByTagName('body')[0].scrollTop = 0;
        $localStorage.activeMenu = 3;
        $rootScope.title = "";
        $scope.isShowEye = true;
        $scope.userOBJ = $filter('isRegister')();
        $scope.user = $scope.userOBJ.user.member;
//      if (!!$scope.userOBJ.user.member.idCards){
//      		$scope.idCards = $scope.userOBJ.user.member.idCards;
//      }
        function cancelBubble(e) {
            var evt = e ? e : window.event;
            if (evt.stopPropagation) {
                evt.stopPropagation();
            }
            else {
                evt.cancelBubble = true;
            }
        }
        $scope.clickEye = function (e) {
            $scope.isShowEye = !$scope.isShowEye;
            cancelBubble(e);
        };
        $scope.tomyassets = function () {
            $state.go('myAssets',{page: 2})
        };
        $scope.date = new Date().getTime();
        if ($stateParams.success == 'true') {
            if ($stateParams.type == 0) {
                ngDialog.open({
                    template: '<p class="error-msg">银行存管已开户</p>',
                    showClose: false,
                    closeByDocument: true,
                    plain: true
                });
            }
            else if ($stateParams.type == 1) {
                ngDialog.open({
                    template: '<p class="error-msg">充值成功</p>',
                    showClose: false,
                    closeByDocument: true,
                    plain: true
                });
            }
            else if ($stateParams.type == 2) {
                ngDialog.open({
                    template: '<p class="error-msg">提现成功</p>',
                    showClose: false,
                    closeByDocument: true,
                    plain: true
                });
            }
            // else if ($stateParams.type == 3) {
            //     ngDialog.open({
            //         template: '<p class="error-msg">修改存管交易密码成功</p>',
            //         showClose: false,
            //         closeByDocument: true,
            //         plain: true
            //     });
            // }
        }
        else if ($stateParams.errorCode == '9999') {
            $filter('服务器信息')($stateParams.errorCode, $scope, 'y')
        }
        else if ($stateParams.errorMsg) {
            ngDialog.open({
                template: '<p class="error-msg">' + $stateParams.errorMsg + '</p>',
                showClose: false,
                closeByDocument: true,
                plain: true
            });
        }
        else {
            ngDialog.closeAll();
        }
        $scope.closeDepository = function () {
            $('.depository').fadeOut(200);
        }
        $scope.toRecharge = function () {
       	 	if ($scope.user.realVerify) {
                $state.go('recharge', { from: 'home', wap: true });
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
        $scope.toGetCash = function () {
            if ($scope.user.realVerify) {
                $state.go('getCash', { from: 'home', wap: true });
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
        if ($scope.userOBJ.register) {
            resourceService.queryPost($scope, $filter('getUrl')('myacc'), {
                uid: $scope.userOBJ.user.member.uid
            }, '我的账户');
        } else {
            $state.go('dl');
            return;
        };
        $scope.hongbaoShow = false;
        $scope.hongbaoShow2 = false;
        $scope.openredpackets = function () {
            $scope.hongbaoShow2 = false;
            $scope.hongbaoShow = true;
            $("body,html").css({ "overflow": "hidden", "height": "100%" });
        };
        $scope.closeredpackets = function () {
            $scope.hongbaoShow = false;
            $("body,html").css({ "overflow": "auto", "height": "auto" });
        };
        /*// 点击我要提现出弹框
        $scope.openredpackets2 = function () {
            if ($scope.youxiaohb == true) {
                $scope.hongbaoShow = false;
                $scope.hongbaoShow2 = true;
                $("body,html").css({ "overflow": "hidden", "height": "100%" });
            } else {
                $scope.hongbaoShow = false;
                $scope.hongbaoShow2 = false;
                $state.go('getCash');
                //$scope.hongbaoShow2=false;
                //$("body,html").css({"overflow":"auto","height":"auto"});
            }

        };*/
        $scope.closeredpackets2 = function () {
            $scope.hongbaoShow = false;
            $scope.hongbaoShow2 = false;
            $("body,html").css({ "overflow": "auto", "height": "auto" });
        };
        $scope.closepackets2 = function () {
            $state.go('getCash');
            $scope.hongbaoShow = false;
            $scope.hongbaoShow2 = false;
            $("body,html").css({ "overflow": "auto", "height": "auto" });
        }
        $filter('isPath')('main.myaccountHome');

        $scope.shareUrl = 'https://hushenlc.cn/friendreg?recommCode=' + $scope.user.mobilephone;
        function IsPC() {
            var userAgentInfo = navigator.userAgent;
            var Agents = ["Android", "iPhone",
                "SymbianOS", "Windows Phone",
                "iPad", "iPod"];
            var flag = true;
            for (var v = 0; v < Agents.length; v++) {
                if (userAgentInfo.indexOf(Agents[v]) > 0) {
                    flag = false;
                    break;
                }
            }
            return flag;
        };
        resourceService.queryPost($scope, $filter('getUrl')('首次评测显示'), {uid: $scope.user.uid}, '首次评测显示');
        $scope.$on('resourceService.QUERY_POST_MYEVENT', function (event, data, type) {
            switch (type) {
                case '我的账户':
                    if (data.success) {
                        data.map.isPayment = false;
                        $scope.accunt = data.map;
                        $scope.isDs = data.map.isDs;
                        $scope.backAmount = data.map.backAmount;
                        resourceService.queryPost($scope, $filter('getUrl')('getPromoteRedelivery'), {
                            uid: $scope.userOBJ.user.member.uid
                        }, '有效红包');
                        if (data.map.isPayment == true) {
                            $scope.hongbaoicon = 1;
                            $scope.iconhongbao = true;
                            if ($localStorage.hongbaoeveryday) {
                                $scope.hongbaoShow = true;
                                delete $localStorage.hongbaoeveryday;
                            }
                        } else {
                            $scope.iconhongbao = false;
                            $scope.hongbaoicon = 2;
                            $scope.hongbaoShow = false;
                        }
                        if($localStorage.user) {
                            $localStorage.user.member.balance = data.map.balance;
                            $localStorage.user.member.free = data.map.free;
                            $localStorage.user.realName = data.map.realName;
                            $localStorage.user.member.realVerify = data.map.realVerify;
                            $localStorage.user.member.sex = data.map.sex;
                            $localStorage.user.member.unReadMsg = data.map.unReadMsg;
                            $localStorage.user.member.winterest = data.map.winterest;
                            $localStorage.user.member.wprincipal = data.map.wprincipal;
                        }
                        $scope.unclaimed = data.map.unclaimed;
                        $scope.rfid = data.map.afid;
                    } else {
                        $filter('服务器信息')(data.errorCode, $scope, 'y')
                    }
                    break;
                case '领取奖励':
                    $scope.hongbao = {};
                    $scope.hongbao.amount = data.map.amount;
                    $('.activity-firend-hongbao').fadeIn(200);
                    $('.yaoqing').fadeOut(200);
                    break;
                case '有效红包':
                    if (data.success == true) {
                        $scope.youxiaohb = true;
                        $scope.hongbaoData = data.map;
                        $scope.iconhongbao = true;
                        if ($scope.hongbaoShow == false && $localStorage.hongbaoeveryday) {
                            $scope.hongbaoShow = true;
                            delete $localStorage.hongbaoeveryday;
                        }
                    } else {
                        $scope.youxiaohb = false;
                        if ($scope.iconhongbao == false) {
                            $scope.iconhongbao = false;
                        }
                    }
                    break;
                case '红包投资详情':
                    if (data.success) {
                        $scope.hongbaoShow = false;
                        $scope.hongbaoShow2 = false;
                        $state.go('main.bankBillList');
                        // if (data.map.pid != -1) {
                        //     $state.go('investment', { pid: data.map.pid, cpid: $scope.activefid });
                        // } else {
                        // }
                    }
                    break;
                case '首次评测显示':
                    if (data.success) {
                        $scope.evaluateData= data.map;
                    }
                    break;
            };
        });
        $scope.onClick = function (argument) {
            switch (argument) {
                case 'yes':
                    $filter('清空缓存')();
                    $state.go('dl');
                    ngDialog.closeAll();
                    $scope.hongbaoShow = false;
                    $scope.hongbaoShow2 = false;
                    break;
            };
        };
        $scope.gotoInvest = function (item) {
            $scope.hongbaoShow2 = false;
            $("body,html").css({ "overflow": "auto", "height": "auto" });
            resourceService.queryPost($scope, $filter('getUrl')('getUse'), {
                uid: $scope.userOBJ.user.member.uid,
                fid: item.id
            }, '红包投资详情');
            $scope.activefid = item.id;
        };
        $scope.lingqu = function () {
            resourceService.queryPost($scope, $filter('getUrl')('getTheRewards'), { uid: $localStorage.user.member.uid, afid: $scope.rfid }, '领取奖励');
        };
        $scope.lijiyaoqing = function () {
            if (isWeixin()) {
                $('.activity-firend-boxweixin').fadeIn(200);
            } else {
                $('.activity-firend-boxh5').fadeIn(200);
            }
        };
        $scope.copyShare = function () {
            var e = document.getElementById("shareurl");//对象是contents 
            e.select(); //选择对象 
            document.execCommand("Copy");
            $scope.isCopy = true;
            if (IsPC()) {
                $scope.isCopytext = '链接已复制';
            } else {
                $scope.isCopytext = '长按文字全选复制链接';
            }
        }
        $scope.closeshareh5 = function () {
            $('.activity-firend-boxh5').fadeOut(200);
        }
        $scope.default = function (e) {
            e.stopPropagation();
        }
        $scope.closeshareweixin = function () {
            $('.activity-firend-boxweixin').fadeOut(200);
        };
        $scope.closehongbao = function () {
            $('.activity-firend-hongbao').fadeOut(200);
        };
        var linkstr = "";
        if ($scope.user && $scope.user.mobilephone) {
            linkstr = '&recommCode=' + $scope.user.mobilephone;
        }
        wx.ready(function () {
            wx.onMenuShareTimeline({
                title: '撸起袖子加油赚，想财富自由先来领第一桶金！', // 分享标题
                link: 'https://hushenlc.cn/friendreg?wap=true' + linkstr, // 分享链接
                imgUrl: 'https://hushenlc.cn/images/activity/firend/share.png', // 分享图标
                success: function () {
                    alert('分享成功！');
                },
                cancel: function () {
                    alert('您取消了分享！');
                }
            });
            wx.onMenuShareAppMessage({
                title: '撸起袖子加油赚，想财富自由先来领第一桶金！', // 分享标题
                desc: '送10万元体验金、666元红包、1.2倍翻倍券等新手大礼包！', // 分享描述
                link: 'https://hushenlc.cn/friendreg?wap=true' + linkstr, // 分享链接
                imgUrl: 'https://hushenlc.cn/images/activity/firend/share.png', // 分享图标
                success: function () {
                    alert('分享成功！');
                },
                cancel: function () {
                    alert('您取消了分享！');
                }
            });
            wx.onMenuShareQQ({
                title: '撸起袖子加油赚，想财富自由先来领第一桶金！', // 分享标题
                desc: '送10万元体验金、666元红包、1.2倍翻倍券等新手大礼包！', // 分享描述
                link: 'https://hushenlc.cn/friendreg?wap=true' + linkstr, // 分享链接
                imgUrl: 'https://hushenlc.cn/images/activity/firend/share.png', // 分享图标
                success: function () {
                    alert('分享成功！');
                },
                cancel: function () {
                    alert('您取消了分享！');
                }
            });
            wx.onMenuShareWeibo({
                title: '撸起袖子加油赚，想财富自由先来领第一桶金！', // 分享标题
                desc: '送10万元体验金、666元红包、1.2倍翻倍券等新手大礼包！', // 分享描述
                link: 'https://hushenlc.cn/friendreg?wap=true' + linkstr, // 分享链接
                imgUrl: 'https://hushenlc.cn/images/activity/firend/share.png', // 分享图标
                success: function () {
                    alert('分享成功！');
                },
                cancel: function () {
                    alert('您取消了分享！');
                }
            });
            wx.onMenuShareQZone({
                title: '撸起袖子加油赚，想财富自由先来领第一桶金！', // 分享标题
                desc: '送10万元体验金、666元红包、1.2倍翻倍券等新手大礼包！', // 分享描述
                link: 'https://hushenlc.cn/friendreg?wap=true' + linkstr, // 分享链接
                imgUrl: 'https://hushenlc.cn/images/activity/firend/share.png', // 分享图标
                success: function () {
                    alert('分享成功！');
                },
                cancel: function () {
                    alert('您取消了分享！');
                }
            });
        })
    }]);
})
