define(['js/module.js'], function (controllers) {
    controllers.controller('zdShareCtrl', function ($scope, $rootScope, $filter, $state, resourceService, ngDialog, $timeout, $localStorage, $location,$stateParams, $interval, isWeixin) {
        $filter('isPath')('myTeam');
        $rootScope.title = '大吉大利 组队夺“金”';
        $scope.product = {};
        $scope.yuebiao = {};
        $scope.isShowRule = false;
        $scope.isSubMin = true;
        $scope.teamNum = 5;
        $scope.isAddTeam = false;
        $scope.tel = $stateParams.tel;
        $scope.teamId = $stateParams.teamId;
        $scope.recommCode = $stateParams.recommCode;
        $scope.activityCode = 'zudui';
        $scope.rewardList = [
            {
                teamReward: 10000,
                topReward: 200
            },{
                teamReward: 8000,
                topReward: 100
            },{
                teamReward: 5000,
                topReward: 100
            },{
                teamReward: 3000,
                topReward: 100
            },{
                teamReward: 2000,
                topReward: 50
            },{
                teamReward: 1000,
                topReward: 50
            },{
                teamReward: 1000,
                topReward: 50
            },{
                teamReward: 1000,
                topReward: 50
            },{
                teamReward: 1000,
                topReward: 50
            },{
                teamReward: 1000,
                topReward: 50
            }
        ];
        $scope.rule = [
            {
                num:1,
                text: '活动期间，累计年化投资额最高的前10名战队可获得现金奖励',
                info: '奖励：个人奖励=个人年化投资总额/战队年化投资总额*奖励总额；'
            },{
                num:2,
                text: '活动期间，累计年化投资额最高的前10名战队可获得现金奖励'
            },{
                num:3,
                text: '活动期间，累计年化投资额最高的前10名战队可获得现金奖励'
            },{
                num:4,
                text: '活动期间，累计年化投资额最高的前10名战队可获得现金奖励'
            },{
                num:5,
                text: '活动期间，累计年化投资额最高的前10名战队可获得现金奖励'
            },{
                num:6,
                text: '活动期间，累计年化投资额最高的前10名战队可获得现金奖励'
            },{
                num:7,
                text: '活动期间，累计年化投资额最高的前10名战队可获得现金奖励'
            },
        ]
        $scope.userLogin = {};
        $scope.showMoreTeam = function () {
            if ($scope.teamNum == 5){
                $scope.teamNum = 10;
            } else {
                $scope.teamNum = 5;
            }
        };
        $scope.toLogin = function () {
            if($rootScope.fromNative) {
                document.location='hushentologin:';
            } else {
                $state.go('dl',{returnurl: 'zdActivity'});
            }
        };
        $scope.showZdRule = function () {
            $filter('活动规则弹窗')($scope);
        };
        $("html,body").scrollTop(0);
        $scope.isLogin = $filter('isRegister')().register;
        if($scope.isLogin) {
            $scope.user = $filter('isRegister')().user.member;
        }

        $scope.next = function (tegForm) {
            if (tegForm.mobilephone.$error.required == true) {
                $filter('zuceError')('1001');
                return false;
            }
            else if (tegForm.mobilephone.$valid == false) {
                $filter('zuceError')('1002');
                return false;
            }
            if (!tegForm.mobilephone.$error.required && !tegForm.mobilephone.$error.minlength && !tegForm.mobilephone.$error.pattern) {
                resourceService.queryPost($scope, $filter('getUrl')('邀请好友'), {
                    mobilePhone: $scope.login.mobilephone,
                    activityCode: $scope.activityCode,
                    teamId: $scope.teamId,
                    recommCode: $scope.recommCode
                }, { name: '邀请好友验证', tegForm: tegForm });
            };
            changeIMG();

            // $scope.sendMessage(tegForm);
        };
        $scope.getyzm = function (tegForm) {
            // targetFrom = tegForm;
            if ($scope.isSubMin == true) {
                if(tegForm.picCode.$invalid){
                    $filter('zuceError')('1015');
                    return;
                } else if($scope.isImgCode==true){
                    if($scope.validate(tegForm,1)){
                        resourceService.queryPost($scope, $filter('getUrl')('getyzm'), {
                            mobilephone: $scope.login.mobilephone,
                            picCode: $scope.login.picCode,
                            // 有图形码时设置isPic为true，没有不设置
                            isPic : true
                        }, { name: '获取验证码', tegForm: tegForm });

                    }
                } else{
                    $scope.login.picCode = '';
                    $scope.isImgCode=true;
                    changeIMG();
                    $filter('zuceError')('1012');
                }


                if($rootScope.maskError) {
                    setTimeout(function () {
                        $rootScope.maskError = false;
                    }, 1500);
                }

            }
        };
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
                        $scope.login.teamId = $scope.teamId;
                        $scope.login.activityCode = $scope.activityCode;
                        $scope.login.recommCode = $scope.recommCode;
                        resourceService.queryPost($scope, $filter('getUrl')('zuce'), $scope.login, { name: '注册', tegForm: tegForm });
                    }
                }
            } else {
                $scope.validate(tegForm,0);
            }
        }




        // 登录注册
        $scope.myForm2 = {
            hasPhone: false
        };
        $scope.userLoginform2 = {
            hasPhone: false
        };

        $scope.login = {};
        var luckycodeData = {};
        $scope.passwordText = false;

        $scope.submitReservate = true;
        $scope.form = true;
        $scope.nowTimer = "获取验证码";

        if ($location.$$search.toFrom != undefined || $location.$$search.recommCode != undefined || $location.$$search.tid != undefined) {
            $localStorage.webFormPath = $location.$$search;
        }
        if($stateParams.wap){
            $scope.wap = $stateParams.wap;
        }
        if($rootScope.getUrlParam('source')) {
            $('.lottery').removeClass('headerTop');
            $scope.fromNative = true;
        };
        /*if($rootScope.fromNative) {
            $('.lottery').removeClass('headerTop');
            objData.uid = $rootScope.getUrlParam('uid');
            objData.token = $rootScope.getUrlParam('token');
        } else{
            if($scope.isLogin) {
                // objData.uid = $scope.user.uid;
            }
        }*/

        $scope.toback = function() {
            $filter('跳回上一页')();
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

        // $scope.hasPhone = false;
        $scope.picCodeMsg = '请检查图形验证码是否正确';

        // flag = 0表示立即领取  flag = 1 表示获取验证码
        $scope.validate = function(tegForm, flag){
            if (tegForm.mobilephone.$error.required == true) {
                tegForm.mobilephone.$invalid = true;
                tegForm.mobilephone.$dirty = true;
                return false;
            }
            else if (tegForm.mobilephone.$valid == false) {
                tegForm.mobilephone.$invalid = true;
                tegForm.mobilephone.$dirty = true;
                return false;
            }
            else if ($scope.userLoginform2.hasPhone == true && flag == 1) {
                tegForm.mobilephone.$invalid = true;
                tegForm.mobilephone.$dirty = true;
                return false;
            }
            else if (tegForm.picCode.$error.required == true) {
                tegForm.picCode.$invalid = true;
                tegForm.picCode.$dirty = true;
                return false;
            }
            else if (tegForm.smsCode.$error.required == true && flag == 0) {
                tegForm.smsCode.$invalid = true;
                tegForm.smsCode.$dirty = true;
                tegForm.smsCode = '';
                return false;
            }
            else if (tegForm.passWord.$error.required == true && flag == 0) {
                tegForm.passWord.$invalid = true;
                tegForm.passWord.$dirty = true;
                tegForm.passWord = '';
                return false;
            }
            else if (tegForm.passWord.$valid == false && flag == 0) {
                tegForm.passWord.$invalid = true;
                tegForm.passWord.$dirty = true;
                return false;
            }
            return true;
        };
        $scope.loginHasPhoneTip = '请检查手机号是否正确';
        $scope.registerHasPhoneTip = '请检查手机号是否正确';
        $scope.pwdTip = '请输入6-16位字母数字混合密码';

        $scope.changePwd = function (event) {
            event.target.type = 'passWord';
        }
        // 点击登录
        $scope.sbmit = function (tegForm) {
            resourceService.queryPost($scope, $filter('getUrl')('login'), $scope.userLogin, { name: 'login', tegForm: tegForm });
        }
        // 排行榜

        resourceService.queryPost($scope, $filter('getUrl')('排行榜'), {}, { name: '排行榜' });
        // var height = $('.news-list').height()/5;
        // var $dataTable = $('.news-list ul');
        $scope.$on('resourceService.QUERY_POST_MYEVENT', function (event, data, type) {
            switch (type.name) {
                case "排行榜":
                    if (data.success) {
                        $scope.teamList = data.map.list;
                        $scope.teamList.forEach(function(item,index,array){
                            item.teamReward = $scope.rewardList[index].teamReward;
                            item.topReward = $scope.rewardList[index].topReward;
                        });
                    }
                    break;
                case "邀请好友验证":
                    if (data.errorCode == 3333) {    // 您目前尚未注册,请先注册！
                        $scope.hasPhone = false;
                        $scope.form = !$scope.form;
                    } else if (data.errorCode == 2222) {           // 您已加入过战队了,不能重复加入,请下载APP查看您的战队！
                        $scope.isAddTeam = true;
                    } else if (data.errorCode == 0000) {               // 恭喜你成为队长！
                        $state.go('zdShareResult',{ pos: 'leader' });
                    }
                    break;
                case '获取验证码':
                    if (data.success==true) {
                        $filter('60秒倒计时')($scope, 120);
                        $scope.isImgCode=false;
                        $filter('zuceError')('1013');
                    } else if(data.errorCode == '1006'){
                        ngDialog.open({
                            template: '<p class="error-msg">' + data.errorMsg+ '</p>',
                            showClose: false,
                            closeByDocument: false,
                            plain: true
                        });
                        setTimeout(function () {
                            ngDialog.closeAll();
                        }, 1000);
                    } else {
                        $filter('手机短信验证错误')(type.tegForm, data.errorCode);
                    }
                    break;
               /* case '注册验证手机号':
                    if (data.success) {
                        if (data.map.exists) { //已有用户名
                            $state.go('zdLeader')
                        } else {
                            if(type.tegForm.$name == 'myForm') {
                                $scope.myForm2.hasPhone = false;
                            } else {
                                $scope.userLoginform2.hasPhone = true;
                                $scope.loginHasPhoneTip = '请检查手机号是否已注册';
                            }
                        };
                    }
                    break;*/
                case '验证图形码':
                    if (data.success) {
                        $filter('60秒倒计时')($scope, 120);
                        $scope.isImgCode=false;
                        $filter('zuceError')('1013');
                    } else if(data.errorCode == '1006'){
                        ngDialog.open({
                            template: '<p class="error-msg">' + data.errorMsg+ '</p>',
                            showClose: false,
                            closeByDocument: false,
                            plain: true
                        });
                        setTimeout(function () {
                            ngDialog.closeAll();
                        }, 1000);
                    } else {
                        // $scope.stop();
                        $filter('手机短信验证错误')(type.tegForm, data.errorCode);
                    }
                    break;
                case '注册':
                    isSub = true;
                    if (data.success) {
                        $localStorage.user = data.map;
                        ngDialog.open({
                            template: '<p class="error-msg">' + '注册成功'+ '</p>',
                            showClose: false,
                            closeByDocument: false,
                            plain: true
                        });
                        setTimeout(function () {
                            ngDialog.closeAll();
                            $state.go('zdShareResult',{ pos: 'member' });
                        }, 1000);


                        // document.location = "hushen:" +  JSON.stringify(data.map);
                    } else {
                        $filter('serverZuceError')(type.tegForm, data.errorCode);
                        $scope.login.passWord = '';
                    };
                    break;
            }
        });
    }).controller('zdShareResultCtrl', function ($scope, $rootScope, $filter, $state, resourceService, ngDialog, $timeout, $localStorage, $location,$stateParams, $interval, isWeixin) {
        $filter('isPath')('zdShareResult');
        $rootScope.title = '大吉大利 组队夺“金”';
        $scope.pos = $stateParams.pos;
        $scope.massage = {};
        if ($scope.pos == 'leader') {
            $scope.massage.img = '/images/zudui/share/zd-leader.png';
            $scope.massage.text = '恭喜您，已获得队长特权';
            $scope.massage.topText = '您已注册';
            $scope.isShow = true;
        } else {
            $scope.massage.img = '/images/zudui/share/zd-member.png';
            $scope.massage.text = '成功加入战队！';
            $scope.massage.topText = '您已注册';
            $scope.isShow = false;
        }
    });
})

