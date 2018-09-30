define(["angular","app","jquery"
       ],function(angular){
    return angular.module("webapp").directive('ngScrolltop',['$timeout','$interval',function($timeout,$interval){
	return {
		restrict: "A",
		scope:{
			ngScrolltopSpeed:"@"
		},
		link:function(scope,element,attr){
			
			if(!scope.ngScrolltopSpeed){scope.ngScrolltopSpeed=60;}
			var timer;
			$timeout(function(){
				 timer= $interval(function(){
				 	var elm=$(element[0]);
				 	var top=parseInt(elm.css('margin-top'));
				 	if(top>-parseInt(elm.height())+parseInt(elm.parent().height())-parseInt(elm.css("padding-top"))-parseInt(elm.css("padding-bottom"))){
						elm.css({"margin-top":top-1});
				 	}else{
				 		elm.css({"margin-top":0});
				 	}
				},scope.ngScrolltopSpeed);
			})
			scope.$on("$destroy", function() {
                if (timer) {
                    $interval.cancel(timer);
                }
            });
		}
	}
}]);
})