/**
 * Created by Eva on 2017/10/23.
 */
define(['jweixin', 'js/module.js', 'jquery', 'ngdialog', 'SHR256'], function (wx, controllers, $, ngdialog, SHR256, weixin) {
    controllers.controller('floatMenuCtrl', ['$scope', '$rootScope', 'resourceService', '$filter', '$state', 'ngDialog', '$location', 'md5', '$localStorage', '$stateParams', function ($scope, $rootScope, resourceService, $filter, $state, ngDialog, $location, md5, $localStorage, $stateParams) {
        $scope.open = function () {
            ngDialog.open({
                className: 'eCommerceDialog',
                template: ' <div class="activity-rule"><div class="ngdialog-close"></div><div class="block"><h2>活动规则</h2> ' +
                '<p>1. 活动时间：自2017年11月2日起；<br>2.用户注册时需填写电商专属码，方可参与本活动，每位用户仅可报销一次；<br>3.用户注册绑卡后，将获得首笔报销返现，分期报销返现将根据您所需报销金额投资相应额度的7天专属标，成功投资后奖励将发放至您的注册账户中；<br>* 本活动最终解释权归沪深理财所有，如有疑问请咨询客服：400-031-9909。</p></div></div>',
                showClose: false,
                closeByDocument: true,
                plain: true
            });
        }

    }])
})