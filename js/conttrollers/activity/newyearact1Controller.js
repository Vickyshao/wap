define(['js/module.js'], function (controllers) {
    controllers.controller('newyearact1Controller', ['$scope', '$rootScope', '$filter', '$state', 'resourceService', '$stateParams','$window', function ($scope, $rootScope, $filter, $state, resourceService, $stateParams,$window) {
        $rootScope.title = $scope.title = '沪深理财-网贷投资，国企控股平台';
        if ($stateParams.wap) {
            $scope.wap = $stateParams.wap;
        }
        if ($stateParams.uid) {
            $scope.uid = $stateParams.uid;
        }
        $scope.showRule = function () {
            $scope.ruleShow = true;
            $('body,html').css({ height: '100%', overflow: 'hidden' });
        }
        $scope.closeRule = function () {
            $scope.ruleShow = false;
            $('body,html').css({ height: 'auto', overflow: 'initial' });
        };
        $scope.gotoDetail = function (deadline) {
            resourceService.queryPost($scope, $filter('getUrl')('getUse'), { deadline: deadline }, { name: '获取最新产品' });
        };
        $scope.$on('resourceService.QUERY_POST_MYEVENT', function (event, data, type) {
            switch (type.name) {
                case '获取最新产品':
                    if ($scope.wap) {
                        $state.go("cpDetail", { pid: data.map.pid,from:'newyearact1' });
                    }
                    else {
                        $window.location.href = 'jsmp://page=9?pid='+data.map.pid+'&ptype='+data.map.pType;
                    }
                    break;
            };
        });
    }]);
})