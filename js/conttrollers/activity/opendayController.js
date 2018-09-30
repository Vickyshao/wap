define(['js/module.js'], function(controllers) {
    controllers.controller('opendayController', function($scope, $filter, $state, $stateParams, resourceService,$timeout,$localStorage) {
        $scope.title = '开放日';
        $filter('isPath')('openday');
        var isLoad = true;
        var pageOn = 1;
        $scope.opendayList = [];
        if ($stateParams.wap) {
            $scope.wap = $stateParams.wap;
        }
        $scope.showMore = false;
        resourceService.queryPost($scope, $filter('getUrl')('getOpenDayList'), {status:2}, { name: '往期列表' });
        resourceService.queryPost($scope, $filter('getUrl')('getOpenDayDetail'), {}, { name: '活动内容' });
        $scope.$on('resourceService.QUERY_POST_MYEVENT', function(event, data, type) {
            switch (type.name) {
                case '往期列表':
                    if (data.success) {
                        $scope.page = data.map.page;
                        if (pageOn == $scope.page.pageOn) {
                            isLoad = true;
                        }
                        if (data.map.page.pageOn <= data.map.page.totalPage) {
                            pageOn = $scope.page.pageOn + 1;
                            for (var i = 0; i < data.map.page.rows.length; i++) {
                                $scope.opendayList.push(data.map.page.rows[i]);
                            }
                        } else {
                            isLoad = false;
                        }
                    }
                    break;
                case '活动内容':
                    if (data.success) {
                        $scope.content = data.map.jsSpecial;
                        $timeout(function(){
                            var swiper = new Swiper('.swiper-container', {
                                paginationClickable: true,
                                autoplay: 3000,
                                spaceBetween: 0,
                                loop: true,
                                autoplayDisableOnInteraction: false,
                                pagination: '.swiper-pagination-h'
                            });
                        })
                    }
                    break;
            }
        });
        $scope.loadMore = function(item) {
            if (item.id == $scope.opendayList[$scope.opendayList.length - 1].id) {
                if (isLoad) {
                    if (pageOn != $scope.page.pageOn) {
                        var obj = {
                            pageOn: pageOn,
                            pageSize: 10,
                            status: 2
                        };
                        resourceService.queryPost($scope, $filter('getUrl')('getOpenDayList'), obj, { name: '往期列表' });
                        isLoad = false;
                    }
                };
            };
        };
        $scope.toback = function() {
            $filter('跳回上一页')(2);
        };
    });
})