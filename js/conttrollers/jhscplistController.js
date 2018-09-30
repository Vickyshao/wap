define(['jweixin', 'js/module.js', 'ngdialog'], function (wx, controllers, ngdialog) {
    controllers.controller('jhscplistController', function ($scope, $rootScope, resourceService, $filter, $state, $localStorage, $timeout) {
        $rootScope.title = "聚划算";
        delete $localStorage.coupon;
        $filter('isPath')('jhscplist');
        var isLoad = true;
        var pageOn = 1;
        $scope.cpList = [];
        resourceService.queryPost($scope, $filter('getUrl')('cplist'), { type: null }, { name: '产品列表' });
        $scope.loadMore = function (item) {
            if (item.id == $scope.cpList[$scope.cpList.length - 1].id) {
                if (isLoad) {
                    if (pageOn != $scope.page.pageOn) {
                        var obj = {
                            pageOn: pageOn,
                            pageSize: 10
                        };
                        obj.type = null;
                        resourceService.queryPost($scope, $filter('getUrl')('cplist'), obj, { name: '产品列表' });
                        isLoad = false;
                    }
                };
            };
        };
        $scope.$on('resourceService.QUERY_POST_MYEVENT', function (event, data, eObj) {
            switch (eObj.name) {
                case '产品列表':
                    $scope.page = data.map.pageJHS;
                    if (pageOn == $scope.page.pageOn) {
                        isLoad = true;
                    }
                    if (data.map.pageJHS.pageOn <= data.map.pageJHS.totalPage) {
                        pageOn = $scope.page.pageOn + 1;
                        for (var i = 0; i < data.map.pageJHS.rows.length; i++) {
                            $scope.cpList.push(data.map.pageJHS.rows[i]);
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