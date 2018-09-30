/*
* @Author: 潘宏博
* @Date:   2015-07-14 12:55:44
* @Last Modified by:   anchen
* @Last Modified time: 2015-07-03 17:05:45
*/
'use strict';
var menuModule = angular.module('menuModule',[]);
menuModule.directive('menu',function($rootScope,$state,$stateParams,menuService){
    return{
        restrict : 'E',
        template : '<ul class="navbarlistul"><li ng-repeat="tool in menuItems"><div  ng-right-click="" ng-click="clickMenu($event)">{{tool.menuName}}<span class='+
        "'glyphicon glyphicon-chevron-left'"+'></span></span></div><ul><li ng-repeat="child in tool.children"><div ng-class="{'+"'current'"+':child.url==state}"><a ng-click="toWorkspace(child.url)" >{{child.menuName}}</a></div></li></ul></li></ul>',
        scope : true,
        link: function(scope, element, attris ) {
        	scope.menuItems=[];
        	
        	scope.menuSelect = function(data){
				scope.menuItems = data;
			}
        	menuService.menuSelect({parentFunctionMenu:{id:0}},scope);
          
            scope.clickMenu=function(event){
            	$(event.currentTarget).siblings("ul").stop().slideToggle();
            	$(event.currentTarget).parent().siblings().children('ul').stop().slideUp();
            }
        },
        controller : ['$rootScope','$scope', '$http', '$state', '$stateParams',
            function($rootScope,$scope, $http, $state, $stateParams) {
                //$scope.menuItems = [];
        		$scope.state=$state.current.name;
                $scope.toWorkspace = function (path){
                	$state.go(path);
                	$scope.state=path;
                };
                
            }
        ]
    }
})
