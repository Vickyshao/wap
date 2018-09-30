define(['jweixin', 'js/module.js', 'jquery', 'ngdialog', 'SHR256'], function (wx, controllers, $, ngdialog, SHR256, weixin) {
    controllers.controller('creditRate', ['$scope', '$rootScope', 'resourceService', '$filter', '$state', 'ngDialog', '$location', 'md5', '$localStorage', '$stateParams', function ($scope, $rootScope, resourceService, $filter, $state, ngDialog, $location, md5, $localStorage, $stateParams) {
        $filter('isPath')('creditRating');
        $scope.toback=function () {
            $filter('跳回上一页')();
        };
        document.getElementsByTagName('html')[0].scrollTop = 0;
        document.getElementsByTagName('body')[0].scrollTop = 0;
        $rootScope.title = 'AA+信用评级';
        $scope.isLogin = $filter('isRegister')().register;
        $scope.banner = [
            {imgUrl: '/images/activity/creditRating/trust1.png', location: ''
            },{imgUrl: '/images/activity/creditRating/trust2.png',location: ''
            }
        ];
        if($rootScope.fromNative) {
            $('.creditRating').removeClass('headerTop')
        }
    }])
})