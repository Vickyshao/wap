/* 
* @Author: lee
* @Date:   2016-01-10 23:29:04
* @Last Modified by:   Ellie
* @Last Modified time: 2018-01-23 18:51:57
*/

'use strict';

define([
    'js/module.js'
    , 'ngdialog'
]
    , function (controllers, ngdialog) {

        controllers.controller('controllerSign'
            , ['$scope', '$rootScope'
                , 'resourceService'
                , '$filter'
                , '$state'
                , 'md5'
                , '$localStorage'
                , '$stateParams'
                , '$location'
                , 'ngDialog'
                , '$sce'
                , function ($scope, $rootScope, resourceService, $filter, $state, md5, $localStorage, $stateParams, $location, ngDialog, $sce) {
                    $scope.toback = function () {
                        if ($localStorage.pathUrl[$localStorage.pathUrl.length-1] == 'main.myaccountHome') {
                            $filter('跳回上一页')(2);
                        } else {
                            $filter('跳回上一页')();
                        }
                    };
                    if ($location.$$search.toFrom != undefined || $location.$$search.recommCode != undefined || $location.$$search.tid != undefined) {
                        $localStorage.webFormPath = $location.$$search;
                    };
                    $scope.userLogin = {};
                    $scope.sbmit = function (tegForm) {
                        resourceService.queryPost($scope, $filter('getUrl')('login'), $scope.userLogin, { name: 'login', tegForm: tegForm });
                    }
                    if($stateParams.mobilephone) {
                        $scope.userLogin.mobilephone = $stateParams.mobilephone;
                    }
                    $scope.types = true;
                    $scope.showPwd = function () {
                        $scope.type = $('#pwd').attr('type');
                        if($scope.type == 'password') {
                            $('#pwd').attr('type','text');
                            $('.eyes').removeClass('icon-openeyes').addClass('icon-closeeyes');
                        } else {
                            $('#pwd').attr('type','password');
                            $('.eyes').removeClass('icon-closeeyes').addClass('icon-openeyes');
                        }
                    }
                    $scope.blue = function (event) {
                        $(event.target).parents('.common-box').addClass('focus');
                    }
                    $scope.removeblue = function (event) {
                        $(event.target).parents('.common-box').removeClass('focus');
                    }
                    $scope.findPwd = function (tegForm) {
                        ngDialog.closeAll();
                        if(tegForm.mobilephone.$valid){
                                resourceService.queryPost($scope, $filter('getUrl')('getPhone'), {
                                    mobilephone: $scope.userLogin.mobilephone
                                }, { name: '注册验证手机号', tegForm: tegForm });
                        } else {
                            $filter('zuceError')('1001');
                        }
                    }
                    if ($filter('isRegister')().user && $filter('isRegister')().user.member && $filter('isRegister')().user.member.uid) {
                        // if ($stateParams.returnurl) {
                        //     $state.go($stateParams.returnurl, { wap: true });
                        // } else {
                        //     $state.go("main.myaccountHome");
                        // }
                        if ($state.params.returnurl) {
                            if ($state.params.returnurl.indexOf('?') != -1) {
                                var router = $state.params.returnurl.split('?')[0];
                                var params = $state.params.returnurl.split('?')[1];
                                var obj = {};
                                var array = params.split("&");
                                if (array.length > 1) {
                                    for (var i = 0; i < array.length; i++) {
                                        obj[array[i].split("=")[0]] = array[i].split("=")[1];
                                    }
                                } else {
                                    obj[array[0].split("=")[0]] = array[0].split("=")[1];
                                }
                                obj.wap = true;
                                $state.go(router, obj);
                            } else {
                                $state.go($state.params.returnurl, { wap: true });
                            }
                        } else {
                            $state.go("main.myaccountHome");
                        }
                    }
                    $scope.toRegister = function () {
                        $scope.returnurl = $stateParams.returnurl?$stateParams.returnurl:'';
                        if ($stateParams.toFrom || ($localStorage.webFormPath && $localStorage.webFormPath.toFrom)) {
                            $scope.toFrom = $stateParams.toFrom || $localStorage.webFormPath.toFrom;
                            $state.go('zhuce',{source: $stateParams.source ,toFrom: $scope.toFrom });
                        } else {
                            $state.go('zhuce',{source: $stateParams.source, returnurl: $scope.returnurl });
                        }
                    }
                    $scope.$on('resourceService.QUERY_POST_MYEVENT', function (event, data, type) {
                        switch (type.name) {
                            case 'login':
                                if (data.success) {
                                    $localStorage.user = data.map;
                                    $scope.isDs = data.map.isDs;
                                    $localStorage.hongbaoeveryday = 1;
                                    // if ($localStorage.specialLogin == true) {
                                    //     // $rootScope.$emit('loginSuccess',true);
                                    //     $state.go('special',{wap:true});
                                    // } else {
                                    if ($state.params.returnurl) {
                                        if ($state.params.returnurl.indexOf('?') != -1) {
                                            var router = $state.params.returnurl.split('?')[0];
                                            var params = $state.params.returnurl.split('?')[1];
                                            var obj = {};
                                            var array = params.split("&");
                                            if (array.length > 1) {
                                                for (var i = 0; i < array.length; i++) {
                                                    obj[array[i].split("=")[0]] = array[i].split("=")[1];
                                                }
                                            } else {
                                                obj[array[0].split("=")[0]] = array[0].split("=")[1];
                                            }
                                            obj.wap = true;
                                            $state.go(router, obj);
                                        } else {
                                            $state.go($state.params.returnurl, { wap: true });
                                        }
                                    } else {
                                        if($rootScope.getUrlParam('eCommerce') == 'true') {
                                            if($scope.isDs) {
                                                $state.go("reimburse");
                                            } else {
                                                $state.go("main.myaccountHome");
                                            }
                                        } else if($stateParams.source == 'egg') {
                                                $state.go("dropEgg",{ source: 'egg'});
                                        } else {
                                            if ($localStorage.pathUrl[$localStorage.pathUrl.length-1]) {
                                                $filter('跳回上一页')();
                                            } else {
                                                $state.go("main.myaccountHome");
                                            }
                                        }
                                    }

                                    var userObj = {};
                                    userObj.uid = data.map.member.uid;
                                    if ($scope.user) { obj.uid = $scope.user.uid; }
                                    resourceService.queryPost($scope, $filter('getUrl')('shouYe'), userObj, { name: 'index' });

                                    // }
                                } else {
                                    $scope.errorMsg = data.errorMsg;
                                    $scope.loginErrorNums = data.map.loginErrorNums;
                                    if ($scope.errorMsg.indexOf('锁定') != -1 && data.errorCode == 1003) {
                                        $filter('登陆错误超过5次')(data.errorCode, $scope, 'y')
                                        var codePos = $scope.errorMsg.indexOf('分钟');
                                        var codePos2 = $scope.errorMsg.indexOf('请');
                                        $scope.errorMsg1 = $scope.errorMsg.slice(0,codePos2+1) + '<i>' + $scope.errorMsg.slice(codePos2+1,codePos) + '</i>' + $scope.errorMsg.slice(codePos,$scope.errorMsg.length);
                                        $scope.errorMsg2 = $sce.trustAsHtml($scope.errorMsg1);
                                    } else {
                                        $filter('登陆错误信息')(data.errorCode, $scope, 'y')
                                        changeIMG();
                                    }
                                    $scope.userLogin.passWord = null;
                                }
                                break;
                            case 'index':
                                if (data.success) {
                                    $localStorage.yuandanIsAlert = data.map.isAlter;
                                }
                                break;
                            case '注册验证手机号':
                                if (data.success) {
                                    if (data.map.exists) { //已有用户名
                                        $scope.returnurl = $stateParams.returnurl?$stateParams.returnurl:'';
                                        $scope.hasPhone = true;
                                        $state.go('findPwd',{forget: true,mobilePhone: $scope.userLogin.mobilephone,returnurl: $scope.returnurl});
                                    } else {
                                        $scope.hasPhone = false;
                                        $filter('zuceError')('1019');
                                    };
                                }
                                break;

                        };
                    });
                    var changePicEvent;
                    $scope.clickInput = function (event) {
                        // $scope.userLogin.picCode = null;
                        changePicEvent = event;
                        changeIMG(changePicEvent);
                    };
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
                }
            ]);

        // 关于我们
        controllers.controller('GYWMCtrl', ['$scope', '$rootScope', 'resourceService', '$http', '$filter', '$state', function ($scope, $rootScope, resourceService, $http, $filter, $state) {
            $rootScope.title = $scope.title = '关于沪深';
            $scope.wap = $state.params.wap;
            $filter('isPath')('GYWM');
            $scope.toback = function () {
                $filter('跳回上一页')(2);
            };
            $scope.goto = function (url) {
                switch (url) {
                    case '公司介绍':
                        if ($scope.wap == 'true') {
                            $state.go('GSJS', { wap: true });
                        }
                        else {
                            $state.go('GSJS');
                        }
                        break;
                    case '股东介绍':
                        if ($scope.wap == 'true') {
                            $state.go('GDJS', { wap: true });
                        }
                        else {
                            $state.go('GDJS');
                        }
                        break;
                    case '管理团队':
                        if ($scope.wap == 'true') {
                            $state.go('GLTD', { wap: true });
                        }
                        else {
                            $state.go('GLTD');
                        }
                        break;
                    case '公司资质':
                        if ($scope.wap == 'true') {
                            $state.go('GSZZ', { wap: true });
                        }
                        else {
                            $state.go('GSZZ');
                        }
                        break;
                    case '一亿验资':
                        if ($scope.wap == 'true') {
                            $state.go('YYYZ', { wap: true });
                        }
                        else {
                            $state.go('YYYZ');
                        }
                        break;
                    case '网站公告':
                        if ($scope.wap == 'true') {
                            $state.go('WZGG', { wap: true });
                        }
                        else {
                            $state.go('WZGG');
                        }
                        break;
                    case '安全保障':
                        if ($scope.wap == 'true') {
                            $state.go('aqbz', { wap: true });
                        }
                        else {
                            $state.go('aqbz');
                        }
                        break;
                };
            }
        }]);
        // 公司介绍
        controllers.controller('GSJSCtrl', ['$scope', '$rootScope', 'resourceService', '$http', '$filter', '$state', '$stateParams', function ($scope, $rootScope, resourceService, $http, $filter, $state, $stateParams) {
            $rootScope.title = $scope.title = '公司介绍';
            $scope.wap = $rootScope.getUrlParam('wap');
            $scope.platform = $rootScope.getUrlParam('platform');
            $scope.toback = function () {
                $filter('跳回上一页')(1);
            };
            if(($scope.platform == 'i') || ($scope.platform == 'A') ){
                $('.zjjs-content').css('margin-top','0');
                $('.common-head').css('display','none');
                $scope.wap = false;
            }
        }]);
        // 股东介绍
        controllers.controller('GDJSCtrl', ['$scope', '$rootScope', 'resourceService', '$http', '$filter', '$state', '$stateParams', function ($scope, $rootScope, resourceService, $http, $filter, $state, $stateParams) {
            $rootScope.title = $scope.title = '股东介绍';
            $scope.wap = $rootScope.getUrlParam('wap');
            $scope.toback = function () {
                $filter('跳回上一页')(1);
            };
        }])
        // 管理团队
        controllers.controller('GLTDCtrl', ['$scope', '$rootScope', 'resourceService', '$http', '$filter', '$state', '$stateParams', function ($scope, $rootScope, resourceService, $http, $filter, $state, $stateParams) {
            $rootScope.title = $scope.title = '管理团队';
            $scope.wap = $rootScope.getUrlParam('wap');
            $scope.toback = function () {
                $filter('跳回上一页')(1);
            };
        }])
        // 公司资质
        controllers.controller('GSZZCtrl', ['$scope', '$rootScope', 'resourceService', '$http', '$filter', '$state', '$stateParams', function ($scope, $rootScope, resourceService, $http, $filter, $state, $stateParams) {
            $rootScope.title = $scope.title = '公司资质';
            $scope.wap = $rootScope.getUrlParam('wap');
            $scope.platform = $rootScope.getUrlParam('platform');
            $scope.toback = function () {
                $filter('跳回上一页')(1);
            };
            if(($scope.platform == 'i') || ($scope.platform == 'A') ){
                $('.gszz-content').css('margin-top','0');
            }
        }])
        // 一亿验资
        controllers.controller('YYYZCtrl', ['$scope', '$rootScope', 'resourceService', '$http', '$filter', '$state', '$stateParams', function ($scope, $rootScope, resourceService, $http, $filter, $state, $stateParams) {
            $rootScope.title = $scope.title = '一亿验资';
            $scope.wap = $rootScope.getUrlParam('wap');
            $scope.platform = $rootScope.getUrlParam('platform');
            $scope.toback = function () {
                $filter('跳回上一页')(1);
            };;
            if(($scope.platform == 'i') || ($scope.platform == 'A') ){
                $('.gszz-content').css('margin-top','0');
            }
        }]);

        // 股权结构
        controllers.controller('GQJGCtrl', ['$scope', '$rootScope', 'resourceService', '$http', '$filter', '$state', '$stateParams', function ($scope, $rootScope, resourceService, $http, $filter, $state, $stateParams) {
            $scope.wap = $rootScope.getUrlParam('wap');
            $scope.platform = $rootScope.getUrlParam('platform');
            $scope.toback = function () {
                $filter('跳回上一页')(1);
            };
            if(($scope.platform == 'i') || ($scope.platform == 'A') ){
                $('.gqjgCont').css('margin-top','0');
            }
        }]);
        controllers.controller('WZGGCtrl', function ($scope, resourceService, $filter, $state,$rootScope) {
            $scope.platform = $rootScope.getUrlParam('platform');
            $scope.wap = $rootScope.getUrlParam('wap') && !($scope.platform == 'i' || $scope.platform == 'A');
            $rootScope.title = $scope.title = '网站公告';
            $filter('isPath')('WZGG');
            $scope.toback = function () {
                $filter('跳回上一页')(2);
            };
            if(($scope.platform == 'i') || ($scope.platform == 'A') ){
                $('.wzgg-content').css('margin-top','0');
            }
            var isLoad = true;
            var pageOn = 1;
            $scope.ggList = [];
            $scope.loadMore = function (item) {
                if (item.id == $scope.ggList[$scope.ggList.length - 1].id) {
                    if (isLoad) {
                        if (pageOn != $scope.page.pageOn) {
                            var obj = {
                                pageOn: pageOn,
                                pageSize: 10,
                                proId: 14
                            };
                            resourceService.queryPost($scope, $filter('getUrl')('网站公告'), obj, { name: '公告列表' });
                            isLoad = false;
                        }
                    };
                };
            };
            var objs = {};
            objs.proId = 14;
            resourceService.queryPost($scope, $filter('getUrl')('网站公告'), objs, { name: '公告列表' });
            $scope.$on('resourceService.QUERY_POST_MYEVENT', function (event, data, eObj) {
                switch (eObj.name) {
                    case '公告列表':
                        $scope.page = data.map.page;
                        if (pageOn == $scope.page.pageOn) {
                            isLoad = true;
                        }
                        if (data.map.page.pageOn <= data.map.page.totalPage) {
                            pageOn = $scope.page.pageOn + 1;
                            for (var i = 0; i < data.map.page.rows.length; i++) {
                                $scope.ggList.push(data.map.page.rows[i]);
                            }
                        } else {
                            isLoad = false;
                        }
                        break;
                };
            });
            $scope.goto = function (id) {
                if ($scope.wap) {
                    $state.go('GGXQ', { wap: true, artiId: id});
                }
                else {
                    $state.go('GGXQ', { artiId: id });
                }
            }
        })
        controllers.controller('GGXQCtrl', function ($scope, resourceService, $filter,$localStorage, $stateParams, $state, $rootScope) {
            $scope.platform = $rootScope.getUrlParam('platform');
            if($rootScope.fromNative){
                $('.ggxq-content').css('marginTop','0');
            }
            if ($stateParams.wap) {
                //$scope.wap = $stateParams.wap;
                $scope.wap = $rootScope.getUrlParam('wap') && !($scope.platform == 'i' || $scope.platform == 'A');
            }
            $scope.from = $stateParams.from;
            if ($stateParams.from == 'kfr') {
                $rootScope.title = $scope.title = '活动详情';
            } else if($stateParams.from == 'mtdt') {
                $rootScope.title = $scope.title = '媒体动态';
            } else if($stateParams.from == 'jgfg') {
                $rootScope.title = $scope.title = '监管法规';
            } else {
                $rootScope.title = $scope.title = '网站公告';
                $localStorage.fromNews=true;
            }
            $('body').scrollTop(0);
            var obj = {};
            if ($stateParams.from == 'kfr') {
                obj.openDayId = $stateParams.artiId;
                resourceService.queryPost($scope, $filter('getUrl')('getOpenDayArticleDetail'), obj, { name: '活动详情' });
            }
            else {
                obj.artiId = $stateParams.artiId;
                resourceService.queryPost($scope, $filter('getUrl')('公告详情'), obj, { name: '公告详情' });
            }
;

            $scope.$on('resourceService.QUERY_POST_MYEVENT', function (event, data, eObj) {
                switch (eObj.name) {
                    case '公告详情':
                        $scope.ggxq = data.map.sysArticle;
                        if(($scope.platform == 'i') || ($scope.platform  == 'A')){
                            $('.ggxq-content').css('margin-top','0');
                        }
                        break;
                    case '活动详情':
                        $scope.ggxq = data.map.sysArticle;
                        if(($scope.platform  == 'i') || ($scope.platform == 'A') ){
                            $('.hdxq-content').css('margin-top','0');
                        }
                        break;
                };
            });
            $scope.toback = function () {
                $filter('跳回上一页')(1);
            };
            // $scope.goBack = function () {
            //     if ($stateParams.from == 'home') {
            //         $state.go('main.home');
            //     }
            //     else {
            //         $state.go('WZGG', { wap: true });
            //     }
            // }
        })
    });