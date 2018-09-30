
define([
    'js/module.js'
    ]
    ,function(controllers){
    controllers.controller('myMissionCtrl'
        ,['$scope'
        ,'$filter'
        ,'$state'
        ,'$location'
        ,'resourceService'
        ,function($scope,$filter,$state,$location,resourceService){
            $scope.title='赚钱任务';
            $scope.active=0;
            function init(){
                resourceService.queryPost($scope, $filter('getUrl')('getActivityFriendConfigAll'),{status:$scope.active,pageOn:1,pageSize:500},{name:'赚钱任务'});
            }
            $scope.changeMode=function(i){
                $scope.active=i;
                init();
            }
            init();
            $scope.$on('resourceService.QUERY_POST_MYEVENT', function(event, data, type) {
                switch (type.name) {
                    case '赚钱任务': 
                    if (data.success) {
                        $scope.datalist=data.map.pageInfo;
                    }
                    break;
                }
            });
            $scope.toback = function() {
                $filter('跳回上一页')();
            };
            $scope.statego=function(item){
                $state.go('inviteFriend'+item.periods,{afid:item.id,wap:true})
            }
            $scope.date=new Date().getTime();
        }
    ]);
})