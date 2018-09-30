
define([
    'js/module.js'
    ]
    ,function(controllers){
    controllers.controller('moreController'
        ,['$scope'
        ,'$filter'
        ,'$state'
        ,'$localStorage'
        ,'$rootScope'
        ,function($scope,$filter,$state,$localStorage,$rootScope){
        	/*初始菜单设置  1：首页  2：我要投资  3：我的账户  4：更多*/
            $localStorage.activeMenu = 4;
            $filter('isPath')('main.more');
            $scope.out=function (argument) {
                switch(argument){
                    case 'out': 
                        $filter('清空缓存')();
                        $rootScope.enfuUser = false;
                        $state.go('main.home');
                    break;
                };
            }
        }
    ]);
    controllers.controller('hlsbtCtrl'
        ,['$scope'
        ,'$filter'
        ,'$state'
        ,'$location'
        ,'$localStorage'
        ,function($scope,$filter,$state,$location,$localStorage){
        	if($location.$$search.toFrom != undefined || $location.$$search.recommCode!= undefined||$location.$$search.tid!=undefined){
                $localStorage.webFormPath = $location.$$search;
            };
        }
    ]);
})