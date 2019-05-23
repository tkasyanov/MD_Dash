App.directive('tile', function () {
      return {
            restrict: 'AE',
            replace: false,
            scope: '=',
            templateUrl: 'tile.html',
            link: function ($scope, $el, attrs) {}
      }
});

App.directive('camera', function () {
      return {
            restrict: 'AE',
            replace: true,
            scope: {
                  item: '=item',
                  entity: '=entity',
                  freezed: '=freezed'
            },
            link: function ($scope, $el, attrs) {
                  var $i = 0;
                  var photoUrl = null;
                  var refresh = $scope.item.refresh || false;
                  var current = null;
                  var prev = null;

                  if (typeof refresh === "function") refresh = refresh();

                  var appendImage = function (url) {
                        var el = document.createElement('div');

                        if (url) el.style.backgroundImage = 'url(' + url + ')';

                        el.style.backgroundSize = $scope.item.bgSize || 'cover';

                        $el[0].appendChild(el);

                        if (prev) $el[0].removeChild(prev);

                        setTimeout(function () {
                              el.style.opacity = 1;
                        }, 100);

                        prev = current;
                        current = el;
                  };

                  var getPhotoUrl = function () {
                        if ($scope.item.filter) {
                              return $scope.item.filter($scope.item, $scope.entity)
                        }

                      if (typeof objs[$scope.item.id.name]=="object" && $scope.item.property !=null) {
                          return '/modules/thumb/thumb.php?&url='+window.btoa(objs[$scope.item.id.name][$scope.item.property])+'&username='+objs[$scope.item.id.name]["cameraUsername"]+'&password='+objs[$scope.item.id.name]["cameraPassword"]+'&transport='+objs[$scope.item.id.name]["streamTransport"];
                      }

                        return null;
                  };

                  var reloadImage = function () {
                        if (!photoUrl) return;

                        if ($i > 1 && $scope.freezed) return;

                        var url = photoUrl;

                        url += (url.indexOf('?') === -1 ? '?' : '&') + ('_i=' + $i++);

                        appendImage(url)
                  };

                  var setPhoto = function (url) {
                        photoUrl = url;

                        if (!photoUrl) return;

                        reloadImage();
                  };

                  var updatePhoto = function () {
                        var newUrl = getPhotoUrl();

                        if (photoUrl !== newUrl) setPhoto(newUrl);
                  };

                  $scope.$watch('item', updatePhoto);
                  $scope.$watch('entity', updatePhoto);

                  if (refresh) {
                        var interval = setInterval(reloadImage, refresh);

                        $scope.$on('$destroy', function () {
                              clearInterval(interval);
                        });
                  }
            }
      }
});

App.directive('cameraThumbnail', function () {
      return {
            restrict: 'AE',
            replace: true,
            scope: {
                  item: '=item',
                  entity: '=entity',
                  freezed: '=freezed'
            },
            link: function ($scope, $el, attrs) {
                  var refresh = 'refresh' in $scope.item ? $scope.item.refresh : 2000;

                  if (typeof refresh === "function") refresh = refresh();

                  var throttle = refresh ? refresh * 0.9 : 100;
                  var lastUpdate = 0;
                  var current = null;
                  var prev = null;

                  var appendImage = function (url) {
                        var el = document.createElement('div');

                        if (url) el.style.backgroundImage = 'url(' + url + ')';
                        el.style.backgroundSize = $scope.item.bgSize || 'cover';

                        $el[0].appendChild(el);

                        if (prev) $el[0].removeChild(prev);

                        setTimeout(function () {
                              el.style.opacity = 1;
                        }, 100);

                        prev = current;
                        current = el;
                  };

                  var reloadImage = function () {
                        if (Date.now() - lastUpdate < throttle) return;

                        if (lastUpdate && $scope.freezed) return;

                        lastUpdate = Date.now();

                        if ($scope.entity.state === "off") return;

                        // Api.send({
                        //             type: "camera_thumbnail",
                        //             entity_id: $scope.entity.entity_id
                        //       },
                        //       function (res) {
                        //             if (!res.result) return;

                        // var url = 'data:' + res.result.content_type + ';base64,' + res.result.content;
                      if (typeof objs[$scope.item.id.name]=="object" && $scope.item.property !=null) {
                          appendImage(objs[$scope.item.id.name][$scope.item.property]);
                      }

                        //       });
                  };

                  $scope.$watch('item', reloadImage);
                  $scope.$watch('entity', reloadImage);

                  if (refresh) {
                        var interval = setInterval(reloadImage, refresh);

                        $scope.$on('$destroy', function () {
                              clearInterval(interval);
                        });
                  }
            }
      }
});


