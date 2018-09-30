define(['js/module.js'], function (controllers) {
    controllers.controller('myTeamCtrl', function ($scope, $rootScope, $filter, $state, resourceService, ngDialog, $timeout, $localStorage, $location,$stateParams, $interval, isWeixin) {
        $filter('isPath')('myTeam');
        $rootScope.title = '我的战队';
        $("html,body").scrollTop(0);
        // $scope.isLogin = $filter('isRegister')().register;
        var objData = {};
        if ($location.$$search.toFrom != undefined || $location.$$search.recommCode != undefined || $location.$$search.tid != undefined) {
            $localStorage.webFormPath = $location.$$search;
        }
        if($stateParams.wap){
            $scope.wap = $stateParams.wap;
        }

        if($rootScope.getUrlParam('source')) {
            $('.myTeam').removeClass('headerTop');
            $scope.fromNative = true;
        };
        if($rootScope.fromNative) {
            $('.myTeam').removeClass('headerTop');
            objData.uid = $rootScope.getUrlParam('uid');
            objData.token = $rootScope.getUrlParam('token');
        } else{
            if($scope.isLogin) {
                objData.uid = $scope.user.uid;
            }
        }
        $scope.toback = function() {
            $filter('跳回上一页')(2);
        };
        // 去列表
        $scope.toInvestList = function () {
            if($rootScope.fromNative) {
                document.location = 'hushenlist:';
            } else {
                $state.go('main.bankBillList');
            }
        };
        if($rootScope.fromNative) {
            $('.myTeam').removeClass('headerTop');
            objData.uid = $rootScope.getUrlParam('uid');
            objData.token = $rootScope.getUrlParam('token');
            if (objData.uid && objData.token){
                $scope.isLogin = true;
                resourceService.queryPost($scope, $filter('getUrl')('我的战队'), { uid: objData.uid,token: objData.token }, { name: '我的战队' });
            }
        } else{
            $scope.isLogin = $filter('isRegister')().register;
            if($scope.isLogin) {
                objData.uid = $filter('isRegister')().user.member.uid;
                resourceService.queryPost($scope, $filter('getUrl')('我的战队'), { uid: objData.uid }, { name: '我的战队' });
            }
        }
        $scope.showRule = function () {
            $filter('活动规则弹窗')($scope);
        }
        if($scope.isLogin) {
            $scope.user = $filter('isRegister')().user.member;
        }
        // 我的战队弹窗
        $scope.showMyTeam = function () {
            if($rootScope.fromNative) {
                resourceService.queryPost($scope, $filter('getUrl')('我的战队详细'), { uid: objData.uid,token: objData.token }, { name: '我的战队详细' });
            } else{
                resourceService.queryPost($scope, $filter('getUrl')('我的战队详细'), { uid: objData.uid }, { name: '我的战队详细' });
            }

            $filter('我的战队弹窗')($scope);
        }
        $scope.tab = function (_this,event) {
            $(event.target).siblings('li').removeClass('active');
            $(event.target).addClass('active');
            var index = $(event.target).index('.header-tab li');
            $('.content>div').css('display','none').eq(index).css('display','block');
        }
        $scope.joinFriend = function () {
            $scope.closeDialog();
            $scope.share();
        }
        // 分享
        $scope.share = function() {
            if($rootScope.fromNative) {
                if (objData.uid && objData.token){
                    var nativeParams = {
                        tel: $scope.myPhone,
                        teamId: $scope.teamInfo.myInfo.teamId
                    };
                    document.location = 'hushensharezudui:' + JSON.stringify(nativeParams);
                } else {
                    document.location='hushentologin:';
                }
            } else {
                if ($scope.isLogin) {
                    if (isWeixin()) {
                        $('.activity-tjs-boxweixin').fadeIn(200);
                    } else {
                        $('.activity-tjs-boxh5').fadeIn(200);
                    }
                } else {
                    $state.go('dl',{returnurl: 'zdActivity'});
                }

            }
        };
        function IsPC() {
            var userAgentInfo = navigator.userAgent;
            var Agents = ["Android", "iPhone",
                "SymbianOS", "Windows Phone",
                "iPad", "iPod"
            ];
            var flag = true;
            for (var v = 0; v < Agents.length; v++) {
                if (userAgentInfo.indexOf(Agents[v]) > 0) {
                    flag = false;
                    break;
                }
            }
            return flag;
        };
        $scope.copyShare = function() {
            var e = document.getElementById("shareurl"); //对象是contents
            e.select(); //选择对象
            document.execCommand("Copy");
            $scope.isCopy = true;
            if (IsPC()) {
                $scope.isCopytext = '链接已复制';
            } else {
                $scope.isCopytext = '长按文字全选复制链接';
            }
        };
        $scope.closeshare = function() {
            $('.activity-tjs-boxh5').fadeOut(200);
        }
        $scope.default = function(e) {
            e.stopPropagation();
        }
        $scope.closeshareweixin = function() {
            $('.activity-tjs-boxweixin').fadeOut(200);
        };
        $scope.$on('resourceService.QUERY_POST_MYEVENT', function (event, data, type) {
            switch (type.name) {
                case "我的战队":
                    if (data.success) {
                        $scope.teamInfo = data.map;
                        $scope.teamOtherMembers = $scope.teamInfo.teamOtherMembers;
                        $scope.myPhone = data.map.myInfo.inviteTel;
                        if (data.map.myInfo.isCaptain) {
                            $scope.isCaptain = true;
                        }
                    }
                    break;
                case "我的战队详细":
                    if (data.success) {
                        $scope.myteamInfo = data.map;
                        $scope.myInvites = $scope.myteamInfo.myInvites;
                        $scope.myTeamMembers = $scope.myteamInfo.myTeamMembers;
                    }
                    break;
            }
        });
    });
})

