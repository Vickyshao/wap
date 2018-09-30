/* 
* @Author: anchen
* @Date:   2016-01-12 20:39:33
* @Last Modified by:   Ellie
* @Last Modified time: 2018-04-04 13:41:33
*/

'use strict';
define(['app'], function (app) {

    app
        /*当前登录状态*/
        .filter('isRegister', function ($localStorage, $filter, $state) {

            return function (certification) {
                var obj = {};
                obj.register = false;
                obj.user = {};
                if ($localStorage.user != undefined) {
                    obj.register = true;
                    if (certification != undefined) { $localStorage.user.certification = certification; };
                    if ($localStorage.user.certification == undefined) {
                        $localStorage.user.userName = '亲爱的用户';
                    } else {
                        $localStorage.user.userName = $localStorage.user.realName;
                    }
                    obj.user = $localStorage.user;
                } else {
                    obj.register = false;
                    obj.user.userName = '亲爱的用户';
                }
                return obj;
            }
        })
        /*浏览记录*/
        .filter('isPath', function ($localStorage, $filter, $state) {
            return function (url) {
                $localStorage.pathUrl.push(url);
            }
        })
        /*跳回上一页*/
        .filter('跳回上一页', function ($localStorage, $state) {
            return function (number) {
                var num = 1;
                if (number != undefined) {
                    num = number;
                };
                if ($localStorage.pathUrl != undefined) {
                    if ($localStorage.pathUrl.length > 0) {
                        if ($localStorage.pathUrl[$localStorage.pathUrl.length - num] == undefined) {
                            delete $localStorage.userForm;
                            $state.go('main.home');
                        }
                        else if ($localStorage.cp != undefined) {
                            // else{
                            if ($localStorage.active != undefined) {
                                $state.go($localStorage.pathUrl[$localStorage.pathUrl.length - num], { pid: $localStorage.cp.info.id, wap: true, active: $localStorage.active });
                            }
                            else {
                                $state.go($localStorage.pathUrl[$localStorage.pathUrl.length - num], { pid: $localStorage.cp.info.id, wap: true });
                            }
                            // }
                        }
                        else {
                            if ($localStorage.active != undefined) {
                                $state.go($localStorage.pathUrl[$localStorage.pathUrl.length - num], { wap: true, active: $localStorage.active });
                            }
                            else {
                                $state.go($localStorage.pathUrl[$localStorage.pathUrl.length - num], { wap: true });
                            }
                            // $state.go($localStorage.pathUrl[$localStorage.pathUrl.length - num],{wap:true});
                        }
                        for (var i = 0; i < num; i++) {
                            $localStorage.pathUrl.pop();
                        }
                    } else {
                        delete $localStorage.userForm;
                        $state.go('main.home');
                    }
                } else {
                    delete $localStorage.userForm;
                    $state.go('main.home');
                    $localStorage.pathUrl = [];
                }
            }
        })
        /*清空缓存*/
        .filter('清空缓存', function ($localStorage,$rootScope) {
            return function (scope) {
                $localStorage.pathUrl = [];
                delete $localStorage.user;
                delete $localStorage.newHand;
                delete $localStorage.drAward;
                delete $localStorage.drAwardMemberLog;
                $rootScope.exclusiveUser = false;
                $rootScope.enfuUser = false;
            }
        })
        /*显示密码*/
        .filter('isShowPw', function () {
            return function (bool) {
                var classPw = {};
                if (bool) { classPw.type = 'text'; } else { classPw.type = 'passWord'; };
                return classPw;
            }
        })
        /*性别*/
        .filter('sex', function () {
            return function (type) {
                var x = {};
                if (type == 1) { x = '先生'; } else { x = '女士'; };
                return x;
            }
        })
        /*倒计时*/
        .filter('60秒倒计时', function ($timeout) {
            return function (scope, timeNum) {
                scope.nowTimer = timeNum + '秒';
                var timer;
                var isError = false;
                var nowTimer = timeNum;
                if (scope.isSubMin) {
                    setTimerOut();
                }
                function setTimerOut() {
                    // scope.isSubMin=false;
                    timer = $timeout(
                        function () {
                            if (nowTimer <= 0) {
                                if (isError) {
                                    scope.nowTimer = '重新获取';
                                } else {
                                    scope.nowTimer = '重新获取';
                                }
                                scope.disabledPhoneBtn = false;
                                scope.isSubMin = true;
                                // if (scope.changeIMG != undefined) {
                                //     scope.changeIMG();
                                // };

                            } else {
                                scope.isSubMin = false;
                                nowTimer -= 1;
                                scope.nowTimer = nowTimer + '秒 ';
                                setTimerOut();
                            }
                        },
                        1000
                    );
                };
                scope.stop = function () {
                    nowTimer = 0;
                    isError = true;
                    if(timer){
                        timer = null;
                    }
                };
            }
        })

        /*错误信息----------------------------------------------*/
        // 电商码提示
        .filter('ecCodeError', function ($rootScope,ngDialog) {//手机
            return function (name) {
                var error = {
                    1001: "电商码不存在",
                    1002: "电商码已使用",
                    1003: "电商码已过期"
                };
                ngDialog.open({
                    template: '<p class="error-msg">' + error[name]+ '</p>',
                    showClose: false,
                    closeByDocument: false,
                    plain: true
                });
                setTimeout(function () {
                    ngDialog.closeAll();
                }, 1500);
            }
        })

        .filter('zuceError', function ($rootScope,ngDialog) {//手机
            return function (name) {
                var error = {
                    1001: "手机号不能为空",
                    1002: "手机号错误",
                    1003: "手机号已注册",
                    1004: "图片验证码不能为空",
                    1005: "图片验证码错误",
                    1006: "短信验证码不能为空",
                    1007: "短信验证码错误",
                    1008: "推荐人不存在",
                    1009: "未勾选注册协议",
                    1010: "密码不能为空",
                    1011: "密码格式6-16位字母数字混合",
                    1012: "请重新输入图形码",
                    1013: "验证码发送成功",
                    1014: "注册成功",
                    1015: "图片验证码长度错误",
                    1016: "电商码为必填项",
                    1017: "请检查你的电商码",
                    1018: "电商码已使用",
                    1019: "手机号未注册",
                    1020: "前后密码输入不一致"
                };
                ngDialog.open({
                    template: '<p class="error-msg">' + error[name]+ '</p>',
                    showClose: false,
                    closeByDocument: false,
                    plain: true
                });
                setTimeout(function () {
                    ngDialog.closeAll();
                }, 1500);
            }
        })

        .filter('serverZuceError', function ($rootScope,ngDialog) {//手机
            return function (form, name) {
                var error = {
                    1001: "短信验证码为空",
                    1002: "短信验证码错误",
                    1003: "手机号错误",
                    1004: "图片验证码错误",
                    1005: "密码格式6-16位字母数字混合",
                    1006: "未勾选注册协议",
                    1007: "手机号已注册",
                    1008: "推荐人不存在",
                    1009: "特殊邀请码不存在",
                    1010: "特殊邀请码已使用，请更换其它邀请码",
                    ds1001: "电商码不存在",
                    ds1002: "电商码已使用",
                    ds1003: "电商码已过期"
                };
//                $rootScope.errorText = error[name];
//                $rootScope.maskError = true;
                ngDialog.open({
                    template: '<p class="error-msg">' + error[name]+ '</p>',
                    showClose: false,
                    closeByDocument: false,
                    plain: true
                });
                setTimeout(function () {
                    ngDialog.closeAll();
                }, 1500);
//                return error[name];
            }
        })
        /*错误信息----------------------------------------------*/

        .filter('手机短信验证错误', function ($rootScope,ngDialog) {//手机
            return function (form, name) {
                var error = {
                    1001: "短信验证码为空",
                    1002: "当天短信发送超过限制",
                    1003: "短信发送失败",
                    1005: "图形验证码不能为空",
                    1090: "您的访问过于频繁，请稍后再试",
                    6666: "当日获取短信验证码次数超过限制",
                    8888: "频繁操作"
                };
                ngDialog.open({
                    template: '<p class="error-msg">' + error[name]+ '</p>',
                    showClose: false,
                    closeByDocument: false,
                    plain: true
                });
                setTimeout(function () {
                    ngDialog.closeAll();
                }, 1000);
            }
        })
        /*登录密码验证*/
        .filter('denLuPassWordError', function () {
            return function (code, name) {
                var error = {
                    1001: "账号或密码为空",
                    1003: "账号或密码错误"
                };
                code.$valid = false;
                var text = '';
                if (code.$error["serverError"]) {
                    code.$valid = true;
                    delete code.$error.pattern;
                    delete code.$error.required;
                    if (error[name] != undefined) {
                        text = error[name];
                    } else {
                        code.$valid = false;
                    }
                }
                return text;
            }
        })
        /*登录用户名*/
        .filter('denLuUserNameError', function () {
            return function (code, name) {
                var error = {
                    1001: "账号或密码为空",
                    1003: "账号或密码错误"
                };
                code.$valid = false;
                var text = '';
                if (code.$error["required"]) {
                    if (code.$dirty) {
                        code.$valid = true;
                    };
                    delete code.$error.serverError;
                    text = '请输入您的手机号';
                } else
                    if (code.$error["pattern"]) {
                        code.$valid = true;
                        delete code.$error.serverError;
                        text = '此用户名无效';
                    } else
                        if (code.$error["minlength"]) {
                            code.$valid = true;
                            delete code.$error.serverError;
                            text = '用户名长度错误';
                        } else
                            if (code.$error["serverError"]) {
                                code.$valid = true;
                                delete code.$error.pattern;
                                delete code.$error.minlength;
                                delete code.$error.required;
                                if (error[name] != undefined) {
                                    text = error[name];
                                } else {
                                    code.$valid = false;
                                }
                            }
                return text;
            }
        })
        .filter('serverSmsError', function ($rootScope) {//短信
            return function (form, name) {
                var error = {
                    1001: "图片验证码不正确",
                    1002: "每个手机号当天只能发送5条",
                    1003: "短信发送失败"
                };
                $rootScope.errorText = error[name];
                $rootScope.maskError = true;
                return error[name];
            }
        })
        .filter('errorMsgDialog', function ($rootScope) {
            return function (name, dialog, replenish) {
                var error = {
                    noSelect: "请选需要操作的节点!",
                    noSelectRole: "请在角色列表中选中角色才能分配权限！",
                    delVerify: "确定要删除节点：",
                    loginErro: "登陆失败：",
                    netErro: "网络异常：请检查你的网络！",
                    addOK: "新增成功!",
                    delOK: "删除成功!",
                    updateOK: "修改成功!",
                    czOK: "操作成功!",
                    none: ""
                };
                var errormessage;
                if (replenish !== undefined) {
                    errormessage = error[name] + replenish;
                } else {
                    errormessage = error[name];
                }
                return dialog;
            }
        })
        /*服务器-errorCode*/
        .filter('服务器信息', function (ngDialog, $filter) {
            return function (code, scope, YorN) {
                var error = {
                    1001: "账号或密码为空",
                    1002: "验证码错误",
                    1003: "账号或密码错误",
                    9998: "请重新登录",
                    9999: "系统错误，请稍后刷新重试",
                    10001: "当日用户无分享记录",
                    test: "网络错误"
                };
                scope.msg = {};
                scope.msg.text = error[code];

                if (YorN == 'y') {
                    scope.msg = {};
                    scope.msg.btnYes = '确定';
                    // scope.msg.btnNo='忽略';
                    scope.msg.title = '通知：';
                    scope.msg.text = error[code];
                    $filter('提示跳转')('template/error/dlog.html', scope);
                } else {
                    return error[code];
                }
                setTimeout(function () {
                    ngDialog.closeAll();
                }, 1500);
            };
        })
        .filter('实名认证错误信息', function (ngDialog, $filter) {
            return function (code, scope, YorN) {
                var error = {
                    1001: "真实姓名不能为空",
                    1002: "身份证号不能为空",
                    1003: "银行卡号不能为空",
                    1004: "手机号码不能为空",
                    1005: "短信验证码不能为空",
                    1006: "短信验证码错误",
                    1007: "银行卡类型不符，请更换银行卡后重试",
                    1008: "此卡未开通银联在线支付功能,实名认证失败，请联系发卡银行",
                    1009: "不支持此银行卡的验证",
                    1010: "免费验证次数已用完，请联系客服人员。",
                    1011: "认证失败",
                    1012: "该身份证号已认证",
                    1013: "渠道不能为空",
                    1014: "请核对个人信息",
                    1015: "请核对银行卡信息",
                    1016: "该银行卡bin不支持",
                    1017: "认证失败，系统异常请稍后再试",
                    1018: '银行编号不能为空',
                    2001: '签约失败，请重新签约或更换其它银行卡签约' ,
                    2007: '银行卡无效，请重新输入',
                    2008: '银行卡未开通认证支付，请到银联开通此功能',
                    2009: '签约失败，请更换其它银行卡进行签约' ,
                    2011: '持卡人身份信息或手机号输入不正确',
                    2012: '姓名与身份证不一致',
                    2013: '此卡号您已认证错误超过6次，请次日再试' ,
                    2017: '此卡是信用卡，请用储蓄卡支付',
                    2020: '身份证格式错误',
                    2021: '此卡已过期，请重新换卡签约',
                    2022: '已超过包年最大鉴权次数',
                    2023: '预交手续费不足，请充值',
                    2024: '鉴权超时，请重新签约',
                    2025: '手机号格式错误',
                    2033: '请求频次过高',
                    3014: '商户不支持该卡交易',
                    3085: '信用卡有效期填写错误',
                    2048: '证件类型错误',
                    2047: '持卡人姓名超长',
                    2050: '最大输入密码次数超限，请联系发卡行',
                    2051: '签约失败',
                    2052: '姓名格式不正确，请重新输入',
                    2014: '查无此号，请核实您的身份证号码',
                    2053: '此卡未激活，请重新换卡签约',
                    2054: '签约失败，此卡为挂失卡',
                    2055: '未开通借记卡无密对应认证权限',
                    1183: '手续费余额不足，请充值后再试',
                    2056: '发卡行交易权限受限，详情请咨询您的发卡行',
                    9998: "同一账号不能同时登陆",
                    9999: "系统错误",
                    test: "网络错误"
                };
                scope.msg = {};
                scope.msg.text = error[code];
                if (YorN == 'y') {
                    scope.msg = {};
                    scope.msg.btnYes = '确定';
                    // scope.msg.btnNo='忽略';
                    scope.msg.title = '提示：';
                    scope.msg.text = error[code];
                    $filter('提示跳转')('template/error/dlog.html', scope);
                } else {
                    return error[code];
                }
                /*setTimeout(function () {
                    ngDialog.closeAll();
                }, 1500);*/
            };
        })
        .filter('投资错误信息', function (ngDialog, $filter) {
            return function (code, scope, YorN,errorMsg) {
                var error = {
                    1001: "交易密码错误",
                    1002: "产品已募集完",
                    1003: "项目可投资金额不足",
                    1004: "小于起投金额",
                    1005: "请输入整数倍的投资金额",
                    1006: "投资金额大于项目单笔投资限额",
                    1007: "账户可用余额不足",
                    1008: "已投资过产品，不能投资新手产品",
                    1009: "用户不存在",
                    1010: "优惠券不可用",
                    1011: "投资失败,请稍后再试",
                    1012: "投资金额小于使用红包的最小限额！",
                    2001: "交易密码已被锁定",
                    9998: "同一账号不能同时登陆",
                    9999: "系统错误",
                    5555: "您已投资过恩弗产品",
                    noInp: "请输入投资金额",
                    noPwd: "请输入交易密码",
                    ok: "投资成功",
                    test: "网络错误"
                };
                scope.msg = {};
                if(error[code]){
                    scope.msg.text = error[code];
                }
                else{
                    scope.msg.text = errorMsg;
                }
                if (YorN == 'y') {
                    scope.msg = {};
                    scope.msg.btnYes = null;
                    // scope.msg.btnNo='忽略';
                    scope.msg.title = '提示：';
                    if(error[code]){
                        scope.msg.text = error[code];
                    }
                    else{
                        scope.msg.text = errorMsg;
                    }
                    $filter('提示跳转')('template/error/dlog.html', scope);
                } else {
                    return error[code];
                }
                setTimeout(function () {
                    ngDialog.closeAll();
                }, 1500);
            };
        })
        .filter('实名短信错误信息', function (ngDialog, $filter) {
            return function (code, scope, YorN) {
                var error = {
                    1001: "手机号码有误",
                    1002: "当天短信发送超过限制",
                    1003: "短信发送失败",
                    1004: "银行卡尾号不能为空",
                    6666: "当日获取短信验证码次数超过限制",
                    8888: "频繁操作",
                    ok: '短信发送成功',
                    test: "网络错误"
                };
                scope.msg = {};
                scope.msg.text = error[code];
                if (YorN == 'y') {
                    scope.msg = {};
                    scope.msg.btnYes = null;
                    // scope.msg.btnNo='忽略';
                    scope.msg.title = '提示：';
                    scope.msg.text = error[code];
                    $filter('提示跳转')('template/error/dlog.html', scope);
                } else {
                    return error[code];
                }
                setTimeout(function () {
                    ngDialog.closeAll();
                }, 1500);
            };
        })

        // 实名认证发送短信错误
        .filter('sendMsgError', function ($rootScope,ngDialog) {//手机
            return function (name) {
                var error = {
                    1001: "银行卡名称不能为空",
                    1002: "您的银行卡卡号不能为空",
                    1003: "请检查您的银行卡卡号",
                    1004: "请输入您的姓名",
                    1005: "身份证号不能为空",
                    1006: "请输入正确的身份证号码",
                    1007: "手机号码不能为空",
                    1008: "请输入正确的手机号码"
                };
//                $rootScope.errorText = error[name];
//                $rootScope.maskError = true;
                ngDialog.open({
                    template: '<p class="error-msg">' + error[name]+ '</p>',
                    showClose: false,
                    closeByDocument: false,
                    plain: true
                });
                setTimeout(function () {
                    ngDialog.closeAll();
                }, 1500);
//                return error[name];
            }
        })

        .filter('意见反馈信息', function (ngDialog, $filter) {
            return function (code, scope, YorN) {
                var error = {
                    ok: '感谢您对我们的支持'
                };
                scope.msg = {};
                scope.msg.text = error[code];
                if (YorN == 'y') {
                    ngDialog.open({
                        template: '<p class="error-msg">' + error[code] + '</p>',
                        showClose: false,
                        closeByDocument: false,
                        plain: true
                    });
                    setTimeout(function () {
                        ngDialog.closeAll();
                    }, 1500);
                } else {
                    return error[code];
                }
            };
        })
        /*根据用户状态提示跳转页面方向*/
        .filter('提示跳转', function (ngDialog) {
            return function (templateurl, scope) {
                ngDialog.open({
                    template: templateurl,
                    scope: scope,
                    closeByDocument: false,
                    plain: false
                });
                // return  dialog;
            };
        })
        /***********************换算*******************************************/
        .filter('isNumber2', function ($rootScope) {
            return function (num, type, flag) {
                if (num == undefined) {
                    if (flag == undefined) {
                        return 0;
                    }
                } else {
                    if (isNaN(num)) {
                        if (flag == undefined) {
                            return 0;
                        }
                    } else {
                        var num = new Number(num);
                        var num = num.toFixed(4);
                        if (type != undefined) {
                            num = num.substring(0, num.lastIndexOf('.') + 0) // 123456.78
                        } else {
                            num = num.substring(0, num.lastIndexOf('.') + 3) // 123456.78
                        }
                    }

                    $rootScope.shouyi = num;
                    return num;
                }
            };
        })
        .filter('wisNumber2', function ($rootScope) {
            return function (num, type, flag) {
                if (num == undefined) {
                    if (flag == undefined) {
                        return 0.00;
                    }
                } else if (parseFloat(num) == 0 || isNaN(num)) {
                    return 0.00;
                } else {
                    num = new Number(num);
                    num = num.toFixed(3);
                    var result = new Number(num.substring(0,num.lastIndexOf('.')+3));
                    return result;
                    /*
                                        var bb = num + "";
                                        var dian = bb.indexOf('.');
                                        var result = "";
                                        if (dian == -1) {
                                            result = num.toFixed(2);
                                        } else {
                                            var cc = bb.substring(dian + 1, bb.length);
                                            if (cc.length >= 3) {
                                                // result = (Math.floor(num * 100) / 100);
                                                result = num.substring(0,num.lastIndexOf('.')+3)
                                                // result = result.toFixed(2);
                                            } else {
                                                result = result.toFixed(2);
                                            }
                                        }
                                        return result;
                                        */
                }
            }
        })
        .filter('wisNumber3', function ($rootScope) {
            return function (num, type, flag) {
                if (num == undefined) {
                    if (flag == undefined) {
                        return 0;
                    }
                } else {
                    if (isNaN(num)) {
                        if (flag == undefined) {
                            return 0;
                        }
                    } else {
                        num = new Number(num);
                        num = num.toFixed(4);
                        if (type != undefined) {
                            num = num.substring(0, num.lastIndexOf('.') + 0) // 123456.78
                        } else {
                            num = num.substring(0, num.lastIndexOf('.') + 3) // 123456.78
                        }
                    }
                    var haspoint = (num.toString()).indexOf('.00');
                    if (haspoint != -1) {
                        return parseInt(num) + '.0';
                    } else {
                        return num;
                    }
                }
            }
        })
        .filter('changchinese', function ($rootScope) {
            return function (timestamp, type, flag) {
                if (timestamp) {
                    var time = new Date(timestamp);
                    var year = time.getFullYear();
                    var month = time.getMonth()+1;
                    var date = time.getDate();
                    var hours = time.getHours();
                    var minutes = time.getMinutes();
                    if (minutes.toString().length == 1) {
                        minutes = '0' + minutes;
                    }
                    var seconds = time.getSeconds();
                    return month+'月'+date+'日 '+hours+':'+minutes;
                } else {
                    return ''
                }
            }
        })
        .filter('isNumber', function ($rootScope) {
            return function (num, type, flag) {
                if (num == undefined) {
                    if (flag == undefined) {
                        return 0;
                    }
                } else {
                    if (isNaN(num)) {
                        if (flag == undefined) {
                            return 0;
                        }
                    } else {
                        var num = new Number(num);
                        var num = num.toFixed(4);
                        if (type != undefined) {
                            num = num.substring(0, num.lastIndexOf('.') + 0) // 123456.78
                        } else {
                            num = num.substring(0, num.lastIndexOf('.') + 3) // 123456.78
                        }
                    }
                    return num;
                }
            };
        })
        /***********************换算*******************************************/

        .filter('setProgress', function () {
            return function (num) {
                if (num == undefined) {
                    return 0;
                } else {
                    if (isNaN(num)) {
                        return 0;
                    } else {
                        if (num > 0 && num <= 1) {
                            num = 1;
                        } else if (num >= 99 && num < 100) {
                            num = 99;
                        } else {
                            num = parseInt(num);
                        }
                    }
                    return num;
                }
            }
        })

        .filter('提现错误信息', function (ngDialog, $filter) {
            return function (msg, scope) {
                var error = {
                    'required': "请输入提现金额",
                    'pattern': "请输入正确的数值",
                    'morethan': "提现金额至少为1元",
                    'morethan3': "提现金额至少为3元",
                    'morethan2': "提现金额至少为2元",
                    'withdrawlimit': "提现金额最多为" + scope.cash.funds + "元",
                    'maxlimit': "提现金额最多为500,000元",
                    'morethanleast': "提现金额至少为" + (scope.showAmount + 1) + "元",
                    'morethanyue': "金额不能大于账户余额"
                };
                ngDialog.open({
                    template: '<p class="error-msg">' + error[msg] + '</p>',
                    showClose: false,
                    closeByDocument: false,
                    plain: true
                });
                setTimeout(function () {
                    ngDialog.closeAll();
                }, 1500);
            };
        })

        .filter('提现申请错误信息', function (ngDialog, $filter) {
            return function (msg) {
                var error = {
                    9999: "系统错误",
                    1001: "提现金额有误",
                    1002: "交易密码不能为空",
                    1003: "交易密码错误",
                    1004: "余额不足",
                    1005: "交易失败，请再次申请",
                    1006: "处理中",
                    1007: "该笔需要收取手续费",
                    1008: "该笔不需要收取手续费",
                    1009: "渠道不能为空",
                    2002: "返现或体验金收益需完成一次真实投资后才可提现",
                    3333: "金额不能小于3元",
                    3334: "当前充值金额大于该银行单笔限额，建议您重新输入"
                };
                ngDialog.open({
                    // template: '<p class="error-msg">' + error[msg] + '（'+ msg +'）' + '</p>',
                    template: '<p class="error-msg">' + error[msg] + '</p>',
                    showClose: false,
                    closeByDocument: true,
                    plain: true
                });
                setTimeout(function () {
                    ngDialog.closeAll();
                }, 1500);
            };
        })
        .filter('返回提现错误信息', function (ngDialog, $filter) {
            return function (msg) {
                var error = {
                    9999: "系统错误",
                    1001: "提现金额有误",
                    1002: "交易密码不能为空",
                    1003: "交易密码错误",
                    1004: "余额不足",
                    1005: "交易失败，请再次申请",
                    1006: "处理中",
                    1007: "该笔需要收取手续费",
                    1008: "该笔不需要收取手续费",
                    1009: "渠道不能为空",
                    2002: "返现或体验金收益需完成一次真实投资后才可提现",
                    3333: "金额不能小于3元",
                    3334: "当前充值金额大于该银行单笔限额，建议您重新输入",
                    3335:"未找到绑卡银行所属地区码",
                    3336:"支行名不能为空"
                };
                return error[msg];
            };
        })

        .filter('充值错误信息', function (ngDialog, $filter) {
            return function (msg, scope) {
                var error = {
                    'required': "请输入充值金额",
                    'pattern': "请输入正确的数值",
                    'more3': "充值金额至少为3元",
                    'rechargelimit': "充值金额最多为" + scope.singleQuota + "元"
                };
                ngDialog.open({
                    template: '<p class="error-msg">' + error[msg] + '</p>',
                    showClose: false,
                    closeByDocument: false,
                    plain: true
                });
                setTimeout(function () {
                    ngDialog.closeAll();
                }, 1500);
            };
        })

        .filter('修改交易密码错误信息', function (ngDialog, $filter) {
            return function (msg, scope) {
                var error = {
                    'codeRequired': "请输入短信验证码",
                    'tpwdRequired': "请输入交易密码",
                    'tpwdPattern': "交易密码格式错误"
                };
                ngDialog.open({
                    template: '<p class="error-msg">' + error[msg] + '</p>',
                    showClose: false,
                    closeByDocument: false,
                    plain: true
                });
                setTimeout(function () {
                    ngDialog.closeAll();
                }, 1500);
            };
        })

        .filter('修改登录密码错误信息', function (ngDialog, $filter) {
            return function (msg, scope) {
                var error = {
                    'codeRequired': "请输入短信验证码",
                    'pwdRequired': "请输入登录密码",
                    'pwdPattern': "登录密码格式错误"
                };
                ngDialog.open({
                    template: '<p class="error-msg">' + error[msg] + '</p>',
                    showClose: false,
                    closeByDocument: false,
                    plain: true
                });
                setTimeout(function () {
                    ngDialog.closeAll();
                }, 1500);
            };
        })

        .filter('登录交易密码短信验证码错误信息', function (ngDialog, $filter) {
            return function (msg) {
                var error = {
                    9999: "系统错误",
                    8888: "频繁操作",
                    1001: "手机号码有误",
                    1002: "当天短信发送超过限制",
                    6666: "当日获取短信验证码次数超过限制",
                    1003: "短信发送失败"
                };
                ngDialog.open({
                    template: '<p class="error-msg">' + error[msg] + '</p>',
                    showClose: false,
                    closeByDocument: true,
                    plain: true
                });

                setTimeout(function () {
                    ngDialog.closeAll();
                }, 1500);
            };
        })

        .filter('重置交易密码错误信息', function (ngDialog, $filter) {
            return function (msg, scope) {
                var error = {
                    9999: "系统错误",
                    1001: "验证码错误",
                    // 1002: "密码为空",
                    1002: "请输入规则的密码",
                    // 1003: "交易密码不合法"
                    1003: "请输入规则的密码"
                };
                ngDialog.open({
                    template: '<p class="error-msg">' + error[msg] + '</p>',
                    showClose: false,
                    closeByDocument: true,
                    plain: true
                });
                scope.isSubmit = false;
                setTimeout(function () {
                    ngDialog.closeAll();
                }, 1500);
            };
        })
        .filter('重置交易密码过程错误', function (ngDialog, $filter) {
            return function (msg, scope) {
                var error = {
                    1111: "请输入正确的验证码",
                    1001: "验证码错误",
                    1002: "请输入规则的密码",
                    1003: "请输入规则的密码"
                };
                ngDialog.open({
                    template: '<p class="error-msg">' + error[msg] + '</p>',
                    showClose: false,
                    closeByDocument: true,
                    plain: true
                });
                scope.isSubmit = false;
                setTimeout(function () {
                    ngDialog.closeAll();
                }, 1500);
            };
        })

        .filter('重置登录密码错误信息', function (ngDialog, $filter) {
            return function (msg, scope) {
                var error = {
                    9999: "系统错误",
                    1001: "验证码错误",
                    1002: "密码为空",
                    1003: "登录密码不合法"
                };
                ngDialog.open({
                    template: '<p class="error-msg">' + error[msg] + '</p>',
                    showClose: false,
                    closeByDocument: true,
                    plain: true
                });
                scope.isSubmit = false;
                setTimeout(function () {
                    ngDialog.closeAll();
                }, 1500);
            };
        })

        .filter('重置密码成功', function (ngDialog, $filter, $state) {
            return function (msg, scope) {
                ngDialog.open({
                    template: '<p class="success-msg">' + msg + '</p>',
                    showClose: false,
                    closeByDocument: false,
                    plain: true
                });
                scope.isSubmit = false;
                setTimeout(function () {
                    ngDialog.closeAll();
                    if(scope.userOBJ.register) {
                        $filter('跳回上一页')();

                    } else {
                        $state.go('dl');
                    }
                }, 1500);
            };
        })
        .filter('重置交易密码成功', function (ngDialog, $filter, $state) {
            return function (msg, scope) {
                ngDialog.open({
                    template: '<p class="success-msg">' + msg + '</p>',
                    showClose: false,
                    closeByDocument: false,
                    plain: true
                });
                scope.isSubmit = false;
                setTimeout(function () {
                    ngDialog.closeAll();
                    $filter('跳回上一页')();
                }, 1500);
            };
        })

        .filter('创建订单错误信息', function (ngDialog, $filter) {
            return function (msg) {
                var error = {
                    9999: "系统错误",
                    1001: "金额有误",
                    1002: "系统错误，请稍后重试",
                    1003: "超过限额，请修改金额后重试"
                };
                ngDialog.open({
                    template: '<p class="error-msg">' + error[msg] + '</p>',
                    showClose: false,
                    closeByDocument: true,
                    plain: true
                });

                setTimeout(function () {
                    ngDialog.closeAll();
                }, 1500);
            };
        })
        .filter('登录弹窗', function (ngDialog, $state, $localStorage) {
            return function (scope) {
                scope.closeDialog = function (bool) {
                    scope.isSubmit = false;
                    ngDialog.closeAll();
                };
                ngDialog.open({
                    template: '../../template/dialog/login-dialog.html',
                    className: 'recharge-dialog-wrap ngdialog-theme-default',
                    scope: scope,
                    closeByDocument: true,
                    showClose: true
                });
            };
        })
        .filter('充值弹窗', function (ngDialog, $state, $localStorage) {
            return function (scope) {
                scope.closeDialog = function (bool) {
                    scope.isSubmit = false;
                    ngDialog.closeAll();
                };
                ngDialog.open({
                    template: '../../template/dialog/recharge-dialog.html',
                    className: 'recharge-dialog-wrap ngdialog-theme-default',
                    scope: scope,
                    closeByDocument: false,
                    showClose: false
                });
            };
        })

        .filter('银行列表弹窗', function (ngDialog, $state, $localStorage) {
            return function (scope) {
                scope.closeDialog = function (bool) {
                    scope.isSubmit = false;
                    ngDialog.closeAll();
                };
                ngDialog.open({
                    className: 'bankListDialog',
                    template: '../../template/dialog/bank-dialog.html',
                    showClose: false,
                    closeByDocument: true,
                    scope: scope
                });
            };
        })

        .filter('砸金蛋弹窗', function (ngDialog, $state, $localStorage) {
            return function (scope) {
                scope.closeDialog = function (bool) {
                    scope.isSubmit = false;
                    ngDialog.closeAll();
                };
                ngDialog.open({
                    className: 'myDialog top120 dropEggDialog',
                    template: '../../template/dialog/eggOneStep-dialog.html',
                    showClose: false,
                    closeByDocument: true,
                    scope: scope
                });
            };
        })
        .filter('砸金蛋去投资弹窗', function (ngDialog, $state, $localStorage) {
            return function (scope) {
                scope.closeDialog = function (bool) {
                    scope.isSubmit = false;
                    ngDialog.closeAll();
                };
                ngDialog.open({
                    className: 'myDialog lastEggDialog',
                    template: '../../template/dialog/eggLastStep-dialog.html',
                    showClose: false,
                    closeByDocument: true,
                    scope: scope
                });
            };
        })

        .filter('提示激活奖励弹窗', function (ngDialog, $state, $localStorage) {
            return function (scope) {
                scope.closeDialog = function (bool) {
                    scope.isSubmit = false;
                    ngDialog.closeAll();
                };
                ngDialog.open({
                    className: 'myDialog eggToInvestDialog',
                    template: '../../template/dialog/eggToInvest-dialog.html',
                    showClose: false,
                    closeByDocument: true,
                    scope: scope
                });
            };
        })

        .filter('领取奖励弹窗', function (ngDialog, $state, $localStorage) {
            return function (scope) {
                scope.closeDialog = function (bool) {
                    scope.isSubmit = false;
                    ngDialog.closeAll();
                };
                ngDialog.open({
                    className: 'myDialog top600 eggToInvestDialog',
                    template: '../../template/dialog/recevice-dialog.html',
                    showClose: false,
                    closeByDocument: true,
                    scope: scope
                });
            };
        })

        .filter('投资交易密码错误信息', function (ngDialog, $state, $localStorage) {
            return function (scope) {
                scope.closeDialog = function () {
                    ngDialog.closeAll();
                };
                ngDialog.open({
                    template: '<div class="recharge-dialog forget"><div class="title">提示</div><p>连续输错三次，您的交易密码已被锁定！请一小时后再试，或点击忘记密码</p><div class="btns"><span ng-click="closeDialog()">稍后再试</span><span class="right" ng-click="closeDialog()" ui-sref="resetTradePwd({firstset:false})">忘记密码</span></div></div>',
                    className: 'recharge-dialog-wrap ngdialog-theme-default',
                    scope: scope,
                    showClose: false,
                    closeByDocument: false,
                    plain: true
                });
            };
        })

        .filter('充值验证码error信息', function (ngDialog, $filter) {
            return function (msg) {
                var error = {
                    9999: "系统错误",
                    8888: "频繁操作",
                    6666: "当日获取短信验证码次数超过限制",
                    1212: "验证码为6位数字",
                    1002: "短信发送失败"
                };
                ngDialog.open({
                    template: '<p class="error-msg">' + error[msg] + '</p>',
                    showClose: false,
                    closeByDocument: true,
                    plain: true
                });

                setTimeout(function () {
                    ngDialog.closeAll();
                }, 1500);
            };
        })
        .filter('登陆错误信息', function (ngDialog, $filter) {
            return function (msg, scope) {
                var error = {
                    1001: "账号或密码为空",
                    1003: "账号或密码错误",
                };
                scope.closeDialog = function () {
                    // scope.isSubmit = false;
                    ngDialog.closeAll();
                };
                if (msg == 1003) {
                    if (scope.loginErrorNums >= 1) {
                        scope.isShowPic = true;
                    }
                    error[msg] = scope.errorMsg;
                    ngDialog.open({
                        template: '<p class="error-msg">' + error[msg] + '</p>',
                        showClose: false,
                        closeByDocument: true,
                        plain: true,
                        className:'ngdialog-theme-default dl-error-msg-wrap'
                    });
                }
                setTimeout(function () {
                    ngDialog.closeAll();
                }, 1500);
            };
        })
        .filter('登陆错误超过5次', function (ngDialog, $filter) {
            return function (msg, scope) {
                scope.closeDialog = function () {
                    ngDialog.closeAll();
                };
                ngDialog.open({
                    template: '../../template/dialog/dl-fail-dialog.html',
                    className: 'dl-fail-wrap',
                    scope: scope,
                    closeByDocument: true,
                    plain: false,
                    showClose: false
                });

                /*setTimeout(function () {
                    ngDialog.closeAll();
                }, 1500);*/
            };
        })
        .filter('充值等待返回结果', function (ngDialog, $filter) {
            return function (scope) {
                ngDialog.open({
                    template: '../../template/dialog/charge-wait-dialog.html',
                    className: 'charge-wait-dialog',
                    scope: scope,
                    closeByDocument: true,
                    plain: false,
                    showClose: false
                });

                var timeout = false; //启动及关闭按钮
                function time() {
                    if(timeout) return;
                    scope.countdownTime --;
                    if (scope.countdownTime == 0) {
                        ngDialog.closeAll();
                        timeout = true;
                        scope.toContinue();
                    }
                    setTimeout(time,1000); //time是指本身,延时递归调用自己,100为间隔调用时间,单位毫秒
                }
                time();
            };
        })

        .filter('认证充值错误信息', function (ngDialog, $filter, $state) {
            return function (msg, scope) {
                var error = {
                    9999: "系统错误",
                    1001: "充值金额有误",
                    1002: "验证码不能为空",
                    1003: "验证码错误",
                    1004: "处理中",
                    1005: "系统错误，请稍后重试",
                    1006: "超出单卡号累计交易次数限制",
                    1007: "超出银行授信额度",
                    1008: "超过用户在银行设置的限额",
                    1009: "持卡人身份证验证失败",
                    1010: "对不起，您累计交易支付金额超出单笔限额",
                    1011: "对不起，您累计交易支付金额超出当日限额",
                    1012: "对不起，您累计交易支付金额超出当月限额",
                    1013: "非法用户号",
                    1014: "该卡暂不支持支付，请更换其他银行卡重试",
                    1015: "该卡暂不支持支付，请稍后再试",
                    1016: "交易超时",
                    1017: "交易金额不能大于最大限额",
                    1018: "交易金额不能低于最小限额",
                    1019: "交易金额超过渠道当月限额",
                    1020: "交易金额为空",
                    1021: "交易金额有误错误",
                    1022: "交易失败，风险受限",
                    1023: "交易失败，详情请咨询您的发卡行",
                    1024: "金额格式有误",
                    1025: "仅支持个人银行卡支付",
                    1026: "您的银行卡不支持该业务，请与发卡行联系",
                    1027: "请核对个人身份证信息",
                    1028: "请核对您的订单号",
                    1029: "请核对您的个人信息",
                    1030: "请核对您的银行卡信息",
                    1031: "请核对您的银行信息",
                    1032: "请核对您的银行预留手机号",
                    1033: "未开通无卡支付或交易超过限额，详情请咨询您的发卡行",
                    1034: "信息错误，请核对",
                    1035: "银行户名不能为空",
                    1036: "银行卡未开通银联在线支付，请向银行咨询",
                    1037: "银行名称无效",
                    1038: "银行系统繁忙，交易失败，请稍后再提交",
                    1039: "银行账号不能为空",
                    1040: "余额不足",
                    1041: "证件号错误，请核实",
                    1042: "证件号码不能为空",
                    1043: "证件类型与卡号不符",
                    1044: "银行账户余额不足",
                    3001: "银行卡未开通认证支付",
                    3002: "支付失败，银行无可用支付通道",
                    3003: "支付失败，最低支付金额2.1元",
                    3004: "输入参数错误",
                    3005: "单卡超过当日累积支付限额",
                    3006: "支付失败",
                    3007: "单卡超过单笔支付限额",
                    3008: "单卡超过当月累积支付限额",
                    3009: "单卡超过单日累积支付次数上限",
                    3010: "单卡超过单月累积支付次数上限",
                    3011: "订单重复提交",
                    3012: "订单已终态表示该订单已经支付成功或者支付失败",
                    3013: "支付失败，请重新或更换其它银行进行支付",
                    3014: "支付失败，不支持该银行卡交易请更换其它行银行卡进行交易",
                    3015: "订单不存在",
                    3016: "证件号非法，请核实",
                    3017: "交易订单已经支付成功，不允许再发起支付请求",
                    3018: "支付失败",
                    3019: "本卡在该商户不允许此交易，请联系收单机构",
                    3020: "卡被发卡方没收，请联系发卡银行",
                    3022: "支付失败，请联系发卡银行,银行对某些卡做了特殊的业务限制，需要用户联系银行解决",
                    3023: "消费超限",
                    3024: "本卡未激活或睡眠卡，请联系发卡银行",
                    3025: "该卡有作弊嫌疑或有相关限制，请联系发卡银行",
                    3026: "可用余额不足，请更换其它银行进行支付",
                    3027: "该卡已过期或有效期错误，请联系发卡银行",
                    3028: "该卡不支持无卡支付，请联系发卡方开通",
                    3029: "银行系统异常",
                    3030: "商户手续费有误,请联系融宝支付",
                    3031: "银行卡未开通认证支付，请到银联开通此功能",
                    3032: "订单已过期或已撤销",
                    3033: "商户收单交易限制有误，请联系融宝支付",
                    3034: "用户手续费有误，请联系融宝支付",
                    3035: "商户未开通该收单方式",
                    3036: "支付失败，请更换其它银行进行支付",
                    3037: "CVN验证失败或有作弊嫌疑",
                    3038: "请确认身份证号是否正确",
                    3039: "身份证、姓名或银行预留手机号有误",
                    3040: "支付失败，交易超时请重新支付",
                    3041: "单日金额消费超限",
                    3051: "状态不合法",
                    3052: "鉴权失败",
                    3059: "此卡为挂失卡，请更换其它银行卡进行支付",
                    3068: "订单金额太小",
                    3069: "验证码错误",
                    3073: "与银行通讯失败",
                    3074: "交易订单信息不一致",
                    3081: "交易处理中",
                    3083: "接收成功",
                    3084: "支付失败",
                    3086: "交易金额不能低于150分",
                    3094: "银行卡号有误，请重新支付",
                    3095: "持卡人身份信息或手机号输入不正确",
                    3096: "支付失败，卡信息或银行预留手机号有误",
                    3097: "无法查询到该交易",
                    3098: "不支持此银行卡交易，请更换其它银行的银行卡进行交易",
                    3099: "银行卡无效，请更换其它银行进行支付",
                    3100: "您的银行卡交易受限，请联系您的发卡行"
                };
                if(error[msg]==undefined || error[msg]==''){
                    error[msg]='充值失败，请联系客服';
                }
                ngDialog.open({
                    template: '<p class="error-msg">' + error[msg] + '（'+ msg +'）' + '</p>',
                    showClose: false,
                    closeByDocument: true,
                    plain: true
                });
                setTimeout(function () {
                    ngDialog.closeAll();
                    $state.go('recharge', null, {
                        reload: true
                    });
                }, 2500);
            };
        })

        .filter('返回充值错误信息', function (ngDialog, $filter, $state) {
            return function (msg, scope) {
                var error = {
                    9999: "系统错误",
                    1001: "充值金额有误",
                    1002: "验证码不能为空",
                    1003: "验证码错误",
                    1004: "处理中",
                    1005: "系统错误，请稍后重试",
                    1006: "超出单卡号累计交易次数限制",
                    1007: "超出银行授信额度",
                    1008: "超过用户在银行设置的限额",
                    1009: "持卡人身份证验证失败",
                    1010: "对不起，您累计交易支付金额超出单笔限额",
                    1011: "对不起，您累计交易支付金额超出当日限额",
                    1012: "对不起，您累计交易支付金额超出当月限额",
                    1013: "非法用户号",
                    1014: "该卡暂不支持支付，请更换其他银行卡重试",
                    1015: "该卡暂不支持支付，请稍后再试",
                    1016: "交易超时",
                    1017: "交易金额不能大于最大限额",
                    1018: "交易金额不能低于最小限额",
                    1019: "交易金额超过渠道当月限额",
                    1020: "交易金额为空",
                    1021: "交易金额有误错误",
                    1022: "交易失败，风险受限",
                    1023: "交易失败，详情请咨询您的发卡行",
                    1024: "金额格式有误",
                    1025: "仅支持个人银行卡支付",
                    1026: "您的银行卡不支持该业务，请与发卡行联系",
                    1027: "请核对个人身份证信息",
                    1028: "请核对您的订单号",
                    1029: "请核对您的个人信息",
                    1030: "请核对您的银行卡信息",
                    1031: "请核对您的银行信息",
                    1032: "请核对您的银行预留手机号",
                    1033: "未开通无卡支付或交易超过限额，详情请咨询您的发卡行",
                    1034: "信息错误，请核对",
                    1035: "银行户名不能为空",
                    1036: "银行卡未开通银联在线支付，请向银行咨询",
                    1037: "银行名称无效",
                    1038: "银行系统繁忙，交易失败，请稍后再提交",
                    1039: "银行账号不能为空",
                    1040: "余额不足",
                    1041: "证件号错误，请核实",
                    1042: "证件号码不能为空",
                    1043: "证件类型与卡号不符",
                    1044: "银行账户余额不足",
                    3001: "银行卡未开通认证支付",
                    3002: "支付失败，银行无可用支付通道",
                    3003: "支付失败，最低支付金额2.1元",
                    3004: "输入参数错误",
                    3005: "单卡超过当日累积支付限额",
                    3006: "支付失败",
                    3007: "单卡超过单笔支付限额",
                    3008: "单卡超过当月累积支付限额",
                    3009: "单卡超过单日累积支付次数上限",
                    3010: "单卡超过单月累积支付次数上限",
                    3011: "订单重复提交",
                    3012: "订单已终态表示该订单已经支付成功或者支付失败",
                    3013: "支付失败，请重新或更换其它银行进行支付",
                    3014: "支付失败，不支持该银行卡交易请更换其它行银行卡进行交易",
                    3015: "订单不存在",
                    3016: "证件号非法，请核实",
                    3017: "交易订单已经支付成功，不允许再发起支付请求",
                    3018: "支付失败",
                    3019: "本卡在该商户不允许此交易，请联系收单机构",
                    3020: "卡被发卡方没收，请联系发卡银行",
                    3022: "支付失败，请联系发卡银行,银行对某些卡做了特殊的业务限制，需要用户联系银行解决",
                    3023: "消费超限",
                    3024: "本卡未激活或睡眠卡，请联系发卡银行",
                    3025: "该卡有作弊嫌疑或有相关限制，请联系发卡银行",
                    3026: "可用余额不足，请更换其它银行进行支付",
                    3027: "该卡已过期或有效期错误，请联系发卡银行",
                    3028: "该卡不支持无卡支付，请联系发卡方开通",
                    3029: "银行系统异常",
                    3030: "商户手续费有误,请联系融宝支付",
                    3031: "银行卡未开通认证支付，请到银联开通此功能",
                    3032: "订单已过期或已撤销",
                    3033: "商户收单交易限制有误，请联系融宝支付",
                    3034: "用户手续费有误，请联系融宝支付",
                    3035: "商户未开通该收单方式",
                    3036: "支付失败，请更换其它银行进行支付",
                    3037: "CVN验证失败或有作弊嫌疑",
                    3038: "请确认身份证号是否正确",
                    3039: "身份证、姓名或银行预留手机号有误",
                    3040: "支付失败，交易超时请重新支付",
                    3041: "单日金额消费超限",
                    3051: "状态不合法",
                    3052: "鉴权失败",
                    3059: "此卡为挂失卡，请更换其它银行卡进行支付",
                    3068: "订单金额太小",
                    3069: "验证码错误",
                    3073: "与银行通讯失败",
                    3074: "交易订单信息不一致",
                    3081: "交易处理中",
                    3083: "接收成功",
                    3084: "支付失败",
                    3086: "交易金额不能低于150分",
                    3094: "银行卡号有误，请重新支付",
                    3095: "持卡人身份信息或手机号输入不正确",
                    3096: "支付失败，卡信息或银行预留手机号有误",
                    3097: "无法查询到该交易",
                    3098: "不支持此银行卡交易，请更换其它银行的银行卡进行交易",
                    3099: "银行卡无效，请更换其它银行进行支付",
                    3100: "您的银行卡交易受限，请联系您的发卡行"
                };
                if(error[msg]==undefined || error[msg]==''){
                    error[msg]='充值失败，请联系客服';
                }
                return error[msg];
            };
        })

        .filter('充值成功', function (ngDialog, $filter, $state, $localStorage) {
            return function (scope, type) {
                ngDialog.closeAll();
                var msg = '';
                if (type == 'ing') {
                    msg = '<p class="success-msg">充值处理中，请稍后查询处理结果</p>';
                } else {
                    msg = '<h3 class="success-msg">充值成功</h3><main>您已成功充值' + $filter('currency')(scope.successAmount, '') + '元<br>预计将在10分钟内到账，请耐心等待。</main>';
                }
                ngDialog.open({
                    template: msg,
                    showClose: false,
                    closeByDocument: false,
                    plain: true
                });
                setTimeout(function () {
                    ngDialog.closeAll();
                    if (scope.changcheng2 == true) {
                        $state.go('changcheng2');
                    }
                    else if ($localStorage.cp != undefined) {
                        if ($localStorage.cp.prize != undefined) {
                            $state.go('tjsinvestment', { wap: true, pid: $localStorage.cp.info.id });
                        }
                        else {
                            // $state.go('investment');
                            $filter('跳回上一页')();
                        }
                    } else {
                        $state.go('main.myaccountHome');
                    }

                }, 2500);
            };
        })
        .filter('isCPtradeType', function () {
            return function (tradeType) {
                var t = {
                    1: "充值",
                    2: "提现",
                    3: "投资",
                    4: "活动",
                    5: "提现手续费",
                    6: "回款",
                    7: "体验金"
                };
                return t[tradeType];
            };
        })
        .filter('体验金错误信息', function (ngDialog, $filter) {
            return function (msg) {
                var error = {
                    1: "没有可用体验金"
                };
                ngDialog.open({
                    template: '<p class="error-msg">' + error[msg] + '</p>',
                    showClose: false,
                    closeByDocument: true,
                    plain: true
                });

                setTimeout(function () {
                    ngDialog.closeAll();
                }, 1500);
            };
        })
        .filter('isBankType', function () {
            return function (tradeType) {
                var t = {
                    1: "中国工商银行",
                    2: "中国农业银行",
                    3: "中国建设银行",
                    4: "中国银行",
                    5: "中国邮政储蓄银行",
                    6: "招商银行",
                    7: "兴业银行",
                    8: "中国光大银行",
                    9: "广发银行",
                    10: "平安银行",
                    11: "中国民生银行",
                    12: "浦发银行",
                    13: "中信银行",
                    14: "上海银行",
                    15: "北京银行",
                    16: "交通银行",
                    17: "兰州银行",
                    18: "华夏银行"
                };
                return t[tradeType];
            };
        })
        .filter('investAmountError', function ($rootScope,ngDialog) {//手机
            return function (name,txt) {
                var error = {
                    1001: "请输入投资金额",
                    1002: txt,
                    1003: '两次输入密码不一样'
                };
                ngDialog.open({
                    template: '<p class="error-msg">' + error[name]+ '</p>',
                    showClose: false,
                    closeByDocument: false,
                    plain: true
                });
                setTimeout(function () {
                    ngDialog.closeAll();
                }, 1500);
            }
        })
        .filter('isCPstatus', function () {
            return function (status) {
                var t = {
                    1: "处理中",
                    2: "失败",
                    3: "成功",
                    4: "募集中",
                    5: "待续投"
                };
                return t[status];
            };
        })
        .filter('time-out', function ($rootScope, $interval) {
            return function (status) {
                $scope.timer = interval(function () {
                }, 1000);
            };
        })
        // 单选
        .filter('isBool', function ($rootScope, $interval) {
            return function (bool) {
                if (bool) {
                    bool = false;
                } else {
                    bool = true;
                }
                return bool;
            };
        })
        /*×××××××××××××××××××××××××× over ×××××××××××××××××××××××××××××××*/

        //  倒计时弹窗
        .filter('倒计时弹窗', function (ngDialog) {
            return function (scope) {
                ngDialog.open({
                    template: '../../template/dialog/countdown-dialog.html',
                    className: 'special-dialog-wrap ngdialog-theme-default',
                    scope: scope,
                    closeByDocument: false,
                    plain: false,
                    showClose: false
                });
            };
        })

        //  幸运码弹窗
        .filter('幸运码弹窗', function (ngDialog, $timeout) {
            return function (scope) {
                scope.closeDialog = function () {
                    scope.isSubmit = false;
                    ngDialog.closeAll();
                };
                ngDialog.open({
                    template: '../../template/dialog/special-code-dialog.html',
                    className: 'special-dialog-wrap ngdialog-theme-default',
                    scope: scope,
                    closeByDocument: true,
                    plain: false,
                    showClose: true
                });
                $timeout(function () {
                    $('.goToApp').attr('href', 'jsmp://page=9?pid=' + scope.product.id + '&ptype=' + scope.product.type + '&atid=1');
                })
            };
        })

        //  活动规则弹窗
        .filter('引导投资弹窗', function (ngDialog) {
            return function (scope) {
                scope.closeDialog = function () {
                    scope.isSubmit = false;
                    ngDialog.closeAll();
                };
                ngDialog.open({
                    template: '../../template/dialog/investShare-dialog.html',
                    className: 'rule-dialog-wrap low ngdialog-theme-default',
                    scope: scope,
                    closeByDocument: true,
                    plain: false,
                    showClose: false
                });
            };
        })
        //  活动规则弹窗
        .filter('活动规则弹窗', function (ngDialog) {
            return function (scope) {
                scope.closeDialog = function () {
                    scope.isSubmit = false;
                    ngDialog.closeAll();
                };
                ngDialog.open({
                    template: '../../template/dialog/rule-dialog.html',
                    className: 'rule-dialog-wrap ngdialog-theme-default',
                    scope: scope,
                    closeByDocument: true,
                    plain: false,
                    showClose: false
                });
            };
        })
        //  我的战队弹窗
        .filter('我的战队弹窗', function (ngDialog) {
            return function (scope) {
                scope.closeDialog = function () {
                    scope.isSubmit = false;
                    ngDialog.closeAll();
                };
                ngDialog.open({
                    template: '../../template/dialog/myTeam-dialog.html',
                    className: 'myDialog top60 rule-dialog-wrap',
                    scope: scope,
                    closeByDocument: true,
                    plain: false,
                    showClose: true
                });
            }
        })
        //  组队活动-成为队长弹窗
        .filter('成为队长弹窗', function (ngDialog, $timeout) {
            return function (scope) {
                scope.closeDialog = function () {
                    scope.isSubmit = false;
                    ngDialog.closeAll();
                };
                ngDialog.open({
                    template: '../../template/dialog/teamleader-dialog.html',
                    className: 'teamleader-dialog-wrap ngdialog-theme-default',
                    scope: scope,
                    closeByDocument: true,
                    plain: false,
                    showClose: false
                });
            };
        })
        //  评测结果提示1
        .filter('测评提示弹窗', function (ngDialog, $timeout) {
            return function (scope) {
                scope.closeDialog = function () {
                    scope.isSubmit = false;
                    ngDialog.closeAll();
                };
                ngDialog.open({
                    template: '../../template/dialog/evaluationResult-dialog.html',
                    className: 'teamleader-dialog-wrap ngdialog-theme-default',
                    scope: scope,
                    closeByDocument: false,
                    plain: false,
                    showClose: false
                });
            };
        })
        //  恩弗教育-规则弹框
        .filter('恩弗规则弹框', function (ngDialog, $timeout) {
            return function (scope) {
                scope.closeDialog = function () {
                    scope.isSubmit = false;
                    ngDialog.closeAll();
                };
                ngDialog.open({
                    template: '../../template/dialog/enfu-rule-dialog.html',
                    className: 'enfu-rule-dialog ngdialog-theme-default',
                    scope: scope,
                    closeByDocument: true,
                    plain: false,
                    showClose: false
                });
            };
        })
        //  通用登录弹窗
        .filter('通用登录弹窗', function (ngDialog, $timeout) {
            return function (scope) {
                scope.closeDialog = function () {
                    scope.isSubmit = false;
                    ngDialog.closeAll();
                };
                ngDialog.open({
                    template: '../../template/dialog/commonLogin-dialog.html',
                    className: 'commonLogin ngdialog-theme-default',
                    scope: scope,
                    closeByDocument: true,
                    plain: false,
                    showClose: false
                });
            };
        })
        //  预约奖品弹窗
        .filter('预约奖品弹窗', function (ngDialog, $timeout) {
            return function (scope,ctrl) {
                scope.closeDialog = function () {
                    scope.isSubmit = false;
                    ngDialog.closeAll();
                };
                ngDialog.open({
                    template: '../../template/dialog/reservations-dialog.html',
                    className: 'reservationDialog ngdialog-theme-default',
                    controller: ctrl,
                    scope: scope,
                    closeByDocument: false,
                    plain: false,
                    showClose: true
                });
            };
        })
        //  预约奖品弹窗
        .filter('元旦奖品弹窗', function (ngDialog, $timeout) {
            return function (scope,ctrl) {
                scope.closeDialog = function () {
                    scope.isSubmit = false;
                    ngDialog.closeAll();
                    $scope.chanceNum = 0;
                    resourceService.queryPost($scope, $filter('getUrl')('福袋活动参与人'),{pageOn:1,pageSize:10}, { name: '新年活动人数' });
                };
                ngDialog.open({
                    template: '../../template/dialog/yuandan-dialog-e.html',
                    className: 'reservationDialog yuandan-default',
                    controller: ctrl,
                    scope: scope,
                    closeByDocument: false,
                    plain: false,
                    showClose: true
                });
            };
        })
        .filter('元旦奖品无', function (ngDialog, $timeout) {
            return function (scope,ctrl) {
                scope.closeDialog = function () {
                    scope.isSubmit = false;
                    ngDialog.closeAll();
                };
                ngDialog.open({
                    template: '../../template/dialog/yuandan-dialog-nochance.html',
                    className: 'reservationDialog no-chance',
                    controller: ctrl,
                    scope: scope,
                    closeByDocument: false,
                    plain: false,
                    showClose: true
                });
            };
        })
        .filter('prizeStatus', function () {
            return function (code) {
                var map = {
                    0: '未开奖',
                    1: '未中奖',
                    2: '已中奖'
                };
                if (code >= 0 && map[code]) { return map[code] };
                return '无数据';
            }
        })
        .filter('phonesub', function () {
            return function (str, str2) {
                return str ? str.substring(0, 3) + str2 + str.substring(7) : '';
            }
        })
        .filter('percent', function () {
            return function (str) {
                var r = /^[1-9]?[0-9]*\.[1-9]*$/;
                var t = r.test(str);
                if (str < 1) {
                    return str * 10 + "‰";
                } else {
                    if (!t) {
                        str = parseInt(str);
                    }
                    return str + "%";
                }
            }
        })
        .filter('currency2', function () {
            return function (str) {
                if (str) {
                    str += "";
                    if (str.indexOf('.') != -1 && str.length - 1 - str.indexOf('.') > 2) {
                        str = str.toFixed(2);
                    } else if (str.indexOf('.') != -1 && str.length - 1 - str.indexOf('.') < 2) {
                        str += "0";
                    } else if (str.indexOf('.') == -1) {
                        str += ".00";
                    }
                    return str;
                } else {
                    return "-";
                }
            }
        })
        .filter('stringsub', function () {
            return function (str, num) {
                if (str) {
                    var len = 0, str2 = "";
                    for (var i = 0; i < str.length; i++) {
                        if (str.charCodeAt(i) > 127 || str.charCodeAt(i) == 94) {
                            len += 2;
                        } else {
                            len++;
                        }
                        if (len > num) {
                            str2 = str.substring(0, i - 1) + "...";
                            break;
                        } else {
                            str2 = str;
                        }
                    }
                    return str2;
                } else {
                    return "";
                }
            }
        })
        .filter('asHtml', function ($sce) {
            return function (data) {
                return $sce.trustAsHtml(data);
            }
        })
        .filter('getdate', function () {
            return function (date, i) {
                return new Date(new Date(date).getTime() + (86400000 * i));
            }
        })
        //拨打电话
        .filter('dial', function (ngDialog, $timeout) {
            return function (scope) {
                scope.closeDialog = function () {
                    scope.isSubmit = false;
                    ngDialog.closeAll();
                };
                ngDialog.open({
                    template: '../../template/dialog/dial-phone.html',
                    className: 'teamleader-dialog-wrap ngdialog-theme-default dial-phone-ngdialog',
                    scope: scope,
                    closeByDocument: true,
                    plain: false,
                    showClose: false
                });
            };
        })
        //客服中心 -- 认证充值页面的
        .filter('dial2', function (ngDialog, $timeout) {
            return function (scope) {
                scope.closeDialog = function () {
                    // scope.isSubmit = false;
                    ngDialog.closeAll();
                };
                ngDialog.open({
                    template: '../../template/dialog/dial-phone2.html',
                    className: 'kefu-dialog-wrap ngdialog-theme-default dial-phone-ngdialog',
                    scope: scope,
                    closeByDocument: true,
                    plain: false,
                    showClose: false
                });
            };
        })
        //数字转化为中文版
        .filter('translatechinese', function () {
            return function (num) {
                var china = new Array('零','一','二','三','四','五','六','七','八','九');
                var arr = new Array();
                if (typeof num === "number"){
                    num = num.toString();
                }
                var english = num.split("")
                for(var i=0;i<english.length;i++){
                    arr[i] = china[english[i]];
                }
                return arr.join("")
            }
        })
        //数字向下取整
        .filter('numfloor', function () {
            return function (num) {
                return Math.floor(num)
            }
        })
        //数字保留两位小数点，不四舍五入
        .filter('twopoint', function () {
            return function (num) {
                var bb = num+"";
                var dian = bb.indexOf('.');
                var result = "";
                if(dian == -1){
                    result =  num.toFixed(2);
                }else{
                    var cc = bb.substring(dian+1,bb.length);
                    if(cc.length >=3){
                        result =  (Math.floor(num * 100) / 100)
                    }else{
                        result =  num.toFixed(2);
                    }
                }
                return result
            }
        })
        //  春节活动规则弹窗
        .filter('春节活动规则弹窗', function (ngDialog) {
            return function (scope) {
                scope.closeDialog = function () {
                    scope.isSubmit = false;
                    ngDialog.closeAll();
                };
                ngDialog.open({
                    template: '../../template/dialog/chunjie-rule-dialog.html',
                    className: 'rule-dialog-wrap ngdialog-theme-default',
                    scope: scope,
                    closeByDocument: true,
                    plain: false,
                    showClose: false
                });
            };
        })
        //  春节活动计算器
        .filter('春节活动计算器', function (ngDialog) {
            return function (scope) {
                scope.closeDialog = function () {
                    // scope.isSubmit = false;
                    ngDialog.closeAll();
                };
                scope.hideBox = function () {
                    if ($(".entry").attr("disabled")) {
                        $(".entry").removeAttr("disabled")
                    }
                    $(".entry").focus();
                }
                ngDialog.open({
                    template: '../../template/dialog/chunjie-couter-dialog.html',
                    className: 'chunjie-couter-wrap ngdialog-theme-default',
                    scope: scope,
                    closeByDocument: true,
                    plain: false,
                    showClose: false
                });
            };
        })
        //  春节活动奖品弹框
        .filter('春节活动奖品弹框', function (ngDialog) {
            return function (scope) {
                scope.closeDialog = function () {
                    // scope.isSubmit = false;
                    ngDialog.closeAll();
                };
                ngDialog.open({
                    template: '../../template/dialog/chunjie-prize-dialog.html',
                    className: 'chunjie-prize-wrap ngdialog-theme-default',
                    scope: scope,
                    closeByDocument: true,
                    plain: false,
                    showClose: false
                });
            };
        })

        .filter('优惠券列表弹窗', function (ngDialog, $state, $localStorage) {
            return function (scope) {
                scope.closeDialog = function (bool) {
                    scope.isSubmit = false;
                    ngDialog.closeAll();
                };
                ngDialog.open({
                    className: 'bankListDialog',
                    template: '../../template/dialog/coupon-dialog.html',
                    showClose: false,
                    closeByDocument: true,
                    scope: scope
                });
            };
        })
        .filter('支付弹窗', function (ngDialog, $state, $localStorage) {
            return function (scope) {
                scope.closeDialog = function (bool) {
                    scope.isSubmit = false;
                    ngDialog.closeAll();
                };
                ngDialog.open({
                    className: 'bankListDialog',
                    template: '../../template/dialog/zhifu-dialog.html',
                    showClose: false,
                    closeByDocument: true,
                    scope: scope
                });
            };
        })
        .filter('设置交易密码弹窗', function (ngDialog, $state, $localStorage) {
            return function (scope) {
                scope.closeDialog = function (bool) {
                    scope.isSubmit = false;
                    ngDialog.closeAll();
                };
                ngDialog.open({
                    className: 'bankListDialog',
                    template: '../../template/dialog/tradePwd-dialog.html',
                    showClose: false,
                    closeByDocument: true,
                    scope: scope
                });
            };
        })
        //  周排行计算器一
        .filter('周排行计算器', function (ngDialog) {
            return function (scope) {
                scope.closeDialog = function () {
                    // scope.isSubmit = false;
                    ngDialog.closeAll();
                };
                scope.hideBox = function () {
                    if ($(".entry").attr("disabled")) {
                        $(".entry").removeAttr("disabled")
                    }
                    $(".entry").focus();
                }
                ngDialog.open({
                    template: '../../template/dialog/weekring-couter-dialog.html',
                    className: 'chunjie-couter-wrap ngdialog-theme-default week-rink',
                    scope: scope,
                    closeByDocument: true,
                    plain: false,
                    showClose: false
                });
            };
        })
        //  周排行计算器二
        .filter('周排行计算器二', function (ngDialog) {
            return function (scope) {
                scope.closeDialog = function () {
                    // scope.isSubmit = false;
                    ngDialog.closeAll();
                };
                scope.hideBox = function () {
                    if ($(".entry").attr("disabled")) {
                        $(".entry").removeAttr("disabled")
                    }
                    $(".entry").focus();
                }
                ngDialog.open({
                    template: '../../template/dialog/weekring-couter-dialog-sec.html',
                    className: 'chunjie-couter-wrap ngdialog-theme-default week-rink',
                    scope: scope,
                    closeByDocument: true,
                    plain: false,
                    showClose: false
                });
            };
        })
        //  会员福利日规则弹窗
        .filter('会员福利日规则弹窗', function (ngDialog) {
            return function (scope) {
                scope.closeDialog = function () {
                    ngDialog.closeAll();
                };
                ngDialog.open({
                    template: '../../template/dialog/member-rule-dialog.html',
                    className: 'member-dialog-wrap',
                    scope: scope,
                    closeByDocument: true,
                    plain: false,
                    showClose: false
                });
            };
        })
        //  会员福利日中奖弹窗
        .filter('会员福利日中奖弹窗', function (ngDialog,$timeout) {
            return function (scope,fun) {
                scope.closeDialog = function () {
                    ngDialog.closeAll();
                };
                ngDialog.open({
                    template: '../../template/dialog/member-winning-dialog.html',
                    className: 'wining-dialog-wrap wining-box',
                    scope: scope,
                    closeByDocument: true,
                    plain: false,
                    showClose: false
                });
                $timeout(function () {
                    fun();
                },800)
            };
        })
        //  会员福利日我的奖品弹窗
        .filter('会员福利日我的奖品弹窗', function (ngDialog,$timeout) {
            return function (scope) {
                scope.closeDialog = function () {
                    ngDialog.closeAll();
                };
                ngDialog.open({
                    template: '../../template/dialog/member-award.html',
                    className: 'wining-dialog-wrap',
                    scope: scope,
                    closeByDocument: true,
                    plain: false,
                    showClose: false
                });
            };
        })
        //  会员福利日各种弹窗
        .filter('会员福利日各种弹窗', function (ngDialog,$timeout) {
            return function (scope, type) {
                scope.closeDialog = function () {
                    ngDialog.closeAll();
                };
                scope.dialogType = type;
                scope.className = 'wining-dialog-wrap type';
                if (type != 3) {
                    if (type ==2) {
                        scope.className = 'wining-dialog-wrap type fenxiang';
                    }
                    $timeout(function () {
                        scope.closeDialog();
                    },3000)
                } else {
                    scope.className = 'wining-dialog-wrap type shoutou';
                }
                ngDialog.open({
                    template: '../../template/dialog/member-dialog.html',
                    className: scope.className,
                    scope: scope,
                    closeByDocument: true,
                    plain: false,
                    showClose: false
                });

            };
        })
        //  贴息活动规则弹窗
        .filter('贴息活动规则弹窗', function (ngDialog) {
            return function (scope) {
                scope.closeDialog = function () {
                    scope.isSubmit = false;
                    ngDialog.closeAll();
                };
                ngDialog.open({
                    template: '../../template/dialog/interestSubsidy/interest-rule-dialog.html',
                    className: 'rule-dialog-wrap ngdialog-theme-default',
                    scope: scope,
                    closeByDocument: true,
                    plain: false,
                    showClose: false
                });
            };
        })

        //  贴息活动--未首投弹窗
        .filter('未首投弹窗', function (ngDialog, $timeout) {
            return function (scope) {
                scope.closeDialog = function () {
                    scope.isSubmit = false;
                    ngDialog.closeAll();
                };
                ngDialog.open({
                    template: '../../template/dialog/interestSubsidy/firstInvest-dialog.html',
                    className: 'teamleader-dialog-wrap ngdialog-theme-default',
                    scope: scope,
                    closeByDocument: true,
                    plain: false,
                    showClose: false
                });
            };
        })

        //  贴息活动--卡升级弹窗
        .filter('卡升级弹窗', function (ngDialog, $timeout) {
            return function (scope) {
                scope.closeDialog = function () {
                    scope.isSubmit = false;
                    ngDialog.closeAll();
                };
                ngDialog.open({
                    template: '../../template/dialog/interestSubsidy/card-pop-dialog.html',
                    className: 'teamleader-dialog-wrap ngdialog-theme-default',
                    scope: scope,
                    closeByDocument: true,
                    plain: false,
                    showClose: false
                });
            };
        })
        .filter('解绑卡错误信息', function (ngDialog, $filter) {
            return function (msg) {
                var error = {
                    99: "系统异常",
                    1001: "请重新登录",
                    1002: "请稍后再试或者联系客服",
                    1003: "用户未绑定银行卡",
                    1004: "请上传正确的图片格式",
                    1005: "ftp服务器异常",
                    1006: "正在上传中"
                };
                if (!msg) {
                    msg = '1002'
                }
                ngDialog.open({
                    template: '<p class="error-msg">' + error[msg] + '</p>',
                    showClose: false,
                    closeByDocument: true,
                    plain: true
                });

                setTimeout(function () {
                    ngDialog.closeAll();
                }, 1500);
            };
        })
        //解绑卡成功弹窗
        .filter('解绑卡成功弹窗', function (ngDialog, $timeout, $filter) {
            return function (scope) {
                scope.closeDialog = function () {
                    scope.isSubmit = false;
                    ngDialog.closeAll();
                };
                ngDialog.open({
                    template: '../../template/dialog/dial-unbinding-bank.html',
                    className: 'teamleader-dialog-wrap ngdialog-theme-default dial-phone-ngdialog unbinding',
                    scope: scope,
                    closeByDocument: true,
                    plain: false,
                    showClose: false
                });
                setTimeout(function () {
                    ngDialog.closeAll();
                    $filter('跳回上一页')(2);
                }, 1500);
            };
        })
        //  首页--贴息活动入口弹窗
        .filter('首页贴息活动弹窗', function (ngDialog, $timeout) {
            return function (scope) {
                scope.closeDialog = function () {
                    scope.isSubmit = false;
                    ngDialog.closeAll();
                };
                ngDialog.open({
                    template: '../../template/dialog/interestSubsidy/homeInterest-dialog.html',
                    className: 'teamleader-dialog-wrap ngdialog-theme-default',
                    scope: scope,
                    closeByDocument: true,
                    plain: false,
                    showClose: false
                });
            };
        })
        //  三级邀请规则弹窗
        .filter('三级邀请规则弹窗', function (ngDialog) {
            return function (scope) {
                scope.closeDialog = function () {
                    scope.isSubmit = false;
                    ngDialog.closeAll();
                };
                ngDialog.open({
                    template: '../../template/dialog/thirdInvitation/thirdInvitation-rule-dialog.html',
                    className: 'rule-dialog-wrap ngdialog-theme-default',
                    scope: scope,
                    closeByDocument: true,
                    plain: false,
                    showClose: false
                });
            };
        })
        //  奖励计算器
        .filter('三级邀请奖励计算器', function (ngDialog) {
            return function (scope) {
                scope.closeDialog = function () {
                    // scope.isSubmit = false;
                    ngDialog.closeAll();
                };
                scope.hideBox = function () {
                    if ($(".entry").attr("disabled")) {
                        $(".entry").removeAttr("disabled")
                    }
                    $(".entry").focus();
                }
                scope.hideBox1 = function () {
                    if ($(".entry1").attr("disabled")) {
                        $(".entry1").removeAttr("disabled")
                    }
                    $(".entry1").focus();
                }
                ngDialog.open({
                    template: '../../template/dialog/thirdInvitation/thirdInvitation-couter-dialog.html',
                    className: 'chunjie-couter-wrap ngdialog-theme-default',
                    scope: scope,
                    closeByDocument: true,
                    plain: false,
                    showClose: false
                });
            };
        })
        //  奖励明细弹窗
        .filter('奖励明细弹窗', function (ngDialog) {
            return function (scope) {
                scope.closeDialog = function () {
                    ngDialog.closeAll();
                };
                ngDialog.open({
                    template: '../../template/dialog/thirdInvitation/reward-subsidiary-dialog.html',
                    className: 'chunjie-couter-wrap ngdialog-theme-default',
                    scope: scope,
                    closeByDocument: true,
                    plain: false,
                    showClose: false
                });
            };
        })

});