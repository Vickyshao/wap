define(['jweixin', 'js/module.js', 'jquery', 'ngdialog', 'SHR256'], function (wx, controllers, $, ngdialog, SHR256, weixin) {
    controllers.controller('xiaomiadController', function ($scope, $rootScope, resourceService, $filter, $state, ngDialog, $location, md5, $localStorage, $stateParams) {
        $filter('isPath')('xiaomiad');
        $rootScope.title = '沪深理财-网贷投资，国企控股平台';
        $scope.login = {};
        $("html,body").animate({ scrollTop: 0 });
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
        $scope.gotop = function () {
            $("html,body").animate({ scrollTop: 0 });
        };

        $scope.passwordText = false;
        $scope.isSubMin = true;
        $scope.nowTimer = "获取验证码";
        var isSub = true;
        $scope.zuce = function (tegForm) {
            $scope.login.checkbox = true;
            if ($scope.login.recommPhone === undefined) {
                delete $scope.login.recommPhone;
            };
            if ($scope.login.toFrom === undefined) {
                delete $scope.login.toFrom;
            };
            if (tegForm.$valid) {
                if ($scope.login.passWord.length > 5) {
                    if (isSub) {
                        isSub = false;
                        resourceService.queryPost($scope, $filter('getUrl')('zuce'), $scope.login, { name: '注册', tegForm: tegForm });
                    }
                }
            } else {
                $rootScope.errorText = '请正确填写以上信息';
                $rootScope.maskError = true;
            }
        }
        $scope.getyzm = function (tegForm) {
            if (tegForm.mobilephone.$valid == false) {
                alert("请输入正确的手机号码!");
            } else {
                if ($scope.isSubMin && $scope.cangetm == true) {
                    resourceService.queryPost($scope, $filter('getUrl')('getyzm'), {
                        mobilephone: $scope.login.mobilephone,
                        picCode: $scope.login.picCode
                    }, { name: '获取验证码', tegForm: tegForm });
                    $filter('60秒倒计时')($scope, 60);
                }
                else if ($scope.isSubMin && $scope.cangetm == false) {
                    $rootScope.errorText = '此手机已注册';
                    $rootScope.maskError = true;
                }
            };
        };
        /*焦点进入与离开*/
        $scope.blurID = function (code, tegForm) {
            if (!tegForm.mobilephone.$error.required && !tegForm.mobilephone.$error.minlength && !tegForm.mobilephone.$error.pattern) {
                resourceService.queryPost($scope, $filter('getUrl')('getPhone'), {
                    mobilephone: $scope.login.mobilephone
                }, { name: '注册验证手机号', tegForm: tegForm });
            };
        };
        $scope.$on('resourceService.QUERY_POST_MYEVENT', function (event, data, type) {
            switch (type.name) {
                case '获取验证码':
                    if (data.success) {
                        $rootScope.errorText = '验证码发送成功';
                        $rootScope.maskError = true;
                    } else {
                        $filter('手机短信验证错误')(type.tegForm, data.errorCode);
                    }
                    break;
                case '注册验证手机号':
                    if (data.success) {
                        if (data.map.exists) { //已有用户名
                            $rootScope.errorText = '此手机已注册';
                            $rootScope.maskError = true;
                            $scope.cangetm = false;
                        }
                        else {
                            $scope.cangetm = true;
                        }
                    }
                    break;
                case '注册':
                    isSub = true;
                    if (data.success) {
                        $localStorage.user = data.map;
                        _hmt.push(['_trackPageview', '/mian/myCoupon']);
                        ngDialog.open({
                            template: '<p class="error-msg">注册成功！</p>',
                            showClose: false,
                            closeByDocument: true,
                            plain: true
                        });
                        setTimeout(function() {
                            ngDialog.closeAll();
                            $state.go('main.home');
                        }, 2000);
                    } else {
                        $filter('serverZuceError')(type.tegForm, data.errorCode);
                        $scope.login.passWord = '';
                    };
                    break;
                case '投即送活动页':
                    if (data.success) {
                        $scope.investList = data.map.investList;
                        $scope.investCount = data.map.investCount;
                        if ($scope.investList.length > 5) {
                            setInterval(function () {
                                $dataTable.animate({ 'margin-top': '-' + trHeight + 'px' }, 1000, function () {
                                    $dataTable.find('tr').eq(0).appendTo($dataTable);
                                    $dataTable.css('margin-top', 0);
                                });
                            }, 3000);
                        }
                    }
                    break;
            };
        });
    })
})