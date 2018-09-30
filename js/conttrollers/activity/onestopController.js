define(['js/module.js'], function(controllers) {
    controllers.controller('onestopController', function($scope,$rootScope, $filter, $state, $stateParams, resourceService,$timeout,$localStorage) {
        $rootScope.title = $scope.title = '一站式资产服务平台';
        var swiper = new Swiper('.swiper-container', {
            spaceBetween: 0,
            loop: false,
            followFinger: false,
            direction : 'vertical'
        });
    });
})