define(['jweixin', 'js/module.js', 'jquery', 'ngdialog', 'SHR256'], function (wx, controllers, $, ngdialog, SHR256, weixin) {
    controllers.controller('newhandRankController', function ($scope, $rootScope, resourceService, $filter, $state, $location, $localStorage, $stateParams, ngDialog) {
        $filter('isPath')('newhandRank');
        $filter('isPath')('newhandRank2');
        $('body').scrollTop(0);
        // $rootScope.title = '沪深理财-网贷投资，国企控股平台';
        $rootScope.title = '新手专享';
        $scope.login = {};
        $scope.showdownload = true;
        if($rootScope.fromNative) {
            $('.newtyj').removeClass('headerTop');
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
            $localStorage.webFormPath = $location.$$search
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
        var wap = $rootScope.wap = $rootScope.getUrlParam('wap');
        var pid = $rootScope.wap = $rootScope.getUrlParam('pid');
        var platform = $rootScope.getUrlParam('platform');
        if($rootScope.fromNative) {
            $('.newtyj').css('padding-top','0');
        } else if(wap == 'true' || pid) {
            $('.newtyj').css('padding-top','40px');
        }

        // 跳到详情页
        $scope.toCpDetail  =function () {
            if(wap == 'false' || platform == 'A' || platform == 'i') {
                var hushendetail = {
                    pid:$scope.newhand.id,
                    ptype:1
                }
                document.location = 'hushendetail:' + angular.toJson(hushendetail);
            } else {
                if($scope.newHandInvested) {
                    $('.product a').attr('href','/main/bankBillList');
                    $('.product2 a').attr('href','/main/bankBillList');
                } else {
                    $('.product a').attr('href','/cpDetail?pid='+$scope.newhand.id);
                    $('.product2 a').attr('href','/cpDetail?pid='+$scope.newhand.id);
                }
            }
        }
        var user = $filter('isRegister')();
        if($stateParams.wap){
            $scope.wap = $stateParams.wap;
            if(user.register==true){
                $scope.isLog = true;
                resourceService.queryPost($scope, $filter('getUrl')('推广页账户'), {
                    uid: user.user.member.uid
                }, { name: '推广页账户' });
            }
            else{
                $scope.isLog = false;
            }
        }
        else{
            if($stateParams.uid){
                $scope.isLog = true;
                resourceService.queryPost($scope, $filter('getUrl')('推广页账户'), {
                    uid: $stateParams.uid
                }, { name: '推广页账户' });
            }
            else{
                $scope.isLog = false;
            }
        }
        resourceService.queryPost($scope, $filter('getUrl')('lastRegMember'), {}, { name: 'lastRegMember' });
        // 图形验证码
        var changeIMG = function (i,event) { //换图片验证码
            if (event != undefined) {
                event.currentTarget.src += '?' + new Date().getTime();
            } else {
                if ($('.img-box img')[i] != undefined) {
                    $('.img-box img')[i].src += '?' + new Date().getTime();
                }
            }
        };
        changeIMG(0);
        $scope.clickInput = function (i,event) {
            // $scope.userLogin.picCode = null;
            changePicEvent = event;
            changeIMG(i,changePicEvent);
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
                                isCheckPic: true,
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
        /*$scope.blurID = function (code, tegForm, i) {
            if (!tegForm.mobilephone.$error.required && !tegForm.mobilephone.$error.minlength && !tegForm.mobilephone.$error.pattern) {
                resourceService.queryPost($scope, $filter('getUrl')('getPhone'), {
                    mobilephone: $scope.login.mobilephone
                }, { name: '注册验证手机号', tegForm: tegForm });
            };
            changeIMG(i);
        };*/
        var $dataTable = $('.data-table');
        var trHeight = $('.data-list').height()/5;
        $scope.showSuccess = false;
        var data = {};
        if(user.user.member) {
            data.uid = user.user.member.uid;
        }
        resourceService.queryPost($scope, $filter('getUrl')('新手标推广页排行榜'), data, { name: '新手标推广页排行榜' });
        $scope.$on('resourceService.QUERY_POST_MYEVENT', function (event, data, type) {
            switch (type.name) {
                case '推广页账户':
                    if (data.success) {
                        $scope.user = data.map;
                    }
                    break;
                case '新手标推广页排行榜':
                    if (data.success) {
                        $scope.newhandList = data.map.noviceList;
                        $scope.newhand = data.map.newHand;
                        $scope.noviceCount = data.map.noviceCount;
                        $scope.newHandInvested = data.map.newHandInvested;
                        $dataTable.find('tr').each(function(i){
                            if(i%2==0){
                                $(this).css('background','#fff8e8');
                            }
                        })
                        // 列表数据轮动
                        if ($scope.newhandList.length > 5) {
                            setInterval(function() {
                                $dataTable.animate({'margin-top': '-'+trHeight+'px'},1000,function() {
                                    $dataTable.find('tr').eq(0).appendTo($dataTable);
                                    $dataTable.css('margin-top',0);
                                });
                            }, 5000);
                        }
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
                            $filter('zuceError')('1003');
                            $scope.hasPhone = true;
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
                        $filter('zuceError')('1014');
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
        $scope.background = function(){
            $dataTable.find('tr').each(function(i){
                if(i%2==0){
                    $(this).css('background','#F9EDD2');
                }
            })
        }
        $scope.closeSuccess = function(){
            $scope.showSuccess = false;
            $state.go('newtyj',{wap:true});
        }
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
                $("html,body").animate({ scrollTop: $(".rule-box").offset().top });
            }
        }
        $scope.openhongbao = function(){
            changeIMG(1);
            $scope.hasopen=true;
        }
        $scope.closedownload = function(){
            $scope.showdownload = false;
            $('.newtyj').css('padding-bottom',0);
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
        $scope.toLogin = function () {
            $state.go('dl',{toFrom: $stateParams.toFrom});
        };
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



        // 推广页的方法
        if ($location.$$path == '/extend/poster') {
            resourceService.queryPost($scope, $filter('交互接口对照表')('新手标排行榜'), {}, {name: '新手标排行榜'});
        }

        var $window = $(window),
            $toTop = $('.poster-totop'),
            $hb = $('html,body');
        $scope.toTop = function() {
            $hb.animate({scrollTop: 0}, 300);
        };
        $window.on('resize scroll load', function() {
            if ($hb.height() - $window.scrollTop() - $window.height() < 275) {
                $toTop.addClass('totop');
            } else {
                $toTop.removeClass('totop');
            }
        });


    })
})