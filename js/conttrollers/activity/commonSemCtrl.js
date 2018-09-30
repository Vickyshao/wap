define(['jweixin', 'js/module.js', 'jquery', 'ngdialog', 'SHR256'], function (wx, controllers, $, ngdialog, SHR256, weixin) {
    controllers.controller('commonSemCtrl', ['$scope', '$rootScope', 'resourceService', '$filter', '$state', 'ngDialog', '$location', 'md5', '$localStorage', '$stateParams', function ($scope, $rootScope, resourceService, $filter, $state, ngDialog, $location, md5, $localStorage, $stateParams) {
        $('body').scrollTop(0);
        $filter('isPath')($rootScope.getUrlParam('source'));
        $scope.toFrom = $rootScope.getUrlParam('toFrom');
        $rootScope.title = '沪深理财-网贷投资，国企控股平台';
        $scope.welcom =false;
        $scope.login = {};
        $scope.isLogin = $filter('isRegister')().register;
        $scope.user = $filter('isRegister')().user.member;
        if($scope.isLogin) {
            $scope.welcom = true;
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
        // 计算器变量
        $scope.amount = '';
        $scope.rate = 10.8;
        $scope.time = 30;
        $scope.timeClass = 'time30';
        $scope.hideBox = function () {
            if ($(".entry").attr("disabled")) {
                $(".entry").removeAttr("disabled")
            }
            $(".entry").focus();
        }
        $scope.changeTime = function (time) {
            $scope.time = time;
            $scope.timeClass = 'time' + time;
            if (time == 30) {
                $scope.rate = 10.8;
            } else if (time == 60) {
                $scope.rate = 11.8;
            }
        };
        $scope.gototop = function () {
            if ($scope.isLogin) {
                $state.go('main.bankBillList')
            } else {
                $scope.gotop()
            }
        };
        $scope.onblur = function () {
            if ($scope.amount == undefined || $scope.amount == null) {
                $(".entry").removeClass('foucs');
            }
        }
        $scope.onchange = function () {
            if ($scope.amount != undefined || $scope.amount != null) {
                $(".entry").addClass('foucs');
            } else {
                $(".entry").removeClass('foucs');
            }
        }
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
        $scope.isShowPicCode = true;
        $scope.zuce = function (tegForm) {
            $scope.login.checkbox = true;
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
        // $scope.isImgCode = false;
        $scope.getyzm = function (tegForm) {
            if ($scope.isShowPicCode) {
                if ($scope.isSubMin == true) {
                    if(tegForm.picCode.$invalid){
                        $filter('zuceError')('1015');
                        return;
                    } else if($scope.isImgCode==true){
                        if($scope.validate(tegForm,1)){
                            resourceService.queryPost($scope, $filter('getUrl')('getyzm'), {
                                mobilephone: $scope.login.mobilephone,
                                picCode: $scope.login.picCode,
                                isPic : true,
                                // isCheckPic: true,
                                type: 1
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
            } else {
                if ($scope.isSubMin == true) {
                    if($scope.validate(tegForm,3)){
                        resourceService.queryPost($scope, $filter('getUrl')('getyzm'), {
                            mobilephone: $scope.login.mobilephone,
                            picCode: $scope.login.picCode,
                            isPic : true,
                            // isCheckPic: false,
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
            /*if ($scope.isSubMin == true) {
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

            }*/
        };

        $scope.form = true;
        $scope.next = function (tegForm) {
            $scope.login.smsCode = '';
            $scope.login.passWord = '';
            if (tegForm.mobilephone.$error.required == true) {
                $filter('zuceError')('1001');
                return false;
            }
            else if (tegForm.mobilephone.$valid == false) {
                $filter('zuceError')('1002');
                return false;
            } 
            if (!tegForm.mobilephone.$error.required && !tegForm.mobilephone.$error.minlength && !tegForm.mobilephone.$error.pattern) {
                resourceService.queryPost($scope, $filter('getUrl')('getPhone'), {
                    mobilephone: $scope.login.mobilephone
                }, { name: '注册验证手机号', tegForm: tegForm });
            };
            changeIMG();
           
            // $scope.sendMessage(tegForm);
        };
        // flag = 0表示立即领取(需要图片验证码）  flag = 1 表示不需要图片验证码获取验证码 flag = 2 表示不需要图片验证码-立即领取 flag = 3 表示不需要图片验证码获取验证码
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
                        $scope.login.picCode = '';
                        changeIMG();
                        setTimeout(function () {
                            ngDialog.closeAll();
                        }, 1000);
                    } else {
                        // $scope.stop();
                        $filter('手机短信验证错误')(type.tegForm, data.errorCode);
                        $scope.login.picCode = '';
                        changeIMG();
                    }
                    break;
                case '注册验证手机号':
                    if (data.success) {
                        if (data.map.exists) { //已有用户名
                            $scope.hasPhone = true;
                            $filter('zuceError')('1003');
                        }
                        else{
                            $scope.hasPhone = false;
                            $scope.form = !$scope.form;
                        }
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
                        $state.go('tyjRegSuccess');

                        document.location = "hushen:" +  JSON.stringify(data.map);
                    } else {
                        $filter('serverZuceError')(type.tegForm, data.errorCode);
                        $scope.login.passWord = '';
                        $scope.isShowPicCode = true;
                        $scope.isImgCode = true;
                        $scope.nowTimer = "获取验证码";
                        $scope.login.smsCode = "";
                        $scope.isImgCode=true;
                        $scope.login.picCode = '';
                        changeIMG();
                        $scope.stop();
                    };
                    break;
            };
        });
        $scope.closedownload = function(){
            $scope.showdownload = false;
            $('.mainc').css('margin-bottom',0);
        }
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

        //品轩
        $scope.PinToTop = function(num) {
            if (!$scope.isLogin) {
                $("html,body").animate({ scrollTop: 0 });
            } else{
                $state.go('main.bankBillList');
            }
        };

        //碰碰购立即领取--跳转到输入框
        $scope.goToTop = function () {
            // $('html, body').animate({scrollTop: $('.main-header').offset().top});
            $('html, body').animate({scrollTop: 0});
            $('.mobile').focus();
            $('.smsCode').focus();
        };
        //碰碰购
        if ($localStorage.step == 2) {
            $scope.form = false;
            delete $localStorage.step;
        };
        $scope.goToProtocol = function() {
            location.href = 'https://hushenlc.cn/zc';
            $localStorage.step = 2;
        };
    }])
})