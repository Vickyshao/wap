define(['js/module.js'], function (controllers) {
    controllers.controller('giftyyController', ['$scope', '$rootScope', '$filter', '$state', 'resourceService', '$timeout', '$location', '$anchorScroll', '$stateParams', 'ngDialog', function ($scope, $rootScope, $filter, $state, resourceService, $timeout, $location, $anchorScroll, $stateParams, ngDialog) {
        $scope.wap = $stateParams.wap;
        $scope.userOBJ = $filter('isRegister')();
        $scope.user = $scope.userOBJ.user.member;
        $scope.toback = function () {
            $filter('跳回上一页')(1);
        };
        $scope.goBack = function () {
            if ($state.params.backUrl) {
                if ($state.params.backUrl.indexOf('?') != -1) {
                    var router = $state.params.backUrl.split('?')[0];
                    var params = $state.params.backUrl.split('?')[1];
                    var obj = {};
                    var array = params.split("&");
                    if (array.length > 1) {
                        for (var i = 0; i < array.length; i++) {
                            obj[array[i].split("=")[0]] = array[i].split("=")[1];
                        }
                    } else {
                        obj[array[0].split("=")[0]] = array[0].split("=")[1];
                    }
                    $state.go(router, obj);
                } else {
                    $state.go($state.params.backUrl, { wap: true });
                }
            } else {
                $state.go("tjs", { wap: true });
            }
        }
        if ($stateParams.id) {
            var obj = {};
            obj.id = $stateParams.id;
            resourceService.queryPost($scope, $filter('getUrl')('tjs产品奖品'), obj, { name: 'tjs产品奖品' });
        } else {
            $state.go('tjs', { wap: true });
        }
        $scope.confirm = function () {
            if ($scope.user) {
                resourceService.queryPost($scope, $filter('getUrl')('tjs添加预约'), {
                    uid: $scope.user.uid,
                    ppid: $scope.prize.id
                }, { name: 'tjs预约' });
            }
            else {
                $('body,html').css({ height: 'auto', overflow: 'initial' });
                $state.go('dl', { returnurl: 'giftyy?wap=true&id=' + $stateParams.id });
            }
        }
        $scope.showyy = function () {
            $('.yy-box').fadeIn();
            // $scope.yyshow = true;
            // $('body,html').css({ height: '100%', overflow: 'hidden' });
        };
        $scope.closeyy = function () {
            $('.yy-box').fadeOut();
            // $scope.yyshow = false;
            // $('body,html').css({ height: 'auto', overflow: 'initial' });
        };
        $scope.$on('resourceService.QUERY_POST_MYEVENT', function (event, data, eObj) {
            switch (eObj.name) {
                case 'tjs产品奖品':
                    if (data.success) {
                        $scope.prize = data.map.prize;
                    }
                    break;
                case 'tjs预约':
                    if (data.success) {
                        $('body,html').css({ height: 'auto', overflow: 'initial' });
                        ngDialog.open({
                            template: '<p class="error-msg">预约成功</p>',
                            showClose: false,
                            closeByDocument: true,
                            plain: true
                        });
                        $state.go('tjs', { wap: true });
                    }
                    break;
            };
        });

    }])
})