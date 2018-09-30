/* 
* @Author: xyc
* @Date:   2016-01-18 23:29:04
*/

'use strict';
define([
    'js/module.js'
    ,'jquery'
    ,'ngdialog'
    ]
    ,function(controllers,$,ngdialog){

    controllers.controller('couponController'
        ,['$scope'
        ,'resourceService'
        ,'$filter'
        ,'$state'
        ,'$rootScope'
        ,'$localStorage'
        ,'$location'
        ,'$stateParams'
        ,function($scope,resourceService,$filter,$state,$rootScope,$localStorage
            ,$location,$stateParams){
            $rootScope.title='可用的红包';
            $scope.myId = $location.$$search.cpid;
            $scope.coupons=$localStorage.coupons;
            // console.log($scope.coupons)
            $scope.amt = $stateParams.amt;
            $scope.onClick=function (item) {
            	if( item != '' ) {
            		 if(item.enableAmount <= $scope.amt || $scope.amt==null){
                    $localStorage.coupon=item;
                    $state.go('investment',{cpid:item.id,amt:$stateParams.amt});
                } 
            	} else {
            		$state.go('investment');
            	}
//              if(item.enableAmount <= $scope.amt || $scope.amt==null){
//                  $localStorage.coupon=item;
//                  $state.go('investment',{cpid:item.id,amt:$stateParams.amt});
//              } else {
//              		$state.go('investment');
//              }
            };
        }
    ]);
})
