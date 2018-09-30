define([
    'js/module.js'
    , 'framework/jquery-asPieProgress.js'
    , 'framework/rainbow.min.js'
    ]
    ,function(controllers){
    controllers.controller('myInvestCtrl'
        ,['$scope'
        ,'$rootScope'
        ,'$filter'
        ,'$state'
        ,'resourceService'
        ,'$localStorage'
        ,'$location'
        ,function($scope,$rootScope,$filter,$state,resourceService,$localStorage,$location){
            $rootScope.title="我的投资";
            $scope.userOBJ=$filter('isRegister')();
            $filter('isPath')('myInvest');
            $scope.showMode = 1;
            $scope.one = {
                request: false,
                status: 4,
                beforePage: 2,
                pageOn: 1,
                pro: [],
                isLoad: true
            };
            $scope.hostName = 'https://hushenlc.cn';

            // $scope.host = $location.host();
            // if($scope.host == 'm1.hushenlc.cn') {
            //     $scope.hostName = 'https://hushenlc.cn';
            // } else {
            //     $scope.hostName = 'http://172.16.16.32';
            // }
            var oneArr=[];
            $scope.two = {
                request: false,
                status: 3,
                beforePage: 2,
                pageOn: 1,
                pro: [],
                isLoad: true
            };
            $scope.three = {
                request: false,
                status: 0,
                beforePage: 2,
                pageOn: 1,
                pro: [],
                isLoad: true
            };

            $scope.getData = function(item,proItem) {
                $scope.member = {
                    uid: $scope.userOBJ.user.member.uid,
                    status: item.status,
                    pageOn: item.pageOn,
                    pageSize: 5
                };
                if (item.request == false) {
                    resourceService.queryPost($scope, $filter('getUrl')('我的投资'),$scope.member,{name:'我的投资',item:item});
                    item.request = true;
                } else {
                    if (item.isLoad) {
                        if (proItem.id == item.pro[item.pro.length - 1].id) {
                            if (item.beforePage != item.pageOn) {
                                $scope.member.pageOn = item.beforePage;
                                resourceService.queryPost($scope, $filter('getUrl')('我的投资'),$scope.member,{name:'我的投资',item:item});
                                item.isLoad = false;        
                            }
                        }
                    }
                }
            };

            $scope.getData($scope.one);

            $scope.toback=function () {
                $filter('跳回上一页')(2);
            };
            $scope.goCashed=function(item){
                $state.go("mycashed",{cashedId:item.id});
            };
            $scope.toDetail = function (item) {
                // item = JSON.stringify(item)
                $localStorage.myinvestdetail = item;
                $localStorage.myinvestdetail.cfcaSwitchFlag = $scope.cfcaSwitchFlag;
                // console.log(item)
                $state.go("myInvestDetail");
            };
            $scope.$on('resourceService.QUERY_POST_MYEVENT', function(event,data,type) {
                switch(type.name){
                    case '我的投资': 
                        if(data.success){
                            $scope.cfcaSwitchFlag = data.map.cfcaSwitchFlag;
                            type.item.user = data.map;
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

            $scope.upDownClick = function(event) {
                var $this = $(event.currentTarget),
                    $thisCon = $this.parents('.con');
                if ($thisCon.hasClass('active')) {
                    $thisCon.removeClass('active');
                } else {
                    $thisCon.addClass('active');
                }
            };

            $scope.changeMode = function(type) {
                var $triggerAct = $('.trigger-wrap .active');
                switch(type) {
                    case 1: 
                        $scope.showMode = 1;
                        if ($scope.one.request == false) {
                            $scope.getData($scope.one);
                        }
                    break;
                    case 2: 
                        $scope.showMode = 2;
                        if ($scope.two.request == false) {
                            $scope.getData($scope.two);
                        }
                    break;
                    case 3: 
                        $scope.showMode = 3;
                        if ($scope.three.request == false) {
                            $scope.getData($scope.three);
                        }
                    break;
                }
            };
        }
    ])
    .controller('myInvestHisCtrl'
        ,['$scope'
            ,'$rootScope'
            ,'$filter'
            ,'$state'
            ,'resourceService'
            ,'$localStorage'
            ,'$location'
            ,function($scope,$rootScope,$filter,$state,resourceService,$localStorage,$location){
                $rootScope.title="历史投资记录";
                $("html,body").scrollTop(0);
                $scope.userOBJ=$filter('isRegister')();
                $filter('isPath')('myInvestHis');
                $scope.one = {
                    request: false,
                    status: 3,
                    beforePage: 2,
                    pageOn: 1,
                    pro: [],
                    isLoad: true
                };
                $scope.hostName = 'https://hushenlc.cn';

                // $scope.host = $location.host();
                // if($scope.host == 'm1.hushenlc.cn') {
                //     $scope.hostName = 'https://hushenlc.cn';
                // } else {
                //     $scope.hostName = 'http://172.16.16.32';
                // }
                var oneArr=[];
                /*$scope.two = {
                    request: false,
                    status: 3,
                    beforePage: 2,
                    pageOn: 1,
                    pro: [],
                    isLoad: true
                };
                $scope.three = {
                    request: false,
                    status: 0,
                    beforePage: 2,
                    pageOn: 1,
                    pro: [],
                    isLoad: true
                };*/

                $scope.getData = function(item,proItem) {
                    $scope.member = {
                        uid: $scope.userOBJ.user.member.uid,
                        status: 3,
                        pageOn: item.pageOn,
                        pageSize: 5
                    };
                    if (item.request == false) {
                        resourceService.queryPost($scope, $filter('getUrl')('我的投资'),$scope.member,{name:'我的投资',item:item});
                        item.request = true;
                    } else {
                        if (item.isLoad) {
                            if (proItem.id == item.pro[item.pro.length - 1].id) {
                                if (item.beforePage != item.pageOn) {
                                    $scope.member.pageOn = item.beforePage;
                                    resourceService.queryPost($scope, $filter('getUrl')('我的投资'),$scope.member,{name:'我的投资',item:item});
                                    item.isLoad = false;
                                }
                            }
                        }
                    }
                };

                $scope.getData($scope.one);

                $scope.toback=function () {
                    $filter('跳回上一页')(2);
                };
                $scope.goCashed=function(item){
                    $state.go("mycashed",{cashedId:item.id});
                }
                $scope.$on('resourceService.QUERY_POST_MYEVENT', function(event,data,type) {
                    switch(type.name){
                        case '我的投资':
                            if(data.success){
                                type.item.user = data.map;
                                $scope.accumulatedIncome = data.map.accumulatedIncome;
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

                $scope.upDownClick = function(event) {
                    var $this = $(event.currentTarget),
                        $thisCon = $this.parents('.con');
                    if ($thisCon.hasClass('active')) {
                        $thisCon.removeClass('active');
                    } else {
                        $thisCon.addClass('active');
                    }
                };

                $scope.changeMode = function(type) {
                    var $triggerAct = $('.trigger-wrap .active');
                    switch(type) {
                        case 1:
                            $scope.showMode = 1;
                            if ($scope.one.request == false) {
                                $scope.getData($scope.one);
                            }
                            break;
                        case 2:
                            $scope.showMode = 2;
                            if ($scope.two.request == false) {
                                $scope.getData($scope.two);
                            }
                            break;
                        case 3:
                            $scope.showMode = 3;
                            if ($scope.three.request == false) {
                                $scope.getData($scope.three);
                            }
                            break;
                    }
                };
            }
        ])
    .controller('myInvestDetailCtrl'
        ,['$scope'
            ,'$rootScope'
            ,'$filter'
            ,'$state'
            ,'resourceService'
            ,'$localStorage'
            ,'$location'
            ,'$stateParams'
            ,function($scope,$rootScope,$filter,$state,resourceService,$localStorage,$location,$stateParams){
                $rootScope.title="投资详情";
                $scope.userOBJ=$filter('isRegister')();
                $filter('isPath')('myInvestDetail');
                $scope.toback=function () {
                    delete $localStorage.myinvestdetail;
                    $filter('跳回上一页')(2);
                };
                $scope.hostName = 'https://hushenlc.cn';
                $scope.isOldAgreement = true;
                $scope.goToElectronicPage = null;

                // $scope.hostName = 'http://dev.shcen.com';
                $scope.cpinfo = $localStorage.myinvestdetail;

                if ($scope.userOBJ){
                    // resourceService.queryPost($scope, $filter('getUrl')('我的投资'),{ uid: $scope.userOBJ.user.member.uid, pid: $scope.pid},{name:'我的投资'});
                   resourceService.queryPost($scope, $filter('getUrl')('回款记录'),{ id: $scope.cpinfo.id, uid: $scope.userOBJ.user.member.uid },{name:'回款记录'});
                } else {
                    $state.go("dl")
                }
                // console.log($localStorage.myinvestdetail)
                $scope.toDetailePage = function () {
                    if ($scope.cpinfo.type == 1) {   //新手标
                        $state.go('cpInvestDetail',{pid: $scope.cpinfo.pid});
                    } else if ($scope.cpinfo.type == 5) {   //体验标
                        $state.go('tyjdetail');
                    } else{
                        if ($scope.cpinfo.productType == 0) {
                            if ($scope.cpinfo.fullName.indexOf("恩弗")>-1){    //恩弗标
                                $state.go('enfuCourses');
                            } else {                                          //普通标
                                $state.go('cpInvestDetail',{pid: $scope.cpinfo.pid});
                            }
                        } else if ($scope.cpinfo.productType == 2) {    //活动标
                            $state.go('lotteryinvest',{pid: $scope.cpinfo.pid});
                        }
                    }
                };
                $scope.tohuikuan = function () {
                    $state.go('reimbursementRecord',{ uid: $scope.userOBJ.user.member.uid, id: $scope.cpinfo.id})
                };
                /*电子合同*/
                $scope.gotoOtherPage = function() {
                    if ($scope.goToElectronicPage) {
                        window.open($scope.goToElectronicPage,'_blank');
                        // location.href = $scope.goToElectronicPage;
                    }
                };
                $scope.$on('resourceService.QUERY_POST_MYEVENT', function(event,data,type) {
                    switch(type.name){
                        case '我的投资':
                            if(data.success){

                            }else{
                                $filter('服务器信息')(data.errorCode,$scope,'y');
                            }
                            break;
                        case '回款记录':
                            if(data.success){
                                $scope.isOldAgreement = data.isOldAgreement;
                                if (!data.isOldAgreement) {
                                    $scope.goToElectronicPage = data.map.agreementUrl;
                                }
                            }
                            break;
                    }
                });
            }
        ])
    .controller('myInvestDetailXyCtrl'
        ,['$scope'
            ,'$rootScope'
            ,'$filter'
            ,'$state'
            ,'resourceService'
            ,'$localStorage'
            ,'$location'
            ,'$stateParams',
            '$sce'
            ,function($scope,$rootScope,$filter,$state,resourceService,$localStorage,$location,$stateParams,$sce){
                $rootScope.title="投资协议";
                $scope.userOBJ=$filter('isRegister')();
                $filter('isPath')('myInvestDetailXy');
                $scope.toback=function () {
                    $filter('跳回上一页')(2);
                };
                $scope.pid = $stateParams.pid;
                $scope.investId = $stateParams.investId;
                // $scope.trustHtml = $sce.trustAsHtml($scope.hostName+'/loan?uid='+$scope.userOBJ.user.member.uid+'&pid='+$scope.pid+'&investId='+$scope.investId);
                if ($scope.userOBJ){
                    // resourceService.queryPost($scope, $filter('getUrl')('投资协议'),{ uid: $scope.userOBJ.user.member.uid, pid: $scope.pid, investId: $scope.investId},{name:'投资协议'});
                } else {
                    $state.go("dl")
                }

                $scope.$on('resourceService.QUERY_POST_MYEVENT', function(event,data,type) {
                    switch(type.name){
                        case '投资协议':
                            if(data.success){
                                /*type.item.user = data.map;
                                $scope.accumulatedIncome = data.map.accumulatedIncome;
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
                                }*/
                            }else{
                                $filter('服务器信息')(data.errorCode,$scope,'y');
                            }
                            break;
                    }
                });
            }
        ])
    .controller('reimbursementRecordCtrl'
        ,['$scope'
            ,'$rootScope'
            ,'$filter'
            ,'$state'
            ,'resourceService'
            ,'$localStorage'
            ,'$location'
            ,'$stateParams',
            '$sce'
            ,function($scope,$rootScope,$filter,$state,resourceService,$localStorage,$location,$stateParams,$sce){
                $rootScope.title="回款记录";
                $scope.userOBJ=$filter('isRegister')();
                $filter('isPath')('reimbursementRecord');
                $scope.toback=function () {
                    $filter('跳回上一页')(2);
                };
                $scope.pid = $stateParams.pid;
                $scope.id = $stateParams.id;
                if ($scope.userOBJ){
                    resourceService.queryPost($scope, $filter('getUrl')('回款记录'),{ uid: $scope.userOBJ.user.member.uid, id: $scope.id},{name:'回款记录'});
                } else {
                    $state.go("dl")
                }

                $scope.$on('resourceService.QUERY_POST_MYEVENT', function(event,data,type) {
                    switch(type.name){
                        case '回款记录':
                            if(data.success){
                                $scope.result = data.map.result;
                            }else{
                                $filter('服务器信息')(data.errorCode,$scope,'y');
                            }
                            break;
                    }
                });
            }
        ]);
})