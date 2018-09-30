define([
    'jweixin',
    'js/module.js'
], function(wx, controllers) {
    controllers.controller('inviteFriend', ['$scope', '$filter', '$state', '$location', 'resourceService', 'isWeixin', '$timeout','$localStorage', function($scope, $filter, $state, $location, resourceService, isWeixin, $timeout,$localStorage) {

        if ($location.$$search.toFrom != undefined || $location.$$search.recommCode != undefined || $location.$$search.tid != undefined) {
            $localStorage.webFormPath = $location.$$search;
        };
        $scope.wap = $location.$$search.wap;
        if ($location.$$search.afid) { $scope.rfid = $location.$$search.afid; }
        if ($location.$$search.uid) { $scope.uid = $location.$$search.uid;
            $scope.androidUrl = "jsmp://page=100?"; } else { $scope.androidUrl = "jsmp://page=4?"; }
        if ($filter('isRegister')().user && $filter('isRegister')().user.member && $filter('isRegister')().user.member.uid) {
            $scope.user = $filter('isRegister')().user;
            if ($scope.wap) { $scope.uid = $scope.user.member.uid; }
            $scope.shareUrl = 'https://hushenlc.cn/friendreg?recommCode=' + $scope.user.member.mobilephone;
        }
        $scope.actives = [{ code: 1, text: '2.5‰', num: 0.0025 }, { code: 2, text: '5‰', num: 0.005 }, { code: 3, text: '1%', num: 0.01 }]
        $scope.typerates=[{text:'3.5‰',num:0.001},{text:'8‰',num:0.003},{text:'2%',num:0.01}];
        $scope.active = $scope.actives[2];
        $scope.money = 100;
        $scope.sumAcount = 0;
        $scope.investType='pc';
        $scope.typerate=null;
        $scope.selecttype=function(type){
            $scope.investType=type;
            if($scope.investType=='app'){
                $scope.typerate=$scope.typerates[$scope.active.code-1];
            }else{
                $scope.typerate=null;
            }
        };
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
        $scope.date = new Date().getTime();
        $scope.xuanze = function(i) {
            $scope.active = $scope.actives[i - 1];
            if($scope.investType=='app'){
                $scope.typerate=$scope.typerates[$scope.active.code-1];
            }
        };
        $scope.jisuan = function() {
            if ($scope.money <= 1000000000) {
                if ($scope.money % 100 == 0 && $scope.money > 0) {
                    var rate=!$scope.typerate?$scope.active.num:$scope.active.num+$scope.typerate.num;
                    $scope.sumAcount = $filter('currency')($scope.money * rate, '￥');
                } else {
                    alert('请输入100的倍数！');
                }
            } else {
                alert('您输入的金额过大！');
            }
        }
        $scope.closefixed = function() {
            $scope.fixedshow = false;
        };
        $scope.lijiyaoqing = function() {
            if ($scope.uid) {
                if (isWeixin()) {
                    $('.activity-firend-boxweixin').fadeIn(200);
                } else {
                    $('.activity-firend-boxh5').fadeIn(200);
                }
            } else {
                $state.go('dl', { returnurl: 'inviteFriend' });
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
            /*$timeout(function(){
                $('.activity-firend-boxh5').fadeOut(200);
                $scope.isCopy = false;
            },1000);*/
        };
        $scope.closeshareh5 = function() {
            $('.activity-firend-boxh5').fadeOut(200);
        }
        $scope.default = function(e) {
            e.stopPropagation();
        }
        $scope.closeshareweixin = function() {
            $('.activity-firend-boxweixin').fadeOut(200);
        };
        $scope.lingqu = function() {
            resourceService.queryPost($scope, $filter('getUrl')('getTheRewards'), { uid: $scope.uid, afid: $scope.rfid }, { name: '领取奖励' });
        };
        $scope.closehongbao = function() {
            $('.activity-firend-hongbao').fadeOut(200);
        };
        $scope.jisuanqi = function() {
            $scope.fixedshow = true;
            $scope.money = 0;
            $scope.sumAmount = 0;
        }
        resourceService.queryPost($scope, $filter('getUrl')('getActivityFriendConfig'), { id: $scope.rfid }, { name: '任务详情' });
        $scope.$on('resourceService.QUERY_POST_MYEVENT', function(event, data, type) {
            switch (type.name) {
                case '任务详情':
                    $scope.data = data.map;
                    if (!$scope.rfid) { $scope.rfid = $scope.data.jsActivityFriend.id }
                    if ($scope.uid) {
                        resourceService.queryPost($scope, $filter('getUrl')('getActivityFriendStatistics'), { uid: $scope.uid, afid: $scope.rfid, pageOn: 1, pageSize: 10000 }, { name: '邀请好友列表' });
                    }
                    break;
                case '邀请好友列表':
                    $scope.firendList = data.map;
                    break;
                case '领取奖励':
                    $scope.hongbao = {};
                    $scope.hongbao.amount = data.map.amount;
                    $('.activity-firend-hongbao').fadeIn(200);
                    resourceService.queryPost($scope, $filter('getUrl')('getActivityFriendStatistics'), { uid: $scope.uid, afid: $scope.rfid, pageOn: 1, pageSize: 10000 }, { name: '邀请好友列表' });
                    break;
            }
        });
        var linkstr = "";
        if ($scope.user && $scope.user.member.mobilephone) {
            linkstr = '&recommCode=' + $scope.user.member.mobilephone;
        }
            wx.ready(function() {
                wx.onMenuShareTimeline({
                    title: '撸起袖子加油赚，想财富自由先来领第一桶金！', // 分享标题
                    link: 'https://hushenlc.cn/friendreg?wap=true' + linkstr, // 分享链接
                    imgUrl: 'https://hushenlc.cn/images/activity/firend/share.png', // 分享图标
                    success: function() {
                        alert('分享成功！');
                    },
                    cancel: function() {
                        alert('您取消了分享！');
                    }
                });
                wx.onMenuShareAppMessage({
                    title: '撸起袖子加油赚，想财富自由先来领第一桶金！', // 分享标题
                    desc: '送10万元体验金、666元红包、1.2倍翻倍券等新手大礼包！', // 分享描述
                    link: 'https://hushenlc.cn/friendreg?wap=true' + linkstr, // 分享链接
                    imgUrl: 'https://hushenlc.cn/images/activity/firend/share.png', // 分享图标
                    success: function() {
                        alert('分享成功！');
                    },
                    cancel: function() {
                        alert('您取消了分享！');
                    }
                });
                wx.onMenuShareQQ({
                    title: '撸起袖子加油赚，想财富自由先来领第一桶金！', // 分享标题
                    desc: '送10万元体验金、666元红包、1.2倍翻倍券等新手大礼包！', // 分享描述
                    link: 'https://hushenlc.cn/friendreg?wap=true' + linkstr, // 分享链接
                    imgUrl: 'https://hushenlc.cn/images/activity/firend/share.png', // 分享图标
                    success: function() {
                        alert('分享成功！');
                    },
                    cancel: function() {
                        alert('您取消了分享！');
                    }
                });
                wx.onMenuShareWeibo({
                    title: '撸起袖子加油赚，想财富自由先来领第一桶金！', // 分享标题
                    desc: '送10万元体验金、666元红包、1.2倍翻倍券等新手大礼包！', // 分享描述
                    link: 'https://hushenlc.cn/friendreg?wap=true' + linkstr, // 分享链接
                    imgUrl: 'https://hushenlc.cn/images/activity/firend/share.png', // 分享图标
                    success: function() {
                        alert('分享成功！');
                    },
                    cancel: function() {
                        alert('您取消了分享！');
                    }
                });
                wx.onMenuShareQZone({
                    title: '撸起袖子加油赚，想财富自由先来领第一桶金！', // 分享标题
                    desc: '送10万元体验金、666元红包、1.2倍翻倍券等新手大礼包！', // 分享描述
                    link: 'https://hushenlc.cn/friendreg?wap=true' + linkstr, // 分享链接
                    imgUrl: 'https://hushenlc.cn/images/activity/firend/share.png', // 分享图标
                    success: function() {
                        alert('分享成功！');
                    },
                    cancel: function() {
                        alert('您取消了分享！');
                    }
                });
            })
            var browser = {
                versions: function() {
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
            function isWeiXin(){
                var ua = window.navigator.userAgent.toLowerCase();
                if(ua.match(/MicroMessenger/i) == 'micromessenger'){
                    return true;
                }else{
                    return false;
                }
            }
            $scope.downloadclick=function(){
                if (isWeiXin()){
                    if (browser.versions.ios || browser.versions.iPhone || browser.versions.iPad) {
                        $('.share-ios').fadeIn(200);
                    } else {
                        $('.share-android').fadeIn(200);
                    }
                } else if (browser.versions.ios || browser.versions.iPhone || browser.versions.iPad) {
                    window.location.href = "httpss://itunes.apple.com/us/app/ju-sheng-cai-fu/id1171321616?mt=8";

                } else if (browser.versions.android) {
                    window.location.href = "https://a.app.qq.com/o/simple.jsp?pkgname=com.jscf.js_app";
                } else {
                    window.location.href = "https://hushenlc.cn/js_app.apk";
                }
            };
            $scope.closethis=function(){
                $('.share-ios,.share-android').fadeOut(200);
            };
    }]);
})
