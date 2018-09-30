
/* 
* @Author: lee
* @Date:   2016-05-24 
*/


define([
    'js/module.js'
    ]
    ,function(controllers){
    controllers.controller('rechargeController'
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
            $rootScope.title="充值";
            $filter('isPath')('recharge');
            document.getElementsByTagName('html')[0].scrollTop = 0;
            document.getElementsByTagName('body')[0].scrollTop = 0;
            $scope.userOBJ=$filter('isRegister')();
            $scope.code = {};
            $scope.step1 = true;
            // $scope.code.getCodeText = '获取验证码';
            $scope.recharge = {};
            $rootScope.maskHidde = true;
            ngDialog.closeAll();
            $scope.countdownTime = 6;
            if($stateParams.from=='home' && $localStorage.cp){
                delete $localStorage.cp;
            }
            if($stateParams.firstCharge){
                $scope.firstCharge = true;
            }
            if ($stateParams.amount>=0){
                $scope.ulrAmount = $stateParams.amount;
            }
            $scope.changcheng2 = false;
            if($stateParams.from == 'changcheng2'){
                $scope.changcheng2 = true;
            }
            $scope.$watch($scope.countdownTime, function (newvalue) {
                if (newvalue >= 0) {
                    $scope.countdownTime = newvalue;
                }
            })
            resourceService.queryPost($scope, $filter('getUrl')('充值'), {
                    uid:$scope.userOBJ.user.member.uid,
                    token:$scope.userOBJ.user.token
            }, {name:'充值'});

            $scope.$on('resourceService.QUERY_POST_MYEVENT', function(event,data,type) {
                switch(type.name){
                    case '充值': 
                        if(data.success){
                            $scope.recharge = data.map;
                            $scope.recharge.amount = $stateParams.amount;
                            if(!!data.map.sysArticleList) {
                            		if(data.map.sysArticleList.length>0){
                                $scope.message = data.map.sysArticleList[0].summaryContents;
                                $scope.singleQuota = data.map.singleQuota;
	                            } else {
	                            		$scope.singleQuota = data.map.singleQuota;
	                            }
                            }
                        }else{
                            $filter('服务器信息')(data.errorCode,$scope,'y');
                        }
                    break;
                    case '创建订单': 
                        if(data.success){
                            $scope.recharge.payNum = data.map.payNum;
                            $scope.recharge.bankMobilePhone = data.map.bankMobilePhone;
                            // $filter('充值弹窗')($scope);
                            $rootScope.title = "短信验证";
                            // $scope.getPhoneCode(rechargeForm.amount.$valid, $event, code, false);
                            var type = 1;
                            resourceService.queryPost($scope, $filter('getUrl')('充值验证码'),{
                                type: type,
                                payNum: $scope.recharge.payNum,
                                uid:$scope.userOBJ.user.member.uid
                            },{name:'充值验证码',isvoice:$scope.isvoice,item:$scope.item});
                        }else{
                            $filter('充值错误信息')(data.errorCode);
                        }
                    break;
                    case '充值验证码':
                        if (data.success) {
                            if (type.isvoice) {
                                $scope.isGetVoice = true;
                            } else {
                                $scope.isGetVoice = false;
                            }
                            $("html,body").css({background: '#fff'})

                            // item.times = 59;
                            $scope.step1 = false;
                            type.item.times = 60;
                            type.item.getCodeText = type.item.times + 's';
                            if (!type.isvoice || (type.isvoice && !type.item.isGetCode)) {
                                if (!type.isvoice) {
                                    type.item.isGetCode = true;
                                }
                                type.item.timer = $interval(function(){
                                    if (type.item.times == 0) {
                                        $interval.cancel(type.item.timer);
                                        type.item.getCodeText = '重新获取';
                                        $scope.isGetVoice = false;
                                        type.item.isGetCode = false;
                                        type.item.times = 59;
                                        $('.sendsms').addClass('red');
                                        return;
                                    }
                                    type.item.getCodeText = type.item.times + 's';
                                    type.item.times --;
                                }, 1000);
                            }
                        } else {
                            $("html,body").removeAttr("style");
                            $('.getcode').removeClass('getcode-disabled');
                            $filter('充值验证码error信息')(data.errorCode);
                        }
                    break;
                    case '认证充值':
                        if(data.success){
                            $scope.isRechargeSuc = true;
                            $("html,body").removeAttr("style");
                            $scope.successAmount = data.map.amount;
                            if (data.map.src != undefined) {
                                ngDialog.closeAll();
                                $scope.giftFlag = true;
                            } else {
                                $scope.giftFlag = false;
                                $scope.rechargeInfo = data.map;
                                $localStorage.rechargeInfo = $scope.rechargeInfo;
                                // $filter('充值成功')($scope);

                            }
                        }
                        else{
                            $scope.isRechargeSuc = false;
                            if (data.errorCode == '1004') {
                                // $filter('充值处理中')($scope,'ing');
                                $scope.isRechargeSuc = true;
                                $localStorage.rechargeInfo = data.map;
                                $localStorage.rechargeInfo.errorCode = data.errorCode;
                                $localStorage.rechargeInfo.amount = $scope.recharge.amount;
                            } else {
                                if(data.errorMsg) {
                                    $scope.errorText = data.errorMsg;
                                    $localStorage.failInfo = {
                                        errorName: '充值失败',
                                        errorCode: data.errorCode,
                                        errorText: $scope.errorText
                                    };
                                } else {
                                    $scope.errorText = $filter('返回充值错误信息')(data.errorCode);
                                    $localStorage.failInfo = {
                                        errorName: '充值失败',
                                        errorCode: data.errorCode,
                                        errorText: $scope.errorText
                                    };
                                }
                                $scope.isSubmitDialog = false;
                            }

                        }
                    break;
                };
            });
            $scope.toContinue = function () {
                if ($scope.isRechargeSuc) {
                    if($stateParams.firstCharge){
                        $state.go('rechargesuccess',{ amount: $scope.ulrAmount});
                    } else {
                        $state.go('commonRechargeSuccess');
                    }
                    // $state.go('rechargesuccess',{ funds: $scope.recharge.funds , amount: $scope.ulrAmount});
                    ngDialog.closeAll();
                } else {
                    $state.go('rechargeFail');
                }
            }
            $scope.closeGift = function() {
                $state.go('main.myaccountHome');
                $scope.giftFlag = false;
            }

            // onblur将金额保留两位小数
            $scope.setAmount = function(event) {
                if ($scope.rechargeForm.recharge.$error.pattern) {
                    $filter('充值错误信息')('pattern',$scope);
                } else if ($scope.rechargeForm.recharge.$error.more3) {
                    $filter('充值错误信息')('more3',$scope);
                } else if ($scope.rechargeForm.recharge.$error.rechargelimit) {
                    $filter('充值错误信息')('rechargelimit',$scope);
                } else if ($scope.rechargeForm.recharge.$error.required) {
                    $filter('充值错误信息')('required',$scope);
                }
                $scope.recharge.amount = $filter('isNumber2')($scope.recharge.amount,undefined,1);
            };

            // 提交表单
            $scope.submitForm = function(valid) {
                if (!valid || $scope.isSubmit) {
                    return;
                }
                $scope.isSubmit = true;
                resourceService.queryPost($scope, $filter('getUrl')('创建订单'),{
                    amount: $scope.recharge.amount,
                    uid:$scope.userOBJ.user.member.uid
                },{name:'创建订单'});
            };
            $scope.next = function (tegForm) {
                /*if(!$scope.rechargeForm.recharge.$invalid) {

                }*/
                resourceService.queryPost($scope, $filter('getUrl')('创建订单'),{
                    amount: $scope.recharge.amount,
                    uid:$scope.userOBJ.user.member.uid
                },{name:'创建订单'});
            }

            $scope.submitDialogForm = function(valid) {
                if (!valid || $scope.isSubmitDialog) {
                    return;
                }
                if ($scope.recharge.phonecode.length < 6) {
                    $filter('充值验证码error信息')(1212);
                    return;
                }
                $scope.isSubmitDialog = true;
                resourceService.queryPost($scope, $filter('getUrl')('认证充值'),{
                    payNum: $scope.recharge.payNum,
                    smsCode: $scope.recharge.phonecode,
                    uid:$scope.userOBJ.user.member.uid
                },{name:'认证充值'});
                $filter('充值等待返回结果')($scope);
            };
            $scope.code.times = 59;
            $scope.getPhoneCode = function(entrance, event, item, isvoice) {
                if ($scope.rechargeForm.recharge.$$lastCommittedViewValue < 3) {
                    $filter('提现申请错误信息')(3333);
                    return;
                } else if ($scope.rechargeForm.recharge.$$lastCommittedViewValue > $scope.recharge.singleQuota) {
                    $filter('提现申请错误信息')(3334);
                    return;
                }
                resourceService.queryPost($scope, $filter('getUrl')('创建订单'),{
                    amount: $scope.recharge.amount,
                    uid:$scope.userOBJ.user.member.uid
                },{name:'创建订单'});
                $scope.isvoice = isvoice;
                $scope.item = item;

                if (!$filter('isRegister')().register) {
                    return;
                }
                var $this = $(event.currentTarget);
                /* if ($this.hasClass('getcode-disabled')) {
                     return;
                 }
                 $this.addClass('getcode-disabled');*/
            };
            $scope.toback=function () {
                $("html,body").removeAttr("style");
                if ($scope.step1) {
                    $filter('跳回上一页')(2);
                } else {
                    $scope.step1 = true;
                }
            };
        }
    ]);
    controllers.controller('comRechargeSucc'
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
                // $rootScope.title="充值";
                $scope.userOBJ=$filter('isRegister')();
                $scope.rechargeInfo = $localStorage.rechargeInfo;
                if ($scope.rechargeInfo.errorCode) {
                    $('.common-recharge-suc .left i').html('充值处理中');
                    $('.status-img img').attr('src','/images/recharge/cashProcessing-img1.png')
                }
                delete $localStorage.rechargeInfo;
                $scope.toInvest = function () {
                    if ($localStorage.cp) {
                        if ($localStorage.cp.info.fullName.indexOf("恩弗") != -1) {
                            $state.go('main.enfuinvest')
                        } else if ($localStorage.cp.info.atid) {
                            $state.go('lotteryinvest',{pid: $localStorage.cp.info.id})
                        } else {
                            $state.go("cpInvestDetail",{pid: $localStorage.cp.info.id})
                        }
                    } else {
                        $state.go("main.bankBillList")
                    }
                }

            }
        ]);
    controllers.controller('paymentsCtrl'
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
                $rootScope.title="支付额度表";
                $scope.userOBJ=$filter('isRegister')();
                $filter('isPath')('bulletinInfo');
                if($rootScope.fromNative || $rootScope.getUrlParam('allowDL') == 'true') {
                    $('.common-head').css('display','none');
                    $('.payments').removeClass('headerTop');
                }
                $scope.toback = function() {
                    $filter('跳回上一页')(2);
                };
                $('.news').on("click", "li .up-text", function () {
                    var answer = $(this).next(".down-text").eq(0);
                    var arrow = $(this).children('.right');
                    if (answer.hasClass("hide")) {
                        answer.removeClass("hide");
                        arrow.find('.no-expand').addClass('hide');
                        arrow.find('.expand').removeClass('hide');
                    } else {
                        answer.addClass("hide");
                        arrow.find('.no-expand').removeClass('hide');
                        arrow.find('.expand').addClass('hide');
                    }
                });
                $scope.regulationId = null;
                $scope.ggList = [];

                resourceService.queryPost($scope, $filter('getUrl')('信息披露'), {}, {name: '信息披露'});
                $scope.$on('resourceService.QUERY_POST_MYEVENT', function (event, data, eObj) {
                    switch (eObj.name) {
                        case '信息披露':
                            if (data.success) {
                                angular.forEach(data.map.list1, function(item) {
                                    if (item.proName == '支付额度APP') {
                                        $scope.regulationId = item.proId;
                                        resourceService.queryPost($scope, $filter('getUrl')('栏目信息'), {proId: item.proId},{name: '栏目信息'});
                                    }
                                })
                            }
                            break;

                        case '栏目信息':
                            $scope.ggList = data.map.page.rows;
                            break;
                    };
                });
            }
        ]);
})