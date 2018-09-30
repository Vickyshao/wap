define(['jweixin', 'js/module.js', 'jquery', 'ngdialog', 'SHR256'], function (wx, controllers, $, ngdialog, SHR256, weixin) {
    controllers.controller('eCommerceCtrl', ['$scope', '$rootScope', 'resourceService', '$filter', '$state', 'ngDialog', '$location', 'md5', '$localStorage', '$stateParams', function ($scope, $rootScope, resourceService, $filter, $state, ngDialog, $location, md5, $localStorage, $stateParams) {
        $filter('isPath')('eCommerce');
        $scope.toback=function () {
            $filter('跳回上一页')();
        };
        document.getElementsByTagName('html')[0].scrollTop = 0;
        document.getElementsByTagName('body')[0].scrollTop = 0;
        $rootScope.title = '沪深理财-网贷投资，国企控股平台';
        $scope.login = {};
        $scope.ecErrorCode = null;
        $scope.isLogin = $filter('isRegister')().register;
        $scope.banner = [
            {imgUrl: '/images/activity/eCommerce/swiper1.png', location: ''
            },{imgUrl: '/images/activity/eCommerce/swiper2.png',location: ''
            }
        ];

        $scope.toTop = function () {
            $("html,body").animate({ scrollTop: $(".eCommerce").offset().top });
        };
        $scope.changeCode = function () {
            $scope.form = !$scope.form;
            $scope.stop();//清除计时器
        }
        $scope.checkMobile = function (tegForm,mobilephone) {
            if(tegForm.mobilephone.$valid) {
                var patt1 = new RegExp(/^1[3|4|5|6|7|8|9][0-9]{9}$/);
                var checkMobileBool = patt1.test(mobilephone);
                if(checkMobileBool){
                    resourceService.queryPost($scope, $filter('getUrl')('getPhone'), {
                        mobilephone: $scope.login.mobilephone
                    }, { name: '注册验证手机号', tegForm: tegForm });
                }
            } else {

            }
        }
        $scope.checkEccode = function (tegForm,ecCode) {
            if(tegForm.ecCode.$valid) {
                var patt2 = new RegExp(/[A-Za-z0-9]{8}/);
                var ecCodeBool = patt2.test(ecCode);
                if(ecCodeBool){
                    resourceService.queryPost($scope, $filter('getUrl')('验证购物码'), {
                        ecCode: $scope.login.ecCode
                    }, { name: '验证购物码', tegForm: tegForm });
                }
            }
        }

        $scope.passwordText = false;
        $scope.isSubMin = true;
        $scope.form = true;
        $scope.nowTimer = "获取验证码";
        var isSub = true;
        // 验证注册流程
        // flag = 0表示立即领取  flag = 1 表示获取验证码
        $scope.validate = function(tegForm, flag){
            if (tegForm.smsCode.$error.required == true && flag == 0) {
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
            } else if($scope.ecErrorCode != null) {
                $filter('ecCodeError')($scope.ecErrorCode);
                return false;
            }
            return true;
        };
        if ($localStorage.webFormPath != undefined) {
           
            if ($localStorage.webFormPath.toFrom != undefined) {
                $scope.login.toFrom = $localStorage.webFormPath.toFrom;
            };
        };
        $scope.webFormPath = $localStorage.webFormPath;
        if ($location.$$search) { 
            $localStorage.webFormPath = $location.$$search
            $scope.webFormPath = $location.$$search; 
        }

        if ($scope.webFormPath.toFrom != undefined) {
            $scope.login.toFrom = $scope.webFormPath.toFrom;
        }
        
        if ($stateParams.myToFrom != '' && $stateParams.myToFrom != null) {
            $scope.login.toFrom = $stateParams.myToFrom;
        }
        
        // 点击到注册下一步
        $scope.next = function (tegForm) {
            if (tegForm.mobilephone.$error.required == true) {
                $filter('zuceError')('1001');
                return false;
            } else if (tegForm.mobilephone.$valid == false) {
                $filter('zuceError')('1002');
                return false;
            } else if ($scope.hasPhone == true) {
                $filter('zuceError')('1003');
                return false;
            } else if(tegForm.ecCode.$error.required == true) {
                $filter('zuceError')('1016');
                return false;
            } else if(tegForm.ecCode.$invalid == true) {
                $filter('zuceError')('1017');
                return false;
            }  else if($scope.ecErrorCode != null) {
                $filter('ecCodeError')($scope.ecErrorCode);
                return false;
            }

            $scope.form = !$scope.form;
            $scope.sendMessage(tegForm);
        };
        // 发送验证码
        $scope.sendMessage = function (tegForm) {
            if($scope.validate(tegForm,1)){
                resourceService.queryPost($scope, $filter('getUrl')('getyzm'), {
                    mobilephone: $scope.login.mobilephone,
                    isCheckPic : false
                }, { name: '获取验证码', tegForm: tegForm });
            }
        };
        // 点击重发
        $scope.getyzm = function (tegForm) {$scope.sendMessage(tegForm);};
        // 点击到注册
        $scope.zuce = function (tegForm) {
            $scope.login.checkbox = true;
            if (tegForm.$valid) {
                if (isSub) {
                    isSub = false;
                    resourceService.queryPost($scope, $filter('getUrl')('zuce'), $scope.login, { name: '注册', tegForm: tegForm });
                }
            } else {
                $scope.validate(tegForm,0);
            }
        }
        var $dataTable = $('.data-table');
        var trHeight = $('.data-list').height()/5;
        var page = {
            page: 1,
            pageSize: 10
        };
        resourceService.queryPost($scope, $filter('getUrl')('报销记录'), page , { name: '报销记录'});
        $scope.$on('resourceService.QUERY_POST_MYEVENT', function (event, data, type) {
            switch (type.name) {
                case '获取验证码':
                    if (data.success==true) {
                        $filter('60秒倒计时')($scope, 60);
                        // 发送成功弹窗
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
                case '验证购物码':
                    if(data.success) {
                        $scope.ecErrorCode = null;
                    }else{
                        if(data.errorCode == 'ds1001') {
                            $filter('ecCodeError')('1001');
                            $scope.ecErrorCode = '1001';
                        } else if(data.errorCode == 'ds1002') {
                            $filter('ecCodeError')('1002');
                            $scope.ecErrorCode = '1002';
                        } else if(data.errorCode == 'ds1003') {
                            $filter('ecCodeError')('1003');
                            $scope.ecErrorCode = '1003';
                        }
                    }
                    break;
                case '注册验证手机号':
                    if (data.success) {
                        if (data.map.exists) { //已有用户名
                            $scope.hasPhone = true;
                            $filter('zuceError')('1003');
                        } else{
                            $scope.hasPhone = false;
                        }
                    }
                    break;
                case '注册':
                    isSub = true;
                    $scope.platform = $rootScope.getUrlParam('platform');
                    if (data.success) {
                        $localStorage.user = data.map;
                        $filter('zuceError')('1014');
                        _hmt.push(['_trackPageview', '/mian/myCoupon']);
                        $scope.platform = $rootScope.getUrlParam('platform');
                        $rootScope.platform = $scope.platform;
                        $state.go('eComSuccess',{dsEcType: data.map.dsEcType});

                        // document.location = "hushen:" +  JSON.stringify(data.map);
                    } else {
                        $filter('serverZuceError')(type.tegForm, data.errorCode);
                    };
                    break;
                case '报销记录':
                    if(data.success) {
                        $scope.total = data.map.pageData.total;
                        $scope.pageData = data.map.pageData;
                        $scope.list = data.map.pageData.rows;
                        // 列表数据轮动
                        if ($scope.list.length > 4) {
                            setInterval(function() {
                                $dataTable.animate({'margin-top': '-'+trHeight+'px'},1000,function() {
                                    $dataTable.find('tr').eq(0).appendTo($dataTable);
                                    $dataTable.css('margin-top',0);
                                });
                            }, 5000);
                        }


                    }
                    break;

            };
        });


    }])
})