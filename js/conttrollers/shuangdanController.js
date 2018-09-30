define(['jweixin', 'js/module.js', 'xue'], function (wx, controllers) {
    controllers.controller('shuangdanController', ['$scope', '$rootScope', '$filter', '$state', 'resourceService', '$timeout', '$location', '$anchorScroll', '$stateParams','isWeixin','ngDialog', function ($scope, $rootScope, $filter, $state, resourceService, $timeout, $location, $anchorScroll, $stateParams, isWeixin,ngDialog) {
        $rootScope.title = "";
        /*下雪*/
        $(".snow-canvas").snow();
        var uid = '';
        if ($stateParams.wap) {
            $scope.wap = $stateParams.wap;
            $scope.user = $filter('isRegister')().user.member;
            if($scope.user){
                uid = $scope.user.uid;
            }
        }
        else if ($stateParams.uid) {
            $scope.user = {};
            $scope.user.uid = $stateParams.uid;
        }
        if ($scope.user) {
            resourceService.queryPost($scope, $filter('getUrl')('双旦活动'), {
                uid: $scope.user.uid
            }, '双旦活动');
        }
        else {
            resourceService.queryPost($scope, $filter('getUrl')('双旦活动'), {}, '双旦活动');
        }
        $('body').scrollTop(0);
        $scope.openBox = function () {
            if(!$scope.user){
                if($stateParams.wap){
                    $state.go('dl',{returnurl: 'shuangdan'});
                }
            }
            else{
                resourceService.queryPost($scope, $filter('getUrl')('拆双旦红包'), {
                    uid: $scope.user.uid
                }, '拆双旦红包');
            }
            // else if ($scope.isOldUser == true && $scope.pullCount > 0) {
            //     resourceService.queryPost($scope, $filter('getUrl')('拆双旦红包'), {
            //         uid: $scope.user.uid
            //     }, '拆双旦红包');
            // }
            // else if ($scope.isOldUser == false) {
            //     $scope.boxOpen = true;
            //     $scope.boxType = 'new';
            //     $("body,html").css({ "overflow": "hidden", "height": "100%" });
            // }
            // else {
            //     $scope.boxOpen = true;
            //     $scope.boxType = 'none';
            //     $("body,html").css({ "overflow": "hidden", "height": "100%" });
            // }
        };
        $scope.closeBox = function () {
            $scope.boxOpen = false;
            $scope.boxType = '';
            $("body,html").css({ "overflow": "auto", "height": "auto" });
        };
        $scope.tojxq = function () {
            $scope.boxOpen = false;
            $scope.boxType = '';
            $("body,html").css({ "overflow": "auto", "height": "auto" });
            $location.hash('jxq');
            $anchorScroll();
        }
        $scope.tolpq = function () {
            $scope.boxOpen = false;
            $scope.boxType = '';
            $("body,html").css({ "overflow": "auto", "height": "auto" });
            $location.hash('lpq');
            $anchorScroll();
        }
        $scope.toLists = function () {
            $scope.boxOpen = false;
            $scope.boxType = '';
            $("body,html").css({ "overflow": "auto", "height": "auto" });
            $state.go('main.bankBillList');
        }
        $scope.$on('resourceService.QUERY_POST_MYEVENT', function (event, data, type) {
            switch (type) {
                case '双旦活动':
                    if (data.success) {
                        $scope.productList = data.map.productList;
                        $scope.isOldUser = data.map.isOldUser;
                        $scope.pullCount = data.map.pullCount;
                        $scope.luckyList = data.map.luckyList;
                        $scope.activity60 = data.map.activity_60;
                        $scope.activity180 = data.map.activity_180;
                    } else {
                        $filter('服务器信息')(data.errorCode, $scope, 'y');
                    }
                    break;
                case '拆双旦红包':
                    if (data.success) {
                        $scope.pullCount = data.map.pullCount;
                        $scope.amount = data.map.amount;
                        $scope.prizeName = data.map.prizeName;
                        $scope.boxOpen = true;
                        $scope.boxType = 'share';
                        $("body,html").css({ "overflow": "hidden", "height": "100%" });
                    }
                    else if(data.errorCode == 9999 || data.errorCode == 1002){
                        $scope.boxOpen = true;
                        $scope.boxType = 'error';
                        $("body,html").css({ "overflow": "hidden", "height": "100%" });
                    }
                    else if(data.errorCode == 1001){
                        ngDialog.open({
                            template: '<p class="error-msg">活动已经结束</p>',
                            showClose: false,
                            closeByDocument: true,
                            plain: true
                        });
                    }
                    else if(data.errorCode == 1003){
                        if ($scope.isOldUser == false) {
                            $scope.boxOpen = true;
                            $scope.boxType = 'new';
                            $("body,html").css({ "overflow": "hidden", "height": "100%" });
                        }
                        else {
                            $scope.boxOpen = true;
                            $scope.boxType = 'none';
                            $("body,html").css({ "overflow": "hidden", "height": "100%" });
                        }
                    }
                    break;
            };
        });

        if(isWeixin()){
            $scope.weixin = true;
        }
        else{
            $scope.weixin = false;
        }

        $scope.share = function () {
            $('.activity-firend-boxweixin').fadeIn(150);
        };
        $scope.closeshareweixin = function () {
            $('.activity-firend-boxweixin').fadeOut(150);
        };

        wx.ready(function () {
            wx.onMenuShareTimeline({
                title: '我在参加拆钱袋活动，拆了'+$scope.amount+'元现金，你也来参加吧！', // 分享标题
                link: 'https://hushenlc.cn/shuangdanshare?wap=true&uid=' + uid, // 分享链接
                imgUrl: 'https://hushenlc.cn/images/activity/shuangdan/share.png', // 分享图标
                success: function () {
                    alert('分享成功！');
                },
                cancel: function () {
                    alert('您取消了分享！');
                }
            });
            wx.onMenuShareAppMessage({
                title: '我在参加拆钱袋活动，拆了'+$scope.amount+'元现金，你也来参加吧！', // 分享标题
                // desc: '送10万元体验金、666元红包、1.2倍翻倍券等新手大礼包！', // 分享描述
                link: 'https://hushenlc.cn/shuangdanshare?wap=true&uid=' + uid, // 分享链接
                imgUrl: 'https://hushenlc.cn/images/activity/shuangdan/share.png', // 分享图标
                success: function () {
                    alert('分享成功！');
                },
                cancel: function () {
                    alert('您取消了分享！');
                }
            });
            wx.onMenuShareQQ({
                title: '我在参加拆钱袋活动，拆了'+$scope.amount+'元现金，你也来参加吧！', // 分享标题
                // desc: '送10万元体验金、666元红包、1.2倍翻倍券等新手大礼包！', // 分享描述
                link: 'https://hushenlc.cn/shuangdanshare?wap=true&uid=' + uid, // 分享链接
                imgUrl: 'https://hushenlc.cn/images/activity/shuangdan/share.png', // 分享图标
                success: function () {
                    alert('分享成功！');
                },
                cancel: function () {
                    alert('您取消了分享！');
                }
            });
            wx.onMenuShareWeibo({
                title: '我在参加拆钱袋活动，拆了'+$scope.amount+'元现金，你也来参加吧！', // 分享标题
                // desc: '送10万元体验金、666元红包、1.2倍翻倍券等新手大礼包！', // 分享描述
                link: 'https://hushenlc.cn/shuangdanshare?wap=true&uid=' + uid, // 分享链接
                imgUrl: 'https://hushenlc.cn/images/activity/shuangdan/share.png', // 分享图标
                success: function () {
                    alert('分享成功！');
                },
                cancel: function () {
                    alert('您取消了分享！');
                }
            });
            wx.onMenuShareQZone({
                title: '我在参加拆钱袋活动，拆了'+$scope.amount+'元现金，你也来参加吧！', // 分享标题
                // desc: '送10万元体验金、666元红包、1.2倍翻倍券等新手大礼包！', // 分享描述
                link: 'https://hushenlc.cn/shuangdanshare?wap=true&uid=' + uid, // 分享链接
                imgUrl: 'https://hushenlc.cn/images/activity/shuangdan/share.png', // 分享图标
                success: function () {
                    alert('分享成功！');
                },
                cancel: function () {
                    alert('您取消了分享！');
                }
            });
        })
    }])
        .directive("repeatFinish", function () {
            return {
                link: function (scope, element, attr) {
                    if (scope.$last == true) {
                        scope.$eval(attr.repeatFinish);
                    }
                }
            }
        })
        .directive('scrollLeft', function () {
            var temp = '<li repeat-finish="finish()" ng-repeat="item in luckyList">' +
                '<p>{{item.userName}}获得了{{item.amount}}元</p>' +
                '</li>'
            return {
                restrict: 'A',
                template: temp,
                scope: true,
                link: function ($scope, element, attrs) {
                    var a = 1;
                    $scope.finish = function () {
                        if(a==1){
                            a++;
                            $(element).find('li').each(function (i) {
                                var width = parseFloat($(this).css('width'));
                                $(this).css({
                                    left: i * width + 'px'
                                })
                                var that = this;
                                setInterval(function () {
                                    var left = parseFloat($(that).css('left'));
                                    if (left < (width * (-1))) {
                                        $(that).css({ left: ($scope.luckyList.length - 1) * width + 'px' });
                                    }
                                    var left = parseFloat($(that).css('left'));
                                    $(that).css({
                                        left: (left - 2) + 'px'
                                    })
                                }, 20)
                            })
                        }
                    }
                }
            }
        });
})
