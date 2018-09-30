define(["angular","app","jquery"
       ],function(angular){
    return angular.module("webapp")
    .directive("ngTouchstart", ['$parse', function($parse, $rootScope) {
        return {
            restrict: "A",
            compile: function($element, attr) {
                var fn = $parse(attr.ngTouchstart, null, true);
                return function ngEventHandler(scope, element) {
                    element[0].addEventListener('touchstart', function(event) {
                        var callback = function() {
                            fn(scope, { $event: event });
                        };
                        scope.$apply(callback);
                    });
                };
            }
        }
    }])
    .directive("ngTouchmove",['$parse', function($parse, $rootScope) {
        return {
            restrict: "A",
            compile: function($element, attr) {
                var fn = $parse(attr.ngTouchmove, null, true);
                return function ngEventHandler(scope, element) {
                    element[0].addEventListener('touchmove', function(event) {
                        var callback = function() {
                            fn(scope, { $event: event });
                        };
                        scope.$apply(callback);
                    });
                };
            }
        }
    }])
    .directive("ngTouchend",['$parse', function($parse, $rootScope) {
        return {
            restrict: "A",
            compile: function($element, attr) {
                var fn = $parse(attr.ngTouchend, null, true);
                return function ngEventHandler(scope, element) {
                    element[0].addEventListener('touchend', function(event) {
                        var callback = function() {
                            fn(scope, { $event: event });
                        };
                        scope.$apply(callback);
                    });
                };
            }
        }
    }])
    .directive("ngTouchcancel",['$parse', function($parse, $rootScope) {
        return {
            restrict: "A",
            compile: function($element, attr) {
                var fn = $parse(attr.ngTouchcancel, null, true);
                return function ngEventHandler(scope, element) {
                    element[0].addEventListener('touchcancel', function(event) {
                        var callback = function() {
                            fn(scope, { $event: event });
                        };
                        scope.$apply(callback);
                    });
                };
            }
        }
    }])
})
