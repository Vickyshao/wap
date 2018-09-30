define(['js/module.js'], function (controllers) {
    controllers.controller('zdActivityCtrl', function ($scope, $rootScope, $filter, $state, resourceService, ngDialog, $timeout, $localStorage, $location,$stateParams, $interval, isWeixin) {
        $filter('isPath')('zdActivity');
        $rootScope.title = '大吉大利 组队夺“金”';
        $scope.product = {};
        $scope.yuebiao = {};
        $scope.isShowRule = false;
        $scope.teamNum = 5;
        // $scope.isLogin = $filter('isRegister')().register;
        var objData = {};
        $scope.showMoreTeam = function () {
            if ($scope.teamNum == 5){
                $scope.teamNum = 10;
            } else {
                $scope.teamNum = 5;
            }
        };
        $scope.rewardList = [
            {
                teamReward: 10000,
                topReward: 200
            },{
                teamReward: 8000,
                topReward: 100
            },{
                teamReward: 5000,
                topReward: 100
            },{
                teamReward: 3000,
                topReward: 100
            },{
                teamReward: 2000,
                topReward: 50
            },{
                teamReward: 1000,
                topReward: 50
            },{
                teamReward: 1000,
                topReward: 50
            },{
                teamReward: 1000,
                topReward: 50
            },{
                teamReward: 1000,
                topReward: 50
            },{
                teamReward: 1000,
                topReward: 50
            }
        ];
        $scope.showZdRule = function () {
            $filter('活动规则弹窗')($scope);
        };
        $scope.toLogin = function () {
            if($rootScope.fromNative) {
                document.location='hushentologin:';
            } else {
                $state.go('dl',{returnurl: 'zdActivity'});
            }
        };
        // 去列表
        $scope.toInvestList = function () {
            if($rootScope.fromNative) {
                if (objData.uid && objData.token){
                    document.location='hushenlist:';
                } else {
                    document.location='hushentologin:';
                }
            } else {
                if ($scope.isLogin) {
                    $state.go('main.bankBillList');
                } else {
                    $state.go('dl',{returnurl: 'zdActivity'});
                }

            }
        };
        if($rootScope.fromNative) {
            $('.myTeam').removeClass('headerTop');
            objData.uid = $rootScope.getUrlParam('uid');
            objData.token = $rootScope.getUrlParam('token');
            if (objData.uid && objData.token){
                $scope.isLogin = true;
                resourceService.queryPost($scope, $filter('getUrl')('首次成为队长'), { uid: objData.uid,token: objData.token }, { name: '首次成为队长' });
            } else {
                resourceService.queryPost($scope, $filter('getUrl')('排行榜'), objData, { name: '排行榜' });
            }
        } else{
            $scope.isLogin = $filter('isRegister')().register;
            if($scope.isLogin) {
                objData.uid = $filter('isRegister')().user.member.uid;
                resourceService.queryPost($scope, $filter('getUrl')('首次成为队长'), { uid: objData.uid }, { name: '首次成为队长' });
            } else {
                resourceService.queryPost($scope, $filter('getUrl')('排行榜'), objData, { name: '排行榜' });
            }
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
        // 登录注册
        $scope.myForm2 = {
            hasPhone: false
        };
        $scope.userLoginform2 = {
            hasPhone: false
        };
        $scope.userLogin = {};
        $scope.login = {};
        var luckycodeData = {};
        $scope.passwordText = false;
        $scope.isSubMin = true;
        $scope.submitReservate = true;
        $scope.form = true;
        $scope.nowTimer = "获取验证码";
        $scope.vm = {
            productNum: 1,
            limit: 300
        };
        $scope.user = {};
        $("html,body").scrollTop(0);
        if($scope.isLogin) {
            $scope.user = $filter('isRegister')().user.member;
        }
        if ($location.$$search.toFrom != undefined || $location.$$search.recommCode != undefined || $location.$$search.tid != undefined) {
            $localStorage.webFormPath = $location.$$search;
        }
        if($stateParams.wap){
            $scope.wap = $stateParams.wap;
        }
        /*var objData = {
            pageOn:1,
            pageSize: 30
        };
        if($rootScope.getUrlParam('source')) {
            $('.lottery').removeClass('headerTop');
            $scope.fromNative = true;
        };
        if($rootScope.fromNative) {
            $('.lottery').removeClass('headerTop');
            objData.uid = $rootScope.getUrlParam('uid');
            objData.token = $rootScope.getUrlParam('token');
        } else{
            if($scope.isLogin) {
                objData.uid = $scope.user.uid;
            }
        }
        $scope.plusNum = '1';
        $scope.subNum = '2';
        $scope.sub = function () {
            if($scope.vm.productNum > 1) {
                $scope.vm.productNum--;
            }
            if($scope.vm.productNum <= 1 ) {
                $scope.subNum = '2';
            }
        }
        $scope.plus = function () {
            if($scope.vm.productNum >= $scope.vm.limit){
                //按钮不可点
                $scope.plusNum = '2';
                return false;
            }else{
                $scope.vm.productNum++;
                $scope.plusNum = '1';
            }
        }
        $scope.$watch('vm.productNum',function(newValue){
            if(newValue <= 1 ) {
                $scope.vm.productNum = 1;
                $scope.subNum = '2';
            }else if(newValue >= $scope.vm.limit) {
                $scope.vm.productNum = $scope.vm.limit;
                $scope.plusNum = '2';
            } else {
                $scope.subNum = '1';
                $scope.plusNum = '1';
            }
        });*/
        $scope.toback = function() {
            $filter('跳回上一页')(2);
        };
        // 点击登录
        $scope.sbmit = function (tegForm) {
            resourceService.queryPost($scope, $filter('getUrl')('login'), $scope.userLogin, { name: 'login', tegForm: tegForm });
        }
        // 组队通知
        resourceService.queryPost($scope, $filter('getUrl')('组队通知'), {}, { name: '通知' });
        // 排行榜


        var $table = $(".notice .notice-list");
        $scope.$on('resourceService.QUERY_POST_MYEVENT', function (event, data, type) {
            switch (type.name) {
                case '通知':
                    if (data.success) {
                        $scope.noticeList = data.map.list;
                        if ($scope.noticeList.length > 1) {
                            setInterval(function() {
                                $table.animate({'margin-top':'-2.9rem'},500,function() {
                                    $table.find('span').eq(0).appendTo($table);
                                    $table.css('margin-top',0);
                                })
                            },5000);
                        }
                    }
                    break;
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
                case "首次成为队长":
                    if (data.success) {
                        $scope.create = data.map.create;
                        $scope.isShowMyTeamButton = data.map.isShowMyTeamButton;
                        resourceService.queryPost($scope, $filter('getUrl')('我的战队'), { uid: objData.uid,token: objData.token }, { name: '我的战队' });
                        resourceService.queryPost($scope, $filter('getUrl')('排行榜'), objData, { name: '排行榜' });
                        if ($scope.create) {
                            setTimeout(function () {
                                $filter('成为队长弹窗')($scope);
                            },2000)
                        }
                    }
                    break;
                case "排行榜":
                    if (data.success) {
                        $scope.teamList = data.map.list;
                        $scope.teamList.forEach(function(item,index,array){
                            item.teamReward = $scope.rewardList[index].teamReward;
                            item.topReward = $scope.rewardList[index].topReward;
                        });
                    }
                    break;
            }
        });
        $scope.showRule = function(){
            $('.rule').fadeIn(200);
        }
        $scope.closeRule = function(){
            $('.rule').fadeOut(200);
        }
        $scope.gotoDetail = function (id) {
            if ($stateParams.wap) {
                $state.go('activityPerson', { id: id, wap: true });
            } else {
                $state.go('activityPerson', { id: id });
            }
        };
        $scope.gotop = function () {
            $("html,body").animate({ scrollTop: 0 });
        };
        $scope.toMyTeam = function () {
            $state.go('myTeam', { uid: $scope.user.uid });
        }
    });
})

