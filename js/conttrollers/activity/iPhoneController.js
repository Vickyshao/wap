define(['js/module.js'], function (controllers) {
    controllers.controller('iPhoneController', function ($scope, $rootScope, $filter, $state, resourceService, ngDialog, $timeout, $localStorage, $location,$stateParams, $interval) {
        $filter('isPath')('special');
        $rootScope.title = '沪深理财-网贷投资，国企控股平台';
        $scope.product = {};
        $scope.yuebiao = {};
        $("html,body").scrollTop(0);
        if ($location.$$search.toFrom != undefined || $location.$$search.recommCode != undefined || $location.$$search.tid != undefined) {
            $localStorage.webFormPath = $location.$$search;
        }
        if($stateParams.wap){
            $scope.wap = $stateParams.wap;
        }
        $scope.swiper = {
            name: "hongbaoSwiper",
            readyLoading: false
        };
        $scope.conf = {
            slidesPerView: 3,
            centeredSlides: true,
            spaceBetween: 0,
            grabCursor: true,
            loop: true,
            autoplay: 3000,
            autoplayDisableOnInteraction: false
        };
        // 活动标详情
        resourceService.queryPost($scope, $filter('getUrl')('活动标详情'), {}, { name: '活动标详情' });
        // 活动开奖结果
        resourceService.queryPost($scope, $filter('getUrl')('活动开奖结果'), {}, { name: '活动开奖结果' });
        var height = $('.news-list').height()/5;
        var $dataTable = $('.news-list ul');
        $scope.$on('resourceService.QUERY_POST_MYEVENT', function (event, data, type) {
            switch (type.name) {
                case "活动标详情":
                    if (data.success) {
                        $scope.product = data.map.result;
                        $scope.newTrends = data.map.newTrends;
                        // 列表数据轮动
                        if ($scope.newTrends.length > 5) {
                            setInterval(function () {
                                $dataTable.animate({ 'margin-top': '-' + height + 'px' }, 1000, function () {
                                    $dataTable.find('li').eq(0).appendTo($dataTable);
                                    $dataTable.css('margin-top', 0);
                                });
                            }, 3000);
                        }
                    }
                    break;
                case "活动开奖结果":
                    if (data.success) {
                        $scope.current = data.map.current[0];
                        // $scope.history = data.map.history;
                        $scope.history = [
                            {
                            prizeHeadPhoto: false,
                            prizeContent: '我是一个大傻逼1111'
                            },{
                            prizeHeadPhoto: false,
                            prizeContent: '我是一个大傻逼2222'
                            }
                        ];
                        if (data.map.current && data.map.current.length > 0) {
                            $scope.history.unshift(data.map.current[0]); 
                            $scope.history.pop(); 
                        }
                        if ($scope.current && $scope.current.length > 0 && $scope.current[0].prizeUrl) { 
                            $scope.videolink = $scope.current[0].prizeUrl; 
                            $scope.activityPeriods = $scope.current[0].activityPeriods; 
                            $scope.prizeCode = $scope.current[0].prizeCode; 
                            $scope.prizeMobile = $scope.current[0].prizeMobile; 
                        }
                        else {
                            for (var i = 0; i < $scope.history.length; i++) {
                                if ($scope.history[i].prizeUrl) {
                                    $scope.videolink = $scope.history[i].prizeUrl;
                                    $scope.activityPeriods = $scope.history[i].activityPeriods;
                                    $scope.prizeCode = $scope.history[i].prizeCode;
                                    $scope.prizeMobile = $scope.history[i].prizeMobile;
                                    break;
                                }
                            }
                        }
                        $timeout(function () {
                            $scope.swiper.initSwiper();
                        });
                    }
                    break;
            }
        });
        $scope.showRule = function(){
            $('.rule').fadeIn(200);
        }
        $scope.closeRule = function(){
            $('.rule').fadeOut(200);
        }
        $scope.gotoDetail = function (id) {
            if ($stateParams.wap) {
                $state.go('activityPerson', { id: id, wap: true });
            } else {
                $state.go('activityPerson', { id: id });
            }
        };
        $scope.gotop = function () {
            $("html,body").animate({ scrollTop: 0 });
        };
    });
})

