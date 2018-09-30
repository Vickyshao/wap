define(['jweixin', 'js/module.js'], function (wx, controllers) {
    controllers.controller('myInvitationCtrl',['$scope', '$rootScope', '$filter', '$state', 'resourceService', '$stateParams', '$localStorage','isWeixin','signWeChatService','ngDialog', function ($scope, $rootScope, $filter, $state, resourceService,$stateParams,$localStorage,isWeixin,signWeChatService,ngDialog) {
        signWeChatService();
        $('body').scrollTop(0);
        $rootScope.title = "我的邀请";
        $filter('isPath')('myInvitation');
        $scope.userOBJ = $filter('isRegister')();
        $scope.realName = '';
        if($scope.userOBJ.user.realName) {
            $scope.realName = '&realName='+ $scope.userOBJ.user.realName
        }
        if($rootScope.fromNative) {
            $('.my-invitation-wrapper').css('padding-top','0');
        }
        resourceService.queryPost($scope, $filter('getUrl')('邀请好友历史中奖'), {pageOn: 1, pageSize: 30}, '邀请好友历史中奖');
        $scope.cancle = function () {
            $scope.closeDialog();
        }
        $scope.toLogin = function () {
            $scope.closeDialog();
            if ($rootScope.fromNative){
                document.location = 'hushentologin:';
            } else {
                $state.go('dl');
            }
        }
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
        };
        $scope.checkLogin =function () {
            if($rootScope.fromNative) {
                if($rootScope.getUrlParam('uid')){
                    if($rootScope.getUrlParam('version')) {
                        document.location = 'hushentoinvitationrecord:';
                    } else {
                        $state.go('invitationRecord',{uid: $rootScope.getUrlParam('uid'),token: $rootScope.getUrlParam('token') });
                    }
                } else {
                    $filter('登录弹窗')($scope);
                }
            } else {
                if($scope.userOBJ.register) {
                    $state.go('invitationRecord');
                } else {
                    $filter('登录弹窗')($scope);
                }
            }
        }
        $scope.invitation =function () {
            if($rootScope.fromNative) {
                document.location = 'hushenshare2:';
            } else {
                if($scope.userOBJ.register) {
                    $('.activity-tjs-boxh5').fadeIn(200);
                } else {
                    $state.go('dl');
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


        // 领取奖金
        $scope.lingqu = function () {
            resourceService.queryPost($scope, $filter('getUrl')('getTheRewards'), { uid: $scope.userOBJ.user.member.uid, afid: $scope.data.threePresentAfid }, '领取奖励');
        };
        $scope.closehongbao = function () {
            $('.activity-firend-hongbao').fadeOut(200);
        };
        var $dataTable = $('.data-table');
        var trHeight = $('.data-list').height()/5;
        $scope.$on('resourceService.QUERY_POST_MYEVENT', function (event, data, type) {
            switch (type) {
                case '邀请好友历史中奖':
                    if (data.success) {
                        $scope.investList = data.map.pageData.rows;
                        $scope.total = data.map.pageData.total;
                        // 列表数据轮动
                        if ($scope.investList.length > 4) {
                            setInterval(function() {
                                $dataTable.animate({'margin-top': '-'+trHeight+'px'},1000,function() {
                                    $dataTable.find('tr').eq(0).appendTo($dataTable);
                                    $dataTable.css('margin-top',0);
                                });
                            }, 3000);
                        }
                    } else {
                        $filter('服务器信息')(data.errorCode, $scope, 'y');
                    }
                    break;
                case '领取奖励':
                    if (data.success){
                        $scope.hongbaoAmount = data.map.amount;
                        $('.activity-firend-hongbao').fadeIn(200);
                        resourceService.queryPost($scope, $filter('getUrl')('我的邀请'), {uid: $scope.userOBJ.user.member.uid,}, '我的邀请');
                    }
                    break;
            };
        });
        $scope.toback = function () {
            $filter('跳回上一页')(2);
        };
        var linkstr = "";
        if ($scope.user && $scope.user.member.mobilephone) {
            linkstr = '&recommCode=' + $scope.user.member.mobilephone;
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
    }])
    .controller('invitationRecordCtrl', function ($scope, $rootScope, $filter, $state, resourceService, isWeixin,signWeChatService) {
        signWeChatService();
        $('body').scrollTop(0);
        $rootScope.title = "沪深理财-网贷投资，国企控股平台";
        $filter('isPath')('invitationRecord');
        $scope.userOBJ = $filter('isRegister')();
        if($rootScope.fromNative) {
            $('.my-invitation-wrapper').css('padding-top','0');
        }
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
        };
        $scope.invitation =function () {
            if($rootScope.fromNative) {
                document.location = 'hushenshare2:';
            } else {
                if($scope.userOBJ.register) {
                    $('.activity-tjs-boxh5').fadeIn(200);
                } else {
                    $state.go('dl');
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

        // 领取奖金
        $scope.lingqu = function () {
            resourceService.queryPost($scope, $filter('getUrl')('getTheRewards'), { uid: $scope.userOBJ.user.member.uid, afid: $scope.data.threePresentAfid }, '领取奖励');
        };
        $scope.closehongbao = function () {
            $('.activity-firend-hongbao').fadeOut(200);
        };
        var obj = {pageSize: 30,pageOn: 1 };
        if($rootScope.fromNative) {
            obj.uid = $rootScope.getUrlParam('uid');
            obj.token = $rootScope.getUrlParam('token');
        } else {
            obj.uid= $scope.userOBJ.user.member.uid;
        }
        resourceService.queryPost($scope, $filter('getUrl')('中奖记录'), obj, '中奖记录');
        $scope.$on('resourceService.QUERY_POST_MYEVENT', function (event, data, type) {
            switch (type) {
                case '我的邀请':
                    if (data.success) {
                        $scope.data = data.map;
                        if($scope.data) {
                            $scope.firstInvestList = data.map.firstInvestList;
                            $scope.repeatInvestList = data.map.repeatInvestList;
                        }
                    } else {
                        $filter('服务器信息')(data.errorCode, $scope, 'y');
                    }
                    break;
                case '中奖记录':
                    if (data.success){
                        $scope.recordList = data.map.page.rows;
                        $scope.totalAmount = data.map.totalAmount;
                        $scope.inviteNumbers = data.map.inviteNumbers;
                        angular.forEach($scope.recordList,function(item,index){
                            item.showyear =true;
                            if(index == '0') {
                                item.showyear =false;
                            }
                        });
                    }
                    break;
                case '领取奖励':
                    if (data.success){
                        $scope.hongbaoAmount = data.map.amount;
                        $('.activity-firend-hongbao').fadeIn(200);
                        resourceService.queryPost($scope, $filter('getUrl')('我的邀请'), {uid: $scope.userOBJ.user.member.uid,}, '我的邀请');
                    }
                    break;
            };
        });
        $scope.toback = function () {
            $filter('跳回上一页')(2);
        };
        var linkstr = "";
        if ($scope.user && $scope.user.member.mobilephone) {
            linkstr = '&recommCode=' + $scope.user.member.mobilephone;
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
    })
    .controller('raidersCtrl', function ($scope, $rootScope, $filter, $state, resourceService, isWeixin,signWeChatService) {
        signWeChatService();
        $('body').scrollTop(0);
        $filter('isPath')('inviRaiders');
        $rootScope.title = "沪深理财-网贷投资，国企控股平台";
        if($rootScope.fromNative) {
            $('.my-invitation-wrapper').css('padding-top','0');
        }
        $scope.toback = function () {
            $filter('跳回上一页')(2);
        };
    });
}) 