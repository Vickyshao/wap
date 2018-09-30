define([
    'js/module.js'
    ]
    ,function(controllers){
    controllers.controller('specialCtrl'
        ,['$scope'
        ,'$rootScope'
        ,'$filter'
        ,'$state'
        ,'resourceService'
        ,'ngDialog'
        ,'$timeout'
        ,'$localStorage'
        ,'$location'
        ,function($scope,$rootScope,$filter,$state,resourceService,ngDialog,$timeout,$localStorage,$location){
            $filter('isPath')('special');
            $scope.userOBJ = $filter('isRegister')();
            $scope.product = {};
            $scope.yuebiao={};
            if($location.$$search.toFrom != undefined || $location.$$search.recommCode!= undefined||$location.$$search.tid!=undefined){
                $localStorage.webFormPath = $location.$$search;
            }
            $scope.swiper = {
                name: "hongbaoSwiper",
                readyLoading: false
            };
            $scope.conf = {
                slidesPerView:3,
                centeredSlides: true,
                spaceBetween:0,
                grabCursor: true,
                loop:true,
                autoplay:3000,
                autoplayDisableOnInteraction:false
            };
            $scope.gotoDetail=function(id){
                if($location.$$search.wap){
                    $state.go('activityPerson',{id:id,wap:true});
                }else{
                    $state.go('activityPerson',{id:id});
                }
            };
            function getUrlParam(name) {
                var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
                var r = window.location.search.substr(1).match(reg);  //匹配目标参数
                if (r != null) return unescape(r[2]); return null; //返回参数值
            }
            $scope.wap = $location.$$search.wap;
            if (!$scope.wap) {
                $scope.uid = getUrlParam('uid');
                if ($scope.uid != '' && $scope.uid != undefined) {
                    $scope.isLogin = true;
                } else {
                    $scope.isLogin = false;
                }
            } else {
                $scope.isLogin = $scope.userOBJ.register;
                if ($scope.isLogin) {
                    $scope.uid = $scope.userOBJ.user.member.uid;
                }
            }

            // 倒计时
            // $scope.getRTime = function() { 
            //     var EndTime= new Date('2016/10/20 12:00:00'); //截止时间 
            //     var NowTime = new Date(); 
            //     var t =EndTime.getTime() - NowTime.getTime(); 
            //     $scope.$apply(function() {
            //         $scope.day=Math.floor(t/1000/60/60/24); 
            //         $scope.hour=Math.floor(t/1000/60/60%24); 
            //         $scope.minute=Math.floor(t/1000/60%60); 
            //         $scope.second=Math.floor(t/1000%60);
            //     });
            //     if ($scope.day <= 0 && $scope.hour <= 0 && $scope.minute <= 0 && $scope.second <= 0) {
            //         clearInterval(timer);
            //         $scope.$apply(function() {
            //             $scope.showBtn = true;
            //         });
            //     }
            // };
            // var timer = setInterval($scope.getRTime,1000);
            // $filter('倒计时弹窗')($scope);
            $scope.closeDialog = function() {
                ngDialog.closeAll();
            };

            $scope.alertCode = function() {
                $filter('幸运码弹窗')($scope);
                $timeout(function(){
                    $('.goToApp').attr('href','jsmp://page=9?pid='+$scope.product.id+'&ptype='+$scope.product.type+'&atid=1');
                })
            };

            $scope.goLogin = function() {
                $localStorage.specialLogin = true;
                $state.go('dl',{returnurl:'special'});
            };

            $scope.$on('resourceService.QUERY_POST_MYEVENT', function(event, data, type) {
                switch(type.name){
                    case "我的幸运码":
                        if (data.success) {
                            $scope.luckAmount = data.map.luckAmount;
                            if ($scope.luckAmount) {
                                $scope.luckCodes = data.map.luckCodes.split(',');
                            }
                        }
                    break;
                    case "活动标详情":
                        if (data.success) {
                            $scope.product = data.map.result;
                            $scope.yuebiao.prid=data.map.prid;
                            $scope.yuebiao.name=data.map.name;
                            $scope.yuebiao.isReservation=data.map.isReservation;
                            $scope.yuebiao.realverify=data.map.realverify;
                            $scope.investList = data.map.investList;
                            $scope.investTotal = data.map.investTotal;
                            $scope.codeFixation=data.map.codeFixation;
                            $scope.bannerUrl=data.map.bannerUrl;
                            // 得到id 获取幸运码
                            if ($scope.isLogin) {
                                resourceService.queryPost($scope,$filter('getUrl')('我的幸运码'),{
                                    id: $scope.product.id,
                                    uid: $scope.uid
                                },{name: '我的幸运码'});
                            }

                            // 列表数据轮动
                            if ($scope.investList.length > 4) {
                                setInterval(function() {
                                    $dataTable.animate({'margin-top': '-'+trHeight+'px'},1000,function() {
                                        $dataTable.find('tr').eq(0).appendTo($dataTable);
                                        $dataTable.css('margin-top',0);
                                    });
                                }, 5000);
                            }

                            if ($scope.wap == false) {
                                $('.goToApp').attr('href','jsmp://page=9?pid='+$scope.product.id+'&ptype='+$scope.product.type+'&atid=1');
                            }

                        }
                    break;
                    case "活动开奖结果":
                        if (data.success) {
                            $scope.current = data.map.current[0];

                            if (data.map.current.length == 0) {
                                $scope.isLottery = false;
                            } else {
                                $scope.isLottery = true;
                            }
                            $scope.history = data.map.history;
                            if(data.map.current&&data.map.current.length>0){$scope.history.unshift(data.map.current[0]);$scope.history.pop();}
                            if($scope.current&&$scope.current.length>0&&$scope.current[0].prizeUrl){$scope.videolink=$scope.current[0].prizeUrl;$scope.activityPeriods=$scope.current[0].activityPeriods;}
                            else{
                                for(var i=0;i<$scope.history.length;i++){
                                    if($scope.history[i].prizeUrl){
                                        $scope.videolink=$scope.history[i].prizeUrl;
                                        $scope.activityPeriods=$scope.history[i].activityPeriods;
                                        break;
                                    }
                                }
                            }
                            $timeout(function(){
                                $scope.swiper.initSwiper();
                                var swiper = new Swiper('.swiper-container-h', {
                                            paginationClickable: true,
                                            spaceBetween: 50,
                                            autoplay:3000,
                                            autoplayDisableOnInteraction:false,
                                            loop:true
                                        });
                            });
                            /*if ($scope.history.length > 2) {
                                clearInterval($scope.timer);
                                $scope.timer = setInterval(function() {
                                    $infoBox.animate({'margin-top': '-'+modeLength+'px'},1000,function() {
                                        $infoBox.find('.mode').eq(0).appendTo($infoBox);
                                        $infoBox.css('margin-top',0);
                                    });
                                }, 5000);
                            }*/
                        }
                    break;
                }
            });

            var $dataTable = $('.data-table'),
                trHeight = $('.data-list').height()/4,
                $infoBox = $('.myinfobox'),
                modeLength = $('.lottery-info').height()/2;

            // 活动标详情
            resourceService.queryPost($scope,$filter('getUrl')('活动标详情'),{uid:$scope.uid},{name: '活动标详情'});

            // 活动开奖结果
            resourceService.queryPost($scope,$filter('getUrl')('活动开奖结果'),{},{name: '活动开奖结果'});
            $scope.goyuebiao=function(){
                $state.go('cpDetail',{pid:$scope.product.id});
                /*if($scope.yuebiao.realverify){
                    $state.go('yuebiao',{prid:$scope.yuebiao.prid,name:$scope.yuebiao.name,toState:$state.current.name});
                }else{
                    $scope.isRealverify=true;
                }*/
            };
            // 监听登录是否成功
            // $rootScope.$on('loginSuccess', function(event, flag) {
            //     if (flag) {
            //         window.location.reload();
            //     }
            // });

        }
    ]);
})

