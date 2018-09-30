define(['jweixin', 'js/module.js', 'jquery', 'ngdialog', 'SHR256'], function (wx, controllers, $, ngdialog, SHR256, weixin) {
    controllers.service('weixinS',['$localStorage','resourceService','ShareData',function ($localStorage,resourceService,ShareData) {}])
    controllers.controller('memberWelfareCtrl', ['$scope', '$rootScope', 'resourceService', '$filter', '$state', 'ngDialog', '$location', 'md5', '$localStorage', '$stateParams', 'isWeixin','signWeChatService','weixinS','ShareData', function ($scope, $rootScope, resourceService, $filter, $state, ngDialog, $location, md5, $localStorage, $stateParams, isWeixin,signWeChatService,weixinS,ShareData) {
        $("html,body").scrollTop(0);
        $filter('isPath')('memberWelfare');
        signWeChatService();
        $rootScope.title = '会员福利日';
        $scope.isLogin = $filter('isRegister')().register;
        $scope.user = $filter('isRegister')().user.member;
        $scope.isFirstTerm = true;
        $scope.act = 1;
        // 规则弹窗
        $scope.ruleShow = function () {
            $filter('会员福利日规则弹窗')($scope);
            // $filter('会员福利日中奖弹窗')($scope);
        };


        $scope.click = function () {

        }
        //刮奖js
        $scope.canvasFun = function (ulr) {
            var imgSrc = ulr;
            var img = new Image();
            img.src = imgSrc;
            var canvas = document.getElementById("myCanvas");
            var width = canvas.width;
            var height = canvas.height;
            img.addEventListener('load',function(e){
                var ctx;
                var w = width, h = height;
                var offsetX = canvas.offsetLeft, offsetY = canvas.offsetTop;
                var scrolltop = $("#myCanvas").offset().top
                var mousedown = false;
                function layer(ctx){
                    // ctx.fillStyle = 'gray';
                    ctx.fillRect(0, 0, w, h);
                }
                function eventDown(e){
                    canvas.style.backgroundImage='url('+img.src+')';
                    e.preventDefault();
                    mousedown=true;
                    $scope.isMove = true;
                }
                function eventUp(e){
                    e.preventDefault();

                    if (mousedown) {
                        if ($scope.userActivityInfo.isST == 0) {
                            $filter('会员福利日各种弹窗')($scope,3);
                        } else {
                            $filter('会员福利日中奖弹窗')($scope,function () {
                                if ($scope.userActivityInfo.usableSize == 0) {
                                    canvas.removeEventListener('touchstart', eventDown);
                                    canvas.removeEventListener('touchend', eventUp);
                                    canvas.removeEventListener('touchmove', eventMove);
                                    canvas.removeEventListener('mousedown', eventDown);
                                    canvas.removeEventListener('mouseup', eventUp);
                                    canvas.removeEventListener('mousemove', eventMove);
                                }
                                $scope.canvasMask = false;
                                canvas.style.backgroundImage='';
                                ctx.clearRect(0, 0, w, h)
                                ctx.globalCompositeOperation = 'source-over';
                                ctx.beginPath();
                                ctx.fillStyle = pattern;
                                ctx.fillRect(0, 0, w, h);
                            });
                        }

                        mousedown=false;
                    }


                }
                function eventMove(e){
                    ctx.globalCompositeOperation = 'destination-out';
                    e.preventDefault();
                    if(mousedown){
                        if(e.changedTouches){
                            e=e.changedTouches[e.changedTouches.length-1];
                        }
                        var x = (e.clientX + document.body.scrollLeft || e.pageX) - offsetX || 0,
                            y = (e.clientY + document.body.scrollTop || e.pageY) - scrolltop || 0;
                        with(ctx){
                            beginPath();
                            arc(x, y, 20, 0, Math.PI * 2);
                            fill();
                        }
                    }
                }

                // canvas.style.backgroundImage='url('+img.src+')';
                canvas.style.backgroundPosition='center';
                canvas.style.backgroundRepeat='no-repeat';
                canvas.style.backgroundSize='60%';
                ctx=canvas.getContext('2d');
                // ctx.fillStyle='#b9b9b9';
                var into = document.createElement("canvas");
                var ctx2 = into.getContext('2d');
                // into.width = w;
                // into.height = h;
                var img1 = new Image();
                img1.src = '/images/memberWelfare/bg3.png';
                ctx2.drawImage(img1,0,0,w,h);
                var pattern = ctx.createPattern(into, 'no-repeat');
                ctx.fillStyle = pattern;
                ctx.fillRect(0, 0, w, h);


                // ctx.fillRect(0, 0, w, h);

                // layer(ctx);
                canvas.addEventListener('touchstart', eventDown);
                canvas.addEventListener('touchend', eventUp);
                canvas.addEventListener('touchmove', eventMove);
                canvas.addEventListener('mousedown', eventDown);
                canvas.addEventListener('mouseup', eventUp);
                canvas.addEventListener('mousemove', eventMove);
            });
        }
        if ($stateParams.toFrom) {
            $localStorage.isWxUser = {
                toFrom: $stateParams.toFrom
            }
        }
        $scope.toLogin = function () {
            $state.go('dl',{ returnurl: 'memberWelfare' });
        }
        $scope.myAward = function () {
            if($scope.isLogin) {
                resourceService.queryPost($scope, $filter('getUrl')('会员福利日-我的奖品'),{ activityCode: 'WXHYHD', uid: $scope.user.uid, status: 0}, { name: '我的奖品未领' });
                resourceService.queryPost($scope, $filter('getUrl')('会员福利日-我的奖品'),{ activityCode: 'WXHYHD', uid: $scope.user.uid, status: 1}, { name: '我的奖品已领' });
                // $state.go('main.bankBillList');
                $filter('会员福利日我的奖品弹窗')($scope);
            } else {
                $scope.toLogin();
            }
        }
        $scope.toGuaGua = function () {
            if($scope.isLogin) {
                if ($scope.userActivityInfo && $scope.userActivityInfo.getSize == 5 && $scope.userActivityInfo.usableSize==0) {
                    //1---- 机会用完了  2----分享或者投资还能刮奖
                    $filter('会员福利日各种弹窗')($scope,1);
                } else {
                    if ($scope.userActivityInfo && $scope.userActivityInfo.usableSize>0){
                        resourceService.queryPost($scope, $filter('getUrl')('会员福利日-抽奖'),{ uid: $scope.user.uid, activityCode: 'WXHYHD'}, { name: '抽奖' });
                    } else {
                        if ($scope.userActivityInfo && ($scope.userActivityInfo.getSize - $scope.userActivityInfo.usableSize > 0)) {
                            $filter('会员福利日各种弹窗')($scope,2);
                        } else {
                            delete $localStorage.user;
                            $state.go('dl',{ returnurl: 'memberWelfare' });
                        }
                    }
                }
            } else {
                $scope.toLogin();
            }
        }
        // 去投资按钮
        $scope.toInvestIng = function (item) {
            ngDialog.closeAll();
            if($scope.isLogin) {
                if (item && item.AMLId) {
                    if ($scope.userActivityInfo.isST == 0) {
                        ngDialog.closeAll();
                        $filter('会员福利日各种弹窗')($scope,3);
                        return
                    } else {
                        sessionStorage.setItem('AMLId',item.AMLId)
                    }
                } else {
                    sessionStorage.setItem('wxhuhd','wxhuhd')
                }
                $state.go('main.bankBillList');
            } else {
                $scope.toLogin();
            }
        }
        $scope.isInActivityTime = true;
        $scope.login = {};
        $scope.userLogin = {};

        $scope.toback = function() {
            $filter('跳回上一页')(2);
        };
        $scope.toguaka = function() {
            ngDialog.closeAll();
        };
        $scope.default = function(e) {
            e.stopPropagation();
        }
        $scope.clickInput = function (event) {
            // $scope.userLogin.picCode = null;
            changePicEvent = event;
            changeIMG(changePicEvent);
        };
        $scope.actFun = function (key) {
            $scope.act = key;
            if (key == 1) {
                $scope.awardInfoText = '奖品有效期为5天，请及时使用'
            } else if (key == 2) {
                $scope.awardInfoText = '实物和话费奖励在活动结束后10个工作日内发放'
            }
        }
        $scope.awardStatus = 0;
        if ($scope.isLogin) {
            if ($stateParams.wxGetSize) {
                $scope.num = $stateParams.wxGetSize;
                if ($scope.num>=1) {
                    $filter('会员福利日各种弹窗')($scope,4);
                }
            }
            resourceService.queryPost($scope, $filter('getUrl')('会员福利日-用户抽奖信息'),{ activityCode: 'WXHYHD', uid: $scope.user.uid}, { name: '用户活动信息' });

        }
        resourceService.queryPost($scope, $filter('getUrl')('会员福利日-中奖用户列表'),{ activityCode: 'WXHYHD'}, { name: '中奖用户列表' });
        resourceService.queryPost($scope, $filter('getUrl')('会员福利日-活动奖品列表'),{ activityCode: 'WXHYHD'}, { name: '活动奖品列表' });
        $scope.$on('resourceService.QUERY_POST_MYEVENT', function (event, data, type) {
            switch (type.name) {
                case '中奖用户列表':
                    if(data.success) {
                        $scope.prizeWinnerList = data.map.prizeWinnerMapList;
                        var $table = $(".award-list .list");
                        if ($scope.prizeWinnerList.length > 2) {
                            setInterval(function() {
                                $table.animate({'margin-top':'-2.49rem'},500,function() {
                                    $table.find('p').eq(0).appendTo($table);
                                    $table.css('margin-top',0);
                                })
                            },5000);
                        }
                    }
                    break;
                case '活动奖品列表':
                    if(data.success) {
                        $scope.awardInfoList = data.map.awardInfoList;
                        $scope.isFirstActivity = data.map.isFirstActivity;
                        $scope.status = data.map.status;
                        setTimeout(function(){
                            var mySwiper = new Swiper('.swiper-container', {
                                autoplay:3000,
                                nextButton: '.swiper-button-next',
                                prevButton: '.swiper-button-prev',
                                slidesPerView: 4,
                                // centeredSlides: true,
                                // paginationClickable: true,
                                // width:334,
                                spaceBetween: 19
                            });
                        }, 100)
                    }
                    break;
                case '用户抽奖信息':
                    if(data.success) {
                        $scope.awardInfoList = data.map.usableSize;
                    }
                    break;
                case '抽奖':
                    if(data.success) {
                        $scope.canvasMask = true;
                        $scope.awardInfo = data.map;
                        $scope.userActivityInfo.usableSize --;
                        // ShareData.setLink('ghjyui');
                        $scope.canvasFun($scope.awardInfo.picUrl)
                    }
                    break;
                case '用户活动信息':
                    if(data.success) {
                        $scope.userActivityInfo = data.map;
                    }
                    break;
                case '我的奖品未领':
                    if(data.success) {
                        $scope.awardInfos = data.map.awardInfos;
                        if($scope.awardInfos.length) {
                            if ($scope.awardStatus == 0) {
                                $scope.awardInfoText = '奖品有效期为5天，请及时使用'
                            }
                        }
                    }
                    break;
                case '我的奖品已领':
                    if(data.success) {
                        $scope.myawardInfos = data.map.awardInfos;
                    }
                    break;
                case '分享赠送机会':
                    if(data.success) {
                        if (data.map.size == 1) {
                            $scope.userActivityInfo.usableSize ++
                            $filter('会员福利日各种弹窗')($scope,5);
                        }
                    }
                    break;
            };
        });
        $scope.closeDialog = function () {
            ngDialog.closeAll();
        };
        $scope.share = function(value) {
            // resourceService.queryPost($scope, $filter('getUrl')('分享赠送机会'), dataParams, '分享赠送机会');
            if($scope.isLogin) {
                if (isWeixin()) {
                    $('.activity-tjs-boxweixin').fadeIn(200);
                } else {
                    $('.activity-tjs-boxh5').fadeIn(200);
                }
                $scope.closeDialog();
            } else {
                $scope.toLogin()
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
        wx.ready(function() {
            wx.onMenuShareTimeline({
                title: '我刚刮到了大奖，你也来试试吧~', // 分享标题
                desc: '沪深微粉会员日，每周刮一刮，iPhone X 抱回家~~速领', // 分享描述
                link: 'https://m.hushenlc.cn/memberWelfare', // 分享链接
                // link: 'http://devm.shcen.com/memberWelfare', // 分享链接
                imgUrl: 'https://m.hushenlc.cn/images/memberWelfare/member-share.png', // 分享图标
                // imgUrl: 'http://devm.shcen.com/images/memberWelfare/member-share.png', // 分享图标
                success: function() {
                    // alert('分享成功！');
                    resourceService.queryPost($scope, $filter('getUrl')('会员福利日-分享'), { activityCode: 'WXHYHD', uid: $scope.user.uid}, { name:  '分享赠送机会' });
                },
                cancel: function() {
                    alert('您取消了分享！');
                }
            });
            wx.onMenuShareAppMessage({
                title: '我刚刮到了大奖，你也来试试吧~', // 分享标题
                desc: '沪深微粉会员日，每周刮一刮，iPhone X 抱回家~~速领', // 分享描述
                // link: 'http://devm.shcen.com/memberWelfare', // 分享链接
                link: 'https://m.hushenlc.cn/memberWelfare', // 分享链接
                // imgUrl: 'http://devm.shcen.com/images/memberWelfare/member-share.png', // 分享图标
                imgUrl: 'https://m.hushenlc.cn/images/memberWelfare/member-share.png', // 分享图标
                success: function() {
                    // alert('分享成功！');
                    resourceService.queryPost($scope, $filter('getUrl')('会员福利日-分享'), { activityCode: 'WXHYHD', uid: $scope.user.uid}, { name:  '分享赠送机会' });
                },
                cancel: function() {
                    alert('您取消了分享！');
                }
            });
        })


    }])
})