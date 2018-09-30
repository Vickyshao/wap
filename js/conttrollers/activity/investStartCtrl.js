define(['jweixin', 'js/module.js', 'jquery', 'ngdialog', 'SHR256'], function (wx, controllers, $, ngdialog, SHR256, weixin) {
    controllers.service('weixinS',['$localStorage','resourceService','ShareData',function ($localStorage,resourceService,ShareData) {}])
    controllers.controller('investStartCtrl', ['$scope', '$rootScope', 'resourceService', '$filter', '$state', 'ngDialog', '$location', 'md5', '$localStorage', '$stateParams','isWeixin','signWeChatService','weixinS','ShareData', function ($scope, $rootScope, resourceService, $filter, $state, ngDialog, $location, md5, $localStorage, $stateParams,isWeixin,signWeChatService,weixinS,ShareData) {
        $('body').scrollTop(0);
        $filter('isPath')('investStartCtrl');
        $scope.toFrom = $rootScope.getUrlParam('toFrom');
        $rootScope.title = '注册领取2000元体验金';
        $scope.welcom =false;
        $scope.login ={};
        $scope.user = $filter('isRegister')().user.member;
        if($localStorage.user || $scope.user) {
            $scope.isLogin = $localStorage.user.member.uid || $scope.user.uid;
        }
        console.log($localStorage.user,$scope.user);
        if($scope.isLogin) {
            $scope.welcom = true;
        }
        $scope.shareLogId = $stateParams.shareLogId;
        $scope.uid = $stateParams.uid;
        $scope.phone = $stateParams.phone;
        $scope.investId = $stateParams.investId;
        $scope.linkstr = '&phone='+$scope.phone + '&uid='+$scope.uid + '&shareLogId='+$scope.shareLogId+ '&investId='+$scope.investId;
        if ($localStorage.webFormPath != undefined) {
            if ($localStorage.webFormPath.recommCode != undefined) {
                $scope.login.recommPhone = $localStorage.webFormPath.recommCode;
            };
            if ($localStorage.webFormPath.toFrom != undefined) {
                $scope.login.toFrom = $localStorage.webFormPath.toFrom;
            };
            if ($localStorage.webFormPath.tid != undefined) {
                $scope.login.tid = $localStorage.webFormPath.tid;
            };
        };
        $scope.webFormPath = $localStorage.webFormPath;
        if ($location.$$search) {
            $localStorage.webFormPath = $location.$$search;
            $scope.webFormPath = $location.$$search;
        }
        if ($scope.webFormPath.toFrom != undefined) {
            $scope.login.toFrom = $scope.webFormPath.toFrom;
        }
        if ($scope.webFormPath.recommCode != undefined) {
            $scope.login.recommPhone = $scope.webFormPath.recommCode;
        }
        if ($scope.webFormPath.tid != undefined) {
            $scope.login.tid = $scope.webFormPath.tid;
        }
        if ($stateParams.myToFrom != '' && $stateParams.myToFrom != null) {
            $scope.login.toFrom = $stateParams.myToFrom;
        }
        if ($stateParams.maskType != '' || $stateParams.maskType != undefined) {
            $localStorage.maskType = $stateParams.maskType;
        }

        resourceService.queryPost($scope, $filter('getUrl')('分享详情'),{uid: $scope.uid,shareLogId: $scope.shareLogId}, { name: '分享详情' });

        $scope.$on('resourceService.QUERY_POST_MYEVENT', function (event, data, type) {
            switch (type.name) {
                case '分享详情':
                    if (data.success) {
                        $scope.shareInfo = data.map;
                        $scope.isNoMore = data.map.isNoMore;
                        $scope.awardDetail = data.map.awardDetail;
                        // 是否参加过活动
                        $scope.viewStatus = data.map.viewStatus;
                        if($scope.viewStatus) {
                            ngDialog.open({
                                template: '<p class="error-msg">' + '您已领过红包'+ '</p>',
                                showClose: false,
                                closeByDocument: false,
                                plain: true
                            });
                            setTimeout(function () {
                                ngDialog.closeAll();
                            }, 1000);
                        }
                    }
                    break;
            };
        });
        wx.ready(function () {
            wx.onMenuShareTimeline({
                title: '88万体验金限量放送，收益可提现，赶快和你的好友一起领取吧！', // 分享标题
                desc: '88万体验金等你来撩，手快有，手慢无~', // 分享描述
                link: 'https://m.hushenlc.cn/redBagzhuce?wap=true' +$scope.linkstr, // 分享链接
                imgUrl: 'https://m.hushenlc.cn/images/activity/share-icon.png', // 分享图标
                success: function() {
                    alert('分享成功！');
                    resourceService.queryPost($scope, $filter('getUrl')('分享赠送体验金'),{shareLogId: $scope.shareLogId}, { name: '分享赠送体验金' });
                },
                cancel: function() {
                    alert('您取消了分享！');
                }
            });
            wx.onMenuShareAppMessage({
                title: '88万体验金限量放送，收益可提现，赶快和你的好友一起领取吧！', // 分享标题
                desc: '88万体验金等你来撩，手快有，手慢无~', // 分享描述
                link: 'https://m.hushenlc.cn/redBagzhuce?wap=true' +$scope.linkstr, // 分享链接
                imgUrl: 'https://m.hushenlc.cn/images/activity/share-icon.png', // 分享图标
                success: function() {
                    alert('分享成功！');
                    resourceService.queryPost($scope, $filter('getUrl')('分享赠送体验金'),{shareLogId: $scope.shareLogId}, { name: '分享赠送体验金' });
                },
                cancel: function() {
                    alert('您取消了分享！');
                }
            });
        });

    }])
})