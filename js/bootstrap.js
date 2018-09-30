/* 
* @Author: lee
* @Date:   2016-01-10 23:52:03
* @Last Modified by:   anchen
* @Last Modified time: 2016-01-12 16:31:37
*/

'use strict';

define(['require',
        'angular',
        'jweixin',
        'jquery',
        'angular-route',
        'angular-resource',
        'app', 
        'router'
       ],function(require,angular,wx,$){
            'use strict';
            require(['domReady!'],function(document){
                angular.bootstrap(document,['webapp']);
            });
        });