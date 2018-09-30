define([
    'js/module.js'
    ]
    ,function(controllers){
    controllers.controller('activityPersonCtrl'
        ,['$scope'
        ,'$rootScope'
        ,'$filter'
        ,'$state'
        ,'$stateParams'
        ,'resourceService'
        ,function($scope,$rootScope,$filter,$state,$stateParams,resourceService){
            $rootScope.title="中奖者";
            $scope.userOBJ=$filter('isRegister')();
            $scope.wap=$stateParams.wap;
            resourceService.queryPost($scope, $filter('getUrl')('getPrizeInfoByProductId'), {
                    id:$state.params.id
            }, '中奖者');
            $scope.$on('resourceService.QUERY_POST_MYEVENT', function(event,data,type) {
                switch(type){
                    case '中奖者': 
                        if(data.success){
                            if(data.map.list.length>0){
                                $scope.user = data.map.list[0];
                                
                            }
                        }else{
                            $filter('服务器信息')(data.errorCode,$scope,'y');
                        };
                    break;
                }
            });
            // $scope.toback=function () {
            //     $state.go('iphonelist',{wap:true});
            // };
            $scope.toback = function () {
                $filter('跳回上一页')(1);
            };
        }
    ]);
})