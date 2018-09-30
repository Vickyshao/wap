'use strict';
define(['js/module.js', 'jquery', 'ngdialog'], function (controllers, $, ngdialog) {
    controllers.controller('myTyjController', ['$scope', 'resourceService', '$filter', '$state', '$rootScope', '$localStorage', function ($scope, resourceService, $filter, $state, $rootScope, $localStorage) {
        $rootScope.title = '体验金';
        $scope.userOBJ = $filter('isRegister')();
        $filter('isPath')('myTyj');
        $scope.blueBtn = false;
        if (!$scope.userOBJ.register) {
            $state.go("dl");
            return;
        }
        var wHeight = $(window).height() - $(".common-head").height() - $(".tyj-banner").height() - $(".tyj-footer").height();
        setTimeout(function () {
            // $(".tyj-content").height(wHeight + "px");
        },100);

        $scope.totyj = function () {
            $state.go('tyj',{})
        };
        $scope.active = 0;
        $scope.showDownload = true;
        if ($scope.userOBJ.user.member.toFrom == '16yy' || '18yy' == $scope.userOBJ.user.member.toFrom) {
            $rootScope.isShowMaskError = true;
            $rootScope.errorText = '投资新手标不参加此活动';

        } else if ($scope.userOBJ.user.member.toFrom == '19yy') {
            switch ($localStorage.maskType) {
                case '1':
                    $rootScope.isShowMaskError = true;
                    $rootScope.errorText = '投资新手标不参加此活动';
                    break;
                case '3':
                    $rootScope.isShowMaskError = true;
                    $rootScope.errorText = '投资新手标不参加此活动';
                    break;
            };
        }

        resourceService.queryPost($scope, $filter('getUrl')('我的红包'), {
            uid: $scope.userOBJ.user.member.uid,
            flag: 0
        }, '我的体验金');


        $scope.$on('resourceService.QUERY_POST_MYEVENT', function (event, data, type) {
            switch (type) {
                case '我的体验金':
                    if (data.success) {
                        $scope.coupons = data.map.list;
                        $scope.amountSum = data.map.amountSum;
                        $scope.newHandId = data.map.newHandId;
                        $scope.coupons.forEach(function (item) {
                            if (item.status == 0) {
                                $scope.blueBtn = true;
                            }
                        });
                        $scope.realVerify = $scope.userOBJ.user.member.realVerify;
                    } else {
                        $filter('服务器信息')(data.errorCode, $scope, 'y')
                    }
                    break;
            };
        });
        $scope.onClick = function (num) {
            $scope.active = num;
            $scope.realVerify = $scope.userOBJ.user.member.realVerify;
            resourceService.queryPost($scope, $filter('getUrl')('我的红包'), {
                uid: $scope.userOBJ.user.member.uid,
                status: $scope.active,
                flag: 0
            }, '我的体验金');
        };
        $scope.toback = function () {
            $filter('跳回上一页')(2);
        };
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
        $scope.downloadapp = function () {
            if (isWeiXin()) {
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
        $scope.closethis = function () {
            $('.share-ios,.share-android').fadeOut(200);
        };
    }])
        .controller('TYJCtrl', ['$scope', 'resourceService', '$filter', '$state', '$rootScope', '$localStorage', function ($scope, resourceService, $filter, $state, $rootScope, $localStorage) {
            $rootScope.title = '体验金使用规则';
            $scope.userOBJ = $filter('isRegister')();
            $filter('isPath')('TYJ');
            $scope.blueBtn = false;
            $scope.toback = function () {
                $filter('跳回上一页')(2);
            };
            if($rootScope.fromNative) {
                $('.w-tyi-wrap').removeClass('headerTop');
            }
        }]);
})
