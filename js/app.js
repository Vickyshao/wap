define(["angular",
         'conttrollers/mianController'
         ,'ngInfiniteScroll'
         ,'angular-qrcode'
       ],function(angular){
    return angular.module("webapp",['ui.router','ngStorage','webapp.controllers','ngResource','ngDialog','angular-md5','infinite-scroll','monospaced.qrcode','widget.scrollbar']);
})