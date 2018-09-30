define(['js/module.js'], function (controllers) {
    controllers.controller('yuanxiaoController', ['$scope', '$rootScope', '$filter', '$state', 'resourceService', '$stateParams', '$window', '$timeout','ngDialog', function ($scope, $rootScope, $filter, $state, resourceService, $stateParams, $window, $timeout,ngDialog) {
        $('body').scrollTop(0);
        $rootScope.title = $scope.title = '沪深理财-网贷投资，国企控股平台';
            
        if ($stateParams.wap) {
            $scope.wap = $stateParams.wap;
            $scope.user = $filter('isRegister')().user.member;
            if($scope.user){
                $scope.uid = $scope.user.uid;
            }
        }
        else if($stateParams.uid){
            $scope.uid = $stateParams.uid;
        }
        resourceService.queryPost($scope, $filter('getUrl')('元宵领取记录'), {}, { name: '元宵领取记录' });
        $scope.click = function () {
            resourceService.queryPost($scope, $filter('getUrl')('吃元宵'), {
                uid: $scope.uid
            }, { name: '吃元宵' });
        };
        $scope.$on('resourceService.QUERY_POST_MYEVENT', function (event, data, type) {
            switch (type.name) {
                case '吃元宵':
                    if (data.success) {
                        // if(data.map.isReceive==true){
                        //     $('body,html').css({ height: '100%', overflow: 'hidden' });
                        //     $scope.type=2;
                        //     $scope.show = true;
                        // }
                        // else{
                            $scope.hbtype = data.map.type;
                            $scope.num = data.map.num;
                            $('body,html').css({ height: '100%', overflow: 'hidden' });
                            $scope.type=1;
                            $scope.show = true;
                        // }
                    }
                    else if(data.errorCode == 9997){
                        ngDialog.open({
                            template: '<p class="error-msg">非活动期间内</p>',
                            showClose: false,
                            closeByDocument: true,
                            plain: true
                        });
                    }
                    else if(data.map.isReceive==true){
                        $('body,html').css({ height: '100%', overflow: 'hidden' });
                        $scope.type=2;
                        $scope.show = true;
                    }
                    
                    break;
                case '元宵领取记录':
                    if (data.success) {
                        $scope.logList = data.map.drMemberLotteryLogList;
                    }

                    break;
            }
        });
        $scope.close = function () {
            $('body,html').css({ height: 'auto', overflow: 'initial' });
            $scope.show = false;
        }
        $scope.goto = function(){
            if($scope.hbtype==3){
                $('body,html').css({ height: 'auto', overflow: 'initial' });
                $scope.show = false;
                $state.go('tyjdetail');
            }
            else{
                $('body,html').css({ height: 'auto', overflow: 'initial' });
                $scope.show = false;
                $state.go('main.bankBillList');
            }
        }
    }])
        .directive("repeatFinish", function () {
            return {
                link: function (scope, element, attr) {
                    if (scope.$last == true) {
                        scope.$eval(attr.repeatFinish);
                    }
                }
            }
        })
        .directive('yuanxiaoscrollText', function () {
            var temp = '<li repeat-finish="finish()" ng-repeat="item in logList">' +
                '<div><p>{{item.updateTime | date:"yyyy-MM-dd HH:mm:ss"}}</p><p>{{item.mobilePhone}}</p></div>' +
                '<h3>{{item.name}}</h3>' +
                '</li>'
            return {
                template: temp,
                scope: true,
                transclude: true,
                link: function ($scope, element, attrs) {
                    var a = 1;
                    $scope.finish = function () {
                        if(a==1){
                            a++;
                            $(element).find('li').each(function (i) {
                                var height = parseFloat($(this).css('height'));
                                $(this).css({
                                    position: 'absolute',
                                    top: (i * height) + 'px'
                                })
                                var that = this;
                                setInterval(function () {
                                    var top = parseFloat($(that).css('top'));
                                    if (top < (height * (-1))) {
                                        $(that).css({ top: ($scope.logList.length - 1) * height + 'px' });
                                    }
                                    var top = parseFloat($(that).css('top'));
                                    $(that).css({
                                        top: (top - 1) + 'px'
                                    })
                                }, 20)
                            })
                        }
                    }
                }
            }
        });
})