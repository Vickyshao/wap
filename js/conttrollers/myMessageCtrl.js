define([
    'js/module.js'
    ]
    ,function(controllers){
    controllers.controller('myMessageCtrl'
        ,['$scope'
        ,'$rootScope'
        ,'$filter'
        ,'$state'
        ,'resourceService'
        ,function($scope,$rootScope,$filter,$state,resourceService){

            $rootScope.title="我的消息";
            $scope.userOBJ=$filter('isRegister')();
            $scope.showMode = 1;

            $scope.trade = {
                request: false,
                type: 3,
                beforePage: 2,
                pageOn: 1,
                pro: [],
                isLoad: true
            };
            $scope.act = {
                request: false,
                type: 2,
                beforePage: 2,
                pageOn: 1,
                pro: [],
                isLoad: true
            };
            $scope.system = {
                request: false,
                type: 1,
                beforePage: 2,
                pageOn: 1,
                pro: [],
                isLoad: true
            };

            $scope.getData = function(item,proItem) {
                $scope.member = {
                    uid: $scope.userOBJ.user.member.uid,
                    type: item.type,
                    pageOn: item.pageOn,
                    pageSize: 5
                };
                if (item.request == false) {
                    resourceService.queryPost($scope, $filter('getUrl')('我的消息'),$scope.member,{name:'我的消息',item:item});
                    item.request = true;
                } else {
                    if (item.isLoad) {
                        if (proItem.id == item.pro[item.pro.length - 1].id) {
                            if (item.beforePage != item.pageOn) {
                                $scope.member.pageOn = item.beforePage;
                                resourceService.queryPost($scope, $filter('getUrl')('我的消息'),$scope.member,{name:'我的消息',item:item});
                                item.isLoad = false;        
                            }
                        }
                    }
                }
            };

            $scope.getData($scope.trade);

            $scope.toback=function () {
                $filter('跳回上一页')();
            };

            $scope.$on('resourceService.QUERY_POST_MYEVENT', function(event,data,type) {
                switch(type.name){
                    case '我的消息': 
                        if(data.success){
                            $scope.user = data.map;
                            type.item.pageOn = data.map.page.pageOn;
                            if (type.item.beforePage == type.item.pageOn) {
                                type.item.isLoad = true;
                            }
                            if (data.map.page.pageOn <= data.map.page.totalPage) {
                                type.item.beforePage = data.map.page.pageOn + 1;
                                for (var i = 0; i < data.map.page.rows.length; i++) {
                                    type.item.pro.push(data.map.page.rows[i]);
                                }
                            } else {
                                type.item.isLoad = false;
                            }
                        }else{
                            $filter('服务器信息')(data.errorCode,$scope,'y');
                        }
                    break;
                }
            });

            $scope.changeMode = function(type) {
                var $triggerAct = $('.trigger-wrap .active');
                switch(type) {
                    case 1: 
                        $scope.showMode = 1;
                        if ($scope.trade.request == false) {
                            $scope.getData($scope.trade);
                        }
                    break;
                    case 2: 
                        $scope.showMode = 2;
                        if ($scope.act.request == false) {
                            $scope.getData($scope.act);
                        }
                    break;
                    case 3: 
                        $scope.showMode = 3;
                        if ($scope.system.request == false) {
                            $scope.getData($scope.system);
                        }
                    break;
                }
            };
            
        }
    ]);
})