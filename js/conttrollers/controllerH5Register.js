/* 
 * @Author: lee
 * @Date:   2016-01-10 23:29:04
 * @Last Modified by:   anchen
 * @Last Modified time: 2016-01-12 21:49:52
 */

'use strict';

define([
        'js/module.js'
        , 'jquery'
        , 'ngdialog'
        ,'SHR256'
    ]
    , function (controllers, jq, ngdialog,SHR256,weixin) {
        controllers.controller('controllerH5Register'
            , ['$scope', '$rootScope'
                , 'resourceService'
                , '$filter'
                , '$state','ngDialog','$location','md5','$localStorage'
                , function ($scope, $rootScope, resourceService, $filter, $state,ngDialog,$location,md5,$localStorage) {  
                    $rootScope.title='沪深理财-注册';
                    if($location.$$url == '/triplegift'){
                        $scope.isText=false;
                    }else{
                        $scope.isText=true;
                    }

                    //电信渠道功能
                    $scope.showRules = false;
                    $scope.focusMobilePhone = function() {
                        $('.mobilephone').focus();
                    };

                    // $rootScope.maskError=true;
                    $scope.picUrl='../login/validateCode.do?version='+$rootScope.version+'&channel='+$rootScope.channel;
                    $scope.login={} ;
                    $scope.webFormPath = $location.$$search;
                    function getUrlParam(name) {
                                var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
                                var r = window.location.search.substr(1).match(reg);  //匹配目标参数
                                if (r != null) return unescape(r[2]); return null; //返回参数值
                            }
                    var recommCode = getUrlParam('recommCode');
                    var toFrom = getUrlParam('toFrom');
                    var isMmtoken = getUrlParam('mmtoken');

                    $scope.isShow = getUrlParam('allowDL') == 'false' ? false : true;

                    $scope.webFormPath.recommCode = recommCode;
                    $scope.webFormPath.toFrom = toFrom;

                    if($scope.webFormPath.toFrom != undefined){
                        $scope.login.toFrom = $scope.webFormPath.toFrom;
                    }
                    if($scope.webFormPath.recommCode!=undefined){
                        $scope.login.recommPhone = $scope.webFormPath.recommCode;
                    }
                    $scope.passwordText=false;
                    $scope.isSubMin=false;
                    $scope.nowTimer="获取验证码";
                    var changePicEvent;
                    var targetFrom;

                    var changeIMG = function (event) {//换图片验证码
                        if(event != undefined){
                            event.currentTarget.src += '&'+ new Date().getTime();
                        }else{
                            if($('.img-box img')[0]!= undefined){
                                $('.img-box img')[0].src += '&'+ new Date().getTime();  
                            };
                        };
                    };
                    var isSub=true;
                    $scope.zuce=function(tegForm){
                        $scope.login.checkbox = true;
                        if($scope.login.recommPhone === undefined){
                            delete $scope.login.recommPhone;
                        };
                        if($scope.login.toFrom === undefined){
                            delete $scope.login.toFrom;
                        };
                        if(tegForm.$valid){
                            // $scope.login.passWord = hex_sha256(md5.createHash($scope.login.passWord || ''));
                            if(isSub){
                                resourceService.queryPost($scope, $filter('getUrl')('zuce'),$scope.login, {name:'注册',tegForm:tegForm}); 
                                isSub=false;
                            }
                        }else{
                            $rootScope.errorText= '正确密码格式为6-18位字母数字混合';
                            $rootScope.maskError= true;
                        }
                    }

                    $scope.isClickOpen = function(){
                        $scope.isOpen=true;
                    };
                    $scope.showPassword=function (passwordTextBool) {
                        if(passwordTextBool){
                            $scope.passwordText=false;
                            $scope.passwordText=true;
                        }
                    }
                    $scope.isSubMin=true;
                    $scope.getyzm=function(tegForm){
                        targetFrom=tegForm;

                        if(tegForm.mobilephone.$valid==false){
                            // $scope.isSubMin =false;
                        }else{
                            // $scope.isSubMin = true;
                            if($scope.isSubMin){
                                resourceService.queryPost($scope,$filter('getUrl')('getyzm'),{
                                    mobilephone: $scope.login.mobilephone
                                },{name:'获取验证码',tegForm:tegForm});
                                $filter('60秒倒计时')($scope,60);
                            }
                            // $scope.isSubMin =true;
                        };
                    };
                   /*焦点进入与离开*/
                    $scope.blurID = function(code,tegForm) {
                        if(!tegForm.mobilephone.$error.required && !tegForm.mobilephone.$error.minlength && !tegForm.mobilephone.$error.pattern) {
                            resourceService.queryPost($scope,$filter('getUrl')('getPhone'),{
                                mobilephone:$scope.login.mobilephone
                            },{name:'注册验证手机号',tegForm:tegForm});
                        };
                    };
                        
                    $scope.$on('resourceService.QUERY_POST_MYEVENT', function(event,data,type) {
                        switch(type.name){
                            case '获取验证码': 
                                if(data.success){
                                    $rootScope.errorText= '验证码发送成功';
                                    $rootScope.maskError= true;
                                }else{
                                    $scope.stop();
                                    $filter('手机短信验证错误')(type.tegForm,data.errorCode);
                                }
                            break;
                            case '注册验证手机号': 
                                if(data.success){
                                    if (data.map.exists) {//已有用户名
                                        $rootScope.errorText= '此手机已注册';
                                        $rootScope.maskError= true;
                                    }else{
                                        // type.tegForm.mobilephone.$error.serverError = data.map.exists;
                                    };
                                }
                            break;
                            case '注册':
                                isSub=true;
                                if(data.success){
                                    /*脉脉*/
                                    if(isMmtoken != null && isMmtoken != ''){
                                        jq.ajax({
                                              type:"get",
                                              url:"https://maimai.cn/hb_pingback?mmtoken="+isMmtoken,
                                              dataType:"jsonp",
                                              callback:"need_callback",
                                              success:function(json){
                                                $(".user").html("用户信息："+json.username+","+json.age+","+json.gender);
                                              },
                                              error:function(){
                                            }
                                        });
                                    };
                                    //-------------------脉脉结束------------------ 
                                    $localStorage.user = data.map;
                                    // $state.go('main.home');
                                    
                                    $state.go('myCoupon');
                                }else{
                                    $filter('serverZuceError')(type.tegForm,data.errorCode);
                                    $scope.login.passWord ='';
                                };
                            break;
                        };
                    });
                }
            ])
            

    })