
/*
* @Author: lee
* @Date:   2016-05-24
*/


define([
        'js/module.js'
    ]
    ,function(controllers){
        controllers.controller('rechargesucController'
            ,['$scope'
                ,'$filter'
                ,'$state'
                ,'$interval'
                ,'$rootScope'
                ,'resourceService'
                ,'ngDialog'
                ,'$stateParams'
                ,'$localStorage'
                ,function($scope,$filter,$state,$interval,$rootScope,resourceService,ngDialog,$stateParams,$localStorage){
                    $rootScope.title="充值成功";
                    $scope.amount = $stateParams.amount;
                    $scope.closeDia = false;
                    $scope.user = $filter('isRegister')().user;
                    // $scope.conponType = $stateParams.couponType;
                    $scope.cp = $localStorage.cp;
                    if ($localStorage.cpCoupon || $localStorage.coupon) {
                        if ($localStorage.coupon) {
                            $scope.cpCoupon = $localStorage.coupon;
                        }else {
                            $scope.cpCoupon = $localStorage.cpCoupon;
                        }
                    }
                    var user = $filter('isRegister')().user;
                    $scope.userTypes = {};
                    $scope.userTypes.passWord = '';
                    $scope.changeType = function ($event) {
                        $($event.currentTarget).attr('type','password');
                    }
                    $scope.toback = function () {
                        $filter('跳回上一页')(2);
                    };
                    $scope.sendRequest = function () {
                        $scope.closeDialog();
                        $scope.params = {
                            'pid': $localStorage.cp.info.id,
                            'tpwd': $localStorage.userTypes.passWord,
                            'amount': $scope.amount,
                            'uid': $filter('isRegister')().user.member.uid,
                            'activityType': 0
                        }
                        if($localStorage.latestActiveNotReimbursedRecord){
                            $scope.params.rid = $localStorage.latestActiveNotReimbursedRecord.id;
                        }
                        if($scope.cpCoupon){
                            $scope.params.fid = $scope.cpCoupon.id;
                        }
                        resourceService.queryPost($scope, $filter('getUrl')('购买产品'), $scope.params, '购买产品');
                    }
                    $scope.toInvest = function () {
                        if ($scope.amount >= $scope.cp.info.leastaAmount) {
                            if ($scope.amount%$scope.cp.info.increasAmount == 0) {
                                if ($scope.amount > $scope.balance) {
                                    $scope.isBalanceSufficient = false;
                                } else {
                                    $scope.isBalanceSufficient = true;
                                }
                                if($scope.riskContent.show) {
                                    $scope.showRiskDialog = false;
                                    $filter('测评提示弹窗')($scope);
                                } else {
                                    $filter('支付弹窗')($scope);
                                }
                            } else {
                                $filter('investAmountError')('1002','投资金额需为' +  $scope.cp.info.increasAmount + '的整数倍');
                            }
                        } else if ($scope.amount < $scope.cp.info.leastaAmount && $scope.amount != '') {
                            $filter('investAmountError')('1002',"投资金额最少为" + $scope.cp.info.leastaAmount);
                        } else if ( !$scope.amount) {
                            $filter('investAmountError')('1001');
                        }
                    }
                    // 去支付
                    $scope.zhifu = function () {
                        $scope.closeDialog();
                        resourceService.queryPost($scope, $filter('getUrl')('我的信息'), {uid: $scope.user.member.uid}, '我的信息');
                        $filter('设置交易密码弹窗')($scope);
                    };
                    $scope.$watch('amount',function(newValue,oldValue){
                        if ($scope.cp) {
                            if(newValue > $scope.cp.info.surplusAmount) {
                                $scope.amount = oldValue;
                            }
                        }

                    });
                    $scope.firstSetPwd = false;
                    $scope.enterPassword =function (flag) {
                        var ul = $(".pwd li");
                        $scope.pwd = $('#tradePwd').val();
                        var len = $scope.pwd.length;
                        for(var i=0;i<6;i++){
                            if(i < len){
                                $(ul[i]).addClass("active");
                            }else{
                                $(ul[i]).removeClass("active");
                            }
                        }
                        if(len == 6 && flag == 1){
                            if($scope.firstSetPwd) {
                                if($localStorage.userTypes.passWord1 == $scope.pwd) {
                                    $localStorage.userTypes.passWord = $scope.pwd;
                                    resourceService.queryPost($scope, $filter('getUrl')('设置交易密码'),{
                                        tpwd: $localStorage.userTypes.passWord,
                                        chkSmsCode: false,
                                        uid: $scope.user.member.uid
                                    },'设置交易密码');
                                } else {
                                    $filter('investAmountError')('1003');
                                    $scope.firstSetPwd = false;
                                }
                            } else {
                                $localStorage.userTypes.passWord1 = $scope.pwd;
                                $scope.firstSetPwd = !$scope.firstSetPwd;
                            }
                        }
                        if(len == 6 && flag == 2){
                            $localStorage.userTypes.passWord = $scope.pwd;
                            $scope.sendRequest();
                        }
                    };
                    $scope.reviewEvaluation = function () {
                        $state.go('startEvaluation',{fromPage:'ceping',comeFrom:'rechargeOk',amount: $scope.amount});
                        $scope.closeDialog();
                    }
                    // 忘记密码
                    $scope.toRetPwd = function () {
                        $scope.closeDialog();
                        $state.go('resetTradePwd',{firstset:false});
                    };
                    $scope.tobuy = function () {
                        if ($scope.amount != '' && $scope.amount != undefined && $('#myPwd').val() != '') {
                            /* if ($scope.cpCoupon.enableAmount > $scope.amount) {
                                 $filter('投资错误信息')('1012', $scope, 'y');
                                 return;
                             }*/
                        if($scope.cp.info.type != 1){
                            $scope.sendRequest();
                        } else if($scope.cp.info.type == 1) {
                            if($scope.amount >= 5000 || $scope.cop.length<=0){
                                $scope.sendRequest();
                            } else if($scope.cop.length>0) {
                                $('.useRedBag').css('display','block');
                                }
                            }
                        } else {
                            if ($scope.amount == '' || $scope.amount == undefined) {
                                $filter('投资错误信息')('noInp', $scope, 'y');
                            } else if ($('#myPwd').val() == '') {
                                $filter('投资错误信息')('noPwd', $scope, 'y');
                            }
                        };
                    };
                    resourceService.queryPost($scope, $filter('getUrl')('cpDetail'), {
                        'uid': user.member.uid,
                        'pid': $scope.cp.info.id
                    }, '账户余额');
                    resourceService.queryPost($scope, $filter('getUrl')('首次评测显示'), {'uid': user.member.uid}, '首次评测显示');
                    $scope.$on('resourceService.QUERY_POST_MYEVENT', function (event, data, eObj) {
                        switch (eObj) {
                            case '用户状态':
                                if (data.success) {
                                    $scope.userTypes = data.map;
                                    $scope.realVerity = data.map.realVerify;
                                } else {
                                    $filter('服务器信息')(data.errorCode, $scope, 'y')
                                }
                                break;

                            case '首次评测显示':
                                if(data.success){
                                    $scope.riskContent = data.map;
                                }
                                break;
                            case '购买产品':
                                if (data.success) {
                                    if ($scope.cp.info.productUseType == 3){
                                        $scope.successData = $scope.cp;
                                        $scope.successData.enFuConvertCode = data.map.enFuConvertCode;
                                        $scope.successData.pid = data.map.pid;
                                        $scope.successData.shouyi = data.map.shouyi;
                                        $scope.successData.rate = $scope.cp.info.rate;
                                        $scope.successData.fullName = $scope.cp.info.fullName;
                                        $scope.successData.deadline = $scope.cp.info.deadline;
                                        $localStorage.successEnfu = $scope.successData;
                                        $localStorage.user.enFuProductId = $scope.cp.info.id;
                                        $state.go('enfuInvestSuc',{});
                                    } else {
                                        $scope.successData = $scope.cp;
                                        $scope.successData.shouyi = data.map.shouyi;
                                        $scope.successData.investAmount = $scope.amount;
                                        // if ($scope.cp.isAuth == true) {
                                        $scope.successData.investTime = data.map.investTime;
                                        $scope.successData.isRepeats = data.map.isRepeats;
                                        $scope.successData.luckCodeCount = data.map.luckCodeCount;
                                        $scope.successData.luckCodes = data.map.luckCodes;
                                        $scope.successData.activityURL = data.map.activityURL;
                                        $scope.successData.jumpURL = data.map.jumpURL;
                                        $scope.successData.isGivenLotteryOpp = data.map.isGivenLotteryOpp;
                                        $localStorage.successData = $scope.successData;
                                        /*if ($scope.cp.info.type == 2) {
                                            $state.go('newYInvestSuc');
                                        } else {
                                            $state.go('actinvestsuccess',{});
                                        }*/
                                        // 春节活动期间投资成功跳到特定成功页面
                                        $scope.isInNewYearActivityTime = data.map.isInNewYearActivityTime;
                                        if ($scope.isInNewYearActivityTime) {
                                            $state.go('newYInvestSuc');
                                        } else {
                                            $state.go('investSuccess');
                                        }
                                    }
                                } else {
                                    if (data.errorCode == '2001') {
                                        $filter('投资交易密码错误信息')($scope);
                                    } else if (data.errorCode == '1007'){
                                        if($localStorage.latestActiveNotReimbursedRecord){
                                            $scope.rid = $localStorage.latestActiveNotReimbursedRecord.id;
                                        }
                                        $filter('投资错误信息')(data.errorCode, $scope, 'y',data.errorMsg);
                                        setTimeout(function () {
                                            // $state.go('recharge',{wap:'true',rid: $scope.rid});
                                            $state.go('recharge',{wap:'true',rid: $scope.rid,amount: $scope.amount,couponType: $scope.conponType});
                                        }, 2000);
                                    } else {
                                        $filter('投资错误信息')(data.errorCode, $scope, 'y',data.errorMsg);
                                    }
                                }
                                break;
                            case '账户余额':
                                $scope.balance = data.map.balance;
                                $scope.cfcaSwitchFlag = data.map.cfcaSwitchFlag;
                                break;
                            case '我的信息':
                                if(data.success) {
                                    $scope.tpwdFlag = data.map.tpwdFlag;
                                    $scope.pwdFlag = $scope.tpwdFlag == 1 ? true:false;
                                }
                                break;
                            case '设置交易密码':
                                if (data.success) {
                                    $scope.sendRequest();
                                } else {
                                    if(data.errorMsg) {
                                        ngDialog.open({
                                            template: '<p class="error-msg">' + data.errorMsg + '</p>',
                                            showClose: false,
                                            closeByDocument: true,
                                            plain: true
                                        });
                                        setTimeout(function () {
                                            ngDialog.closeAll();
                                        }, 1500);
                                    } else {
                                        $filter('重置交易密码错误信息')(data.errorCode,$scope)
                                    }
                                }
                                break;
                        };
                    });
                }
            ]).controller('actinvestsuccessController'
            ,['$scope'
                ,'$filter'
                ,'$state'
                ,'$interval'
                ,'$rootScope'
                ,'resourceService'
                ,'ngDialog'
                ,'$stateParams'
                ,'$localStorage'
                ,function($scope,$filter,$state,$interval,$rootScope,resourceService,ngDialog,$stateParams,$localStorage){
                    $rootScope.title="投资结果";
                    $scope.cp = $localStorage.cp.info;
                    $scope.data=$localStorage.successData;
                }
            ]);
    })