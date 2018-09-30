define(['jweixin', 'js/module.js', 'jquery', 'ngdialog', 'SHR256'], function (wx, controllers, $, ngdialog, SHR256) {
    controllers.controller('interestSubsidyCtrl', ['$scope', '$rootScope', 'resourceService', '$filter', '$state', 'ngDialog', '$location', 'md5', '$localStorage', '$stateParams', 'isWeixin', function ($scope, $rootScope, resourceService, $filter, $state, ngDialog, $location, md5, $localStorage, $stateParams, isWeixin) {
        $("html,body").scrollTop(0);
        $filter('isPath')('interestSubsidy');
        $rootScope.title = '贴息大作战';
        $scope.goLook = function() {
            $filter('贴息活动规则弹窗')($scope);
        };
        $scope.toback = function() {
            $filter('跳回上一页')(2);
        };
        $scope.isLogin = $filter('isRegister')().register;
        $scope.memberInfoForDiscount = {
            // availableMoney:16000,
            // balacne:16000,
            // cps:1,
            // investedMoney:0,
            // memberTypeDesc: ''
        };
        $scope.uid = null;
        $scope.popup = false;
        $scope.cardType = null;
        $scope.cardName = null;
        $scope.cardMoney = null;
        $scope.cardStyle = {
        };
        $scope.cardPop = null;
        $scope.status = 1;
        $scope.progressColor = 1;
        $scope.rate = null;
        $scope.ratePlus = null;
        $scope.isInActivityTime = true;
        $scope.realVerify = null;
        /*调一下接口显示活动是否结束*/
        resourceService.queryPost($scope, $filter('getUrl')('加息卡'),{uid: $scope.uid, token: $scope.token}, { name: '加息卡' });
        if($rootScope.fromNative) {
            $('.interest-subSidy').removeClass('headerTop');
            $scope.uid = $rootScope.getUrlParam('uid');
            $scope.token = $rootScope.getUrlParam('token');
            if ($scope.uid && $scope.token) {
                $scope.isLogin = true;
                resourceService.queryPost($scope, $filter('getUrl')('加息卡'),{uid: $scope.uid, token: $scope.token}, { name: '加息卡' });
            } else {
                $scope.isLogin = false;
            }
        } else{
            if($scope.isLogin) {
                $scope.uid = $filter('isRegister')().user.member.uid;
                /*是否认证*/
                resourceService.queryPost($scope, $filter('getUrl')('我的信息'), {
                    uid: $scope.uid
                }, { name: '是否认证' });
                resourceService.queryPost($scope, $filter('getUrl')('加息卡'),{uid: $scope.uid}, { name: '加息卡' });
            }
        }
        /*未登录*/
        $scope.goToLogin = function() {
            if($rootScope.fromNative) {
                if (!$scope.isLogin) {
                    // document.location = 'hushentologin:';
                    $filter('通用登录弹窗')($scope);
                }
            } else {
                if(!$scope.isLogin) {
                    // $state.go('dl', {
                    //     returnurl: 'interestSubsidy',
                    //     wap: true
                    // })
                    $filter('通用登录弹窗')($scope);
                }
            }
        };
        /*普通用户,cps用户-已登录，无资产，去充值*/
        $scope.goToRecharge = function() {
            if($rootScope.fromNative) {
                if ($scope.isLogin) {
                    document.location = 'hushentorecharge:';
                } else {
                    document.location = 'hushentologin:';
                }
            } else {
                if ($scope.memberInfoForDiscount.balacne < 15000) {
                    if ($scope.realVerify) {
                        /*如果实名--充值*/
                        $state.go('recharge', {
                            from: 'interestSubsidy',
                            wap: true
                        })
                    } else {
                        /*未实名--实名认证*/
                        $state.go('authRecharge', {
                            from: 'interestSubsidy',
                            wap: true
                        });
                    }

                }
            }

        };
        /*cps用户资产足够去投资 提示未首投 */
        $scope.cpsGoToInvest = function() {
            if($rootScope.fromNative) {
                if ($scope.isLogin) {
                    $filter('未首投弹窗')($scope);
                }
            } else {
                if($scope.isLogin) {
                    $filter('未首投弹窗')($scope);
                }
            }

        };
        /*升级--充值升级*/
        $scope.goToRechargeUp = function() {
            if($rootScope.fromNative) {
                if ($scope.isLogin) {
                    document.location = 'hushentorecharge:';
                } else {
                    document.location = 'hushentologin:';
                }
            } else {
                //有资产--已实名
                $state.go('recharge', {
                    from: 'interestSubsidy',
                    wap: true
                })
            }
        };
        /*至尊卡--投资使用*/
        $scope.topCardToVest = function() {
            if($rootScope.fromNative) {
                if($scope.isLogin) {
                    document.location = 'hushenlist:';
                } else {
                    document.location = 'hushentologin:';
                }
            } else {
                if($scope.isLogin) {
                    $state.go('main.bankBillList');
                } else {
                    // $state.go('dl',{ returnurl: 'interestSubsidy' });
                    $filter('通用登录弹窗')($scope);
                }
            }
        };
        /*卡升级--投资使用*/
        $scope.upCardToVest = function() {
            if($rootScope.fromNative) {
                if($scope.isLogin) {
                    document.location = 'hushenlist:';
                } else {
                    document.location = 'hushentologin:';
                }
            } else {
                if($scope.isLogin) {
                    $state.go('main.bankBillList');
                } else {
                    // $state.go('dl',{ returnurl: 'interestSubsidy' });
                    $filter('通用登录弹窗')($scope);
                }
            }
        };
        /*卡升级弹窗--投资使用*/
        $scope.popupTovest = function() {
            ngDialog.closeAll();
            if($rootScope.fromNative) {
                if($scope.isLogin) {
                    document.location = 'hushenlist:';
                } else {
                    document.location = 'hushentologin:';
                }
            } else {
                if($scope.isLogin) {
                    $state.go('main.bankBillList');
                } else {
                    // $state.go('dl',{ returnurl: 'interestSubsidy' });
                    $filter('通用登录弹窗')($scope);
                }
            }
        };
        /*弹窗--请完成首投隔天后来领卡*/
        $scope.goToFirstInvest = function() {
            ngDialog.closeAll();
            if($rootScope.fromNative) {
                if($scope.isLogin) {
                    document.location = 'hushenlist:';
                } else {
                    document.location = 'hushentologin:';
                }
            } else {
                if($scope.isLogin) {
                    $state.go('main.bankBillList');
                } else {
                    // $state.go('dl',{ returnurl: 'interestSubsidy' });
                    $filter('通用登录弹窗')($scope);
                }
            }
        };

        // 登录注册
        $scope.myForm2 = {
            hasPhone: false
        };
        $scope.userLoginform2 = {
            hasPhone: false
        };
        $scope.userLogin = {};
        $scope.login = {};
        $scope.passwordText = false;
        $scope.isSubMin = true;
        $scope.submitReservate = true;
        $scope.form = true;
        $scope.nowTimer = "获取验证码";
        $scope.isShowPicCode = true;
        var objData = {
            pageOn:1,
            pageSize: 30
        };

        // 注册开始
        // 图形验证码
        var changeIMG = function (event) { //换图片验证码
            if (event != undefined) {
                event.currentTarget.src += '?' + new Date().getTime();
            } else {
                if ($('.img-box img')[0] != undefined) {
                    $('.img-box img')[0].src += '?' + new Date().getTime();
                }
            }
        };
        changeIMG();
        $scope.clickInput = function (event) {
            // $scope.userLogin.picCode = null;
            changePicEvent = event;
            changeIMG(changePicEvent);
        };
        var isSub = true;
        $scope.isImgCode = true;
        $scope.zuce = function (tegForm) {
            tegForm.checkbox = true;
            if (tegForm.recommPhone === undefined) {
                delete tegForm.recommPhone;
            };
            if (tegForm.toFrom === undefined) {
                delete tegForm.toFrom;
            };
            if ($localStorage.webFormPath != undefined) {
                if ($localStorage.webFormPath.toFrom != undefined) {
                    $scope.login.toFrom = $localStorage.webFormPath.toFrom;
                };
            };
            if (tegForm.$valid) {
                if (tegForm.passWord.$modelValue.length > 5) {
                    if (isSub) {
                        isSub = false;
                        resourceService.queryPost($scope, $filter('getUrl')('zuce'), $scope.login, { name: '注册', tegForm: tegForm });
                    }
                }
            } else {
                $scope.validate(tegForm,0);
            }
        }
        // $scope.hasPhone = false;
        $scope.picCodeMsg = '请检查图形验证码是否正确';
        $scope.getyzm = function (tegForm) {
            if ($scope.isShowPicCode) {
                // targetFrom = tegForm;
                if ($scope.isSubMin == true) {
                    if(tegForm.mobilephone.$invalid) {
                        tegForm.mobilephone.$dirty = true;
                        return false;
                    }else if(tegForm.picCode.$invalid){
                        tegForm.picCode.$dirty = true;
                        return false;
                    } else if($scope.isImgCode==true){
                        if($scope.validate(tegForm,1)){
                            resourceService.queryPost($scope, $filter('getUrl')('getyzm'), {
                                mobilephone: $scope.login.mobilephone,
                                picCode: $scope.login.picCode,
                                // 有图形码时设置isPic为true，没有不设置
                                isPic : true,
                                isCheckPic: true,
                                type: 1
                            }, { name: '获取验证码', tegForm: tegForm });

                        }
                    } else{
                        $scope.login.picCode = '';
                        $scope.isImgCode=true;
                        changeIMG();
                        $scope.picCodeMsg = '请重新输入图形验证码';
                    }
                }
            } else {
                if ($scope.isSubMin == true) {
                    if($scope.validate(tegForm,3)){
                        resourceService.queryPost($scope, $filter('getUrl')('getyzm'), {
                            mobilephone: $scope.login.mobilephone,
                            picCode: $scope.login.picCode,
                            isPic : true,
                            isCheckPic: false,
                            type: 1
                        }, { name: '获取验证码', tegForm: tegForm });

                    }

                    if($rootScope.maskError) {
                        setTimeout(function () {
                            $rootScope.maskError = false;
                        }, 1500);
                    }

                }
            }

        };
        // 需要图片验证码获取验证码 flag = 2 表示不需要图片验证码-立即领取 flag = 3 表示不需要图片验证码获取验证码
        $scope.validate = function(tegForm, flag){
            if ($scope.hasPhone == true) {
                $filter('zuceError')('1003');
                return false;
            }
            else if (flag == 1) {
                if (tegForm.picCode.$error.required == true) {
                    $filter('zuceError')('1004');
                    return false;
                }
            }
            else if (flag == 2) {
                if (tegForm.smsCode.$error.required == true) {
                    $filter('zuceError')('1006');
                    $scope.login.smsCode = '';
                    return false;
                }
                else if (tegForm.passWord.$error.required == true) {
                    $filter('zuceError')('1010');
                    $scope.login.passWord = '';
                    return false;
                }
                else if (tegForm.passWord.$valid == false) {
                    $filter('zuceError')('1011');
                    return false;
                }
            }
            else if (flag == 0) {
                if ($scope.isShowPicCode){
                    if (tegForm.picCode.$error.required == true) {
                        $filter('zuceError')('1004');
                        return false;
                    }
                    else if (tegForm.smsCode.$error.required == true) {
                        $filter('zuceError')('1006');
                        $scope.login.smsCode = '';
                        return false;
                    }
                    else if (tegForm.passWord.$error.required == true) {
                        $filter('zuceError')('1010');
                        $scope.login.passWord = '';
                        return false;
                    }
                    else if (tegForm.passWord.$valid == false) {
                        $filter('zuceError')('1011');
                        return false;
                    }
                }

            }
            return true;
        };
        $scope.loginHasPhoneTip = '请检查手机号是否正确';
        $scope.registerHasPhoneTip = '请检查手机号是否正确';
        $scope.pwdTip = '请输入6-16位字母数字混合密码';

        /*焦点进入与离开*/
        $scope.blurID = function (code, tegForm) {
            if (!tegForm.mobilephone.$error.required && !tegForm.mobilephone.$error.minlength && !tegForm.mobilephone.$error.pattern) {
                resourceService.queryPost($scope, $filter('getUrl')('getPhone'), {
                    mobilephone: tegForm.mobilephone.$modelValue
                }, { name: '注册验证手机号', tegForm: tegForm });
            };
            // changeIMG();
        };
        $scope.changePwd = function (event) {
            event.target.type = 'passWord';
        }
        // 点击登录
        $scope.sbmit = function (tegForm) {
            resourceService.queryPost($scope, $filter('getUrl')('login'), $scope.userLogin, { name: 'login', tegForm: tegForm });

        }
        //关闭登录弹窗清空登陆内容
        $scope.close = function() {
            ngDialog.closeAll();
            $scope.userLogin.mobilephone = null;
            $scope.userLogin.passWord = null;
            $scope.login.smsCode = '';
            $scope.login.mobilephone = '';
            $scope.login.passWord = '';
            $scope.login.picCode = '';
        }
        $scope.$on('resourceService.QUERY_POST_MYEVENT', function (event, data, type) {
            switch (type.name) {
                case '获取验证码':
                    if (data.success==true) {
                        $filter('60秒倒计时')($scope, 120);
                        $scope.isImgCode=false;
                    } else if(data.errorCode == '1006'){
                        type.tegForm.picCode.$invalid = true;
                        type.tegForm.picCode.$dirty = true;
                    } else {
                        type.tegForm.picCode.$invalid = true;
                        type.tegForm.picCode.$dirty = true;
                    }
                    break;
                case '注册验证手机号':
                    if (data.success) {
                        if (data.map.exists) { //已有用户名
                            if(type.tegForm.$name == 'userLoginform') {
                                $scope.userLoginform2.hasPhone = false;
                            }  else {
                                $scope.myForm2.hasPhone = true;
                                $scope.registerHasPhoneTip = '请检查手机号是否已注册';
                            }
                        } else {
                            if(type.tegForm.$name == 'myForm') {
                                $scope.myForm2.hasPhone = false;
                            } else {
                                $scope.userLoginform2.hasPhone = true;
                                $scope.loginHasPhoneTip = '请检查手机号是否已注册';
                            }
                        };
                    }
                    break;
                case '验证图形码':
                    if (data.success) {
                        if (data.map) { //图形码验证失败
                            type.tegForm.picCode.$invalid = true;
                            type.tegForm.picCode.$dirty = true;
                            return;
                        }
                        else if ($scope.isSubMin) {
                            resourceService.queryPost($scope, $filter('getUrl')('getyzm'), {
                                mobilephone: $scope.login.mobilephone,
                                picCode: $scope.login.picCode
                            }, { name: '获取验证码', tegForm: tegForm });
                            $filter('60秒倒计时')($scope, 120);
                        }
                    }
                    break;
                case '注册':
                    isSub = true;
                    if (data.success) {
                        if($rootScope.fromNative) {
                            document.location = "hushenregistersuccess:" +  JSON.stringify(data);
                        } else {
                            $localStorage.user = data.map;
                            $scope.isLogin = $filter('isRegister')().register;
                            console.log(data.map.member.uid);
                            resourceService.queryPost($scope, $filter('getUrl')('加息卡'),{uid: data.map.member.uid}, { name: '加息卡' });
                        }
                        $scope.closeDialog();
                    } else {
                        type.tegForm.smsCode.$invalid = true;
                        type.tegForm.smsCode.$dirty = true;
                        $scope.login.smsCode = '';
                        $scope.login.passWord = '';
                        $scope.isShowPicCode = true;
                    };
                    break;
                case 'login':
                    if (data.success) {
                        if($rootScope.fromNative) {
                            document.location = "hushenloginsuccess:" +  JSON.stringify(data);
                        } else {
                            $localStorage.user = data.map;
                            $scope.isLogin = $filter('isRegister')().register;
                            objData.uid = $localStorage.user.member.uid;
                            console.log(data.map.member.uid);
                            resourceService.queryPost($scope, $filter('getUrl')('加息卡'),{uid: data.map.member.uid}, { name: '加息卡' });
                        }
                        resourceService.queryPost($scope, $filter('getUrl')('预约奖品列表'), objData, { name: '预约奖品列表' });
                        $scope.closeDialog();
                    } else {
                        if($scope.userLoginform2.hasPhone == false) {
                            $scope.pwdTip = '密码错误，请重新输入';
                            type.tegForm.passWord.$dirty = true;
                            type.tegForm.passWord.$invalid = true;
                            $scope.userLogin.passWord = null;
                        } else {
                            type.tegForm.mobilephone.$dirty = true;
                            type.tegForm.mobilephone.$invalid = true;
                            type.tegForm.passWord.$dirty = true;
                            type.tegForm.passWord.$invalid = true;
                            $scope.userLogin.mobilephone = null;
                            $scope.userLogin.passWord = null;
                        }
                    }
                    break;
                case '加息卡':
                    if(data.success) {
                        $scope.memberInfoForDiscount = data.map.memberInfoForDiscount;
                        $scope.popup = data.map.popup;
                        $scope.isInActivityTime = data.map.isInActivityTime;
                        if ($scope.memberInfoForDiscount && $scope.memberInfoForDiscount.memberTypeDesc) {
                            switch  ($scope.memberInfoForDiscount.memberTypeDesc){
                                case '白银卡':
                                    $scope.cardType = '/images/interestSubsidy/get-silver-card.png';
                                    $scope.cardName = '黄金卡';
                                    $scope.cardMoney = 38000;
                                    $scope.cardStyle = {
                                        "background-image": "url('/images/interestSubsidy/gold-back.png')",
                                        "background-repeat": 'no-repeat',
                                        "background-size": '100% 100%'
                                    };
                                    $scope.rate = 120;
                                    $scope.ratePlus = 0.76;
                                    $scope.status = 2;
                                    $scope.progressColor  = 1;
                                    if ($scope.popup) {
                                        $scope.cardPop = '/images/interestSubsidy/silver-card-pop.png';
                                        $filter('卡升级弹窗')($scope);
                                    }
                                    break;
                                case '黄金卡':
                                    $scope.cardType = '/images/interestSubsidy/get-gold-card.png';
                                    $scope.cardName = '铂金卡';
                                    $scope.cardMoney = 68000;
                                    $scope.cardStyle = {
                                        "background-image": "url('/images/interestSubsidy/bj-back.png')",
                                        "background-repeat": 'no-repeat',
                                        "background-size": '100% 100%'
                                    };
                                    $scope.rate = 130;
                                    $scope.ratePlus = 1.14;
                                    $scope.status = 1;
                                    $scope.progressColor  = 1;
                                    if ($scope.popup) {
                                        $scope.cardPop = '/images/interestSubsidy/gold-card-pop.png';
                                        $filter('卡升级弹窗')($scope);
                                    }
                                    break;
                                case '铂金卡':
                                    $scope.cardType = '/images/interestSubsidy/get-bojin-card.png';
                                    $scope.cardName = '钻石卡';
                                    $scope.cardMoney = 120000;
                                    $scope.cardStyle = {
                                        "background-image": "url('/images/interestSubsidy/zs-back.png')",
                                        "background-repeat": 'no-repeat',
                                        "background-size": '100% 100%'
                                    };
                                    $scope.rate = 150;
                                    $scope.ratePlus = 1.19;
                                    $scope.status = 1;
                                    $scope.progressColor  = 2;
                                    if ($scope.popup) {
                                        $scope.cardPop = '/images/interestSubsidy/bojin-card-pop.png';
                                        $filter('卡升级弹窗')($scope);
                                    }
                                    break;
                                case '钻石卡':
                                    $scope.cardType = '/images/interestSubsidy/get-sushi-card.png';
                                    $scope.cardName = '至尊卡';
                                    $scope.cardMoney = 250000;
                                    $scope.cardStyle = {
                                        "background-image": "url('/images/interestSubsidy/top-back.png')",
                                        "background-repeat": 'no-repeat',
                                        "background-size": '100% 100%'
                                    };
                                    $scope.rate = 160;
                                    $scope.ratePlus = 2.28;
                                    $scope.status = 1;
                                    $scope.progressColor  = 2;
                                    if ($scope.popup) {
                                        $scope.cardPop = '/images/interestSubsidy/zushi-card-pop.png';
                                        $filter('卡升级弹窗')($scope);
                                    }
                                    break;
                                case '至尊卡':
                                    $scope.cardType = '/images/interestSubsidy/top-card.png';
                                    $scope.cardMoney = 500000;//暂无虚拟
                                    if ($scope.popup) {
                                        $scope.cardPop = '/images/interestSubsidy/top-card-pop.png';
                                        $filter('卡升级弹窗')($scope);
                                    }
                                    break;
                            }
                        }
                    }
                    break;
                case '是否认证':
                    if(data.success) {
                        $scope.realVerify = data.map.realVerify;
                    }
                    break;
            }
        });


    }])
})