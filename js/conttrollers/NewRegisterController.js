define(['jweixin', 'js/module.js', 'jquery', 'ngdialog', 'SHR256'], function (wx, controllers, $, ngdialog, SHR256, weixin) {
    controllers.controller('NewRegisterController', ['$scope', '$rootScope', 'resourceService', '$filter', '$state', 'ngDialog', '$location', 'md5', '$localStorage', '$stateParams','$interval', function ($scope, $rootScope, resourceService, $filter, $state, ngDialog, $location, md5, $localStorage,$stateParams, $interval){
        $scope.phone = $stateParams.phone;
        $scope.login = {};
        
        $scope.login.mobilephone = $scope.phone;
        if($localStorage.webFormPath)$scope.login.toFrom = $localStorage.webFormPath.toFrom;
        if($stateParams.recommPhone){
            $scope.login.recommPhone = $stateParams.recommPhone;
        }
        $scope.toback = function(){
            if($stateParams.from=='tyj'){
                $state.go('tyj',{wap:true});
            }
            else if($stateParams.from=='newhandreg'){
                $state.go('newhandreg',{wap:true});
            }
            else{
                $state.go('main.home');
            }
        }
        $scope.canSend = true;
        function countdown(){
            $scope.second = 60;
            var stop = $interval(function(){
                $scope.second--;
                if($scope.second==0){
                    $interval.cancel(stop);
                    $scope.canSend = true;
                }
            },1000)
        }
        $scope.zuce = function (tegForm) {
            if (tegForm.$valid) {
                if ($scope.login.passWord.length > 5) {
                    resourceService.queryPost($scope, $filter('getUrl')('zuce'), $scope.login, { name: '注册', tegForm: tegForm });
                }
            } else {
                $rootScope.errorText = '请正确填写以上信息';
                $rootScope.maskError = true;
            }
        }
        $scope.getyzm = function (tegForm) {
            resourceService.queryPost($scope, $filter('getUrl')('getyzm'), {
                mobilephone: $scope.phone,
                picCode: $scope.login.picCode
            }, { name: '获取验证码', tegForm: tegForm });
            $filter('60秒倒计时')($scope, 60);
        };
        // $scope.getyzm();
        $scope.$on('resourceService.QUERY_POST_MYEVENT', function (event, data, type) {
            switch (type.name) {
                case '获取验证码':
                    if (data.success) {
                        $rootScope.errorText = '验证码发送成功';
                        $rootScope.maskError = true;
                        $scope.canSend = false;
                        countdown();
                    } else {
                        $scope.stop();
                        $filter('手机短信验证错误')(type.tegForm, data.errorCode);
                    }
                    break;
                case '注册':
                    isSub = true;
                    if (data.success) {
                        // delete $localStorage.webFormPath.toFrom;
                        $localStorage.user = data.map;
                        // _hmt.push(['_trackPageview', '/maidian/zccg']);
                        _hmt.push(['_trackPageview', '/mian/myCoupon']);
                        if($stateParams.from=='newhandreg'){
                            $state.go('newhand',{wap:true,pid:data.map.pid});
                        }
                        else{
                            $state.go('tyjRegSuccess');
                        }
                    } else {
                        $filter('serverZuceError')(type.tegForm, data.errorCode);
                        $scope.login.passWord = '';
                    };
                    break;
            };
        });
        
    }])
    .directive('changeHide',function(){
        return{
            link: function(scope,element,attrs){
                var height = $(window).height();
                $(window).resize(function(){
                    if($(window).height()<height){
                        $(element).hide();
                    }
                    else{
                        $(element).show();
                    }
                })
            }
        }
    })
})