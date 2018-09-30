define(['jweixin', 'js/module.js', 'jquery', 'ngdialog', 'SHR256'], function (wx, controllers, $, ngdialog, SHR256, weixin) {
    controllers.controller('changcheng2Controller', ['$scope', '$rootScope', 'resourceService', '$filter', '$state', 'ngDialog', '$location', 'md5', '$localStorage', '$stateParams', function ($scope, $rootScope, resourceService, $filter, $state, ngDialog, $location, md5, $localStorage, $stateParams) {
        $filter('isPath')('changcheng2');
        $scope.userObj = $filter('isRegister')();
        if ($scope.userObj.register == true) {
            $scope.user = $scope.userObj.user.member;
            if($scope.user.realName){
                $scope.name = $scope.user.realName;
            }
            else{
                $scope.name = $scope.userObj.user.userName;
            }
            resourceService.queryPost($scope, $filter('getUrl')('getGreatWallInfo'), {
                uid:$scope.user.uid
            }, {name:'我的账户'});
        }
        $rootScope.title = '';
        $scope.login = {};
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
        if ($location.$$search) { $scope.webFormPath = $location.$$search; }

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
        $scope.quickbuy = function(){
            if($scope.userObj.register == true){
                resourceService.queryPost($scope, $filter('getUrl')('getUse'), { deadline: 35 }, { name: '长城宽带' });
            }
            else{
                $scope.gotop();
            }
        }
        
        // $scope.changchengclick = function (i) {
        //     resourceService.queryPost($scope, $filter('getUrl')('getUse'), { deadline: i }, { name: '长城宽带' });
        // }
        $scope.gotop = function () {
            $("html,body").animate({ scrollTop: $(".changcheng2").offset().top });
        };
        $scope.passwordText = false;
        $scope.isSubMin = false;
        $scope.nowTimer = "获取验证码";
        var changePicEvent;
        var targetFrom;
        if ($location.$$search.frompc) { $scope.frompc = $location.$$search.frompc; }
        var changeIMG = function (event) { //换图片验证码
            if (event != undefined) {
                event.currentTarget.src = '../login/validateCode.do?version=' + $rootScope.version + '&channel=' + $rootScope.channel + '&' + new Date().getTime();
            } else {
                if ($('.img-box img')[0] != undefined) {
                    $('.img-box img')[0].src = '../login/validateCode.do?version=' + $rootScope.version + '&channel=' + $rootScope.channel + '&' + new Date().getTime();
                };
            };
        };
        $scope.clickOnChangeIMG = function (event) {
            changeIMG(event);
        };
        var isSub = true;
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
                $rootScope.errorText = '请正确填写以上信息';
                $rootScope.maskError = true;
            }

        }

        $scope.isSubMin = true;
        $scope.getyzm = function (tegForm) {
            targetFrom = tegForm;

            if (tegForm.mobilephone.$valid == false) {
                alert("请输入正确的手机号码!");
                // $scope.isSubMin =false;
            } else {
                // $scope.isSubMin = true;
                if ($scope.isSubMin) {
                    resourceService.queryPost($scope, $filter('getUrl')('getyzm'), {
                        mobilephone: $scope.login.mobilephone,
                        picCode: $scope.login.picCode
                    }, { name: '获取验证码', tegForm: tegForm });
                    $filter('60秒倒计时')($scope, 60);
                }
                // $scope.isSubMin =true;
            };
        };
        /*焦点进入与离开*/
        $scope.blurID = function (code, tegForm) {
            if (!tegForm.mobilephone.$error.required && !tegForm.mobilephone.$error.minlength && !tegForm.mobilephone.$error.pattern) {
                resourceService.queryPost($scope, $filter('getUrl')('getPhone'), {
                    mobilephone: $scope.login.mobilephone
                }, { name: '注册验证手机号', tegForm: tegForm });
            };
        };
        $scope.toback = function () {
            $filter('跳回上一页')();
        };
        $scope.$on('resourceService.QUERY_POST_MYEVENT', function (event, data, type) {
            switch (type.name) {
                case '我的账户': 
                        if(data.success){
                            $scope.account = data.map;
                        }else{
                            $filter('服务器信息')(data.errorCode,$scope,'y')
                        }
                    break;
                case '获取验证码':
                    if (data.success) {
                        $rootScope.errorText = '验证码发送成功';
                        $rootScope.maskError = true;
                    } else {
                        $scope.stop();
                        $filter('手机短信验证错误')(type.tegForm, data.errorCode);
                    }
                    break;
                case '注册验证手机号':
                    if (data.success) {
                        if (data.map.exists) { //已有用户名
                            $rootScope.errorText = '此手机已注册';
                            $rootScope.maskError = true;
                        } else {
                            // type.tegForm.mobilephone.$error.serverError = data.map.exists;
                        };
                    }
                    break;
                case '注册':
                    isSub = true;
                    if (data.success) {
                        $localStorage.user = data.map;
                        // _hmt.push(['_trackPageview', '/maidian/zccg']);
                        _hmt.push(['_trackPageview', '/mian/myCoupon']);
                        $scope.userObj = $filter('isRegister')();
                        if ($scope.userObj.register == true) {
                            $scope.user = $scope.userObj.user.member;
                            if($scope.user.realName){
                                $scope.name = $scope.user.realName;
                            }
                            else{
                                $scope.name = $scope.userObj.user.userName;
                            }
                            resourceService.queryPost($scope, $filter('getUrl')('getGreatWallInfo'), {
                                uid:$scope.user.uid
                            }, {name:'我的账户'});
                        }
                    } else {
                        $filter('serverZuceError')(type.tegForm, data.errorCode);
                        $scope.login.passWord = '';
                    };
                    break;
                case '长城宽带':
                    $state.go("cpDetail", { pid: data.map.pid });
                    break;
            };
        });
        var linkstr = "";
        if ($scope.webFormPath.recommCode) {
            linkstr = '&recommCode=' + $scope.webFormPath.recommCode;
        }
        wx.ready(function () {
            wx.onMenuShareTimeline({
                title: '撸起袖子加油赚，想财富自由先来领第一桶金！', // 分享标题
                link: 'https://hushenlc.cn/friendreg?wap=true' + linkstr, // 分享链接
                imgUrl: 'https://hushenlc.cn/images/activity/firend/share.png', // 分享图标
                success: function () {
                    alert('分享成功！');
                },
                cancel: function () {
                    alert('您取消了分享！');
                }
            });
            wx.onMenuShareAppMessage({
                title: '撸起袖子加油赚，想财富自由先来领第一桶金！', // 分享标题
                desc: '送10万元体验金、666元红包、1.2倍翻倍券等新手大礼包！', // 分享描述
                link: 'https://hushenlc.cn/friendreg?wap=true' + linkstr, // 分享链接
                imgUrl: 'https://hushenlc.cn/images/activity/firend/share.png', // 分享图标
                success: function () {
                    alert('分享成功！');
                },
                cancel: function () {
                    alert('您取消了分享！');
                }
            });
            wx.onMenuShareQQ({
                title: '撸起袖子加油赚，想财富自由先来领第一桶金！', // 分享标题
                desc: '送10万元体验金、666元红包、1.2倍翻倍券等新手大礼包！', // 分享描述
                link: 'https://hushenlc.cn/friendreg?wap=true' + linkstr, // 分享链接
                imgUrl: 'https://hushenlc.cn/images/activity/firend/share.png', // 分享图标
                success: function () {
                    alert('分享成功！');
                },
                cancel: function () {
                    alert('您取消了分享！');
                }
            });
            wx.onMenuShareWeibo({
                title: '撸起袖子加油赚，想财富自由先来领第一桶金！', // 分享标题
                desc: '送10万元体验金、666元红包、1.2倍翻倍券等新手大礼包！', // 分享描述
                link: 'https://hushenlc.cn/friendreg?wap=true' + linkstr, // 分享链接
                imgUrl: 'https://hushenlc.cn/images/activity/firend/share.png', // 分享图标
                success: function () {
                    alert('分享成功！');
                },
                cancel: function () {
                    alert('您取消了分享！');
                }
            });
            wx.onMenuShareQZone({
                title: '撸起袖子加油赚，想财富自由先来领第一桶金！', // 分享标题
                desc: '送10万元体验金、666元红包、1.2倍翻倍券等新手大礼包！', // 分享描述
                link: 'https://hushenlc.cn/friendreg?wap=true' + linkstr, // 分享链接
                imgUrl: 'https://hushenlc.cn/images/activity/firend/share.png', // 分享图标
                success: function () {
                    alert('分享成功！');
                },
                cancel: function () {
                    alert('您取消了分享！');
                }
            });
        })
        var browser = {
            versions: function () {
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
            } (),
            language: (navigator.browserLanguage || navigator.language).toLowerCase()
        }
        function isWeiXin() {
            var ua = window.navigator.userAgent.toLowerCase();
            if (ua.match(/MicroMessenger/i) == 'micromessenger') {
                return true;
            } else {
                return false;
            }
        }
        $scope.downloadclick = function () {
            if (isWeiXin()) {
                if (browser.versions.ios || browser.versions.iPhone || browser.versions.iPad) {
                    $('.share-ios').fadeIn(200);
                } else {
                    $('.share-android').fadeIn(200);
                }
            } else if (browser.versions.ios || browser.versions.iPhone || browser.versions.iPad) {
                window.location.href = "https://itunes.apple.com/us/app/ju-sheng-cai-fu/id1171321616?mt=8";

            } else if (browser.versions.android) {
                window.location.href = "https://a.app.qq.com/o/simple.jsp?pkgname=com.jscf.js_app";
            } else {
                window.location.href = "https://hushenlc.cn/js_app.apk";
            }
        };
        $scope.closethis = function () {
            $('.share-ios,.share-android').fadeOut(200);
        };
    }])
})