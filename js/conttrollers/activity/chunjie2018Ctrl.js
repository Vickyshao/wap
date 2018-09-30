define(['jweixin', 'js/module.js', 'jquery', 'ngdialog', 'SHR256'], function (wx, controllers, $, ngdialog, SHR256, weixin) {
    controllers.controller('chunjie2018Ctrl', ['$scope', '$rootScope', 'resourceService', '$filter', '$state', 'ngDialog', '$location', 'md5', '$localStorage', '$stateParams', 'isWeixin', function ($scope, $rootScope, resourceService, $filter, $state, ngDialog, $location, md5, $localStorage, $stateParams, isWeixin) {
        $("html,body").scrollTop(0);
        $filter('isPath')('chunjie2018');
        $rootScope.title = '新年礼“财”高八斗，节节高升';
        $rootScope.title1 = '请先注册';
        $rootScope.title2 = '请先登录';
        $scope.isShowPicCode = false;
        $scope.isInActivityTime = true;
        $scope.login = {};
        $scope.userLogin = {};
        $scope.uid = $rootScope.getUrlParam('uid');
        $scope.token = $rootScope.getUrlParam('token');
        $scope.isLogin = $filter('isRegister')().register;
        if($scope.isLogin) {
            $scope.uid = $filter('isRegister')().user.member.uid;
        }
        if($rootScope.fromNative) {
            if($scope.uid && $scope.token) {
                $scope.isLogin = true;
            }
        }
        $scope.top10 = false;
        if(!$scope.isLogin) {
            $scope.top10 = true;
        }
        $scope.isShow = false;
        $scope.amount = 10000;
        $scope.time = 30;
        $scope.timeClass = 'time30';
        $scope.isShowInput = true;
        // 登录注册
        $scope.myForm2 = {
            hasPhone: false
        };
        $scope.userLoginform2 = {
            hasPhone: false
        };
        $scope.passwordText = false;
        $scope.isSubMin = true;
        $scope.submitReservate = true;
        $scope.form = true;
        $scope.nowTimer = "获取验证码";

        var objData = {};
        if($rootScope.fromNative) {
            $('.chunjie2018').removeClass('headerTop');
            objData.uid = $rootScope.getUrlParam('uid');
            objData.token = $rootScope.getUrlParam('token');
            if (objData.uid) {
                $scope.isShow = true;
            }
        } else{
            if($scope.isLogin) {
                objData.uid = $filter('isRegister')().user.member.uid;
            }
        }
        // 去投资按钮
        $scope.toInvestIng = function () {
            ngDialog.closeAll();
            if($rootScope.fromNative) {
                if($scope.isLogin) {
                    document.location = 'hushenlist:';
                } else {
                    $filter('通用登录弹窗')($scope);
                }
            } else {
                if($scope.isLogin) {
                    $state.go('main.bankBillList');
                } else {
                    $filter('通用登录弹窗')($scope);
                }
            }
        }
        $scope.showNewYearRule = function () {
            $filter('春节活动规则弹窗')($scope);
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
        // 春节活动计算器
        $scope.changeTime = function (time) {
            $scope.time = time;
            $scope.timeClass = 'time' + time;
        };
        $scope.calculator = function () {
            $filter('春节活动计算器')($scope);
        };
        $scope.reciveAward = function (item) {
            if($scope.isLogin) {
                if(item.status != '1') {
                    $scope.curAward = item;
                    $filter('春节活动奖品弹框')($scope);
                }
            } else {
                $filter('通用登录弹窗')($scope);
            }
        };

        // 分享
        $scope.share = function() {
            if (isWeixin()) {
                $('.activity-tjs-boxweixin').fadeIn(200);
            } else {
                $('.activity-tjs-boxh5').fadeIn(200);
            }
        };
        $scope.copyShare = function() {
            var e = document.getElementById("shareurl"); //对象是contents
            e.select(); //选择对象
            document.execCommand("Copy");
            $scope.isCopy = true;
            if (IsPC()) {
                $scope.isCopytext = '链接已复制';
            } else {
                $scope.isCopytext = '长按文字全选复制链接';
            }
        };
        $scope.closeshare = function() {
            $('.activity-tjs-boxh5').fadeOut(200);
        }
        $scope.toback = function() {
            $filter('跳回上一页')(2);
        };
        $scope.default = function(e) {
            e.stopPropagation();
        }
        $scope.closeshareweixin = function() {
            $('.activity-tjs-boxweixin').fadeOut(200);
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
                }else{
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
        $scope.awardParam = {
            pageOn:1,
            pageSize: 100
        }
        if($scope.isLogin){
            $scope.awardParam.uid = $scope.uid;
            $scope.awardParam.token = $scope.token;
        }
        resourceService.queryPost($scope, $filter('getUrl')('春节投资排行'),$scope.awardParam, { name: '春节投资排行' });
        resourceService.queryPost($scope, $filter('getUrl')('春节活动个人投资信息'),$scope.awardParam, { name: '春节活动个人投资信息' });
        resourceService.queryPost($scope, $filter('getUrl')('奖品列表'),$scope.awardParam, { name: '奖品列表' });
        resourceService.queryPost($scope, $filter('getUrl')('春节中奖记录'),$scope.awardParam, { name: '春节中奖记录' });
        var $table = $(".notice table");
        $scope.$on('resourceService.QUERY_POST_MYEVENT', function (event, data, type) {
            switch (type.name) {
                case '奖品列表':
                    if(data.success) {
                        $scope.awardLists = data.map.awardList;
                        $scope.awardList1 = [$scope.awardLists[0],$scope.awardLists[1],$scope.awardLists[2]]
                        $scope.awardLists = $scope.awardList1.concat($scope.awardLists[5],$scope.awardLists[4],$scope.awardLists[3]);
                    }
                    break;
                case '春节活动个人投资信息':
                    if(data.success) {
                        $scope.myInfo = data.map;
                        $scope.isInActivityTime = data.map.isInActivityTime;
                    }
                break;
                case '春节中奖记录':
                    if(data.success) {
                        $scope.awardRecardList = data.map.pageData.rows;
                        if ($scope.awardRecardList.length > 2) {
                            setInterval(function() {
                                $table.animate({'margin-top':'-2rem'},500,function() {
                                    $table.find('tr').eq(0).appendTo($table);
                                    $table.css('margin-top',0);
                                })
                            },5000);
                        }

                    }
                    break;
                case '春节投资排行':
                    if(data.success) {
                        $scope.rankList = data.map.rankList;
                        $scope.rankListlist1 = [$scope.rankList[0],$scope.rankList[1],$scope.rankList[2]];
                        $scope.rankListlist = [$scope.rankList[3],$scope.rankList[4],$scope.rankList[5],$scope.rankList[6],$scope.rankList[7],$scope.rankList[8],$scope.rankList[9]]
                        angular.forEach($scope.rankListlist1,function (value,index) {
                            value.isYouSelf = false;
                            value._index = index;
                            if(value.uid == $scope.uid) {
                                $scope.rankListlist1[index].isYouSelf = true;
                                $scope.top10 = true;
                            }
                        })
                        angular.forEach($scope.rankListlist,function (value,index) {
                            value.isYouSelf =false;
                            value._index = index;
                            if(value.uid == $scope.uid) {
                                $scope.rankListlist[index].isYouSelf = true;
                                $scope.top10 = true;
                            }
                            if(index >=0 && index<2) {
                                $scope.rankListlist[index].awardName = '京东卡800元';
                            } else if(index >=2 && index<4) {
                                $scope.rankListlist[index].awardName = '京东卡500元';
                            } else {
                                $scope.rankListlist[index].awardName = '京东卡300元';
                            }
                        })
                    }
                    break;
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
                            $scope.uid = $scope.awardParam.uid = $localStorage.user.member.uid;
                            resourceService.queryPost($scope, $filter('getUrl')('春节活动个人投资信息'),$scope.awardParam, { name: '春节活动个人投资信息' });
                            resourceService.queryPost($scope, $filter('getUrl')('奖品列表'),$scope.awardParam, { name: '奖品列表' });
                            resourceService.queryPost($scope, $filter('getUrl')('春节投资排行'),$scope.awardParam, { name: '春节投资排行' });
                        }
                        $scope.closeDialog();
                    } else {
                        type.tegForm.smsCode.$invalid = true;
                        type.tegForm.smsCode.$dirty = true;
                        $scope.login.smsCode = '';
                        $scope.login.passWord = '';
                        $scope.isShowPicCode = true;
                        changeIMG();
                        $scope.stop($scope);
                    };
                    break;
                case 'login':
                    if (data.success) {
                        if($rootScope.fromNative) {
                            document.location = "hushenloginsuccess:" +  JSON.stringify(data);
                        } else {
                            $localStorage.user = data.map;
                            $scope.isLogin = $filter('isRegister')().register;
                            $scope.uid = $scope.awardParam.uid = $localStorage.user.member.uid;
                        }
                        resourceService.queryPost($scope, $filter('getUrl')('春节活动个人投资信息'),$scope.awardParam, { name: '春节活动个人投资信息' });
                        resourceService.queryPost($scope, $filter('getUrl')('奖品列表'),$scope.awardParam, { name: '奖品列表' });
                        resourceService.queryPost($scope, $filter('getUrl')('春节投资排行'),$scope.awardParam, { name: '春节投资排行' });
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
            };
        });
    }])
})