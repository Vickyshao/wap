define(['jweixin', 'js/module.js', 'jquery', 'ngdialog', 'SHR256'], function (wx, controllers, $, ngdialog, SHR256) {
    controllers.controller('thirdInvitationCtrl', ['$scope', '$rootScope', 'resourceService', '$filter', '$state', 'ngDialog', '$location', 'md5', '$localStorage', '$stateParams', 'isWeixin','signWeChatService', function ($scope, $rootScope, resourceService, $filter, $state, ngDialog, $location, md5, $localStorage, $stateParams, isWeixin,signWeChatService) {
        $("html,body").scrollTop(0);
        signWeChatService();
        $filter('isPath')('thirdInvitation');
        $scope.amount1 = null;
        $scope.amount2 = null;
        $rootScope.title = '人脉变钱脉';
        $scope.goLook = function() {
            $filter('三级邀请规则弹窗')($scope);
        };
        $scope.calcPop = function() {
            $filter('三级邀请奖励计算器')($scope);
        };
        $scope.toback = function() {
            $filter('跳回上一页')(2);
        };
        /*奖励明细*/
        $scope.showList = function() {
            $filter('奖励明细弹窗')($scope);
        };
        $scope.isInActivityTime = true;
        $scope.hideBox1 = function (num) {
            if ($(".entry1").attr("disabled")) {
                $(".entry1").removeAttr("disabled")
            }
            $(".entry1").focus();
        }
        $scope.hideBox = function (num) {
            if ($(".entry").attr("disabled")) {
                $(".entry").removeAttr("disabled")
            }
            $(".entry").focus();
        }
        //活动时间判断
        resourceService.queryPost($scope, $filter('getUrl')('三级邀请'),{}, { name: '三级邀请' });
        $scope.invitationInfo = {
            // inviteList: [
            //     {
            //         addTime: 1523413667000,
            //         invest: 10,
            //         // invite: 0,
            //         mobilePhone: "13221735367"
            //     }
            // ],
            // isInActivityTime: true,
            // totalEarn: 10,
            // totalInvite: 1
        }

        $scope.isLogin = $filter('isRegister')().register;
        $scope.userOBJ = $filter('isRegister')().user;
        if($rootScope.fromNative) {
            $('.third-invitation').removeClass('headerTop');
            $scope.uid = $rootScope.getUrlParam('uid');
            $scope.token = $rootScope.getUrlParam('token');
            if ($scope.uid && $scope.token) {
                $scope.isLogin = true;
            } else {
                $scope.isLogin = false;
            }
            resourceService.queryPost($scope, $filter('getUrl')('三级邀请'),{uid: $scope.uid, token: $scope.token}, { name: '三级邀请' });
        } else{
            if($scope.isLogin) {
                $scope.uid = $scope.userOBJ.member.uid;
                resourceService.queryPost($scope, $filter('getUrl')('三级邀请'),{uid: $scope.uid}, { name: '三级邀请' });
            }
        }
        $scope.$on('resourceService.QUERY_POST_MYEVENT', function (event, data, type) {
            switch (type.name) {
                case '三级邀请':
                    if (data.success) {
                        $scope.invitationInfo = data.map;
                        $scope.isInActivityTime = data.map.isInActivityTime;
                    }
                    break;
            }
        });
        // 分享相关
        function IsPC() {
            var userAgentInfo = navigator.userAgent;
            var Agents = ["Android", "iPhone",
                "SymbianOS", "Windows Phone",
                "iPad", "iPod"
            ];
            var flag = true;
            for (var v = 0; v < Agents.length; v++) {
                if (userAgentInfo.indexOf(Agents[v]) > 0) {
                    flag = false;
                    break;
                }
            }
            return flag;
        }
        /*右上角邀请*/
        $scope.invite = function() {
            if($rootScope.fromNative) {
                if (!$scope.isLogin) {
                    document.location = 'hushentologin:';
                }
            } else {
                if($scope.isLogin) {
                    if (isWeixin()) {
                        $('.activity-tjs-boxweixin').fadeIn(200);
                    } else {
                        $('.activity-tjs-boxh5').fadeIn(200);
                    }
                    // $scope.closeDialog();
                } else {
                    $state.go('dl', {
                        // returnurl: 'thirdInvitation',
                        returnurl: 'myInvitation',
                        wap: true
                    })
                }
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
        $scope.default = function(e) {
            e.stopPropagation();
        }
        $scope.closeshareweixin = function() {
            $('.activity-tjs-boxweixin').fadeOut(200);
        };


        /*邀友赚现金(底部按钮)*/
        $scope.goToLogin = function() {
            if($rootScope.fromNative) {
                if (!$scope.isLogin) {
                    document.location = 'hushentologin:';
                } else{
                    document.location = 'hushenshare2:';
                }
            } else {
                if(!$scope.isLogin) {
                    $state.go('dl', {
                        // returnurl: 'thirdInvitation',
                        returnurl: 'myInvitation',
                        wap: true
                    })
                } else {
                    if (isWeixin()) {
                        $('.activity-tjs-boxweixin').fadeIn(200);
                    } else {
                        $('.activity-tjs-boxh5').fadeIn(200);
                    }
                }
            }
        };
        /*奖励明细弹窗--邀请*/
        $scope.getReward = function() {
            if($rootScope.fromNative) {
                if (!$scope.isLogin) {
                    document.location = 'hushentologin:';
                } else{
                    document.location = 'hushenshare2:';
                }
            } else {
                if(!$scope.isLogin) {
                    $state.go('dl', {
                        // returnurl: 'thirdInvitation',
                        returnurl: 'myInvitation',
                        wap: true
                    })
                } else {
                    if (isWeixin()) {
                        $('.activity-tjs-boxweixin').fadeIn(200);
                    } else {
                        $('.activity-tjs-boxh5').fadeIn(200);
                    }
                    $scope.closeDialog();
                }
            }
        };
        /*微信分享*/
        var linkstr = "";
        var sharer = "";
        if (!$rootScope.fromNative) {
            if($scope.isLogin) {
                if ($scope.userOBJ && $scope.userOBJ.member.mobilephone) {
                    linkstr = '&mobilePhone=' + $scope.userOBJ.member.mobilephone;
                }
                if ($scope.userOBJ) {
                    if ($scope.userOBJ.realName) {
                        sharer = '**'+ $scope.userOBJ.realName.charAt($scope.userOBJ.realName.length - 1);
                    } else {
                        if($scope.userOBJ.member.realName) {
                            sharer = '**'+ $scope.userOBJ.member.realName.charAt($scope.userOBJ.member.realName.length - 1);
                        } else {
                            sharer = '您的朋友'
                        }
                    }
                }
            }
        }
        wx.ready(function () {
            wx.onMenuShareTimeline({
                title: sharer + '送您10元话费，速领>>', // 分享标题
                link: 'https://m.hushenlc.cn/welcom?wap=true' + linkstr, // 分享链接
                // link: 'http://devm.shcen.com/welcom?wap=true' + linkstr, // 测试
                imgUrl: 'https://m.hushenlc.cn/images/activity/firend/share.png', // 分享图标
                // imgUrl: 'http://devm.shcen.com/images/activity/firend/share.png', // 分享图标测试
                success: function () {
                    alert('分享成功！');
                },
                cancel: function () {
                    alert('您取消了分享！');
                }
            });
            wx.onMenuShareAppMessage({
                title: sharer + '送您10元话费，速领>>', // 分享标题
                desc: '好朋友有钱就该一起赚，闲钱就放沪深理财，我已经赚了一部手机了~~', // 分享描述
                link: 'https://m.hushenlc.cn/welcom?wap=true' + linkstr, // 分享链接
                // link: 'http://devm.shcen.com/welcom?wap=true' + linkstr, // 测试
                imgUrl: 'https://m.hushenlc.cn/images/activity/firend/share.png', // 分享图标
                // imgUrl: 'http://devm.shcen.com/images/activity/firend/share.png', // 分享图标测试
                success: function () {
                    alert('分享成功！');
                },
                cancel: function () {
                    alert('您取消了分享！');
                }
            });
            wx.onMenuShareQQ({
                title: sharer + '送您10元话费，速领>>', // 分享标题
                desc: '好朋友有钱就该一起赚，闲钱就放沪深理财，我已经赚了一部手机了~~', // 分享描述
                link: 'https://m.hushenlc.cn/welcom?wap=true' + linkstr, // 分享链接
                // link: 'http://devm.shcen.com/welcom?wap=true' + linkstr, // 测试
                imgUrl: 'https://m.hushenlc.cn/images/activity/firend/share.png', // 分享图标
                // imgUrl: 'http://devm.shcen.com/images/activity/firend/share.png', // 分享图标测试
                success: function () {
                    alert('分享成功！');
                },
                cancel: function () {
                    alert('您取消了分享！');
                }
            });
            wx.onMenuShareWeibo({
                title: sharer + '送您10元话费，速领>>', // 分享标题
                desc: '好朋友有钱就该一起赚，闲钱就放沪深理财，我已经赚了一部手机了~~', // 分享描述
                link: 'https://m.hushenlc.cn/welcom?wap=true' + linkstr, // 分享链接
                // link: 'http://devm.shcen.com/welcom?wap=true' + linkstr, // 测试
                imgUrl: 'https://m.hushenlc.cn/images/activity/firend/share.png', // 分享图标
                // imgUrl: 'http://devm.shcen.com/images/activity/firend/share.png', // 分享图标测试
                success: function () {
                    alert('分享成功！');
                },
                cancel: function () {
                    alert('您取消了分享！');
                }
            });
            wx.onMenuShareQZone({
                title: sharer + '送您10元话费，速领>>', // 分享标题
                desc: '好朋友有钱就该一起赚，闲钱就放沪深理财，我已经赚了一部手机了~~', // 分享描述
                link: 'https://m.hushenlc.cn/welcom?wap=true'+linkstr, // 分享链接
                // link: 'http://devm.shcen.com/welcom?wap=true' + linkstr, // 测试
                imgUrl: 'https://m.hushenlc.cn/images/activity/firend/share.png', // 分享图标
                // imgUrl: 'http://devm.shcen.com/images/activity/firend/share.png', // 分享图标测试
                success: function () {
                    alert('分享成功！');
                },
                cancel: function () {
                    alert('您取消了分享！');
                }
            });
        })

    }])
})