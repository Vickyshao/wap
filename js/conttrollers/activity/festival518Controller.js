define(['jweixin', 'js/module.js', 'jquery', 'ngdialog', 'SHR256'], function (wx, controllers, $, ngdialog, SHR256, weixin) {
    controllers.controller('festival518Controller', function ($scope, $rootScope, resourceService, $filter, $state, $location, $localStorage, $stateParams) {
        $filter('isPath')('festival518');
        $('body').scrollTop(0);
        $rootScope.title = '沪深理财-网贷投资，国企控股平台';
        if($stateParams.wap){
            $scope.wap = $stateParams.wap;
            var user = $filter('isRegister')();
            if(user.register==true){
                $scope.isLog = true;
                resourceService.queryPost($scope, $filter('getUrl')('518理财节'), {uid: user.user.member.uid}, { name: '518理财节' });
            }
            else{
                $scope.isLog = false;
                resourceService.queryPost($scope, $filter('getUrl')('518理财节'), {}, { name: '518理财节' });
            }
        }
        else{
            if($stateParams.uid){
                $scope.isLog = true;
                resourceService.queryPost($scope, $filter('getUrl')('518理财节'), {uid: $stateParams.uid}, { name: '518理财节' });
            }
            else{
                $scope.isLog = false;
                resourceService.queryPost($scope, $filter('getUrl')('518理财节'), {}, { name: '518理财节' });
            }
        }
        resourceService.queryPost($scope, $filter('getUrl')('518产品详情'), {}, { name: '518产品详情' });
        var $dataTable = $('.data-table');
        var trHeight = $('.data-list').height();
        $scope.$on('resourceService.QUERY_POST_MYEVENT', function (event, data, type) {
            switch (type.name) {
                case '518理财节':
                    if (data.success) {
                        $scope.amount = data.map.amount;
                        $scope.count = data.map.count;
                        $scope.investList = data.map.activList;
                        if ($scope.investList.length > 1) {
                            setInterval(function() {
                                $dataTable.animate({'margin-top': '-'+trHeight+'px'},600,function() {
                                    $dataTable.find('tr').eq(0).appendTo($dataTable);
                                    $dataTable.css('margin-top',0);
                                });
                            }, 2500);
                        }
                    }
                    break;
                case '518产品详情':
                    if (data.success) {
                        for(var i=0;i<data.map.list.length;i++){
                            if(data.map.list[i].deadline==60){
                                $scope.detaila = data.map.list[i];
                            }
                            else if(data.map.list[i].deadline==180){
                                $scope.detailb = data.map.list[i];
                            }
                        }
                    }
                    break;
            };
        });
    })
})