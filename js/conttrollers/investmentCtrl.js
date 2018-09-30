'use strict';
define(['js/module.js', 'jquery', 'ngdialog'], function (controllers, $, ngdialog) {
    controllers.controller('investmentController', function ($scope, resourceService, $filter, $state, $rootScope, $localStorage, $stateParams, postcallService,$location) {
        $scope.submitBool = true;
        $rootScope.title = '产品投资';
        $scope.txt = '无可用优惠券';
        $filter('isPath')('investment');
        $scope.rid = '';
        var user = $filter('isRegister')().user;
        if ($filter('isRegister')().register != true) {
            $state.go('dl', { returnurl: 'investment' });
            return;
        }
        $scope.changeType = function ($event) {
            $($event.currentTarget).attr('type','password');
        }
        //判断不是普通标
        if($localStorage.cp && $localStorage.cp.info && $localStorage.cp.info.productUseType && $localStorage.cp.info.productUseType != "0"){
            $scope.isNoNormal = true;
        }
        $scope.cpCoupon = {};
        if ($stateParams.amt != null) {
            $scope.amount = $stateParams.amt * 1;
        };
        $scope.cpCoupon.type = 0;
        $scope.isDsProduct = false;
        if ($stateParams.pid) {
            resourceService.queryPost($scope, $filter('getUrl')('cpDetail'), {
                'pid': $stateParams.pid,
                'uid': user.member.uid
            }, '产品详情');
        }
        else {
            $scope.cp = $localStorage.cp;
            $scope.cp.info = $localStorage.cp.info;
            if($localStorage.cp && $localStorage.cp.info
            		&& $localStorage.cp.info.productUseType && $localStorage.cp.info.productUseType == "1"){
            	$scope.isDsProduct = true;
            }
            resourceService.queryPost($scope, $filter('getUrl')('判断用户状态'), {
                'uid': user.member.uid
            }, '用户状态');
            resourceService.queryPost($scope, $filter('getUrl')('产品可用优惠券'), {
                'uid': user.member.uid,
                'pid': $scope.cp.info.id
            }, '产品可用优惠券');
            resourceService.queryPost($scope, $filter('getUrl')('cpDetail'), {
                'uid': user.member.uid,
                'pid': $scope.cp.info.id
            }, '账户余额');
        }
        $scope.playSound = true;
        $scope.userTypes = {};
        $scope.userTypes.passWord = '';
        $scope.showMask = false;
        $scope.cpCoupon.id = '';

        //if($localStorage.coupon){$scope.cpCoupon=$localStorage.coupon;}
        $scope.delCoupon = function () {
            $scope.cpCoupon = { type: 0, id: null };
        };
        if ($scope.amount >= 5000) {
            $scope.select = true;
        }
        else {
            $scope.select = false;
        }
        $scope.changeSelect = function () {
            if ($scope.select == false) {
                $scope.amount = 5000;
            }
            else if ($scope.amount >= 5000) {
                $scope.amount = '';
            }
            $scope.select = !$scope.select;
        }
        // 选择可用优惠券
        var currMillTimes = new Date().getTime();
        $scope.coupon = function () {
            if($scope.amount){
                var tempCp = null;
                for (var i = 0; i < $localStorage.coupons.length; i++) {
                    var item = $localStorage.coupons[i];
                    if((($scope.amount)>=(item.enableAmount))
                        && item.status == 0
                        && (item.expireDate >= currMillTimes)
                        && ($scope.cp.info.deadline >= item.productDeadline)){
                        if(tempCp == null || (tempCp != null && item.amount > tempCp.amount)){
                            tempCp = item;
                        }
                    }
                };
                if(tempCp){
                    $localStorage.cpCoupon = $scope.cpCoupon = tempCp;
                } else {
                    $localStorage.cpCoupon = $scope.cpCoupon = { type: '5'};
                }
            }else{
                $scope.delCoupon();
            }
        };
        // $scope.coupon();
        $scope.onChange = function () {
            $scope.delCoupon();
            $rootScope.amt = $scope.amount * 1;
            if ($scope.amount >= 5000) {
                $scope.select = true;
            }
            else {
                $scope.select = false;
            }
            // $scope.coupon();
            $scope.submitBool = true;
        };
        $scope.agreeclick = function () {
            $scope.playSound = !$scope.playSound;
        }

        /****
         *优惠券列表
         */
        $scope.useCoupon = function () {
            $filter('优惠券列表弹窗')($scope);
            $filter('支付弹窗')($scope);
            resourceService.queryPost($scope, $filter('getUrl')('产品可用优惠券'), {
                'uid': user.member.uid,
                'pid': $scope.cp.info.id
            }, '产品可用优惠券');
        }
        $scope.choosenTicket = function (event, item) {
            if(item.status == 1){
                item.status = 0;
                $scope.curTicket = null;
                $localStorage.cp.fid = $scope.cp.fid = null;
                $localStorage.cp.rewardProfit = null;
                $filter('orderBy')($scope.cop, ['status','suitable','profit','expireDate'],[false,false,false,false]);
                return;
            }
            if(!$scope.amount || item.enableAmount > $scope.amount){
                $scope.amount = item.enableAmount;
            }
            $localStorage.cp.fid = $scope.cp.fid = item.id;
            console.log(item);
            $scope.sortComboxCouponList(item);
            $scope.closeDialog();
        };
        /**
         * 计算优惠券列表状态和收益
         * @param selectedCoupon
         */
        $scope.sortComboxCouponList = function(selectedCoupon){
            var investAmount = $scope.amount? $scope.amount: 0;
            // console.log(selectedCoupon);
            angular.forEach($scope.cop, function (value, indexInList) {
                // switch (value.type) {
                //     case 1:
                //         //返现
                //         value.profit = value.amount;
                //         break;
                //     case 2:
                //         // 加息券  金额*加息券利率/360/100*30
                //         value.profit = investAmount*value.raisedRates/(360*100)*$scope.cp.deadline;
                //         break;
                //     case 4:
                //         // 翻倍券  金额*(基础利率*翻倍+平台加息)/360/100*30
                //         value.profit = investAmount*($scope.cp.rate * value.multiple - $scope.cp.rate)/(360*100)*$scope.cp.deadline;
                //         break;
                // } ;
                // console.log(value);
                if(selectedCoupon && selectedCoupon.id == value.id){
                    value.status = 1;
                    $scope.curTicket = value;
                    $scope.cp.rewardProfit = value.profitAmount;
                }else{
                    value.status = 0;
                }
                $scope.cop[indexInList] = value;
            });
            $filter('orderBy')($scope.cop, ['status','suitable','profit','expireDate'],[false,false,false,true]);
        };



        $scope.$on('resourceService.QUERY_POST_MYEVENT', function (event, data, type) {
            switch (type) {
                case '用户状态':
                    if (data.success) {
                        $scope.userTypes = data.map;
                    } else {
                        $filter('服务器信息')(data.errorCode, $scope, 'y')
                    }
                    break;
                case '产品详情':
                    if (data.success) {
                        if(data.map.specialRate) {
                            data.map.specialRate = parseFloat(data.map.specialRate);
                        }
                        $localStorage.cp = $scope.cp = data.map;
                        if ($scope.cp.info.type == 1) { $scope.playSound = true; }
                        if ($filter('isRegister')().user.member != undefined) {
                            resourceService.queryPost($scope, $filter('getUrl')('判断用户状态'), {
                                'uid': $filter('isRegister')().user.member.uid
                            }, '用户状态');
                            resourceService.queryPost($scope, $filter('getUrl')('cpDetail'), {
                                'uid': $filter('isRegister')().user.member.uid,
                                'pid': $scope.cp.info.id
                            }, '账户余额');
                            if ($scope.cp.info.repayType != 3 && $scope.cp.info.repayType != 4) {
                                resourceService.queryPost($scope, $filter('getUrl')('产品可用优惠券'), {
                                    'uid': $filter('isRegister')().user.member.uid,
                                    'pid': $scope.cp.info.id
                                }, '产品可用优惠券');
                            }
                        } else {
                            resourceService.queryPost($scope, $filter('getUrl')('判断用户状态'), {
                            }, '用户状态');
                            if ($scope.cp) {
                                resourceService.queryPost($scope, $filter('getUrl')('产品可用优惠券'), {
                                    'pid': $scope.cp.info.id
                                }, '产品可用优惠券');
                            };
                        };
                    }
                    break;
                case '账户余额':
                    $scope.balanceFuiou = data.map.balance;
                    if($scope.tyjCoupons != undefined && $scope.tyjCoupons.length >=0){
                    	$scope.nowNum=$scope.tyjCoupons[0].enableAmount;
                    }
                    $scope.leastaAmount = data.map.info.leastaAmount;
                    $scope.increasAmount = data.map.info.increasAmount;
                    $scope.isDs = data.map.isDs;
                    if(data.map && data.map.info && data.map.info.productUseType 
                    		&& data.map.info.productUseType == "1"){
                    	$scope.isDsProduct = true;
                    }
                    if($scope.isDsProduct) {
                        $('#amount').css({
                            'width':'65%',
                            'text-align': 'left',
                            'opacity': 1,
                            'color': '#000',
                            'font-weight': '500'
                        });
                        $scope.amount =200;
                        $scope.cp = data.map;
                    }
                    $scope.repair = data.map.repair;
                    // 返现红包
                    if ($scope.repair != undefined && $scope.cp.info.surplusAmount == $scope.amount) {
                        if ($scope.repair.type == 2) {/*补标收益为加息*/
                            $scope.FXJiaXi = true;
                        } else if ($scope.repair.type == 1) {/*补标收益为返现*/
                            $scope.FXFanXian = true;
                        }
                    } else {
                        $scope.noFXshouyi = true;
                    }
                    if ($scope.cp.info.establish != undefined) {
                        var date3 = $scope.cp.info.establish - Date.parse(new Date());
                        var day = Math.floor(date3 / (24 * 3600 * 1000));
                        var hh = Math.floor(date3 / (3600 * 1000));
                        if (day > 0) {
                            $scope.nowTimer = day + '天';
                            // $scope.isFinish = true;
                        }
                        else if (day == 0 && hh > 1) {
                            $scope.nowTimer = hh + '小时';
                            // $scope.isFinish = true;
                            $scope.isBuTimer = true;
                        }
                        else if (day == 0 && hh < 1) {
                            $scope.nowTimer = '1小时内'
                            // $scope.isFinish = true;
                        }
                        else if (hh < 0) {
                            if ($scope.cp.info.type == 1) {
                                $scope.nowTimer = '无限制';
                            }
                            else {
                                $scope.nowTimer = '已结束';
                            }
                            $scope.isFinish = true;
                        }
                        
                    } else {
                        $scope.nowTimer = '已结束';
                        $scope.isFinish = true;
                    };
                    if ($scope.repair != undefined && $scope.cp.info.surplusAmount == $scope.amount) {
                        if ($scope.repair.type == 2) {
                            $scope.FBJiaXi = true;
                        } else if ($scope.repair.type == 1) {
                            $scope.FBFanXian = true;
                        }
                    } else {
                        $scope.noFBshouyi = true;
                    }
                    if ($scope.repair != undefined && $scope.cp.info.surplusAmount == $scope.amount) {
                        if ($scope.repair.type == 2) {
                            $scope.JXQJiaXi = true;
                        } else if ($scope.repair.type == 1) {
                            $scope.JXQFanXian = true;
                        }
                    } else {
                        $scope.noJXshouyi = true;
                    }
                    // type==0
                    if ($scope.repair != undefined) {
                        if ($scope.repair.type == 2) {
                            $scope.noHBJiaXi = true;
                        } else if ($scope.repair.type == 1) {
                            $scope.noHBFanXian = true;
                        }
                    } else {
                        $scope.noHBshouyi = true;
                    }
                    break;
                case '产品可用优惠券':
                    var couponAmount = {};
                    couponAmount.amount = 0;
                    if (data.success) {

                        $localStorage.coupons = $scope.cop = data.map.list;
                        if ($stateParams.cpid != undefined && $scope.cop.length > 0) {
                            for (var i = 0; i < $scope.cop.length; i++) {
                                if ($scope.cop[i].id == $stateParams.cpid) {
                                    $scope.cpCoupon = $scope.cop[i];

                                    $scope.cpCoupon.amount = $scope.cop[i].amount;
                                }
                            };
                        }
                        else if ($localStorage.fromJY != undefined && $scope.cop.length > 0) {//设置密码回来后回填
                            for (var i = 0; i < $scope.cop.length; i++) {
                                if ($scope.cop[i].id == $localStorage.fromJY.cpid) {
                                    $scope.cpCoupon = $scope.cop[i];
                                }
                            };
                            $scope.amount = $localStorage.fromJY.amount;
                            $scope.cp.info.id = $localStorage.fromJY.cpInfoId;
                            if ($scope.amount >= 5000) {
                                $scope.select = true;
                            }
                            else {
                                $scope.select = false;
                            }
                            delete $localStorage.fromJY;
                        }
                        else {
                            $scope.cpCoupon.type = 0;
                        };

                        if (!$stateParams.pid) {
                            for (var j = 0; j < $scope.cop.length; j++) {
                                if ($scope.cop[j].pid && !$localStorage.coupon) {
                                    $scope.cpCoupon = $scope.cop[j];
                                }
                            }
                        }
                    } else {
                        $filter('服务器信息')(data.errorCode, $scope, 'y')
                    }
                    break;
                case '购买产品':
                    if (data.success) {
                        $scope.successData = $scope.cp;
                        $scope.successData.shouyi = data.map.shouyi;
                        $scope.successData.investAmount = $scope.amount;
                        $scope.successData.coupon = $scope.cpCoupon ? $scope.cpCoupon : 0;
                        $scope.successData.raisedRates = $scope.cpCoupon.raisedRates;
                        $scope.successData.multiple = $scope.cpCoupon.multiple;
                        // if ($scope.cp.isAuth == true) {
                        $scope.successData.investTime = data.map.investTime;
                        $scope.successData.isRepeats = data.map.isRepeats;
                        $scope.successData.luckCodeCount = data.map.luckCodeCount;
                        $scope.successData.luckCodes = data.map.luckCodes;
                        $scope.successData.activityURL = data.map.activityURL;
                        $scope.successData.jumpURL = data.map.jumpURL;
                        $scope.successData.cfcaSwitchFlag = data.map.cfcaSwitchFlag;
                        $scope.successData.isGivenLotteryOpp = data.map.isGivenLotteryOpp;
                        $localStorage.successData = $scope.successData;
                        // 砸蛋下线，当天首投跳转到砸蛋成功页去除
                        // if(!$localStorage.successData.isGivenLotteryOpp) {
                        //     $state.go('investSuccess');
                        /* } else {
                             $state.go('eggInvestSuccess');
                         }
                        }
                         else {
                             $localStorage.successData = $scope.successData;
                             postcallService(data.map.fuiouUrl, data.map.signature);
                         }
                        */
                        // 春节活动期间投资成功跳到特定成功页面
                        $scope.isInNewYearActivityTime = data.map.isInNewYearActivityTime;
                        if ($scope.isInNewYearActivityTime) {
                            $state.go('newYInvestSuc');
                        } else {
                            $state.go('investSuccess');
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
                                $state.go('recharge',{wap:'true',rid: $scope.rid,amount: $scope.amount});
                            }, 2000);
                        } else {
                            $filter('投资错误信息')(data.errorCode, $scope, 'y',data.errorMsg);
                        }
                    }
                    break;
            };
        });
        $scope.sendRequest = function () {
            var params = {
                'pid': $scope.cp.info.id,
                'tpwd': $scope.userTypes.passWord,
                'amount': $scope.amount,
                'uid': $filter('isRegister')().user.member.uid,
                'fid': $scope.cpCoupon.id,
                'activityType': 0
            }
            if($localStorage.latestActiveNotReimbursedRecord){
                params.rid = $localStorage.latestActiveNotReimbursedRecord.id;
            }
            if(!!$localStorage.drAwardMemberLog){
                params.awardRecordId = $localStorage.drAwardMemberLog.id;
            }
            resourceService.queryPost($scope, $filter('getUrl')('购买产品'), params, '购买产品');
        }
        // 弹窗：取消使用优惠券
        $scope.cancleBag = function () {
            $('.useRedBag').css('display','none');
            $scope.sendRequest();
        }
        // 弹窗：使用优惠券
        $scope.toUseBag = function () {
            $scope.amount = 5000;
            $('.useRedBag').css('display','none');
            $scope.coupon();
        }
        /* 砸蛋下线
        $scope.toRecive = function () {
            $scope.closeDialog();
            $scope.amount = $localStorage.drAwardMemberLog.drAward.useCondition;
        }
        $scope.closeTip = function () {
            $scope.closeDialog();
            delete $localStorage.drAwardMemberLog;
            $scope.tobuy();
        } */
        $scope.tobuy = function () {
            if ($scope.amount != '' && $scope.amount != undefined && $('#myPwd').val() != '') {
                if ($scope.cpCoupon.enableAmount > $scope.amount) {
                    $filter('投资错误信息')('1012', $scope, 'y');
                    return;
                }
              /* 砸蛋活动下线 if($localStorage.drAwardMemberLog && !$scope.cp.info.atid) {
                    var orderTime = $filter("date")($localStorage.drAwardMemberLog.orderTime,'yyyy-MM-dd');
                    var currTime = $filter("date")(new Date(),'yyyy-MM-dd');
                    // 过期则删除砸蛋优惠券
                    if(orderTime != currTime) {
                        delete $localStorage.drAwardMemberLog;
                    } else {
                        if($scope.amount < $localStorage.drAwardMemberLog.drAward.useCondition) {
                            $filter('领取奖励弹窗')($scope);
                        } else {
                            if($scope.cp.info.type != 1){
                                $scope.sendRequest();
                            } else if($scope.cp.info.type == 1) {
                                if($scope.amount >= 5000 || $scope.cop.length<=0){
                                    $scope.sendRequest();
                                } else if($scope.cop.length>0) {
                                    $('.useRedBag').css('display','block');
                                }
                            }
                        }
                    }
                } else { */
                    if($scope.cp.info.type != 1){
                        $scope.sendRequest();
                    } else if($scope.cp.info.type == 1) {
                        if($scope.amount >= 5000 || $scope.cop.length<=0){
                            $scope.sendRequest();
                        } else if($scope.cop.length>0) {
                            $('.useRedBag').css('display','block');
                        }
                    }
                // }
            } else {
                if ($scope.amount == '' || $scope.amount == undefined) {
                    $filter('投资错误信息')('noInp', $scope, 'y');
                } else if ($('#myPwd').val() == '') {
                    $filter('投资错误信息')('noPwd', $scope, 'y');
                }
            };
        }
        // if (($localStorage.cp && !$stateParams.pid) || ($localStorage.cp.info.type == '1')) {
        if ($localStorage.cp || ($localStorage.cp.info.type == '1')) {
            if ($filter('isRegister')().user.member != undefined) {
                resourceService.queryPost($scope, $filter('getUrl')('判断用户状态'), {
                    'uid': $filter('isRegister')().user.member.uid
                }, '用户状态');
                resourceService.queryPost($scope, $filter('getUrl')('cpDetail'), {
                    'uid': $filter('isRegister')().user.member.uid,
                    'pid': $localStorage.cp.info.id
                }, '账户余额');
                if ($localStorage.cp.info.repayType != 3 && $localStorage.cp.info.repayType != 4) {
                    resourceService.queryPost($scope, $filter('getUrl')('产品可用优惠券'), {
                        'uid': $filter('isRegister')().user.member.uid,
                        'pid': $localStorage.cp.info.id
                    }, '产品可用优惠券');
                }
            } else {
                resourceService.queryPost($scope, $filter('getUrl')('判断用户状态'), {
                }, '用户状态');
                if ($scope.cp) {
                    if ($scope.cp.info.repayType != 3 && $scope.cp.info.repayType != 4) {
                        resourceService.queryPost($scope, $filter('getUrl')('产品可用优惠券'), {
                            'pid': $localStorage.cp.info.id
                        }, '产品可用优惠券');
                    }
                };
            };
        } else if($stateParams.rid) {
            resourceService.queryPost($scope, $filter('getUrl')('判断用户状态'), {
                'uid': $filter('isRegister')().user.member.uid
            }, '用户状态');
            resourceService.queryPost($scope, $filter('getUrl')('cpDetail'), {
                'uid': $filter('isRegister')().user.member.uid,
                'pid': $localStorage.cp.info.id
            }, '账户余额');
        }
        else {
            $state.go('main.home');
        }

        $scope.onClick = function (name) {
            switch (name) {
                case '去设置交易密码':
                    $localStorage.fromJY = {};
                    $localStorage.fromJY.amount = $scope.amount;
                    $localStorage.fromJY.cpid = $scope.cpCoupon.id;
                    $localStorage.fromJY.cpInfoId = $scope.cp.info.id;

                    if(!$localStorage.latestActiveNotReimbursedRecord) {
                        $state.go('resetTradePwd', { firstset: true});
                    } else {
                        $state.go('resetTradePwd', { firstset: true, rid: $localStorage.latestActiveNotReimbursedRecord.id });
                    }
                    break;
            };
        };
        $scope.toback = function () {
            $filter('跳回上一页')(2);
        };
    });
})
