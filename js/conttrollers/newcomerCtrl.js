define([
    'js/module.js', 'jquery'
]
    , function (controllers, $) {
        controllers.controller('newcomerCtrl'
            , ['$scope', 'resourceService', '$filter', '$location', '$localStorage', '$rootScope', '$state','$anchorScroll', function ($scope, resourceService, $filter, $location, $localStorage, $rootScope, $state,$anchorScroll) {
                $scope.showshare = $location.$$search.fromPcWindow;
                if ($location.$$search.toFrom != undefined || $location.$$search.recommCode != undefined || $location.$$search.tid != undefined) {
                    $localStorage.webFormPath = $location.$$search;
                };
                $scope.wap = $location.$$search.wap ? $location.$$search.wap : null;
                if($scope.wap){
                    $state.go('tyj',{wap:true});
                }
                else{
                    $state.go('tyj');
                }
                function getUrlParam(name) {
                    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
                    var r = window.location.search.substr(1).match(reg);  //匹配目标参数
                    if (r != null) return unescape(r[2]); return null; //返回参数值
                }
                // resourceService.queryPost($scope, $filter('getUrl')('selectInvest'), {}, { name: '获取新手投资列表'});
                $scope.$on('resourceService.QUERY_POST_MYEVENT', function (event, data, type) {
                    switch (type.name) {
                        // case '获取新手投资列表': 
                        // if (data.success) {
                        //     var array=angular.fromJson(data.map.invest100);
                        //     for(var i=0;i<5;i++){
                        //         array.push(array[i]);
                        //     }
                        //     $scope.newcomerList=array;
                        // }
                        // break;
                        case '注册验证手机号':
                            if (data.success) {
                                if (data.map.exists) { //已有用户名
                                    $rootScope.errorText = '此手机已注册';
                                    $rootScope.maskError = true;
                                } else {
                                    $state.go('newRegister', { phone: $scope.mobilephone})
                                };
                            }
                            break;
                    }
                });
                $scope.click = function (tegForm) {
                    if (!tegForm.mobilephone.$error.required && !tegForm.mobilephone.$error.minlength && !tegForm.mobilephone.$error.pattern) {
                        resourceService.queryPost($scope, $filter('getUrl')('getPhone'), {
                            mobilephone: $scope.mobilephone
                        }, { name: '注册验证手机号', tegForm: tegForm });
                    }
                    else {
                        $rootScope.errorText = '请填写有效手机号码';
                        $rootScope.maskError = true;
                    }
                };
                $scope.toTop = function(){
                    $location.hash('top');
                    $anchorScroll();
                }



            }
            ])
    })