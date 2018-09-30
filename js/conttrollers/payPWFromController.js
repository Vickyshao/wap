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

    controllers.controller('payPWFromController'
        ,['$scope'
        ,'resourceService'
        ,'$filter'
        ,'$state'
        ,'$rootScope'
        ,'$localStorage'
        ,function($scope,resourceService,$filter,$state,$rootScope,$localStorage){
            $rootScope.title='交易密码设置';
            $scope.user = $filter('isRegister')().user.member;
            $scope.smrFrom ={};
            $scope.pw={};
            $scope.pw.uid=$scope.user.uid;
            $scope.nowTimer='发送短信验证码';
            $scope.isSubMin=true;
            
            $scope.$on('resourceService.QUERY_POST_MYEVENT', function(event,data,type) {
                switch(type){
                    case '短信验证码': 
                        if(data.success){
                            // $filter('服务器信息')(data.errorCode,$scope,'y');
                            // $scope.msg.text='短信已成功发送';
                            $filter('60秒倒计时')($scope,60);
                        }else{
                            $filter('服务器信息')(data.errorCode,$scope,'y');
                        }
                    break;
                    case '完成': 
                        if(data.success){
                            $filter('跳回上一页')();
                        }else{
                            $filter('服务器信息')(data.errorCode,$scope,'y')
                        }
                    break;
                };
            });
            $scope.onClick=function (name) {
                 switch(name){
                    case '发送短信验证码': 
                        resourceService.queryPost($scope,$filter('getUrl')('短信验证'),{
                            uid:$scope.user.uid,
                            type:1
                        },'短信验证码');
                    break;
                    case '完成': 
                        resourceService.queryPost($scope,$filter('getUrl')('完成设置交易密码提交'),$scope.pw,'完成');
                    break;
                };
            };
            $scope.toback=function () {
                        $filter('跳回上一页')();
                    };
        }
    ]);
})
