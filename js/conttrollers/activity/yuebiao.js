
define([
    'js/module.js'
]
    , function (controllers) {
        controllers.controller('yuebiaoCtrl'
            , ['$scope'
                , '$filter'
                , '$state'
                , "$stateParams"
                , 'resourceService'
                , function ($scope, $filter, $state, $stateParams, resourceService) {
                    $scope.name = $stateParams.name;
                    $scope.prid = $stateParams.prid;
                    var user = $filter('isRegister')().user;
                    if (!user || !user.member || !user.member.uid) {
                        $state.go('dl');
                    }
                    $scope.yuebiaoFn = function () {
                        if (!$scope.amount || $scope.amount % 1200 != 0 || $scope.amount <= 0 || $scope.amount > 1000000) {
                            alert("请输入正确的预约金额！");
                        } else {
                            resourceService.queryPost($scope, $filter('getUrl')('getReservation'), {
                                prid: $scope.prid,
                                uid: user.member.uid,
                                amount: $scope.amount
                            }, { name: 'getReservation' });
                        }

                    };
                    $scope.gohistory = function () {
                        if ($stateParams.toState == "main.home") {
                            $state.go($stateParams.toState);
                        } else if ($stateParams.toState == "cpDetail") {
                            $state.go($stateParams.toState, { pid: $stateParams.pid, wap: true });
                        } else if ($stateParams.toState == "special") {
                            $state.go($stateParams.toState, { upgrade: 0, wap: true });
                        }
                    };
                    $scope.closeOver = function () {
                        $scope.isOver = false;
                    };
                    $scope.$on('resourceService.QUERY_POST_MYEVENT', function (event, data, eObj) {
                        switch (eObj.name) {
                            case 'getReservation':
                                if (data.success) {
                                    $scope.isSuccess = true;
                                } else {
                                    if (data.errorCode == "1003") {
                                        $scope.isOver = true;
                                    }
                                }
                                break;
                        };
                    });
                }
            ]);
    })