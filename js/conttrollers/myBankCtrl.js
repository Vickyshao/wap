define([
    'js/module.js'
    ]
    ,function(controllers){
    controllers.controller('myBankCtrl'
        ,['$scope'
        ,'$rootScope'
        ,'$filter'
        ,'$state'
        ,'resourceService'
        ,function($scope,$rootScope,$filter,$state,resourceService){
            $rootScope.title="我的银行卡";
            $filter('isPath')('myBank');
            $scope.userOBJ=$filter('isRegister')();

            resourceService.queryPost($scope, $filter('getUrl')('我的银行卡'), {
                uid:$scope.userOBJ.user.member.uid
            }, '我的银行卡');

            $scope.$on('resourceService.QUERY_POST_MYEVENT', function(event,data,type) {
                switch(type){
                    case '我的银行卡': 
                        if(data.success){
                            $scope.user = data.map;
                        }else{
                            $filter('服务器信息')(data.errorCode,$scope,'y');
                        }
                    break;
                };
            });

            $scope.toback=function () {
                $filter('跳回上一页')(2);
            };
            
        }
    ]);
})