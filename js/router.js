define(['jweixin', "app", 'filter', 'urlFilters', 'md5js', 'framework/slider.js'], function (wx, app) {
    var rootApp = app;
    rootApp.config([
        '$compileProvider',
        function ($compileProvider) {
            $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|tel|file|sms|jsmp):/);
            // Angular v1.2 之前使用 $compileProvider.urlSanitizationWhitelist(...)
        }
    ]);
    rootApp.factory('httpInterceptor', ['$q', '$injector', '$rootScope', function ($q, $injector, $rootScope) {
        $rootScope.version = '1.0.0';
        $rootScope.channel = '3';
        var httpInterceptor = {
            'responseError': function (response) {
                return $q.reject("response", response);
            },
            'response': function (response) {
                // response.headers["Access-Control-Allow-Origin"]= "*";
                // response.headers["Access-Control-Allow-Methods"]="POST";
                // response.headers["Access-Control-Allow-Headers"]="x-requested-with,content-type";
                return response;
            },
            'request': function (config) {
                config.headers['X-Requested-With'] = "XMLHttpRequest";
                config.headers['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
                // config.headers['Content-Type'] = 'application/json; charset=UTF-8;';
                return config;
            },
            'requestError': function (config) {
                return $q.reject(config);
            }
        };
        return httpInterceptor;
    }]);
    rootApp.factory('isWeixin', function () {
        return function () {
            var ua = window.navigator.userAgent.toLowerCase();
            if (ua.match(/MicroMessenger/i) == 'micromessenger') {
                return true;
            } else {
                return false;
            }
        }
    });
    rootApp.run([
        '$rootScope',
        '$state',
        '$stateParams',
        '$localStorage',
        '$templateCache',
        '$location',
        '$window',
        'ngDialog',
        function ($rootScope, $state, $stateParams, $localStorage, $templateCache,$location,$window,ngDialog) {
            $localStorage.pathUrl = [];
            $rootScope.$state = $state;
            $rootScope.$stateParams = $stateParams;
            $rootScope.maskHidde = false;
            $rootScope.maskError = false;
            $rootScope.appPath = '../';
            document.getElementsByTagName('html')[0].scrollTop = 0;
            document.getElementsByTagName('body')[0].scrollTop = 0;
            var urlstr = window.location.href;
            var firstDomain = urlstr.indexOf('.cn') > 0? '.cn': '.com';
            if (urlstr.split(firstDomain).length < 2 || (urlstr.split(firstDomain).length > 1 && urlstr.split(firstDomain)[1] == "/")) {
                if (urlstr.substring(urlstr.length - 1, urlstr.length) == "/") {
                    urlstr += "main/home";
                } else {
                    urlstr += "/main/home";
                }
            };
            //console.log(urlstr);

            // if ($location.$$protocol == 'http') {
            //     var url = 'https'+ $location.$$absUrl.substring(4);
            //     $window.location.href = url;
            // }

            $rootScope.getUrlParam = function(name) {
                var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
                var r = window.location.search.substr(1).match(reg);  //匹配目标参数
                if (r != null) return unescape(r[2]); return null; //返回参数值
            };
            var platform = $rootScope.getUrlParam('platform');
            var uid = $rootScope.getUrlParam('uid');
            var wap = $rootScope.getUrlParam('wap');
            if( wap == 'false' || platform == 'A' || platform == 'i'){
                $rootScope.fromNative = true;
                $rootScope.platform = platform;
                $rootScope.uid = uid;
            }
            $.ajax({
                url: '/product/signWeChat.dos',
                type: 'post',
                data: { url: urlstr, version: '2.0.0', channel: '3' },
                success: function (data) {
                    data = angular.fromJson(data);
                    if (data.success) {
                        wx.config({
                            debug: false,
                            appId: data.map.appid,
                            timestamp: data.map.timestamp,
                            nonceStr: data.map.noncestr,
                            signature: data.map.sign,
                            jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage', 'onMenuShareQQ', 'onMenuShareWeibo', 'onMenuShareQZone']
                        });
                    };
                }
            });
            $rootScope.$on('CHANGE_MENU_STATUS',function(){
                $rootScope.$broadcast('CHANGE_MENU');
            });
            /* 监听路由的状态变化 */
            $rootScope.$on('$locationChangeStart', function(evt, next, current){
                ngDialog.closeAll();
            });
        }
    ])
        .config(function ($httpProvider, $stateProvider, $urlRouterProvider, $locationProvider, $uiViewScrollProvider) {
            //用于改变state时跳至顶部
            // $uiViewScrollProvider.userAnchorScroll();
            document.getElementsByTagName('html')[0].scrollTop = 0;
            document.getElementsByTagName('body')[0].scrollTop = 0;
            $locationProvider.html5Mode(true);
            var date = "?date=" + new Date().getTime();

            // 默认进入先重定向
            var param = function (obj) {
                var query = '',
                    name, value, fullSubName, subName, subValue, innerObj, i;

                for (name in obj) {
                    value = obj[name];

                    if (value instanceof Array) {
                        for (i = 0; i < value.length; ++i) {
                            subValue = value[i];
                            fullSubName = name + '[' + i + ']';
                            innerObj = {};
                            innerObj[fullSubName] = subValue;
                            query += param(innerObj) + '&';
                        }
                    } else if (value instanceof Object) {
                        for (subName in value) {
                            subValue = value[subName];
                            fullSubName = name + '[' + subName + ']';
                            innerObj = {};
                            innerObj[fullSubName] = subValue;
                            query += param(innerObj) + '&';
                        }
                    } else if (value !== undefined && value !== null)
                        query += encodeURIComponent(name) + '=' + encodeURIComponent(value) + '&';
                }

                return query.length ? query.substr(0, query.length - 1) : query;
            };
            // Override $http service's default transformRequest = 改变request payload 中的传参类型=str
            $httpProvider.defaults.transformRequest = [function (data) {
                return angular.isObject(data) && String(data) !== '[object File]' ? param(data) : data;
            }];
            $httpProvider.interceptors.push('httpInterceptor');

            $urlRouterProvider.otherwise('main/home');

            $stateProvider.state('main', {
                //abstract: true,
                url: '/main',
                templateUrl: 'template/page-home.html' + date
            })
                .state('main.home', {
                    url: '/home',
                    templateUrl: 'template/home.html' + date
                })
                // 登录页面
                .state('dl', {
                    url: '/dl?returnurl&eCommerce&source&toFrom&mobilephone',
                    templateUrl: 'template/login/login.html' + date
                })
                /*注册页面*/
                .state('zhuce', {
                    url: '/zhuce?recommPhone&myPhone&myToFrom&maskType?frompc&toWhere&recommCode&source&toFrom&returnurl',
                    templateUrl: 'template/login/zhuce.html' + date
                })
                /*实名认证*/
                .state('certification', {
                    url: '/certification?from',
                    templateUrl: 'template/Certification/shiMingRengZheng.html' + date
                })
                .state('host-666', {
                    url: '/host-666',
                    templateUrl: 'template/host.html',
                    controller:'hostCtrl'
                })
                /*认证充值*/
                .state('authentication', {
                    url: '/authentication?from',
                    templateUrl: 'template/Certification/authenticationRecharge.html' + date
                })
                /*认证充值*/
                .state('authenticationHelp', {
                    url: '/authenticationHelp?from',
                    templateUrl: 'template/Certification/helpDesc.html' + date
                })
                /*投资认证充值*/
                .state('investAuthentication', {
                    url: '/investAuthentication?from&amount?expect',
                    templateUrl: 'template/Certification/investAuthentication.html' + date
                })
                /*信息认证*/
                .state('authRecharge', {
                    url: '/authRecharge?from&returnurl',
                    templateUrl: 'template/Certification/authentication.html' + date
                })
                /*充值失败*/
                .state('rechargeFail', {
                    url: '/rechargeFail?from',
                    templateUrl: 'template/Certification/authenticationFail.html' + date
                })
                // 开通银行存款账户
                .state('setDepository', {
                    url: '/setDepository?wap&uid&phone&token&channel&version',
                    templateUrl: 'template/myaccount/set-depository.html' + date,
                    controller: 'setDepositoryController'
                })
                // 我的信息进入的存管账户页面
                .state('myDepository', {
                    url: '/myDepository?wap&uid&token&channel&version',
                    templateUrl: 'template/myaccount/my-depository.html' + date,
                    controller: 'myDepositoryController'
                })
                // .state('newRegister', {
                //     url: '/newRegister?phone&from&recommPhone',
                //     templateUrl: 'template/pages/newRegister.html' + date
                // })
                //CP080银行卡限额说明页
                .state('CP080', {
                    url: '/CP080',
                    templateUrl: 'template/app/CP080.html' + date
                })
                // 理财金页面
                .state('enroll', {
                    url: '/enroll',
                    templateUrl: 'template/login/enroll.html' + date
                })
                // 更多
                .state('main.more', {
                    url: '/more',
                    templateUrl: 'template/pages/more.html' + date
                })
                // 发现
                .state('main.find', {
                    url: '/find',
                    templateUrl: 'template/pages/find.html' + date
                })
                // 恩弗标
                .state('main.enfuinvest', {
                    url: '/enfuinvest',
                    templateUrl: 'template/enfu/enfuinvest.html' + date
                })
                // 关于我们列表页
                .state('GYWM', {
                    url: '/GYWM?wap',
                    templateUrl: 'template/pages/GYWM.html' + date
                })
                // 公司简介
                .state('GSJS', {
                    url: '/GSJS?wap',
                    templateUrl: 'template/pages/GSJS.html' + date
                })
                .state('GDJS',{
                    url: '/GDJS?wap',
                    templateUrl: 'template/pages/GDJS.html'+date
                })
                .state('GLTD', {
                    url: '/GLTD?wap',
                    templateUrl: 'template/pages/GLTD.html' + date
                })
                .state('GSZZ', {
                    url: '/GSZZ?wap',
                    templateUrl: 'template/pages/GSZZ.html' + date
                })
                .state('WZGG', {
                    url: '/WZGG?wap',
                    templateUrl: 'template/pages/WZGG.html' + date
                })
                .state('GGXQ', {
                    url: '/GGXQ?wap&artiId&from&title',
                    templateUrl: 'template/pages/GGXQ.html' + date
                })
                .state('TYJ', {
                    url: '/TYJ',
                    templateUrl: 'template/pages/TYJ.html' + date
                })
                .state('YYYZ', {
                    url: '/YYYZ?wap',
                    templateUrl: 'template/pages/YYYZ.html' + date
                })
                .state('GQJG', {
                    url: '/GQJG?wap',
                    templateUrl: 'template/pages/GQJG.html' + date
                })
                .state('YJFK', {
                    url: '/YJFK?amount&expect',
                    templateUrl: 'template/pages/YJFK.html' + date
                })
                // 认证注册
                .state('rzzcPage', {
                    url: '/rzzcPage',
                    templateUrl: 'template/pages/rzzc-page.html' + date
                })
                // 安全保障
                .state('aqbzPage', {
                    url: '/aqbzPage',
                    templateUrl: 'template/pages/aqbz-page.html' + date
                })
                // 充值提现
                .state('cztxPage', {
                    url: '/cztxPage',
                    templateUrl: 'template/pages/cztx-page.html' + date
                })
                // 投资福利
                .state('tzflPage', {
                    url: '/tzflPage',
                    templateUrl: 'template/pages/tzfl-page.html' + date
                })
                // 产品介绍
                .state('cpjsPage', {
                    url: '/cpjsPage',
                    templateUrl: 'template/pages/cpjs-page.html' + date
                })
                // 其他问题
                .state('qtwtPage', {
                    url: '/qtwtPage',
                    templateUrl: 'template/pages/qtwt-page.html' + date
                })
                /*产品*/
                .state('newhand', {
                    url: '/newhand?pid&uid&wap',
                    templateUrl: 'template/newhand/newhand.html'+date
                })
                .state('cpDetail', {
                    url: '/cpDetail?pid&uid&isShowRule&from&rid',
                    templateUrl: 'template/cp/cpDetail.html' + date
                })
                .state('cpInvestDetail', {
                    url: '/cpInvestDetail?pid&uid&isShowRule&from&rid',
                    templateUrl: 'template/cp/cpInvestDetail.html' + date
                })
                .state('cpInvestInfo', {
                    url: '/cpInvestInfo?pid&uid&isShowRule&from&rid&amount&expect',
                    templateUrl: 'template/cp/cpInvestInfo.html' + date
                })
                // 专属详情页
                .state('exclusiveCpDetail', {
                    url: '/exclusiveCpDetail?pid&uid&isShowRule&from&rid',
                    templateUrl: 'template/cp/exclusiveCpDetail.html' + date
                })
                .state('investment', {
                    url: '/investment?cpid&amt&pid&uid&rid',
                    templateUrl: 'template/cp/investment.html' + date
                })
                // app投资页
                .state('appInvestment', {
                    url: '/appInvestment?uid&token&channel&pid',
                    templateUrl: 'template/cp/appInvestment.html' + date,
                    controller: 'appInvestmentController'
                })
                .state('investSuccess', {
                    url: '/investSuccess',
                    templateUrl: 'template/cp/investSuccess.html' + date,
                    controller: "investSuccess"
                })
                .state('continuedInvest', {
                    url: '/continuedInvest',
                    templateUrl: 'template/cp/xutou.html' + date,
                    controller: "continuedInvest"
                })
                .state('coupon', {
                    url: '/coupon?cpid&amt',
                    templateUrl: 'template/cp/coupon.html' + date
                })
                // 我的账户-体验金
                .state('myTyj', {
                    url: '/myTyj',
                    templateUrl: 'template/myaccount/myTyj.html' + date,
                    controller: 'myTyjController'
                })
                // 体验金活动页
                .state('tyj', {
                    url: '/tyj?wap&uid',
                    templateUrl: 'template/activity/tyj.html' + date,
                    controller: 'tyjController'
                })
                // 体验金活动页
                .state('downLoad', {
                    url: '/downLoad',
                    templateUrl: 'template/activity/downLoad.html' + date
                })
                // 红包领取成功页
                .state('receiveSuccess', {
                    url: '/receiveSuccess',
                    templateUrl: 'template/activity/receiveSuccess.html' + date
                })
                // 体验金注册成功页
                .state('tyjRegSuccess', {
                    url: '/tyjRegSuccess?returnurl',
                    // templateUrl: 'template/activity/tyjRegSuccess.html' + date
                    templateUrl: 'template/activity/registerSuccess.html' + date
                })
                //新手注册成功页
                .state('newhandSuccess', {
                    url: '/newhandSuccess?toFrom',
                    templateUrl: 'template/activity/newhandSuccess.html' + date
                })
                // 电商渠道注册成功页
                .state('eComSuccess', {
                    url: '/eComSuccess?dsEcType',
                    templateUrl: 'template/reimburse/eComSuccess.html' + date
                })
                // 体验金详情页
                .state('tyjdetail', {
                    url: '/tyjdetail',
                    templateUrl: 'template/cp/tyjdetail.html' + date
                })
                // 体验金投资成功页
                .state('tyjSuccess', {
                    url: '/tyjSuccess',
                    templateUrl: 'template/cp/tyjSuccess.html' + date,
                    controller: 'tyjSuccessController'
                })
                // 双蛋活动
                .state('shuangdan', {
                    url: '/shuangdan?wap&uid',
                    templateUrl: 'template/activity/shuangdan.html' + date,
                    controller: 'shuangdanController'
                })
                .state('shuangdanshare', {
                    url: '/shuangdanshare?wap&uid',
                    templateUrl: 'template/activity/shuangdanshare.html' + date,
                    controller: 'shuangdanshareController'
                })
                .state('shuangdanshyd', {
                    url: '/shuangdanshyd',
                    templateUrl: 'template/activity/shuangdanshyd.html' + date
                })
                // 砸蛋活动
                .state('dropEgg', {
                    url: '/dropEgg?wap&uid&allowDL&source',
                    templateUrl: 'template/egg/dropEgg.html' + date
                })
                // 当天首投成功页面
                // .state('eggInvestSuccess', {
                //     url: '/eggInvestSuccess?wap&uid',
                //     templateUrl: 'template/egg/eggInvestSuccess.html' + date
                // })


                // 年末豪礼投即送活动
                // 活动页
                .state('tjs', {
                    url: '/tjs?wap&uid',
                    templateUrl: 'template/activity/tjs.html' + date
                })
                // 礼品预约
                .state('giftyy', {
                    url: '/giftyy?wap&id',
                    templateUrl: 'template/activity/giftyy.html' + date,
                    controller: 'giftyyController'
                })
                // 投即送标的详情页
                .state('tjsdetail', {
                    url: '/tjsdetail?wap&pid&from',
                    templateUrl: 'template/activity/tjsdetail.html' + date,
                    controller: 'tjsdetailController'
                })
                // 投即送确认投资页
                .state('tjsinvestment', {
                    url: '/tjsinvestment?wap&pid',
                    templateUrl: 'template/activity/tjsinvestment.html' + date,
                    controller: 'tjsinvestmentController'
                })
                // 投即送投资成功页
                .state('tjssuccess', {
                    url: '/tjssuccess?wap',
                    templateUrl: 'template/activity/tjssuccess.html' + date,
                    controller: 'tjssuccessController'
                })
                // 我的账户进入的投资即送
                .state('mytjs', {
                    url: '/mytjs?wap&uid',
                    templateUrl: 'template/activity/mytjs.html' + date,
                    controller: 'mytjsController'
                })
                // 投即送-礼品心愿
                .state('tjswish', {
                    url: '/tjswish?wap&uid',
                    templateUrl: 'template/activity/tjswish.html' + date,
                    controller: 'tjswishController'
                })
                // 填投即送地址
                .state('tjsaddress', {
                    url: '/tjsaddress?wap&investId&type',
                    templateUrl: 'template/activity/tjsaddress.html' + date,
                    controller: 'tjsaddressController'
                })
                // 礼品详情页
                .state('prizedetail', {
                    url: '/prizedetail?wap',
                    templateUrl: 'template/activity/prizedetail.html' + date,
                    controller: 'prizedetailController'
                })
                
                // 拉新页
                .state('pullNew', {
                    url: '/pullNew?wap&toFrom',
                    templateUrl: 'template/activity/pullNew.html'+date
                })
                // // 拉新页SEM
                // .state('pullNewSem', {
                //     url: '/pullNewSem?wap&platform',
                //     templateUrl: 'template/activity/promote.html'+date,
                //     controller:'promoteController'
                // })
                // 拉新页SEM
                .state('pullNewSem', {
                    url: '/pullNewSem?wap&toFrom',
                    templateUrl: 'template/activity/pullNewSem.html'+date
                })
                .state('pullNewSemW', {
                    url: '/pullNewSemW?wap&toFrom',
                    templateUrl: 'template/activity/pullNewSemW.html'+date
                })
                .state('newHandReg2', {
                    url: '/newHandReg2?wap&toFrom',
                    templateUrl: 'template/activity/newHandReg2.html'+date
                })

                // 拉新页SEM
                .state('newToInvest', {
                    url: '/newToInvest?wap&toFrom',
                    templateUrl: 'template/activity/newToInvest.html'+date
                })

                // 注册专题页
                .state('promote', {
                    url: '/promote?wap&platform&toFrom',
                    templateUrl: 'template/activity/pullNewSem.html'+date
                })
                //车点点宣传页
                .state('chedd', {
                    url: '/chedd?toFrom',
                    templateUrl: 'template/activity/chedd.html'+date
                })
                //车道宣传页
                .state('chedao', {
                    url: '/chedao?toFrom',
                    templateUrl: 'template/activity/chedao.html'+date,
                    controller:'chedaoCtrl'
                })
                //SEM送话费活动
                .state('billGiftSem', {
                    url: '/billGiftSem?toFrom',
                    templateUrl: 'template/activity/billGiftSem.html'+date
                })
                //京东E卡活动
                .state('jdEcard', {
                    url: '/jdEcard?toFrom',
                    templateUrl: 'template/activity/jdEcard.html'+date
                })
                //果粉
                .state('guofen', {
                    url: '/guofen?toFrom',
                    templateUrl: 'template/activity/guofen.html'+date
                })
                //行走与歌唱
                .state('xingzou', {
                    url: '/xingzou?toFrom',
                    templateUrl: 'template/activity/xingzou.html'+date
                })
                //京东SEM活动
                .state('jdSem', {
                    url: '/jdSem?source&toFrom',
                    templateUrl: 'template/activity/jdSem.html' + date
                })
                //流量银行活动
                .state('flowBank', {
                    url: '/flowBank?toFrom',
                    templateUrl: 'template/activity/flowBank.html'+date
                })
                //车宝渠道活动
                .state('chebao', {
                    url: '/chebao',
                    templateUrl: 'template/activity/chebao.html'+date
                })
                //多点网专题活动
                .state('duodian', {
                    url: '/duodian?toFrom',
                    templateUrl: 'template/activity/duodian.html'+date
                })
                //典典养车活动
                .state('diandian', {
                    url: '/diandian?toFrom',
                    templateUrl: 'template/activity/diandian.html'+date
                })
                //中影渠道
                .state('zhongying', {
                    url: '/zhongying?toFrom',
                    templateUrl: 'template/activity/zhongying.html'+date
                })
                //车点点12.28上线渠道  1.26
                .state('chediandian', {
                    url: '/chediandian?toFrom',
                    templateUrl: 'template/activity/chediandian.html'+date
                })
                // 电商拉新活动页面
                // .state('eCommerce', {
                //     url: '/eCommerce?toFrom',
                //     templateUrl: 'template/reimburse/eCommerce.html'+date
                // })
                // 攻略页面
                .state('eleStrategy', {
                    url: '/eleStrategy',
                    templateUrl: 'template/reimburse/eleStrategy.html'+date
                })
                // 我要报销页面
                .state('reimburse', {
                    url: '/reimburse',
                    templateUrl: 'template/reimburse/reimburse.html'+date
                })
                // 分期报销
                .state('staging', {
                    url: '/staging',
                    templateUrl: 'template/reimburse/staging.html'+date
                })


                //我的账户
                .state('main.myaccountHome', {
                    url: '/myaccountHome?success&errorCode&errorMsg&amount&type',
                    templateUrl: 'template/myaccount/account-home.html' + date
                })
                // 专属标列表
                .state('main.exclusiveList', {
                    url: '/exclusiveList?from',
                    templateUrl: 'template/cp/exclusive-list.html' + date
                })
                // 普通标列表
                .state('main.bankBillList', {
                    url: '/bankBillList',
                    templateUrl: 'template/cp/invests-list.html' + date
                })
                .state('hbopen', {
                    url: '/hbopen',
                    templateUrl: 'template/myaccount/my-hbopen.html' + date
                })
                .state('investDetail', {
                    url: '/investDetail',
                    templateUrl: 'template/myaccount/invest-detail.html' + date
                })
                .state('investRecord', {
                    url: '/investRecord',
                    templateUrl: 'template/myaccount/invest-record.html' + date
                })
                .state('minxi', {
                    url: '/minxi',
                    templateUrl: 'template/myaccount/my-minxi.html' + date
                })
                .state('paybackDetail', {
                    url: '/paybackDetail',
                    templateUrl: 'template/myaccount/payback-detail.html' + date
                })
                .state('investProtocol', {
                    url: '/investProtocol',
                    templateUrl: 'template/myaccount/invest-investProtocol.html' + date
                })
                // 我的优惠券2018-1-2
                .state('myCouponList', {
                    url: '/myCouponList?page',
                    templateUrl: 'template/myaccount/myCouponList.html' + date
                })
                .state('myCouponNoUse', {
                    url: '/myCouponNoUse',
                    templateUrl: 'template/myaccount/myCoupon-nouse.html' + date
                })
                .state('myCoupon', {
                    url: '/myCoupon',
                    templateUrl: 'template/myaccount/myCoupon.html' + date
                })
                .state('myAssets', {
                    url: '/myAssets?page',
                    templateUrl: 'template/myaccount/my-assets.html' + date
                })
                .state('myAssetsDetail', {
                    url: '/myAssetsDetail',
                    templateUrl: 'template/myaccount/my-assets-detail.html' + date
                })
                .state('myActivityRewards', {
                    url: '/myActivityRewards',
                    templateUrl: 'template/myaccount/my-activity-rewards.html' + date
                })
                .state('activityPerson', {
                    url: '/activityPerson?id&wap',
                    templateUrl: 'template/cp/activityPerson.html' + date
                })
                .state('myInvest', {
                    url: '/myInvest',
                    templateUrl: 'template/myaccount/my-invest.html' + date
                })
                .state('myInvestDetail', {
                    url: '/myInvestDetail?cpinfo',
                    templateUrl: 'template/myaccount/my-invest-detail.html' + date
                })
                .state('reimbursementRecord', {
                    url: '/reimbursementRecord?uid&id',
                    templateUrl: 'template/myaccount/reimbursement-record.html' + date
                })
                .state('myInvestDetailXy', {
                    url: '/myInvestDetailXy?pid&investId',
                    templateUrl: 'template/myaccount/my-invest-detailxy.html' + date
                })
                .state('myInvestHis', {
                    url: '/myInvestHis',
                    templateUrl: 'template/myaccount/my-invest-history.html' + date
                })
                .state('mycashed', {
                    url: '/mycashed?cashedId',
                    templateUrl: 'template/myaccount/my-cashed.html' + date
                })
                //消息列表页
                .state('newsList', {
                    url: '/newsList',
                    templateUrl: 'template/myaccount/news-list.html' + date
                })
                //充值提现
                .state('recharge', {
                    url: '/recharge?from&wap&uid&token&channel&version&rid&amount&firstCharge',
                    templateUrl: 'template/recharge/recharge.html' + date
                })
                //支付额度表
                .state('payments', {
                    url: '/payments',
                    templateUrl: 'template/recharge/payments.html' + date
                })
                //充值短信验证码
                .state('rechargeCode', {
                    url: '/rechargeCode?from&wap&uid&token&channel&version&rid&amount',
                    templateUrl: 'template/recharge/rechargeCode.html' + date
                })
                //第一次投资充值成功
                .state('rechargesuccess', {
                    url: '/rechargesuccess?amount',
                    templateUrl: 'template/recharge/rechargesuccess.html' + date
                })
                //公共充值成功
                .state('commonRechargeSuccess', {
                    url: '/commonRechargeSuccess',
                    templateUrl: 'template/recharge/commonRechargeSuccess.html' + date
                })
                //提现处理中
                .state('cashProcessing', {
                    url: '/cashProcessing',
                    templateUrl: 'template/recharge/cashProcessing.html' + date
                })
                //投资成功
                .state('actinvestsuccess', {
                    url: '/actinvestsuccess',
                    templateUrl: 'template/cp/actinvestsuccess.html' + date
                })
                .state('getCash', {
                    url: '/getCash', 
                    templateUrl: 'template/recharge/get-cash.html' + date
                })
                .state('myInfo', {
                    url: '/myInfo',
                    templateUrl: 'template/myaccount/my-info.html' + date
                })
                .state('myBank', {
                    url: '/myBank',
                    templateUrl: 'template/myaccount/my-bank.html' + date
                })
                .state('myMessage', {
                    url: '/myMessage',
                    templateUrl: 'template/myaccount/my-message.html' + date
                })
                .state('znMessage', {
                    url: '/znMessage',
                    templateUrl: 'template/myaccount/zn-message.html' + date
                })
                .state('startEvaluation', {
                    url: '/startEvaluation?fromPage&showTip&uid&token&comeFrom&amount&pid',
                    templateUrl: 'template/myaccount/startEvaluation.html' + date
                })
                .state('riskEvaluation', {
                    url: '/riskEvaluation?fromPage&showTip&uid&token&comeFrom&amount&pid&showRedPacket',
                    templateUrl: 'template/myaccount/riskEvaluation.html' + date
                })
                .state('evaluationType', {
                    url: '/evaluationType?fromPage',
                    templateUrl: 'template/myaccount/evaluationType.html' + date
                })
                .state('riskCommitment', {
                    url: '/riskCommitment',
                    templateUrl: 'template/myaccount/riskCommitment.html' + date
                })
                // 邀请好友
                //邀请好友被邀请人欢迎页面
                .state('welcom', {
                    url: '/welcom?toFrom&recommCode&realName&mobilePhone',
                    templateUrl: 'template/activity/welcom.html'+date
                })
                .state('myInvitation', {
                    url: '/myInvitation',
                    templateUrl: 'template/myaccount/my-invitation.html' + date
                })
                .state('invitationRecord', {
                    url: '/invitationRecord?uid&token&version',
                    templateUrl: 'template/myaccount/invitationRecord.html' + date
                })
                .state('inviRaiders', {
                    url: '/inviRaiders',
                    templateUrl: 'template/myaccount/inviRaiders.html' + date
                })
                // app提现页
                .state('appGetcash', {
                    url: '/appGetcash?uid&token&channel&version',
                    templateUrl: 'template/recharge/app-getcash.html' + date
                })
                .state('resetTradePwd', {
                    url: '/resetTradePwd?firstset&amt&cpid&rid',
                    templateUrl: 'template/myaccount/reset-tradepwd.html' + date
                })
                .state('resetPwd', {
                    url: '/resetPwd?forget',
                    templateUrl: 'template/myaccount/reset-pwd.html' + date
                })
                .state('findPwd', {
                    url: '/findPwd?forget&mobilePhone&returnurl',
                    templateUrl: 'template/login/findPwd.html' + date
                })
                .state('payPW', {
                    url: '/payPW',
                    templateUrl: 'template/recharge/payPassWord.html' + date
                })
                .state('triplegift', {
                    url: '/triplegift',
                    templateUrl: 'template/activity/triplegift.html' + date
                })
                .state('spider', {
                    url: '/spider',
                    templateUrl: 'template/activity/spider-app.html' + date
                })
                .state('sendmask', {
                    url: '/sendmask',
                    templateUrl: 'template/activity/sendmask.html' + date
                })
                .state('aunt', {
                    url: '/aunt',
                    templateUrl: 'template/activity/aunt.html' + date
                })
                .state('telecom', {
                    url: '/telecom',
                    templateUrl: 'template/activity/telecom.html' + date
                })
                .state('rechargegift', {
                    url: '/rechargegift',
                    templateUrl: 'template/activity/rechargegift.html' + date
                })

                // 安全保障
                .state('aqbz', {
                    url: '/aqbz?wap',
                    templateUrl: 'template/pages/AQBZ.html' + date
                })
                // 渠道推广注册页
                .state('newcomer', {
                    url: '/newcomer?wap',
                    templateUrl: 'template/pages/newcomer.html' + date
                })
                .state('flwhz', {
                    url: '/flwhz',
                    templateUrl: 'template/pages/flwhz.html' + date
                })
                .state('invite-rules', {
                    url: '/invite-rules',
                    templateUrl: 'template/activity/invite-rules.html' + date
                })
                .state('XSXQ', {
                    url: '/XSXQ?wap',
                    templateUrl: 'template/pages/XSXQ.html' + date
                })
                // 抽奖活动
                .state('lottery', {
                    url: '/lottery?wap&uid&token',
                    templateUrl: 'template/lottery/lottery.html' + date
                })
                .state('lotteryinvest', {
                    url: '/lotteryinvest?wap&pid',
                    templateUrl: 'template/lottery/lotteryinvest.html' + date
                })
                .state('lotteryInvestDetail', {
                    url: '/lotteryInvestDetail?wap&id',
                    templateUrl: 'template/lottery/lotteryInvestDetail.html' + date
                })
                .state('lotteryinvestsuc', {
                    url: '/lotteryinvestsuc?wap',
                    templateUrl: 'template/lottery/lotteryinvestsuc.html' + date
                })
                // iPhone活动页
                .state('special', {
                    url: '/special?wap',
                    templateUrl: 'template/activity/iPhone.html' + date
                })
                // .state('special', {
                //     url: '/special?wap',
                //     templateUrl: 'template/activity/special.html' + date
                // })
                // 中奖信息
                .state('iphonelist', {
                    url: '/iphonelist?wap',
                    templateUrl: 'template/activity/iphonelist.html' + date
                })
                // 新手专享
                .state('hlsbt', {
                    url: '/hlsbt',
                    templateUrl: 'template/activity/hlsbt.html' + date
                })
                // 邀请好友
                .state('inviteFriend1', {
                    url: '/inviteFriend1?wap&afid&uid',
                    templateUrl: 'template/activity/inviteFriend1.html' + date,
                    controller: 'inviteFriend1'
                })
                .state('inviteFriend2', {
                    url: '/inviteFriend2?wap&afid&uid',
                    templateUrl: 'template/activity/inviteFriend2.html' + date,
                    controller: 'inviteFriend2'
                })
                .state('inviteFriend3', {
                    url: '/inviteFriend3?wap&afid&uid',
                    templateUrl: 'template/activity/inviteFriend3.html' + date,
                    controller: 'inviteFriend3'
                })
                .state('inviteFriend4', {
                    url: '/inviteFriend4?wap&afid&uid',
                    templateUrl: 'template/activity/inviteFriend4.html' + date,
                    controller: 'inviteFriend4'
                })
                .state('inviteFriend5', {
                    url: '/inviteFriend5?wap&afid&uid',
                    templateUrl: 'template/activity/inviteFriend5.html' + date,
                    controller: 'inviteFriend5'
                })
                .state('inviteFriend6', {
                    url: '/inviteFriend6?wap&afid&uid',
                    templateUrl: 'template/activity/inviteFriend6.html' + date,
                    controller: 'inviteFriend6'
                })
                .state('inviteFriendTri', {
                    url: '/inviteFriendTri?wap&afid&uid',
                    templateUrl: 'template/activity/inviteFriendTri.html' + date,
                    controller: 'inviteFriendTri'
                })
                // 好友注册邀请
                .state('friendreg', {
                    url: '/friendreg?frompc&recommCode',
                    templateUrl: 'template/activity/friendReg.html' + date,
                    controller: 'friendregController'
                })
                .state('invite', {
                    url: '/invite',
                    templateUrl: 'template/activity/invite.html' + date
                })
                // 赚钱任务
                .state('myMission', {
                    url: '/myMission',
                    templateUrl: 'template/myaccount/myMission.html' + date,
                    controller: 'myMissionCtrl'
                })
                // 活动聚合页
                .state('actList', {
                    url: '/actList',
                    templateUrl: 'template/myaccount/actList.html' + date,
                    controller: 'actListController'
                })
                // 往期活动
                .state('overdueActList', {
                    url: '/overdueActList',
                    templateUrl: 'template/myaccount/overdueActList.html' + date,
                    controller: 'overdueActListController'
                })
                // 我的活动
                .state('myActivity', {
                    url: '/myActivity?wap&active',
                    templateUrl: 'template/myaccount/myActivity.html' + date
                })
                // app下载页
                .state('appdownload', {
                    url: '/appdownload',
                    templateUrl: 'template/pages/appdownload.html' + date,
                    controller: 'appdownload'
                })
                // app下载页2
                .state('app2download', {
                    url: '/app2download',
                    templateUrl: 'template/pages/app2download.html' + date,
                    controller: 'app2download'
                })
                .state('carReg', {
                    url: '/carReg',
                    templateUrl: 'template/activity/carReg.html' + date,
                    controller: 'controllerRegister'
                })
                // 类似注册专题页面
                .state('changcheng', {
                    url: '/changcheng',
                    templateUrl:'template/activity/changcheng.html'+date,
                    controller:'controllerRegister'
                })
                .state('changcheng2', {
                    url: '/changcheng2',
                    templateUrl:'template/activity/changcheng2.html'+date,
                    controller:'changcheng2Controller'
                })
                .state('yuebiao', {
                    url: '/yuebiao?prid&name&toState&pid',
                    templateUrl: 'template/activity/yuebiao.html' + date,
                    controller: 'yuebiaoCtrl'
                })
                // 返利
                .state('fanli', {
                    url: '/fanli?toFrom',
                    templateUrl: 'template/activity/fanli.html' + date,
                    controller: 'fanliCtrl'
                })
                // 新年活动页
                .state('newyear', {
                    url: '/newyear?wap&uid',
                    templateUrl: 'template/activity/newyear.html' + date,
                    controller: 'newyearController'
                })
                // 新年活动一
                .state('newyearact1', {
                    url: '/newyearact1?wap&uid',
                    templateUrl: 'template/activity/newyearact1.html' + date,
                    controller: 'newyearact1Controller'
                })
                // 新年活动分享页
                .state('newyearshare', {
                    url: '/newyearshare?wap&uid&phone&recommPhone',
                    templateUrl: 'template/activity/newyearshare.html' + date,
                    controller: 'newyearshareController'
                })
                // 春节2018活动页
                .state('chunjie2018', {
                    url: '/chunjie2018?wap&uid',
                    templateUrl: 'template/activity/chunjie2018.html' + date
                })
                // 媒体报道
                .state('report', {
                    url: '/report?page&wap',
                    templateUrl: 'template/pages/report.html' + date,
                    controller: 'reportController'
                })
                // 元宵活动
                .state('yuanxiao', {
                    url: '/yuanxiao?wap&uid',
                    templateUrl: 'template/activity/yuanxiao.html' + date,
                    controller: 'yuanxiaoController'
                })
                // 新手标推广页
                .state('newhandreg', {
                    url: '/newhandreg?wap',
                    templateUrl: 'template/newhand/newhandreg.html'+date,
                    controller:'newhandregController'
                })
                // 新手专享（外）
                .state('newhandRank', {
                    url: '/newhandRank?wap&uid&toFrom',
                    templateUrl: 'template/activity/newhandRank.html' + date,
                    controller: 'newhandRankController'
                })
                // 新手专享（内）
                .state('newhandRank2', {
                    url: '/newhandRank2?wap&uid&toFrom',
                    templateUrl: 'template/activity/newhandRank2.html' + date
                })
                // 新体验金推广页(内)
                .state('newtyj2', {
                    url: '/newtyj2?wap&uid',
                    templateUrl: 'template/activity/newtyj2.html' + date,
                    controller: 'newtyj2Controller'
                })
                // iPhone7推广页
                .state('iPhonead', {
                    url: '/iPhonead?wap',
                    templateUrl: 'template/activity/iPhonead.html' + date,
                    controller: 'iPhoneadController'
                })
                // 垂直管理推广页
                .state('czglad', {
                    url: '/czglad?wap',
                    templateUrl: 'template/activity/czglad.html'+date,
                    controller:'czgladController'
                })
                // 投即送推广页
                .state('tjsad', {
                    url: '/tjsad?wap',
                    templateUrl: 'template/activity/tjsad.html' + date,
                    controller: 'tjsadController'
                })
                // 开放日报名页
                .state('kfrEnrol', {
                    url: '/kfrEnrol?wap&openDayId',
                    templateUrl: 'template/myaccount/kfr-enrol.html' + date,
                    controller: 'kfrEnrolController'
                })
                // 优惠券温馨提示
                .state('reminder', {
                    url: '/reminder?wap&platform',
                    templateUrl: 'template/myaccount/reminder.html' + date
                })
                // app2.0翻牌
                .state('app2lottery', {
                    url: '/app2lottery?wap&version&uid&channel',
                    templateUrl: 'template/activity/app2lottery.html' + date,
                    controller: 'app2lotteryController'
                })
                // 小米推广页
                .state('xiaomiad', {
                    url: '/xiaomiad?wap&uid&channel&version',
                    templateUrl: 'template/activity/xiaomiad.html' + date,
                    controller: 'xiaomiadController'
                })
                // 开放日活动页
                .state('openday', {
                    url: '/openday?wap',
                    templateUrl: 'template/activity/openday.html' + date,
                    controller: 'opendayController'
                })
                // 公益列表页
                .state('publicWelfareList', {
                    url: '/publicWelfareList?wap',
                    templateUrl: 'template/activity/publicWelfareList.html' + date
                })
                // 公益活动页
                .state('publicWelfare', {
                    url: '/publicWelfare?wap&id',
                    templateUrl: 'template/activity/publicWelfare.html' + date
                })
                // 客服中心
                .state('serviceCenter', {
                    url: '/serviceCenter?wap',
                    templateUrl: 'template/pages/serviceCenter.html' + date
                })
                // 518理财节
                .state('festival518', {
                    url: '/festival518?wap&uid',
                    templateUrl: 'template/activity/festival518.html' + date,
                    controller: 'festival518Controller'
                })
                // 一站式资产服务平台
                .state('onestop', {
                    url: '/onestop',
                    templateUrl: 'template/activity/onestop.html' + date,
                    controller: 'onestopController'
                })
                // 端午节活动
                .state('dragonboat', {
                    url: '/dragonboat?wap',
                    templateUrl: 'template/activity/dragonboat.html' + date,
                    controller: 'dragonboatController'
                })
                // 2018新年活动
                .state('newYear2018', {
                    url: '/newYear2018?wap&uid&token',
                    templateUrl: 'template/activity/newYear2018.html' + date
                })
                // 优选理财列表页
                .state('normalcplist', {
                    url: '/normalcplist',
                    templateUrl: 'template/cp/normalcplist.html' + date,
                    controller: 'normalcplistController'
                })
                // 专属列表
                .state('exclusivecplist', {
                    url: '/exclusivecplist',
                    templateUrl: 'template/cp/exclusivecplist.html' + date
                })
                // 活动标列表页
                .state('activitycplist', {
                    url: '/activitycplist',
                    templateUrl: 'template/cp/activitycplist.html' + date,
                    controller: 'activitycplistController'
                })
                // 聚划算列表页
                .state('jhscplist', {
                    url: '/jhscplist',
                    templateUrl: 'template/cp/jhscplist.html' + date,
                    controller: 'jhscplistController'
                })
                // 抽奖活动列表页
                .state('cjhdcplist', {
                    url: '/cjhdcplist',
                    templateUrl: 'template/cp/cjhdcplist.html' + date,
                    controller: 'cjhdcplistController'
                })
                // 我的战队
                .state('myTeam', {
                    url: '/myTeam?uid',
                    templateUrl: 'template/zudui/myTeam.html' + date
                })
                // 组队活动页面
                .state('zdActivity', {
                    url: '/zdActivity',
                    templateUrl: 'template/zudui/zdActivity.html' + date
                })
                // 组队分享页面
                .state('zdShare', {
                    url: '/zdShare?tel&teamId&recommCode',
                    templateUrl: 'template/zudui/zdShare.html' + date
                })
                .state('zdShareResult', {
                    url: '/zdShareResult?pos',
                    templateUrl: 'template/zudui/zdShareResult.html' + date
                })
                // 组队活动页面
                .state('zudui', {
                    url: '/zudui',
                    templateUrl: 'template/zudui/zudui.html' + date
                })

                // 存管介绍页
                .state('introducedep', {
                    url: '/introducedep?wap&uid&token',
                    templateUrl: 'template/pages/introducedep.html' + date,
                    controller: 'introducedepController'
                })

                // 不知所云页面
                .state('whymeApp', {
                    url: '/whymeApp',
                    templateUrl: 'template/pages/whyme-app.html' + date
                })
                .state('realname', {
                    url: '/realname',
                    templateUrl: 'template/login/realname.html' + date
                })
                .state('password', {
                    url: '/password',
                    templateUrl: 'template/login/setpassword.html' + date
                })
                //AA信用评级页
                .state('creditRating', {
                    url: '/creditRating',
                    templateUrl: 'template/activity/creditRating.html' + date
                })
                //投资后分享活动
                .state('redBagStart', {
                    url: '/redBagStart?uid&shareLogId&investId',
                    templateUrl: 'template/investShare/redBagStart.html' + date
                })
                .state('redBagShare', {
                    url: '/redBagShare?uid&shareLogId&investId',
                    templateUrl: 'template/investShare/share.html' + date
                })
                .state('redBagzhuce', {
                    url: '/redBagzhuce?uid&phone&shareLogId&investId',
                    templateUrl: 'template/investShare/zhuce.html' + date
                })
                //恩弗教育
                .state('enfuRegSuccess', {
                    url: '/enfuRegSuccess',
                    templateUrl: 'template/enfu/enfuRegSuccess.html' + date
                })
                .state('enfu', {
                    url: '/enfu?source&token&uid',
                    templateUrl: 'template/enfu/enfuActivity.html' + date
                })
                .state('enfuCourses', {
                    url: '/enfuCourses?toFrom',
                    templateUrl: 'template/enfu/enfuCourses.html' + date
                })
                .state('enfuInvestSuc', {
                    url: '/enfuInvestSuc',
                    templateUrl: 'template/enfu/enfuInvestSuc.html' + date
                })
                .state('enfuReward', {
                    url: '/enfuReward?toFrom&id',
                    templateUrl: 'template/enfu/enfuReward.html' + date
                })
                .state('enfuinvest', {
                    url: '/enfuinvest?wap&pid',
                    templateUrl: 'template/enfu/enfuinvest.html' + date
                })
                //微信引导和分享
                .state('toWelfare', {
                    url: '/toWelfare?platform',
                    templateUrl: 'template/wechatWelfare/toWelfare.html' + date
                })
                .state('welfare', {
                    url: '/welfare',
                    templateUrl: 'template/wechatWelfare/welfare.html' + date
                })
                .state('goFollow', {
                    url: '/goFollow',
                    templateUrl: 'template/wechatWelfare/goFollow.html' + date
                })
                //京东e卡
                .state('jdekSem', {
                    url: '/jdekSem?toFrom',
                    templateUrl: 'template/activity/jdekSem.html' + date
                })
                //无京东e卡
                .state('jdnkSem', {
                    url: '/jdnkSem?toFrom',
                    templateUrl: 'template/activity/jdnkSem.html' + date
                })
                //新闻发布会专题页
                .state('conference', {
                    url: '/conference?wap',
                    templateUrl: 'template/activity/conference.html'+date,
                })
                //尾标奖详情页
                .state('tailawardDetail', {
                    url: '/tailawardDetail?wap',
                    templateUrl: 'template/activity/tailawardDetail.html' + date
                })
                // 关于沪深（信息披露）--现在（信息披露-关于我们）
                .state('abouths', {
                    url: '/abouths?wap',
                    templateUrl: 'template/pages/abouths.html' + date
                })
                // 公告
                .state('notice', {
                    url: '/notice?wap',
                    templateUrl: 'template/pages/noticeList.html' + date
                })
                // 关于沪深（信息披露）
                .state('showInfo', {
                    url: '/showInfo?wap',
                    templateUrl: 'template/pages/showInfo.html' + date
                })
                // 信息披露（信息公告）
                .state('bulletinInfo', {
                    url: '/bulletinInfo?wap',
                    templateUrl: 'template/pages/bulletinInfo.html' + date
                })
                // 信息披露（媒体动态）
                .state('mediaNews', {
                    url: '/mediaNews?wap&platform',
                    templateUrl: 'template/pages/mediaNews.html' + date
                })
                // 信息披露（网站公告）
                .state('siteNotice', {
                    url: '/siteNotice?wap&platform',
                    templateUrl: 'template/pages/siteNotice.html' + date
                })
                // 信息披露（平台数据）
                .state('listData', {
                    url: '/listData?wap',
                    templateUrl: 'template/pages/listData.html' + date
                })
                // 信息披露（企业荣誉）
                .state('companyHonor', {
                    url: '/companyHonor?wap',
                    templateUrl: 'template/pages/companyHonor.html' + date
                })
                // 信息披露（风险管理）
                .state('riskManage', {
                    url: '/riskManage?wap',
                    templateUrl: 'template/pages/riskManage.html' + date
                })
                // 信息披露（监管法规）
                .state('superviseRegulation', {
                    url: '/superviseRegulation?wap&proId&platform',
                    templateUrl: 'template/pages/superviseRegulation.html' + date
                })
                // 信息披露（联系我们）
                .state('contactUs', {
                    url: '/contactUs?wap',
                    templateUrl: 'template/pages/contactUs.html' + date
                })
                //运营报告
                .state('runReport', {
                    url: '/runReport?wap&platform&artiId',
                    templateUrl: 'template/activity/runReport.html' + date
                })
                //无京东e卡
                .state('liquSem', {
                    url: '/liquSem?toFrom',
                    templateUrl: 'template/activity/liquSem.html' + date
                })
                // 春节活动投资成功页
                .state('newYInvestSuc', {
                    url: '/newYInvestSuc?investAmount',
                    templateUrl: 'template/cp/newyear-invest-suc.html' + date,
                    controller: 'newYInvestSucCtrl'
                })
                // 春节活动奖品详情
                .state('chunjieprize2018', {
                    url: '/chunjieprize2018?activityId',
                    templateUrl: 'template/myaccount/chunjie2018-prize.html' + date
                })
                //新手理财
                .state('beginSem', {
                    url: '/beginSem?toFrom',
                    templateUrl: 'template/activity/beginSem.html' + date
                })
                //服务器升级公告
                .state('serverUpgrade', {
                    url: '/serverUpgrade',
                    templateUrl: 'template/pages/serverUpgrade.html' + date
                })
                //周排行
                .state('weekRanking', {
                    url: '/weekRanking',
                    templateUrl: 'template/weekRanking/weekRanking.html' + date
                })
                //周排行二
                .state('weekRankingSec', {
                    url: '/weekRankingSec',
                    templateUrl: 'template/weekRanking/weekRankingSec.html' + date
                })
                //会员福利日
                .state('memberWelfare', {
                    url: '/memberWelfare?wxGetSize&toFrom',
                    templateUrl: 'template/memberWelfare/memberWelfare.html' + date
                })
                //解绑银行卡
                .state('unbindingBank', {
                    url: '/unbindingBank',
                    templateUrl: 'template/myaccount/unbindingBank.html' + date
                })
                //贴息
                .state('interestSubsidy', {
                    url: '/interestSubsidy',
                    templateUrl: 'template/interestSubsidy/interestSubsidy.html' + date
                })
                //电子合同介绍页
                .state('eContractIntroduce', {
                    url: '/eContractIntroduce',
                    templateUrl: 'template/pages/eContractIntroduce.html' + date
                })
                //碰碰购
                .state('ppBuy', {
                    url: '/ppBuy',
                    templateUrl: 'template/activity/ppBuy.html' + date
                })
                //三级邀请活动链接页
                .state('thirdInvitationActivity', {
                    url: '/thirdInvitationActivity?wap&recommCode&mobilePhone&realName',
                    templateUrl: 'template/activity/thirdInvitationActivity.html' + date
                })
                //三级邀请活动链接页旧版
                // .state('welcom', {
                //     url: '/welcom?toFrom&recommCode&realName&mobilePhone',
                //     templateUrl: 'template/activity/thirdInvitationActivity.html' + date
                // })

                //三级邀请
                .state('thirdInvitation', {
                    url: '/thirdInvitation',
                    templateUrl: 'template/thirdInvitation/thirdInvitation.html' + date
                })
                    //三级邀请旧版
                // .state('myInvitation', {
                //     url: '/myInvitation',
                //     templateUrl: 'template/thirdInvitation/thirdInvitation.html' + date
                // })
                //品轩
                .state('pinxuanSem', {
                    url: '/pinxuanSem?wap',
                    templateUrl: 'template/activity/pinxuan.html' + date
                })

        })
    /*---------------------------Banner-----------------------------------*/
    rootApp.directive(
        'myBanner',
        function () {
            var temp = '<div class="swiper-container swiper-container-h" style="width:100%;height:13.54667rem">' +
                '<div class="swiper-wrapper">' +
                '</div>' +
                '<div class="swiper-pagination swiper-pagination-h"></div>' +
                '</div>';
            return {
                restrict: 'E',
                template: temp,
                replace: true,
                scope: {
                    banner: '=',
                    seconds: '='
                },
                controller: [
                    '$scope',
                    '$state',
                    'resourceService',
                    '$filter',
                    '$timeout',
                    '$element',
                    '$localStorage',
                    '$compile',
                    function ($scope, $state, resourceService, $filter, $timeout, $element, $localStorage, $compile) {
                        if ($localStorage.user != undefined) {
                            $scope.userId = '&uid=' + $localStorage.user.member.uid;
                        } else { $scope.userId = ''; };
                        var str = "";
                        $scope.$watch(function () { return $scope.banner }, function (n, o) {
                            if (n && n.length > 0) {
                                for (var i = 0; i < n.length; i++) {
                                    // str += '<div class="swiper-slide"><a target="_blank" href="' + n[i].location + "&wap=true" + $scope.userId + '"><img ng-src="' + n[i].imgUrl + '" alt=""></a></div>';
                                    // str += '<div class="swiper-slide"><a target="_blank" href="' + n[i].location + '"><img ng-src="' + n[i].imgUrl + '" alt=""></a></div>';
                                    str += '<div class="swiper-slide"><a  href="' + n[i].location + "?artiId=" + n[i].artiId + '"><img ng-src="' + n[i].imgUrl + '" alt=""></a></div>';
                                }
                                $element[0].childNodes[0].innerHTML = str;
                                $compile($element[0].childNodes[0])($scope);
                                $timeout(function () {
                                    swiperH = new Swiper('.swiper-container-h', {
                                        pagination: '.swiper-pagination-h',
                                        paginationClickable: true,
                                        spaceBetween: 0,
                                        autoplay: $scope.seconds,
                                        autoplayDisableOnInteraction: false,
                                        preventClicks : false
                                    });
                                });
                            }
                        })
                    }],
            };
        }
    );
    rootApp.directive(
        'eContraBanner',
        function () {
            /*var temp = '<div class="swiper-container">' +
                '<div class="swiper-wrapper">' +
                '</div>' +
                '<div class="swiper-button-prev"></div>' +
                '<div class="swiper-button-next"></div>' +
                '</div>';*/
            var temp = '<div class="swiper-container swiper-container-h">' +
                '<div class="swiper-over-wrapper">' +
                '<div class="swiper-wrapper">' +
                '</div></div>' +
                '<div class="swiper-button-prev"></div>' +
                '<div class="swiper-button-next"></div>' +
                '</div>';
            return {
                restrict: 'E',
                template: temp,
                replace: true,
                scope: {
                    banner: '=',
                    seconds: '='
                },
                controller: [
                    '$scope',
                    '$state',
                    'resourceService',
                    '$filter',
                    '$timeout',
                    '$element',
                    '$localStorage',
                    '$compile',
                    function ($scope, $state, resourceService, $filter, $timeout, $element, $localStorage, $compile) {
                        var str = "";
                        $scope.$watch(function () { return $scope.banner }, function (n, o) {
                            if (n && n.length > 0) {
                                for (var i = 0; i < n.length; i++) {
                                    // str += '<div class="swiper-slide"><a target="_blank" href="' + n[i].location + "&wap=true" + $scope.userId + '"><img ng-src="' + n[i].imgUrl + '" alt=""></a></div>';
                                    // str += '<div class="swiper-slide"><a target="_blank" href="' + n[i].location + '"><img ng-src="' + n[i].imgUrl + '" alt=""></a></div>';
                                    str += '<div class="swiper-slide"><img ng-src="' + n[i].imgUrl + '" alt=""></div>';
                                }
                                $element[0].childNodes[0].childNodes[0].innerHTML = str;
                                $compile($element[0].childNodes[0].childNodes[0])($scope);
                                $timeout(function () {
                                    swiperH = new Swiper('.swiper-over-wrapper', {
                                        spaceBetween: 0,
                                        autoplay: $scope.seconds,
                                        autoplayDisableOnInteraction: false,
                                        nextButton: '.swiper-button-next',
                                        prevButton: '.swiper-button-prev'
                                    });
                                });
                            }
                        })
                    }]
            };
        }
    );
    rootApp.directive(
        'ngSwiper',
        function () {
            var temp = '<div class="swiper-container {{ngSwiper.name}}" ng-transclude>' +

                '</div>';
            return {
                restrict: 'A',
                template: temp,
                replace: true,
                scope: {
                    ngSwiperConf: '=',
                    ngSwiper: "="
                },
                transclude: true,
                controller: [
                    '$scope',
                    '$timeout',
                    '$element',
                    '$compile',
                    function ($scope, $timeout, $element, $compile) {
                        $scope.ngSwiper.initSwiper = function () {
                            $timeout(function () {
                                $scope.ngSwiper.swiper = new Swiper("." + $scope.ngSwiper.name, $scope.ngSwiperConf);
                            });
                        }
                        if ($scope.ngSwiper.readyLoading) {
                            $scope.ngSwiper.initSwiper();
                        }
                    }
                ],
            };
        });
    /*进度条*/
    rootApp.directive(
        'myCirclePlan',
        function () {
            var temp = '<div class="prg-cont rad-prg" id="progress">12</div>'
            return {
                restrict: 'E',
                // templateUrl:'template/cp/cpTpl.html',
                template: temp,
                replace: false,
                transclude: true,
                scope: true,
                controller: [
                    '$scope',
                    '$state',
                    'resourceService',
                    '$filter',
                    '$element',
                    function ($scope, $state, resourceService, $filter, $element) {

                        $('#progress1').radialIndicator({
                            initValue: 10,
                            displayNumber: false
                        });
                    }],
            };
        }
    );
    // sem页面公共注册部分
    rootApp.directive('commonReg', function () {
        return {
            restrict: "E",
            scope: true,
            templateUrl: 'template/login/commonRegist.html',
            // controllerUrl: 'js/conttrollers/activity/commonSemCtrl.js'
        };
    })
    /*刮刮卡*/
    rootApp.directive(
        'ggk',
        function () {
            var temp = '<div id="scratch">' +
                '<div id="card">￥5000000元</div>' +
                '</div>'
            return {
                restrict: 'E',
                // templateUrl:'template/cp/cpTpl.html',
                template: temp,
                replace: false,
                transclude: true,
                scope: true,
                controller: [
                    '$scope',
                    '$state',
                    'resourceService',
                    '$filter',
                    '$element',
                    function ($scope, $state, resourceService, $filter, $element) {
                    }],
            };
        }
    );

    // 推广页注册
    rootApp.directive('login',function () {
        return {
            restrict: 'E',
            transclude: true,
            templateUrl: 'template/login/loginTemp.html',
            controllerUrl: 'loginTempCtrl'
        }

    });

    // 浮动小窗口
    rootApp.directive('floatMenu',function () {
        return {
            restrict: 'E',
            transclude: true,
            templateUrl: 'template/floatMenu.html',
            controllerUrl: 'floatMenuCtrl'
        }

    });
    
    // 提现金额小于余额
    rootApp.directive('withdrawlimit', function () {
        return {
            restrict: "A",
            require: 'ngModel',
            link: function (scope, elem, attrs, ngModelController) {
                ngModelController.$parsers.unshift(function (viewVal) {
                    if (scope.cash.funds <= 500000) {
                        if (viewVal == '') {
                            ngModelController.$setValidity("withdrawlimit", true);
                            return viewVal;
                        }
                        if (viewVal <= scope.cash.funds) {
                            ngModelController.$setValidity("withdrawlimit", true);
                            return viewVal;
                        }
                        else {
                            ngModelController.$setValidity("withdrawlimit", false);
                            return undefined;
                        }
                    } else {
                        ngModelController.$setValidity("withdrawlimit", true);
                        return viewVal;
                    }
                })
            }
        }
    });

    // 提现金额单笔最高限额
    rootApp.directive('maxlimit', function () {
        return {
            restrict: "A",
            require: 'ngModel',
            link: function (scope, elem, attrs, ngModelController) {

                ngModelController.$parsers.unshift(function (viewVal) {
                    if (scope.cash.funds > 500000) {
                        if (viewVal == '' || scope.cashForm.cash.$error.withdrawlimit) {
                            ngModelController.$setValidity("maxlimit", true);
                            return viewVal;
                        }
                        if (viewVal <= 500000) {
                            ngModelController.$setValidity("maxlimit", true);
                            return viewVal;
                        }
                        else {
                            ngModelController.$setValidity("maxlimit", false);
                            return undefined;
                        }
                    } else {
                        ngModelController.$setValidity("maxlimit", true);
                        return viewVal;
                    }
                });
            }
        };
    });

    // 输入金额大于1
    rootApp.directive('morethan', function () {
        return {
            restrict: "A",
            require: 'ngModel',
            link: function (scope, elem, attrs, ngModelController) {
                ngModelController.$parsers.unshift(function (viewVal) {
                    if (viewVal == '') {
                        ngModelController.$setValidity("morethan", true);
                        return viewVal;
                    }
                    if (viewVal >= 1) {
                        ngModelController.$setValidity("morethan", true);
                        return viewVal;
                    } else {
                        ngModelController.$setValidity("morethan", false);
                        return undefined;
                    }
                });
            }
        };
    });

    rootApp.directive('morethan3', function () {
        return {
            restrict: "A",
            require: 'ngModel',
            link: function (scope, elem, attrs, ngModelController) {
                ngModelController.$parsers.unshift(function (viewVal) {
                    if (viewVal == '') {
                        ngModelController.$setValidity("morethan3", true);
                        return viewVal;
                    }
                    if (viewVal >= 3) {
                        ngModelController.$setValidity("morethan3", true);
                        return viewVal;
                    } else {
                        ngModelController.$setValidity("morethan3", false);
                        return undefined;
                    }
                });
            }
        };
    });
    rootApp.directive('noRecord', function () {
        return {
            restrict: "E",
            require: 'ngModel',
            scope: {              // 设置指令对于的scope
                txt: "@",          // txt 值传递 （字符串，单向绑定）
                img: "="        // img 引用传递（双向绑定）
            },
            template: '<div class="no-act"><img src="/images/myaccount/ico_record.png" alt=""><p>暂无记录</p></div>'
        }
    });

    rootApp.directive('more3', function () {
        return {
            restrict: "A",
            require: 'ngModel',
            link: function (scope, elem, attrs, ngModelController) {
                ngModelController.$parsers.unshift(function (viewVal) {
                    if (viewVal == '') {
                        ngModelController.$setValidity("more3", true);
                        return viewVal;
                    }
                    if (viewVal >= 3) {
                        ngModelController.$setValidity("more3", true);
                        return viewVal;
                    } else {
                        ngModelController.$setValidity("more3", false);
                        return undefined;
                    }
                });
            }
        };
    });

    // 充值金额小于单笔限额
    rootApp.directive('rechargelimit', function () {
        return {
            restrict: "A",
            require: 'ngModel',
            link: function (scope, elem, attrs, ngModelController) {

                ngModelController.$parsers.unshift(function (viewVal) {
                    if (viewVal == '') {
                        ngModelController.$setValidity("rechargelimit", true);
                        return viewVal;
                    }
                    if (viewVal <= scope.singleQuota) {
                        ngModelController.$setValidity("rechargelimit", true);
                        return viewVal;
                    } else {
                        ngModelController.$setValidity("rechargelimit", false);
                        return undefined;
                    }
                });
            }
        };
    });
    // -----------------------------------------------server---------------------------------------------//
    rootApp.factory(
        'resourceService',
        ['$state', '$resource', '$http', '$rootScope', 'ngDialog', '$filter', '$localStorage', 'md5','$location','isWeixin', function ($state, $resource, $http, $rootScope, ngDialog, $filter, $localStorage, md5,$location,isWeixin) {
            return new resourceService($resource, $http, $state, $rootScope, ngDialog, $filter, $localStorage, md5,$location,isWeixin);
        }]);
    function resourceService(resource, http, $state, $rootScope, ngDialog, $filter, $localStorage, md5,$location,isWeixin) {
        var actions = {
            'query': {
                method: 'GET'
            },
            'queryPost': {
                method: 'POST'
            },
            'toJsonP': {
                method: 'JSONP'
            }
        };
        //加载json模板页面
        this.getJsonPServer = function (scope, url, data, type) {
            showMask($rootScope);
            var queryResource = resource(url, {}, actions);
            queryResource.toJsonP(data, function (data) {
                removeMask($rootScope);
                scope.$broadcast('resourceService_GET_JSON.MYEVENT', data, type);
            }, function (error) {
                removeMask($rootScope);
                $filter('errorUserMessages')('netErro', ngDialog, scope);
            });
        };//加载json模板页面
        this.getJsonServer = function (scope, url, data, type) {
            showMask($rootScope);
            var queryResource = resource(url, {}, actions);
            queryResource.query(data, function (data) {
                removeMask($rootScope);
                scope.$broadcast('resourceService_GET_JSON.MYEVENT', data, type);
            }, function (error) {
                removeMask($rootScope);
                $filter('errorUserMessages')('netErro', ngDialog, scope);
            });
        };
        //查找
        this.queryPost = function (scope, url, data, type) {
            scope.submitBool = false;
            showMask($rootScope);
            /*临时改变时间*/
            var queryResource = resource(url, {}, actions);
            if (!data.version) {
                data.version = $rootScope.version;
            }
            if (!data.channel) {
                if(isWeixin()==true){
                    data.channel = 5;
                }
                else{
                    data.channel = $rootScope.channel;
                }
            }
            if (!data.token) {
                data.token = $filter('isRegister')().user.token;
            }
            if (data.passWord != undefined) {
                data.passWord = hex_sha256(md5.createHash(data.passWord || ''));
            }
            if (data.tpwd != undefined) {
                data.tpwd = hex_sha256(md5.createHash(data.tpwd || ''));
            }
            if (data.tpw != undefined) {
                data.tpw = hex_sha256(md5.createHash(data.tpw || ''));
            }
            if (data.pwd != undefined) {
                data.pwd = hex_sha256(md5.createHash(data.pwd || ''));
            }
            queryResource.queryPost(data, function (data) {
                scope.submitBool = true;
                removeMask($rootScope);
                if (data.success) {
                    scope.$broadcast('resourceService.QUERY_POST_MYEVENT', data, type);
                } else {
                    if (data.errorCode == '9999') {
                        // $state.go('404');
                        $filter('服务器信息')(data.errorCode, scope, 'y');
                        if($rootScope.fromNative) {
                            document.location = 'hushenloginError:';
                        } else  {
                            scope.onClick = function (type) {
                                if (type == 'yes') {
                                    delete $localStorage.user;
                                    ngDialog.close();
                                    $state.go('main.home');
                                }
                            }
                        }
                    } else if (data.errorCode == '9998') {
                        $filter('实名认证错误信息')(data.errorCode, scope, 'y');
                        if($rootScope.fromNative) {
                            document.location = 'hushenloginError:';
                        } else {
                            scope.onClick = function (type) {
                                if (type == 'yes') {
                                    delete $localStorage.user;
                                    ngDialog.close();
                                    $state.go('dl');
                                }
                            }
                        }
                    }
                    else if (data.errorCode == 'XTWH') {
                        window.location.href = 'https://hushenlc.cn/template/pages/maintenance.html';
                    }
                    else {
                        scope.$broadcast('resourceService.QUERY_POST_MYEVENT', data, type);
                    }
                }
            }, function (error) {
                removeMask($rootScope);
            });
        };
        /******静态调结束*******/
        function showMask(rootSp) {
            rootSp.maskHidde = true;
        };
        function removeMask(rootSp) {
            rootSp.maskHidde = false;
        };
    };
    // 存管2.0
    rootApp.factory('postcallService', function () {
        return function (url, param, target) {
            var params = JSON.parse(param);
            var tempform = document.createElement("form");
            tempform.action = url;
            tempform.method = "POST";
            tempform.style.display = "none";
            if (target) {
                tempform.target = target;
            }
            for (var x in params.message) {
                if (x != 'signature') {
                    var opt = document.createElement("input");
                    opt.type = 'hidden';
                    opt.name = x;
                    opt.value = params.message[x];
                    tempform.appendChild(opt);
                }
            }
            var opt = document.createElement("input");
            opt.name = 'signature';
            opt.type = 'hidden';
            opt.value = params.signature;
            tempform.appendChild(opt);
            document.body.appendChild(tempform);
            tempform.submit();
            document.body.removeChild(tempform);
        }
    })
    // 存管3.0
    // rootApp.factory('postcallService',function(){
    //     return function(url, param, target){
    //         var tempform = document.createElement("form");  
    //         tempform.action = url;  
    //         tempform.method = "POST";  
    //         tempform.style.display="none"  
    //         if(target) {  
    //             tempform.target = target;  
    //         }  
    //         var opt = document.createElement("input");  
    //         opt.name = 'json';  
    //         opt.value = param;  
    //         tempform.appendChild(opt);  
    //         document.body.appendChild(tempform);  
    //         tempform.submit();  
    //         document.body.removeChild(tempform);  
    //     }
    // })
    // 微信签名
    rootApp.factory('signWeChatService', function () {
        return function () {
            var urlstr = window.location.href;
            if (urlstr.split('.com').length < 2 || (urlstr.split('.com').length > 1 && urlstr.split('.com')[1] == "/")) {
                if (urlstr.substring(urlstr.length - 1, urlstr.length) == "/") {
                    urlstr += "main/home";
                } else {
                    urlstr += "/main/home";
                }
            };
            urlstr.incode
            $.ajax({
                url: '/product/signWeChat.dos',
                type: 'post',
                data: { url: urlstr, version: '1.0.0', channel: '3' },
                success: function (data) {
                    data = angular.fromJson(data);
                    if (data.success) {
                        wx.config({
                            debug: false,
                            appId: data.map.appid,
                            timestamp: data.map.timestamp,
                            nonceStr: data.map.noncestr,
                            signature: data.map.sign,
                            jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage', 'onMenuShareQQ', 'onMenuShareWeibo', 'onMenuShareQZone']
                        });
                    };
                }
            });
        }
    })
    // 信息共享
    rootApp.factory("ShareData",function(){
        return {
            shareObj:{},
            //获取共享数据对象
            getShareData: function(){
                return this.shareObj;
            },
            //设置产品信息
            setProductInfo: function(pInfo){
                this.shareObj.cp = pInfo;
            },
            setLink: function(link){
                this.shareObj.link = link;
            }
        };
    })
});