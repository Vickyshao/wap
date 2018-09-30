define(['js/module.js', 'jquery', 'ngdialog'], function (controllers, $, ngdialog) {
    controllers.controller('appInvestmentController', function ($scope, resourceService, $filter, $state, $rootScope, $localStorage, $stateParams, postcallService) {
        $scope.submitBool = true;
        $scope.cpCoupon = {};
        $scope.cpCoupon.type = 0;
        resourceService.queryPost($scope, $filter('getUrl')('cpDetail'), {
            'pid': $stateParams.pid,
            'uid': $stateParams.uid,
            'channel':$stateParams.channel,
            'token':$stateParams.token
        }, '产品详情');
        
        $scope.playSound = true;
        $scope.userTypes = {};
        $scope.userTypes.passWord = '';
        $scope.showMask = false;
        $scope.cpCoupon.id = '';

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
        $scope.onChange = function () {
            $rootScope.amt = $scope.amount * 1;
            if ($scope.amount >= 5000) {
                $scope.select = true;
            }
            else {
                $scope.select = false;
            }
        };
        $scope.agreeclick = function () {
            $scope.playSound = !$scope.playSound;
        }
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
                        data.map.specialRate = parseFloat(data.map.specialRate);
                        $localStorage.cp = $scope.cp = data.map;
                        if ($scope.cp.info.type == 1) { $scope.playSound = true; }
                        // if ($filter('isRegister')().user.member != undefined) {
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
                        // } else {
                        //     resourceService.queryPost($scope, $filter('getUrl')('判断用户状态'), {
                        //     }, '用户状态');
                        //     if ($scope.cp) {
                        //         resourceService.queryPost($scope, $filter('getUrl')('产品可用优惠券'), {
                        //             'pid': $scope.cp.info.id
                        //         }, '产品可用优惠券');
                        //     };
                        // };
                    }
                    break;
                case '账户余额':
                    $scope.balanceFuiou = data.map.balanceFuiou;
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
                        } else
                            if (day == 0 && hh > 1) {
                                $scope.nowTimer = hh + '小时';
                                // $scope.isFinish = true;
                                $scope.isBuTimer = true;
                            } else
                                if (day == 0 && hh < 1) {
                                    $scope.nowTimer = '1小时内'
                                    // $scope.isFinish = true;
                                } else
                                    if (hh < 0) {
                                        if ($scope.cp.info.type == 1) {
                                            $scope.nowTimer = '无限制';
                                        } else {
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
                        $scope.successData.shouyi = $rootScope.shouyi;
                        $scope.successData.investAmount = $scope.amount;
                        $scope.successData.coupon = $scope.cpCoupon ? $scope.cpCoupon : 0;
                        $scope.successData.raisedRates = $scope.cpCoupon.raisedRates;
                        $scope.successData.multiple = $scope.cpCoupon.multiple;
                        $scope.successData.cfcaSwitchFlag = data.map.cfcaSwitchFlag;
                        if ($scope.cp.isAuth == true) {
                            $scope.successData.investTime = data.map.investTime;
                            $scope.successData.isRepeats = data.map.isRepeats;
                            $scope.successData.luckCodeCount = data.map.luckCodeCount;
                            $scope.successData.luckCodes = data.map.luckCodes;
                            $scope.successData.activityURL = data.map.activityURL;
                            $scope.successData.jumpURL = data.map.jumpURL;
                            $localStorage.successData = $scope.successData;
                            $state.go('investSuccess');
                        }
                        else {
                            $localStorage.successData = $scope.successData;
                            postcallService(data.map.fuiouUrl, data.map.signature);
                        }
                    } else {
                        if (data.errorCode == '2001') {
                            $filter('投资交易密码错误信息')($scope);
                        } else {
                            $filter('投资错误信息')(data.errorCode, $scope, 'y');
                        }
                    }
                    break;
            };
        });
        $scope.tobuy = function () {
            // 投资分授权和未授权两种情况
            if ($scope.cp.isAuth == true) { // 授权
                if ($scope.amount != '' && $scope.amount != undefined && $('#myPwd').val() != '') {
                    if ($scope.cpCoupon.enableAmount > $scope.amount) {
                        alert("投资金额小于使用红包的最小限额！");
                        return;
                    }
                    resourceService.queryPost($scope, $filter('getUrl')('购买产品'), {
                        'pid': $scope.cp.info.id,
                        'tpwd': $scope.userTypes.passWord,
                        'amount': $scope.amount,
                        'uid': $filter('isRegister')().user.member.uid,
                        'fid': $scope.cpCoupon.id
                    }, '购买产品');
                } else {
                    if ($scope.amount == '' || $scope.amount == undefined) {
                        $filter('投资错误信息')('noInp', $scope, 'y');
                    } else if ($('#myPwd').val() == '') {
                        $filter('投资错误信息')('noPwd', $scope, 'y');
                    }
                }
            }
            else { // 未授权
                if ($scope.amount != '' && $scope.amount != undefined) {
                    if ($scope.cpCoupon.enableAmount > $scope.amount) {
                        alert("投资金额小于使用红包的最小限额！");
                        return;
                    }
                    resourceService.queryPost($scope, $filter('getUrl')('购买产品'), {
                        'pid': $scope.cp.info.id,
                        'amount': $scope.amount,
                        'uid': $filter('isRegister')().user.member.uid,
                        'fid': $scope.cpCoupon.id
                    }, '购买产品');
                }
                else {
                    $filter('投资错误信息')('noInp', $scope, 'y');
                }
            }
        };

        $scope.onClick = function (name) {
            switch (name) {
                case '去设置交易密码':
                    $localStorage.fromJY = {};
                    $localStorage.fromJY.amount = $scope.amount;
                    $localStorage.fromJY.cpid = $scope.cpCoupon.id;
                    $localStorage.fromJY.cpInfoId = $scope.cp.info.id;

                    $state.go('resetTradePwd', { firstset: true });
                    break;
            };
        };
        $scope.toback = function () {
            $filter('跳回上一页')(2);
        };
    });
})
