define(['jweixin','js/module.js'], function (wx,controllers) {
    controllers.controller('dropEggCtrl', ['$scope', '$rootScope', '$filter', '$state', 'resourceService', '$timeout', '$location', '$anchorScroll', '$stateParams', '$localStorage','isWeixin','signWeChatService','ngDialog', function ($scope, $rootScope, $filter, $state, resourceService, $timeout, $location, $anchorScroll, $stateParams, $localStorage,isWeixin,signWeChatService,ngDialog) {
        signWeChatService();
        $('body').scrollTop(0);
        if ($location.$$search.toFrom != undefined || $location.$$search.recommCode != undefined || $location.$$search.tid != undefined) {
            $localStorage.webFormPath = $location.$$search;
        };
        $scope.drop = true;
        $filter('isPath')('dropEgg');
        $scope.isLogin = $filter('isRegister')().register;
        $scope.user = $filter('isRegister')().user.member;
        $rootScope.title = '沪深理财-网贷投资，国企控股平台';
        $rootScope.title1 = '注册后来领抽奖码';
        $rootScope.title2 = '登录后来领取抽奖码';
        if( $rootScope.getUrlParam('allowDL') == 'true') {
            $('.download-box').css('display','block');
        }
        if($stateParams.wap){
            $scope.wap = $stateParams.wap;
        }
        else{
            $scope.uid = $stateParams.uid;
        }
        //点击金蛋时执行
        $scope.dropEgg = function (item) {
            if($rootScope.fromNative && !$rootScope.getUrlParam('uid')) {
                document.location = 'hushentologin:';
                return;
            }
            $scope.drAwardMemberLog = item;
            $scope.drAward = item.drAward;
            if(item.id && item.status == '0') {
                $filter('砸金蛋弹窗')($scope);
            } else {
                if($scope.count >= 0) {
                    var paramsInfos = {
                        // activityId: $stateParams.activityId,
                        pos: item.pos
                    };
                    if ($rootScope.fromNative){
                        if ($rootScope.getUrlParam('token')){
                            paramsInfos.uid = $rootScope.getUrlParam('uid');
                            paramsInfos.token = $rootScope.getUrlParam('token');
                            resourceService.queryPost($scope, $filter('getUrl')('砸金蛋'), paramsInfos, '砸金蛋');
                        } else {
                        }
                    }else{
                        if($scope.isLogin) {
                            paramsInfos.uid =  $scope.user.uid;
                            resourceService.queryPost($scope, $filter('getUrl')('砸金蛋'), paramsInfos, '砸金蛋');
                        } else {
                            if($localStorage.webFormPath){
                                if($localStorage.webFormPath.toFrom != undefined){
                                    $state.go('dl',{source: $stateParams.source,toFrom: $localStorage.webFormPath.toFrom});
                                } else{
                                    $state.go('dl',{source: $stateParams.source});
                                }
                            }else{
                                $state.go('dl',{source: $stateParams.source});
                            }
                            return;
                        }
                    }
                }
            }
        }
        // 去投资按钮
        $scope.toInvest = function (item) {
            $localStorage.drAwardMemberLog = $scope.drAwardMemberLog = item;
            if($rootScope.fromNative) {
                if($localStorage.drAwardMemberLog) {
                    var hushendrawaward = {
                        id: $scope.drAwardMemberLog.id,
                        useCondition: $scope.drAwardMemberLog.drAward.useCondition,
                        name:  $scope.drAwardMemberLog.drAward.awardName
                    };
                    // 判断是否为渠道用户
                    if($rootScope.getUrlParam('isChannelUser')=='true') {
                        // 判断是否投资过定期标,若没投过定期标则出提示弹窗
                        if($scope.IsInvested) {
                            document.location = 'hushendrawaward:' + angular.toJson(hushendrawaward);
                        } else {
                            $filter('提示激活奖励弹窗')($scope);
                        }
                    } else {
                        document.location = 'hushendrawaward:' + angular.toJson(hushendrawaward);
                    }
                } else {
                    document.location = 'hushenlist:';
                }
            } else {
                $scope.closeDialog();
                // 判断是否为渠道用户
                if($localStorage.drAwardMemberLog) {
                    if($localStorage.user.isChannelUser) {
                        // 判断是否投资过定期标,若没投过定期标则出提示弹窗
                        if($scope.IsInvested) {
                            $state.go('main.bankBillList');
                        } else {
                            $filter('提示激活奖励弹窗')($scope);
                        }
                    } else {
                        $state.go('main.bankBillList');
                    }
                } else {$state.go('main.bankBillList');}
            }
        };
        // 好的
        $scope.toInvestList = function () {
            if($rootScope.fromNative) {
                document.location = 'hushenlist:';
            } else {
                $scope.closeDialog();
                $state.go('main.bankBillList');
            }
        };
        // 去领取
        $scope.toReceive = function (item) {
            if( item.status == '0') {
                $localStorage.drAwardMemberLog = $scope.drAwardMemberLog = item;
                $scope.drAward = item.drAward;
                $filter('砸金蛋弹窗')($scope);
            } else if ($scope.count == 1) {  // 如砸蛋了  还有一次机会 就去 首投
                $filter('砸金蛋去投资弹窗')($scope);
            } else {
                return;
            }
        }

        $scope.closeTip =function () {
            $scope.closeDialog();
        };
        $scope.share = function(value) {
            if ($rootScope.fromNative){
                if(value == '1') {
                    $scope.closeDialog();
                }
                document.location = 'hushenshare:';
            }else {
                resourceService.queryPost($scope, $filter('getUrl')('分享赠送机会'), dataParams, '分享赠送机会');
                if (isWeixin()) {
                    $('.activity-tjs-boxweixin').fadeIn(200);
                } else {
                    $('.activity-tjs-boxh5').fadeIn(200);
                }
                $scope.closeDialog();
            }

        };
        var dataParams = {
            // activityId: $stateParams.activityId,
            pos: $scope.pos,
            source: 1
        };
        if($rootScope.fromNative) {
            dataParams.uid = $rootScope.getUrlParam('uid');
            dataParams.token = $rootScope.getUrlParam('token');
        } else {
            if($scope.isLogin) {
                dataParams.uid = $scope.user.uid
            }
        }
        resourceService.queryPost($scope, $filter('getUrl')('砸蛋奖品排行'), dataParams, '砸蛋奖品排行');
        resourceService.queryPost($scope, $filter('getUrl')('砸蛋机会'), dataParams, '砸蛋机会');
        var $dataTable = $('.data-table');
        var trHeight = $('.data-list').height()/5;
        $scope.$on('resourceService.QUERY_POST_MYEVENT', function (event, data, type) {
            switch (type) {
                case '砸金蛋':
                    if(data.success) {
                        $scope.drAwardMemberLog = data.map.drAwardMemberLog;
                        $scope.drAward = $scope.drAwardMemberLog.drAward;
                        if($scope.drAwardMemberLog.type == '1') {
                            $scope.drAwardMemberLog.drAward.picUrl = '/images/activity/egg/egg10.png';
                            $scope.drAwardMemberLog.drAward.useCondition = 100;
                        }
                        if($scope.lotteryCount == 1) {
                            if ($scope.hasShared == true) {
                                $filter('砸金蛋去投资弹窗')($scope);
                            } else {
                                $filter('砸金蛋弹窗')($scope);
                            }
                        } else if ($scope.lotteryCount == 2) {
                                $filter('砸金蛋弹窗')($scope);
                        } else {
                            if ($scope.hasShared == true) {
                                $filter('砸金蛋弹窗')($scope);
                            } else {
                                $filter('砸金蛋去投资弹窗')($scope);
                            }
                        }
                        resourceService.queryPost($scope, $filter('getUrl')('砸蛋机会'), dataParams, '砸蛋机会');
                    } else {
                        if (!$scope.hasShared) {  // 如果没砸蛋  弹砸蛋弹框
                            $scope.share(2);
                        }else {
                            if ($scope.count == 1) {  // 如砸蛋了  还有一次机会 就去 首投
                                $filter('砸金蛋去投资弹窗')($scope);
                            } else {
                                return;
                            }
                        }
                    }

                break;
                case '砸蛋机会':
                    if(data.success) {
                        data = data.map;
                        $scope.IsInvested = data.IsInvested;
                        $scope.lotteryCount = data.lotteryCount;
                        $scope.hasShared = data.hasShared;
                        $scope.lotteryRecord = [
                            {isDroped: false,pos:0,drAward:{picUrl:"/images/activity/egg/egg0.png"}},
                            {isDroped: false,pos:1,drAward:{picUrl:"/images/activity/egg/egg0.png"}},
                            {isDroped: false,pos:2,drAward:{picUrl:"/images/activity/egg/egg0.png"}}
                        ];
                        angular.forEach(data.lotteryRecord,function(item){
                            $scope.lotteryRecord[item.pos] = item;
                            $scope.lotteryRecord[item.pos].isDroped = true;
                            if(item.type == '1') {
                                $scope.lotteryRecord[item.pos].drAward.picUrl = '/images/activity/egg/egg10.png';
                                $scope.lotteryRecord[item.pos].drAward.useCondition = 100;
                            }
                        });
                        $scope.count = 3 -  data.lotteryRecord.length;
                    }

                break;
                case '分享赠送机会':
                    if(data.success) {
                        resourceService.queryPost($scope, $filter('getUrl')('砸蛋机会'), dataParams, '砸蛋机会');
                    }
                break;
                case '砸蛋奖品排行':
                    if (data.success) {
                        $scope.investList = data.map.list;
                        $scope.size = data.map.size;
                        // 列表数据轮动
                        if ($scope.investList.length > 3) {
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
            };
        });
        $scope.showRule = function () {
            $('.rule-box').fadeIn(200);
        };
        $scope.closeRule = function () {
            $('.rule-box').fadeOut(200);
        };
        $scope.gotop = function () {
            $("html,body").animate({ scrollTop: 0 });
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
        $scope.closeshare = function() {
            $('.activity-tjs-boxh5').fadeOut(200);
        }
        $scope.default = function(e) {
            e.stopPropagation();
        }
        $scope.closeshareweixin = function() {
            $('.activity-tjs-boxweixin').fadeOut(200);
        };
        wx.ready(function() {
            wx.onMenuShareTimeline({
                title: '我正在参与100%中奖砸蛋活动，快来一起参加吧！', // 分享标题
                link: 'https://hushenlc.cn/dropEgg?source=egg&allowDL=true', // 分享链接
                imgUrl: 'https://hushenlc.cn//images/activity/egg/share.png', // 分享图标
                success: function() {
                    alert('分享成功！');
                },
                cancel: function() {
                    alert('您取消了分享！');
                }
            });
            wx.onMenuShareAppMessage({
                title: '我正在参与100%中奖砸蛋活动，快来一起参加吧！', // 分享标题
                desc: '不需要解释，点进来就中！', // 分享描述
                link: 'https://hushenlc.cn/dropEgg?source=egg&allowDL=true', // 分享链接
                imgUrl: 'https://hushenlc.cn/images/activity/egg/share.png', // 分享图标
                success: function() {
                    alert('分享成功！');
                },
                cancel: function() {
                    alert('您取消了分享！');
                }
            });
            wx.onMenuShareQQ({
                title: '我正在参与100%中奖砸蛋活动，快来一起参加吧！', // 分享标题
                desc: '不需要解释，点进来就中！', // 分享描述
                link: 'https://hushenlc.cn/dropEgg?source=egg&allowDL=true', // 分享链接
                imgUrl: 'https://hushenlc.cn/images/activity/egg/share.png', // 分享图标
                success: function() {
                    alert('分享成功！');
                },
                cancel: function() {
                    alert('您取消了分享！');
                }
            });
            wx.onMenuShareWeibo({
                title: '我正在参与100%中奖砸蛋活动，快来一起参加吧！', // 分享标题
                desc: '不需要解释，点进来就中！', // 分享描述
                link: 'https://hushenlc.cn/dropEgg?source=egg&allowDL=true', // 分享链接
                imgUrl: 'https://hushenlc.cn/images/activity/egg/share.png', // 分享图标
                success: function() {
                    alert('分享成功！');
                },
                cancel: function() {
                    alert('您取消了分享！');
                }
            });
            wx.onMenuShareQZone({
                title: '我正在参与100%中奖砸蛋活动，快来一起参加吧！', // 分享标题
                desc: '不需要解释，点进来就中！', // 分享描述
                link: 'https://hushenlc.cn/dropEgg?source=egg&allowDL=true', // 分享链接
                imgUrl: 'https://hushenlc.cn/images/activity/egg/share.png', // 分享图标
                success: function() {
                    alert('分享成功！');
                },
                cancel: function() {
                    alert('您取消了分享！');
                }
            });
        })
    }])
})
