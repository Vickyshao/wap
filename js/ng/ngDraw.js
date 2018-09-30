define(["angular","app","jquery"
       ],function(angular){
    return angular.module("webapp").directive('ngDraw',['$compile','$timeout',function($compile,$timeout){
	return {
		restrict: "A",
		scope:{
			drawdata:"=",
			drawvalue:"="
		},
		link:function(scope,element,attr){
			var str='';
			if(scope.drawdata){
				if(scope.drawdata.indexOf(scope.drawvalue)!=-1){
					str=scope.drawdata.replace(scope.drawvalue,'<font color="red">'+scope.drawvalue+'</font>');
				}else{
					str=scope.drawdata;
				}
				element.html(str);
				$compile(element)(scope);
			}
		}
	}
}]);
})