/* 
* @Author: xyc
* @Date:   2016-01-18 23:29:04
*/

'use strict';
define([
    'js/module.js'
    ,'jquery'
    ,'ngdialog'
    ]
    ,function(controllers,$,ngdialog){
    controllers.controller('authRechargeCtrl'
        ,['$scope'
        ,'resourceService'
        ,'$filter'
		,'$http'
        ,'$state'
        ,'$rootScope'
        ,'$localStorage'
        ,'ngDialog'
        ,'$stateParams'
        ,function($scope,resourceService,$filter,$http,$state,$rootScope,$localStorage,ngDialog,$stateParams){
            $('body').scrollTop(0);
            $scope.submitBool=true;
            $filter('isPath')('authRecharge');
            $rootScope.title="实名绑卡";
            $scope.nowTimer="获取验证码";
            var user = $filter('isRegister')().user;
            if(!user) {
                $state.go('dl');
            }
            $scope.smrFrom ={};
            if(user || $localStorage.user) {
                $scope.smrFrom.phone = user.member.mobilephone || $localStorage.user.member.mobilephone;
            }
            $scope.isSubMin=true;
            if($localStorage.cp) {
                $scope.cp = $localStorage.cp.info;
            }
            $scope.ValidateValue = function(textbox) {
                    var IllegalString = "[`~!@#$^&*()=|{}':;',\\[\\]<>/?~！#￥……&*（）——|{}【】‘；：”“'。，、？]‘’";
                    var textboxvalue = textbox.target.value;
                    var index = textboxvalue.length - 1;
                    var s =  textbox.target.value.charAt(index);

                    if (IllegalString.indexOf(s) >= 0) {
                        s = textboxvalue.substring(0, index);
                        textbox.target.value = s;
                    }

            };
                // 弹窗
            $scope.choeseBank = function () {
                $filter('银行列表弹窗')($scope);
            };
            $scope.chooeseItem = function (event,obj) {
                $scope.bankName = obj.item.bankName;
                $scope.bankCode = obj.item.bankCode;
                $(event.currentTarget).siblings().removeClass('selected');
                $(event.currentTarget).addClass('selected');
            };
            $scope.done = function () {
                $scope.smrFrom.bankName = $scope.bankName;
                $scope.smrFrom.bankcode = $scope.bankCode;
                $scope.closeDialog();
            }

            // 发送验证码校验
            $scope.sendMsg = function (myForm) {

                if (myForm.bankName.$invalid) {
                    $filter('sendMsgError')('1001');
                } else if (myForm.bankCade.$error.required) {
                    $filter('sendMsgError')('1002');
                } else if (myForm.bankCade.$invalid) {
                    $filter('sendMsgError')('1003');
                } else if (myForm.name.$error.required) {
                    $filter('sendMsgError')('1004');
                } else if (myForm.idCade.$error.required) {
                    $filter('sendMsgError')('1005');
                } else if (myForm.idCade.$invalid) {
                    $filter('sendMsgError')('1006');
                } else if (myForm.phone.$error.required) {
                    $filter('sendMsgError')('1007');
                } else if (myForm.phone.$invalid) {
                    $filter('sendMsgError')('1008');
                } else {
                    $scope.toSub('信息认证');
                }
            }
                $scope.smrFrom ={};
                if(user || $localStorage.user) {
                    $scope.smrFrom.phone = user.member.mobilephone || $localStorage.user.member.mobilephone;
                }
                $scope.isSubMin=true;
                if($localStorage.cp) {
                    $scope.cp = $localStorage.cp.info;
                }
                // 弹窗
                $scope.choeseBank = function () {
                    $filter('银行列表弹窗')($scope);
                };
                $scope.chooeseItem = function (event,obj) {
                    $scope.bankName = obj.item.bankName;
                    $scope.bankCode = obj.item.bankCode;
                    $(event.currentTarget).siblings().removeClass('selected');
                    $(event.currentTarget).addClass('selected');
                };
                $scope.done = function () {
                    $scope.smrFrom.bankName = $scope.bankName;
                    $scope.smrFrom.bankcode = $scope.bankCode;
                    $scope.closeDialog();
                }

                // 发送验证码校验
                $scope.sendMsg = function (myForm) {

                    if(myForm.bankName.$invalid) {
                        $filter('sendMsgError')('1001');
                    } else if(myForm.bankCade.$error.required) {
                        $filter('sendMsgError')('1002');
                    } else if(myForm.bankCade.$invalid) {
                        $filter('sendMsgError')('1003');
                    } else if(myForm.name.$error.required) {
                        $filter('sendMsgError')('1004');
                    } else if(myForm.idCade.$error.required) {
                        $filter('sendMsgError')('1005');
                    }  else if(myForm.idCade.$invalid) {
                        $filter('sendMsgError')('1006');
                    } else if(myForm.phone.$error.required) {
                        $filter('sendMsgError')('1007');
                    } else if(myForm.phone.$invalid) {
                        $filter('sendMsgError')('1008');
                    } else {
                        $scope.toSub('信息认证');
                    }
                };
                resourceService.queryPost($scope, $filter('getUrl')('银行限额列表'), $scope.smrFrom, '银行限额列表');
                $scope.$on('resourceService.QUERY_POST_MYEVENT', function(event,data,type) {
                    switch(type){
                        case '信息认证':
                            if(data.success){
                                    $rootScope.errorText= '验证码发送成功';
                                    $filter('实名短信错误信息')('ok',$scope,'y');
                                    $filter('60秒倒计时')($scope,60);
                                    setTimeout(function() {
                                        ngDialog.closeAll();
                                    }, 1000);
                            }else{
                                $filter('实名短信错误信息')(data.errorCode,$scope,'y');
                            }
                        break;
                        case '银行限额列表':
                            if(data.success){
                                $scope.bankList = data.map.bankQuotaList;
                            }
                        break;
                        case '实名认证':
                            if(data.success){
                                $filter('isRegister')(data.map);
                                // $state.go('main.myaccountHome');
                                _hmt.push(['_trackPageview', 'hushenlc.cn/maidian/smrz']);
                                // if(data.tyj){
                                ngDialog.open({
                                    template: '<p class="error-msg">认证成功！</p>',
                                    showClose: false,
                                    closeByDocument: true,
                                    plain: true
                                });
                                setTimeout(function() {
                                    ngDialog.closeAll();
                                    /*$filter('跳回上一页')(2);*/
                                    $state.go("dl")
                                }, 2000);
                            }else{
                                $filter('实名认证错误信息')(data.errorCode,$scope,'y');
                            }
                        break;
                    };
                });
                $scope.toWhere = function(state){
                    $('body,html').css({ width:'auto', height: 'auto', overflow: 'initial' });
                    $state.go(state);
                }
                $scope.close = function(){
                    $scope.tyj = false;
                    $('body,html').css({ width:'auto', height: 'auto', overflow: 'initial' });
                    if($stateParams.from=='changcheng2'){
                        $state.go('recharge',{from:'changcheng2',wap:true});
                    }
                    else{
                        $state.go('main.myaccountHome');
                    }
                }

                $scope.toback=function () {
                    $filter('跳回上一页')(2);
                };
                $scope.onClick=function () {
                    ngDialog.closeAll();
                };

                $scope.toSub=function (name) {
                    switch(name){
                        case '信息认证':
                            if($scope.isSubMin){
                                resourceService.queryPost($scope, $filter('getUrl')(name), {
                                    uid:user.member.uid,
                                    mobilePhone:$scope.smrFrom.phone,
                                    bankNum:$filter('limitTo')($scope.smrFrom.bankNum1,-4),
                                    type:1,
                                    token:user.token
                                }, name);
                            };
                        break;
                        case '实名认证':
                            $scope.smrFrom.uid=user.member.uid;
                            $scope.smrFrom.channel=3;
                            $scope.smrFrom.token= user.token;
                            $scope.smrFrom.bankNum = $scope.smrFrom.bankNum1;
                            $scope.smrFrom.bankCode = $scope.smrFrom.bankcode;
                            if($scope.submitBool){
                                resourceService.queryPost($scope, $filter('getUrl')(name), $scope.smrFrom, name);
                            };
                        break;
                    };
                }
            }
        ])
        .controller('authenticationCtrl'
            ,['$scope'
                ,'resourceService'
                ,'$filter'
                ,'$http'
                ,'$state'
                ,'$rootScope'
                ,'$localStorage'
                ,'ngDialog'
                ,'$stateParams'
                ,function($scope,resourceService,$filter,$http,$state,$rootScope,$localStorage,ngDialog,$stateParams){
                    $('body').scrollTop(0);
                    $scope.submitBool=true;
                    $filter('isPath')('authRecharge');
                    $rootScope.title="信息认证";
                    $scope.nowTimer="获取验证码";
                    var user = $filter('isRegister')().user;
                    if(!user) {
                        $state.go('dl');
                    }
                    $scope.smrFrom ={};
                    if(user || $localStorage.user) {
                        $scope.smrFrom.phone = user.member.mobilephone || $localStorage.user.member.mobilephone;
                    }
                    $scope.isSubMin=true;
                    if($localStorage.cp) {
                        $scope.cp = $localStorage.cp.info;
                    }
                    // 弹窗
                    $scope.choeseBank = function () {
                        $filter('银行列表弹窗')($scope);
                    };
                    $scope.chooeseItem = function (event,obj) {
                        $scope.smrFrom.bankName = $scope.bankName = obj.item.bankName;
                        $scope.smrFrom.bankcode = $scope.bankCode = obj.item.bankCode;
                        $scope.smrFrom.bankid = $scope.id = obj.item.id;
                        $(event.currentTarget).siblings().removeClass('selected');
                        $(event.currentTarget).addClass('selected');
                        $scope.closeDialog();
                        $scope.bankList.forEach(function (item) {
                            if (item.bankCode == obj.item.bankCode) {
                                item.checked = 'checked';
                            } else {
                                item.checked = undefined;
                            }
                        })
                    };
                    $scope.done = function () {
                        /*$scope.smrFrom.bankName = $scope.bankName;
                        $scope.smrFrom.bankcode = $scope.bankCode;*/
                        $scope.closeDialog();
                    }

                    // 发送验证码校验
                    $scope.sendMsg = function (myForm) {

                        if(myForm.bankName.$invalid) {
                            $filter('sendMsgError')('1001');
                        } else if(myForm.bankCade.$error.required) {
                            $filter('sendMsgError')('1002');
                        } else if(myForm.bankCade.$invalid) {
                            $filter('sendMsgError')('1003');
                        } else if(myForm.name.$error.required) {
                            $filter('sendMsgError')('1004');
                        } else if(myForm.idCade.$error.required) {
                            $filter('sendMsgError')('1005');
                        }  else if(myForm.idCade.$invalid) {
                            $filter('sendMsgError')('1006');
                        } else if(myForm.phone.$error.required) {
                            $filter('sendMsgError')('1007');
                        } else if(myForm.phone.$invalid) {
                            $filter('sendMsgError')('1008');
                        } else {
                            $scope.toSub('信息认证');
                        }
                    };
                    resourceService.queryPost($scope, $filter('getUrl')('银行限额列表'), $scope.smrFrom, '银行限额列表');
                    $scope.$on('resourceService.QUERY_POST_MYEVENT', function(event,data,type) {
                        switch(type){
                            case '信息认证':
                                if(data.success){
                                    $rootScope.errorText= '验证码发送成功';
                                    $filter('实名短信错误信息')('ok',$scope,'y');
                                    $filter('60秒倒计时')($scope,60);
                                    setTimeout(function() {
                                        ngDialog.closeAll();
                                    }, 1000);
                                }else{
                                    $filter('实名短信错误信息')(data.errorCode,$scope,'y');
                                }
                                break;
                            case '银行限额列表':
                                if(data.success){
                                    $scope.bankList = data.map.bankQuotaList;
                                }
                                break;
                            case '实名认证':
                                if(data.success){
                                    $filter('isRegister')(data.map);
                                    // $state.go('main.myaccountHome');
                                    _hmt.push(['_trackPageview', 'hushenlc.cn/maidian/smrz']);
                                    // if(data.tyj){
                                    ngDialog.open({
                                        template: '<p class="error-msg">认证成功！</p>',
                                        showClose: false,
                                        closeByDocument: true,
                                        plain: true
                                    });
                                    setTimeout(function() {
                                        ngDialog.closeAll();
                                        if ($state.params.returnurl) {
                                            $state.go($state.params.returnurl);
                                        } else {
                                            $filter('跳回上一页')(2);
                                        }
                                    }, 2000);
                                }else{
                                    $filter('实名认证错误信息')(data.errorCode,$scope,'y');
                                }
                                break;
                        };
                    });
                    $scope.toWhere = function(state){
                        $('body,html').css({ width:'auto', height: 'auto', overflow: 'initial' });
                        $state.go(state);
                    }
                    $scope.close = function(){
                        $scope.tyj = false;
                        $('body,html').css({ width:'auto', height: 'auto', overflow: 'initial' });
                        if($stateParams.from=='changcheng2'){
                            $state.go('recharge',{from:'changcheng2',wap:true});
                        }
                        else{
                            $state.go('main.myaccountHome');
                        }
                    }

                    $scope.toback=function () {
                        $filter('跳回上一页')(2);
                    };
                    $scope.onClick=function () {
                        ngDialog.closeAll();
                    };

                    $scope.toSub=function (name) {
                        switch(name){
                            case '信息认证':
                                if($scope.isSubMin){
                                    resourceService.queryPost($scope, $filter('getUrl')(name), {
                                        uid:user.member.uid,
                                        mobilePhone:$scope.smrFrom.phone,
                                        bankNum:$filter('limitTo')($scope.smrFrom.bankNum1,-4),
                                        type:1,
                                        token:user.token
                                    }, name);
                                };
                                break;
                            case '实名认证':
                                $scope.smrFrom.uid=user.member.uid;
                                $scope.smrFrom.channel=3;
                                $scope.smrFrom.token= user.token;
                                $scope.smrFrom.bankNum = $scope.smrFrom.bankNum1;
                                $scope.smrFrom.bankCode = $scope.smrFrom.bankcode;
                                if($scope.submitBool){
                                    resourceService.queryPost($scope, $filter('getUrl')(name), $scope.smrFrom, name);
                                };
                                break;
                        };
                    }
                }
            ])
        .controller('investAuthenticationCtrl'
            ,['$scope'
                ,'resourceService'
                ,'$filter'
                ,'$http'
                ,'$state'
                ,'$rootScope'
                ,'$localStorage'
                ,'ngDialog'
                ,'$stateParams'
                ,function($scope,resourceService,$filter,$http,$state,$rootScope,$localStorage,ngDialog,$stateParams){
                    $('body').scrollTop(0);
                    $scope.submitBool=true;
                    $filter('isPath')('investAuthentication');
                    $rootScope.title="认证充值";
                    $scope.nowTimer="获取验证码";
                    $scope.expect = $stateParams.expect ? $stateParams.expect : 0;
                    var user = $filter('isRegister')().user;
                    if(!user) {
                        $state.go('dl');
                    }
                    if ($localStorage.cpCoupon) {
                        $scope.cpCoupon = $localStorage.cpCoupon;
                    }
                    $scope.smrFrom ={};
                    $scope.amount = parseInt($stateParams.amount);
                    if(user || $localStorage.user) {
                        $scope.smrFrom.phone = user.member.mobilephone || $localStorage.user.member.mobilephone;
                    }
                    $scope.isSubMin=true;
                    $scope.countYhq = function (cpCoupon) {
                        if (cpCoupon.type == 1) {                               //返现券
                            $scope.shouyiYhq = cpCoupon.amount;
                        } else if (cpCoupon.type == 2) {                        //加息券
                            $scope.shouyiYhq = $filter('wisNumber2')(cpCoupon.raisedRates/100 / 360 * $scope.amount * $scope.cp.deadline);
                        } else if (cpCoupon.type == 4) {                        //翻倍券
                            $scope.shouyiYhq = $filter('wisNumber2')($scope.amount * $scope.cp.rate*(cpCoupon.multiple-1)/100 / 360 * $scope.cp.deadline);
                        }
                    }
                    $scope.kefu = function () {
                        $filter('dial2')($scope);
                    }
                    $scope.toYJFK = function () {
                        ngDialog.closeAll();
                        $state.go("YJFK",{amount: $scope.amount,expect:$scope.expect});
                    }
                    $scope.tophone = function () {
                        ngDialog.closeAll();
                        $filter('dial')($scope);
                    }
                    if($localStorage.cp) {
                        $scope.cp = $localStorage.cp.info;
                        $scope.shouyiJc = $filter('wisNumber2')($scope.amount * $scope.cp.rate / 100 / 360 * $scope.cp.deadline);
                        $scope.shoujiHd = $filter('wisNumber2')($scope.amount*$scope.cp.activityRate/100 /360 * $scope.cp.deadline);
                        $scope.shouyiTs = $filter('wisNumber2')($scope.amount * $scope.cp.specialRate / 100 / 360 * $scope.cp.deadline);
                        if ($scope.cpCoupon) {
                            $scope.countYhq($scope.cpCoupon);
                        } else {
                            $scope.shouyiYhq = 0;
                        }
                        $scope.expect = $filter('wisNumber2')($scope.shouyiJc + $scope.shoujiHd + $scope.shouyiTs);
                    }
                    // 弹窗
                    $scope.choeseBank = function () {
                        $filter('银行列表弹窗')($scope);
                    };
                    $scope.chooeseItem = function (event,obj) {
                        $scope.smrFrom.bankName = $scope.bankName = obj.item.bankName;
                        $scope.smrFrom.bankcode = $scope.bankCode = obj.item.bankCode;
                        $scope.smrFrom.bankid = $scope.id = obj.item.id;
                        $(event.currentTarget).siblings().removeClass('selected');
                        $(event.currentTarget).addClass('selected');
                        $scope.closeDialog();
                        $scope.bankList.forEach(function (item) {
                            if (item.bankCode == obj.item.bankCode) {
                                item.checked = 'checked';
                            } else {
                                item.checked = undefined;
                            }
                        })
                    };
                    $scope.done = function () {
                        /*$scope.smrFrom.bankName = $scope.bankName;
                        $scope.smrFrom.bankcode = $scope.bankCode;*/
                        $scope.closeDialog();
                    }

                    // 发送验证码校验
                    $scope.sendMsg = function (myForm) {

                        if(myForm.bankName.$invalid) {
                            $filter('sendMsgError')('1001');
                        } else if(myForm.bankCade.$error.required) {
                            $filter('sendMsgError')('1002');
                        } else if(myForm.bankCade.$invalid) {
                            $filter('sendMsgError')('1003');
                        } else if(myForm.name.$error.required) {
                            $filter('sendMsgError')('1004');
                        } else if(myForm.idCade.$error.required) {
                            $filter('sendMsgError')('1005');
                        }  else if(myForm.idCade.$invalid) {
                            $filter('sendMsgError')('1006');
                        } else if(myForm.phone.$error.required) {
                            $filter('sendMsgError')('1007');
                        } else if(myForm.phone.$invalid) {
                            $filter('sendMsgError')('1008');
                        } else {
                            $scope.toSub('信息认证');
                        }
                    };
                    $scope.toSub=function (name) {
                        switch (name) {
                            case '信息认证':
                                if ($scope.isSubMin) {
                                    resourceService.queryPost($scope, $filter('getUrl')(name), {
                                        uid: user.member.uid,
                                        mobilePhone: $scope.smrFrom.phone,
                                        bankNum: $filter('limitTo')($scope.smrFrom.bankNum1, -4),
                                        type: 1,
                                        token: user.token
                                    }, name);
                                }
                                ;
                                break;
                            case '实名认证':
                                $scope.smrFrom.uid = user.member.uid;
                                $scope.smrFrom.channel = 3;
                                $scope.smrFrom.token = user.token;
                                $scope.smrFrom.bankNum = $scope.smrFrom.bankNum1;
                                $scope.smrFrom.bankCode = $scope.smrFrom.bankcode;
                                if ($scope.submitBool) {
                                    resourceService.queryPost($scope, $filter('getUrl')(name), $scope.smrFrom, name);
                                }
                                break;
                        }
                        ;
                    }
                    resourceService.queryPost($scope, $filter('getUrl')('银行限额列表'), $scope.smrFrom, '银行限额列表');
                    $scope.$on('resourceService.QUERY_POST_MYEVENT', function(event,data,type) {
                        switch(type){
                            case '信息认证':
                                if(data.success){
                                    $rootScope.errorText= '验证码发送成功';
                                    $filter('实名短信错误信息')('ok',$scope,'y');
                                    $filter('60秒倒计时')($scope,60);
                                    setTimeout(function() {
                                        ngDialog.closeAll();
                                    }, 1000);
                                }else{
                                    $filter('实名短信错误信息')(data.errorCode,$scope,'y');
                                }
                                break;
                            case '银行限额列表':
                                if(data.success){
                                    $scope.bankList = data.map.bankQuotaList;
                                }
                                break;
                            case '实名认证':
                                if(data.success){
                                    $filter('isRegister')(data.map);
                                    // $state.go('main.myaccountHome');
                                    _hmt.push(['_trackPageview', 'hushenlc.cn/maidian/smrz']);
                                    // if(data.tyj){
                                    ngDialog.open({
                                        template: '<p class="error-msg">认证成功！</p>',
                                        showClose: false,
                                        closeByDocument: true,
                                        plain: true
                                    });
                                    setTimeout(function() {
                                        ngDialog.closeAll();
                                    }, 2000);
                                    $state.go('recharge',({amount: $scope.amount,firstCharge: true}))
                                }else{
                                    $filter('实名认证错误信息')(data.errorCode,$scope,'y');
                                }
                                break;
                        };
                    });
                    $scope.toWhere = function(state){
                        $('body,html').css({ width:'auto', height: 'auto', overflow: 'initial' });
                        $state.go(state);
                    }
                    $scope.close = function(){
                        $scope.tyj = false;
                        $('body,html').css({ width:'auto', height: 'auto', overflow: 'initial' });
                        if($stateParams.from=='changcheng2'){
                            $state.go('recharge',{from:'changcheng2',wap:true});
                        }
                        else{
                            $state.go('main.myaccountHome');
                        }
                    }

                    $scope.toback=function () {
                        $filter('跳回上一页')(2);
                    };
                    $scope.onClick=function () {
                        ngDialog.closeAll();
                    };

                    $scope.toSub=function (name) {
                        switch(name){
                            case '信息认证':
                                if($scope.isSubMin){
                                    resourceService.queryPost($scope, $filter('getUrl')(name), {
                                        uid:user.member.uid,
                                        mobilePhone:$scope.smrFrom.phone,
                                        bankNum:$filter('limitTo')($scope.smrFrom.bankNum1,-4),
                                        type:1,
                                        token:user.token
                                    }, name);
                                };
                                break;
                            case '实名认证':
                                $scope.smrFrom.uid=user.member.uid;
                                $scope.smrFrom.channel=3;
                                $scope.smrFrom.token= user.token;
                                $scope.smrFrom.bankNum = $scope.smrFrom.bankNum1;
                                $scope.smrFrom.bankCode = $scope.smrFrom.bankcode;
                                if($scope.submitBool){
                                    resourceService.queryPost($scope, $filter('getUrl')(name), $scope.smrFrom, name);
                                };
                                break;
                        };
                    }
                }
            ])
        .controller('renzhengFailCtrl'
            ,['$scope'
                ,'resourceService'
                ,'$filter'
                ,'$http'
                ,'$state'
                ,'$rootScope'
                ,'$localStorage'
                ,'ngDialog'
                ,'$stateParams'
                ,function($scope,resourceService,$filter,$http,$state,$rootScope,$localStorage,ngDialog,$stateParams){
                    $('body').scrollTop(0);
                    // $scope.submitBool=true;
                    // $filter('isPath')('authRecharge');
                    // $rootScope.title="认证充值";
                    // $scope.nowTimer="获取验证码";
                    var user = $filter('isRegister')().user;
                    if(!user) {
                        $state.go('dl');
                    }
                    $scope.toback=function () {
                        $filter('跳回上一页')();
                    };
                    $scope.failInfo = $localStorage.failInfo;
                    delete $localStorage.failInfo;
                }
            ])
        .controller('authHelpCtrl'
            ,['$scope'
                ,'resourceService'
                ,'$filter'
                ,'$http'
                ,'$state'
                ,'$rootScope'
                ,'$localStorage'
                ,'ngDialog'
                ,'$stateParams'
                ,function($scope,resourceService,$filter,$http,$state,$rootScope,$localStorage,ngDialog,$stateParams){
                    $('body').scrollTop(0);
                    var user = $filter('isRegister')().user;
                    if($rootScope.fromNative) {
                        $('.helpDesc').removeClass('headerTop');
                    }
                    if(!user) {
                        $state.go('dl');
                    }
                    $scope.toback=function () {
                        $filter('跳回上一页')();
                    };
                    $scope.tanchuang = function () {
                        $filter('银行列表弹窗')($scope);
                    }
                    $scope.done = function () {
                        $scope.closeDialog();
                    }
                    $scope.call = function () {
                        // 拨打电话
                        if($rootScope.fromNative) {
                            document.location='hushencall:';
                        } else {
                            $filter('dial')($scope);
                        }
                    }
                    resourceService.queryPost($scope, $filter('getUrl')('银行限额列表'), {}, '银行限额列表');
                    $scope.$on('resourceService.QUERY_POST_MYEVENT', function(event,data,type) {
                        switch(type){
                            case '银行限额列表':
                                if(data.success){
                                    $scope.bankList = data.map.bankQuotaList;
                                }
                                break;
                        };
                    });
                }
            ]);
})
