define(['jweixin', 'js/module.js', 'jquery', 'ngdialog', 'SHR256'], function (wx, controllers, $, ngdialog, SHR256, weixin) {
    controllers.controller('enfuActivityCtrl', ['$scope', '$rootScope', 'resourceService', '$filter', '$state', 'ngDialog', '$location', 'md5', '$localStorage', '$stateParams', function ($scope, $rootScope, resourceService, $filter, $state, ngDialog, $location, md5, $localStorage, $stateParams) {
        $('body').scrollTop(0);
        $filter('isPath')('enfu');
        $scope.toFrom = $rootScope.getUrlParam('toFrom');
        $rootScope.title = '沪深理财-网贷投资，国企控股平台';
        $scope.welcom =false;
        $scope.login = {};
        $scope.isLogin = $filter('isRegister')().register;
        $scope.user = $filter('isRegister')().user.member;
        $scope.isShowBack = false;
        var objData = {};
        if($scope.isLogin) {
            $scope.welcom = true;
            $scope.isLoginUser = true;
        }
        // 判断是否显示返回按钮
        if ($state.params.source) {
            $scope.isShowBack = true;
        }
        // 判断是否登录
        if ($state.params.token && $state.params.uid) {
            $scope.isLoginUser = true;
            $scope.isShowBack = true;
        }
        if($rootScope.fromNative) {
            $('.enfu-act-wrap').removeClass('headerTop');
            objData.uid = $rootScope.getUrlParam('uid');
            objData.token = $rootScope.getUrlParam('token');
        } else{
            if($scope.isLogin) {
                objData.uid = $scope.user.uid;
            }
        }
        $scope.recommPhoneNum = $stateParams.recommCode;
        $scope.mobilePhone = $stateParams.mobilePhone;
        if($localStorage.user) {
            $scope.inviteMobilePhone = $localStorage.user.member.mobilephone;
        }
        if( $stateParams.realName) {
            $scope.realName = $stateParams.realName;
        }
        $scope.showdownload = true;
        if ($localStorage.webFormPath != undefined) {
            if ($localStorage.webFormPath.recommCode != undefined) {
                $scope.login.recommPhone = $localStorage.webFormPath.recommCode;
            };
            if ($localStorage.webFormPath.toFrom != undefined) {
                $scope.login.toFrom = $localStorage.webFormPath.toFrom;
            };
            if ($localStorage.webFormPath.tid != undefined) {
                $scope.login.tid = $localStorage.webFormPath.tid;
            };
        };
        $scope.webFormPath = $localStorage.webFormPath;
        if ($location.$$search) {
            $localStorage.webFormPath = $location.$$search;
            $scope.webFormPath = $location.$$search;
        }
        $scope.toLogin = function () {
            $state.go('dl',{toFrom: $stateParams.toFrom});
        };
        if ($scope.webFormPath.toFrom != undefined) {
            $scope.login.toFrom = $scope.webFormPath.toFrom;
        }
        if ($scope.webFormPath.recommCode != undefined) {
            $scope.login.recommPhone = $scope.webFormPath.recommCode;
        }
        if ($scope.webFormPath.tid != undefined) {
            $scope.login.tid = $scope.webFormPath.tid;
        }
        if ($stateParams.myToFrom != '' && $stateParams.myToFrom != null) {
            $scope.login.toFrom = $stateParams.myToFrom;
        }
        if ($stateParams.maskType != '' || $stateParams.maskType != undefined) {
            $localStorage.maskType = $stateParams.maskType;
        }

        // 活动规则（流量银行）
        var ruleHeight = $('.rule-box').height();
        var ruleheaderHeight = $('.rule-box').find('h1').outerHeight();
        $('.rule-box').height(ruleheaderHeight);
        $scope.ruleShow=false;
        $scope.ruleCtrl = function(){
            if($scope.ruleShow==true){
                $scope.ruleShow=false;
                $('.rule-box').animate({
                    height:ruleheaderHeight
                },300);
                $('.rule-box').find('img').css({
                    transform: 'rotate(0deg)'
                });
            }
            else{
                $scope.ruleShow=true;
                $('.rule-box').animate({
                    height:ruleHeight
                },300);
                $('.rule-box').find('img').css({
                    transform: 'rotate(180deg)'
                });
                $('html,body').animate({ scrollTop: $('.rule-box').offset().top });
            };
        }
        //流量银行弹框
        setTimeout(function () {
            $("#div1").hide();
            $("#div2").hide();
        }, 2000);

        $scope.gotop = function () {
            $("html,body").animate({ scrollTop: $(".billGift").offset().top });
        };
        $scope.toReceive = function () {
            if($rootScope.fromNative) {
                document.location = 'hushenlicaiyouhuiquan:';
            } else {
                if(!($scope.isLogin)){
                    $('.list1 a').attr('href','/zhuce');
                } else {
                    $('.list1 a').attr('href','/myCoupon');
                }
            }
        }

        // 列表页立即投资
        $scope.toInvestList = function () {
            if($rootScope.fromNative) {
                document.location = 'hushenlist:';
            } else {
                if(!($scope.isLogin)){
                    $('.list2 a').attr('href','/zhuce');
                } else {
                    $('.list2 a').attr('href','/main/bankBillList');
                }
            }
        }
        $scope.firstInvest = function () {
            if($scope.newHandInvested) {
                ngDialog.open({
                    template: '<p class="error-msg">仅限新用户首次投资，每位限投一次。</p>',
                    showClose: false,
                    closeByDocument: false,
                    plain: true
                });
                setTimeout(function () {
                    ngDialog.closeAll();
                }, 1000);

            } else {
                $state.go('cpDetail',{pid: $scope.newhand.id});
            }
        }
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
        $scope.passwordText = false;
        $scope.isSubMin = true;
        $scope.nowTimer = "获取验证码";
        var isSub = true;
        var changePicEvent;
        $scope.isImgCode = true;
        $scope.zuce = function (tegForm) {
            $scope.login.checkbox = true;
            $scope.login.activityCode = 'enfu';
            if ($scope.login.recommPhone === undefined) {
                delete $scope.login.recommPhone;
            };
            if ($scope.login.toFrom === undefined) {
                delete $scope.login.toFrom;
            };
            if (tegForm.$valid) {
                if ($scope.login.passWord.length > 5) {
                    if (isSub) {
                        isSub = false;
                        resourceService.queryPost($scope, $filter('getUrl')('zuce'), $scope.login, { name: '注册', tegForm: tegForm });
                    }
                }
            } else {
                $scope.validate(tegForm,0);
            }
        }
        $scope.getyzm = function (tegForm) {
            if ($scope.isSubMin == true) {
                if(tegForm.picCode.$invalid){
                    $filter('zuceError')('1015');
                    return;
                } else if($scope.isImgCode==true){
                    if($scope.validate(tegForm,1)){
                        resourceService.queryPost($scope, $filter('getUrl')('getyzm'), {
                            mobilephone: $scope.login.mobilephone,
                            picCode: $scope.login.picCode,
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

        $scope.form = true;
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
                resourceService.queryPost($scope, $filter('getUrl')('注册验证手机号'), {
                    mobilePhone: $scope.login.mobilephone
                }, { name: '注册验证手机号', tegForm: tegForm });
            };
            changeIMG();

            // $scope.sendMessage(tegForm);
        };
        // flag = 0表示立即领取  flag = 1 表示获取验证码
        $scope.validate = function(tegForm, flag){
            if ($scope.hasPhone == true) {
                $filter('zuceError')('1003');
                return false;
            }
            else if (tegForm.picCode.$error.required == true) {
                $filter('zuceError')('1004');
                return false;
            }
            else if (tegForm.smsCode.$error.required == true && flag == 0) {
                $filter('zuceError')('1006');
                $scope.login.smsCode = '';
                return false;
            }
            else if (tegForm.passWord.$error.required == true && flag == 0) {
                $filter('zuceError')('1010');
                $scope.login.passWord = '';
                return false;
            }
            else if (tegForm.passWord.$valid == false && flag == 0) {
                $filter('zuceError')('1011');
                return false;
            }
            return true;
        };
        /*焦点进入与离开*/
        /*$scope.blurID = function (code, tegForm) {
            if (!tegForm.mobilephone.$error.required && !tegForm.mobilephone.$error.minlength && !tegForm.mobilephone.$error.pattern) {
                resourceService.queryPost($scope, $filter('getUrl')('getPhone'), {
                    mobilephone: $scope.login.mobilephone
                }, { name: '注册验证手机号', tegForm: tegForm });
            };
            changeIMG();
        };*/
        $scope.showEnfuRule = function () {
            $filter('恩弗规则弹框')($scope);
        }

        var obj = {};
        var $table = $(".w-pullNewWrap .table-wrap .get-table ");
        if ($scope.user) { obj.uid = $scope.user.uid; }
        resourceService.queryPost($scope, $filter('getUrl')('shouYe'), obj, { name: 'index' });
        resourceService.queryPost($scope, $filter('getUrl')('sem288推广页h5'),{}, { name: 'sem288推广页h5' });
        $scope.$on('resourceService.QUERY_POST_MYEVENT', function (event, data, type) {
            switch (type.name) {
                case 'index':
                    $scope.index = data.map;
                    $scope.newHandInvested = data.map.newHandInvested;
                    $scope.newhand = data.map.newHand;
                    break;
                case 'sem288推广页h5':
                    $scope.peoples = data.map;
                    $scope.peopleList = data.map.list;
                    if ($scope.peopleList.length > 6) {
                        setInterval(function() {
                            $table.animate({'margin-top':'-2rem'},500,function() {
                                $table.find('tr').eq(0).appendTo($table);
                                $table.css('margin-top',0);
                            })
                        }, 5000);
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
                        // $scope.stop();
                        $filter('手机短信验证错误')(type.tegForm, data.errorCode);
                    }
                    break;
                case '注册验证手机号':
                    if (data.errorCode == 2222) { //已注册过,不能参与当前活动
                        $scope.hasPhone = true;
                        $filter('zuceError')('1003');
                    }
                    else if (data.errorCode == 3333) {//尚未注册
                        $scope.hasPhone = false;
                        $scope.form = !$scope.form;
                        $scope.userPhone = $scope.login.mobilephone;
                    }
                    else if (data.errorCode == 0000) {//请下载APP登录参与恩弗教育 已是恩弗用户
                        $scope.hasPhone = true;
                        $filter('zuceError')('1003');
                    }
                    break;
                case '注册':
                    isSub = true;
                    $scope.platform = $rootScope.getUrlParam('platform');
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
                        }, 1000);
                        // _hmt.push(['_trackPageview', '/maidian/zccg']);
                        _hmt.push(['_trackPageview', '/mian/myCoupon']);
                        $scope.platform = $rootScope.getUrlParam('platform');
                        $rootScope.platform = $scope.platform;
                        $state.go('enfuRegSuccess');

                        // document.location = "hushen:" +  JSON.stringify(data.map);
                    } else {
                        $filter('serverZuceError')(type.tegForm, data.errorCode);
                        $scope.login.passWord = '';
                    };
                    break;
            };
        });
        $scope.closedownload = function(){
            $scope.showdownload = false;
            $('.mainc').css('margin-bottom',0);
        }
        $scope.toback = function() {
            $filter('跳回上一页')(2);

        };
        var browser = {
            versions: function() {
                var u = navigator.userAgent,
                    app = navigator.appVersion;
                return { //移动终端浏览器版本信息
                    trident: u.indexOf('Trident') > -1, //IE内核
                    presto: u.indexOf('Presto') > -1, //opera内核
                    webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
                    gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //火狐内核
                    mobile: !!u.match(/AppleWebKit.*Mobile.*/) || !!u.match(/AppleWebKit/), //是否为移动终端
                    ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
                    android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或者uc浏览器
                    iPhone: u.indexOf('iPhone') > -1 || u.indexOf('Mac') > -1, //是否为iPhone或者QQHD浏览器
                    iPad: u.indexOf('iPad') > -1, //是否iPad
                    webApp: u.indexOf('Safari') == -1 //是否web应该程序，没有头部与底部
                };
            }(),
            language: (navigator.browserLanguage || navigator.language).toLowerCase()
        }
        function isWeiXin(){
            var ua = window.navigator.userAgent.toLowerCase();
            if(ua.match(/MicroMessenger/i) == 'micromessenger'){
                return true;
            }else{
                return false;
            }
        }
        $scope.downloadclick=function(){
            if (isWeiXin()){
                if (browser.versions.ios || browser.versions.iPhone || browser.versions.iPad) {
                    $('.share-ios').fadeIn(200);
                } else {
                    $('.share-android').fadeIn(200);
                }
            } else if (browser.versions.ios || browser.versions.iPhone || browser.versions.iPad) {
                window.location.href = "https://itunes.apple.com/us/app/ju-sheng-cai-fu/id1171321616?mt=8";

            } else if (browser.versions.android) {
                window.location.href = "http://a.app.qq.com/o/simple.jsp?pkgname=com.jscf.js_app";
            } else {
                window.location.href = "https://hushenlc.cn/js_app.apk";
            }
        };
        $scope.closethis=function(){
            $('.share-ios,.share-android').fadeOut(200);
        };
    }])
        .controller('enfuCourcesCtrl', ['$scope', '$rootScope', 'resourceService', '$filter', '$state', 'ngDialog', '$location', 'md5', '$localStorage', '$stateParams', function ($scope, $rootScope, resourceService, $filter, $state, ngDialog, $location, md5, $localStorage, $stateParams) {
            document.getElementsByTagName('html')[0].scrollTop = 0;
            document.getElementsByTagName('body')[0].scrollTop = 0;
            $scope.toback = function() {
                $filter('跳回上一页')();
            };
            /*if ($state.params.token && $state.params.uid) {
                $scope.isLoginUser = true;
            }*/
            if($rootScope.fromNative) {
                $('.enfu-act-wrap').removeClass('headerTop');
            }

        }])
        .controller('enfuInvestSucCtrl', ['$scope', '$rootScope', 'resourceService', '$filter', '$state', 'ngDialog', '$location', 'md5', '$localStorage', '$stateParams', function ($scope, $rootScope, resourceService, $filter, $state, ngDialog, $location, md5, $localStorage, $stateParams) {
            $scope.title = '投资成功';
            document.getElementsByTagName('html')[0].scrollTop = 0;
            document.getElementsByTagName('body')[0].scrollTop = 0;
            $scope.toback=function () {
                $filter('跳回上一页')();
            };
            $scope.data={};
            $scope.user = $filter('isRegister')().user.member;
            if(!$scope.user){$state.go('dl');return;}
            if($localStorage.successEnfu){
                $scope.successData=$localStorage.successEnfu;
            }
            delete $localStorage.successEnfu;

            if($stateParams.dsEcType == 1) {
                $scope.dsEcType = true;
            } else if($stateParams.dsEcType == 2){
                $scope.dsEcType = false;
            }
        }])
        .controller('enfuInvestCtrl'
            , ['$scope', '$rootScope'
                , 'resourceService'
                , '$filter'
                , '$state'
                , '$stateParams'
                , '$location'
                , '$localStorage'
                , 'ngDialog'
                , function ($scope, $rootScope, resourceService, $filter, $state, $stateParams, $location, $localStorage, ngDialog) {
                    delete $localStorage.coupon;
                    $filter('isPath')('main.enfuinvest');
                    $rootScope.title = "恩弗教育";
                   /* $scope.toback = function () {
                        if ($rootScope.getUrlParam('from') == 'coupon') {
                            $state.go('myCoupon');
                        }
                        else if ($rootScope.getUrlParam('from') == 'newyearact1') {
                            $state.go('newyearact1', { wap: true });
                        }
                        else {
                            $filter('跳回上一页')(2);
                        }
                    };*/
                    $scope.yuebiao = {};
                    $scope.mainbox = true;
                    var user = $filter('isRegister')();
                    $scope.user = $filter('isRegister')().user;
                    $scope.toFrom = $rootScope.getUrlParam('toFrom');
                    $scope.active = 0;
                    $scope.isShowRule = false;
                    $scope.showBigImg = false;
                    $scope.playSound = true;
                    $scope.isCjmOut = false;
                    $scope.expect = 0;
                    $scope.enFuProductId = $localStorage.user.enFuProductId;
                    $localStorage.userTypes = {};
                    var $win = $(window);
                    $scope.isLogin = $filter('isRegister')().register;
                    $("html,body").animate({ scrollTop: $("body").offset().top });

                    var userStatus = {};
                    if(user.user.member){
                        userStatus.uid = user.user.member.uid;
                        $scope.tpwdSetting = user.user.member.tpwdSetting;
                        $scope.realVerity = user.user.member.realVerify;
                        resourceService.queryPost($scope, $filter('getUrl')('判断用户状态'), userStatus, '用户状态');
                    } else {
                        userStatus.uid = '';
                    }

                    if ($scope.isLogin) {
                        var obj = {};
                        obj.uid = user.user.member.uid;
                        obj.activityCode = 'enfu';
                        obj.pid = $scope.enFuProductId;
                        resourceService.queryPost($scope, $filter('getUrl')('我的信息'), {
                            uid: user.user.member.uid
                        }, '是否认证');
                        resourceService.queryPost($scope, $filter('getUrl')('cpDetail'), obj,'cpDetail');
                    }
                    $scope.gologin = function () {
                        $state.go('dl', { returnurl: 'enfuinvest?pid=' + $stateParams.pid });
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
                                    $state.go('investAuthentication',{amount: $scope.amount, expect: $scope.expect});
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

                    $scope.agreeclick = function () {
                        $scope.playSound = !$scope.playSound;
                    }
                    $scope.sendRequest = function () {
                        var params = {
                            'pid': $localStorage.cp.info.id,
                            'tpwd': $localStorage.userTypes.passWord,
                            'amount': $scope.amount,
                            'activityCode': 'enfu',
                            'uid': $filter('isRegister')().user.member.uid,
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
                    $scope.tobuy = function () {
                        if ($scope.amount != '' && $scope.amount != undefined && $('#myPwd').val() != '') {
                            /* if ($scope.cpCoupon.enableAmount > $scope.amount) {
                                 $filter('投资错误信息')('1012', $scope, 'y');
                                 return;
                             }*/
                            if($scope.cp.info.type != 1){
                                $scope.sendRequest();
                            } else if($scope.cp.info.type == 1) {
                                if($scope.amount >= 5000 || $scope.cop.length<=0){
                                    $scope.sendRequest();
                                } else if($scope.cop.length>0) {
                                    $('.useRedBag').css('display','block');
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
                    // 去支付
                    $scope.zhifu = function () {
                        $scope.closeDialog();
                        resourceService.queryPost($scope, $filter('getUrl')('我的信息'), {uid: $scope.user.member.uid}, '我的信息');
                        $filter('设置交易密码弹窗')($scope);
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
                                        uid: $scope.user.member.uid
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
                    // 忘记密码
                    $scope.toRetPwd = function () {
                        $scope.closeDialog();
                        $state.go('resetTradePwd',{firstset:false});
                    };
                    /*$scope.$watch('amount',function(newValue,oldValue){
                        if ($scope.cp) {
                            if(newValue > $scope.cp.info.surplusAmount) {
                                $scope.amount = oldValue;
                            }
                        }

                    });*/
                    $scope.$on('resourceService.QUERY_POST_MYEVENT', function (event, data, eObj) {
                        switch (eObj) {
                            case '是否认证':
                                $scope.map = data.map;
                                break;
                            case '我的信息':
                                if(data.success) {
                                    $scope.tpwdFlag = data.map.tpwdFlag;
                                    $scope.pwdFlag = $scope.tpwdFlag == 1 ? true:false;
                                }
                                break;
                            case 'cpDetail':
                                if (data.success) {
                                    $scope.balance = data.map.balance;
                                    $scope.cp = $localStorage.cp = data.map;
                                    $scope.pid = $stateParams.pid;
                                    $scope.amount = $scope.cp.info.amount;
                                    $scope.status = $scope.cp.info.status;
                                    $scope.type = data.map.info.type;
                                    if ($scope.type == 1) {
                                        $scope.interestmode = '满标后次日计息';
                                    } else {
                                        $scope.interestmode = '次日计息';
                                    }
                                } else if (data.errorCode == '2222'){
                                    $scope.status = 7;
                                }
                                break;

                            case 'cpPicAndInvest':
                                $scope.picList = data.map.picList;
                                $scope.investList = data.map.investList;
                                break;
                            case '用户状态':
                                if (data.success) {
                                    $scope.userTypes = data.map;
                                    $scope.realVerity = data.map.realVerify;
                                } else {
                                    $filter('服务器信息')(data.errorCode, $scope, 'y')
                                }
                                break;

                            case '购买产品':
                                if (data.success) {
                                    $scope.successData = $scope.cp;
                                    $scope.successData.enFuConvertCode = data.map.enFuConvertCode;
                                    $scope.successData.pid = data.map.pid;
                                    $scope.successData.shouyi = data.map.shouyi;
                                    $scope.successData.rate = $scope.cp.info.rate;
                                    $scope.successData.fullName = $scope.cp.info.fullName;
                                    $scope.successData.deadline = $scope.cp.info.deadline;
                                    $localStorage.successEnfu = $scope.successData;
                                    $localStorage.user.enFuProductId = $scope.cp.info.id;
                                    ngDialog.closeAll();
                                    $state.go('enfuInvestSuc',{});
                                } else {
                                    if (data.errorCode == '2001') {
                                        $filter('投资交易密码错误信息')($scope);
                                    } else if (data.errorCode == '1007'){
                                        if($localStorage.latestActiveNotReimbursedRecord){
                                            $scope.rid = $localStorage.latestActiveNotReimbursedRecord.id;
                                        }
                                        $filter('投资错误信息')(data.errorCode, $scope, 'y',data.errorMsg);
                                        setTimeout(function () {
                                            $state.go('recharge',{wap:'true',amount: $scope.amount});
                                        }, 2000);
                                    } else {
                                        $filter('投资错误信息')(data.errorCode, $scope, 'y',data.errorMsg);
                                    }
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
                    // alert($(window).height())
                    $scope.toXq = function () {
                        $scope.xqinfo = {
                            amount: $scope.amount,
                            expect: $scope.expect
                        };
                        $localStorage.cp.xqinfo = $scope.xqinfo;
                        $state.go('cpInvestInfo')
                    };
                }
            ])
        .controller('enfuRewardCtrl', ['$scope', '$rootScope', 'resourceService', '$filter', '$state', 'ngDialog', '$location', 'md5', '$localStorage', '$stateParams', function ($scope, $rootScope, resourceService, $filter, $state, ngDialog, $location, md5, $localStorage, $stateParams) {
            $scope.title = '奖品信息';
            document.getElementsByTagName('html')[0].scrollTop = 0;
            document.getElementsByTagName('body')[0].scrollTop = 0;
            $scope.toback=function () {
                $filter('跳回上一页')();
            };
            $scope.id = $state.params.id;
            $scope.data={};
            // $scope.user = $filter('isRegister')().user.member;
            $scope.user = $filter('isRegister')();
            var userData ={
                pageOn: 1,
                pageSize:30
            };
            if($scope.user || $scope.id) {
                userData.uid  = $scope.user.user.member.uid;
                userData.id  = $scope.id;
                resourceService.queryPost($scope, $filter('getUrl')('恩弗奖品详情'), userData, '恩弗奖品详情');
            } else {
                $state.go('dl');
                return;
            }
            $scope.$on('resourceService.QUERY_POST_MYEVENT', function (event, data, eObj) {
                switch (eObj) {
                    case '恩弗奖品详情':
                        if (data.success) {
                            // $state.go('enfuInvestSuc',{});
                            $scope.reward = data.map.pageInfo.rows[0];
                        }
                        break;
                };
            });

        }])
})