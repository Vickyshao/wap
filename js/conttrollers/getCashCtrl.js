define([
    'js/module.js'
    ]
    ,function(controllers){
    controllers.controller('getcashCtrl'
        ,['$scope'
        ,'$filter'
        ,'$state'
        ,'$rootScope'
        ,'resourceService'
        ,'ngDialog'
        ,'postcallService'
        ,'$localStorage'
        ,function($scope,$filter,$state,$rootScope,resourceService,ngDialog,postcallService,$localStorage){
            $rootScope.title="提现";
            $scope.userOBJ=$filter('isRegister')();
            if ($scope.userOBJ.register != true) {
                $state.go('dl', { returnurl: 'getCash' });
                return;
            }
            $filter('isPath')('getCash');
            $scope.isSubmit = false;
            $scope.active = 0;
            $scope.cash = {};
            $scope.isTiXian = true;
            $scope.user = $filter('isRegister')().user;
            if ($filter('isRegister')().register){
                $scope.pwdFlag = $scope.user.member.tpwdSetting == 1 ? true:false;
            }
            resourceService.queryPost($scope, $filter('getUrl')('提现'), {
                uid:$scope.userOBJ.user.member.uid
            }, '提现');
            resourceService.queryPost($scope, $filter('getUrl')('我的信息'), {
                uid:$scope.userOBJ.user.member.uid
            }, '我的信息');
            $scope.changeMode = function(i) {
                if($scope.active == i){
                    return;
                }
                else if(i==1 && $scope.cash.isFuiou==0){
                    $state.go('setDepository',{wap:true});
                    return;
                }
                $scope.isSubmit = false;
                $scope.active = i;
                $scope.cash.amount = '';
                $scope.cash.tradepwd = '';
                if($scope.getAllFlag==true){
                    $scope.setAll();
                }
                if($scope.active==0){
                    $scope.cash.funds = $scope.funds;
                }
                else if($scope.active==1){
                    $scope.cash.funds = $scope.fuiou_balance;
                }
            }
            $scope.amount = '';
            $scope.areaCity = '';
            $scope.branchName = '';
            $scope.isShowError = false;
            $localStorage.userTypes = {};

            // 提交表单
            $scope.submitForm = function(valid) {
            		if (!$scope.user.realVerify) {
					$state.go('certification');
		        } else {
			        	if (!valid || $scope.isSubmit) {
	                    return;
	                }
	                if($scope.cashForm.cash.$error.required){
	                    $filter('提现错误信息')('required',$scope);
	                }
	                else if($scope.amount<1 && $scope.cash.isChargeFlag==0){
	                    $filter('提现错误信息')('morethan',$scope);
	                }
	                else if($scope.amount<$scope.showAmount && $scope.cash.isChargeFlag!=0){
			        	    if ($scope.showAmount == 1) {
                                $filter('提现错误信息')('morethan2',$scope);
                            } else {
                                $filter('提现错误信息')('morethan3',$scope);
                            }
	                }
	                else if($scope.cash.amount>$scope.cash.funds && $scope.cash.funds<=500000){
	                    $filter('提现错误信息')('withdrawlimit',$scope);
	                }
	                else if($scope.cash.amount>500000){
	                    $filter('提现错误信息')('maxlimit',$scope);
	                }
	                else{
	                    if($scope.active==0){
	                        console.log($scope.city);
	                        $scope.isSubmit = true;
	                        resourceService.queryPost($scope, $filter('getUrl')('提现申请'),{
	                            amount: $scope.cash.amount,
	                            tpw: $scope.cash.tradepwd,
	                            isChargeFlag: $scope.cash.isChargeFlag,
                                serviceaCharge: $scope.cash.cost,
	                            uid:$scope.userOBJ.user.member.uid
	                        },'提现申请');
	                    }
	                    else if($scope.active==1){
	                        resourceService.queryPost($scope, $filter('getUrl')('存管提现'),{
	                            amount: $scope.cash.amount,
	                            uid: $scope.userOBJ.user.member.uid,
	                            isChargeFlag: $scope.cash.isChargeFlag,
	                        },'存管提现');
	                    }
	                }
		        }
		        
                
            };
            $scope.toRetPwd = function () {
                    $scope.closeDialog();
                    $state.go('resetTradePwd',{firstset:false});
                };
            $scope.showValue = function(cashCity) {
                $scope.areaCity = cashCity;
            };
            $scope.showBank = function(branchName) {
                $scope.branchName = branchName;
            };
            $scope.toZhiFu = function () {

                if ($scope.amount > $scope.cash.funds) {
                    $scope.isShowError = true;
                    $scope.isShowErrorText = '提现金额超过可用余额';
                    $filter('提现错误信息')('morethanyue',$scope);
                } else {
                    $filter('设置交易密码弹窗')($scope);
                }
            };
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
                                uid: $scope.userOBJ.user.member.uid
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
            $scope.sendRequest = function () {
                /*$scope.params = {
                    'pid': $localStorage.cp.info.id,
                    'tpwd': $localStorage.userTypes.passWord,
                    'amount': $scope.amount,
                    'uid': $filter('isRegister')().user.member.uid,
                    'activityType': 0
                }*/

                if($scope.active==0){
                    console.log($scope.city);
                    $scope.isSubmit = true;
                    resourceService.queryPost($scope, $filter('getUrl')('提现申请'),{
                        amount: $scope.amount,
                        tpw: $scope.pwd,
                        isChargeFlag: $scope.cash.isChargeFlag,
                        serviceaCharge: $scope.cash.cost,
                        uid:$scope.userOBJ.user.member.uid,
                        areaCity: $scope.areaCity,
                        branchName: $scope.branchName
                    },'提现申请');
                }
                else if($scope.active==1){
                    resourceService.queryPost($scope, $filter('getUrl')('存管提现'),{
                        amount: $scope.amount,
                        uid: $scope.userOBJ.user.member.uid,
                        isChargeFlag: $scope.cash.isChargeFlag,
                    },'存管提现');
                }
            }

            $scope.$on('resourceService.QUERY_POST_MYEVENT', function(event,data,type) {
                switch(type){
                    case '我的信息': 
                        if(data.success){
                            $scope.user = data.map;
                            $scope.tpwdFlag = data.map.tpwdFlag;
                            $scope.pwdFlag = $scope.tpwdFlag == 1 ? true:false;
                        }else{
                            $filter('服务器信息')(data.errorCode,$scope,'y');
                        }
                    break;
                    case '提现': 
                        if(data.success){
                            $scope.funds = data.map.funds;
                            $scope.fuiou_balance = data.map.fuiou_balance;
                            $scope.cash = data.map;
                            $scope.showAmount = data.map.showAmount;
                            $scope.isNeedBankBranch = data.map.isNeedBankBranch;
                            $scope.isNeedArea = data.map.isNeedArea;
                            if (data.map.isChargeFlag) {
                                $scope.cash.cost = $scope.cash.amount;
                            } else {
                                $scope.cash.cost = 0;
                            }
                            $scope.leastCashAmount = $scope.cash.cost + 1;
                        }else{
                            $filter('服务器信息')(data.errorCode,$scope,'y')
                        }
                    break;
                    case '提现申请': 
                        if(data.success){
                            ngDialog.open({
                                template: '<p class="success-msg">您已成功提现'+ $filter('currency')(data.map.amount,'') +'元</p>',
                                showClose: false,
                                closeByDocument: false,
                                plain: true
                            });
                            setTimeout(function() {
                                ngDialog.closeAll();
                                $state.go('main.myaccountHome');
                            }, 2000);
                        }else{
                            if (data.errorCode == '2001') {
                                $filter('投资交易密码错误信息')($scope);
                            }
                            else if(data.errorCode=='1006') {
                               /* ngDialog.open({
                                    template: '<p class="error-msg">处理中</p>',
                                    showClose: false,
                                    closeByDocument: false,
                                    plain: true
                                });
                                setTimeout(function() {
                                        ngDialog.closeAll();
                                        $state.go('main.myaccountHome');
                                }, 2000);*/
                                $localStorage.cashProcessingSuccInfo = data.map;
                                $localStorage.cashProcessingSuccInfo.amount = $scope.amount;
                                $state.go('cashProcessing');
                                ngDialog.closeAll();
                            }
                            else {
                                if (data.errorMsg){
                                    $scope.errorText = data.errorMsg;
                                } else {
                                    $scope.errorText = $filter('返回提现错误信息')(data.errorCode);
                                }
                                ngDialog.closeAll();
                                $localStorage.failInfo = {
                                    errorName: '提现失败',
                                    errorCode: data.errorCode,
                                    errorText: $scope.errorText
                                };
                                $state.go('rechargeFail');
                            }
                            $scope.isSubmit = false;
                        }
                    break;
                    case '存管提现': 
                        if(data.success){
                            postcallService(data.map.fuiouUrl,data.map.signature);
                        }else{
                            $filter('提现申请错误信息')(data.errorCode,$scope,'y');
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

            $scope.getAllFlag = false;
            var $circlebtn = $('.circlebtn'),
                $circlei = $('i',$circlebtn),
                circleLeft = $circlebtn.width() - $circlei.width();
            $scope.setAll = function() {
                if ($scope.getAllFlag == false) {
                    if($scope.active==0){
                        // $scope.cash.amount = $scope.cash.funds;
                        $scope.cash.amount = $filter('isNumber2')($scope.cash.funds,undefined,1);
                    }
                    else if($scope.active==1){
                        // $scope.cash.amount = $scope.cash.fuiou_balance;
                        $scope.cash.amount = $filter('isNumber2')($scope.cash.fuiou_balance,undefined,1);
                    }
                    $circlei.animate({left:circleLeft},200,function() {
                        $scope.getAllFlag = true;
                        $circlei.css({left: 'auto',right: '-1px'});
                        $circlei.css({'border-color': '#048eed'});
                        $circlebtn.css({'background':'#048eed','border-color': '#048eed'});
                    });
                } else if ($scope.getAllFlag == true) {
                    $scope.cash.amount = '';
                    $circlebtn.css({'background':'#d2d2d2','border-color': '#d2d2d2'});
                    $circlei.css({'border-color': '#d2d2d2','left':circleLeft,'right': 'auto'});
                    $circlei.animate({left:'-1px'},200,function() {
                        $scope.getAllFlag = false;
                        $circlei.css({left: '-1px',right: 'auto'});
                    });
                }
            };

            // onblur将金额保留两位小数
            $scope.setAmount = function(event) { 
                /*if ($scope.cashForm.cash.$error.pattern) {
                    $filter('提现错误信息')('pattern',$scope);
                } else if ($scope.cashForm.cash.$error.morethan3) {
                    $filter('提现错误信息')('morethan3',$scope);
                } else if ($scope.cashForm.cash.$error.morethan) {
                    $filter('提现错误信息')('morethan',$scope);
                } else if ($scope.cashForm.cash.$error.withdrawlimit) {
                    $filter('提现错误信息')('withdrawlimit',$scope);
                } else if ($scope.cashForm.cash.$error.maxlimit) {
                    $filter('提现错误信息')('maxlimit',$scope);
                } else if ($scope.cashForm.cash.$error.required) {
                    $filter('提现错误信息')('required',$scope);
                }*/
                if ($scope.amount < $scope.leastCashAmount) {
                    $scope.isShowError = true;
                    $scope.isShowErrorText = '提现金额至少为' + $scope.leastCashAmount + '元';
                } else if ($scope.amount > $scope.cash.funds) {
                    $scope.isShowError = true;
                    $scope.isShowErrorText = '提现金额超过可用余额';
                } else {
                    $scope.isShowError = false;
                }
                /*if($scope.getAllFlag==true && $scope.cash.amount<$scope.cash.funds){
                    $circlebtn.css({'background':'#d2d2d2','border-color': '#d2d2d2'});
                    $circlei.css({'border-color': '#d2d2d2','left':circleLeft,'right': 'auto'});
                    $circlei.animate({left:'-1px'},200,function() {
                        $scope.getAllFlag = false;
                        $circlei.css({left: '-1px',right: 'auto'});
                    });
                }
                $scope.cash.amount=$filter('isNumber2')($scope.cash.amount,undefined,1);*/
            };
            $scope.toback=function () {
                $filter('跳回上一页')(2);
            };
            $scope.onClick = function(){
                ngDialog.closeAll();
            };
         }
    ]);
    controllers.controller('cashProcessingSucc'
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
                $scope.rechargeInfo = $localStorage.cashProcessingSuccInfo;
                delete $localStorage.cashProcessingSuccInfo;

            }
        ]);
})