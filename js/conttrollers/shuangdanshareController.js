define(['js/module.js'], function (controllers) {
    controllers.controller('shuangdanshareController', ['$scope', '$rootScope', '$filter', '$state', 'resourceService', '$timeout', '$location', '$anchorScroll', '$stateParams', function ($scope, $rootScope, $filter, $state, resourceService, $timeout, $location, $anchorScroll, $stateParams) {
        $scope.wap = $stateParams.wap;
        $('body').scrollTop(0);

        resourceService.queryPost($scope, $filter('getUrl')('双旦分享'), {
            uid: $stateParams.uid
        }, '双旦分享');
        $scope.$on('resourceService.QUERY_POST_MYEVENT', function (event, data, type) {
            switch (type) {
                case '双旦分享':
                    if (data.success) {
                        $scope.name = data.map.name;
                        $scope.amount = data.map.amount;
                        $scope.phone = data.map.phone;
                    } else {
                        $filter('服务器信息')(data.errorCode, $scope, 'y')
                    }
                    break;
            };
        });
    }])
})
