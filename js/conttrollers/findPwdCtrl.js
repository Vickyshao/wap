/* 
 * @Author: lee
 * @Date:   2016-01-10 23:29:04
 * @Last Modified by:   Ellie
 * @Last Modified time: 2017-12-01 15:09:34
 */

define([
    'jweixin', 'js/module.js', 'jquery', 'ngdialog', 'SHR256'
    // ,'weixin'
], function (wx, controllers, $, ngdialog, SHR256, weixin) {
    controllers.controller('findPwdCtrl', ['$scope', '$rootScope', 'resourceService', '$filter', '$state', 'ngDialog', '$location', 'md5', '$localStorage', '$stateParams','signWeChatService', function ($scope, $rootScope, resourceService, $filter, $state, ngDialog, $location, md5, $localStorage, $stateParams,signWeChatService) {
        document.getElementsByTagName('html')[0].scrollTop = 0;
        document.getElementsByTagName('body')[0].scrollTop = 0;signWeChatService();
        if ($filter('isRegister')().register) {
            $scope.user = $filter('isRegister')().user.member;
        }
        $scope.userOBJ = $filter('isRegister')();
        $rootScope.title = '忘记密码';
        $scope.userLogin = {};
        $scope.mobilePhone = $stateParams.mobilePhone;
        $scope.mobilePhone1 = $stateParams.mobilePhone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
        $scope.forget = $stateParams.forget;
        if ($localStorage.webFormPath != undefined) {
            if ($localStorage.webFormPath.recommCode != undefined) {
                $scope.userLogin.recommPhone = $localStorage.webFormPath.recommCode;
            };
            if ($localStorage.webFormPath.toFrom != undefined) {
                $scope.userLogin.toFrom = $localStorage.webFormPath.toFrom;
            };
            if ($localStorage.webFormPath.tid != undefined) {
                $scope.userLogin.tid = $localStorage.webFormPath.tid;
            };
        };
        $scope.webFormPath = $localStorage.webFormPath;
        if ($location.$$search) { 
            $localStorage.webFormPath = $location.$$search
            $scope.webFormPath = $location.$$search; 
        }

        if ($scope.webFormPath.toFrom != undefined) {
            $scope.userLogin.toFrom = $scope.webFormPath.toFrom;
        }
        if ($scope.webFormPath.recommCode != undefined) {
            $scope.userLogin.recommPhone = $scope.webFormPath.recommCode;
        }
        if ($scope.webFormPath.tid != undefined) {
            $scope.userLogin.tid = $scope.webFormPath.tid;
        }
        if ($stateParams.myToFrom != '' && $stateParams.myToFrom != null) {
            $scope.userLogin.toFrom = $stateParams.myToFrom;
        }
        if ($stateParams.maskType != '' || $stateParams.maskType != undefined) {
            $localStorage.maskType = $stateParams.maskType;
        }
        $scope.showPwd = function (num) {
            if(num == '1') {
                $scope.type = $('#pwd').attr('type');
                if($scope.type == 'password') {
                    $('#pwd').attr('type','text');
                    $('.eyes1').removeClass('icon-openeyes').addClass('icon-closeeyes');
                } else {
                    $('#pwd').attr('type','password');
                    $('.eyes1').removeClass('icon-closeeyes').addClass('icon-openeyes');
                }
            } else {
                $scope.type = $('#pwd1').attr('type');
                if($scope.type == 'password') {
                    $('#pwd1').attr('type','text');
                    $('.eyes2').removeClass('icon-openeyes').addClass('icon-closeeyes');
                } else {
                    $('#pwd1').attr('type','password');
                    $('.eyes2').removeClass('icon-closeeyes').addClass('icon-openeyes');
                }
            }
        }
        $scope.blue = function (event) {
            $(event.target).parents('.common-box').addClass('focus');
        }
        $scope.removeblue = function (event) {
            $(event.target).parents('.common-box').removeClass('focus');
        }
        $scope.passwordText = false;
        $scope.isSubMin = false;
        if ($location.$$search.frompc) { $scope.frompc = $location.$$search.frompc; }
        var isSub = true;
        $scope.isImgCode = true;
        $scope.zuce = function (tegForm) {
            $scope.userLogin.checkbox = true;
            if ($scope.userLogin.recommPhone === undefined) {
                delete $scope.userLogin.recommPhone;
            };
            if ($scope.userLogin.toFrom === undefined) {
                delete $scope.userLogin.toFrom;
            };
            
            if (tegForm.$valid) {
                if ($scope.userLogin.passWord.length > 5) {
                    if (isSub) {
                        isSub = false;
                        resourceService.queryPost($scope, $filter('getUrl')('zuce'), $scope.userLogin, { name: '注册', tegForm: tegForm });
                    }
                }
            } else {
                $scope.validate(tegForm,0);
            }

        }

        $scope.showPassword = function (passwordTextBool) {
            if(passwordTextBool) {
                $scope.passwordText = false;
            } else {
                $scope.passwordText = true;
            }
        }
        $scope.commitPwd = function (tegForm) {
            if(tegForm.passWord1.$modelValue == tegForm.passWord2.$modelValue) {
                resourceService.queryPost($scope, $filter('getUrl')('设置登录密码'),{
                    pwd: $scope.userLogin.passWord1,
                    smsCode: $scope.userLogin.smsCode,
                    mobilephone:$scope.mobilePhone
                },{ name: '设置登录密码', tegForm: tegForm });
            } else {
                $filter('zuceError')('1020');
            }
        }
        $scope.isSubMin = true;
        $scope.hasPhone = false;
        $scope.getyzm = function () {
            resourceService.queryPost($scope, $filter('getUrl')('登录密码重置短信验证码'), {
                mobilephone: $scope.mobilePhone,
                // picCode: $scope.userLogin.picCode,
                // 有图形码时设置isPic为true，没有不设置
                isPic : true,
                isCheckPic: false
            }, { name: '登录密码重置短信验证码'});
        };
        if($scope.forget) {$scope.getyzm();}
        // flag = 0表示立即领取  flag = 1 表示获取验证码
        $scope.validate = function(tegForm, flag){
            if (tegForm.mobilephone.$error.required == true) {
                $filter('zuceError')('1001');
                return false;
            }
            else if (tegForm.mobilephone.$valid == false) {
                $filter('zuceError')('1002');
                return false;
            }
            else if ($scope.hasPhone == true) {
                $filter('zuceError')('1003');
                return false;
            }
            else if (tegForm.picCode.$error.required == true) {
                $filter('zuceError')('1004');
                return false;
            }
            else if (tegForm.smsCode.$error.required == true && flag == 0) {
                $filter('zuceError')('1006');
                $scope.userLogin.smsCode = '';
                return false;
            }
            else if (tegForm.passWord.$error.required == true && flag == 0) {
                $filter('zuceError')('1010');
                $scope.userLogin.passWord = '';
                return false;
            }
            else if (tegForm.passWord.$valid == false && flag == 0) {
                $filter('zuceError')('1011');
                return false;
            }
            return true;
        };
        $scope.toback = function () {
            $filter('跳回上一页')();
        };
        $scope.$on('resourceService.QUERY_POST_MYEVENT', function (event, data, type) {
            switch (type.name) {
                case '登录密码重置短信验证码':
                    if(data.success){
                        $filter('60秒倒计时')($scope, 60);
                    }else{
                        $filter('登录交易密码短信验证码错误信息')(data.errorCode);
                        $scope.forget = false;
                        $scope.nowTimer = '重新发送';
                    }
                    break;
                case '设置登录密码':
                    if (data.success) {
                        $scope.returnurl = $stateParams.returnurl?$stateParams.returnurl:'';
                        $filter('重置密码成功')('重置登录密码成功',$scope);
                        setTimeout(function () {
                            $state.go('dl',{mobilephone: $stateParams.mobilePhone, returnurl: $scope.returnurl })
                        },500)
                    } else {
                        if(data.errorMsg) {
                            ngDialog.open({
                                template: '<p class="error-msg">' + data.errorMsg + '</p>',
                                showClose: false,
                                closeByDocument: true,
                                plain: true
                            });
                            setTimeout(function () {
                                ngDialog.closeAll();
                            }, 1500);
                        } else {
                            $filter('重置交易密码错误信息')(data.errorCode,$scope)
                        }

                    }
                    break;
            };
        });
    }

    ])
})
