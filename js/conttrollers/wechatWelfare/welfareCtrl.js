define(['js/module.js'], function (controllers) {
    controllers.controller('welfareCtrl', function ($scope, $rootScope, $filter, $state, resourceService, ngDialog, $timeout, $localStorage, $location,$stateParams, $interval, isWeixin) {
        $filter('isPath')('welfare');
        var wHeight = $(window).height();
        $(".welfare").css({minHeight: wHeight+"px"});
        if ($rootScope.fromNative) {
            $('.welfare').removeClass('headerTop');
        }
        $scope.goFollow = function () {
            if ($rootScope.fromNative) {
                document.location = 'hushengofollow:';
                $('.welfare').removeClass('headerTop');
            } else {
                $state.go('goFollow')
            }
        };
        $scope.openWechat = function () {
            document.location = 'hushengoopenwechat:';
        }
        $scope.toback = function () {
            $filter('跳回上一页')(2);
        };
    })
        .controller('goFollowCtrl', function ($scope, $rootScope, $filter, $state, resourceService, ngDialog, $timeout, $localStorage, $location,$stateParams, $interval, isWeixin) {
            $filter('isPath')('goFollow');
            if ($rootScope.fromNative) {
                $('.welfare').removeClass('headerTop');
            }
            $scope.copy = function() {
                document.location = 'hushencopy:';
            };
            $scope.toback = function () {
                $filter('跳回上一页')(2);
            };
        })
        .controller('towelfareCtrl', function ($scope, $rootScope, $filter) {
            $filter('isPath')('toWelfare');
            if ($rootScope.fromNative) {
                $('.welfare').removeClass('headerTop');
            }
            $scope.toback = function () {
                $filter('跳回上一页')(2);
            };
        });
})

