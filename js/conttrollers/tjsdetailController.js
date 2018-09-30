define(['js/module.js'], function (controllers) {
    controllers.controller('tjsdetailController', function ($scope, $rootScope, resourceService, $filter, $state, $stateParams, $location, $localStorage, $anchorScroll) {
        delete $localStorage.coupon;
        $filter('isPath')('tjsdetail');
        $scope.toback = function () {
            $filter('跳回上一页')(2);
        };
        $('body').scrollTop(0);
        $scope.yuebiao = {};
        $rootScope.title = "年末豪礼专享标";
        // $scope.mainbox = true;
        var user = $filter('isRegister')();
        $scope.active = 0;
        $scope.isShowRule = false;
        $scope.showBigImg = false;
        var $win = $(window);
        $scope.goBack = function () {
            if ($stateParams.from) {
                $state.go($stateParams.from);
            }
            else {
                $state.go('tjs', { wap: true });
            }
        }
        $win.on('load resize scroll', function () {
            // $('.check-img-wrap').height($('body').height());
            $('.check-img-wrap').height($win.height()).width($win.width());
            $('.check-img-wrap img').css('max-height', $win.height()).css('max-width', $win.width());
        });
        $scope.showmore = function () {
            $location.hash('moredetail');
            $anchorScroll();
            $scope.moremsg = true;
        }
        $scope.showImg = function (event) {
            $scope.bigImgSrc = $(event.currentTarget).attr('src');
            $scope.showBigImg = true;
        };
        $scope.slideToggle = function (e) {
            $(e.currentTarget).parent().siblings("p").stop().slideToggle(200);
            if ($(e.currentTarget).hasClass('slideDown')) {
                $(e.currentTarget).removeClass('slideDown')
            } else { $(e.currentTarget).addClass('slideDown') }
        };
        $scope.closeRealverify = function () {
            $scope.isRealverify = false;
        };
        $scope.gologin = function () {
            $state.go('dl', { returnurl: 'tjsdetail?wap=true&pid=' + $scope.cp.id });
        };
        $scope.$on('resourceService.QUERY_POST_MYEVENT', function (event, data, eObj) {
            switch (eObj.name) {
                case 'cpDetail':
                    $localStorage.cp = data.map;
                    $localStorage.prize = data.map.prize;
                    // $scope.yuebiao.name=data.map.name;
                    // $scope.yuebiao.isReservation=data.map.isReservation;
                    // $scope.yuebiao.prid=data.map.prid;
                    $scope.yuebiao.realverify = data.map.realverify;
                    // $scope.linkURL=data.map.linkURL;
                    // $scope.appTitle=data.map.appTitle;
                    $scope.cp = data.map.info;
                    $scope.prize = data.map.prize;
                    $scope.extendInfos = data.map.extendInfos;
                    if ($scope.cp.establish != undefined) {
                        var date3 = $scope.cp.establish - Date.parse(new Date());
                        var day = Math.floor(date3 / (24 * 3600 * 1000));
                        var hh = Math.floor(date3 / (3600 * 1000));
                        if (day > 0) {
                            $scope.nowTimer = day + '天';
                            // $scope.isFinish = true;
                        } else
                            if (day == 0 && hh > 1) {
                                $scope.nowTimer = hh + '小时';
                                // $scope.isFinish = true;
                                $scope.isBuTimer = true;
                            } else
                                if (day == 0 && hh < 1) {
                                    $scope.nowTimer = '1小时内'
                                    // $scope.isFinish = true;
                                } else
                                    if (hh < 0) {
                                        if ($scope.cp.type == 1) {
                                            $scope.nowTimer = '无限制';
                                        } else {
                                            $scope.nowTimer = '已结束';
                                        }
                                        $scope.isFinish = true;
                                    }
                    } else {
                        $scope.nowTimer = '已结束';
                        $scope.isFinish = true;
                    };
                    if ($stateParams.pid) {
                        resourceService.queryPost($scope, $filter('getUrl')('cpPicAndInvest'), {
                            pid: $stateParams.pid,
                            type: $scope.cp.type
                        }, { name: 'cpPicAndInvest' });
                    }
                    break;
                case 'cpPicAndInvest':
                    $scope.picList = data.map.picList;
                    $scope.investList = data.map.investList;
                    break;
                case '是否认证':
                    $scope.map = data.map;
                    break;
            };
        });
        $scope.goyuebiao = function () {
            if ($scope.yuebiao.realverify) {
                $state.go('yuebiao', { prid: $scope.yuebiao.prid, name: $scope.yuebiao.name, toState: $state.current.name, pid: $stateParams.pid });
            } else {
                $scope.isRealverify = true;
            }
        };
        if ($stateParams.pid != null) {
            var obj = {};
            obj.pid = $stateParams.pid;
            if (user.register) {
                obj.uid = user.user.member.uid;
                resourceService.queryPost($scope, $filter('getUrl')('我的信息'), {
                    uid: user.user.member.uid
                }, { name: '是否认证' });
            }
            resourceService.queryPost($scope, $filter('getUrl')('cpDetail'), obj, { name: 'cpDetail' });
        } else {
            $state.go('tjs', { wap: true });
        };
    });
    controllers.controller('tjsinvestmentController', function ($scope, resourceService, $filter, $state, $rootScope, $localStorage, $stateParams, postcallService) {
        $scope.submitBool = true;
        $rootScope.title = '确认投资';
        $scope.pid = $stateParams.pid;
        $filter('isPath')('tjsinvestment');
        $scope.toback = function () {
            $filter('跳回上一页')(2);
        };
        var user = $filter('isRegister')().user;
        $scope.smrFrom = {};
        if ($stateParams.amt != null) {
            $scope.amount = $stateParams.amt * 1;
        };

        if ($stateParams.pid) {
            resourceService.queryPost($scope, $filter('getUrl')('cpDetail'), {
                'pid': $stateParams.pid,
                'uid': user.member.uid
            }, '产品详情');
        } else {
            $state.go('tjs', { wap: true });
        }
        $scope.playSound = true;
        $scope.userTypes = {};
        $scope.userTypes.passWord = '';
        $scope.showMask = false;

        $scope.onChange = function () {
            $rootScope.amt = $scope.amount * 1;
        };
        $scope.agreeclick = function () {
            $scope.playSound = !$scope.playSound;
        }
        $scope.$on('resourceService.QUERY_POST_MYEVENT', function (event, data, type) {
            switch (type) {
                case '用户状态':
                    if (data.success) {
                        $scope.userTypes = data.map;
                    } else {
                        $filter('服务器信息')(data.errorCode, $scope, 'y')
                    }
                    break;
                case '产品详情':
                    if (data.success) {
                        $localStorage.cp = $scope.cp = data.map;
                        $scope.amount = data.map.prize.amount;
                        if ($scope.cp.info.type == 1) { $scope.playSound = true; }
                        // if ($filter('isRegister')().user.member != undefined) {
                        resourceService.queryPost($scope, $filter('getUrl')('判断用户状态'), {
                            'uid': user.member.uid
                        }, '用户状态');
                        resourceService.queryPost($scope, $filter('getUrl')('cpDetail'), {
                            'uid': user.member.uid,
                            'pid': $stateParams.pid
                        }, '账户余额');
                        // } else {
                        //     resourceService.queryPost($scope, $filter('getUrl')('判断用户状态'), {}, '用户状态');
                        // };
                    }
                    break;
                case '账户余额':
                    $scope.balanceFuiou = data.map.balanceFuiou;
                    $scope.repair = data.map.repair;

                    // 返现红包
                    if ($scope.repair != undefined && $scope.cp.info.surplusAmount == $scope.amount) {
                        if ($scope.repair.type == 2) {/*补标收益为加息*/
                            $scope.FXJiaXi = true;
                        } else if ($scope.repair.type == 1) {/*补标收益为返现*/
                            $scope.FXFanXian = true;
                        }
                    } else {
                        $scope.noFXshouyi = true;
                    }
                    if ($scope.cp.info.establish != undefined) {
                        var date3 = $scope.cp.info.establish - Date.parse(new Date());
                        var day = Math.floor(date3 / (24 * 3600 * 1000));
                        var hh = Math.floor(date3 / (3600 * 1000));
                        if (day > 0) {
                            $scope.nowTimer = day + '天';
                            // $scope.isFinish = true;
                        } else
                            if (day == 0 && hh > 1) {
                                $scope.nowTimer = hh + '小时';
                                // $scope.isFinish = true;
                                $scope.isBuTimer = true;
                            } else
                                if (day == 0 && hh < 1) {
                                    $scope.nowTimer = '1小时内'
                                    // $scope.isFinish = true;
                                } else
                                    if (hh < 0) {
                                        if ($scope.cp.info.type == 1) {
                                            $scope.nowTimer = '无限制';
                                        } else {
                                            $scope.nowTimer = '已结束';
                                        }
                                        $scope.isFinish = true;
                                    }
                    } else {
                        $scope.nowTimer = '已结束';
                        $scope.isFinish = true;
                    };
                    if ($scope.repair != undefined && $scope.cp.info.surplusAmount == $scope.amount) {
                        if ($scope.repair.type == 2) {
                            $scope.FBJiaXi = true;
                        } else if ($scope.repair.type == 1) {
                            $scope.FBFanXian = true;
                        }
                    } else {
                        $scope.noFBshouyi = true;
                    }
                    if ($scope.repair != undefined && $scope.cp.info.surplusAmount == $scope.amount) {
                        if ($scope.repair.type == 2) {
                            $scope.JXQJiaXi = true;
                        } else if ($scope.repair.type == 1) {
                            $scope.JXQFanXian = true;
                        }
                    } else {
                        $scope.noJXshouyi = true;
                    }
                    // type==0
                    if ($scope.repair != undefined) {
                        if ($scope.repair.type == 2) {
                            $scope.noHBJiaXi = true;
                        } else if ($scope.repair.type == 1) {
                            $scope.noHBFanXian = true;
                        }
                    } else {
                        $scope.noHBshouyi = true;
                    }
                    break;
                case '购买产品':
                    if (data.success) {
                        $scope.successData = $scope.cp;
                        $scope.successData.shouyi = $rootScope.shouyi;
                        $scope.successData.investAmount = $scope.amount;
                        $scope.successData.investTime = data.map.investTime;
                        $scope.successData.isRepeats = data.map.isRepeats;
                        $scope.successData.activityURL = data.map.activityURL;
                        $scope.successData.jumpURL = data.map.jumpURL;
                        $scope.successData.investId = data.map.investId;
                        $localStorage.successData = $scope.successData;
                        $state.go('tjssuccess', { wap: true });
                    } else {
                        if (data.errorCode == '2001') {
                            $filter('投资交易密码错误信息')($scope);
                        } else {
                            $filter('投资错误信息')(data.errorCode, $scope, 'y',data.errorMsg);
                        }
                    }
                    break;
            };
        });
        $scope.agreeclick = function () {
            $scope.playSound = !$scope.playSound;
        }
        $scope.tobuy = function () {
            if ($scope.amount != '' && $scope.amount != undefined && $('#myPwd').val() != '') {
                resourceService.queryPost($scope, $filter('getUrl')('购买产品'), {
                    'pid': $scope.cp.info.id,
                    'tpwd': $scope.userTypes.passWord,
                    'amount': $scope.amount,
                    'uid': $filter('isRegister')().user.member.uid
                }, '购买产品');
            } else {
                if ($scope.amount == '' || $scope.amount == undefined) {
                    $filter('投资错误信息')('noInp', $scope, 'y');
                } else if ($('#myPwd').val() == '') {
                    $filter('投资错误信息')('noPwd', $scope, 'y');
                }
            }
        };
        $scope.onClick = function (name) {
            switch (name) {
                case '去设置交易密码':
                    $localStorage.fromJY = {};
                    $localStorage.fromJY.amount = $scope.amount;
                    $localStorage.fromJY.cpInfoId = $scope.cp.info.id;

                    $state.go('resetTradePwd', { firstset: true });
                    break;
            };
        };
    });
    controllers.controller('tjssuccessController', ['$scope', '$rootScope', '$filter', '$state', 'resourceService', '$localStorage', function ($scope, $rootScope, $filter, $state, resourceService, $localStorage) {
        $rootScope.title = "投资成功";
        $scope.data = {};
        $scope.user = $filter('isRegister')().user.member;
        if (!$scope.user) { $state.go('dl'); return; }
        if ($localStorage.successData) {
            $scope.data = $localStorage.successData;
        }
        delete $localStorage.successData;
        $scope.closeyaoqing = function () {
            $('.yaoqinghaoyou').fadeOut(200);
        };
        // resourceService.queryPost($scope, $filter('getUrl')('tjs获取地址'), {
        //     uid: $scope.user.uid
        // }, '投即送获取收货地址');
        $scope.$on('resourceService.QUERY_POST_MYEVENT', function (event, data, type) {
            switch (type) {
                case '投即送获取收货地址':
                    if (data.map.jsMemberInfo) {
                        $scope.hasaddress = true;
                        $scope.name = data.map.jsMemberInfo.name;
                        $scope.address = data.map.jsMemberInfo.address;
                        $scope.phone = data.map.jsMemberInfo.phone;
                    } else {
                        $scope.hasaddress = false;
                    }
                    break;
            }
        })
    }]);
})