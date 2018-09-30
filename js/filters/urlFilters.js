/* 
* @Author: lee
* @Date:   2016-01-12 21:01:57
* @Last Modified by:   Ellie
<<<<<<< HEAD
* @Last Modified time: 2018-02-01 16:13:43
=======
* @Last Modified time: 2018-01-23 14:20:25
>>>>>>> 3b6ab0f6e92a97fa53b979a2334f57090c89ff97
*/

'use strict';
define(['app'],function(app){

    app
        /*app接口*/
     .filter('getUrl', function() {
            return function(name) {
                var base = '/'
                var urls = {
                    // 首页
                    "shouYe":base+"index/index.dos",
                    "首页统计":base+"index/regAndInvestCount.dos",
                    "myacc":base+"accountIndex/info.dos",
                    "我的红包":base+"activity/index.dos",
                    "拆红包":base+"member/getOpenRed.dos",
                     /*注册接口*/
                    "getyzm":base+"register/sendRegMsg.dos",
                    "getPhone":base+"register/existMobilePhone.dos",
                    "zuce":base+"register/reg.dos",
                    "picCode":base+"login/validateCode.dos",
                    "信息认证":base+"memberSetting/sendBankMsg.dos",
                    "实名认证":base+"memberSetting/bankInfoVerify.dos",
                    "充值":base+"recharge/index.dos",
                    "创建订单":base+"recharge/createPayOrder.dos",
                    "充值验证码":base+"recharge/sendRechargeSms.dos",
                    "认证充值":base+"recharge/goPay.dos",

                    "提现":base+"withdrawals/index.dos",
                    "提现申请":base+"withdrawals/addWithdrawals.dos",
                    /*我的*/
                    "我的资产":base+"accountIndex/myFunds.dos",
                    "站内信":base+"messageCenter/getMessage.dos",

                    "我的投资":base+"investCenter/productList.dos",

                    "我的明细":base+"assetRecord/index.dos",
                    "交易明细":base+"assetRecord/getAccumulatedIncome.dos",
                    "我的信息":base+"memberSetting/index.dos",
                    "我的银行卡":base+"memberSetting/myBankInfo.dos",
                    "我的消息":base+"messageCenter/getMessage.dos",

                    /*登录*/
                    "login":base+"login/doLogin.dos",
                    "短信验证":base+"memberSetting/sendForgetTpwdCode.dos",
                    "完成设置交易密码提交":base+"memberSetting/updateTpwdBySms.dos",
                    "判断用户状态":base+"memberSetting/index.dos",
                    
                    /*产品*/
                    "cplist":base+"product/list.dos",
                    "cpDetail":base+"product/detail.dos",
                    "cpPicAndInvest":base+"product/detail_info.dos",
                    "产品可用优惠券":base+"activity/usable.dos",
                    "购买产品":base+"product/invest.dos",

                    "交易密码重置短信验证码":base+"memberSetting/sendForgetTpwdCode.dos",
                    "设置交易密码":base+"memberSetting/updateTpwdBySms.dos",

                    "登录密码重置短信验证码":base+"memberSetting/forgetPwdSmsCode.dos",
                    "设置登录密码":base+"memberSetting/updateLoginPassWord.dos",
                    "意见反馈":base+"system/feedback.dos",
                    "银行限额列表":base+"recharge/getBankQuotaList.dos",

                    "好友互推":base+"recommend/myFriendInvest.dos",
                    'selectInvest':base+'product/selectInvest.dos',
                    '回款记录':base+"investCenter/repayInfoDetail.dos",
                    'selectProductInfo':base+"product/selectProductInfoRecommend.dos",

                    '我的幸运码':base+"product/getMyLuckCodes.dos",
                    'getMyPrizeRecords':base+'activity/getMyPrizeRecords.dos',
                    '活动标详情':base+"product/getNewActivityProduct.dos",
                    '活动开奖结果':base+"activity/getActivityPrizeResult.dos",
                    'getPrizeInfoByProductId':base+'activity/getPrizeInfoByProductId.dos',
                    // 'zadan':base+'activity/getRandomCouponByProductId.dos',
                    'signWeChat':base+'product/signWeChat.dos',
                    index : base + "",
                    'getActivityFriendConfigAll':'activity/getActivityFriendConfigAll.dos',
                    'getActivityFriendConfig':'activity/getActivityFriendConfig.dos',
                    'getActivityFriendStatistics':'activity/getActivityFriendStatistics.dos',
                    'getTheRewards':'assetRecord/getTheRewards.dos',
                    'getPromoteRedelivery':'member/getPromoteRedelivery.dos',
                    'getUse':'member/getUse.dos',
                    'getReservation':'product/getReservation.dos',
                    'myInvitation':'activity/myInvitation.dos',
                    'getContinueReward':'product/getContinueReward.dos',
                    'addContinueReward':'product/addContinueReward.dos',
                    // 双蛋活动
                    '双旦活动':base+'activity/doubleAggIndex.dos',
                    '拆双旦红包':base+'activity/tearOpen.dos',
                    '双旦分享':base+'activity/dobuleEggShare.dos',
                    //元旦活动
                    '福袋每日机会判断':base+'activity/judgeOpptunity.dos',
                    '福袋抽奖':base+'activity/openFuPackage.dos',
                    '福袋活动参与人':base+'activity/getFuPackageJoin.dos',
                    // 年末豪礼投即送活动
                    'tjs活动页':base+'activity/investSendPrizeIndex.dos',
                    'tjs产品奖品':base+'activity/selectProductPrize.dos',
                    'tjs投资记录':base+'activity/accountInvestLogs.dos',
                    'tjs修改地址':base+'member/updateReceiptAddress.dos',
                    'tjs添加地址':base+'member/insertReceiptAddress.dos',
                    'tjs获取地址':base+'member/getReceiptAddress.dos',
                    'tjs添加预约':base+'activity/insertPrizeInfo.dos',
                    'tjs许愿':base+'activity/wishCommit.dos',
                    // 活动聚合页
                    '活动聚合':base+'activity/getAllActivity.dos',
                    '我参与的活动列表':base+'activity/getJeCadeaux.dos',
                    // 关于我们
                    '网站公告':base+'aboutus/newsInformationList.dos',
                    '公告详情':base+'aboutus/newsDetails.dos',
                    // 长城宽带落地页
                    'getGreatWallInfo':base+'activity/getGreatWallInfo.dos',
                    // 邀请好友4-返现前5
                    '返现前5':base+'activity/getTopFive.dos',
                    // 体验标
                    '体验标详情':base+'product/experienceDetail.dos',
                    '体验标投资':base+'product/experienceInvest.dos',
                    // 春节活动
                    '压岁钱分享页':base+'jsActivityLuckMoney/getshaerUserName.dos',
                    '领压岁钱':base+'jsActivityLuckMoney/getJsActivityLuckyMoney.dos',
                    // 元宵活动
                    '吃元宵':base+'activity/eatGlutinous.dos',
                    '元宵领取记录':base+'activity/getEatGlutinousLog.dos',
                    // 新手标推广页排行榜
                    '新手标推广页排行榜':base+'activity/getNoviceListAndCount.dos',
                    // iPhone7推广页
                    'iPhoneSEM':base+'activity/iPhoneSEM.dos',
                    // 新体验金推广页
                    'lastRegMember':base+'activity/lastRegMember.dos',
                    // 活动聚合页开放日往期列表
                    'getOpenDayList':base+'activity/getOpenDayList.dos',
                    // 开放日报名
                    '开放日报名':base+'activity/SignUp.dos',
                    // 开放日活动内容
                    'getOpenDayDetail':base+'activity/getOpenDayDetail.dos',
                    // 开放日活动详情页
                    'getOpenDayArticleDetail':base+'activity/getOpenDayArticleDetail.dos',
                    // 邀请好友三重礼top10
                    '邀请好友三重礼top10':base+'activity/getRankingList.dos',
                    // 我的邀请页面
                    '我的邀请':base+'activity/firstInvestList.dos',
                    // 推广页获取个人信息
                    '推广页账户':base+'activity/getMyAccount.dos',
                    // app2.0翻牌领取记录
                    'app2.0翻牌领取记录':base+'activity/flopIndex.dos',
                    // app2.0翻牌
                    'app2.0翻牌':base+'activity/flop.dos',
                    // 公益活动列表
                    '公益活动列表':base+'activity/offlineActivityList.dos',
                    // 公益活动内容
                    '公益活动内容':base+'activity/offlineActivityDetail.dos',
                    // 518理财节
                    '518理财节':base+'activity/activityMay18d.dos',
                    // 518产品详情
                    '518产品详情':base+'product/getPorductList.dos',
                    // 端午节活动
                    '端午节活动':base+'activity/dragonBoat.dos',
                    // 活动标列表banner
                    '活动标列表banner':base+'product/activityPrizeBanner.dos',
                    // 存管开户
                    '存管开户':base+'member/openAccountSignature.dos',
                    // 存管提现
                    '存管提现':base+'withdrawals/depositsWithdrawals.dos',
                    // 存管充值
                    '存管充值':base+'recharge/depositsRecharge.dos',
                    // 我的存管账户
                    '我的存管账户':base+'memberSetting/fuiouIndex.dos',
                    // 存管账户重置存管交易密码
                    '重置存管交易密码':base+'memberSetting/fuiouUpdatePwd.dos',
                    // 我要报销
                    '我要报销':base+'ec/reimburse.dos',
                    '分期报销':base+'ec/reimburseList.dos',
                    '验证购物码':base+'ec/checkEccode.dos',
                    '报销记录':base+'ec/latestReim.dos',
                    '砸金蛋' :base+'activity/lotteryEggs.dos',
                    '砸蛋奖品排行' :base+'activity/lotteryPeopleList.dos',
                    '砸蛋机会' :base+'activity/lotteryEggsInfo.dos',
                    '分享赠送机会' :base+'activity/addLotteryOpp.dos',
                    '邀请好友历史中奖' :base+'activity/historyWinnerInfos.dos',
                    '中奖记录' :base+'activity/inviteFriendList.dos',
                    'sem288推广页h5' :base+'activity/lastRegMember.dos',
                    // 抽奖
                    '获取抽奖活动的奖品信息': base+'activity/currentAward.dos',
                    '往期开奖': base+'activity/previousLottery.dos',
                    '抽奖最新动态': base+'activity/newAwarDynamic.dos',
                    '预约奖品列表': base+'activity/appointmentAwardList.dos',
                    '奖品预约': base+'activity/appointmentAward.dos',
                    '我的抽奖码':base+"activity/myLotteryCode.dos",
                    '奖品详情': base+'activity/awardDetail.dos',
                    // 组队
                    '组队通知': base+'yxActivityOfTeam/getNewMessage.dos',
                    '我的战队': base+'yxActivityOfTeam/myTeam.dos',
                    '我的战队详细': base+'yxActivityOfTeam/myTeamDetail.dos',
                    '排行榜': base+'yxActivityOfTeam/rankList.dos',
                    '邀请好友': base+'yxActivityOfTeam/inviteFriendsToTeam.dos',
                    '首次成为队长': base+'yxActivityOfTeam/indexCreateTeam.dos',
                    // 恩弗教育
                    '注册验证手机号': base+'enfu/registerInvestForPrize.dos',
                    '恩弗奖品详情': base+'activity/getJeCadeauxList.dos',
                    // 投资后分享
                    '分享详情': base+'activity/shareInfo.dos',
                    '注册送体验金': base+'activity/registerTYJ.dos',
                    '分享赠送体验金': base+'activity/shareTYJ.dos',
                    '判断用户参与活动状态': base+'activity/userShareStatus.dos',
                    '分享': base+'activity/share.dos',
                    // 春节活动
                    '春节活动个人投资信息': base+'newYear/myInfo.dos',
                    '奖品列表': base+'newYear/awardList.dos',
                    '春节中奖记录': base+'newYear/winningRecord.dos',
                    '春节投资排行': base+'newYear/investRanking.dos',
                    '春节我的活动详情': base+'newYear/myActivityDetail.dos',
                    //发布会视频
                    '发布会视频': base+'appLiveUrl/windowsUrl.dos',
                    //底部icon
                    'pageIcon': base+'activity/isInDoubleEggActivity.dos',
                    '信息披露': base+'index/getLanMuList.do',
                    '栏目信息': base+'index/getColumnList.do',
                    '平台数据1': base+'index/getJieKuanList.do',
                    '平台数据2': base+'index/regAndInvestCount.do',
                    '首次评测显示': base+'questionnaire/evaluateStatus.dos',
                    '风险评测题目': base+'questionnaire/subjectList.dos',
                    '风险评测结果': base+'questionnaire/submitAnswer.dos',
                    '首次评测提交': base+'questionnaire/add.dos',
                    '周排行-投资排行信息': base+'week/weekRankingInfo.dos',
                    'host666': base+'host/status.do',
                    '申请解绑卡': base+'bank/applyUnbindBank.dos',
                    '会员福利日-中奖用户列表': base+'activity/getPrizeWinnerList.do',
                    '会员福利日-活动奖品列表': base+'activity/getAwardList.do',
                    '会员福利日-用户抽奖信息': base+'activity/getLotteryInfo.do',
                    '会员福利日-抽奖': base+'activity/LotteryAward.do',
                    '会员福利日-我的奖品': base+'activity/getOwnerAwards.do',
                    '会员福利日-分享': base+'activity/shareGetSize.do',
                    '加息卡': base+'warmSpring/gainCard.dos',
                    '三级邀请': base+'invite/myInvites.dos'
                };
                return urls[name];
            }
        })
});