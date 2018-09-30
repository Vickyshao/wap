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
    controllers.controller('zhuceCtrl', ['$scope', '$rootScope', 'resourceService', '$filter', '$state', 'ngDialog', '$location', 'md5', '$localStorage', '$stateParams','signWeChatService', function ($scope, $rootScope, resourceService, $filter, $state, ngDialog, $location, md5, $localStorage, $stateParams,signWeChatService) {
        signWeChatService();
        if ($filter('isRegister')().register) {
            $scope.user = $filter('isRegister')().user.member;
        }
        $rootScope.title = '注册';
        document.getElementsByTagName('html')[0].scrollTop = 0;
        document.getElementsByTagName('body')[0].scrollTop = 0;
        // $rootScope.maskError=true;
        $scope.userLogin = {};
        $scope.isGetCode = true;
        $scope.nowTimer = '获取验证码';
        $scope.lastPhone = '';
        //进入注册页面不允许出现已有账号请登录字样时请携带source: 'tyjReg'
        if ($stateParams.source == 'tyjReg') {
            $scope.isShowText = true;
        }
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
        $scope.continue = false;
        // 判断手机号是否正确
        $scope.isPoneAvailable = function ($poneInput) {
            var myreg=/^[1][3,4,5,6,7,8,9][0-9]{9}$/;
            if (!myreg.test($poneInput)) {
                return false;
            } else {
                return true;
            }
        }
        $scope.isExitsFunction = function (funcName) {
            try {
                if (typeof(eval(funcName)) == "function") {
                    return true;
                }
            } catch(e) {}
            return false;
        }
        $scope.next = function (tegForm) {
            if ($scope.lastPhone != $scope.userLogin.mobilephone) {
                if ($scope.lastPhone != '') {
                    if ($scope.isExitsFunction($scope.stop)) {
                        $scope.stop();
                    }
                    $scope.nowTimer = '获取验证码';
                    $scope.userLogin.picCode = '';
                    $scope.userLogin.smsCode = '';
                    $scope.userLogin.passWord = '';
                }
                $scope.lastPhone = $scope.userLogin.mobilephone;
                if (!$scope.isPoneAvailable(tegForm.mobilephone.$modelValue)) {
                    $scope.isShowerrorText = true;
                    return;
                }
                if(!tegForm.mobilephone.$invalid) {
                    $scope.isGetCode = true;
                    resourceService.queryPost($scope, $filter('getUrl')('getPhone'), {
                        mobilephone: $scope.userLogin.mobilephone
                    }, { name: '注册验证手机号', tegForm: tegForm });
                }
            } else {
                $scope.continue = !$scope.continue;
            }
        }
        $scope.cleanPhone = function () {
            $scope.userLogin.mobilephone = '';
            $scope.hidePhone();
        }
        $scope.hidePhone = function () {
            $scope.isShowerrorText = false;
        }
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
        // changeIMG();
        $scope.clickInput = function (event) {
            // $scope.userLogin.picCode = null;
            changePicEvent = event;
            changeIMG(changePicEvent);
        };
        $scope.passwordText = false;
        $scope.isSubMin = false;
        var changePicEvent;
        // var targetFrom;
        if ($location.$$search.frompc) { $scope.frompc = $location.$$search.frompc; }
        // var changeIMG = function (event) { //换图片验证码
        //     if (event != undefined) {
        //         event.currentTarget.src = '../login/validateCode.do?version=' + $rootScope.version + '&channel=' + $rootScope.channel + '&' + new Date().getTime();
        //     } else {
        //         if ($('.img-box img')[0] != undefined) {
        //             $('.img-box img')[0].src = '../login/validateCode.do?version=' + $rootScope.version + '&channel=' + $rootScope.channel + '&' + new Date().getTime();
        //         };
        //     };
        // };
        // $scope.clickOnChangeIMG = function (event) {
        //     changeIMG(event);
        // };
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
            if ($localStorage.isWxUser != undefined && $localStorage.isWxUser.toFrom) {
                $scope.userLogin.toFrom = $localStorage.isWxUser.toFrom;
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
        $scope.isSubMin = true;
        $scope.hasPhone = false;
        $scope.getyzm = function (tegForm) {

            if(tegForm.picCode.$invalid){
                $filter('zuceError')('1015');
                changeIMG();
                return;
            } else if($scope.validate(tegForm,1)){
                console.log($scope.userLogin)
                resourceService.queryPost($scope, $filter('getUrl')('getyzm'), {
                    mobilephone: $scope.userLogin.mobilephone,
                    picCode: $scope.userLogin.picCode,
                    // 有图形码时设置isPic为true，没有不设置
                    isPic : true
                    // isCheckPic: false
                }, { name: '获取验证码', tegForm: tegForm});
            } else{
                // $scope.login.picCode = '';
                changeIMG();
                $filter('zuceError')('1012');
            }



            /*resourceService.queryPost($scope, $filter('getUrl')('getyzm'), {
                mobilephone: $scope.userLogin.mobilephone,
                picCode: $scope.userLogin.picCode,
                // 有图形码时设置isPic为true，没有不设置
                isPic : true,
                isCheckPic: false
            }, { name: '获取验证码', tegForm: tegForm});*/
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

        /*焦点进入与离开*/
        $scope.blurID = function (code, tegForm) {
            if (!tegForm.mobilephone.$error.required && !tegForm.mobilephone.$error.minlength && !tegForm.mobilephone.$error.pattern) {
                resourceService.queryPost($scope, $filter('getUrl')('getPhone'), {
                    mobilephone: $scope.userLogin.mobilephone
                }, { name: '注册验证手机号', tegForm: tegForm });
            };
            // changeIMG();
        };
        $scope.toback = function () {
            // $filter('跳回上一页')();
            if ($scope.continue) {
                $scope.isShowerrorText = false;
                $scope.continue = false;
                // $scope.isGetCode =true;
            } else {
                $filter('跳回上一页')();
            }
        };
        $scope.$on('resourceService.QUERY_POST_MYEVENT', function (event, data, type) {
            switch (type.name) {
                case '获取验证码':
                    if (data.success==true) {
                        $scope.lastPhone = $scope.userLogin.mobilephone;
                        $filter('60秒倒计时')($scope, 60);
                        $scope.isImgCode=false;
                        $scope.isGetCode =false;
                    } else if(data.errorCode == '1006'){
                        $filter('zuceError')('1005');
                        $scope.isGetCode =false;
                    } else {
                        // $scope.stop();
                        $filter('手机短信验证错误')(type.tegForm, data.errorCode);
                        $scope.isGetCode =false;
                    }
                    break;
                case '注册验证手机号':
                    if (data.success) {
                        if (data.map.exists) { //已有用户名
                            $scope.hasPhone = true;
                            $filter('zuceError')('1003');
                        } else {
                            $scope.hasPhone = false;
                            $scope.continue = true;
                            // if($scope.isGetCode) {$scope.getyzm($scope.userLoginform);}
                        };
                    }
                    break;
                case '验证图形码':
                    if (data.success) {
                        if (data.map) { //图形码验证失败
                            $filter('zuceError')('1005');
                            return;
                        }
                        else if ($scope.isSubMin) {
                            resourceService.queryPost($scope, $filter('getUrl')('getyzm'), {
                                mobilephone: $scope.userLogin.mobilephone,
                                picCode: $scope.userLogin.picCode
                            }, { name: '获取验证码', tegForm: tegForm });
                            $filter('60秒倒计时')($scope, 120);
                        }
                    }
                    break;
                case '注册':
                    isSub = true;
                    if (data.success) {
                        $scope.returnurl = $state.params.returnurl?$state.params.returnurl:'';
                        $localStorage.user = data.map;
                        // _hmt.push(['_trackPageview', '/maidian/zccg']);
                        _hmt.push(['_trackPageview', '/mian/myCoupon']);
                        if ($stateParams.toWhere) {
                            $state.go($stateParams.toWhere, { wap: true });
                        } else if($stateParams.source == 'egg') {
                            $state.go("dropEgg",{ source: 'egg'});
                        }  /*else if($stateParams.toFrom == 'cb') {
                            $state.go('newhandSuccess');
                        }  */else {
                            $state.go('tyjRegSuccess',{ returnurl: $scope.returnurl });
                        }
                    } else {
                        $filter('serverZuceError')(type.tegForm, data.errorCode);
                        $scope.userLogin.passWord = '';
                        changeIMG();
                        $scope.stop();
                    };
                    break;
            };
        });
    }

    ])
    /*-------------------------------实名认证-------------------------------------------------------*/
    controllers.controller('controllerRealName', ['$scope', '$rootScope', 'resourceService', '$filter', '$state', 'ngDialog', function ($scope, $rootScope, resourceService, $filter, $state, ngDialog) {
        $scope.toPassword = function () {
            resourceService.queryPost($scope, $filter('getUrl')('setrealname'), {
                'realName': $scope.username,
                'idCards': $scope.userID,
                'uid': localStorage.userid
            }, '实名认证');
        }



        $scope.$on('resourceService.QUERY_POST_MYEVENT', function (event, data, type) {


            if (type == '实名认证') {
                if (data.result == "0") {
                    if (data.nologin == "nologin") {

                        $filter('errorMsgDialog')('none', ngDialog, '用户未登录');
                    } else if (data.nologin == "error") {

                        $filter('errorMsgDialog')('none', ngDialog, '实名失败');

                    } else if (data.nologin == "alreadyVerify") {
                        $filter('errorMsgDialog')('none', ngDialog, '身份证已实名过，不能重复实名');

                    }

                } else if (data.result == "1") {
                    $filter('errorMsgDialog')('none', ngDialog, '认证成功');
                    $state.go('password');
                }

            }
        });

    }])
    controllers.controller('controllerSetPassword', ['$scope', '$rootScope', 'resourceService', '$filter', '$state', 'ngDialog', function ($scope, $rootScope, resourceService, $filter, $state, ngDialog) {

        $scope.toHome = function () {
            resourceService.queryPost($scope, $filter('getUrl')('setpassword'), {
                'mobilephone': localStorage.phone,

                'uid': localStorage.userid

            }, '设置交易密码');
            //                      
            //                      $state.go('home');

        }




        $scope.$on('resourceService.QUERY_POST_MYEVENT', function (event, data, type) {

            if (type == '设置交易密码') {
                if (data.result == "0") {
                    $filter('errorMsgDialog')('none', ngDialog, '失败');
                } else if (data.result == "error01") {
                    $filter('errorMsgDialog')('none', ngDialog, '手机号码为空');

                } else if (data.result == "error02") {
                    $filter('errorMsgDialog')('none', ngDialog, '登陆用户不存在');

                } else if (data.result == "1") {
                    $filter('errorMsgDialog')('none', ngDialog, '成功');
                    $state.go('home');
                }
            }
        });
    }])
    // --------------------------------------------------------------//
})
