/*
* @Author: lee
* @Date:   2016-01-10 23:29:04
* @Last Modified by:   anchen
* @Last Modified time: 2016-01-12 21:49:52
*/

'use strict';

define([
        'js/module.js'
        , 'ngdialog'
    ]
    , function (controllers, ngdialog) {

        controllers.controller('findCtrl'
            , ['$scope', '$rootScope'
                , 'resourceService'
                , '$filter'
                , '$state'
                , 'md5'
                , '$localStorage'
                , '$stateParams'
                , '$location'
                , function ($scope, $rootScope, resourceService, $filter, $state, md5, $localStorage, $stateParams) {
                    $rootScope.title = '发现';
                    $filter('isPath')('main.find');
                    $scope.isCircle = true;
                    $(".dial-phone-ngdialog").remove();
                    document.getElementsByTagName('html')[0].scrollTop = 0;
                    document.getElementsByTagName('body')[0].scrollTop = 0;
                    $scope.$on('resourceService.QUERY_POST_MYEVENT', function (event, data, type) {
                        switch (type.name) {
                            case 'login':
                                if (data.success) {
                                    $localStorage.user = data.map;
                                    $scope.isDs = data.map.isDs;
                                    $localStorage.hongbaoeveryday = 1;
                                    // if ($localStorage.specialLogin == true) {
                                    //     // $rootScope.$emit('loginSuccess',true);
                                    //     $state.go('special',{wap:true});
                                    // } else {
                                    if ($state.params.returnurl) {
                                        if ($state.params.returnurl.indexOf('?') != -1) {
                                            var router = $state.params.returnurl.split('?')[0];
                                            var params = $state.params.returnurl.split('?')[1];
                                            var obj = {};
                                            var array = params.split("&");
                                            if (array.length > 1) {
                                                for (var i = 0; i < array.length; i++) {
                                                    obj[array[i].split("=")[0]] = array[i].split("=")[1];
                                                }
                                            } else {
                                                obj[array[0].split("=")[0]] = array[0].split("=")[1];
                                            }
                                            obj.wap = true;
                                            $state.go(router, obj);
                                        } else {
                                            $state.go($state.params.returnurl, { wap: true });
                                        }
                                    } else {
                                        if($rootScope.getUrlParam('eCommerce') == 'true') {
                                            if($scope.isDs) {
                                                $state.go("reimburse");
                                            } else {
                                                $state.go("main.myaccountHome");
                                            }
                                        } else if($stateParams.source == 'egg') {
                                            $state.go("dropEgg",{ source: 'egg'});
                                        } else {
                                            $state.go("main.myaccountHome");
                                        }
                                    }
                                    // }
                                } else {
                                    $filter('登陆错误信息')(data.errorCode, $scope, 'y')

                                    $scope.userLogin.mobilephone = null;
                                    $scope.userLogin.passWord = null;
                                }
                                var userObj = {};
                                userObj.uid = data.map.member.uid;
                                if ($scope.user) { obj.uid = $scope.user.uid; }
                                resourceService.queryPost($scope, $filter('getUrl')('shouYe'), userObj, { name: 'index' });
                                break;
                            case 'index':
                                if (data.success) {
                                    $localStorage.yuandanIsAlert = data.map.isAlter;
                                }
                                break;
                        };
                    });
                }
            ]);
    });