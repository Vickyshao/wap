
define([
    'js/module.js'
    ]
    ,function(controllers){
    controllers.controller('fanliCtrl'
        ,['$scope'
        ,'$filter'
        ,'$state'
        ,'$location'
        ,'resourceService'
        ,'$localStorage'
        ,function($scope,$filter,$state,$location,resourceService,$localStorage){
        	if($location.$$search.toFrom != undefined || $location.$$search.recommCode!= undefined||$location.$$search.tid!=undefined){
                $localStorage.webFormPath = $location.$$search;
            };
            resourceService.queryPost($scope, $filter('getUrl')('selectProductInfo'), {}, { name: '产品详情'});
            if($location.$$search.frompc){$scope.frompc=$location.$$search.frompc;}
            if($filter('isRegister')().user&&$filter('isRegister')().user.member&&$filter('isRegister')().user.member.id){
                $scope.user=$filter('isRegister')().user;
            }
            $scope.fanli30=[
            	{amount:5000,money:170},
            	{amount:10000,money:240},
            	{amount:30000,money:360},
            	{amount:50000,money:480},
            	{amount:100000,money:600}
            ];
            $scope.fanli60=[
            	{amount:5000,money:200},
            	{amount:10000,money:280},
            	{amount:30000,money:420},
            	{amount:50000,money:620},
            	{amount:100000,money:1100}
            ];
            $scope.fanli180=[
            	{amount:5000,money:260},
            	{amount:10000,money:300},
            	{amount:30000,money:600},
            	{amount:50000,money:900},
            	{amount:100000,money:1650}
            ];
            $scope.gotoDetail=function(deadline){
            	resourceService.queryPost($scope, $filter('getUrl')('getUse'), {deadline:deadline}, { name: '获取最新产品'});
            };
            $scope.$on('resourceService.QUERY_POST_MYEVENT', function(event, data, type) {
                switch (type.name) {
                    case '获取最新产品':
                        $state.go("cpDetail",{pid:data.map.pid});
                        break;
                    case '产品详情':
                        $scope.data = data.map;
                        break;
                };
            });
        }
    ]);
})