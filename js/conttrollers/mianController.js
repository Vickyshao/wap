/* 
 * @Author: lee
 * @Date:   2016-01-10 23:28:00
 * @Last Modified by:   Ellie
<<<<<<< HEAD
 * @Last Modified time: 2018-01-26 11:26:48
=======
 * @Last Modified time: 2018-01-23 10:14:57
>>>>>>> 3b6ab0f6e92a97fa53b979a2334f57090c89ff97
 */

'use strict';
define([
	'conttrollers/controllerHome',
	'conttrollers/controllerSign',
	'conttrollers/controllerRegister',
	'conttrollers/zhuceCtrl',
	'conttrollers/findPwdCtrl',
	'conttrollers/controllerH5Register',
	'conttrollers/myaccountCtrl',
	'conttrollers/indexCtrl',
	'conttrollers/controllerNewhand',
	'conttrollers/controllerCpList',
	'conttrollers/shiMingRenZhengConttroller',
	'conttrollers/authRechargeCtrl',
	'conttrollers/moreCtrl',

	'conttrollers/getCashCtrl',
	'conttrollers/appGetcashCtrl',
	'conttrollers/minxiController',

	'conttrollers/investmentCtrl',
	'conttrollers/appInvestmentController',
	'conttrollers/hbopenCtrl',
	'conttrollers/payPWFromController',
	'conttrollers/couponCtrl',
	'conttrollers/myCouponCtrl',
	'conttrollers/rechargeCtrl',
	'conttrollers/rechargesucController',
	'conttrollers/myassetsCtrl',
	'conttrollers/myInvestCtrl',
	'conttrollers/myInvitationCtrl',
	'conttrollers/myInfoCtrl',
	'conttrollers/myBankCtrl',
	'conttrollers/myMessageCtrl',
	'conttrollers/znMessageCtrl',
	'conttrollers/tradepwdCtrl',
	'conttrollers/pwdCtrl',
	'conttrollers/app/CP080Ctrl',
	'conttrollers/spiderCtrl',
	'conttrollers/inviteCtrl',
	'conttrollers/activity/cp124Ctrl',
	'conttrollers/sendmaskCtrl',
	'conttrollers/auntCtrl',
	'conttrollers/aqbzCtrl',
	'conttrollers/newcomerCtrl',
	'conttrollers/NewRegisterController',
	'conttrollers/flwhzCtrl',
	'conttrollers/mycashedCtrl',
	'conttrollers/specialCtrl',
	'conttrollers/myActivityCtrl',
	'conttrollers/myActivityRewardsCtrl',
	'conttrollers/activityPersonCtrl',
	'conttrollers/activity/hlsbt',
	'conttrollers/activity/inviteFriend1',
	'conttrollers/activity/inviteFriend2',
	'conttrollers/activity/inviteFriend3',
	'conttrollers/activity/inviteFriend4',
	'conttrollers/activity/inviteFriend5',
	'conttrollers/activity/inviteFriend6',
	'conttrollers/activity/inviteFriendTri',
	'conttrollers/activity/investStartCtrl',
	'conttrollers/myMissionCtrl',
	// 新年活动
	'conttrollers/activity/newyearController',
	// 新年活动一
	'conttrollers/activity/newyearact1Controller',
	// 新年活动分享页
	'conttrollers/activity/newyearshareController',
	// 2018春节活动
	'conttrollers/activity/chunjie2018Ctrl',

	// 活动聚合页
	'conttrollers/actListController',
	'conttrollers/activity/friendReg',
	'conttrollers/appdownload',
	'conttrollers/app2download',
	'conttrollers/activity/yuebiao',
	'conttrollers/investSuccess',
	'conttrollers/continuedInvest',
	// 双蛋活动
	'conttrollers/shuangdanController',
	'conttrollers/shuangdanshareController',
	// 砸蛋活动
	'conttrollers/egg/dropEggCtrl',
	'conttrollers/egg/eggSuccessCtrl',
	// 抽奖活动
	'conttrollers/lottery/lotteryCtrl',
	'conttrollers/lottery/lotteryInvestCtrl',
	'conttrollers/cjhdcplistController',
	// 组队活动
	'conttrollers/zudui/myTeamCtrl',
	'conttrollers/zudui/zdShareCtrl',
	'conttrollers/zudui/zdActivityCtrl',
	// 投即送活动
	'conttrollers/tjsController',
	'conttrollers/mytjsController',
	'conttrollers/tjswishController',
	'conttrollers/tjsaddressController',
	'conttrollers/tjsdetailController',
	'conttrollers/giftyyController',
	'conttrollers/prizedetailController',
	// 长城宽带
	'conttrollers/changcheng2Controller',
	// 体验金
	'conttrollers/tyjController',
	// 'conttrollers/tyjRegSuccessController',
	'conttrollers/myTyjController',
	'conttrollers/tyjdetailController',
	'conttrollers/tyjSuccessController',
	// 媒体报道
	'conttrollers/reportController',
	// 元宵活动
	'conttrollers/activity/yuanxiaoController',
	// 投资送体验金活动
	'conttrollers/activity/investShareCtrl',
	// 新手标推广页
	// 'conttrollers/activity/newhandregController',
	// iPhone7推广页
	'conttrollers/activity/iPhoneadController',
	// 注册专题页
	'conttrollers/activity/pullNewCtrl',
	// 注册专题页2引导投资
	'conttrollers/activity/newToInvestCtrl',
	// 企业形象推广页
	'conttrollers/activity/promoteController',
	// chedao推广页
    'conttrollers/activity/chedaoCtrl',
	// SEM送话费活动
    'conttrollers/activity/billGiftCtrl',
    'conttrollers/activity/commonSemCtrl',
    // 新手注册页 注册成功
    'conttrollers/activity/tyjRegSuccessController',
	// 新体验金推广页
	'conttrollers/activity/newhandRankController',
	// 垂直管理推广页
	// 'conttrollers/activity/czgladController',
	// 投即送推广页
	'conttrollers/activity/tjsadController',
	// 小米推广页
	'conttrollers/activity/xiaomiadController',
	// 开放日报名页
	'conttrollers/kfrEnrolController',
	// 邀请好友分享注册页
	'conttrollers/friendregController',
	// 开通银行存款帐户
	'conttrollers/setDepositoryController',
	'conttrollers/myDepositoryController',
	// 优惠券温馨提示
	'conttrollers/reminderController',
	// iPhone活动页
	'conttrollers/activity/iPhoneController',
	// app2翻牌
	'conttrollers/activity/app2lotteryController',
	'conttrollers/activity/iphonelistCtrl',
	'conttrollers/activity/fanliCtrl',
	'conttrollers/activity/opendayController',
	'conttrollers/activity/publicWelfareController',
	'conttrollers/activity/newtyj2Controller',
    // 电商渠道
    'conttrollers/reimburse/eCommerceCtrl',
    'conttrollers/reimburse/reimburseCtrl',
    'conttrollers/reimburse/stagingCtrl',
	// 518理财节
	'conttrollers/activity/festival518Controller',
    'conttrollers/activity/creditRating',

	'conttrollers/activity/onestopController',
	// 端午节活动
	'conttrollers/activity/dragonboatController',
    // 2018新年活动
    'conttrollers/activity/newYearWController',
    // 恩弗活动
    'conttrollers/enfu/enfuActivityCtrl',
	// 优选理财列表页
	'conttrollers/normalcplistController',
	// 活动标列表页
	'conttrollers/activitycplistController',
	// 专属产品列表页
	'conttrollers/exclusiveListCtrl',
	'conttrollers/exclusivecpListCtrl',
	// 聚划算列表页
	'conttrollers/jhscplistController',
	// 存管介绍页
	'conttrollers/introducedepController',
	// 登录组件js
	'conttrollers/loginTempCtrl',
    // 微信引导
	'conttrollers/wechatWelfare/welfareCtrl',
	//发布会专题页
	'conttrollers/activity/conferenceCtrl',
    // 发现
    'conttrollers/find/findCtrl',
    // 客服中心
    'conttrollers/find/serviceCenterCtrl',
    // 关于沪深---现改为信息披露
    'conttrollers/find/showInfoCtrl',
    // 尾标奖详情
    'conttrollers/activity/tailawardCtrl',
	// 浮动窗口
	'conttrollers/floatMenu',
	'../../framework/jquery.AshAlom.gaugeMeter-2.0.0.min',
    // 服务器升级公告
    'conttrollers/serviceUpgradeCtrl',
    // 周排行榜
    'conttrollers/weekRanking/weekRankingCtrl',
    // host
    'conttrollers/hostCtrl',
	//会员福利日
    'conttrollers/memberWelfare/memberWelfareCtrl',
    // 解绑银行卡
    'conttrollers/unbindingBankCtrl',
    // 贴息
    'conttrollers/interestSubsidy/interestSubsidy',
    // 电子合同介绍页
    'conttrollers/eContractIntroCtrl',
	// 三级邀请
    'conttrollers/thirdInvitation/thirdInvitation'

], function () {
});


