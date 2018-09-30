define([
    'js/module.js'
], function(controllers) {
    controllers.controller('myActivityRewardsCtrl', ['$scope', '$rootScope', '$filter', '$state', 'resourceService', function($scope, $rootScope, $filter, $state, resourceService) {
        $rootScope.title = "活动中心";
        $scope.userOBJ = $filter('isRegister')();
        $scope.showInfo = function(e) {
            $(e.currentTarget).siblings().stop().slideToggle(200);
            var obj=$(e.currentTarget).find('.cloumn4').find('img');
            if (obj.hasClass('active')) {
                obj.removeClass('active');
            } else {
                obj.addClass('active');
            }
        };
        $scope.active = 0;
        $scope.page = {};
        $scope.page.pageOn = 1;
        $scope.page.pageSize = 1000;
        $scope.prizeStatus=null;
        var init = function() {
            var obj = {};
            obj.uid = $scope.userOBJ.user.member.uid;
            obj.pageOn = $scope.page.pageOn;
            obj.pageSize = $scope.page.pageSize;
            obj.prizeStatus=$scope.prizeStatus;
            resourceService.queryPost($scope, $filter('getUrl')('getMyPrizeRecords'),obj, '中奖记录');
        }

        $scope.$on('resourceService.QUERY_POST_MYEVENT', function(event, data, type) {
            switch (type) {
                case '中奖记录':
                    if (data.success) {
                        $scope.activityData = data.map.pageInfo.rows;
                    } else {
                        $filter('服务器信息')(data.errorCode, $scope, 'y');
                    };
                    break;
            }
        });
        init();
        $scope.clickItem=function(i){
            $scope.active=i;
            if(i==0){$scope.prizeStatus=null;}
            else if(i==1){$scope.prizeStatus=0;}
            else if(i==2){$scope.prizeStatus=1;}
            init();
        };
        $scope.toback = function() {
            $filter('跳回上一页')();
        };
    }]);
})
