require.config({
    paths:{
        //一些库文件
        'jquery': '../framework/jquery-1.9.1',
        'angular': '../framework/angular-1.3.0.14/angular.min',
        'angular-route': '../framework/angular-ui-router',
        'domReady': '../framework/domReady',
        'ngStorage': "../framework/ngStorage.min",
        'angular-resource': "../framework/angular-resource.min",
        'md5js': "../framework/md-5",
        'SHR256': "../framework/SHR256",
        'ngInfiniteScroll': "../framework/ngInfiniteScroll",
        'gagaka': "../framework/lucky-card.min",
        // 'weixin': "../framework/weixin_1",
        //js文件
        'bootstrap': "bootstrap",
        'app': "app",
        'filter': "./filters/filter",
        'urlFilters': "./filters/urlFilters",
        'ngdialog': "./ng/dialog/ngDialog",
        'router': "router",
        'ngScrollTop':"./ng/ngScrollTop",
        'ngDraw':"./ng/ngDraw",
        'jweixin':'../framework/jweixin-1.0.0',
        'qrcode':'../framework/qrcode',
        'angular-qrcode':'../framework/angular-qrcode',
        'swiper':'../framework/swiper.min',
        'ngscrollbar':'../framework/ngscrollbar',
        'xue':'../framework/xue',
        'ngTouch':'./ng/ngTouch',
        'gaugeMeter':'../framework/jquery.AshAlom.gaugeMeter-2.0.0.min',
        'radialIndicator':'../framework/radialIndicator',
        'video.min':'../framework/video.min',
        'videojs-contrib-hls':'../framework/videojs-contrib-hls',
        'countup':'../framework/jquery.countup.min',
        'waypoints':'../framework/jquery.waypoints.min',
        'angular-animate':'../framework/angular-animate'
    },
    shim:{
        'angular':{
            exports:'angular'
        },
        'angular-route':{
            deps:['angular','ngStorage','ngdialog','ngScrollTop','ngDraw','angular-qrcode','ngTouch'],
            exports: 'angular-route'
        },
        'angular-resource':{
            deps:['angular'],
            exports: 'angular-resource'
        },
        'angular-qrcode':{
            deps:['angular']
        },
        'app':{
            deps:['ngscrollbar']
        },
        'ngscrollbar':{
            deps:['angular']
        },
        'ngTouch':{
            deps:['app']
        },
        'gaugeMeter': {
            deps:['jquery']
        }
    },
    deps:['bootstrap','jweixin','qrcode','swiper']
    //urlArgs: "bust=" + (new Date()).getTime()  //防止读取缓存，调试用
});