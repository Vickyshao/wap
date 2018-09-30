define(['js/module.js'], function(controllers) {
    controllers.controller('actListController', ['$scope', '$filter', '$state', '$stateParams', 'resourceService','$timeout','$localStorage','$rootScope', function($scope, $filter, $state, $stateParams, resourceService,$timeout,$localStorage,$rootScope) {
        $scope.title = '活动中心';
        $filter('isPath')('actList');
        var isLoad = true;
        var pageOn = 1;
        $scope.publicWelfareList = [];
        if($rootScope.fromNative) {
            $('.common-head').css('display','none');
            $('.actList').removeClass('headerTop');
        }
        /*if ($stateParams.wap) {
            $scope.wap = $stateParams.wap;
            if($stateParams.active==3){
                $scope.active = 3;
                $localStorage.active = 3;
                resourceService.queryPost($scope, $filter('getUrl')('公益活动列表'),{pageOn:pageOn,pageSize:10}, { name: '公益活动列表' });
            }
            else{
                $scope.active = 0;
                init();
            }
        }
        else {
            $scope.active = 3;
            resourceService.queryPost($scope, $filter('getUrl')('公益活动列表'),{pageOn:pageOn,pageSize:10}, { name: '公益活动列表' });
        }*/
        /*function init() {
            resourceService.queryPost($scope, $filter('getUrl')('活动聚合'), {status: 1, pageOn: 1, pageSize: 200}, { name: '活动聚合' });
        }*/
        resourceService.queryPost($scope, $filter('getUrl')('活动聚合'), {status: 1, pageOn: 1, pageSize: 200}, { name: '活动聚合' });
        /*$scope.changeMode = function(i) {
            if($scope.active != i){
                $scope.active = i;
                if (i == 0) {
                    init();
                    delete $localStorage.active;
                }
                else if (i == 3) {
                    isLoad = true;
                    pageOn = 1;
                    $scope.publicWelfareList = [];
                    $localStorage.active = 3;
                    resourceService.queryPost($scope, $filter('getUrl')('公益活动列表'),{pageOn:pageOn,pageSize:10}, { name: '公益活动列表' });
                }
            }
        }*/
        $scope.$on('resourceService.QUERY_POST_MYEVENT', function(event, data, type) {
            switch (type.name) {
                case '活动聚合':
                    if (data.success) {
                        $scope.datalist = data.map.Page.rows;
                    }
                    break;
                case '公益活动列表':
                    if (data.success) {
                        $scope.page = data.map.page;
                        $scope.kfrBanner = data.map.openDayPicUrl;
                        $scope.kfrTitle = data.map.openDayLabel;
                        if (pageOn == $scope.page.pageOn) {
                            isLoad = true;
                        }
                        if (data.map.page.pageOn <= data.map.page.totalPage) {
                            pageOn = $scope.page.pageOn + 1;
                            for (var i = 0; i < data.map.page.rows.length; i++) {
                                $scope.publicWelfareList.push(data.map.page.rows[i]);
                            }
                        }
                        else {
                            isLoad = false;
                        }
                    }
                    break;
            }
        });
        /*$scope.loadMore = function(item) {
            if (item.id == $scope.publicWelfareList[$scope.publicWelfareList.length - 1].id) {
                if (isLoad) {
                    if (pageOn != $scope.page.pageOn) {
                        var obj = {
                            pageOn: pageOn,
                            pageSize: 10
                        };
                        resourceService.queryPost($scope, $filter('getUrl')('公益活动列表'), obj, { name: '公益活动列表' });
                        isLoad = false;
                    }
                };
            };
        };*/
        $scope.toback = function() {
            $filter('跳回上一页')(2);
        };
    }])
        .controller('overdueActListController', ['$scope', '$filter', '$state', '$stateParams', 'resourceService','$timeout','$localStorage','$rootScope', function($scope, $filter, $state, $stateParams, resourceService,$timeout,$localStorage,$rootScope) {
            $scope.title = '往期活动';
            $filter('isPath')('overdueActList');
            if($rootScope.fromNative) {
                $('.common-head').css('display','none');
                $('.actList').removeClass('headerTop');
            }
            resourceService.queryPost($scope, $filter('getUrl')('活动聚合'), {status: 2, pageOn: 1, pageSize: 200}, { name: '往期活动' });
            $scope.$on('resourceService.QUERY_POST_MYEVENT', function(event, data, type) {
                switch (type.name) {
                    case '往期活动':
                        if (data.success) {
                            $scope.datalist = data.map.Page.rows;
                        }
                        break;
                }
            });
            $scope.toback = function() {
                $filter('跳回上一页')(2);
            };
        }])
        .controller('newsListCtrl', ['$scope', '$filter', '$state', '$stateParams', 'resourceService','$timeout','$localStorage','$rootScope', function($scope, $filter, $state, $stateParams, resourceService,$timeout,$localStorage,$rootScope) {
            $scope.title = '消息中心';
            $filter('isPath')('newsList');
            $scope.userOBJ = $filter('isRegister')();
            var objs = {};
            var isLoad = true;
            var pageOn = 1;
            $scope.datalist = [];
            if (!$scope.userOBJ.register) {
                $state.go("dl");
                return;
            }
            $scope.slideToggle = function (e) {
                console.log(e)
                // $(".list p").hide();
                // $(e.currentTarget).siblings("p").stop().slideToggle(200);
                $(e.currentTarget).siblings("p").slideToggle(0).parent().siblings("li").find("p").hide();
                $(e.currentTarget).parent().siblings("li").find("h3").removeClass('slideDown');
                if (!$(e.currentTarget).hasClass('slideDown')) {
                    $(e.currentTarget).addClass('slideDown')
                }else{
                    $(e.currentTarget).removeClass('slideDown')
                }
            };
            objs.uid = $scope.userOBJ.user.member.uid;
            objs.type = 0;
            objs.pageOn = pageOn;
            objs.pageSize = 15;
            $scope.loadMore = function (item) {
                if (item.id == $scope.datalist[$scope.datalist.length - 1].id) {
                    if (isLoad) {
                        var obj = {
                            uid: $scope.userOBJ.user.member.uid,
                            type: 0,
                            pageOn: pageOn,
                            pageSize: 10
                        };
                        if (pageOn != $scope.page.pageOn) {
                            resourceService.queryPost($scope, $filter('getUrl')('站内信'), obj, { name: '站内信' });
                            isLoad = false;
                        }
                    };
                };
            };
            resourceService.queryPost($scope, $filter('getUrl')('站内信'), objs, { name: '站内信' });
            $scope.$on('resourceService.QUERY_POST_MYEVENT', function(event, data, type) {
                switch (type.name) {
                    case '站内信':
                        if (data.success) {
                            $scope.page = data.map.page;
                            if (pageOn == $scope.page.pageOn) {
                                isLoad = true;
                            }
                            if (data.map.page.pageOn <= data.map.page.totalPage) {
                                pageOn = $scope.page.pageOn + 1;
                                for (var i = 0; i < data.map.page.rows.length; i++) {
                                    $scope.datalist.push(data.map.page.rows[i]);
                                }
                            } else {
                                isLoad = false;
                            }
                        }
                        break;
                }
            });
            $scope.toback = function() {
                $filter('跳回上一页')(2);
            };
        }]);
})