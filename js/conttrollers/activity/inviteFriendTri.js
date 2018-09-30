define(['jweixin', 'js/module.js'], function (wx, controllers) {
    controllers.controller('inviteFriendTri', function ($scope, $filter, $state, $location, resourceService, isWeixin, $timeout, $localStorage,$stateParams,$interval,signWeChatService) {
        signWeChatService();
        $('body').scrollTop(0);
        if ($location.$$search.toFrom != undefined || $location.$$search.recommCode != undefined || $location.$$search.tid != undefined) {
            $localStorage.webFormPath = $location.$$search;
        };
        if($stateParams.wap){
            $scope.wap = $stateParams.wap;
            if ($filter('isRegister')().register==true) {
                $scope.user = $filter('isRegister')().user;
                $scope.uid = $scope.user.member.uid;
                $scope.shareUrl = 'https://hushenlc.cn/friendreg?recommCode=' + $scope.user.member.mobilephone;
            }
            else{
                $scope.ftype = 1;
            }
        }
        else if ($stateParams.uid) {
            $scope.uid = $stateParams.uid;
        }
        else{
            $scope.ftype = 1;
        }
        resourceService.queryPost($scope, $filter('getUrl')('邀请好友三重礼top10'), {}, { name: '邀请好友三重礼top10' });
        // resourceService.queryPost($scope, $filter('getUrl')('getActivityFriendConfig'), {}, { name: '任务详情' });
        // 计算器相关
        $scope.cpList = [
            {index:0,days:35,rate:6},
            {index:1,days:60,rate:7.5},
            {index:2,days:180,rate:10.5}
        ];
        $scope.showJsq = function(){
            $scope.investAmount = 50000;
            $scope.cpDetail = $scope.cpList[2];
            $('.jsq').fadeIn(200);
        }
        $scope.closeJsq = function(){
            $('.jsq').fadeOut(200);
        }
        $scope.changeTime = function(i){
            $scope.cpDetail = $scope.cpList[i];
        }
        // 活动规则
        $scope.showRule = function (i) {
            $scope.ruleShow = i;
            $('.rule').fadeIn(200);
        };
        $scope.closeRule = function () {
            $('.rule').fadeOut(200);
        };
        // 滑动到顶部
        $scope.gotop = function () {
            $("html,body").animate({ scrollTop: $('body').offset().top });
        };
        // 领取奖金
        $scope.lingqu = function () {
            resourceService.queryPost($scope, $filter('getUrl')('getTheRewards'), { uid: $scope.uid, afid: $scope.afid }, { name: '领取奖励' });
        };
        $scope.closehongbao = function () {
            $('.activity-firend-hongbao').fadeOut(200);
        };
        $scope.$on('resourceService.QUERY_POST_MYEVENT', function (event, data, type) {
            switch (type.name) {
                // case '任务详情':
                //     $scope.data = data.map;
                //     $scope.afid = $scope.data.jsActivityFriend.id;
                //     $scope.endDate = $scope.data.jsActivityFriend.endDate/1000;
                //     $scope.days = Math.floor(($scope.endDate-new Date().getTime()/1000)/86400);
                //     $scope.hours = Math.floor(($scope.endDate-new Date().getTime()/1000)%86400/3600);
                //     $scope.minutes = Math.floor(($scope.endDate-new Date().getTime()/1000)%86400%3600/60);
                //     $interval(function(){
                //         $scope.days = Math.floor(($scope.endDate-new Date().getTime()/1000)/86400);
                //         $scope.hours = Math.floor(($scope.endDate-new Date().getTime()/1000)%86400/3600);
                //         $scope.minutes = Math.floor(($scope.endDate-new Date().getTime()/1000)%86400%3600/60);
                //     },1000)
                //     if ($scope.uid) {
                //         resourceService.queryPost($scope, $filter('getUrl')('getActivityFriendStatistics'), { uid: $scope.uid, afid: $scope.afid, pageOn: 1, pageSize: 10000 }, { name: '邀请好友列表' });
                //     }
                //     break;
                case '邀请好友列表':
                    $scope.firendList = data.map;
                    $scope.ftype = 2;
                    break;
                case '领取奖励':
                    $scope.hongbao = {};
                    $scope.hongbao.amount = data.map.amount;
                    $('.activity-firend-hongbao').fadeIn(200);
                    resourceService.queryPost($scope, $filter('getUrl')('getActivityFriendStatistics'), { uid: $scope.uid, afid: $scope.afid, pageOn: 1, pageSize: 10000 }, { name: '邀请好友列表' });
                    break;
                case '邀请好友三重礼top10':
                    $scope.repeatInvestList = data.map.top;
                    $scope.data = data.map.activity;
                    $scope.afid = $scope.data.id;
                    if ($scope.uid) {
                        resourceService.queryPost($scope, $filter('getUrl')('getActivityFriendStatistics'), { uid: $scope.uid, afid: $scope.afid, pageOn: 1, pageSize: 10000 }, { name: '邀请好友列表' });
                    }
                    $scope.endDate = $scope.data.endDate/1000;
                    $scope.days = Math.floor(($scope.endDate-new Date().getTime()/1000)/86400)>0?Math.floor(($scope.endDate-new Date().getTime()/1000)/86400):0;
                    $scope.hours = Math.floor(($scope.endDate-new Date().getTime()/1000)%86400/3600)>0?Math.floor(($scope.endDate-new Date().getTime()/1000)%86400/3600):0;
                    $scope.minutes = Math.floor(($scope.endDate-new Date().getTime()/1000)%86400%3600/60)>0?Math.floor(($scope.endDate-new Date().getTime()/1000)%86400%3600/60):0;
                    $interval(function(){
                        $scope.days = Math.floor(($scope.endDate-new Date().getTime()/1000)/86400)>0?Math.floor(($scope.endDate-new Date().getTime()/1000)/86400):0;
                        $scope.hours = Math.floor(($scope.endDate-new Date().getTime()/1000)%86400/3600)>0?Math.floor(($scope.endDate-new Date().getTime()/1000)%86400/3600):0;
                        $scope.minutes = Math.floor(($scope.endDate-new Date().getTime()/1000)%86400%3600/60)>0?Math.floor(($scope.endDate-new Date().getTime()/1000)%86400%3600/60):0;
                    },1000)
                    break;
            }
        });
        // 邀请弹框
        $scope.lijiyaoqing = function () {
            if (isWeixin()) {
                $('.activity-firend-boxweixin').fadeIn(200);
            } else {
                $('.activity-firend-boxh5').fadeIn(200);
            }
        };
        $scope.copyShare = function () {
            var e = document.getElementById("shareurl"); //对象是contents 
            e.select(); //选择对象 
            document.execCommand("Copy");
            $scope.isCopy = true;
            if (IsPC()) {
                $scope.isCopytext = '链接已复制';
            } else {
                $scope.isCopytext = '长按文字全选复制链接';
            }
            /*$timeout(function(){
                $('.activity-firend-boxh5').fadeOut(200);
                $scope.isCopy = false;
            },1000);*/
        };
        $scope.closeshareh5 = function () {
            $('.activity-firend-boxh5').fadeOut(200);
        }
        $scope.default = function (e) {
            e.stopPropagation();
        }
        $scope.closeshareweixin = function () {
            $('.activity-firend-boxweixin').fadeOut(200);
        };
        // 分享相关
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
        var browser = {
            versions: function () {
                var u = navigator.userAgent,
                    app = navigator.appVersion;
                return { //移动终端浏览器版本信息
                    trident: u.indexOf('Trident') > -1, //IE内核
                    presto: u.indexOf('Presto') > -1, //opera内核
                    webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
                    gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //火狐内核
                    mobile: !!u.match(/AppleWebKit.*Mobile.*/) || !!u.match(/AppleWebKit/), //是否为移动终端
                    ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
                    android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或者uc浏览器
                    iPhone: u.indexOf('iPhone') > -1 || u.indexOf('Mac') > -1, //是否为iPhone或者QQHD浏览器
                    iPad: u.indexOf('iPad') > -1, //是否iPad
                    webApp: u.indexOf('Safari') == -1 //是否web应该程序，没有头部与底部
                };
            }(),
            language: (navigator.browserLanguage || navigator.language).toLowerCase()
        }
        function isWeiXin() {
            var ua = window.navigator.userAgent.toLowerCase();
            if (ua.match(/MicroMessenger/i) == 'micromessenger') {
                return true;
            } else {
                return false;
            }
        }
    })
})