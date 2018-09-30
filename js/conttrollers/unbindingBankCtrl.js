define(['jweixin', 'js/module.js', 'jquery', 'ngdialog', 'SHR256'], function (wx, controllers, $, ngdialog, SHR256, weixin) {
    controllers.controller('unbindingBankCtrl', ['$scope', '$rootScope', 'resourceService', '$filter', '$state', 'ngDialog', '$location', 'md5', '$localStorage', '$stateParams', 'isWeixin','$http', function ($scope, $rootScope, resourceService, $filter, $state, ngDialog, $location, md5, $localStorage, $stateParams, isWeixin,$http) {
        $("html,body").scrollTop(0);
        $filter('isPath')('unbindingBank');
        $rootScope.title = '解绑银行卡';
        $scope.isLogin = $filter('isRegister')().register;
        $scope.user = $filter('isRegister')().user;
        // $scope.unbindingFrom = {};
        if (!$scope.isLogin) {
            $state.go('dl')
        }
        $scope.toback = function() {
            $filter('跳回上一页')(2);
        };

        $scope.enlarge = function (ev,num) {
            $scope.showLarge = true;
            $(".enlarge-wrap").height($("html,body").height() - $(".common-head").height());
            // $(".enlarge-wrap img").attr("src",ev.currentTarget.currentSrc).width($(".enlarge-wrap").height()).height($(".enlarge-wrap").width());
            var canvas = document.getElementById('canvas');
            var ctx1 = canvas.getContext('2d');
            var image1 = new Image();
            image1.onload = function () {
                var xpos = canvas.width / 2;
                var ypos = canvas.height / 2;
                //原图
                ctx1.drawImage(image1, xpos - image1.width / 2, ypos - image1.height / 2);
                ctx1.save();
                //旋转图
                ctx1.translate(xpos, ypos);
                ctx1.rotate(1 * Math.PI / 180);//旋转90度
                ctx1.translate(-xpos, -ypos);
                ctx1.drawImage(image1, xpos - image1.width / 2, ypos - image1.height / 2);
                ctx1.restore();
            }
            image1.src = ev.currentTarget.currentSrc;
        }
        $scope.narrow = function () {
            $scope.showLarge = false;
            $(".enlarge-wrap img").attr("src",'');
        }
        // $scope.success = function () {
        //     $filter('解绑卡成功弹窗')($scope);
        // }







        var form = document.getElementById("addSysBannerForm");
        var data = new FormData();      //以下为像后台提交图片数据
        $scope.reader = new FileReader();   //创建一个FileReader接口

        // formData.set(name, value);
        $scope.img_upload = function(ele, num) {       //单次提交图片的函数
            $scope.reader.readAsDataURL(ele.files[0]);  //FileReader的方法，把图片转成base64

            $scope.reader.onload = function (ev) {
                $scope.$apply(function(){
                    $(".input-img").eq(num-1).attr("src",ev.target.result);
                    $scope.showImgFun(num,true);
                    // if (num == 1) {
                    //     // $scope.userImgInfo.idCardFrontImage = ev.target.result;
                    //     // data.set('idCardFrontImage', ele.files[0]);
                    // } else if (num == 2) {
                    //     // $scope.userImgInfo.idCardBehindImage = ev.target.result;
                    //     // data.append('idCardBehindImage', ele.files[0]);
                    // } else if (num == 3) {
                    //     // $scope.userImgInfo.bankCardFrontImage = ev.target.result;
                    //     // data.append('bankCardFrontImage', ele.files[0]);
                    // } else if (num == 4) {
                    //     // $scope.userImgInfo.bankCardBehindImage = ev.target.result;
                    //     // data.append('bankCardBehindImage', ele.files[0]);
                    // } else if (num == 5) {
                    //     // $scope.userImgInfo.lostImage = ev.target.result;
                    //     // data.append('lostImage', ele.files[0]);
                    // } else if (num == 6) {
                    //     // $scope.userImgInfo.otherImage = ev.target.result;
                    //     // data.append('otherImage', ele.files[0]);
                    // }
                });
            }
        };

        $scope.img_del = function(key) {    //删除，删除的时候thumb和form里面的图片数据都要删除，避免提交不必要的
            $scope.showImgFun(key,false)
        };
        $scope.showImgFun = function (num,flag) {
            if (!flag) {
                $(".input").eq(num-1).val("");
            }
            switch (num) {
                case 1:
                    $scope.showInputImg1 = flag;
                    // if (flag) {
                    //     $scope.showInputImg1 = true;
                    // } else {
                    //     $scope.showInputImg1 = false;
                    // }
                    break;
                case 2:
                    $scope.showInputImg2 = flag;
                    // if (flag) {
                    //     $scope.showInputImg2 = true;
                    // } else {
                    //     $scope.showInputImg2 = false;
                    // }
                    break;
                case 3:
                    $scope.showInputImg3 = flag;
                    // if (flag) {
                    //     $scope.showInputImg3 = true;
                    // } else {
                    //     $scope.showInputImg3 = false;
                    // }
                    break;
                case 4:
                    $scope.showInputImg4 = flag;
                    // if (flag) {
                    //     $scope.showInputImg4 = true;
                    // } else {
                    //     $scope.showInputImg4 = false;
                    // }
                    break;
                case 5:
                    $scope.showInputImg5 = flag;
                    // if (flag) {
                    //     $scope.showInputImg5 = true;
                    // } else {
                    //     $scope.showInputImg5 = false;
                    // }
                    break;
                case 6:
                    $scope.showInputImg6 = flag;
                    // if (flag) {
                    //     $scope.showInputImg6 = true;
                    // } else {
                    //     $scope.showInputImg6 = false;
                    // }
                    break;
            }
            if ($scope.showInputImg1 && $scope.showInputImg2 && $scope.showInputImg3 && $scope.showInputImg4 && $scope.showInputImg5) {
                $scope.submitBtn = true;
            } else {
                $scope.submitBtn = false;
            }
        }
        $scope.submit = function () {
            if ($scope.isLogin) {
                if ($scope.showInputImg1 && $scope.showInputImg2 && $scope.showInputImg3 && $scope.showInputImg4 && $scope.showInputImg5) {
                    var form1 = document.getElementById("addSysBannerForm");
                    var data1 = new FormData(form1);      //以下为像后台提交图片数据
                    data1.append('uid', $scope.user.member.uid);
                    data1.append('token', $scope.user.token);
                    $rootScope.maskHidde = true;
                    $.ajax({
                        method:'POST',
                        url: $filter('getUrl')('申请解绑卡'),
                        data: data1,
                        headers: {'Content-Type':undefined},
                        processData: false,
                        contentType: false,
                        transformRequest: angular.identity,
                        success: function (data){
                            $rootScope.maskHidde = false;
                            if (data.success) {
                                $filter('解绑卡成功弹窗')($scope);
                            } else {
                                $filter('解绑卡错误信息')(data.errorCode);
                            }
                        }
                    })

                } else {
                    // console.log('qingshuru ')
                }
            }
        }
    }])
})