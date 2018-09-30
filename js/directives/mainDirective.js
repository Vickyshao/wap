/* 
* @Author: lee
* @Date:   2016-01-11 00:00:31
* @Last Modified by:   anchen
* @Last Modified time: 2016-01-11 00:00:36
*/

'use strict';
var loginModule = angular.module("loginModule", ['ngStorage']);

// 提现金额小于余额
loginModule.directive('withdrawlimit', function() {
    return {
        restrict: "A",
        require: 'ngModel',
        link: function(scope, elem, attrs, ngModelController) {

        	ngModelController.$parsers.unshift(function(viewVal) {
        		if (scope.user.funds <= 100000) {
	        		if (viewVal == '') {
	        			ngModelController.$setValidity("withdrawlimit", true);
	                	return viewVal;
	        		}
	        		if(viewVal <= scope.user.funds){
	                	ngModelController.$setValidity("withdrawlimit", true);
	                	return viewVal;
	                }
	                else{
	                	ngModelController.$setValidity("withdrawlimit", false);
	                	return undefined;
	        		}
        		} else {
        			ngModelController.$setValidity("withdrawlimit", true);
	                return viewVal;
        		}
        	});
        }
    };
});

// 提现金额单笔最高限额
loginModule.directive('maxlimit', function() {
    return {
        restrict: "A",
        require: 'ngModel',
        link: function(scope, elem, attrs, ngModelController) {

        	ngModelController.$parsers.unshift(function(viewVal) {
        		if (scope.user.funds > 500000) {
	        		if (viewVal == '' || scope.cashForm.cash.$error.withdrawlimit) {
	        			ngModelController.$setValidity("maxlimit", true);
	                	return viewVal;
	        		}
	        		if(viewVal <= 500000){
	                	ngModelController.$setValidity("maxlimit", true);
	                	return viewVal;
	                }
	                else{
	                	ngModelController.$setValidity("maxlimit", false);
	                	return undefined;
	        		}
	        	} else {
	        		ngModelController.$setValidity("maxlimit", true);
	                return viewVal;
	        	}
        	});
        }
    };
});

