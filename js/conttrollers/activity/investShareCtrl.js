define(['jweixin', 'js/module.js', 'jquery', 'ngdialog', 'SHR256'], function (wx, controllers, $, ngdialog, SHR256, weixin) {
    controllers.service('weixinS',['$localStorage','resourceService','ShareData',function ($localStorage,resourceService,ShareData) {}])
    controllers.controller('investShareCtrl', ['$scope', '$rootScope', 'resourceService', '$filter', '$state', 'ngDialog', '$location', 'md5', '$localStorage', '$stateParams','isWeixin','signWeChatService','weixinS','ShareData', function ($scope, $rootScope, resourceService, $filter, $state, ngDialog, $location, md5, $localStorage, $stateParams,isWeixin,signWeChatService,weixinS,ShareData) {
        $('body').scrollTop(0);
        $filter('isPath')('investShareCtrl');
        $scope.toFrom = $rootScope.getUrlParam('toFrom');
        $rootScope.title = '88万体验金限量发放';
        $scope.welcom =false;
        $scope.login = {};
        $scope.linkstr = '&phone=';
        $scope.tel = $stateParams.tel;
        $scope.isLogin = $filter('isRegister')().register;
        $scope.user = $filter('isRegister')().user.member;
        var wHeight = $(window).height();
        $(".redBagzhuce").css({minHeight: wHeight+"px"});
        if($scope.isLogin) {
            $scope.welcom = true;
        }
        $scope.showRuleBoole =false;
        $scope.showRuleText = function () {
            $scope.showRuleBoole = !$scope.showRuleBoole;
        };
        $scope.shareLogId = $stateParams.shareLogId;
        $scope.uid = $stateParams.uid;
        $scope.phone = $stateParams.phone;
        $scope.investId = $stateParams.investId;
        // 分享
        $scope.share = function() {
            resourceService.queryPost($scope, $filter('getUrl')('分享'),{uid: $scope.userid,investId: $scope.investId}, { name: '分享' });
            $scope.closeDialog();
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
        $scope.closeshareweixin = function() {
            $('.activity-tjs-boxweixin').fadeOut(200);
        };

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
        $scope.isMyself = false;
        $scope.next = function (tegForm) {
            if (tegForm.mobilephone.$error.required == true) {
                $filter('zuceError')('1001');
                return false;
            } else if (tegForm.mobilephone.$valid == false) {
                $filter('zuceError')('1002');
                return false;
            } else {
                if (!tegForm.mobilephone.$error.required && !tegForm.mobilephone.$error.minlength && !tegForm.mobilephone.$error.pattern) {
                    resourceService.queryPost($scope, $filter('getUrl')('判断用户参与活动状态'), {
                        phone: $scope.login.mobilephone,
                        shareLogId: $scope.shareLogId
                    }, { name: '判断用户参与活动状态', tegForm: tegForm });
                };
            }
            // else if($scope.login.mobilephone == $scope.phone) {
            //     $scope.isMyself = true;
            //     $state.go('redBagShare',{uid: $scope.uid,shareLogId: $scope.shareLogId});
            // }
            changeIMG();
        };
        // flag = 0表示立即领取  flag = 1 表示获取验证码
        $scope.validate = function(tegForm, flag){
            if ($scope.hasPhone == true) {
                $filter('zuceError')('1003');
                return false;
            } else if (tegForm.picCode.$error.required == true) {
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

        $scope.$on('resourceService.QUERY_POST_MYEVENT', function (event, data, type) {
            switch (type.name) {
                case 'index':
                    $scope.index = data.map;
                    $scope.newHandInvested = data.map.newHandInvested;
                    $scope.newhand = data.map.newHand;
                    break;
                case '分享':
                    if (data.success) {
                        $scope.shareLogId = data.map.shareLogId;
                        $scope.linkstr = $scope.linkstr + $scope.login.mobilephone + "&uid=" + $scope.userid + "&shareLogId=" + $scope.shareLogId +"&investId=" + $scope.investId;
                        ShareData.setLink($scope.linkstr);
                        $scope.initWX($scope.linkstr);
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
                case '判断用户参与活动状态':
                    if (data.success) {
                        $scope.userid = data.map.uid;
                        $scope.userType = data.map.userType;
                        $scope.shareLogIded = data.map.shareLogId;
                        if($scope.userType == '0') {
                            // 新用户
                            $scope.form = !$scope.form;
                        } else if($scope.userType == '1') {
                            // 参加过活动的用户
                            $state.go('redBagShare',{uid: $scope.userid,shareLogId: $scope.shareLogIded});
                        } else {
                            // 没参加过活动的老用户
                            $filter('引导投资弹窗')($scope);
                        }
                    }
                    break;
                case '注册':
                    isSub = true;
                    $scope.platform = $rootScope.getUrlParam('platform');
                    if (data.success) {
                        $localStorage.user = data.map;
                        resourceService.queryPost($scope, $filter('getUrl')('注册送体验金'),{ uid: $localStorage.user.member.uid,shareLogId: $scope.shareLogId}, { name: '注册送体验金' });
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
                    } else {
                        $filter('serverZuceError')(type.tegForm, data.errorCode);
                        $scope.login.passWord = '';
                    };
                    break;
                case '注册送体验金':
                    if (data.success) {
                        $state.go('redBagStart',{uid: $localStorage.user.member.uid,shareLogId: $scope.shareLogId});
                    }
                    break;
            };
        });
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
        $scope.initWX = function(linkstr){
            wx.ready(function () {
                wx.onMenuShareTimeline({
                    title: '88万体验金限量放送，收益可提现，赶快和你的好友一起领取吧！', // 分享标题
                    desc: '88万体验金等你来撩，手快有，手慢无~', // 分享描述
                    link: 'https://m.hushenlc.cn/redBagzhuce?wap=true' +linkstr, // 分享链接
                    imgUrl: 'https://m.hushenlc.cn/images/activity/share-icon.png', // 分享图标
                    success: function() {
                        alert('分享成功！');
                        resourceService.queryPost($scope, $filter('getUrl')('分享赠送体验金'),{shareLogId: $scope.shareLogId}, { name: '分享赠送体验金' });
                        $state.go('redBagShare',{uid: $scope.userid,shareLogId: $scope.shareLogId});
                    },
                    cancel: function() {
                        alert('您取消了分享！');
                    }
                });
                wx.onMenuShareAppMessage({
                    title: '88万体验金限量放送，收益可提现，赶快和你的好友一起领取吧！', // 分享标题
                    desc: '88万体验金等你来撩，手快有，手慢无~', // 分享描述
                    link: 'https://m.hushenlc.cn/redBagzhuce?wap=true' +linkstr, // 分享链接
                    imgUrl: 'https://m.hushenlc.cn/images/activity/share-icon.png', // 分享图标
                    success: function() {
                        alert('分享成功！');
                        resourceService.queryPost($scope, $filter('getUrl')('分享赠送体验金'),{shareLogId: $scope.shareLogId}, { name: '分享赠送体验金' });
                        $state.go('redBagShare',{uid: $scope.userid,shareLogId: $scope.shareLogId});
                    },
                    cancel: function() {
                        alert('您取消了分享！');
                    }
                });
            });
        }
        wx.ready(function () {
            wx.onMenuShareTimeline({
                title: '88万体验金限量放送，收益可提现，赶快和你的好友一起领取吧！', // 分享标题
                desc: '88万体验金等你来撩，手快有，手慢无~', // 分享描述
                link: window.location.href, // 分享链接
                imgUrl: 'https://m.hushenlc.cn/images/activity/share-icon.png', // 分享图标
                success: function() {
                    alert('分享成功！');
                },
                cancel: function() {
                    alert('您取消了分享！');
                }
            });
            wx.onMenuShareAppMessage({
                title: '88万体验金限量放送，收益可提现，赶快和你的好友一起领取吧！', // 分享标题
                desc: '88万体验金等你来撩，手快有，手慢无~', // 分享描述
                link: window.location.href, // 分享链接
                imgUrl: 'https://m.hushenlc.cn/images/activity/share-icon.png', // 分享图标
                success: function() {
                    alert('分享成功！');
                },
                cancel: function() {
                    alert('您取消了分享！');
                }
            });
        });
    }])
})