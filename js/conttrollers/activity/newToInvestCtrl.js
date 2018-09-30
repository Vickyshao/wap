define(['jweixin', 'js/module.js', 'jquery', 'ngdialog', 'SHR256'], function (wx, controllers, $, ngdialog, SHR256, weixin) {
    controllers.controller('newToInvestCtrl', ['$scope', '$rootScope', 'resourceService', '$filter', '$state', 'ngDialog', '$location', 'md5', '$localStorage', '$stateParams', function ($scope, $rootScope, resourceService, $filter, $state, ngDialog, $location, md5, $localStorage, $stateParams) {
        $filter('isPath')('pullNew');

        $('body').scrollTop(0);
        $scope.title = '新手注册专题';
        $scope.login = {};
        $scope.isLogin = $filter('isRegister')().register;
        $scope.user = $filter('isRegister')().user.member;

        $scope.showdownload = true;
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
        $scope.toLogin = function () {
            $state.go('dl',{toFrom: $stateParams.toFrom});
        };
        $scope.webFormPath = $localStorage.webFormPath;
        if ($location.$$search) { 
            $localStorage.webFormPath = $location.$$search
            $scope.webFormPath = $location.$$search; 
        }

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

        $scope.toLogin = function () {
            $state.go('dl',{toFrom: $stateParams.toFrom});
        };
        var wap = $rootScope.wap = $rootScope.getUrlParam('wap');
        var pid = $rootScope.wap = $rootScope.getUrlParam('pid');
        var platform = $rootScope.getUrlParam('platform');
        if($rootScope.fromNative) {
            $('.pullNew').css('padding-top','0');
        } else {
            $('.pullNew').css('padding-top','40px');
        }
        // 回到顶部
        $scope.gotop = function () {
            $("html,body").animate({ scrollTop: $(".pullNewWrap").offset().top });
        };
        // 新手专享注册领取
        if($rootScope.fromNative) {
            if($rootScope.uid) {
                $('.changTxt a').html('立即使用');
            } else {
                $('.changTxt a').html('立即领取');
            }
        } else {
            if(!($scope.isLogin)){
                $('.changTxt a').html('立即领取');
            } else {
                $('.changTxt a').html('立即使用');
            }
        }
        $scope.toReceive = function () {
            if($rootScope.fromNative) {
                document.location = 'hushenlicaiyouhuiquan:';
            } else {
                if(!($scope.isLogin)){
                    $('.list1 a').attr('href','/zhuce');
                } else {
                    $('.list1 a').attr('href','/myCoupon');
                }
            }
        }

        // 新手专享立即投资
        $scope.toInvest = function () {
            if($rootScope.fromNative) {
                var hushendetail = {
                    pid:$scope.newhand.id,
                    ptype:1
                }
                document.location = 'hushendetail1:' + angular.toJson(hushendetail);
            } else {
                if(!($scope.isLogin)){
                    $('.list2 a').attr('href','/zhuce');
                } else {
                    if($scope.newHandInvested) {
                        $('.list2 a').attr('href','/main/bankBillList');
                    } else {
                        $('.list2 a').attr('href','/cpDetail?pid='+$scope.newhand.id);
                    }
                }
            }
        }
        // 新手专享去注册
        $scope.toZhuce = function () {
            if($rootScope.fromNative) {
                document.location = 'hushenlicaizhuce:';
            } else {
                if(!($scope.isLogin)){
                    $('.list3 a').attr('href','/zhuce');
                } else {
                    $('.list3 a').attr('href','/main/myaccountHome');
                }
            }
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
            if ($scope.isSubMin == true) {
                if ($scope.isSubMin == true) {
                    if (tegForm.picCode.$invalid) {
                        $filter('zuceError')('1015');
                        return;
                    } else if ($scope.isImgCode == true) {
                        if ($scope.validate(tegForm, 1)) {
                            resourceService.queryPost($scope, $filter('getUrl')('getyzm'), {
                                mobilephone: $scope.login.mobilephone,
                                picCode: $scope.login.picCode,
                                isPic : true,
                                // isCheckPic: true,
                                type: 1
                            }, {name: '获取验证码', tegForm: tegForm});
                        }
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

        $scope.form = true;
        $scope.next = function (tegForm) {
            if (tegForm.mobilephone.$error.required == true) {
                $filter('zuceError')('1001');
                return false;
            }
            else if (tegForm.mobilephone.$valid == false) {
                $filter('zuceError')('1002');
                return false;
            } 
            if (!tegForm.mobilephone.$error.required && !tegForm.mobilephone.$error.minlength && !tegForm.mobilephone.$error.pattern) {
                resourceService.queryPost($scope, $filter('getUrl')('getPhone'), {
                    mobilephone: $scope.login.mobilephone
                }, { name: '注册验证手机号', tegForm: tegForm });
            };
            changeIMG();
           
            // $scope.sendMessage(tegForm);
        };
        // flag = 0表示立即领取  flag = 1 表示获取验证码
        $scope.validate = function(tegForm, flag){
            if ($scope.hasPhone == true) {
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
        /*$scope.blurID = function (code, tegForm) {
            if (!tegForm.mobilephone.$error.required && !tegForm.mobilephone.$error.minlength && !tegForm.mobilephone.$error.pattern) {
                resourceService.queryPost($scope, $filter('getUrl')('getPhone'), {
                    mobilephone: $scope.login.mobilephone
                }, { name: '注册验证手机号', tegForm: tegForm });
            };
            changeIMG();
        };*/
        $scope.$on('resourceService.QUERY_POST_MYEVENT', function (event, data, type) {
            switch (type.name) {

                case 'index':
                    $scope.index = data.map;
                    $scope.newHandInvested = data.map.newHandInvested;
                    $scope.newhand = data.map.newHand;
                    break;
                case '获取验证码':
                    if (data.success==true) {
                        $filter('60秒倒计时')($scope, 120);
                        $scope.isImgCode=false;
                        $filter('zuceError')('1013');
                    } else if(data.errorCode == '1006'){
                        changeIMG();
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
                        changeIMG();
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
                            $scope.form = !$scope.form;
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
                        // if($stateParams.toFrom == 'cb') {
                            $state.go('newhandSuccess');
                        // } else {
                            // $state.go('tyjRegSuccess');
                        // }

                        document.location = "hushen:" +  JSON.stringify(data.map);
                    } else {
                        $filter('serverZuceError')(type.tegForm, data.errorCode);
                        // $scope.login.passWord = '';
                    };
                    break;
            };
        });

        var obj = {};
        if ($scope.user) { obj.uid = $scope.user.uid; }
        resourceService.queryPost($scope, $filter('getUrl')('shouYe'), obj, { name: 'index' });
    }])
})