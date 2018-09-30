define(['js/module.js', 'jquery'], function (controllers, $) {
    controllers.controller('newhandregController', ['$scope', 'resourceService', '$filter', '$location', '$localStorage', '$rootScope', '$state', '$anchorScroll', '$window', function ($scope, resourceService, $filter, $location, $localStorage, $rootScope, $state, $anchorScroll, $window) {
        if ($location.$$search.toFrom != undefined || $location.$$search.recommCode != undefined || $location.$$search.tid != undefined) {
            $localStorage.webFormPath = $location.$$search;
        };
        $('body').scrollTop(0);
        $scope.wap = $location.$$search.wap ? $location.$$search.wap : null;
        resourceService.queryPost($scope, $filter('getUrl')('新手标推广页排行榜'), {}, { name: '新手标推广页排行榜' });
        $scope.$on('resourceService.QUERY_POST_MYEVENT', function (event, data, type) {
            switch (type.name) {
                case '注册验证手机号':
                    if (data.success) {
                        if (data.map.exists) { //已有用户名
                            $rootScope.errorText = '此手机已注册';
                            $rootScope.maskError = true;
                        } else {
                            if ($scope.wap) {
                                $state.go('newRegister', { phone: $scope.mobilephone, from: 'newhandreg' });
                            }
                            else {
                                $window.location.href = 'jsmp://page=102?phone=' + $scope.mobilephone;
                            }
                        };
                    }
                    break;
                case '新手标推广页排行榜':
                    if (data.success) {
                        $scope.noviceList = data.map.noviceList;
                        $scope.noviceCount = data.map.noviceCount;
                    }
                    break;
            }
        });
        $scope.click = function (tegForm) {
            if (!tegForm.mobilephone.$error.required && !tegForm.mobilephone.$error.minlength && !tegForm.mobilephone.$error.pattern) {
                resourceService.queryPost($scope, $filter('getUrl')('getPhone'), {
                    mobilephone: $scope.mobilephone
                }, { name: '注册验证手机号', tegForm: tegForm });
            }
            else {
                $rootScope.errorText = '请填写有效手机号码';
                $rootScope.maskError = true;
            }
        };
        $scope.gotop = function () {
            $("html,body").animate({ scrollTop: $(".newhandreg").offset().top });
        };
        var widtha = $('.rulea').width();
        var widthb = $('.rulea').find('div').find('p:nth-of-type(1)').width();
        $('.rulea').find('div').find('p:nth-of-type(2)').css('width',(widtha-widthb)+'px');
        // var swiper = new Swiper('.swiper-container', {
        //     paginationClickable: true,
        //     autoplay: 3000,
        //     spaceBetween: 0,
        //     loop: true,
        //     autoplayDisableOnInteraction: false,
        //     pagination : '.swiper-pagination',
        // });
    }])
        .directive("repeatFinish", function () {
            return {
                link: function (scope, element, attr) {
                    if (scope.$last == true) {
                        scope.$eval(attr.repeatFinish);
                    }
                }
            }
        })
        .directive('newhandscrollLeft', function () {
            var temp = '<li repeat-finish="finish()" ng-repeat="item in noviceList">' +
                '<p>{{item.mobilephone}} 投资了{{item.amount}}元</p>' +
                '</li>'
            return {
                restrict: 'A',
                template: temp,
                scope: true,
                link: function ($scope, element, attrs) {
                    var a = 1;
                    $scope.finish = function () {
                        if (a == 1) {
                            a++;
                            $(element).find('li').each(function (i) {
                                var width = parseFloat($(this).css('width'));
                                $(this).css({
                                    position:'absolute',
                                    left: i * width + 'px'
                                })
                                var that = this;
                                setInterval(function () {
                                    var left = parseFloat($(that).css('left'));
                                    if (left < (width * (-1))) {
                                        $(that).css({ left: ($scope.noviceList.length - 1) * width + 'px' });
                                    }
                                    var left = parseFloat($(that).css('left'));
                                    $(that).css({
                                        left: (left - 1.5) + 'px'
                                    })
                                }, 17)
                            })
                        }
                    }
                }
            }
        });
})