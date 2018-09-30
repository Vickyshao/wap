/* 
* @Author: xyc
* @Date:   2016-12-12 17:52:04
*/

'use strict';
define([
    'js/module.js'
    ,'jquery'
    ,'ngdialog'
    ]
    ,function(controllers,$,ngdialog){

    controllers.controller('hbopenCtrl'
        ,['$scope'
        ,'resourceService'
        ,'$filter'
        ,'$state'
        ,'$rootScope'
        ,'$localStorage'
        ,function($scope,resourceService,$filter,$state,$rootScope,$localStorage){
            $rootScope.title='';
            $scope.toback=function () {
                $filter('跳回上一页')();
            };
            $scope.userOBJ = $filter('isRegister')();
            
            resourceService.queryPost($scope, $filter('getUrl')('拆红包'), {
                uid:$scope.userOBJ.user.member.uid
            }, '拆红包');
            $scope.$on('resourceService.QUERY_POST_MYEVENT', function(event,data,type) {
                switch(type){
                    case '拆红包': 
                        if(data.success){
                            $scope.redPackets = data.map.redPacketList;
                            $scope.redMsg = data.map.redMsg;
                        }else{
                            $state.go('main.myaccountHome');
                        }
                    break;
                    case '红包投资详情':
                        if(data.success){
                            if(data.map.pid!=-1){
                                $state.go('investment',{pid:data.map.pid,cpid:$scope.activefid,uid:$scope.userOBJ.user.member.uid});
                            }else{
                                $state.go('main.bankBillList');
                            }
                        }
                    break;
                };
            });
            $scope.gotoInvest=function(item){
                resourceService.queryPost($scope, $filter('getUrl')('getUse'), {
                    uid:$scope.userOBJ.user.member.uid,
                    fid:item.id
                }, '红包投资详情');
                $scope.activefid=item.id;
            };
        }
    ])
    .directive("repeatFinish", function () {
        return {
            link: function(scope,element,attr){
                if(scope.$last == true){
                    scope.$eval(attr.repeatFinish);
                }
            }
        }
    })
    .directive('scrollText',function(){
        var temp='<li repeat-finish="finish()" ng-repeat="message in redMsg">'+
                    '<p>{{message.mobilePhone}}<span>已变现</span></p>'+
                    '<p>刚刚领取了{{message.amount}}元 现金红包<span>{{message.addtime|date:"yyyy.MM.dd"}}</span></p>'+
                '</li>'
        return{
            restrict : 'A',
            template:temp,           
            scope: true,
            link: function($scope,element,attrs){
                $scope.finish=function(){
                    $(element).find('li').each(function(i){
                        var height = parseFloat($(this).css('height'));
                        $(this).css({
                            top:i*height+'px'
                        })
                        var that = this;
                        setInterval(function(){
                            var top = parseFloat($(that).css('top'))
                            if(top<(height*(-1))){
                                $(that).css({top:($scope.redMsg.length-1)*height+'px'})
                            }
                            var top = parseFloat($(that).css('top'))
                            $(that).css({
                                top: (top-0.5)+'px'
                            })
                        },20)
                    })
                }
            }
        }
    });
})
