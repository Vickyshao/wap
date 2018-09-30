
define([
    'js/module.js'
    ]
    ,function(controllers){
    controllers.controller('iphonelistCtrl'
        ,['$scope'
        ,'$filter'
        ,'$state'
        ,"$stateParams"
        ,'resourceService'
        ,'$timeout'
        ,function($scope,$filter,$state,$stateParams,resourceService,$timeout){
            $scope.title="iphone7活动标";
            $scope.datalist=[];
            $scope.pageOn=1;
            $scope.wap=$stateParams.wap;
            $filter('isPath')('iphonelist');
            $scope.toback = function () {
            	alert(1);
                $filter('跳回上一页')(2);
            };
            $(window).scrollTop(0);
            $scope.loading=true;
            resourceService.queryPost($scope, $filter('getUrl')('活动开奖结果'), {
            	pageOn:$scope.pageOn,
            	pageSize:20
            }, {name:'getReservation'});
            $scope.$on('resourceService.QUERY_POST_MYEVENT', function(event,data,eObj) {
                switch(eObj.name){
                    case 'getReservation': 
                    if(data.success){
                        $scope.datalist=$scope.datalist.concat(data.map.history);
                        if(data.map.history.length>0){
                        	$scope.pageOn++;
                        }
                        $scope.loading=true;
                    }
                    break;
                };
            });
            var scrollLoading=function(){
				　　var scrollTop = $(window).scrollTop();
				　　var scrollHeight = $(document).height();
				　　var windowHeight = $(window).height();
				　　if(scrollTop + windowHeight == scrollHeight){
						if($scope.loading){
							$scope.loading=false;
							resourceService.queryPost($scope, $filter('getUrl')('活动开奖结果'), {
				            	pageOn:$scope.pageOn,
				            	pageSize:20
				            }, {name:'getReservation'});
			            }
				　　}
			}
            $scope.gotoDetail=function(id){
                if($scope.wap){
                    $state.go('activityPerson',{id:id,wap:true});
                }else{
                    $state.go('activityPerson',{id:id});
                }
            }
            $timeout(function(){
            	document.addEventListener('scroll',scrollLoading);
            })
            $scope.$on('$stateChangeStart',function(){
            	document.removeEventListener('scroll',scrollLoading);
            })
        }
    ]);
})