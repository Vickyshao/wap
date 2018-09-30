define(['js/module.js'], function (controllers) {
    controllers.controller('appGetcashCtrl', function ($scope, $filter, $state, $rootScope, resourceService, ngDialog, postcallService,$stateParams) {
        $scope.userForm = {};
        $scope.cash = {};
        $scope.cash.amount = '';
        $scope.userForm.uid = $stateParams.uid;
        $scope.userForm.token = $stateParams.token;
        $scope.userForm.channel = $stateParams.channel;
        $scope.userForm.version = $stateParams.version;
        resourceService.queryPost($scope, $filter('getUrl')('提现'), $scope.userForm, '提现');
        // 提交表单
        $scope.submitForm = function (valid) {
            if (!valid) {
                return;
            }
            if($scope.cashForm.cash.$error.required){
                $filter('提现错误信息')('required',$scope);
            }
            else if($scope.cash.amount<1 && $scope.cash.isChargeFlag==0){
                $filter('提现错误信息')('morethan',$scope);
            }
            else if($scope.cash.amount<3 && $scope.cash.isChargeFlag!=0){
                $filter('提现错误信息')('morethan3',$scope);
            }
            else if($scope.cash.amount>$scope.cash.funds && $scope.cash.funds<=500000){
                $filter('提现错误信息')('withdrawlimit',$scope);
            }
            else if($scope.cash.amount>500000){
                $filter('提现错误信息')('maxlimit',$scope);
            }
            else{
                $scope.userForm.amount = $scope.cash.amount;
                $scope.userForm.isChargeFlag = $scope.cash.isChargeFlag;
                resourceService.queryPost($scope, $filter('getUrl')('存管提现'), $scope.userForm, '存管提现');
            }
        };
        $scope.$on('resourceService.QUERY_POST_MYEVENT', function (event, data, type) {
            switch (type) {
                case '提现':
                    if (data.success) {
                        $scope.cash = data.map;
                        $scope.cash.funds = data.map.fuiou_balance;
                        $scope.userForm.isChargeFlag= $scope.cash.isChargeFlag;
                        if (data.map.isChargeFlag) {
                            $scope.cash.cost = 2;
                        } else {
                            $scope.cash.cost = 0;
                        }
                    } else {
                        $filter('服务器信息')(data.errorCode, $scope, 'y')
                    }
                    break;
                case '存管提现':
                    if (data.success) {
                        postcallService(data.map.fuiouUrl, data.map.signature);
                    } else {
                        $filter('提现申请错误信息')(data.errorCode,$scope,'y');
                    }
                    break;
            };
        });

        $scope.getAllFlag = false;
        var $circlebtn = $('.circlebtn'),
            $circlei = $('i', $circlebtn),
            circleLeft = $circlebtn.width() - $circlei.width();
        $scope.setAll = function () {
            if ($scope.getAllFlag == false) {
                $scope.cash.amount = $filter('isNumber2')($scope.cash.funds,undefined,1);
                $circlei.animate({ left: circleLeft }, 300, function () {
                    $scope.getAllFlag = true;
                    $circlebtn.css({ 'background': '#ed3334', 'border-color': '#ed3334' });
                    $circlei.css({ 'border-color': '#ed3334' });
                    $circlei.css({ left: 'auto', right: '-1px' });
                });
            } else if ($scope.getAllFlag == true) {
                $scope.cash.amount = '';
                $circlebtn.css({ 'background': '#d2d2d2', 'border-color': '#d2d2d2' });
                $circlei.css({ 'border-color': '#d2d2d2', 'left': circleLeft, 'right': 'auto' });
                $circlei.animate({ left: '-1px' }, 300, function () {
                    $scope.getAllFlag = false;
                    $circlei.css({ left: '-1px', right: 'auto' });
                });
            }
        };

        // onblur将金额保留两位小数
        $scope.setAmount = function (event) {
            // if ($scope.cashForm.cash.$error.pattern) {
            //     $filter('提现错误信息')('pattern', $scope);
            // } else if ($scope.cashForm.cash.$error.morethan3) {
            //     $filter('提现错误信息')('morethan3', $scope);
            // } else if ($scope.cashForm.cash.$error.morethan) {
            //     $filter('提现错误信息')('morethan', $scope);
            // } else if ($scope.cashForm.cash.$error.withdrawlimit) {
            //     $filter('提现错误信息')('withdrawlimit', $scope);
            // } else if ($scope.cashForm.cash.$error.maxlimit) {
            //     $filter('提现错误信息')('maxlimit', $scope);
            // } else if ($scope.cashForm.cash.$error.required) {
            //     $filter('提现错误信息')('required', $scope);
            // }
            if($scope.getAllFlag==true && $scope.cash.amount<$scope.cash.funds){
                $circlebtn.css({'background':'#d2d2d2','border-color': '#d2d2d2'});
                $circlei.css({'border-color': '#d2d2d2','left':circleLeft,'right': 'auto'});
                $circlei.animate({left:'-1px'},200,function() {
                    $scope.getAllFlag = false;
                    $circlei.css({left: '-1px',right: 'auto'});
                });
            }
            $scope.cash.amount = $filter('isNumber2')($scope.cash.amount, undefined, 1);
        };
        $scope.onClick = function () {
            ngDialog.closeAll();
        };
    });
})