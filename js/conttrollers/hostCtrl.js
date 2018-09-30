define(['jweixin', 'js/module.js', 'jquery', 'ngdialog', 'SHR256'], function (wx, controllers, $, ngdialog, SHR256, weixin) {
    controllers.controller('hostCtrl', ['$scope', '$rootScope', 'resourceService', '$filter', '$state', 'ngDialog', '$location', 'md5', '$localStorage', '$stateParams', 'isWeixin', function ($scope, $rootScope, resourceService, $filter, $state, ngDialog, $location, md5, $localStorage, $stateParams, isWeixin) {
        resourceService.queryPost($scope, $filter('getUrl')('host666'), {}, 'host');
        $scope.$on('resourceService.QUERY_POST_MYEVENT', function(event, data, type) {
            switch(type){
                case 'host':
                    $scope.host = data.msg;
                    break;
            };
        });
    }])
})