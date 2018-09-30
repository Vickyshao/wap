define(['jweixin', 'js/module.js', 'jquery', 'ngdialog', 'SHR256'], function (wx, controllers, $, ngdialog, SHR256, weixin) {
    controllers.controller('loginTempCtrl', ['$scope', '$rootScope', 'resourceService', '$filter', '$state', 'ngDialog', '$location', 'md5', '$localStorage', '$stateParams', function ($scope, $rootScope, resourceService, $filter, $state, ngDialog, $location, md5, $localStorage, $stateParams) {

        $scope.login = {};
        $scope.isLogin = $filter('isRegister')().register;

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
        changeIMG();

        $scope.clickInput = function (event) {
            // $scope.userLogin.picCode = null;
            changePicEvent = event;
            changeIMG(changePicEvent);
        };
        $scope.passwordText = false;
        $scope.isSubMin = true;
        $scope.nowTimer = "获取验证码";
        var isSub = true;
        var changePicEvent;
        $scope.isImgCode = true;
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
                $scope.validate(tegForm,0);
            }
        }

        $scope.getyzm = function (tegForm) {
            if (tegForm.mobilephone.$error.required == true) {
                $filter('zuceError')('1001');
                return false;
            }
            else if (tegForm.mobilephone.$valid == false) {
                $filter('zuceError')('1002');
                return false;
            } else if ($scope.hasPhone == true) {
                $filter('zuceError')('1003');
                return false;
            }else if ($scope.isSubMin == true) {if (tegForm.picCode.$invalid) {
                $filter('zuceError')('1015');
                return false;
            } else if($scope.isImgCode==true){
                if($scope.validate(tegForm,1)){
                    resourceService.queryPost($scope, $filter('getUrl')('getyzm'), {
                        mobilephone: $scope.login.mobilephone,
                        picCode: $scope.login.picCode,
                        isPic : true
                    }, { name: '获取验证码', tegForm: tegForm });
                }
            }
            else{
                $scope.login.picCode = '';
                $scope.isImgCode=true;
                changeIMG();
                $filter('zuceError')('1012');
            }


                if($rootScope.maskError) {
                    setTimeout(function () {
                        $rootScope.maskError = false;
                    }, 1500);
                }

            }
        };
        // flag = 0表示立即领取  flag = 1 表示获取验证码
        $scope.validate = function(tegForm, flag){
            if (tegForm.mobilephone.$error.required == true) {
                $filter('zuceError')('1001');
                return false;
            }
            else if (tegForm.mobilephone.$valid == false) {
                $filter('zuceError')('1002');
                return false;
            } else if ($scope.hasPhone == true) {
                $filter('zuceError')('1003');
                return false;
            }
            else if (tegForm.picCode.$error.required == true) {
                $filter('zuceError')('1004');
                return false;
            }
            else if (tegForm.smsCode.$error.required == true && flag == 0) {
                $filter('zuceError')('1006');
                $scope.login.smsCode = '';
                return false;
            }
            else if (tegForm.passWord.$error.required == true && flag == 0) {
                $filter('zuceError')('1010');
                $scope.login.passWord = '';
                return false;
            }
            else if (tegForm.passWord.$valid == false && flag == 0) {
                $filter('zuceError')('1011');
                return false;
            }
            return true;
        };
        /*焦点进入与离开*/
        $scope.blurID = function (code, tegForm) {
            if (!tegForm.mobilephone.$error.required && !tegForm.mobilephone.$error.minlength && !tegForm.mobilephone.$error.pattern) {
                resourceService.queryPost($scope, $filter('getUrl')('getPhone'), {
                    mobilephone: $scope.login.mobilephone
                }, { name: '注册验证手机号', tegForm: tegForm });
            };
            changeIMG();
        };

        $scope.$on('resourceService.QUERY_POST_MYEVENT', function (event, data, type) {
            switch (type.name) {
                case '获取验证码':
                    if (data.success==true) {
                        $filter('60秒倒计时')($scope, 120);
                        $scope.isImgCode=false;
                        $filter('zuceError')('1013');
                    } else if(data.errorCode == '1006'){
                        ngDialog.open({
                            template: '<p class="error-msg">' + data.errorMsg+ '</p>',
                            showClose: false,
                            closeByDocument: false,
                            plain: true
                        });
                        setTimeout(function () {
                            ngDialog.closeAll();
                        }, 1000);
                    } else {
                        // $scope.stop();
                        $filter('手机短信验证错误')(type.tegForm, data.errorCode);
                    }
                    break;
                case '注册验证手机号':
                    if (data.success) {
                        if (data.map.exists) { //已有用户名
                            $scope.hasPhone = true;
                            $filter('zuceError')('1003');
                        }
                        else{
                            $scope.hasPhone = false;
                        }
                    }
                    break;
                case '注册':
                    isSub = true;
                    $scope.platform = $rootScope.getUrlParam('platform');
                    if (data.success) {
                        $localStorage.user = data.map;
                        ngDialog.open({
                            template: '<p class="error-msg">' + '注册成功'+ '</p>',
                            showClose: false,
                            closeByDocument: false,
                            plain: true
                        });
                        setTimeout(function () {
                            ngDialog.closeAll();
                        }, 1000);
                        // _hmt.push(['_trackPageview', '/maidian/zccg']);
                        _hmt.push(['_trackPageview', '/mian/myCoupon']);
                        $scope.platform = $rootScope.getUrlParam('platform');
                        $rootScope.platform = $scope.platform;
                        $state.go('tyjRegSuccess');

                        document.location = "hushen:" +  JSON.stringify(data.map);
                    } else {
                        $filter('serverZuceError')(type.tegForm, data.errorCode);
                        // $scope.login.passWord = '';
                    };
                    break;
            };
        });
    }])
})