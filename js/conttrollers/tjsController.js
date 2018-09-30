define(['jweixin','js/module.js'], function (wx,controllers) {
    controllers.controller('tjsController', ['$scope', '$rootScope', '$filter', '$state', 'resourceService', '$timeout', '$location', '$anchorScroll', '$stateParams', '$localStorage','isWeixin','signWeChatService', function ($scope, $rootScope, $filter, $state, resourceService, $timeout, $location, $anchorScroll, $stateParams, $localStorage,isWeixin,signWeChatService) {
        signWeChatService();
        $('body').scrollTop(0);
        if ($location.$$search.toFrom != undefined || $location.$$search.recommCode != undefined || $location.$$search.tid != undefined) {
            $localStorage.webFormPath = $location.$$search;
        };
        $filter('isPath')('tjs');
        $rootScope.title = '沪深理财-网贷投资，国企控股平台';
        if($stateParams.wap){
            $scope.wap = $stateParams.wap;
        }
        else{
            $scope.uid = $stateParams.uid;
        }
        resourceService.queryPost($scope, $filter('getUrl')('tjs活动页'), {}, '投即送活动页');
        var $dataTable = $('.data-table');
        var trHeight = $('.data-list').height()/5;
        $scope.$on('resourceService.QUERY_POST_MYEVENT', function (event, data, type) {
            switch (type) {
                case '投即送活动页':
                    if (data.success) {
                        $scope.prizeList = data.map.prizeList;
                        $scope.investList = data.map.investList;
                        $scope.orderShareList = data.map.orderShareList;
                        $scope.investCount = data.map.investCount;
                        // 列表数据轮动
                        if ($scope.investList.length > 5) {
                            setInterval(function() {
                                $dataTable.animate({'margin-top': '-'+trHeight+'px'},1000,function() {
                                    $dataTable.find('tr').eq(0).appendTo($dataTable);
                                    $dataTable.css('margin-top',0);
                                });
                            }, 3000);
                        }
                        $timeout(function(){
                            var swiper = new Swiper('.swiper-container', {
                                paginationClickable: true,
                                autoplay: 3000,
                                spaceBetween: 0,
                                loop: true,
                                autoplayDisableOnInteraction: false,
                                pagination: '.swiper-pagination-h'
                            });
                        })
                    } else {
                        $filter('服务器信息')(data.errorCode, $scope, 'y');
                    }
                    break;
            };
        });
        $scope.showRule = function () {
            $('.rule-box').fadeIn(200);
        };
        $scope.closeRule = function () {
            $('.rule-box').fadeOut(200);
        };
        $scope.gotop = function () {
            $("html,body").animate({ scrollTop: 0 });
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
        $scope.share = function() {
            if (isWeixin()) {
                $('.activity-tjs-boxweixin').fadeIn(200);
            } else {
                $('.activity-tjs-boxh5').fadeIn(200);
            }
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
            /*$timeout(function(){
                $('.activity-firend-boxh5').fadeOut(200);
                $scope.isCopy = false;
            },1000);*/
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
        wx.ready(function() {
            wx.onMenuShareTimeline({
                title: '不花钱也能消费，爆款好礼免费送！', // 分享标题
                link: 'https://hushenlc.cn/tjs?wap=true', // 分享链接
                imgUrl: 'https://hushenlc.cn/images/activity/tjs/share.png', // 分享图标
                success: function() {
                    alert('分享成功！');
                },
                cancel: function() {
                    alert('您取消了分享！');
                }
            });
            wx.onMenuShareAppMessage({
                title: '不花钱也能消费，爆款好礼免费送！', // 分享标题
                desc: '智慧投资，0元消费~ ', // 分享描述
                link: 'https://hushenlc.cn/tjs?wap=true', // 分享链接
                imgUrl: 'https://hushenlc.cn/images/activity/tjs/share.png', // 分享图标
                success: function() {
                    alert('分享成功！');
                },
                cancel: function() {
                    alert('您取消了分享！');
                }
            });
            wx.onMenuShareQQ({
                title: '不花钱也能消费，爆款好礼免费送！', // 分享标题
                desc: '智慧投资，0元消费~ ', // 分享描述
                link: 'https://hushenlc.cn/tjs?wap=true', // 分享链接
                imgUrl: 'https://hushenlc.cn/images/activity/tjs/share.png', // 分享图标
                success: function() {
                    alert('分享成功！');
                },
                cancel: function() {
                    alert('您取消了分享！');
                }
            });
            wx.onMenuShareWeibo({
                title: '不花钱也能消费，爆款好礼免费送！', // 分享标题
                desc: '智慧投资，0元消费~ ', // 分享描述
                link: 'https://hushenlc.cn/tjs?wap=true', // 分享链接
                imgUrl: 'https://hushenlc.cn/images/activity/tjs/share.png', // 分享图标
                success: function() {
                    alert('分享成功！');
                },
                cancel: function() {
                    alert('您取消了分享！');
                }
            });
            wx.onMenuShareQZone({
                title: '不花钱也能消费，爆款好礼免费送！', // 分享标题
                desc: '智慧投资，0元消费~ ', // 分享描述
                link: 'https://hushenlc.cn/tjs?wap=true', // 分享链接
                imgUrl: 'https://hushenlc.cn/images/activity/tjs/share.png', // 分享图标
                success: function() {
                    alert('分享成功！');
                },
                cancel: function() {
                    alert('您取消了分享！');
                }
            });
        })
    }])
})
