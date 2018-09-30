angular.module("webapp").directive('clainValidate', ['$compile', function($compile) {
    return {
        restrict: "A",
        scope: {
            validateData:"=",
            validate: "=",
            message:"@"
        },
        replace: true,
        transclude:true,
        template: [
            '<div class="clain-validate">',
            '<span ng-transclude></span>',
            '<div class="pgjtipbox">',
            '<div>{{message}}</div>',
            '<ul></ul>',
            '</div>',
            '</div>',
        ].join(""),
        link: function(scope, element, attr) {
        	var str="";
        	var name=element.find("input").attr('name');
        	for(var i=0;i<scope.validate.length){
        		str+='<li><i class="clain-validate-icon" ng-class="{';
        		var error="",right="";
        		for(var j=0;j<scope.validate[i].values.length;j++){
        			error+='validateData["'+name+'"].$error.'+scope.validate[i].values[j];
        			right+='!validateData["'+name+'"].$error.'+scope.validate[i].values[j];
        			if(j<scope.validate[i].values.length-1){
        				error+='||';
        				right+='&&';
        			}
        		}
        		str+='error:('+error+')&&validateData["'+name+'"].$dirty,right:('+right+')}';
        		str+='"></i>'+scope.validate[i].text+'</li>';
        	}
        	element.find("ul").html(str);
        	$compile(element.find('ul'))($scope);
        }
    }
}]);
