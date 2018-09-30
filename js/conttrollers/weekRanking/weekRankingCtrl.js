define(['jweixin', 'js/module.js', 'jquery', 'ngdialog', 'SHR256'], function (wx, controllers, $, ngdialog, SHR256, weixin) {
    controllers.controller('weekRankingCtrl', ['$scope', '$rootScope', 'resourceService', '$filter', '$state', 'ngDialog', '$location', 'md5', '$localStorage', '$stateParams', 'isWeixin', function ($scope, $rootScope, resourceService, $filter, $state, ngDialog, $location, md5, $localStorage, $stateParams, isWeixin) {
        $("html,body").scrollTop(0);
        $filter('isPath')('weekRanking');
        $rootScope.title = '周冠加奖';
        $scope.isLogin = $filter('isRegister')().register;
        $scope.amount = 10000;
        $scope.time = 30;
        $scope.timeClass = 'time30';
        $scope.isShowInput = true;
        $scope.awardThree = [
            {money: '1500'},
            {money: '1000'},
            {money: '500'}
        ];
        $scope.awardList = [
            { rank: 4, name: '300元现金红包' },
            { rank: 5, name: '300元现金红包' },
            { rank: 6, name: '300元现金红包' },
            { rank: 7, name: '300元现金红包' },
            { rank: 8, name: '300元现金红包' },
            { rank: 9, name: '300元现金红包' },
            { rank: 10, name: '300元现金红包' }
        ];
        $scope.award = [
            { num: '第11~20名', name: '200元京东E卡', img: '/images/weekRanking/200.png'},
            { num: '第21~30名', name: '100元京东E卡', img: '/images/weekRanking/reward2.png'},
            { num: '第31~40名', name: '50元话费', img: '/images/weekRanking/reward3.png'},
            { num: '第41~50名', name: '20元话费', img: '/images/weekRanking/reward4.png'}
        ]
        $scope.threeRinking = [];
        $scope.weekRinkingList = [];
        if($rootScope.fromNative) {
            $('.week-ringking').removeClass('headerTop');
            $scope.uid = $rootScope.getUrlParam('uid');
            $scope.token = $rootScope.getUrlParam('token');
            if ($scope.uid && $scope.token) {
                $scope.isLogin = true;
            } else {
                $scope.isLogin = false;
            }
        } else{
            if($scope.isLogin) {
                $scope.uid = $filter('isRegister')().user.member.uid;
            }
        }
        $scope.weekRinkingParam = {
            pageOn:1,
            pageSize: 50,
            activityCode: 'weekRanking1'
        }
        if($scope.isLogin){
            if($rootScope.fromNative) {
                $scope.weekRinkingParam.uid = $scope.uid;
                $scope.weekRinkingParam.token = $scope.token;
            } else {
                $scope.weekRinkingParam.uid = $scope.uid;
            }

        }
        // 周排行计算器
        $scope.calculator = function () {
            $filter('周排行计算器')($scope);
        };
        $scope.changeTime = function (time) {
            $scope.time = time;
            $scope.timeClass = 'time' + time;
        };
        // 去投资按钮
        $scope.toInvestIng = function () {
            ngDialog.closeAll();
            if($rootScope.fromNative) {
                if($scope.isLogin) {
                    document.location = 'hushenlist:';
                } else {
                    document.location = 'hushentologin:';
                }
            } else {
                if($scope.isLogin) {
                    $state.go('main.bankBillList');
                } else {
                    $state.go('dl',{ returnurl: 'weekRanking' });
                }
            }
        }
        $scope.isInActivityTime = true;
        $scope.login = {};
        $scope.userLogin = {};

        $scope.toback = function() {
            $filter('跳回上一页')(2);
        };
        $scope.default = function(e) {
            e.stopPropagation();
        }
        $scope.clickInput = function (event) {
            // $scope.userLogin.picCode = null;
            changePicEvent = event;
            changeIMG(changePicEvent);
        };

        resourceService.queryPost($scope, $filter('getUrl')('周排行-投资排行信息'),$scope.weekRinkingParam, { name: '投资排行' });
        $scope.$on('resourceService.QUERY_POST_MYEVENT', function (event, data, type) {
            switch (type.name) {
                case '投资排行':
                    if(data.success) {
                        $scope.weekRankList = data.map.weekRankList;
                        $scope.isInActivityTime = data.map.isInActivityTime;
                        angular.forEach($scope.weekRankList,function (value,index) {
                            if (index <= 2 ) {
                                $scope.weekRankList[index].awardName = $scope.awardThree[index].money;
                                $scope.threeRinking.push($scope.weekRankList[index]);
                            } else if (index < 10 ) {
                                $scope.weekRankList[index].awardName = $scope.awardList[index-3].name;
                                $scope.weekRankList[index].rank = $scope.awardList[index-3].rank;
                                $scope.weekRinkingList.push($scope.weekRankList[index]);
                            }
                        })
                        $scope.myInfo = {};
                        if ($scope.isLogin) {
                            $scope.myInfo.isInTop50 = data.map.isInTop50;
                            $scope.myInfo.myAnnualizedAmount = data.map.myAnnualizedAmount;
                            $scope.myInfo.myRanking = data.map.myRanking;
                            if ($scope.myInfo.isInTop50) {
                                if ($scope.myInfo.myRanking == 1) {
                                    $scope.isTop1 = true;
                                } else {
                                    $scope.last = $scope.weekRankList[$scope.myInfo.myRanking-2];
                                    $scope.distence = $scope.weekRankList[$scope.myInfo.myRanking-2].annualizedAmount - $scope.myInfo.myAnnualizedAmount;
                                }
                            } else {
                                $scope.distence = $scope.weekRankList[$scope.weekRankList.length-1].annualizedAmount - $scope.myInfo.myAnnualizedAmount;
                            }
                            if ($scope.myInfo.myRanking<=3) {
                                $scope.threeRinking[$scope.myInfo.myRanking-1].isYouSelf = true;
                            } else {
                                if ($scope.myInfo.myRanking) {
                                    $scope.weekRinkingList[$scope.myInfo.myRanking-4].isYouSelf = true;
                                }
                            }
                        }
                    }
                    break;
            };
        });
    }])
    controllers.controller('weekRankingSecCtrl', ['$scope', '$rootScope', 'resourceService', '$filter', '$state', 'ngDialog', '$location', 'md5', '$localStorage', '$stateParams', 'isWeixin', function ($scope, $rootScope, resourceService, $filter, $state, ngDialog, $location, md5, $localStorage, $stateParams, isWeixin) {
        $("html,body").scrollTop(0);
        $filter('isPath')('weekRankingSec');
        $rootScope.title = '周冠加奖';
        $scope.isLogin = $filter('isRegister')().register;
        $scope.amount = 10000;
        $scope.time = 30;
        $scope.timeClass = 'time30';
        $scope.isShowInput = true;
        $scope.awardThree = [
            {money: '1500'},
            {money: '1000'},
            {money: '500'}
        ];
        $scope.awardList = [
            { rank: 4, name: '300元现金红包' },
            { rank: 5, name: '300元现金红包' },
            { rank: 6, name: '300元现金红包' },
            { rank: 7, name: '300元现金红包' },
            { rank: 8, name: '300元现金红包' },
            { rank: 9, name: '300元现金红包' },
            { rank: 10, name: '300元现金红包' }
        ];
        $scope.award = [
            { num: '第11~20名', name: '200元京东E卡', img: '/images/weekRanking/200.png'},
            { num: '第21~30名', name: '100元京东E卡', img: '/images/weekRanking/reward2.png'},
            { num: '第31~40名', name: '50元话费', img: '/images/weekRanking/reward3.png'},
            { num: '第41~50名', name: '20元话费', img: '/images/weekRanking/reward4.png'}
        ]
        $scope.threeRinking = [];
        $scope.weekRinkingList = [];
        if($rootScope.fromNative) {
            $('.week-ringking').removeClass('headerTop');
            $scope.uid = $rootScope.getUrlParam('uid');
            $scope.token = $rootScope.getUrlParam('token');
            if ($scope.uid && $scope.token) {
                $scope.isLogin = true;
            } else {
                $scope.isLogin = false;
            }
        } else{
            if($scope.isLogin) {
                $scope.uid = $filter('isRegister')().user.member.uid;
            }
        }
        $scope.weekRinkingParam = {
            pageOn:1,
            pageSize: 50,
            activityCode: 'weekRanking2'
        }
        if($scope.isLogin){
            if($rootScope.fromNative) {
                $scope.weekRinkingParam.uid = $scope.uid;
                $scope.weekRinkingParam.token = $scope.token;
            } else {
                $scope.weekRinkingParam.uid = $scope.uid;
            }

        }
        // 周排行计算器
        $scope.calculator = function () {
            $filter('周排行计算器二')($scope);
        };
        $scope.changeTime = function (time) {
            $scope.time = time;
            $scope.timeClass = 'time' + time;
        };
        // 去投资按钮
        $scope.toInvestIng = function () {
            ngDialog.closeAll();
            if($rootScope.fromNative) {
                if($scope.isLogin) {
                    document.location = 'hushenlist:';
                } else {
                    document.location = 'hushentologin:';
                }
            } else {
                if($scope.isLogin) {
                    $state.go('main.bankBillList');
                } else {
                    $state.go('dl',{ returnurl: 'weekRanking' });
                }
            }
        }
        $scope.isInActivityTime = true;
        $scope.login = {};
        $scope.userLogin = {};

        $scope.toback = function() {
            $filter('跳回上一页')(2);
        };
        $scope.default = function(e) {
            e.stopPropagation();
        }
        $scope.clickInput = function (event) {
            // $scope.userLogin.picCode = null;
            changePicEvent = event;
            changeIMG(changePicEvent);
        };

        resourceService.queryPost($scope, $filter('getUrl')('周排行-投资排行信息'),$scope.weekRinkingParam, { name: '投资排行' });
        $scope.$on('resourceService.QUERY_POST_MYEVENT', function (event, data, type) {
            switch (type.name) {
                case '投资排行':
                    if(data.success) {
                        $scope.weekRankList = data.map.weekRankList;
                        $scope.isInActivityTime = data.map.isInActivityTime;
                        angular.forEach($scope.weekRankList,function (value,index) {
                            if (index <= 2 ) {
                                $scope.weekRankList[index].awardName = $scope.awardThree[index].money;
                                $scope.threeRinking.push($scope.weekRankList[index]);
                            } else if (index < 10 ) {
                                $scope.weekRankList[index].awardName = $scope.awardList[index-3].name;
                                $scope.weekRankList[index].rank = $scope.awardList[index-3].rank;
                                $scope.weekRinkingList.push($scope.weekRankList[index]);
                            }
                        })
                        $scope.myInfo = {};
                        if ($scope.isLogin) {
                            $scope.myInfo.isInTop50 = data.map.isInTop50;
                            $scope.myInfo.myAnnualizedAmount = data.map.myAnnualizedAmount;
                            $scope.myInfo.myRanking = data.map.myRanking;
                            if ($scope.myInfo.isInTop50) {
                                if ($scope.myInfo.myRanking == 1) {
                                    $scope.isTop1 = true;
                                } else {
                                    $scope.last = $scope.weekRankList[$scope.myInfo.myRanking-2];
                                    $scope.distence = $scope.weekRankList[$scope.myInfo.myRanking-2].annualizedAmount - $scope.myInfo.myAnnualizedAmount;
                                }
                            } else {
                                $scope.distence = $scope.weekRankList[$scope.weekRankList.length-1].annualizedAmount - $scope.myInfo.myAnnualizedAmount;
                            }
                            if ($scope.myInfo.myRanking<=3) {
                                $scope.threeRinking[$scope.myInfo.myRanking-1].isYouSelf = true;
                            } else {
                                if ($scope.myInfo.myRanking) {
                                    $scope.weekRinkingList[$scope.myInfo.myRanking-4].isYouSelf = true;
                                }
                            }
                        }
                    }
                    break;
            };
        });
    }])

})