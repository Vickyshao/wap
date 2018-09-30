define(['js/module.js'], function(controllers) {
    controllers.controller('serviceCenterCtrl', function($scope, $filter, $state, $stateParams, resourceService,$timeout,$localStorage,$rootScope) {
        $rootScope.title = '客服中心';
        $filter('isPath')('serviceCenter');
        $scope.user = $filter('isRegister')();
        if ($stateParams.wap) {
            $scope.wap = $stateParams.wap;
        }
        if($rootScope.fromNative || $rootScope.getUrlParam('allowDL') == 'true') {
            $('.common-head').css('display','none');
            $('.serviceCenter').removeClass('headerTop');
        }
        
        $scope.toback = function() {
            $filter('跳回上一页')(2);
        };
        $scope.toDial = function() {
            $filter('dial')($scope);
        };
        $scope.toYJFK = function () {
            if ($scope.user.register) {
                $state.go('YJFK')
            } else {
                $state.go('dl')
            }
        };
        $scope.slideToggle = function (e) {
            $(e.currentTarget).siblings("p").stop().slideToggle(200);
            if ($(e.currentTarget).find('i').hasClass('slideDown')) {
                $(e.currentTarget).find('i').removeClass('slideDown')
            } else { $(e.currentTarget).find('i').addClass('slideDown') }
        };
    })

    /*.controller('publicWelfareController', function($scope, $filter, $state, $stateParams, resourceService,$timeout,$localStorage,$rootScope) {
        $rootScope.title = '沪深理财-网贷投资理财，国企控股平台';
        $filter('isPath')('publicWelfare');
        if ($stateParams.wap) {
            $scope.wap = $stateParams.wap;
        }
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
        resourceService.queryPost($scope, $filter('getUrl')('公益活动内容'), {id:$stateParams.id}, { name: '公益活动内容' });
        $scope.$on('resourceService.QUERY_POST_MYEVENT', function(event, data, type) {
            switch (type.name) {
                case "公益活动内容":
                    if (data.success) {
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
    */
    .controller('rzzcPageCtrl', function($scope, $filter, $state, $stateParams, resourceService,$timeout,$localStorage,$rootScope) {
        $rootScope.title = '认证注册';
        $filter('isPath')('rzzcPage');
        if ($stateParams.wap) {
            $scope.wap = $stateParams.wap;
        }
        if($rootScope.fromNative || $rootScope.getUrlParam('allowDL') == 'true') {
            $('.common-head').css('display','none');
            $('.serviceCenter').removeClass('headerTop');
        }

        $scope.toback = function() {
            $filter('跳回上一页')(2);
        };

        $scope.slideToggle = function (e) {
            $(e.currentTarget).siblings("p").stop().slideToggle(200);
            if ($(e.currentTarget).find('i').hasClass('slideDown')) {
                $(e.currentTarget).find('i').removeClass('slideDown')
            } else { $(e.currentTarget).find('i').addClass('slideDown') }
        };
    })

    .controller('aqbzPageCtrl', function($scope, $filter, $state, $stateParams, resourceService,$timeout,$localStorage,$rootScope) {
        $rootScope.title = '安全保障';
        $filter('isPath')('aqbzPage');
        if ($stateParams.wap) {
            $scope.wap = $stateParams.wap;
        }
        if($rootScope.fromNative || $rootScope.getUrlParam('allowDL') == 'true') {
            $('.common-head').css('display','none');
            $('.serviceCenter').removeClass('headerTop');
        }

        $scope.toback = function() {
            $filter('跳回上一页')(2);
        };

        $scope.slideToggle = function (e) {
            $(e.currentTarget).siblings("p").stop().slideToggle(200);
            if ($(e.currentTarget).find('i').hasClass('slideDown')) {
                $(e.currentTarget).find('i').removeClass('slideDown')
            } else { $(e.currentTarget).find('i').addClass('slideDown') }
        };
    })
    .controller('cztxPageCtrl', function($scope, $filter, $state, $stateParams, resourceService,$timeout,$localStorage,$rootScope) {
        $rootScope.title = '充值提现';
        $filter('isPath')('cztxPage');
        if ($stateParams.wap) {
            $scope.wap = $stateParams.wap;
        }
        if($rootScope.fromNative || $rootScope.getUrlParam('allowDL') == 'true') {
            $('.common-head').css('display','none');
            $('.serviceCenter').removeClass('headerTop');
        }

        $scope.toback = function() {
            $filter('跳回上一页')(2);
        };

        $scope.slideToggle = function (e) {
            $(e.currentTarget).siblings("p").stop().slideToggle(200);
            if ($(e.currentTarget).find('i').hasClass('slideDown')) {
                $(e.currentTarget).find('i').removeClass('slideDown')
            } else { $(e.currentTarget).find('i').addClass('slideDown') }
        };
    })
    .controller('tzflPageCtrl', function($scope, $filter, $state, $stateParams, resourceService,$timeout,$localStorage,$rootScope) {
        $rootScope.title = '投资福利';
        $filter('isPath')('tzflPage');
        if ($stateParams.wap) {
            $scope.wap = $stateParams.wap;
        }
        if($rootScope.fromNative || $rootScope.getUrlParam('allowDL') == 'true') {
            $('.common-head').css('display','none');
            $('.serviceCenter').removeClass('headerTop');
        }

        $scope.toback = function() {
            $filter('跳回上一页')(2);
        };

        $scope.slideToggle = function (e) {
            $(e.currentTarget).siblings("p").stop().slideToggle(200);
            if ($(e.currentTarget).find('i').hasClass('slideDown')) {
                $(e.currentTarget).find('i').removeClass('slideDown')
            } else { $(e.currentTarget).find('i').addClass('slideDown') }
        };
    })
    .controller('cpjsPageCtrl', function($scope, $filter, $state, $stateParams, resourceService,$timeout,$localStorage,$rootScope) {
        $rootScope.title = '产品介绍';
        $filter('isPath')('cpjsPage');
        if ($stateParams.wap) {
            $scope.wap = $stateParams.wap;
        }
        if($rootScope.fromNative || $rootScope.getUrlParam('allowDL') == 'true') {
            $('.common-head').css('display','none');
            $('.serviceCenter').removeClass('headerTop');
        }

        $scope.toback = function() {
            $filter('跳回上一页')(2);
        };

        $scope.slideToggle = function (e) {
            $(e.currentTarget).siblings("p").stop().slideToggle(200);
            if ($(e.currentTarget).find('i').hasClass('slideDown')) {
                $(e.currentTarget).find('i').removeClass('slideDown')
            } else { $(e.currentTarget).find('i').addClass('slideDown') }
        };
    })
    .controller('qtwtPageCtrl', function($scope, $filter, $state, $stateParams, resourceService,$timeout,$localStorage,$rootScope) {
        $rootScope.title = '其他问题';
        $filter('isPath')('qtwtPage');
        if ($stateParams.wap) {
            $scope.wap = $stateParams.wap;
        }
        if($rootScope.fromNative || $rootScope.getUrlParam('allowDL') == 'true') {
            $('.common-head').css('display','none');
            $('.serviceCenter').removeClass('headerTop');
        }

        $scope.toback = function() {
            $filter('跳回上一页')(2);
        };
        $scope.slideToggle = function (e) {
            $(e.currentTarget).siblings("p").stop().slideToggle(200);
            if ($(e.currentTarget).find('i').hasClass('slideDown')) {
                $(e.currentTarget).find('i').removeClass('slideDown')
            } else { $(e.currentTarget).find('i').addClass('slideDown') }
        };
    });
})