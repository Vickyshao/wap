define(['js/module.js'], function(controllers) {
    controllers.controller('myActivityCtrl', ['$scope', '$filter', '$state', '$stateParams', 'resourceService','$timeout','$localStorage','ngDialog', function($scope, $filter, $state, $stateParams, resourceService,$timeout,$localStorage,ngDialog) {
        $scope.title = '我的活动';
        $filter('isPath')('myActivity');
        $scope.user = $filter('isRegister')();
        var userData ={
            pageOn: 1,
            pageSize:30
        };
        if($scope.user) {
            userData.uid  = $scope.user.user.member.uid;
        }
        $scope.toDetail =function (item) {
            if(item.status == '1') {
                if(item.activityCode == 'choujiang') {
                    $state.go('lottery');
                } else if(item.activityCode == 'yuandan') {
                    $state.go('myCouponList');
                } else if(item.activityCode == 'enfu') {
                    $state.go('enfuReward',{id: item.id});
                } else if(item.activityCode == 'NewYear2018') {
                    $state.go('chunjieprize2018',{activityId: item.id});
                } else {
                    $state.go('dropEgg');
                }
            } else {
                ngDialog.open({
                    template: '<p class="error-msg">活动已结束</p>',
                    showClose: false,
                    closeByDocument: true,
                    plain: true
                });

                setTimeout(function () {
                    ngDialog.closeAll();
                }, 1500);
            }

        }
        var isLoad = true;
        var pageOn = 1;
        resourceService.queryPost($scope, $filter('getUrl')('我参与的活动列表'), userData, { name: '我参与的活动列表' });
        $scope.$on('resourceService.QUERY_POST_MYEVENT', function(event, data, type) {
            switch (type.name) {
                case '我参与的活动列表':
                    if (data.success) {
                        $scope.activitylist = data.map.pageInfo.rows;
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
        $scope.loadMore = function(item) {
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
        };
        $scope.toback = function() {
            $filter('跳回上一页')(2);
        };
    }])
        /*.controller('myActivityCtrl', ['$scope', '$filter', '$state', '$stateParams', 'resourceService','$timeout','$localStorage','ngDialog', function($scope, $filter, $state, $stateParams, resourceService,$timeout,$localStorage,ngDialog) {
            $scope.title = '我的活动';
            $filter('isPath')('myActivity');
            $scope.user = $filter('isRegister')();
            var userData ={
                pageOn: 1,
                pageSize:30
            };
            if($scope.user) {
                userData.uid  = $scope.user.user.member.uid;
            }

            var isLoad = true;
            var pageOn = 1;
            resourceService.queryPost($scope, $filter('getUrl')('我参与的活动列表'), userData, { name: '我参与的活动列表' });
            $scope.$on('resourceService.QUERY_POST_MYEVENT', function(event, data, type) {
                switch (type.name) {
                    case '我参与的活动列表':
                        if (data.success) {
                            $scope.activitylist = data.map.pageInfo.rows;
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
            $scope.loadMore = function(item) {
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
            };
            $scope.toback = function() {
                $filter('跳回上一页')(2);
            };
        }]);*/
})