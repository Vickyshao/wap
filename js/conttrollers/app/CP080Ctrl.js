define([
    'js/module.js'
    ]
    ,function(controllers){
    controllers.controller('CP080Ctrl'
        ,['$scope'
        ,'$rootScope'
        ,'$filter'
        ,'$state'
        ,'resourceService'
        ,'$interval'
        ,'$stateParams'
        ,function($scope,$rootScope,$filter,$state,resourceService,$interval,$stateParams){

            resourceService.queryPost($scope, $filter('getUrl')('银行限额列表'),{},'银行限额列表');

            $scope.$on('resourceService.QUERY_POST_MYEVENT', function(event,data,type) {
                switch(type){
                    case '银行限额列表': 
                        if(data.success){
                            $scope.bankList = data.map;
                        }else{
                        }
                    break;
                };
            });
        }
    ]);
})