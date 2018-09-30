define(['js/module.js'], function (controllers) {
    controllers.controller('lotteryInvestCtrl'
        , ['$scope', '$rootScope'
            , 'resourceService'
            , '$filter'
            , '$state'
            , '$stateParams'
            , '$location'
            , '$localStorage'
            , function ($scope, $rootScope, resourceService, $filter, $state, $stateParams, $location, $localStorage) {
                delete $localStorage.coupon;
                $filter('isPath')('lotteryinvest');
                $rootScope.title = "产品投资";
                $rootScope.detaileTitle = "产品详情";
                $scope.toback = function () {
                    if ($rootScope.getUrlParam('from') == 'coupon') {
                        $state.go('myCoupon');
                    }
                    else if ($rootScope.getUrlParam('from') == 'newyearact1') {
                        $state.go('newyearact1', { wap: true });
                    }
                    else {
                        $filter('跳回上一页')(2);
                    }
                };
                $scope.yuebiao = {};
                $scope.mainbox = true;
                var user = $filter('isRegister')();
                $scope.toFrom = $rootScope.getUrlParam('toFrom');
                $scope.active = 0;
                $scope.isShowRule = false;
                $scope.showBigImg = false;
                $scope.errorText = '已超过剩余抽奖码数量';
                $scope.playSound = true;
                $scope.isCjmOut = false;
                $scope.isdisabled = false;
                $scope.user = $filter('isRegister')().user;
                $localStorage.userTypes = {};
                /*if($filter('isRegister')().register){
                    $scope.pwdFlag = $scope.user.member.tpwdSetting == 1 ? true:false;
                }*/
                if (user.register) {
                    resourceService.queryPost($scope, $filter('getUrl')('我的信息'), {
                        uid: user.user.member.uid
                    }, '是否认证');
                }
                var $win = $(window);
                $("html,body").animate({ scrollTop: $("body").offset().top });


                if ($stateParams.pid != null || $stateParams.rid) {
                    var obj = {};
                    obj.pid = $stateParams.pid;
                    if (user.register) {
                        obj.uid = user.user.member.uid;
                        resourceService.queryPost($scope, $filter('getUrl')('我的信息'), {
                            uid: user.user.member.uid
                        }, '我的信息');
                    }
                    resourceService.queryPost($scope, $filter('getUrl')('cpDetail'), obj,'cpDetail');
                } else {
                    $filter('跳回上一页')(1);
                };

                $scope.gologin = function () {
                    $state.go('dl', { returnurl: 'lotteryinvest?pid=' + $stateParams.pid });
                };
                $scope.goDetail = function () {
                    $state.go('lotteryInvestDetail', { id: $scope.cp.awardInfo.id });
                };
                $scope.toXq = function () {
                    $scope.xqinfo = {
                        amount: $scope.amount,
                        expect: $scope.expect
                    };
                    if ($scope.cpCoupon) {
                        $localStorage.cpCoupon = $scope.cpCoupon;
                    }
                    $localStorage.cp.xqinfo = $scope.xqinfo;
                    $state.go('cpInvestInfo')
                };

                $scope.toInvest = function () {
                    if ($scope.amount >= $scope.cp.info.leastaAmount) {
                        if ($scope.amount%$scope.cp.info.increasAmount == 0) {
                            if ($scope.map.realVerify) {
                                //判断余额是否充足
                                if ($scope.amount > $scope.balance) {
                                    $scope.isBalanceSufficient = false;
                                } else {
                                    $scope.isBalanceSufficient = true;
                                }
                                $filter('支付弹窗')($scope);
                            } else {
                                $state.go('investAuthentication',{amount: $scope.amount,expect:$scope.expect});
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
                $scope.zhifu = function () {
                    $scope.closeDialog();
                    $filter('设置交易密码弹窗')($scope);
                };
                $scope.firstSetPwd = false;
                $scope.enterPassword =function (flag) {
                    var ul = $(".pwd li");
                    var pwd = $('#tradePwd').val();
                    var len = pwd.length;
                    for(var i=0;i<6;i++){
                        if(i < len){
                            $(ul[i]).addClass("active");
                        }else{
                            $(ul[i]).removeClass("active");
                        }
                    }
                    if(len == 6 && flag == 1){
                        if($scope.firstSetPwd) {
                            if($localStorage.userTypes.passWord1 == pwd) {
                                $localStorage.userTypes.passWord = pwd;
                                // $scope.sendRequest();
                                resourceService.queryPost($scope, $filter('getUrl')('设置交易密码'),{
                                    tpwd: $localStorage.userTypes.passWord,
                                    chkSmsCode: false,
                                    uid: user.user.member.uid
                                },'设置交易密码');
                            } else {
                                alert('两次输入密码不一样');
                                $scope.firstSetPwd = false;
                            }
                        } else {
                            $localStorage.userTypes.passWord1 = pwd;
                            $scope.firstSetPwd = !$scope.firstSetPwd;
                        }
                    }
                    if(len == 6 && flag == 2){
                        $localStorage.userTypes.passWord = pwd;
                        $scope.sendRequest();
                    }
                };

                $scope.changeNumFun = function (val) {
                    if ($scope.cjnum){
                        if (val > 0) {
                            if ($scope.cjnum > $scope.cjmNumMax){
                                $scope.changeNumClass = 'no-add';
                                $scope.isCjmOut = true;
                                $scope.errorText = '已超过剩余抽奖码数量';
                            }else if ($scope.cjnum == $scope.cjmNumMax){
                                $scope.changeNumClass = 'no-add';
                                $scope.isCjmOut = false;
                            } else {
                                $scope.changeNumClass = 'add-reduce';
                                $scope.isCjmOut = false;
                                $scope.cjnum++;
                            }
                        } else if (val < 0) {
                            if ($scope.cjnum <= 1){
                                $scope.changeNumClass = 'no-reduce';
                                $scope.isCjmOut = false;
                            } else if ($scope.cjnum > $scope.cjmNumMax){
                                $scope.changeNumClass = 'no-add';
                                $scope.isCjmOut = true;
                                $scope.cjnum --;
                            } else {
                                $scope.isCjmOut = false;
                                $scope.cjnum --;
                                $scope.changeNumClass = 'add-reduce';
                            }
                        }
                    }
                }

                $scope.changInputFun = function () {
                    if ($scope.cjnum > $scope.cjmNumMax){
                        $scope.changeNumClass = 'no-add';
                        $scope.isCjmOut = true;
                        $scope.errorText = '已超过剩余抽奖码数量';
                    } else if ($scope.cjnum == $scope.cjmNumMax) {
                        $scope.changeNumClass = 'no-add';
                        $scope.isCjmOut = false;
                        // $scope.errorText = '已超过剩余抽奖码数量';
                    } else if ($scope.cjnum <= 1) {
                        $scope.isCjmOut = false;
                        // $scope.errorText = '抽奖码数量最小为1';
                        $scope.changeNumClass = 'no-reduce';
                    } else {
                        $scope.isCjmOut = false;
                        $scope.changeNumClass = 'add-reduce';
                    }
                }
                $scope.inputBlur = function () {
                    if ($scope.cjnum > $scope.cjmNumMax){
                        $scope.cjnum = $scope.cjmNumMax;
                        $scope.isCjmOut = false;
                    }
                }
                $scope.agreeclick = function () {
                    $scope.playSound = !$scope.playSound;
                }
                $scope.sendRequest = function () {
                    $scope.closeDialog();
                    var params = {
                        'pid': $scope.cp.info.id,
                        'tpwd': $localStorage.userTypes.passWord,
                        'amount': $scope.amount,
                        'uid': $filter('isRegister')().user.member.uid,
                        'activityType': 0
                    }
                    resourceService.queryPost($scope, $filter('getUrl')('购买产品'), params, '购买产品');
                }
                $scope.tobuy = function () {
                    if ($scope.amount != '' && $scope.amount != undefined && $('#myPwd').val() != '') {
                        /* if ($scope.cpCoupon.enableAmount > $scope.amount) {
                             $filter('投资错误信息')('1012', $scope, 'y');
                             return;
                         }*/
                        if($localStorage.drAwardMemberLog) {
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

                    } else {
                        if ($scope.amount == '' || $scope.amount == undefined) {
                            $filter('投资错误信息')('noInp', $scope, 'y');
                        } else if ($('#myPwd').val() == '') {
                            $filter('投资错误信息')('noPwd', $scope, 'y');
                        }
                    };
                };
                $scope.onClick = function (name) {
                    if ($scope.map.realVerify) {
                        switch (name) {
                            case '去设置交易密码':
                                $localStorage.fromJY = {};
                                $localStorage.fromJY.amount = $scope.amount;
                                $localStorage.fromJY.cpInfoId = $scope.cp.info.id;

                                if(!$localStorage.latestActiveNotReimbursedRecord) {
                                    $state.go('resetTradePwd', { firstset: true});
                                } else {
                                    $state.go('resetTradePwd', { firstset: true, rid: $localStorage.latestActiveNotReimbursedRecord.id });
                                }
                                break;
                        };
                    }
                    else {
                        $state.go('certification');
                    }
                };
                $scope.toback = function () {
                    $filter('跳回上一页')(2);
                };
                var userStatus = {}
                if(user.user.member){
                    userStatus.uid = user.user.member.uid;
                    $scope.tpwdSetting = user.user.member.tpwdSetting;
                    $scope.realVerity = user.user.member.realVerify;
                    resourceService.queryPost($scope, $filter('getUrl')('判断用户状态'), userStatus, '用户状态');
                } else {
                    userStatus.uid = '';
                }

                resourceService.queryPost($scope, $filter('getUrl')('获取抽奖活动的奖品信息'), userStatus, '获取抽奖活动的奖品信息');

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
                        case '我的信息':
                            if(data.success) {
                                $scope.tpwdFlag = data.map.tpwdFlag;
                                $scope.pwdFlag = $scope.tpwdFlag == 1 ? true:false;
                            }
                            break;
                        case '获取抽奖活动的奖品信息':
                            if (data.success) {
                                $scope.residueCount = data.map.awardInfo.residueCount;
                                $scope.totalCount = data.map.awardInfo.totalCount;
                                /*if (data.map.awardType == 0) {
                                    $scope.amountPrice = data.map.awardInfo.amount;
                                } else {
                                    $scope.amountPrice = data.map.awardInfo.unitPrice;
                                }*/
                            } else {
                                $filter('服务器信息')(data.errorCode, $scope, 'y')
                            }
                            break;

                        case 'cpDetail':
                            if (data.success) {
                                if(data.map.specialRate) {
                                    data.map.specialRate = parseFloat(data.map.specialRate);
                                }
                                $scope.balance = data.map.balance;
                                $scope.cfcaSwitchFlag = data.map.cfcaSwitchFlag;
                                $scope.cp = $localStorage.cp = data.map;
                                $scope.pid = $stateParams.pid;
                                if (data.map.awardInfo) {
                                    $scope.awardName = data.map.awardInfo.name;
                                }

                                $scope.type = data.map.info.type;
                                if (!$scope.cp.info.surplusAmount) {
                                    $scope.changeNumClass = 'no';
                                    $scope.cjnum = 0;
                                    $scope.isdisabled = true;
                                    return;
                                } else {
                                    $scope.changeNumClass = 'no-reduce';
                                    $scope.cjnum = 1;
                                }
                                $scope.cjmNumMax = $scope.cp.info.surplusAmount/$scope.cp.awardInfo.lotteryCodePrice ;
                                if ($scope.residueCount > 10) {
                                    $scope.cjnum = 10;
                                } else if ($scope.residueCount <= 10){
                                    $scope.cjnum = $scope.residueCount;
                                }
                                if ($scope.cjnum == 1) {
                                    $scope.changeNumClass = 'no-reduce';
                                } else if ($scope.cjnum < $scope.cjmNumMax && $scope.cjnum > 1){
                                    $scope.changeNumClass = 'add-reduce';
                                } else if ($scope.cjnum == $scope.cjmNumMax){
                                    $scope.changeNumClass = 'no-add';
                                }
                            }
                            break;

                        case 'cpPicAndInvest':
                            $scope.picList = data.map.picList;
                            $scope.investList = data.map.investList;
                            break;
                        case '是否认证':
                            $scope.map = data.map;
                            break;

                        case '购买产品':
                            if (data.success) {
                                $scope.closeDialog();
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
                                $state.go('lotteryinvestsuc',{});
                            } else {
                                if (data.errorCode == '2001') {
                                    $filter('投资交易密码错误信息')($scope);
                                } else if (data.errorCode == '1007'){
                                    if($localStorage.latestActiveNotReimbursedRecord){
                                        $scope.rid = $localStorage.latestActiveNotReimbursedRecord.id;
                                    }
                                    $filter('投资错误信息')(data.errorCode, $scope, 'y',data.errorMsg);
                                    setTimeout(function () {
                                        $state.go('recharge',{wap:'true',rid: $scope.rid});
                                    }, 2000);
                                } else {
                                    $filter('投资错误信息')(data.errorCode, $scope, 'y',data.errorMsg);
                                }
                            }
                            break;
                        case '设置交易密码':
                            if (data.success) {
                                // resourceService.queryPost($scope, $filter('getUrl')('购买产品'), $scope.params, {name: '购买产品'});
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
                // alert($(window).height())
            }
        ]);
    controllers.controller('lotteryDetailCtrl', ['$scope', '$rootScope', '$filter', '$state','$stateParams', 'resourceService','$localStorage', function($scope, $rootScope, $filter, $state,$stateParams, resourceService,$localStorage) {
        $filter('isPath')('lotteryInvestDetail');
        $rootScope.title = "奖品详情";
        $scope.toback=function () {
            $filter('跳回上一页')(2);
        };
        if ($rootScope.fromNative) {
            $(".w-lottery-detail").removeClass("headerTop");
        }
        $scope.$on('resourceService.QUERY_POST_MYEVENT', function (event, data, eObj) {
            switch (eObj.name) {
                case '产品详情图':
                    if (data.success) {
                        $scope.awardInfo = data.map.awardInfo;
                        $scope.detailImg = $scope.awardInfo.h5DetailImgUrl;
                    }
                    break;
            };
        });
        resourceService.queryPost($scope, $filter('getUrl')('奖品详情'), {id: $stateParams.id}, { name: '产品详情图' });
    }]);
    controllers.controller('lotteryInvestSuccsssCtrl', ['$scope', '$rootScope', '$filter', '$state','$stateParams', 'resourceService','$localStorage', function($scope, $rootScope, $filter, $state,$stateParams, resourceService,$localStorage) {
        $rootScope.title = "投资成功";
        document.getElementsByTagName('html')[0].scrollTop = 0;
        document.getElementsByTagName('body')[0].scrollTop = 0;
        $scope.toback=function () {
            $filter('跳回上一页')();
        };
        $scope.data={};
        $scope.user = $filter('isRegister')().user.member;
        if(!$scope.user){$state.go('dl');return;}
        if($localStorage.successData){
            $scope.successData=$localStorage.successData;
        }
        delete $localStorage.successData;

        if($stateParams.dsEcType == 1) {
            $scope.dsEcType = true;
        } else if($stateParams.dsEcType == 2){
            $scope.dsEcType = false;
        }

    }]);
})
