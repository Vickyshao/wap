define(['jweixin', 'js/module.js', 'ngdialog'], function (wx, controllers, ngdialog) {
    controllers.controller('cjhdcplistController', function ($scope, $rootScope, resourceService, $filter, $state, $localStorage, $timeout) {
        $rootScope.title = "活动专享标";
        delete $localStorage.coupon;
        $filter('isPath')('cjhdcplist');
        var isLoad = true;
        var pageOn = 1;
        $scope.cpList = [];
        resourceService.queryPost($scope, $filter('getUrl')('cplist'), { pageOn: pageOn, type: 1, pageSize: 10 }, { name: '产品列表' });
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
            };
        });
        $scope.toback = function () {
            $filter('跳回上一页')(2);
        };
        $scope.radius = $('.rem-rule').width();
    })
})