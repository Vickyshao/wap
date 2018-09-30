/*我的明细 lee*/
define([
        'js/module.js'
        , 'ngdialog'
        , 'framework/jquery-asPieProgress.js'
        , 'framework/rainbow.min.js'
    ]
    , function (controllers, ngdialog) {
        controllers.controller('minxiController'
            , ['$scope', '$rootScope'
                , 'resourceService'
                , '$filter'
                , '$state'
                , '$localStorage'
                , '$anchorScroll'
                , function ($scope, $rootScope, resourceService, $filter, $state,$localStorage,$anchorScroll) {
                    $rootScope.title="我的明细";
                    $scope.userOBJ = $filter('isRegister')();
                    var user=$scope.userOBJ.user.member;
                    var isLoad=true;
                    var pageOn=1;
                    $scope.cpList = [];

                    $scope.loadMore = function(item) {
                            if(item.id == $scope.cpList[$scope.cpList.length - 1].id){
                                if(isLoad){
                                    if(pageOn != $scope.page.pageOn){
                                        resourceService.queryPost($scope, $filter('getUrl')('我的明细'), {
                                        pageOn: pageOn,
                                        uid:user.uid,
                                        tradeType:0,
                                        pageSize: 10
                                    }, {name:'我的明细'});
                                        isLoad=false;
                                    }
                                };
                            };
                      };
                    $scope.$on('resourceService.QUERY_POST_MYEVENT', function(event,data,eObj) {
                        switch(eObj.name){
                            case '我的明细':
                                $scope.page = data.map.page;
                                if(pageOn==$scope.page.pageOn){
                                    isLoad=true;
                                }
                                if(data.map.page.pageOn <= data.map.page.totalPage){
                                    pageOn = $scope.page.pageOn + 1;
                                    for (var i = 0; i < data.map.page.rows.length; i++) {
                                        $scope.cpList.push(data.map.page.rows[i]);
                                    }
                                }else{
                                    isLoad=false;
                                }
                            break;
                        };
                    });
                    $scope.toback=function () {
                        $filter('跳回上一页')();
                    };
                    resourceService.queryPost($scope, $filter('getUrl')('我的明细'), {
                    	uid:user.uid,
                    	pageOn:1,
                    	pageSize:10,
                    	tradeType:0,
                    }, {name:'我的明细'});
            }
        ])
    })

