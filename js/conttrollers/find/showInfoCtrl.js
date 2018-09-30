/*
* @Author: lee
* @Date:   2016-01-10 23:29:04
* @Last Modified by:   anchen
* @Last Modified time: 2016-01-12 21:49:52
*/

'use strict';

define([
        'js/module.js'
        , 'ngdialog'
        ,'countup'
        , 'waypoints'
    ]
    , function (controllers, ngdialog, countup, waypoints) {
    /*信息披露*/
        controllers.controller('showInfoCtrl'
            , ['$scope', '$rootScope'
                , 'resourceService'
                , '$filter'
                , '$state'
                , 'md5'
                , '$localStorage'
                , '$stateParams'
                , '$location'
                , function ($scope, $rootScope, resourceService, $filter, $state, md5, $localStorage, $stateParams) {
                    $rootScope.title = '信息披露';
                    $filter('isPath')('showInfo');
                    $scope.toback = function() {
                        // $filter('跳回上一页')(2);
                        $state.go('main.find');
                    };
                    if($rootScope.fromNative) {
                        $('.common-head').css('display','none');
                        $('.showInfo').removeClass('headerTop');
                    }
                    document.getElementsByTagName('html')[0].scrollTop = 0;
                    document.getElementsByTagName('body')[0].scrollTop = 0;
                    $scope.showList = [
                        {img: '../../../images/showInfo/about.png', eText: 'ABOUT', cText: '关于我们', uref: 'abouths', proId: ''},
                        {img: '../../../images/showInfo/notice.png', eText: 'INFORMATION', cText: '信息公告', uref: 'bulletinInfo', proId: ''},
                        {img: '../../../images/showInfo/data.png', eText: 'DATA', cText: '运营数据', uref: 'listData'},
                        {img: '../../../images/showInfo/honor.png', eText: 'HONOR', cText: '企业荣誉', uref: 'companyHonor', proId: ''},
                        {img: '../../../images/showInfo/risk.png', eText: 'RISK', cText: '风险管理', uref: 'riskManage', proId: ''},
                        {img: '../../../images/showInfo/reports.png', eText: 'REPORTS', cText: '媒体动态', uref: 'mediaNews', proId: ''},
                        {img: '../../../images/showInfo/announcement.png', eText: 'ANNOUNCEMENT', cText: '网站公告', uref: 'siteNotice', proId: ''},
                        {img: '../../../images/showInfo/statute.png', eText: 'STATUTE', cText: '监管法规', uref: 'superviseRegulation', proId: ''},
                        {img: '../../../images/showInfo/contact.png', eText: 'CONTACT', cText: '联系我们', uref: 'contactUs', proId: ''}
                    ];
                }
            ]);
        /*1关于我们*/
        controllers.controller('abouthsCtrl', ['$scope', '$rootScope', 'resourceService', '$filter', '$state', 'md5', '$localStorage', '$stateParams', '$location','$sce', function ($scope, $rootScope,resourceService, $filter, $state, md5, $localStorage, $stateParams, $location, $sce) {
            $rootScope.title = '关于我们';
            $filter('isPath')('abouths');
            $scope.aboutUs = [];
            $scope.teams = [];
            $scope.companyProfile = {};
            if ($stateParams.wap) {
                $scope.wap = $stateParams.wap;
            }
            if($rootScope.fromNative || $rootScope.getUrlParam('allowDL') == 'true') {
                $('.common-head').css('display','none');
                $('.abouths').removeClass('headerTop');
            }
            $scope.toback = function() {
                $filter('跳回上一页')(2);
            };
            //tab切换
            if($localStorage.fromNews){
                $scope.tap=4;
                delete $localStorage.fromNews;
            }else{
                $scope.tap=1;
            }
            $scope.change = function (num, id) {
                $scope.tap = num;
                resourceService.queryPost($scope, $filter('getUrl')('栏目信息'), {proId: id}, { name: '栏目信息' });
            };
            $scope.changesub = function (num) {
                $scope.tapsub = num;
            };

            //轮播
            $scope.banner1 = [
                {imgUrl: '/images/find/abouths/check1.png', location: ''
                },{imgUrl: '/images/find/abouths/check2.png',location: ''
                }
            ];
            $scope.banner2 = [
                {imgUrl: '/images/find/abouths/honor1.png', location: ''
                },{imgUrl: '/images/find/abouths/honor2.png',location: ''
                }
            ];

            //网站公告
            if(($scope.platform == 'i') || ($scope.platform == 'A') ){
                $('.news').css('margin-top','0');
            }
            $scope.proId1 = null;
            $scope.proId2 = null;
            $scope.proId3 = null;
            resourceService.queryPost($scope, $filter('getUrl')('信息披露'), {}, { name: '信息披露' });
            $scope.$on('resourceService.QUERY_POST_MYEVENT', function (event, data, type) {
                switch(type.name) {
                    case '信息披露':
                        if(data.success) {
                            var aboutUs = data.map.list1;
                            angular.forEach(aboutUs, function(item, index) {
                                if (item.proName == '公司简介APP') {
                                    $scope.proId1 = item.proId;
                                    /*页面初始化加载公司简介*/
                                    resourceService.queryPost($scope, $filter('getUrl')('栏目信息'), {proId: item.proId}, { name: '栏目信息' });
                                } else if(item.proName == '公司概况APP') {
                                    $scope.proId2 = item.proId;
                                } else if(item.proName == '团队介绍APP') {
                                    $scope.proId3 = item.proId;
                                }
                            });
                        };
                        break;
                    case '栏目信息':
                        if(data.success) {
                            $scope.datas = data.map.page.rows;
                            console.log($scope.datas);
                        };
                        break;

                }
            });
        }
        ]);
        /*2信息公告*/
        controllers.controller('bulletinCtrl', ['$scope', '$rootScope', 'resourceService', '$filter', '$state', 'md5', '$localStorage', '$stateParams', '$location', function ($scope, $rootScope,resourceService, $filter, $state, md5, $localStorage, $stateParams) {
            $rootScope.title = '信息公告';
            $filter('isPath')('bulletinInfo');
            $scope.infoList = {};
            if ($stateParams.wap) {
                $scope.wap = $stateParams.wap;
            }
            if($rootScope.fromNative || $rootScope.getUrlParam('allowDL') == 'true') {
                $('.common-head').css('display','none');
                $('.abouths').removeClass('headerTop');
            }
            $scope.toback = function() {
                $filter('跳回上一页')(2);
            };
            //tab切换（后期需求会用到）
            if($localStorage.fromNews){
                $scope.tap=4;
                delete $localStorage.fromNews;
            }else{
                $scope.tap=1;
            }
            $scope.change = function (num) {
                $scope.tap = num;
            };
            resourceService.queryPost($scope, $filter('getUrl')('信息披露'), {}, {name: '信息披露'});
            $scope.$on('resourceService.QUERY_POST_MYEVENT', function (event, data, eObj) {
                switch (eObj.name) {
                    case '信息披露':
                        if (data.success) {
                            var bulletinInfo = data.map.list1;
                            angular.forEach(bulletinInfo, function(item, index) {
                                if (item.proName == '重大事项APP') {
                                    resourceService.queryPost($scope, $filter('getUrl')('栏目信息'), {proId: item.proId}, { name: '栏目信息' });
                                }
                            });
                        };
                        break;
                    case '栏目信息':
                        if (data.success) {
                            $scope.infoList = data.map.page.rows;
                        };
                        break;
                };
            });
        }
        ]);
        /*3运营数据*/
        controllers.controller('operationCtrl'
            , ['$scope', '$rootScope'
                , 'resourceService'
                , '$filter'
                , '$state'
                , 'md5'
                , '$localStorage'
                , '$stateParams'
                , '$location'
                ,'$timeout'
                , function ($scope, $rootScope, resourceService, $filter, $state, md5, $localStorage, $stateParams, $timeout) {
                    $rootScope.title = '平台数据';
                    $scope.dataList1 = [];
                    $scope.dataList2 = [];
                    $scope.incomeRegulation = null;
                    $filter('isPath')('listData');
                    if($rootScope.fromNative || $rootScope.getUrlParam('allowDL') == 'true') {
                        $('.common-head').css('display','none');
                        $('.operationData').removeClass('headerTop');
                    }
                    // $scope.toback = function() {
                    //     $filter('跳回上一页')(2);
                    // };
                    $scope.toback = function() {
                        $state.go('showInfo');
                    };
                    $(".counter").countUp();
                    setTimeout(function() {
                        $('.counter').css('display', 'none');
                        $('.show').removeClass('hide');
                    }, 500);
                    $scope.tapsub = 2;
                    resourceService.queryPost($scope, $filter('getUrl')('网站公告'), {proId: 24}, {name: '网站公告'});
                    $scope.changesub = function (num) {
                        $scope.tapsub = num;
                        // resourceService.queryPost($scope, $filter('getUrl')('网站公告'), {proId: 24}, {name: '网站公告'});
                    };


                    resourceService.queryPost($scope, $filter('getUrl')('平台数据1'), {}, {name: '平台数据1'});
                    resourceService.queryPost($scope, $filter('getUrl')('平台数据2'), {}, {name: '平台数据2'});

                    $scope.$on('resourceService.QUERY_POST_MYEVENT', function (event, data, eObj) {
                        switch (eObj.name) {
                            case '平台数据1':
                                if (data.success) {
                                    $scope.dataList1 = data.map;
                                }
                                ;
                                break;
                            case '平台数据2':
                                if (data.success) {
                                    $scope.dataList2 = data.map;
                                }
                                break;
                            case '网站公告':
                                if (data.success) {
                                    //轮播
                                    $scope.banner1 = [
                                    ];
                                    /*2017*/
                                    $scope.banner2 = [
                                    ];
                                    var datas = data.map.page.rows;
                                    angular.forEach(datas, function (item) {
                                        var obj1 = {};
                                        var obj2 = {};
                                        if (item.litpic) {
                                            if (item.year == '2017') {
                                                obj1.imgUrl = item.litpic;
                                                obj1.location = 'runReport';
                                                obj1.artiId = item.artiId;
                                                $scope.banner2.push(obj1);
                                            } else if (item.year == '2018') {
                                                obj2.imgUrl = item.litpic;
                                                obj2.location = 'runReport';
                                                obj2.artiId = item.artiId;
                                                $scope.banner1.push(obj2);
                                            }
                                        } else {
                                            $scope.incomeRegulation = item.content;
                                        }
                                    });
                                    console.log( $scope.banner1);
                                    break;
                                };
                        }
                    });
                }
            ]);
        /*4企业荣誉*/
        controllers.controller('honorCtrl'
            , ['$scope', '$rootScope'
                , 'resourceService'
                , '$filter'
                , '$state'
                , 'md5'
                , '$localStorage'
                , '$stateParams'
                , '$location'
                , function ($scope, $rootScope, resourceService, $filter, $state, md5, $localStorage, $stateParams) {
                    $rootScope.title = '企业荣誉';
                    $filter('isPath')('listData');
                    $scope.toback = function() {
                        $filter('跳回上一页')(2);
                    };
                    $scope.companyHonor = [];
                    if($rootScope.fromNative || $rootScope.getUrlParam('allowDL') == 'true') {
                        $('.common-head').css('display','none');
                        $('.company-honor').removeClass('headerTop');
                    }
                    resourceService.queryPost($scope, $filter('getUrl')('信息披露'), {}, {name: '信息披露'});
                    $scope.$on('resourceService.QUERY_POST_MYEVENT', function (event, data, eObj) {
                        switch (eObj.name) {
                            case '信息披露':
                                if (data.success) {
                                    var bulletinInfo = data.map.list1;
                                    angular.forEach(bulletinInfo, function(item, index) {
                                        if (item.proName == '企业荣誉APP') {
                                            resourceService.queryPost($scope, $filter('getUrl')('栏目信息'), {proId: item.proId}, { name: '栏目信息' });
                                        }
                                    });
                                };
                                break;
                            case '栏目信息':
                                if (data.success) {
                                    $scope.companyHonor = data.map.page.rows;
                                }
                                break;
                        };
                    });
                }
            ]);
        /*5风险管理*/
        controllers.controller('riskManageCtrl'
            , ['$scope', '$rootScope'
                , 'resourceService'
                , '$filter'
                , '$state'
                , 'md5'
                , '$localStorage'
                , '$stateParams'
                , '$location'
                , function ($scope, $rootScope, resourceService, $filter, $state, md5, $localStorage, $stateParams) {
                    $rootScope.title = '风险管理';
                    $filter('isPath')('riskManage');
                    $scope.toback = function() {
                        $filter('跳回上一页')(2);
                    };
                    $scope.riskManage = [];
                    if($rootScope.fromNative || $rootScope.getUrlParam('allowDL') == 'true') {
                        $('.common-head').css('display','none');
                        $('.company-honor').removeClass('headerTop');
                    }
                    resourceService.queryPost($scope, $filter('getUrl')('信息披露'), {}, {name: '信息披露'});
                    $scope.$on('resourceService.QUERY_POST_MYEVENT', function (event, data, eObj) {
                        switch (eObj.name) {
                            case '信息披露':
                                if (data.success) {
                                    var bulletinInfo = data.map.list1;
                                    angular.forEach(bulletinInfo, function(item, index) {
                                        if (item.proName == '风险管理APP') {
                                            resourceService.queryPost($scope, $filter('getUrl')('栏目信息'), {proId: item.proId}, { name: '栏目信息' });
                                        }
                                    });
                                };
                                break;
                            case '栏目信息':
                                if (data.success) {
                                    $scope.riskManage =data.map.page.rows;
                                    console.log($scope.riskManage);
                                }
                                break;
                        };
                    });
                }
            ]);
        /*6媒体动态*/
        controllers.controller('mediasCtrl', ['$scope', '$rootScope', 'resourceService', '$filter', '$state', 'md5', '$localStorage', '$stateParams', '$location', function ($scope, $rootScope,resourceService, $filter, $state, md5, $localStorage, $stateParams) {
            $rootScope.title = '媒体动态';
            $filter('isPath')('mediaNews');
            if ($stateParams.wap) {
                $scope.wap = $stateParams.wap;
            }
            if($rootScope.fromNative) {
                $('.common-head').css('display','none');
                $('.abouths').removeClass('headerTop');
            }
            $scope.toback = function() {
                $filter('跳回上一页')(2);
            };
            $scope.mediaId = null;
            var isLoad = true;
            var pageOn = 1;
            $scope.ggList = [];

            $scope.loadMore = function (item) {
                if (item.artiId == $scope.ggList[$scope.ggList.length - 1].artiId) {
                    if (isLoad) {
                        if (pageOn != $scope.page.pageOn) {
                            var obj = {
                                pageOn: pageOn,
                                pageSize: 10,
                                proId:  $scope.mediaId
                            };
                            resourceService.queryPost($scope, $filter('getUrl')('网站公告'), obj, { name: '公告列表' });
                            isLoad = false;
                        }
                    };
                };
            };
            resourceService.queryPost($scope, $filter('getUrl')('信息披露'), {}, { name: '信息披露' });
            $scope.$on('resourceService.QUERY_POST_MYEVENT', function (event, data, eObj) {
                switch (eObj.name) {
                    case '信息披露':
                        if (data.success) {
                            angular.forEach(data.map.list1, function(item) {
                                if (item.proName == '媒体动态APP') {
                                    $scope.mediaId = item.proId;
                                    resourceService.queryPost($scope, $filter('getUrl')('网站公告'), {proId: item.proId},{name: '公告列表'});
                                }
                            })
                        }
                        break;
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
                // if ($scope.wap) {
                    $state.go('GGXQ', { wap: true, artiId: id, from: 'mtdt',platform: 'A'});
                // }
                // else {
                //     $state.go('GGXQ', { artiId: id });
                // }
            }

        }
        ]);
        /*7网站公告*/
        controllers.controller('siteNoticeCtrl', ['$scope', '$rootScope', 'resourceService', '$filter', '$state', 'md5', '$localStorage', '$stateParams', '$location', function($scope, $rootScope, resourceService, $filter, $state, md5, $localStorage, $stateParams) {
            $rootScope.title = '网站公告';
            $filter('isPath')('siteNotice');
            $scope.siteId = null;
            if($rootScope.fromNative) {
                $('.common-head').css('display','none');
                $('.abouths').removeClass('headerTop');
            }
            $scope.toback = function() {
                $filter('跳回上一页')(2);
            };
            //网站公告
            if(($scope.platform == 'i') || ($scope.platform == 'A') ){
                $('.news').css('margin-top','0');
            }
            var isLoad = true;
            var pageOn = 1;
            $scope.ggList = [];


            resourceService.queryPost($scope, $filter('getUrl')('网站公告'), {proId: 14, pageOn: 1,pageSize: 10},{name: '公告列表'});
            $scope.$on('resourceService.QUERY_POST_MYEVENT', function (event, data, eObj) {
                switch (eObj.name) {
                    case '公告列表':
                        if (data.success) {
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
                        }
                        break;
                };
            });
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
            $scope.goto = function (id) {
                if ($scope.wap) {
                    $state.go('GGXQ', { wap: true, artiId: id});
                }
                else {
                    $state.go('GGXQ', { artiId: id });
                }
            }
        }])
        /*8监管法规*/
        controllers.controller('superviseCtrl'
            , ['$scope', '$rootScope'
                , 'resourceService'
                , '$filter'
                , '$state'
                , 'md5'
                , '$localStorage'
                , '$stateParams'
                , '$location'
                , function ($scope, $rootScope, resourceService, $filter, $state, md5, $localStorage, $stateParams, $location) {
                    $rootScope.title = '监管法规';
                    $filter('isPath')('superviseRegulation');
                    $scope.toback = function() {
                        $filter('跳回上一页')(2);
                    };
                    $scope.regulation = [];
                    if($rootScope.fromNative) {
                        $('.common-head').css('display','none');
                        $('.supervise').removeClass('headerTop');
                    }
                    $('.news').on("click", "li .up-text", function () {
                        var answer = $(this).next(".down-text").eq(0);
                        var arrow = $(this).children('.right');
                        if (answer.hasClass("hide")) {
                            answer.removeClass("hide");
                            arrow.find('.no-expand').addClass('hide');
                            arrow.find('.expand').removeClass('hide');
                        } else {
                            answer.addClass("hide");
                            arrow.find('.no-expand').removeClass('hide');
                            arrow.find('.expand').addClass('hide');
                        }
                    });
                    $scope.regulationId = null;
                    var isLoad = true;
                    var pageOn = 1;
                    $scope.ggList = [];

                    resourceService.queryPost($scope, $filter('getUrl')('信息披露'), {}, {name: '信息披露'});
                    $scope.$on('resourceService.QUERY_POST_MYEVENT', function (event, data, eObj) {
                        switch (eObj.name) {
                            case '信息披露':
                                if (data.success) {
                                    angular.forEach(data.map.list1, function(item) {
                                        if (item.proName == '监管法规APP') {
                                            $scope.regulationId = item.proId;
                                            resourceService.queryPost($scope, $filter('getUrl')('栏目信息'), {proId: item.proId},{name: '栏目信息'});
                                        }
                                    })
                                }
                                break;

                            case '栏目信息':
                               if (data.success) {
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
                               }
                                break;
                        };
                    });
                    $scope.loadMore = function (item) {
                        if (item.artiId == $scope.ggList[$scope.ggList.length - 1].artiId) {
                            if (isLoad) {
                                if (pageOn != $scope.page.pageOn) {
                                    var obj = {
                                        pageOn: pageOn,
                                        pageSize: 10,
                                        proId: $scope.regulationId
                                    };
                                    resourceService.queryPost($scope, $filter('getUrl')('栏目信息'), obj, { name: '栏目信息' });
                                    isLoad = false;
                                }
                            };
                        };
                    };
                    $scope.goto = function (id) {
                        // if ($scope.wap) {
                            $state.go('GGXQ', { wap: true, artiId: id, from: 'jgfg'});
                        // }
                        // else {
                        //     $state.go('GGXQ', { artiId: id });
                        // }
                    }
                }
            ]);
        /*9联系我们*/
        controllers.controller('contactUsCtrl'
            , ['$scope', '$rootScope'
                , 'resourceService'
                , '$filter'
                , '$state'
                , 'md5'
                , '$localStorage'
                , '$stateParams'
                , '$location'
                , function ($scope, $rootScope, resourceService, $filter, $state, md5, $localStorage, $stateParams) {
                    $rootScope.title = '联系我们';
                    $filter('isPath')('contactUs');
                    $scope.toback = function() {
                        $filter('跳回上一页')(2);
                    };
                    $scope.contactInfo = [];
                    if($rootScope.fromNative) {
                        $('.common-head').css('display','none');
                        $('.contact-us').removeClass('headerTop');
                    }
                    resourceService.queryPost($scope, $filter('getUrl')('信息披露'), {}, {name: '信息披露'});
                    $scope.$on('resourceService.QUERY_POST_MYEVENT', function (event, data, type) {
                        switch (type.name) {
                            case '信息披露':
                                if (data.success) {
                                    angular.forEach(data.map.list1, function(item) {
                                        if (item.proName == '联系我们APP') {
                                            resourceService.queryPost($scope, $filter('getUrl')('栏目信息'), {proId: item.proId}, {name: '栏目信息'});
                                        }
                                    })
                                }
                                break;
                            case '栏目信息':
                                if (data.success) {
                                    $scope.contactInfo = data.map.page.rows;
                                }
                                break;
                        };
                    });
                }
            ]);
        /*运营报告*/
        controllers.controller('reportCtrl'
            , ['$scope', '$rootScope'
                , 'resourceService'
                , '$filter'
                , '$state'
                , 'md5'
                , '$localStorage'
                , '$stateParams'
                , '$location'
                , function ($scope, $rootScope, resourceService, $filter, $state, md5, $localStorage, $stateParams, $location) {
                    $rootScope.title = '运营报告';
                    $filter('isPath')('runReport');
                    $scope.toback = function() {
                        // $filter('跳回上一页')(2);
                        $state.go('listData');
                    };
                    if($rootScope.fromNative) {
                        $('.common-head').css('display','none');
                        $('.report').removeClass('headerTop');
                    }
                    var artiId = $location.$$search.artiId;
                    resourceService.queryPost($scope, $filter('getUrl')('公告详情'), {artiId: artiId}, {name: '公告详情'});
                    $scope.$on('resourceService.QUERY_POST_MYEVENT', function (event, data, type) {
                        switch (type.name) {
                            case '公告详情':
                                if (data.success) {
                                   $scope.content = data.map.sysArticle;
                                }
                                break;
                        };
                    });
                }
            ]);
    });