define(['js/module.js'], function (controllers) {
    controllers.controller('tjswishController', function ($scope, $rootScope, $filter, $state, resourceService, $stateParams, $window, ngDialog) {
        $rootScope.title = '礼品心愿';
        if($stateParams.wap){
            $scope.wap = $stateParams.wap;
            $scope.userOBJ = $filter('isRegister')();
            if ($scope.userOBJ.register) {
                $scope.uid = $scope.userOBJ.user.member.uid;
            } else {
                $state.go('dl', { returnurl: 'tjswish' });
                return;
            };
        }
        else{
            if($stateParams.uid){
                $scope.uid = $stateParams.uid;
            }
            else{
                $window.location.href = 'jsmp://page=4?';
            }
        }
        function isUrl(str){
            return !!str.match(/(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/g);
        }
        $scope.submitWish = function () {
            if($scope.url){
                if(isUrl($scope.url)==true){
                    resourceService.queryPost($scope, $filter('getUrl')('tjs许愿'), {
                        uid: $scope.uid,
                        url: $scope.url,
                        remarks: $scope.remarks
                    }, '投即送许愿');
                }
                else{
                    $rootScope.errorText = '请填写有效链接';
                    $rootScope.maskError = true;
                }
            }
            else{
                $rootScope.errorText = '请填写商品链接';
                $rootScope.maskError = true;
            }
        }
        $scope.$on('resourceService.QUERY_POST_MYEVENT', function (event, data, type) {
            switch (type) {
                case '投即送许愿':
                    if (data.success==true) {
                        ngDialog.open({
                            template: '<p class="error-msg">提交成功</p>',
                            showClose: false,
                            closeByDocument: true,
                            plain: true
                        });
                    } 
                    else if(data.errorCode=='1004' || data.errorCode=='1001' || data.errorCode=='1002' || data.errorCode=='1003') {
                        $rootScope.errorText = data.errorMsg;
                        $rootScope.maskError = true;
                    }
                    break;
            }
        })
        $scope.toback = function() {
            $filter('跳回上一页')();
        };
    })
})
