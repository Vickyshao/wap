define([
    'js/module.js'
], function(controllers) {
    controllers.controller('continuedInvest', ['$scope', '$rootScope', '$filter', '$state', 'resourceService','$timeout', function($scope, $rootScope, $filter, $state, resourceService,$timeout) {
        $rootScope.title = "领取现金";
        $scope.user = $filter('isRegister')().user.member;
        if(!$scope.user){
            $state.go('dl');
            return;
        }
        $scope.swiper = {
            name: "hongbaoSwiper",
            readyLoading: false
        };
        $scope.conf = {
            initialSlide:1,
            slidesPerView: 3,
            centeredSlides: true,
            grabCursor: true,
            onTap:function(i,event){
                if(i.clickedIndex>=0){
                    i.slideTo(i.clickedIndex);
                }
            },
            onSlideChangeEnd:function(swiper){
                var index=swiper.activeIndex%3;
                $scope.$apply(function(){
                    $scope.activeData=$scope.rewardList[index];
                })
            }
        };
        $('body').scrollTop(0);
        $scope.cancelShow=false;
        $scope.sureShow=false;
        $scope.linqu=function(){
            $scope.activeData=item;
            $scope.swiper.swiper.slideTo($index);
        };
        $scope.toback=function(){
            $state.go("main.bankBillList");
        };
        // $scope.clickitem=function(item,$index){
        //     $scope.activeData=item;
        //     $scope.swiper.swiper.slideTo($index);
        // };
        $scope.tishiclick=function(){
            $('.tishiclick').slideUp(200);
            $('.wenxintishi').slideDown(200);
        };
        $scope.lijilingqu=function(){
            $scope.sureShow=true;
        };
        $scope.fangqi=function(){
            $scope.cancelShow=true;
        };
        $scope.closethink=function(){
            $scope.cancelShow=false;
        };
        $scope.subxutou=function(){
            resourceService.queryPost($scope, $filter('getUrl')('addContinueReward'), {
                    uid:$scope.user.uid,
                    period:parseInt($scope.activeData.deadline)
                }, '确认续投');
        };
        $scope.left=0;
        $scope.lock=false;
        $scope.huadongstart=function(e){
            e.preventDefault();
            if(!$scope.lock){
                $scope.templeft=$('.huadong-box').offset().left;
                $('.huadong').stop();
                $('.huadongjt').stop();
                var width=parseInt($('.huadong-box').width())+parseInt($('.huadong-box').css('padding-left'))+parseInt($('.huadong-box').css('padding-right'))-parseInt($('.huadong').width());
                $('.huadongjt img').width(width-parseInt($('.yuan').width()));
            }
        };
        $scope.huadongmove=function(e){
            e.preventDefault();
            if(!$scope.lock){
                var left=e.touches[0].clientX-$scope.templeft-parseInt($('.huadong').width()/2);
                var width=parseInt($('.huadong-box').width())+parseInt($('.huadong-box').css('padding-left'))+parseInt($('.huadong-box').css('padding-right'))-parseInt($('.huadong').width());
                if(left>=0 && left<width){
                    $('.huadong').css({left:left});
                    $('.huadongjt').width(left-parseInt($('.yuan').width()));
                }else if(left>=width){
                    left=width;
                    $('.huadong').css({left:left});
                    $('.huadongjt').width(left-parseInt($('.yuan').width()));
                    $scope.lock=true;
                    var w=100;
                    $('.huadong').css('background','#e84034');
                    $('.huadong img').animate({width:0,height:0,'margin-left':$('.huadong img').width()/2,'margin-top':$('.huadong img').width()/2},function(){
                        $('.querenxutou').slideDown();
                        $('.tishi').slideUp();
                    });
                }
            }
        };
        $scope.huadongend=function(e){
            e.preventDefault();
            if(!$scope.lock){
                $('.huadong').animate({left:0},400);
                $('.huadongjt').animate({width:0},400);
            }

        };
        $scope.huadongcancel=function(e){
            e.preventDefault();
            if(!$scope.lock){
                $('.huadong').animate({left:0},400);
                $('.huadongjt').animate({width:0},400);
            }
        };


        resourceService.queryPost($scope, $filter('getUrl')('getContinueReward'), {
                    uid:$scope.user.uid
                }, '续投');
        $scope.$on('resourceService.QUERY_POST_MYEVENT', function(event, data, type) {
            switch (type) {
                case '续投':
                    if (data.success) {
                        $scope.parcelList=data.map.parcelList;
                        $scope.rewardList=data.map.rewardList;
                        var objs=$scope.rewardList.splice(1,1);
                        $scope.rewardList.push(objs[0]);
                        $scope.parcelList.push($scope.parcelList[0]);
                        $scope.activeData=$scope.rewardList[1];
                        var t;
                        $timeout(function(){
                            var index=0;
                            t=setInterval(function(){
                                index++;
                                $('.xutoulist-box ul').animate({'margin-top':-2.2*index+"rem"},500,function(){
                                    if(index==$scope.parcelList.length-1){
                                        index=0;
                                        $('.xutoulist-box ul').css({'margin-top':0});
                                    }
                                });
                            },3000);
                        });
                        $scope.$on('$stateChangeStart',function(){
                            clearInterval(t);
                        });
                        $scope.swiper.initSwiper();
                    }
                break;
                case '确认续投':
                    $scope.successShow=true;
                break;
            }
        });
    }]);
})
