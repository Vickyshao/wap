define(['jweixin', 'js/module.js', 'jquery', 'ngdialog', 'SHR256'], function (wx, controllers, $, ngdialog, SHR256, weixin) {
    controllers.controller('newtyj2Controller', function ($scope, $rootScope, resourceService, $filter, $state, $location, $localStorage, $stateParams) {
        $filter('isPath')('newtyj2');
        $('body').scrollTop(0);
        $rootScope.title = '沪深理财-网贷投资，国企控股平台';
        $scope.login = {};
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
        if($stateParams.wap){
            $scope.wap = $stateParams.wap;
            var user = $filter('isRegister')();
            if(user.register==true){
                $scope.isLog = true;
            }
            else{
                $scope.isLog = false;
            }
        }
        else{
            if($stateParams.uid){
                $scope.isLog = true;
            }
            else{
                $scope.isLog = false;
            }
        }
        resourceService.queryPost($scope, $filter('getUrl')('lastRegMember'), {}, { name: 'lastRegMember' });
        var $dataTable = $('.data-table');
        var trHeight = $('.data-list').height()/5;
        $scope.$on('resourceService.QUERY_POST_MYEVENT', function (event, data, type) {
            switch (type.name) {
                case 'lastRegMember':
                    if (data.success) {
                        $scope.newtyjList = data.map.list;
                        // 列表数据轮动
                        if ($scope.newtyjList.length > 5) {
                            setInterval(function() {
                                $dataTable.animate({'margin-top': '-'+trHeight+'px'},1000,function() {
                                    $dataTable.find('tr').eq(0).appendTo($dataTable);
                                    $dataTable.css('margin-top',0);
                                });
                            }, 3000);
                        }
                    } 
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
                    transform: 'rotate(180deg)',
                    
                });
            }
            else{
                $scope.ruleShow=true;
                $('.rule-box').animate({
                    height:ruleHeight
                },300);
                $('.rule-box').find('img').css({
                    transform: 'rotate(0deg)'
                });
                $("html,body").animate({ scrollTop: $(".rule-box").offset().top });
            }
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
    })
})