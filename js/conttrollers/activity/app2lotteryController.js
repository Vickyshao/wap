define(['js/module.js'], function (controllers) {
    controllers.controller('app2lotteryController', function ($scope, $rootScope, $filter, $state, resourceService, ngDialog, $timeout, $localStorage, $location, $stateParams, $window) {
        $rootScope.title = '沪深理财-网贷投资，国企控股平台';
        if ($location.$$search.toFrom != undefined || $location.$$search.recommCode != undefined || $location.$$search.tid != undefined) {
            $localStorage.webFormPath = $location.$$search;
        }
        var appVersion = 200;
        if ($stateParams.wap) {
            $scope.wap = $stateParams.wap;
            $scope.isApp2 = false;
        }
        else{
            if($stateParams.version){
                if(parseFloat($stateParams.version.replace(/\./g,''))>=appVersion){
                    $scope.isApp2 = true;
                    $('.app2lottery').css('margin-bottom','0');
                    $scope.user = {};
                    $scope.user.uid = $stateParams.uid;
                    $scope.user.channel = $stateParams.channel;
                    $scope.user.version = $stateParams.version;
                }
                else{
                    $scope.isApp2 = false;
                }
            }
            else{
                $scope.isApp2 = false;
            }
        }
        var $dataTable = $('.data-table');
        var trHeight = $('.data-list').height() / 3;
        resourceService.queryPost($scope, $filter('getUrl')('app2.0翻牌领取记录'), {}, 'app2.0翻牌领取记录');
        $scope.$on('resourceService.QUERY_POST_MYEVENT', function (event, data, type) {
            switch (type) {
                case "app2.0翻牌领取记录":
                    if (data.success) {
                        $scope.dataList = data.map.luckDrawList;
                        // 列表数据轮动
                        if ($scope.dataList.length > 3) {
                            setInterval(function () {
                                $dataTable.animate({ 'margin-top': '-' + trHeight + 'px' }, 700, function () {
                                    $dataTable.find('tr').eq(0).appendTo($dataTable);
                                    $dataTable.css('margin-top', 0);
                                });
                            }, 3000);
                        }
                    }
                    break;
                case "app2.0翻牌":
                    $scope.canClick = true;
                    $('.lottery-card').removeClass('animate');
                    if (data.success) {
                        if(data.map.isWinning==true){
                            $scope.prizeType = 3;
                            $scope.couponType = data.map.type;
                            $scope.couponNum = data.map.num;
                            $('.prize').fadeIn(200);
                        }
                        else{
                            $scope.prizeType = 2;
                            $scope.failType = 2;//没有中奖
                            $('.prize').fadeIn(200);
                        }
                    }
                    else if(data.errorCode=='1005'){ 
                        $scope.prizeType = 2;
                        $scope.failType = 1;//没有翻牌机会
                        $('.prize').fadeIn(200);
                    }
                    else if(data.errorCode=='1003'){
                        $rootScope.errorText = data.errorMsg;
                        $rootScope.maskError = true;
                    }
                    break;
            }
        });
        $scope.canClick = true;
        $scope.showPrize = function(i){
            if($scope.isApp2==false){
                $scope.prizeType = 1;
                $('.prize').fadeIn(200);
            }
            else{
                if($scope.user.uid){
                    if($scope.canClick == true){
                        $scope.canClick = false;
                        $('.lottery-card').eq(i-1).addClass('animate');
                        $timeout(function(){
                            resourceService.queryPost($scope, $filter('getUrl')('app2.0翻牌'), $scope.user , 'app2.0翻牌');
                        },500);
                    }
                }
                else{
                    $window.location.href = 'jsmp://page=4?';
                }
            }
        }
        $scope.closePrize = function(){
            $('.prize').fadeOut(200);
        }
        $scope.showRule = function () {
            $('.rule').fadeIn(200);
        }
        $scope.closeRule = function () {
            $('.rule').fadeOut(200);
        }
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
            }(),
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
                window.location.href = "http://a.app.qq.com/o/simple.jsp?pkgname=com.jscf.js_app";
            } else {
                window.location.href = "https://hushenlc.cn/js_app.apk";
            }
        };
        $scope.closethis = function () {
            $('.share-ios,.share-android').fadeOut(200);
        };
    });
})

