define([
    'js/module.js','jquery'
    ]
    ,function(controllers,$){
    controllers.controller('flwhzCtrl'
        ,['$scope','resourceService','$filter','$location','$localStorage','$state',function($scope,resourceService,$filter,$location,$localStorage,$state){
            if($location.$$search.toFrom != undefined || $location.$$search.recommCode!= undefined||$location.$$search.tid!=undefined){
                $localStorage.webFormPath = $location.$$search;
            };
            $scope.data1={};
            $scope.data2={};
            $scope.data3={};
            $scope.goDetail=function(id){
                $state.go('cpDetail',{pid:id});
            }
            resourceService.queryPost($scope, $filter('getUrl')('selectProductInfo'), {}, { name: '获取投资列表'});
            $scope.$on('resourceService.QUERY_POST_MYEVENT', function(event, data, type) {
            switch (type.name) {
                case '获取投资列表': 
                if (data.success) {
                    for(var i=0;i<data.info.length;i++){
                        switch(data.info[i].deadline){
                            case 30:
                            $scope.data1.deadline=data.info[i].deadline;
                            $scope.data1.rate=data.info[i].rate;
                            $scope.data1.id=data.info[i].id;
                            break;
                            case 60:
                            $scope.data2.deadline=data.info[i].deadline;
                            $scope.data2.rate=data.info[i].rate;
                            $scope.data2.id=data.info[i].id;
                            break;
                            case 180:
                            $scope.data3.deadline=data.info[i].deadline;
                            $scope.data3.rate=data.info[i].rate;
                            $scope.data3.id=data.info[i].id;
                            break;
                        }
                    }
                }
                break;
            }
            });
        }
        ])
})