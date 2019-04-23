angular.module("ng-context-menu",[]).factory("ngContextMenu",["$q","$http","$timeout","$compile","$templateCache","$animate","$rootScope","$controller",function(t,e,n,o,r,a,i,l){return function(n){function u(t,e,n){return this.target=t,h&&e&&f(e),g.then(function(t){return $&&$.remove(),c(t,e),n&&$.css(n),$.appendTo(x),a.enabled(!1,$),$})}function c(t,e){if(x=angular.element(n.container||document.body),$=angular.element(t),0===$.length)throw new Error("The template contains no elements; you need to wrap text nodes");h=i.$new(),e&&f(e);var r=l(v,{$scope:h});d&&(h[d]=r),o($)(h)}function f(t){for(var e in t)h[e]=t[e]}function p(t){$&&$.css(t)}function s(e){var n=t.defer();return $?(h.$destroy(),n.resolve(),$.remove(),this.target&&!e&&this.target.focus(),$=null):n.resolve(),n.promise}function m(){return!!$}if(!(!n.template^!n.templateUrl))throw new Error("Expected context menu to have exacly one of either `template` or `templateUrl`");var g,h,v=(n.template,n.controller||angular.noop),d=n.controllerAs,$=null,x=null;if(n.template){var b=t.defer();b.resolve(n.template),g=b.promise}else g=e.get(n.templateUrl,{cache:r}).then(function(t){return t.data});return{open:u,close:s,active:m,reposition:p}}}]).directive("hasContextMenu",["$injector","$window","$parse","$timeout","$animate",function(t,e,n,o){return{restrict:"A",link:function(n,r,a){function i(t){var e={},n=angular.element(t),o=n[0].getBoundingClientRect();return e.top=o.top,e.left=o.left,e}function l(t,e){var n={};return n.offsetY=e.top-t.top,n.offsetX=e.left-t.left,n}function u(t){var e=i(t.target),n=p(t),r=$.open(t.target,x,s(t));v=t.target,d=l(e,n),r.then(function(t){t.hide(),o(function(){t.show(0,function(){c(t,n),angular.element(t).trap()})},0,!1)})}function c(t,e){var n={top:b.scrollTop(),left:b.scrollLeft()};n.right=n.left+b.width(),n.bottom=n.top+b.height();var o=t.offset();o.right=o.left+t.outerWidth(),o.bottom=o.top+t.outerHeight(),n.right<o.right&&t.css("left",e.left-t.outerWidth()),n.bottom<o.bottom&&t.css("top",e.top-t.outerHeight())}function f(){$.close()}function p(t){var e={};if(t.pageX&&t.pageY)e.top=Math.max(t.pageY,0),e.left=Math.max(t.pageX,0);else{var n=angular.element(t.target)[0].getBoundingClientRect();e.top=Math.max(n.bottom,0),e.left=Math.max(n.left,0)}return e}function s(t){var e=p(t);return e.top+="px",e.left+="px",e}function m(t){t.preventDefault(),t.stopPropagation(),n.$apply(function(){u(t)})}function g(){n.$apply(function(){f()})}function h(t){$.active()&&2!==t.button&&g()}var v,d,$=t.get(a.target),x={},b=angular.element(e),y=a.triggerOnEvent||"contextmenu";if(a.locals){var w=a.locals.split(",").map(function(t){return t.trim()});angular.forEach(w,function(t){x[t]=n[t]})}r.bind(y,function(t){m(t)}),r.bind("keyup",function(t){121===t.keyCode&&t.shiftKey&&t.altKey&&($.active()||m(t))}),b.bind("click",h),b.bind(y,h),b.bind("keyup",function(t){$.active()&&27===t.keyCode&&g()}),b.on("resize",function(){if(v){var t=i(v),e={top:t.top+d.offsetY,left:t.left+d.offsetX};$.reposition(e),lastTargetPosition=t}})}}}]);