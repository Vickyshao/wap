define(['jweixin', 'js/module.js', 'jquery', 'ngdialog'], function (wx, controllers, $, ngdialog) {
    controllers.controller('dragonboatController', function ($scope, $rootScope, resourceService, $filter, $state, $stateParams,$interval,$window, isWeixin,signWeChatService) {
        $filter('isPath')('dragonboat');
        signWeChatService();
        $('body').scrollTop(0);
        $rootScope.title = '沪深理财-网贷投资，国企控股平台';
        if($stateParams.wap){
            $scope.wap = $stateParams.wap;
            // var user = $filter('isRegister')();
            // if(user.register==true){
            //     $scope.isLog = true;
            //     resourceService.queryPost($scope, $filter('getUrl')('518理财节'), {uid: user.user.member.uid}, { name: '518理财节' });
            // }
            // else{
            //     $scope.isLog = false;
            //     resourceService.queryPost($scope, $filter('getUrl')('518理财节'), {}, { name: '518理财节' });
            // }
        }
        // else{
        //     if($stateParams.uid){
        //         $scope.isLog = true;
        //         resourceService.queryPost($scope, $filter('getUrl')('518理财节'), {uid: $stateParams.uid}, { name: '518理财节' });
        //     }
        //     else{
        //         $scope.isLog = false;
        //         resourceService.queryPost($scope, $filter('getUrl')('518理财节'), {}, { name: '518理财节' });
        //     }
        // }
        function init(){
            if($scope.timeDowm){
                $interval.cancel($scope.timeDowm);
            }
            if($scope.timer){
                $interval.cancel($scope.timer);
            }
            resourceService.queryPost($scope, $filter('getUrl')('端午节活动'), {}, { name: '端午节活动' });
        }
        init();
        var $dataTable = $('.data-table');
        var trHeight = $('.data-list').height()/5;
        $scope.$on('resourceService.QUERY_POST_MYEVENT', function (event, data, type) {
            switch (type.name) {
                case '端午节活动':
                    if (data.success) {
                        $scope.productA = data.map.productInfo45;
                        $scope.productB = data.map.productInfo75;
                        $scope.investList = data.map.investLog;
                        $scope.seckillTime = data.map.seckillTime/1000;
                        // 有一个产品id不存在时并且有倒计时
                        if((!$scope.productA.id || !$scope.productB.id) && data.map.seckillTime){
                            $scope.hours = Math.floor($scope.seckillTime/3600)>0?Math.floor($scope.seckillTime/3600):0;
                            $scope.minutes = Math.floor($scope.seckillTime%3600/60)>0?Math.floor($scope.seckillTime%3600/60):0;
                            $scope.seconds = Math.floor($scope.seckillTime%3600%60/1)>0?Math.floor($scope.seckillTime%3600%60/1):0;
                            $scope.hours = $scope.hours<10?('0'+$scope.hours):$scope.hours;
                            $scope.minutes = $scope.minutes<10?('0'+$scope.minutes):$scope.minutes;
                            $scope.seconds = $scope.seconds<10?'0'+$scope.seconds:$scope.seconds;
                            $scope.timeDowm = $interval(function(){
                                $scope.seckillTime--;
                                $scope.hours = Math.floor($scope.seckillTime/3600)>0?Math.floor($scope.seckillTime/3600):0;
                                $scope.minutes = Math.floor($scope.seckillTime%3600/60)>0?Math.floor($scope.seckillTime%3600/60):0;
                                $scope.seconds = Math.floor($scope.seckillTime%3600%60/1)>0?Math.floor($scope.seckillTime%3600%60/1):0;
                                $scope.hours = $scope.hours<10?('0'+$scope.hours):$scope.hours;
                                $scope.minutes = $scope.minutes<10?('0'+$scope.minutes):$scope.minutes;
                                $scope.seconds = $scope.seconds<10?'0'+$scope.seconds:$scope.seconds;
                                if($scope.hours<=0 && $scope.minutes<=0 && $scope.seconds<=0){
                                    // $window.location.reload();
                                    init();
                                }
                            },1000)
                        }
                        // 列表轮播
                        if ($scope.investList.length > 5) {
                            $scope.timer = $interval(function() {
                                $dataTable.animate({'margin-top': '-'+trHeight+'px'},600,function() {
                                    $dataTable.find('tr').eq(0).appendTo($dataTable);
                                    $dataTable.css('margin-top',0);
                                });
                            }, 2500);
                        }
                    }
                    break;
            };
        });
        $scope.gotop = function () {
            $("html,body").animate({ scrollTop: 0 });
        };
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
        wx.ready(function () {
            wx.onMenuShareTimeline({
                title: '撸起袖子加油赚，想财富自由先来领第一桶金！', // 分享标题
                link: 'https://hushenlc.cn/dragonboat?wap=true', // 分享链接
                imgUrl: 'https://hushenlc.cn/images/activity/dragonboat/share.jpg', // 分享图标
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
                link: 'https://hushenlc.cn/dragonboat?wap=true', // 分享链接
                imgUrl: 'https://hushenlc.cn/images/activity/dragonboat/share.jpg', // 分享图标
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
                link: 'https://hushenlc.cn/dragonboat?wap=true', // 分享链接
                imgUrl: 'https://hushenlc.cn/images/activity/dragonboat/share.jpg', // 分享图标
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
                link: 'https://hushenlc.cn/dragonboat?wap=true', // 分享链接
                imgUrl: 'https://hushenlc.cn/images/activity/dragonboat/share.jpg', // 分享图标
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
                link: 'https://hushenlc.cn/dragonboat?wap=true', // 分享链接
                imgUrl: 'https://hushenlc.cn/images/activity/dragonboat/share.jpg', // 分享图标
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
    })
})