App.directive('clock', ['$interval', function ($interval) {
      return {
            restrict: 'AE',
            replace: true,
            link: function ($scope, $el, attrs) {
                  var $m = document.createElement('div');
                  var $h = document.createElement('div');
                  var $colon = document.createElement('div');
                  var $postfix = document.createElement('div');

                  $m.classList.add('clock--m');
                  $h.classList.add('clock--h');

                  $postfix.classList.add('clock--postfix');

                  $colon.classList.add('clock--colon');
                  $colon.textContent = ":";

                  var updateTime = function () {
                        var d = new Date();
                        var h = d.getHours();
                        var m = d.getMinutes();
                        var postfix = '';

                        h = leadZero(h);


                        $h.textContent = h;
                        $m.textContent = leadZero(m);
                        $postfix.textContent = postfix;
                  };

                  $el[0].appendChild($h);
                  $el[0].appendChild($colon);
                  $el[0].appendChild($m);
                  $el[0].appendChild($postfix);

                  updateTime();

                  var interval = setInterval(updateTime, 1000);

                  $scope.$on('$destroy', function () {
                        clearInterval(interval);
                  });
            }
      }
}]);


App.directive('iframeTile', ['$interval', function ($interval) {
      return {
            restrict: 'A',
            replace: false,
            scope: {
                  item: '=iframeTile',
            },
            link: function ($scope, $el, attrs) {
                  var iframe = $el[0];

                  var updateIframe = function () {
                        iframe.src = iframe.src;
                  };

                  if ($scope.item.refresh) {
                        var time = $scope.item.refresh;

                        if (typeof time === "function") time = time();

                        time = Math.max(1000, time);

                        var interval = setInterval(updateIframe, time);

                        $scope.$on('$destroy', function () {
                              clearInterval(interval);
                        });
                  }

            }
      }
}]);



App.directive('headerItem', ['$interval', function ($interval) {
      return {
            restrict: 'AE',
            replace: false,
            scope: '=',
            templateUrl: 'header-items.html',
            link: function ($scope, $el, attrs) {

            }
      }
}]);


App.directive('date', ['$interval', function ($interval) {
      return {
            restrict: 'AE',
            replace: true,
            scope: {
                  format: '='
            },
            template: '<div class="date" ng-bind="date|date:format"></div>',
            link: function ($scope, $el, attrs) {
                  $scope.format = $scope.format || 'EEEE, LLLL dd';

                  $scope.date = new Date();

                  $interval(function () {
                        $scope.date = new Date();
                  }, 60 * 1000);
            }
      }
}]);


