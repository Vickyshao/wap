'use strict';
define(['js/module.js', 'ngdialog'], function (controllers, ngdialog) {
    controllers.controller('reportController', ['$scope', '$rootScope', 'resourceService', '$http', '$filter', '$state','$stateParams', function ($scope, $rootScope, resourceService, $http, $filter, $state,$stateParams) {
        $rootScope.title = $scope.title = '媒体报道';
        if($stateParams.wap){
            $scope.wap = $stateParams.wap;
        }
        if($stateParams.page){
            $scope.page = $stateParams.page;
        }
        else{
            $scope.page = 1;
        }
    }])
})