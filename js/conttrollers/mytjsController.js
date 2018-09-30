define(['js/module.js','jquery'], function (controllers) {
    controllers.controller('mytjsController', function ($scope, $rootScope, $filter, $state, resourceService, $timeout, $location, $anchorScroll, $stateParams, $window) {
        $rootScope.title = '投资即送';
        if($stateParams.wap){
            $scope.wap = $stateParams.wap;
            $scope.userOBJ = $filter('isRegister')();
            $scope.user = $scope.userOBJ.user.member;
            if ($scope.userOBJ.register) {
                resourceService.queryPost($scope, $filter('getUrl')('tjs投资记录'), {
                    uid: $scope.userOBJ.user.member.uid
                }, '投即送投资记录');
                // resourceService.queryPost($scope, $filter('getUrl')('tjs获取地址'), {
                //     uid: $scope.userOBJ.user.member.uid
                // }, '投即送获取收货地址');
            } else {
                $state.go('dl',{returnurl:'mytjs'});
                return;
            };
        }
        else{
            if($stateParams.uid){
                resourceService.queryPost($scope, $filter('getUrl')('tjs投资记录'), {
                    uid: $stateParams.uid
                }, '投即送投资记录');
            }
            else{
                $window.location.href = 'jsmp://page=4?';
            }
            // resourceService.queryPost($scope, $filter('getUrl')('tjs获取地址'), {
            //     uid: $stateParams.uid
            // }, '投即送获取收货地址');
        }
        var $dataTable = $('.data-table');
        var trHeight = $('.data-list').height()/4;
        $scope.$on('resourceService.QUERY_POST_MYEVENT', function (event, data, type) {
            switch (type) {
                case '投即送投资记录':
                    if (data.success) {
                        $scope.logsList = data.map.logsList;
                        // 列表数据轮动
                        // if ($scope.logsList.length > 4) {
                        //     setInterval(function() {
                        //         $dataTable.animate({'margin-top': '-'+trHeight+'px'},1000,function() {
                        //             $dataTable.find('tr').eq(0).appendTo($dataTable);
                        //             $dataTable.css('margin-top',0);
                        //         });
                        //     }, 3000);
                        // }
                    } else {
                        $filter('服务器信息')(data.errorCode, $scope, 'y')
                    }
                    break;
                case '投即送获取收货地址':
                    if (data.success) {
                        if(data.map.jsMemberInfo){
                            $scope.name = data.map.jsMemberInfo.name;
                            $scope.address = data.map.jsMemberInfo.address;
                            $scope.phone = data.map.jsMemberInfo.phone;
                            $scope.hasAddress = true;
                        }
                        else{
                            $scope.hasAddress = false;
                        }
                    } else {
                        $filter('服务器信息')(data.errorCode, $scope, 'y')
                    }
                    break;
            }
        })
    })
})