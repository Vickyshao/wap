'use strict';
define([
    'js/module.js', 'jquery', 'ngdialog'
], function(controllers, $, ngdialog) {
    controllers.controller('indexCtrl', ['$scope', 'resourceService','$http', '$filter', '$state', function($scope, resourceService,$http, $filter, $state) {
        $filter('isPath')('main.home');
        resourceService.queryPost($scope, $filter('getUrl')('index'),{code:4}, '加载首页数据');
        

        $scope.$on('resourceService.QUERY_POST_MYEVENT', function(event, data, type) {
            switch (type) {
                case '加载首页数据':
                    $scope.product=data.product;
                    break;
            }
        });
    }])
})