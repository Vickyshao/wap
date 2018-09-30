/* 
 * @Author: lee
 * @Date:   2016-01-10 23:29:04
 * @Last Modified by:   anchen
 * @Last Modified time: 2016-01-12 21:49:52
 */

'use strict';

define([
        'js/module.js'
        , 'jquery'
        , 'ngdialog'
    ]
    , function (controllers, $, ngdialog) {

        'use strict';

        controllers.controller('controllerRealname'
            , ['$scope', '$rootScope'
                , 'resourceService'
                , '$filter'
                , '$state'
                , function ($scope, $rootScope, resourceService, $filter, $state) {
            	
            
        $scope.register=true;
                    

                    $scope.toPassword=function(){
                    	resourceService.queryPost($scope, $filter('getUrl')('setrealname'),{
                    		'realName':$scope.username,
                    		'idCards':$scope.userID,
                    		'uid':$rootScope.userid
                    		
                    	}, '实名认证');  
                    	
                    	
                       
                    }
                    $scope.toHome = function () {

                        $state.go('home');
                    }
                    $scope.getyzm=function(){
                    	resourceService.queryPost($scope, $filter('getUrl')('getyzm'),{
                    		'mobilephone':$scope.mobile,
                    		'type':'register',
                    		'joinFrom':'joinFrom',
                    		'uid':'0'
                    	}, '获取验证码');   
                    }
                   
                    	
                    $scope.$on('resourceService.QUERY_POST_MYEVENT', function(event,data,type) {
                    	
                    	 
                    	if(type=='实名认证'){
                    		if(data.result=="0"){
                    			$scope.desc_userid="认证失败,用户名与身份证不匹配";
                    		}
                    		else if(data.result=="1"){
                    			$scope.desc_userid="认证成功";
                    			 $scope.realName=false;
                                 $scope.password=true;
                    		}

                    	}
       				 
       			});
                    

                }
            ])


        
    })