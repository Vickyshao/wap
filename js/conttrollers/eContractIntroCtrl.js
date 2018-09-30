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

        controllers.controller('eContractIntroCtrl'
            , ['$scope', '$rootScope'
                , 'resourceService'
                , '$filter'
                , '$state'
                , 'md5'
                , '$localStorage'
                , '$stateParams'
                , '$location'
                , function ($scope, $rootScope, resourceService, $filter, $state, md5, $localStorage, $stateParams) {
                    $rootScope.title = '电子合同签章';
                    $filter('isPath')('eContractIntroduce');
                    if($rootScope.fromNative) {
                        $('.eContractIntroduce-wrap').removeClass('headerTop');
                    }
                    $scope.toback = function () {
                        $filter('跳回上一页')(2);
                    };
                    $("html,body").scrollTop(0);
                    $scope.banner = [
                        {
                            imgUrl: '/images/eContractIntro/img3.png'
                        },
                        {
                            imgUrl: '/images/eContractIntro/img4.png'
                        },
                        {
                            imgUrl: '/images/eContractIntro/img5.png'
                        },
                        {
                            imgUrl: '/images/eContractIntro/img6.png'
                        }
                    ];
                }
            ]);
    });