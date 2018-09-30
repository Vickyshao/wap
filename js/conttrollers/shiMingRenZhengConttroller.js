/* 
* @Author: xyc
* @Date:   2016-01-18 23:29:04
*/

'use strict';
define([
    'js/module.js'
    ,'jquery'
    ,'ngdialog'
    ]
    ,function(controllers,$,ngdialog){

    controllers.controller('SMRZcontroller'
        ,['$scope'
        ,'resourceService'
        ,'$filter'
		,'$http'
        ,'$state'
        ,'$rootScope'
        ,'$localStorage'
        ,'ngDialog'
        ,'$stateParams'
        ,function($scope,resourceService,$filter,$http,$state,$rootScope,$localStorage,ngDialog,$stateParams){
            $scope.submitBool=true;
            $rootScope.title="实名绑卡";
            $scope.nowTimer="发送验证码";
            var user = $filter('isRegister')().user;
            if(!user) {
                $state.go('dl');
            }
            $scope.smrFrom ={};
            $scope.isSubMin=true;

            // 弹窗
            $scope.choeseBank = function () {
                $filter('银行列表弹窗')($scope);
            };
            $scope.chooeseItem = function (event,obj) {
                $scope.bankName = obj.item.bankName;
                $scope.bankCode = obj.item.bankCode;
                $(event.currentTarget).siblings().removeClass('selected');
                $(event.currentTarget).addClass('selected');
            };
            $scope.done = function () {
                $scope.smrFrom.bankName = $scope.bankName;
                $scope.smrFrom.bankcode = $scope.bankCode;
                $scope.closeDialog();
            }

            // 发送验证码校验
            $scope.sendMsg = function (myForm) {

                if(myForm.bankName.$invalid) {
                    $filter('sendMsgError')('1001');
                } else if(myForm.bankCade.$error.required) {
                    $filter('sendMsgError')('1002');
                } else if(myForm.bankCade.$invalid) {
                    $filter('sendMsgError')('1003');
                } else if(myForm.name.$error.required) {
                    $filter('sendMsgError')('1004');
                } else if(myForm.idCade.$error.required) {
                    $filter('sendMsgError')('1005');
                }  else if(myForm.idCade.$invalid) {
                    $filter('sendMsgError')('1006');
                } else if(myForm.phone.$error.required) {
                    $filter('sendMsgError')('1007');
                } else if(myForm.phone.$invalid) {
                    $filter('sendMsgError')('1008');
                } else {
                    $scope.toSub('信息认证');
                }

                // if ($scope.login.recommPhone === undefined) {
                //     delete $scope.login.recommPhone;
                // };
                // if ($scope.login.toFrom === undefined) {
                //     delete $scope.login.toFrom;
                // };
                // if (tegForm.$valid) {
                //     if ($scope.login.passWord.length > 5) {
                //         if (isSub) {
                //             isSub = false;
                //             resourceService.queryPost($scope, $filter('getUrl')('zuce'), $scope.login, { name: '注册', tegForm: tegForm });
                //         }
                //     }
                // } else {
                //     $scope.validate(tegForm,0);
                // }
            };
            resourceService.queryPost($scope, $filter('getUrl')('银行限额列表'), $scope.smrFrom, '银行限额列表');
            $scope.$on('resourceService.QUERY_POST_MYEVENT', function(event,data,type) {
                switch(type){
                    case '信息认证':
                        if(data.success){
                                $rootScope.errorText= '验证码发送成功';
                                $filter('实名短信错误信息')('ok',$scope,'y');
                                $filter('60秒倒计时')($scope,60);
                                setTimeout(function() {
                                    ngDialog.closeAll();
                                }, 1000);
                        }else{
                            $filter('实名短信错误信息')(data.errorCode,$scope,'y');
                        }
                    break;
                    case '银行限额列表':
                        if(data.success){
                            $scope.bankList = data.map.bankQuotaList;
                        }
                    break;
                    case '实名认证':
                        if(data.success){
                            $filter('isRegister')(data.map);
                            // $state.go('main.myaccountHome');
                            _hmt.push(['_trackPageview', 'hushenlc.cn/maidian/smrz']);
                            // if(data.tyj){
                            ngDialog.open({
                                template: '<p class="error-msg">认证成功！</p>',
                                showClose: false,
                                closeByDocument: true,
                                plain: true
                            });
                            setTimeout(function() {
                                ngDialog.closeAll();
                                $filter('跳回上一页')();
                            }, 2000);
                            // $scope.tyj = true;
                            // $scope.isCps = data.map.isCps;
                            // }
                            // else{
                            //     if($stateParams.from=='changcheng2'){
                            //         $state.go('recharge',{from:'changcheng2'});
                            //     }
                            //     else{
                            //         $state.go('main.myaccountHome');
                            //     }
                            // }

                        }else{
                            $filter('实名认证错误信息')(data.errorCode,$scope,'y');
                        }
                    break;
                };
            });
            $scope.toWhere = function(state){
                $('body,html').css({ width:'auto', height: 'auto', overflow: 'initial' });
                $state.go(state);
            }
            $scope.close = function(){
                $scope.tyj = false;
                $('body,html').css({ width:'auto', height: 'auto', overflow: 'initial' });
                if($stateParams.from=='changcheng2'){
                    $state.go('recharge',{from:'changcheng2',wap:true});
                }
                else{
                    $state.go('main.myaccountHome');
                }
            }

            $scope.toback=function () {
                $filter('跳回上一页')();
            };
            $scope.onClick=function () {
                ngDialog.closeAll();
            };

            $scope.toSub=function (name) {

                switch(name){
                    case '信息认证':
                        if($scope.isSubMin){
                            resourceService.queryPost($scope, $filter('getUrl')(name), {
                                uid:user.member.uid,
                                mobilePhone:$scope.smrFrom.phone,
                                bankNum:$filter('limitTo')($scope.smrFrom.bankNum1,-4),
                                type:1,
                                token:user.token
                            }, name);
                        };
                    break;
                    case '实名认证':
                        $scope.smrFrom.uid=user.member.uid;
                        $scope.smrFrom.channel=3;
                        $scope.smrFrom.token= user.token;
                        $scope.smrFrom.bankNum = $scope.smrFrom.bankNum1;
                        $scope.smrFrom.bankCode = $scope.smrFrom.bankcode;
                        if($scope.submitBool){
                            resourceService.queryPost($scope, $filter('getUrl')(name), $scope.smrFrom, name);
                        };
                    break;
                };
            }
        }
    ]);
})
