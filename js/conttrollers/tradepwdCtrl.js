define([
    'js/module.js'
    ]
    ,function(controllers){
    controllers.controller('tradepwdCtrl'
        ,['$scope'
        ,'$rootScope'
        ,'$filter'
        ,'$state'
        ,'resourceService'
        ,'$interval'
        ,'$stateParams'
        ,'ngDialog'
        ,function($scope,$rootScope,$filter,$state,resourceService,$interval,$stateParams,ngDialog){
           
            /*$scope.userOBJ=$filter('isRegister')();
            $scope.isGetCode = false;
            $scope.times = 59;
            $scope.isSubmit = false;
            $scope.showCode = false;
            $scope.showCode2 = false;

            if ($stateParams.firstset == 'true') {
                 $rootScope.title="设置交易密码";
                 $scope.firstset = true;
            } else if ($stateParams.firstset == 'false') {
                 $rootScope.title="重置交易密码";
                 $scope.firstset = false;
            }

            $scope.$on('resourceService.QUERY_POST_MYEVENT', function(event,data,type) {
                switch(type){
                    case '交易密码重置短信验证码': 
                        if(data.success){
                            $scope.timer = $interval(function(){
                                if ($scope.times == 1) {
                                    $interval.cancel($scope.timer);
                                    $scope.isGetCode = false;
                                    $scope.times = 59;
                                    return;
                                }
                                $scope.times --;
                            }, 1000);
                        }else{
                            $filter('登录交易密码短信验证码错误信息')(data.errorCode);
                        }
                    break;
                    case '设置交易密码':
                        if (data.success) {
                            $filter('重置交易密码成功')($rootScope.title+'成功',$scope);
                        } else {
                            $filter('重置交易密码错误信息')(data.errorCode,$scope)
                        }
                    break;
                };
            });

            $scope.getCode = function() {
                if ($scope.isGetCode) {
                    return;
                }
                resourceService.queryPost($scope, $filter('getUrl')('交易密码重置短信验证码'), {
                    uid:$scope.userOBJ.user.member.uid,
                    type: 1
                }, '交易密码重置短信验证码');
                $scope.isGetCode = true;
            };

            $scope.setInput = function(name) {
                switch (name) {
                    case 'code': 
                        if ($scope.tpwdSetForm.code.$error.required) {
                            $filter('修改交易密码错误信息')('codeRequired',$scope);
                        }
                    break;
                    case 'tpwd':
                        if ($scope.tpwdSetForm.tpwd.$error.pattern) {
                            $filter('修改交易密码错误信息')('tpwdPattern',$scope);
                        } else if ($scope.tpwdSetForm.tpwd.$error.required) {
                            $filter('修改交易密码错误信息')('tpwdRequired',$scope);
                        }
                    break;
                    case 'retpwd':
                        if ($scope.tpwdSetForm.retpwd.$error.pattern) {
                            $filter('修改交易密码错误信息')('tpwdPattern',$scope);
                        } else if ($scope.tpwdSetForm.retpwd.$error.required) {
                            $filter('修改交易密码错误信息')('tpwdRequired',$scope);
                        }
                    break;  
                }
            };

            // 提交表单
            $scope.submitForm = function(valid) {
                if (!valid || $scope.isSubmit) {
                    return;
                }
                $scope.isSubmit = true;
                resourceService.queryPost($scope, $filter('getUrl')('设置交易密码'),{
                    tpwd: $scope.trade.tpwd,
                    // smsCode: $scope.trade.code,
                    chkSmsCode: false,
                    uid: $scope.userOBJ.user.member.uid
                },'设置交易密码');
            };

            $scope.toback=function () {
                $filter('跳回上一页')(2);
            };*/

            $rootScope.title="重置交易密码";
            $scope.userOBJ=$filter('isRegister')();
            $scope.isGetCode = false;
            $scope.times = 59;
            $scope.isSubmit = false;
            $scope.showCode = false;
            $scope.toback=function () {
                $filter('跳回上一页')();
            };
            if ($stateParams.firstset == 'true') {
                $rootScope.title="设置交易密码";
                $scope.firstset = true;
            } else if ($stateParams.firstset == 'false') {
                $rootScope.title="重置交易密码";
                $scope.firstset = false;
            }

            $scope.$on('resourceService.QUERY_POST_MYEVENT', function(event,data,type) {
                switch(type){
                    case '登录密码重置短信验证码':
                        if(data.success){
                            $scope.timer = $interval(function(){
                                if ($scope.times == 1) {
                                    $interval.cancel($scope.timer);
                                    $scope.isGetCode = false;
                                    $scope.times = 59;
                                    return;
                                }
                                $scope.times --;
                            }, 1000);
                        }else{
                            $filter('登录交易密码短信验证码错误信息')(data.errorCode);
                            $scope.isGetCode = false;
                        }
                        break;
                    case '设置交易密码':
                        if (data.success) {
                            $filter('重置交易密码成功')('重置交易密码成功',$scope);
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

            $scope.getCode = function() {
                if ($scope.isGetCode) {
                    return;
                }
                var obj = {};
                obj = {
                    uid:$scope.userOBJ.user.member.uid,
                    type: 1
                };
                resourceService.queryPost($scope, $filter('getUrl')('交易密码重置短信验证码'),obj,'登录密码重置短信验证码');
                $scope.isGetCode = true;
            };


            // 提交表单
            $scope.submitForm = function(pwdSetForm) {

                if (!pwdSetForm.code.$modelValue) {
                    $filter('重置交易密码过程错误')(1111,$scope)
                    return;
                } else {
                    $scope.isSubmit = true;
                    var obj = {};
                    obj = {
                        tpwd: $scope.pwd.pwd,
                        smsCode: $scope.pwd.code,
                        uid: $scope.userOBJ.user.member.uid
                    };
                    resourceService.queryPost($scope, $filter('getUrl')('设置交易密码'),obj,'设置交易密码');
                }
            };

            $scope.toback=function () {
                $filter('跳回上一页')();
            };
            
        }
    ]);
})