define(['js/module.js'], function(controllers) {
    controllers.controller('publicWelfareListController', function($scope, $filter, $state, $stateParams, resourceService,$timeout,$localStorage,$rootScope) {
        $rootScope.title = '沪深公益';
        $filter('isPath')('publicWelfareList');
        $scope.listLength = 2;
        $scope.isShowMore = true;
        if ($stateParams.wap) {
            $scope.wap = $stateParams.wap;
        }
        if($rootScope.fromNative || $rootScope.getUrlParam('allowDL') == 'true') {
            $('.common-head').css('display','none');
            $('.publicWelfare').removeClass('headerTop');
        }
        $scope.more = function () {
            $scope.listLength = $scope.list.length;
            $scope.isShowMore = false;
        };
        resourceService.queryPost($scope, $filter('getUrl')('公益活动列表'), { }, { name: '公益活动列表' });
        $scope.$on('resourceService.QUERY_POST_MYEVENT', function(event, data, type) {
            switch (type.name) {
                case "公益活动列表":
                    if (data.success) {
                        $scope.list = data.map.page.rows;
                    }
                    break;
            }
        });
        $scope.toback = function() {
            $filter('跳回上一页')(2);
        };
    })
    .controller('publicWelfareController', function($scope, $filter, $state, $stateParams, resourceService,$timeout,$localStorage,$rootScope,isWeixin,$location) {
        $rootScope.title = '';
        $filter('isPath')('publicWelfare');
        if ($stateParams.wap) {
            $scope.wap = $stateParams.wap;
        }
        $scope.link = $location.absUrl();
        if($rootScope.fromNative || $rootScope.getUrlParam('allowDL') == 'true') {
            $('.common-head').css('display','none');
            $('.publicWelfare').removeClass('headerTop');
        }
        if($rootScope.getUrlParam('allowDL') == 'true') {
            $('.download-box').css({
                'display':'block',
                'top': '0'
            });
        }
        // 分享
        $scope.share = function() {
            if (isWeixin()) {
                $('.activity-tjs-boxweixin').fadeIn(200);
            } else {
                $('.activity-tjs-boxh5').fadeIn(200);
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
        resourceService.queryPost($scope, $filter('getUrl')('公益活动内容'), {id:$stateParams.id}, { name: '公益活动内容' });
        $scope.$on('resourceService.QUERY_POST_MYEVENT', function(event, data, type) {
            switch (type.name) {
                case "公益活动内容":
                    if (data.success) {
                        $rootScope.title = data.map.jsActivityOffline.title;
                        $scope.picList = data.map.picList;
                        $scope.h5Banner = data.map.jsActivityOffline.h5Banner;
                        $scope.content = data.map.jsActivityOffline.contentAPP;
                        $scope.mtitle = data.map.jsActivityOffline.title;
                        $scope.summary = data.map.jsActivityOffline.summary;
                        $scope.imgUrl = data.map.jsActivityOffline.appPictureUrlA;
                        $scope.videoUrl = data.map.jsActivityOffline.videoUrl;
                        $timeout(function () {
                            var swiper = new Swiper('.live-slider',{
                                slidesPerView: 1.3,
                                loop: true,
                                autoplay: 2500,
                                autoplayDisableOnInteraction: false,
                                effect: 'coverflow',
                                grabCursor: true,
                                centeredSlides: true,
                                // slideToClickedSlide:true,
                                loopAdditionalSlides : 1,
                                coverflow: {
                                    rotate: 0,
                                    stretch: 0,
                                    depth: 200,
                                    modifier: 1,
                                    slideShadows : true
                                }
                            })
                        });
                    }
                    break;
            }
        });
        $scope.toback = function() {
            $filter('跳回上一页')(2);
        };
    })
    .controller('chunjiePrizeCtrl', function($scope, $filter, $state, $stateParams, resourceService,$timeout,$localStorage,$rootScope) {
        $rootScope.title = '奖品信息';
        $filter('isPath')('chunjieprize2018');
        $scope.user = $filter('isRegister')();
        if ($stateParams.wap) {
            $scope.wap = $stateParams.wap;
        }
        var obj = {};
        if ($scope.user) {
            obj.uid = $scope.user.user.member.uid;
            obj.activityId = $stateParams.activityId;
        } else {
            $state.go("dl")
        }
        if($rootScope.fromNative || $rootScope.getUrlParam('allowDL') == 'true') {
            $('.common-head').css('display','none');
            $('.publicWelfare').removeClass('headerTop');
        }
        resourceService.queryPost($scope, $filter('getUrl')('春节我的活动详情'), obj, { name: '春节我的活动详情' });
        $scope.$on('resourceService.QUERY_POST_MYEVENT', function(event, data, type) {
            switch (type.name) {
                case "春节我的活动详情":
                    if (data.success) {
                        $scope.list = data.map.awardList;
                    }
                    break;
            }
        });
        $scope.toback = function() {
            $filter('跳回上一页')(2);
        };
    });
})