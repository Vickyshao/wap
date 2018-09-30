
define([
    'js/module.js'
    ]
    ,function(controllers){
    controllers.controller('friendreg'
        ,['$scope'
        ,'$filter'
        ,'$state'
        ,'$location'
        ,function($scope,$filter,$state,$location){
        	if($location.$$search.toFrom != undefined || $location.$$search.recommCode!= undefined||$location.$$search.tid!=undefined){
                $localStorage.webFormPath = $location.$$search;
            };
            if($location.$$search.frompc){$scope.frompc=$location.$$search.frompc;}
            if($filter('isRegister')().user&&$filter('isRegister')().user.member&&$filter('isRegister')().user.member.id){
                $scope.user=$filter('isRegister')().user;
            }
            
        }
    ]);
})