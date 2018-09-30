/**
 * Created by Eva on 2017/10/25.
 */
define(['jweixin', 'js/module.js', 'jquery', 'ngdialog', 'SHR256','gaugeMeter'],function (wx, controllers, $, ngdialog, SHR256, weixin,gaugeMeter) {
    controllers.controller('stagingCtrl',['$scope', '$rootScope', 'resourceService', '$filter', '$state', 'ngDialog', '$location', 'md5', '$localStorage', '$stateParams', function ($scope, $rootScope, resourceService, $filter, $state, ngDialog, $location, md5, $localStorage, $stateParams) {
        $filter('isPath')('staging');
        document.getElementsByTagName('html')[0].scrollTop = 0;
        document.getElementsByTagName('body')[0].scrollTop = 0;
        $rootScope.title = '分期报销';
        $scope.user = $filter('isRegister')().user;
        // 如果用户未登录，返回登录页
        if(!$rootScope.fromNative) {
            if(!$scope.user.member) {
                $state.go('dl');
            }
        }
        $scope.infos = [];
        $scope.pageOn = 1;
        $scope.pageSize = 10;
        $scope.showMode = 1;

        $scope.toback=function () {
            $localStorage.pathUrl.pop();
            $filter('跳回上一页')();
        };
        if($rootScope.fromNative) {
            $('.reimburse').removeClass('headerTop');
        }
        $scope.toReimburse = function () {
            if($rootScope.fromNative) {
                var hushendetail = {
                    rate: 0.04,
                    deline: 7,
                    total: 200,
                    rid: $scope.latestActiveNotReimbursedRecord.id
                }
                document.location = 'hushenreimbursealert:' + angular.toJson(hushendetail);
            } else {
                ngDialog.open({
                    className: 'reimburseDialog',
                    template: ' <div class="reimburseWrap">' +
                    ' <h2 class="reimburseWrap-title">投资7天报销专属标</h2>' +
                    ' <div class="ngdialog-close"></div> ' +
                    '<div class="reimburseWrap-body">' +
                    ' <p class="tit">仅需投资200元，本期报销自动打入您账户余额</p> ' +
                    '<ul> <li> <h2 class="red">4<span>%</span></h2> <p>历史年化收益率</p> </li> <li> <h2>7<span>天</span></h2> <p>锁定期</p> </li> </ul> ' +
                    '<div class="btn" ui-sref="cpDetail({rid:'+$scope.latestActiveNotReimbursedRecord.id+'})" ng-click="close()">立即投资</div><p class="footer">到期收益 <span>0.15</span>元</p>' +
                    ' </div> ' +
                    '</div> ',
                    showClose: false,
                    closeByDocument: true,
                    plain: true
                });
            }
        };
        $rootScope.close = function () {
            $('.reimburseDialog').hide();
        };

        var obj = {
            pageOn:$scope.pageOn,
            pageSize:$scope.pageSize
        };
        if($rootScope.fromNative) {
            obj.token = $rootScope.getUrlParam('token');
            obj.uid = $rootScope.getUrlParam('uid');

        } else {
            if ($scope.user) {
                obj.uid = $scope.user.member.uid;
            }
        }
        $scope.getData = function() {
            var obj = {
                pageOn: $scope.pageOn,
                pageSize: $scope.pageSize
            };
            if($rootScope.fromNative) {
                obj.token = $rootScope.getUrlParam('token');
                obj.uid = $rootScope.getUrlParam('uid');
            } else {
                if ($scope.user) {
                    obj.uid = $scope.user.member.uid;
                }
            }
            resourceService.queryPost($scope, $filter('getUrl')('分期报销'), obj , { name: 'staging'});
        };
        resourceService.queryPost($scope, $filter('getUrl')('分期报销'), obj , { name: 'staging'});
        $scope.$on('resourceService.QUERY_POST_MYEVENT',function (event, data,type) {
            switch (type.name) {
                case 'staging':
                    if(data.success) {
                        $scope.staging = data.map;
                        if(data.map.latestActiveNotReimbursedRecord){
                            $localStorage.latestActiveNotReimbursedRecord = $scope.latestActiveNotReimbursedRecord = data.map.latestActiveNotReimbursedRecord;
                        }
                        $scope.page = data.map.pageData;

                        $scope.TOTALPAGE = data.map.pageData.totalPage;
                        if (data.map.pageData.pageOn <= data.map.pageData.totalPage) {

                            $scope.infos = $scope.infos.concat(data.map.pageData.rows);
                            if($scope.pageOn == 1){
                                $('.GaugeMeter').attr('data-percent', $scope.staging.periodsReimbursedRate*100);
                                $('.GaugeMeter').attr('data-text', $scope.staging.periodsReimbursedAmount);
                                $(".GaugeMeter").gaugeMeter();
                            }
                            if($scope.pageOn == $scope.TOTALPAGE){
                                $('.more span').addClass("no-more");
                                $('.more span').text('没有更多了');
                            }else{
                                $('.more span').text('点击加载更多...');
                                $scope.pageOn++;
                            }
                        }
                    } else{
                        $filter('服务器信息')(data.errorCode,$scope,'y');
                        $state.go('main.home');
                    }
                    $('.more span').removeClass("loadmore");
                    break;

                }
            }
        )

        $scope.loadMore= function () {
            if(!$('.more span').hasClass("no-more")){
                $('.more span').addClass("loadmore");
                $('.more span').text('正在加载...');
                $scope.getData();
            }
        }

    }]);
})