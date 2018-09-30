define([
    'js/module.js'
], function (controllers) {
    controllers.controller('conferenceCtrl', ['$scope', '$rootScope', '$filter', '$state', 'resourceService', '$localStorage', '$timeout', '$stateParams','$sce', function ($scope, $rootScope, $filter, $state, resourceService, $localStorage, $timeout, $stateParams,$sce) {
        $rootScope.title = '发布会-沪深理财';
        if ($stateParams.wap) {
            $scope.wap = $stateParams.wap;
        }

        setTimeout(function(){
            var mySwiper2 = new Swiper('#banner',{
                  autoplay:5000,
                  visibilityFullFit : true,
                  loop:true,
                  pagination : '.pagination'
            });
        }, 50)
        
        $scope.taps=function(num){
            $scope.action=num;
            setTimeout(function(){
                var mySwiper2 = new Swiper('#banner',{
                      autoplay:5000,
                      visibilityFullFit : true,
                      loop:true,
                      pagination : '.pagination'
                });
            }, 50)
        }
        



    }]);


})
