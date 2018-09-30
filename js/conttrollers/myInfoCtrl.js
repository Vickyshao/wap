define([
    'js/module.js'
    ]
    ,function(controllers){
    controllers.controller('myInfoCtrl'
        ,['$scope'
        ,'$rootScope'
        ,'$filter'
        ,'$state'
        ,'resourceService'
        ,'$localStorage'
        ,function($scope,$rootScope,$filter,$state,resourceService,$localStorage){
            $rootScope.title="我的信息";
            $scope.userOBJ=$filter('isRegister')();
            $filter('isPath')('myInfo');
            if($rootScope.fromNative) {
                $('.risk').removeClass('headerTop')
            }
            resourceService.queryPost($scope, $filter('getUrl')('我的信息'), {
                uid:$scope.userOBJ.user.member.uid
            }, '我的信息');

            $scope.$on('resourceService.QUERY_POST_MYEVENT', function(event,data,type) {
                switch(type){
                    case '我的信息': 
                        if(data.success){
                            $scope.user = data.map;
                        }else{
                            $filter('服务器信息')(data.errorCode,$scope,'y');
                        }
                    break;
                };
            });

            $scope.toback=function () {
                $filter('跳回上一页')(2);
            };

            $scope.out=function (argument) {
                switch(argument){
                    case 'out': 
                        $filter('清空缓存')();
                        $state.go('main.home');
                    break;
                };
            };
            
        }
    ]);
    controllers.controller('riskEvaluationCtrl'
        ,['$scope'
        ,'$rootScope'
        ,'$filter'
        ,'$state'
        ,'resourceService'
        ,'$location'
            ,'$timeout'
        ,function($scope,$rootScope,$filter,$state,resourceService,$location,$timeout){
            $rootScope.title="风险评测";
            $scope.userOBJ=$filter('isRegister')();
            $scope.fromPage = $rootScope.getUrlParam('fromPage');
            $scope.comeFrom = $rootScope.getUrlParam('comeFrom');
            $scope.pid = $rootScope.getUrlParam('pid');
            $scope.amount = $rootScope.getUrlParam('amount');
            $scope.showRedPacket = false;
            if($rootScope.fromNative) {
                $('.risk').removeClass('headerTop')
            }
            $scope.knowType = function () {
                $state.go('evaluationType',{fromPage: $scope.fromPage});
            }
            $filter('isPath')('riskEvaluation');
            if($rootScope.getUrlParam('fromPage') == 'ceping') {
                $scope.showFirst = true;
            } else {
                $scope.showFirst = false;
            }

            /*风险评测新户提示红包已获得*/
            if ($location.$$search.showRedPacket == '1') {
                $scope.showRedPacket = true;
                $timeout(function() {
                    $scope.showRedPacket = false;
                }, 2000);
            }
            var PostData = {};
            if($rootScope.fromNative) {
                PostData.uid = $rootScope.getUrlParam('uid');
                PostData.token = $rootScope.getUrlParam('token');
            } else {
                PostData.uid = $scope.userOBJ.user.member.uid;
            }
            resourceService.queryPost($scope, $filter('getUrl')('首次评测显示'), PostData, '首次评测显示');

            $scope.chongxinpingce = function () {
                $state.go('startEvaluation', {uid: PostData.uid, token: PostData.token,fromPage: 'ceping'});
            }
            $scope.toInvest = function () {
                if($rootScope.fromNative) {
                    document.location='hushentoinvest2:';
                } else {
                    if($scope.comeFrom == 'rechargeOk') {
                        $state.go('rechargesuccess',{ amount: $scope.amount});
                    } else if($scope.pid) {
                        $state.go('cpInvestDetail',{ pid: $scope.pid});
                    } else {
                        $state.go('main.bankBillList');
                    }
                }
            };
            $scope.$on('resourceService.QUERY_POST_MYEVENT', function(event,data,type) {
                switch(type){
                    case '首次评测显示':
                        if(data.success){
                            $scope.riskContent = data.map;
                        }
                    break;
                };
            });
            $scope.toback=function () {
                $filter('跳回上一页')(2);
            };

        }
    ]);
    controllers.controller('evaluationCtrl'
        ,['$scope'
        ,'$rootScope'
        ,'$filter'
        ,'$state'
        ,'resourceService',
        '$location','$timeout'
        ,function($scope,$rootScope,$filter,$state,resourceService, $location,$timeout){
            $rootScope.title="风险评测";
            $scope.userOBJ=$filter('isRegister')();
            $filter('isPath')('startEvaluation');
            $scope.showRiskDialog = false;
            $scope.closeDia = true;
            $scope.fromPage = $rootScope.getUrlParam('fromPage');
            $scope.comeFrom = $rootScope.getUrlParam('comeFrom');
            $scope.pid = $rootScope.getUrlParam('pid');
            $scope.amount = $rootScope.getUrlParam('amount');
            $scope.showTip = $location.$$search.showTip;
            if($rootScope.fromNative) {
                $('.risk').removeClass('headerTop')
            }
            $scope.reviewEvaluation = function () {
                $scope.closeDialog();
                $state.go('riskEvaluation',{fromPage: $scope.fromPage,comeFrom: $scope.comeFrom,amount: $scope.amount});
            };
            if ($scope.showTip == '1' && ($location.$$search.fromPage == 'myaccount' || $location.$$search.fromPage == 'ceping')) {
                $filter('测评提示弹窗')($scope);
            }
            var PostData = {};
            if($rootScope.fromNative) {
                PostData.uid = $rootScope.getUrlParam('uid');
                PostData.token = $rootScope.getUrlParam('token');
            } else {
                PostData.uid = $scope.userOBJ.user.member.uid || $rootScope.getUrlParam('uid');
            }
            $scope.sendList = [];
            var i = 0;
            var str = '';
            $scope.optionItem = function (event,_this) {
                str += $scope.curSub.id +','+ _this.item.oid +';';
                $(event.target).siblings().removeClass('active');
                $(event.target).addClass('active');
                $timeout(function () {
                    if(i <  ($scope.subjectList.length-1)) {
                        $scope.curSub = $scope.subjectList[++i];
                    } else {
                        PostData.itemList = str;
                        resourceService.queryPost($scope, $filter('getUrl')('风险评测结果'), PostData, '风险评测结果');
                    }
                },300);

            };
            $scope.previous = function () {
                $scope.curSub = $scope.subjectList[--i];
                $scope.sendList.pop();
            };

            resourceService.queryPost($scope, $filter('getUrl')('风险评测题目'), PostData, '风险评测题目');
            $scope.$on('resourceService.QUERY_POST_MYEVENT', function(event,data,type) {
                switch(type){
                    case '风险评测题目':
                        if(data.success){
                            $scope.subjectList = data.map.list;
                            $scope.subjectListLen = $scope.subjectList.length;
                            $scope.curSub = $scope.subjectList[0];
                        }
                    break;
                    case '风险评测结果':
                        if(data.success){
                            $scope.riskResult = data.map;
                            $scope.isShowRedPacket = null;
                            if (data.map.couponShadow) {
                                $scope.isShowRedPacket = 1;
                            }
                            $state.go('riskEvaluation', {uid: PostData.uid,showRedPacket:$scope.isShowRedPacket,token: PostData.token,fromPage: $scope.fromPage,comeFrom: $scope.comeFrom,amount: $scope.amount,pid: $scope.pid});
                        }
                    break;
                };
            });

            $scope.toback=function () {
                $filter('跳回上一页')(2);
            };

        }
    ]);
})