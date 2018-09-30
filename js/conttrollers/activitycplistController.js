define(['jweixin', 'js/module.js', 'ngdialog'], function (wx, controllers, ngdialog) {
    controllers.controller('activitycplistController', function ($scope, $rootScope, resourceService, $filter, $state, $localStorage, $timeout) {
        $rootScope.title = "活动专享标";
        delete $localStorage.coupon;
        $filter('isPath')('activitycplist');
        var isLoad = true;
        var pageOn = 1;
        $scope.cpList = [];
        resourceService.queryPost($scope, $filter('getUrl')('cplist'), { type: 1 }, { name: '产品列表' });
        resourceService.queryPost($scope, $filter('getUrl')('活动标列表banner'), {}, { name: '活动标列表banner' });
        $scope.loadMore = function (item) {
            if (item.id == $scope.cpList[$scope.cpList.length - 1].id) {
                if (isLoad) {
                    if (pageOn != $scope.page.pageOn) {
                        var obj = {
                            pageOn: pageOn,
                            pageSize: 10
                        };
                        obj.type = 1;
                        resourceService.queryPost($scope, $filter('getUrl')('cplist'), obj, { name: '产品列表' });
                        isLoad = false;
                    }
                };
            };
        };
        $scope.$on('resourceService.QUERY_POST_MYEVENT', function (event, data, eObj) {
            switch (eObj.name) {
                case '产品列表':
                    $scope.page = data.map.page;
                    if (pageOn == $scope.page.pageOn) {
                        isLoad = true;
                    }
                    if (data.map.page.pageOn <= data.map.page.totalPage) {
                        pageOn = $scope.page.pageOn + 1;
                        for (var i = 0; i < data.map.page.rows.length; i++) {
                            $scope.cpList.push(data.map.page.rows[i]);
                        }
                    } else {
                        isLoad = false;
                    }
                    break;
                case '活动标列表banner':
                    $scope.bannerList = data.map.sysBanners;
                    $timeout(function () {
                        var swiper = new Swiper('.activitycplist-swiper',{
                            slidesPerView: 1,
                            loop: true,
                            autoplay: 2500,
                            autoplayDisableOnInteraction: false,
                            grabCursor: true,
                            spaceBetween: 0,
                            pagination: '.swiper-pagination',
                            paginationClickable: true
                        })
                    });
                    break;
            };
        });
        $scope.tocpdetail = function(item){
            if(item.prizeId){
                $state.go('tjsdetail',{pid:item.id});
            }
            else{
                $state.go('cpDetail',{pid:item.id});
            }
        }
        $scope.toback = function () {
            $filter('跳回上一页')(2);
        };
        $scope.radius = $('.rem-rule').width();
    }) 
})