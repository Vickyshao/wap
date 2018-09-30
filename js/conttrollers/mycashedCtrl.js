define([
    'js/module.js',
    'jquery'
], function(controllers) {
    controllers.controller('mycashedCtrl', ['$scope', '$rootScope', '$filter', '$state', 'resourceService', '$localStorage', function($scope, $rootScope, $filter, $state, resourceService, $localStorage) {
        $rootScope.title = "回款记录";
        $scope.cashedId = $state.params.cashedId;
        $scope.userOBJ = $filter('isRegister')();
        $scope.toback = function() {
            $filter('跳回上一页')();
        };
        function DX(n) {
            var str2 = "";
            n += "";
            if (n && n.length > 0) {
                var str = n.replace(/0/g, '零').replace(/1/g, '一').replace(/2/g, '二').replace(/3/g, '三').replace(/4/g, '四').replace(/5/g, '五').replace(/6/g, '六').replace(/7/g, '七').replace(/8/g, '八').replace(/9/g, '九');
                str=str.split("").reverse().join("");
                for (var i = n.length-1; i >=0; i--) {
                    switch (i) {
                        case 0:
                            str2 += str.charAt(i);
                            break;
                        case 1:
                            if (str.charAt(i) != "一") { str2 += str.charAt(i); }
                            str2 += "十";
                            break;
                        case 2:
                            str2 += str.charAt(i)+"百";
                            break;
                        case 3:
                            str2 += str.charAt(i)+"千";
                            break;
                        case 4:
                            str2 += str.charAt(i)+"万";
                            break;
                    }
                }
            }
            return str2;
        }
        resourceService.queryPost($scope, $filter('getUrl')('回款记录'), { id: $scope.cashedId, uid: $scope.userOBJ.user.member.uid }, { name: '回款记录' });
        $scope.$on('resourceService.QUERY_POST_MYEVENT', function(event, data, type) {
            switch (type.name) {
                case '回款记录':
                    if (data.success) {
                        $scope.cashedData = data.map
                        // for (var i = 0; i < $scope.cashedData.result.length; i++) {
                        //     var str =DX($scope.cashedData.result[i].index) + "期本金";
                        //     if ($scope.cashedData.result[i].residualPrincipal&&parseInt($scope.cashedData.result[i].residualPrincipal) <= 0) {
                        //         str +="+收益";
                        //     }
                        //     $scope.cashedData.result[i].str = str;
                        // }
                    } else {
                        $filter('服务器信息')(data.errorCode, $scope, 'y');
                    }
                    break;
            }
        });
    }]);
})
