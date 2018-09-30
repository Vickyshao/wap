define(['js/module.js', 'ngdialog'] , function (controllers, ngdialog) {
    controllers.controller('tailawardCtrl', ['$scope', '$rootScope', 'resourceService', '$filter', '$state', 'md5', '$localStorage', '$stateParams', '$location', function ($scope, $rootScope,resourceService, $filter, $state, md5, $localStorage, $stateParams) {
                    $rootScope.title = '尾标奖';
                    $filter('isPath')('tailawardDetail');
                    if ($stateParams.wap) {
                        $scope.wap = $stateParams.wap;
                    }
                    if($rootScope.fromNative || $rootScope.getUrlParam('allowDL') == 'true') {
                        $('.common-head').css('display','none');
                        $('.tailaward').removeClass('headerTop');
                    }             
                    $scope.toback = function() {
                        $filter('跳回上一页')(2);
                    };
                    


                }
            ]);
    });