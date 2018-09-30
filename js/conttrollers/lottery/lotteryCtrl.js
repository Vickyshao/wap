define(['js/module.js'], function (controllers) {
    controllers.controller('lotteryCtrl', function ($scope, $rootScope, $filter, $state, resourceService, ngDialog, $timeout, $localStorage, $location,$stateParams, $interval, isWeixin) {
        $filter('isPath')('lottery');
        $rootScope.title = '白拿iPhone X，京东卡等豪礼';
        $scope.product = {};
        $scope.yuebiao = {};
        // 登录注册
        $scope.myForm2 = {
            hasPhone: false
        };
        $scope.userLoginform2 = {
            hasPhone: false
        };
        $scope.userLogin = {};
        $scope.login = {};
        var luckycodeData = {};
        $scope.passwordText = false;
        $scope.isSubMin = true;
        $scope.submitReservate = true;
        $scope.form = true;
        $scope.nowTimer = "获取验证码";
        $scope.vm = {
            productNum: 1,
            limit: 300
        };
        $("html,body").scrollTop(0);
        $scope.isLogin = $filter('isRegister')().register;
        if($scope.isLogin) {
            $scope.user = $filter('isRegister')().user.member;
        }
        if ($location.$$search.toFrom != undefined || $location.$$search.recommCode != undefined || $location.$$search.tid != undefined) {
            $localStorage.webFormPath = $location.$$search;
        }
        if($stateParams.wap){
            $scope.wap = $stateParams.wap;
        }
        var objData = {
            pageOn:1,
            pageSize: 30
        };
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
        if($rootScope.getUrlParam('source')) {
            $('.lottery').removeClass('headerTop');
            $scope.fromNative = true;
        };
        if($rootScope.fromNative) {
            $('.lottery').removeClass('headerTop');
            objData.uid = $rootScope.getUrlParam('uid');
            objData.token = $rootScope.getUrlParam('token');
        } else{
            if($scope.isLogin) {
                objData.uid = $scope.user.uid;
            }
        }
        $scope.plusNum = '1';
        $scope.subNum = '2';
        $scope.sub = function () {
            if($scope.vm.productNum > 1) {
                $scope.vm.productNum--;
            }
            if($scope.vm.productNum <= 1 ) {
                $scope.subNum = '2';
            }
        }
        $scope.plus = function () {
            if($scope.vm.productNum >= $scope.vm.limit){
                //按钮不可点
                $scope.plusNum = '2';
                return false;
            }else{
                $scope.vm.productNum++;
                $scope.plusNum = '1';
            }
        }
        $scope.$watch('vm.productNum',function(newValue){
            if(newValue <= 1 ) {
                $scope.vm.productNum = 1;
                $scope.subNum = '2';
            }else if(newValue >= $scope.vm.limit) {
                $scope.vm.productNum = $scope.vm.limit;
                $scope.plusNum = '2';
            } else {
                $scope.subNum = '1';
                $scope.plusNum = '1';
            }
        });
        $scope.toback = function() {
            $filter('跳回上一页')();
        };
        $scope.ViewPast = function () {
            $('.lottery-history').slideToggle();
            $('.brower').find('.caret').toggleClass('down');
        }
        // 我的抽奖码
        $scope.showLotteryCode = function () {
            if($rootScope.fromNative) {
                if(objData.uid){
                    if($scope.luckCodes) {
                        document.location = 'hushentomydrawdetail:';
                    } else {
                        $filter('幸运码弹窗')($scope);
                    }
                } else {
                    $scope.userLogin = {};
                    $scope.login = {};
                    $scope.myForm2.hasPhone = false;
                    $scope.userLoginform2.hasPhone = false;
                    $filter('通用登录弹窗')($scope);
                }
            } else {
                if($scope.isLogin){
                    $filter('幸运码弹窗')($scope);
                } else {
                    $scope.userLogin = {};
                    $scope.login = {};
                    $scope.myForm2.hasPhone = false;
                    $scope.userLoginform2.hasPhone = false;
                    $filter('通用登录弹窗')($scope);
                }
            }
        };
        // 重置密码
        $scope.resetPwd = function () {
            if($rootScope.fromNative) {
                // 去忘记密码
                $scope.closeDialog();
                document.location = 'hushenresetpwd:';
            } else {
                $scope.closeDialog();
                $state.go('resetPwd',{forget:true});
            }
        };

        // 预约弹窗
        $scope.reservation = function (item) {
            if ($scope.awardType != 2) {
                $scope.vm.productNum= 1;
                if($rootScope.fromNative) {
                    if($rootScope.getUrlParam('uid')) {
                        if(item.reservation == '0') {
                            $scope.curReservation = item;
                            $filter('预约奖品弹窗')($scope);
                        } else {
                            return false;
                        }
                    } else {
                        $filter('通用登录弹窗')($scope);
                    }
                } else {
                    if($scope.isLogin) {
                        if(item.reservation == '0') {
                            $scope.curReservation = item;
                            $filter('预约奖品弹窗')($scope);
                        } else {
                            return false;
                        }
                    } else {
                        $filter('通用登录弹窗')($scope);
                    }
                }
            }
        };
        // 跳到锚点
        $scope.orderOther = function () {
            $('html, body').animate({scrollTop: $('.reservation').offset().top});
        };
        // 提交预约
        $scope.submitReservation = function () {
            objData.awardId = $scope.curReservation.id;
            if($rootScope.fromNative) {
                objData.uid = $rootScope.getUrlParam('uid');
                objData.token = $rootScope.getUrlParam('token');
            } else {
                objData.uid = $localStorage.user.member.uid;
            }
            objData.count = $scope.vm.productNum;
            resourceService.queryPost($scope, $filter('getUrl')('奖品预约'), objData, { name: '奖品预约' });
        }
        $scope.setItem = function (item) {
            $scope.curHistory = item;
        }
        // 立即抢购
        $scope.nowBuy = function () {
            if($rootScope.fromNative) {
                var nativeParams = {
                    codePrice: $scope.curLotteryInfo.amount,
                    codeCount: $scope.curLotteryInfo.residueCount,
                    pid: $scope.curLotteryInfo.pid
                };
                document.location = 'hushenchoujiang:' + JSON.stringify(nativeParams);
            } else {
                $state.go("lotteryinvest",{pid: $scope.curLotteryInfo.pid});
            }
        }
        $scope.toInvest = function () {
            if($rootScope.fromNative) {
                $scope.closeDialog();
                // 跳到抽奖活动投资详情页
                var nativeParams = {
                    codePrice: $scope.curLotteryInfo.amount,
                    codeCount: $scope.curLotteryInfo.residueCount,
                    pid: $scope.curLotteryInfo.pid
                };
                document.location = 'hushenchoujiang:' + JSON.stringify(nativeParams);
            } else {
                $scope.closeDialog();
                $scope.nowBuy();
            }
        };
        $scope.playVideo = function (src) {
                document.location = 'hushenplayvideo:'+ JSON.stringify(src);
            // if($rootScope.fromNative) {
            //     // 跳到视频详情页面
            // } else {
            //     // 跳到视频详情页面
            //     console.log($(this).attr('href',src));
            // }
        };
        // 分享
        $scope.share = function() {
            if (isWeixin()) {
                $('.activity-tjs-boxweixin').fadeIn(200);
            } else {
                $('.activity-tjs-boxh5').fadeIn(200);
            }
        };
        function IsPC() {
            var userAgentInfo = navigator.userAgent;
            var Agents = ["Android", "iPhone",
                "SymbianOS", "Windows Phone",
                "iPad", "iPod"
            ];
            var flag = true;
            for (var v = 0; v < Agents.length; v++) {
                if (userAgentInfo.indexOf(Agents[v]) > 0) {
                    flag = false;
                    break;
                }
            }
            return flag;
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
        $scope.default = function(e) {
            e.stopPropagation();
        }
        // var scrollTop = -1;
        // $('.lottery-history').hover(function(){
        //     console.log(12)
        //     scrollTop = $(window).scrollTop();
        // }, function(){
        //     scrollTop = -1;
        // });
        // $scope.mouseover = function () {
        //     scrollTop = $(window).scrollTop();
        // }
        // $scope.mouseout = function () {
        //     scrollTop = -1;
        // }
        // $(window).scroll(function(){
        //     scrollTop!==-1 && $(this).scrollTop(scrollTop);
        // })
        /*$(".lottery-history").scroll(function(event) {
            console.log(1)
            $("body").css('overflow-y','hidden')
            event.stopPropagation();

        })*/
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
                            isPic : true
                        }, { name: '获取验证码', tegForm: tegForm });

                    }
                } else{
                    $scope.login.picCode = '';
                    $scope.isImgCode=true;
                    changeIMG();
                    $filter('zuceError')('1012');
                }
            }
        };
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
        // 活动标详情
        resourceService.queryPost($scope, $filter('getUrl')('预约奖品列表'), objData, { name: '预约奖品列表' });
        resourceService.queryPost($scope, $filter('getUrl')('获取抽奖活动的奖品信息'), objData, { name: '获取抽奖活动的奖品信息' });
        resourceService.queryPost($scope, $filter('getUrl')('往期开奖'), {}, { name: '往期开奖' });
        // 活动开奖结果
        resourceService.queryPost($scope, $filter('getUrl')('活动开奖结果'), {}, { name: '活动开奖结果' });
        // var height = $('.news-list').height()/5;
        // var $dataTable = $('.news-list ul');
        $scope.$on('resourceService.QUERY_POST_MYEVENT', function (event, data, type) {
            switch (type.name) {
                case "我的抽奖码":
                    if (data.success) {
                        $scope.luckCodesList = data.map.luckCodesList;
                        if($scope.luckCodesList.length == 0) {
                            $scope.luckCodes = false;
                        } else {
                            $scope.luckCodes = true;
                        }
                    }
                    break;
                case "奖品预约":
                    if (data.success) {
                        $scope.curReservation.clicked =true;
                        resourceService.queryPost($scope, $filter('getUrl')('预约奖品列表'), objData, { name: '预约奖品列表' });
                        resourceService.queryPost($scope, $filter('getUrl')('获取抽奖活动的奖品信息'), objData, { name: '获取抽奖活动的奖品信息' });
                    }
                    break;
                case "获取抽奖活动的奖品信息":
                    if (data.success) {
                        $scope.awardType = data.map.awardType;
                        if (data.map.awardType != 3 ) {
                            $scope.curLotteryInfo = data.map.awardInfo;
                        }
                        if (data.map.currentAward) {
                            $scope.curLotteryInfo = data.map.currentAward;
                        } else if (data.map.activityReward) {
                            $scope.activityReward = data.map.activityReward;
                        }
                        resourceService.queryPost($scope, $filter('getUrl')('抽奖最新动态'), {pageOn:1,pageSize: 30}, { name: '抽奖最新动态' });
                    }
                    break;
                case "往期开奖":
                    if (data.success) {
                        $scope.historyList = data.map.pageInfo.rows;
                        $scope.curHistory = data.map.pageInfo.rows[0];
                    }
                    break;
                case "预约奖品列表":
                    if (data.success) {
                        $scope.reservationList = data.map.pageInfo.rows;
                        angular.forEach($scope.reservationList,function(item){
                            item.clicked = false;
                        });
                    }
                    break;
                case "抽奖最新动态":
                    if (data.success) {
                        if(data.map.pi != null) {
                            $scope.newTrends = data.map.pi.rows;
                            if($scope.newTrends) {
                                // 列表数据轮动
                                var $infos = $('.news-list ul');
                                if ($scope.newTrends.length > 3) {
                                    setInterval(function () {
                                        $infos.animate({ 'margin-top': '-4rem' }, 1000, function () {
                                            $infos.find('li').eq(0).appendTo($infos);
                                            $infos.css('margin-top', 0);
                                        });
                                    }, 3000);
                                }
                            }
                        }
                        if($scope.curLotteryInfo) {
                            luckycodeData.pid = $scope.curLotteryInfo.pid;
                        };
                        if($rootScope.fromNative) {
                            luckycodeData.uid = $rootScope.getUrlParam('uid');
                            luckycodeData.token = $rootScope.getUrlParam('token');
                            // 得到id 获取幸运码
                            resourceService.queryPost($scope,$filter('getUrl')('我的抽奖码'),luckycodeData,{name: '我的抽奖码'});
                        } else {
                            if($scope.isLogin) {
                                luckycodeData.uid= $localStorage.user.member.uid;
                                resourceService.queryPost($scope,$filter('getUrl')('我的抽奖码'),luckycodeData,{name: '我的抽奖码'});
                            }
                        }
                    }
                    break;
                case "活动开奖结果":
                    if (data.success) {
                        $scope.current = data.map.current[0];
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
                        }
                        $scope.closeDialog();
                    } else {
                        type.tegForm.smsCode.$invalid = true;
                        type.tegForm.smsCode.$dirty = true;
                        $scope.login.smsCode = '';
                        $scope.login.passWord = '';
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
            }
        });
        $scope.showRule = function(){
            $('.rule').fadeIn(200);
        }
        $scope.closeRule = function(){
            $('.rule').fadeOut(200);
        }
        $scope.gotoDetail = function (id) {
            if ($stateParams.wap) {
                $state.go('activityPerson', { id: id, wap: true });
            } else {
                $state.go('activityPerson', { id: id });
            }
        };
        $scope.gotop = function () {
            $("html,body").animate({ scrollTop: 0 });
        };
    });
})

