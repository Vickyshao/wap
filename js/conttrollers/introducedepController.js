define(['js/module.js', 'jquery'], function (controllers, $) {
    controllers.controller('introducedepController', function ($scope, resourceService, $filter, $location, $localStorage, $rootScope, $state, $window, $stateParams) {
        $('body').scrollTop(0);
        $filter('isPath')('introducedep');
        $rootScope.title = '银行存管正式上线';
        if ($stateParams.wap) {
            $scope.wap = $stateParams.wap;
            var user = $filter('isRegister')();
            if (user.register == true) {
                $scope.isLog = true;
                resourceService.queryPost($scope, $filter('getUrl')('我的信息'), {
                    uid: user.user.member.uid
                }, '我的信息');
            }
            else {
                $scope.isLog = false;
            }
        }
        else {
            if ($stateParams.uid) {
                $scope.isLog = true;
                resourceService.queryPost($scope, $filter('getUrl')('我的信息'), {
                    uid: $stateParams.uid,
                    token: $stateParams.token
                }, '我的信息');
            }
            else {
                $scope.isLog = false;
            }
        }
        $scope.$on('resourceService.QUERY_POST_MYEVENT', function (event, data, type) {
            switch (type) {
                case '我的信息':
                    if (data.success) {
                        $scope.isFuiou = data.map.isFuiou;
                    } else {
                        $filter('服务器信息')(data.errorCode, $scope, 'y');
                    }
                    break;
            };
        });
        $scope.closeBar = function () {
            $('.footer-bar').hide();
            $('.introducedep').css('padding-bottom', 0);
        }
        $scope.toback = function () {
            $filter('跳回上一页')(2);
        };
    })
})