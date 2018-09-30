define([
    'js/module.js'
    ]
    ,function(controllers){
    controllers.controller('inviteCtrl'
        ,['$scope'
        ,'$rootScope'
        ,'$filter'
        ,'$state'
        ,'resourceService'
        ,function($scope,$rootScope,$filter,$state,resourceService){
            $rootScope.title="邀请小伙伴，理财更轻松";
            function getUrlParam(name) {
                var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
                var r = window.location.search.substr(1).match(reg);  //匹配目标参数
                if (r != null) return unescape(r[2]); return null; //返回参数值
            }
            $scope.uid = getUrlParam('uid');
            $scope.wap = getUrlParam('wap');

            var upgrade = getUrlParam('upgrade');
            if(upgrade >=0){
                $scope.upgrade = false;
            }else{
                $scope.upgrade = true;
            }
            if (getUrlParam('uid') == '' || getUrlParam('uid') == undefined) {
                $scope.isLogin = false;
            } else {
                $scope.isLogin = true;
                resourceService.queryPost($scope, $filter('getUrl')('好友互推'), {
                    uid:$scope.uid,
                    pageOn:1,
                    pageSize:5
                }, '好友互推');
            }
            $scope.$on('resourceService.QUERY_POST_MYEVENT', function(event,data,type) {
                switch(type){
                    case '好友互推': 
                        if(data.success){
                            $scope.list = data.map.list;
                            if ($scope.list.length == 0) {
                                $scope.nolist = true;
                            } else {
                                $scope.nolist = false;
                            }
                        }else{
                            
                        }
                    break;
                };
            });
        }
    ]);
})