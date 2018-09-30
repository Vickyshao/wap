define(['js/module.js'], function (controllers) {
    controllers.controller('newyearshareController', ['$scope', '$rootScope', '$filter', '$state', 'resourceService', '$stateParams', '$window', '$timeout', function ($scope, $rootScope, $filter, $state, resourceService, $stateParams, $window, $timeout) {
        // $scope.url = $stateParams;
        $rootScope.title = $scope.title = '沪深理财-网贷投资，国企控股平台';
        if ($stateParams.uid) {
            $scope.uid = $stateParams.uid;
            resourceService.queryPost($scope, $filter('getUrl')('压岁钱分享页'), {
                shaerUid: $scope.uid
            }, { name: '压岁钱分享页' });
        }
        if($stateParams.recommPhone){
            $scope.recommPhone = $stateParams.recommPhone;
        }
        // if($stateParams.time){
        //     $scope.time = $stateParams.time;
        // }
        if ($stateParams.wap) {
            $scope.wap = $stateParams.wap;
        }
        else if ($stateParams.phone) {
            resourceService.queryPost($scope, $filter('getUrl')('领压岁钱'), {
                shaerUid: $scope.uid,
                mobilePhone: $stateParams.phone
            }, { name: '领压岁钱' });
        }
        $scope.click = function (tegForm) {
            $scope.mobilephone = tegForm.mobilephone.$viewValue;
            if (!tegForm.mobilephone.$error.required && !tegForm.mobilephone.$error.minlength && !tegForm.mobilephone.$error.pattern) {
                resourceService.queryPost($scope, $filter('getUrl')('getPhone'), {
                    mobilephone: tegForm.mobilephone.$viewValue
                }, { name: '注册验证手机号', tegForm: tegForm });
            }
            else {
                $rootScope.errorText = '请填写有效手机号码';
                $rootScope.maskError = true;
            }
        };
        $scope.$on('resourceService.QUERY_POST_MYEVENT', function (event, data, type) {
            switch (type.name) {
                case '压岁钱分享页':
                    if (data.success) {
                        $scope.userName = data.map.userName;
                    }
                    else {
                        $filter('服务器信息')(data.errorCode, $scope, 'y');
                    }
                    break;
                case '注册验证手机号':
                    if (data.success) {
                        if (data.map.exists) { //已有用户名
                            $('body,html').css({ height: '100%', overflow: 'hidden' });
                            $scope.fail = true;
                        } else {
                            resourceService.queryPost($scope, $filter('getUrl')('领压岁钱'), {
                                shaerUid: $scope.uid,
                                mobilePhone: $scope.mobilephone
                            }, { name: '领压岁钱' });
                        };
                    }
                    else {
                        $filter('服务器信息')(data.errorCode, $scope, 'y');
                    }
                    break;
                case '领压岁钱':
                    if (data.success) {
                        $scope.luckMoneyList = data.map.luckMoneyList;
                        if (data.map.isOverCount == true) {
                            $scope.status = 4;
                        }
                        else if (data.map.isOverdue == true) {
                            $scope.status = 3;
                        }
                        else {
                            $scope.status = 2;
                            $scope.luckMoney = data.map.luckMoney;
                            $scope.phone = data.map.mobilePhone;
                        }
                    }
                    else if(data.errorCode=='10001' || data.errorCode=='10004'){
                        $state.go('main.home');
                    }
                    break;
            }
        });
        $scope.close = function () {
            $('body,html').css({ height: 'auto', overflow: 'initial' });
            $scope.fail = false;
        }
        $scope.toNewyear = function () {
            $('body,html').css({ height: 'auto', overflow: 'initial' });
            if ($scope.wap) {
                $state.go('newyear', { wap: true });
            }
            else {
                $state.go('newyear');
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
        .directive('newyearscrollText', function () {
            var temp = '<ul><li repeat-finish="finish()" ng-repeat="item in luckMoneyList">' +
                '<div><p>{{item.mobilePhone}}</p><p>{{item.updateTime | date:"yyyy-MM-dd HH:mm:ss"}}</p></div>' +
                '<h3>￥ {{item.amount}}元</h3>' +
                '</li></ul>'
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
                                        $(that).css({ top: ($scope.luckMoneyList.length - 1) * height + 'px' });
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