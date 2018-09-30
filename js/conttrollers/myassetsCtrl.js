define([
    'js/module.js'
    ]
    ,function(controllers){
    controllers.controller('myAssetsCtrl'
        ,['$scope'
        ,'$rootScope'
        ,'$filter'
        ,'$state'
        ,'resourceService'
        ,'$stateParams'
        ,function($scope,$rootScope,$filter,$state,resourceService,$stateParams){
            $rootScope.title="我的资产";
            $scope.userOBJ=$filter('isRegister')();
            $scope.isShowLeft = true;
            var objs = {};
            var isLoad = true;
            var pageOn = 1;
            $scope.list = [];
            if ($stateParams.page) {
                $scope.isShowLeft = false;
            }
            $scope.loadMore = function (item,index) {
                if ($scope.page.pageOn < $scope.page.totalPage) {
                    if (isLoad) {
                        var obj = {
                            uid:$scope.userOBJ.user.member.uid,
                            pageOn: pageOn,
                            pageSize:10
                        };
                        if (pageOn != $scope.page.pageOn) {
                            resourceService.queryPost($scope, $filter('getUrl')('交易明细'), obj, '累计收益');
                            isLoad = false;
                        }
                    };
                };
            };

            resourceService.queryPost($scope, $filter('getUrl')('我的资产'), {
                    uid:$scope.userOBJ.user.member.uid
            }, '我的资产');
            resourceService.queryPost($scope, $filter('getUrl')('交易明细'), {
                uid:$scope.userOBJ.user.member.uid,
                pageOn:1,
                pageSize:200
            }, '累计收益');

            $scope.$on('resourceService.QUERY_POST_MYEVENT', function(event,data,type) {
                switch(type){
                    case '我的资产': 
                        if(data.success){
                            $scope.funds = data.map.funds;
                        }else{
                            $filter('服务器信息')(data.errorCode,$scope,'y');
                        };
                    break;
                    case '累计收益':
                        if(data.success){
                            // $scope.list = data.map.page.rows;
                            $scope.AccumulatedIncome = data.map.AccumulatedIncome;
                            $scope.page = data.map.page;
                            $scope.total = data.map.page.total;
                            $scope.totalPage = data.map.page.totalPage;
                            $scope.pageOn = data.map.page.pageOn;
                            if (pageOn == $scope.page.pageOn) {
                                isLoad = true;
                            }
                            if (data.map.page.pageOn <= data.map.page.totalPage) {
                                pageOn = $scope.page.pageOn + 1;
                                for (var i = 0; i < data.map.page.rows.length; i++) {
                                    $scope.list.push(data.map.page.rows[i]);
                                }

                            } else {
                                isLoad = false;
                            }
                        }else{
                            $filter('服务器信息')(data.errorCode,$scope,'y');
                        };
                        break;
                }
            });
            $scope.toback=function () {
                $filter('跳回上一页')();
            };
        }
    ])
        .controller('myAssetsDetailCtrl'
            ,['$scope'
                ,'$rootScope'
                ,'$filter'
                ,'$state'
                ,'resourceService'
                ,function($scope,$rootScope,$filter,$state,resourceService){
                    $rootScope.title="交易明细";
                    $scope.userOBJ=$filter('isRegister')();
                    $scope.isShowLeft = true;
                    $scope.infos = [];
                    $scope.pageOn = 1;
                    $scope.pageSize = 10;
                    $scope.showMode = 1;
                    var obj = {
                        pageOn:$scope.pageOn,
                        pageSize:$scope.pageSize
                    };
                    $scope.getData = function() {
                        var obj = {
                            uid:$scope.userOBJ.user.member.uid,
                            pageOn: $scope.pageOn,
                            pageSize: $scope.pageSize,
                            tradeType:0
                        };
                        /*if($rootScope.fromNative) {
                            obj.token = $rootScope.getUrlParam('token');
                            obj.uid = $rootScope.getUrlParam('uid');
                        } else {
                            if ($scope.user) {
                                obj.uid = $scope.user.member.uid;
                            }
                        }*/
                        resourceService.queryPost($scope, $filter('getUrl')('我的明细'), obj, '交易明细');
                    };

                    resourceService.queryPost($scope, $filter('getUrl')('我的明细'), {
                        uid:$scope.userOBJ.user.member.uid,
                        pageOn:1,
                        pageSize:20,
                        tradeType:0
                    }, '交易明细');

                    $scope.$on('resourceService.QUERY_POST_MYEVENT', function(event,data,type) {
                        switch(type){
                            case '交易明细':
                                if(data.success){
                                    // $scope.funds = data.map.rows;
                                    $scope.staging = data.map;
                                    /*if(data.map.latestActiveNotReimbursedRecord){
                                        $localStorage.latestActiveNotReimbursedRecord = $scope.latestActiveNotReimbursedRecord = data.map.latestActiveNotReimbursedRecord;
                                    }*/
                                    $scope.page = data.map.page;

                                    $scope.TOTALPAGE = data.map.page.totalPage;
                                    if (data.map.page.pageOn <= data.map.page.totalPage) {

                                        $scope.infos = $scope.infos.concat(data.map.page.rows);
                                        /*if($scope.pageOn == 1){
                                            $('.GaugeMeter').attr('data-percent', $scope.staging.periodsReimbursedRate*100);
                                            $('.GaugeMeter').attr('data-text', $scope.staging.periodsReimbursedAmount);
                                            $(".GaugeMeter").gaugeMeter();
                                        }*/
                                        if($scope.pageOn == $scope.TOTALPAGE){
                                            $('.load-end').addClass("no-more");
                                            $('.load-end').text('没有更多了');
                                        }else{
                                            $('.load-end').text('点击加载更多...');
                                            $scope.pageOn++;
                                        }
                                    }
                                }else{
                                    $filter('服务器信息')(data.errorCode,$scope,'y');
                                };
                                break;
                        }
                    });
                    $scope.toback=function () {
                        $filter('跳回上一页')();
                    };
                    $scope.loadMore= function () {
                        if(!$('.load-end').hasClass("no-more")){
                            $('.load-end').addClass("loadmore");
                            $('.load-end').text('正在加载...');
                            $scope.getData();
                        }
                    }
                }
            ]);
})