App.directive('onScroll', [function () {
      return {
            restrict: 'A',
            scope: {
                  onScrollModel: '=',
            },
            link: function ($scope, $el, attrs) {
                  var lastScrolledHorizontally = false;
                  var lastScrolledVertically = false;

                  var determineScroll = function () {
                        var scrolledHorizontally = $el[0].scrollLeft !== 0;
                        var scrolledVertically = $el[0].scrollTop !== 0;

                        if (lastScrolledVertically !== scrolledVertically ||
                              lastScrolledHorizontally !== scrolledHorizontally) {
                              $scope.onScrollModel.scrolledHorizontally =
                                    lastScrolledHorizontally = scrolledHorizontally;
                              $scope.onScrollModel.scrolledVertically =
                                    lastScrolledVertically = scrolledVertically;

                              return true;
                        }

                        return false;
                  };

                  determineScroll();

                  $el.on('scroll', function () {
                        if (determineScroll()) {
                              $scope.$apply();
                        }
                  });
            },
      }
}]);
App.directive("uiTimepicker", [ function (moment) {
    return {
    restrict: "EA",

    require: 'ngModel',

    scope: {
        model: '=ngModel',
        item: '=item',
        entity: '=entity',
        value: '=value'
    },

    replace: true,

    template: '<div></div>',

    link: function (scope, element, attrs) {
        var _selection = d3.select(element[0]);

        var _arc = d3.svg.arc().startAngle(180 * (Math.PI / 180)).endAngle(540 * (Math.PI / 180));
        if (typeof scope.item.height !=="undefined" && typeof CONFIG.tileSize!=="undefined")
            var _h = scope.item.height*CONFIG.tileSize;
        else
            var _h = 150;

        if (typeof scope.item.width !=="undefined" && typeof CONFIG.tileSize!=="undefined")
            var _w = scope.item.width*CONFIG.tileSize-160;
        else
            var _w = 150;

        var _h = _w = Math.min(_h,_w);
        var _h = _w = 150;
        var _diameter = _w;

        var _margin = { top:10, right:10, bottom:10, left:10 };
        var _fontSize = 10;

        var _width;
        var _height;
        var _x0;
        var _y0;

        var _minValue = 1;
        var _maxValue = 720;
        var _value = 1;

        var _setAsAM = false;

        _selection.each(function (data) {
            measure();

            var svg = d3.select(this).selectAll("svg").data([data]);

            var enter = svg.enter().append("svg").attr("viewBox","0 0 150 150")
                .attr("class", "x1-timepicker-svg").append("g")
                .attr("transform", "translate(" + _margin.left + "," + _margin.top + ")");


            svg.attr("width", _w).attr("height", _h);

            var background = enter.append("g")
                .attr("class", "x1-timepicker-component");

            var body = background.append("circle")
                .attr("class", "x1-timepicker-inner")
                .attr("transform", "translate(" + _x0 + "," + _y0 + ")")
                .attr("cx", 0)
                .attr("cy", 0)
                .attr("r", _width / 2);

            var slider = background.append("path")
                .attr("transform", "translate(" + _x0 + "," + _y0 + ")")
                .attr("d", _arc);

            var arcContainer = enter.append("g")
                .attr("class", "x1-timepicker-arcs");

            var selectedArc = arcContainer.append("path")
                .attr("class", "arc")
                .attr("transform", "translate(" + _x0 + "," + _y0 + ")")
                .attr("d", _arc);

            // ---------- labels for the picker ------------------------------------------
            var labels = enter.append("g")
                .attr("class", "x1-timepicker-labels");

            var labelSendAt = labels.append("text")
                .attr("class", "title")
                .attr("x", _x0)
                .attr("y", _width / 4.2 + _fontSize / 3)
                .attr("width", _width)
                .text("Temp")
                .style("font-size", (_fontSize * 0.4) + "px");

            var labelTime = labels.append("text")
                .attr("class", "time")
                .attr("x", _x0)
                .attr("y", _y0 + _fontSize / 3)
                .attr("width", _width)
                .style("font-size", (_fontSize * 1.4) + "px");

            var labelAMPM = labels.append("text")
                .attr("class", "ampm")
                .attr("cursor", "pointer")
                .attr("x", _x0)
                .attr("y", _width / 1.4 + _fontSize / 3)
                .attr("width", _width)
                .style("font-size", (_fontSize * 0.6) + "px")
                .text(attrs.title)
                .on("click", function () {
                    scope.$apply();
                });

            // ---------- slider handler ------------------------------------------
            var drag = d3.behavior.drag().on("drag", function () {
                var eventX = d3.event.x;
                var eventY = d3.event.y;

                // --------------------------
                var _C = Math.PI * _width;

                var ox = 0;
                var oy = 0;

                var ax = 0;
                var ay = _height / 2;

                var bx = eventX - _width / 2;
                var by = _height / 2 - eventY;

                var k = (by - oy)/(bx - ox);

                var angel = Math.abs(Math.atan(k) / (Math.PI / 180));
                var targetAngel = 0;

                if (bx > 0 && by >= 0) {
                    targetAngel = 90 - angel;
                } else if (bx >= 0 && by < 0) {
                    targetAngel = 90 + angel;
                } else if (bx < 0 && by <= 0) {
                    targetAngel = 270 - angel;
                } else if (bx <= 0 && by > 0) {
                    targetAngel = 270 + angel;
                }

                _value = _maxValue * (targetAngel / 360);



                scope.$apply(function(){
                    setCurrent(selectedArc, handler, labelTime, labelAMPM);
                });
            });

            var handler = enter.append("g").append("circle")
                .attr("class", "x1-timepicker-handler")
                .attr("cursor", "pointer")
                .attr("transform", "translate(" + _x0 + "," + _y0 + ")")
                .attr("cx", 0)
                .attr("cy", 0)
                .attr("r", 10)
                .attr("fill", "#FFFFFF")
                .call(drag);

            // ---------- set the init value from ng-model ----------------------------------------------
            var updateValue = function () {

               // alert((temp_min+(temp_max-temp_min)*Math.round((ratio-0.5)*100)/100));
                //_value = ;

                _value=720*((1/(40-10))*(scope.value-10));
            _value=_value-360;

                setCurrent(selectedArc, handler, labelTime, labelAMPM);
          };

           updateValue();


            scope.$watch("model", function () {
                updateValue();
            });
        });



        function measure () {
            _width = _height = _diameter - _margin.right - _margin.left;
            _x0 = _y0 = _width / 2;
            _fontSize = _width * .2;
            _arc.outerRadius(_width / 2);
            _arc.innerRadius(_width / 2 * .85);
        }

        function setCurrent (selectedArc, handler, labelTime, labelAMPM) {
            // set the selected arc
            var ratio = Math.min((_value - _minValue) / (_maxValue - _minValue), 1);
            var ratio_temp= ratio;
            if (ratio<0.5) ratio=ratio+1;

            var endAng = (Math.min(360 * ratio, 540)) * Math.PI / 180;
            _arc.endAngle(endAng);
            selectedArc.attr("d", _arc);

            // set the handler position
            var oAngel = 360 * _value / _maxValue;
            var r = _width / 2 - 5;
            var x = r * Math.cos((oAngel - 90) * Math.PI / 180);
            var y = r * Math.sin((oAngel - 90) * Math.PI / 180);
            handler.attr('cx', x).attr('cy', y);
            var temp_min=10;
            var temp_max=40;
            labelTime.text(temp_min+(temp_max-temp_min)*Math.round((ratio-0.5)*100)/100);

        }

    }
};
}]);
