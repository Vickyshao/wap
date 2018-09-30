define(['js/module.js'], function(controllers) {
    controllers.controller('serverUpgradeCtrl', function($scope, $filter, $state, $stateParams, resourceService,$timeout,$localStorage,$rootScope) {
        $rootScope.title = '服务器升级公告';
        $filter('isPath')('serverUpgrade');
        $scope.toback = function() {
            $filter('跳回上一页')();
        };
    })
})