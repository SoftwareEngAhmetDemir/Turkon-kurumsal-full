/*
 *
 * Application Breakpoints Plugin
 * 2017-11-03
 *
 * Copyright 2017 Medyasoft
 * Licensed under the MIT license
 *
 */
!(function(root, factory) {
    'use strict';

    if ( typeof define === 'function' && define.amd ) {
        // AMD. Register as an anonymous module.
        define(['app', 'jquery'], factory);
    } else if ( typeof exports === 'object' ) {
        // Node/CommonJS
        module.exports = factory(require('app'), require('jquery'));
    } else {
        // Browser globals
        root.APP = root.APP || {};
        factory(root.APP, root.jQuery);
    }
}(this, function(APP, $) {
    'use strict';

    var breakpoints = (function() {

        var MODULE = {};

        var DEFAULTS = {
            attachOnInit: true,
            bps: {
                md: 480,
                sm: 320,
                xs: 0
            }
        };

        var Helper = {
            isString: function(obj) {
                return $.type(obj) === 'string';
            },
            isElement: function(obj) {
                return !!$.type(obj).match(/^html([a-z]*)element$/);
            },
            isInteger: function(obj) {
                return Number(obj) === obj && obj % 1 === 0;
            },
            debounce: function(func, wait, immediate) {

                var timeout;

                return function() {

                    var args = [],
                        len = arguments.length;

                    while ( len-- ) {
                        args[ len ] = arguments[len];
                    }


                    var context = this;

                    clearTimeout(timeout);
                    timeout = setTimeout(function () {

                        timeout = null;

                        if ( !immediate ) {
                            func.apply(context, args);
                        }
                    }, wait);

                    if ( immediate && !timeout ) {
                        func.apply(context, args);
                    }
                };
            }
        };

        var options = {},
            currentSize = null,
            currentPoint = null;

        var getSize = function() {

            return $(window).width();
        };

        var getPoint = function(point) {

            var bps = options.bps;

            var s = getSize(),
                c = '',
                v, b;


            for (var k in bps) {

                if ( Object.prototype.hasOwnProperty.call(bps, k) ) {

                    v = bps[k];
                    b = bps[c] || 0;

                    if (v >= b && s >= v) {
                        c = k;
                    }
                }
            }

            return Helper.isString(point) && Helper.isNumeric(bps[point]) ? point === c : c;
        };

        var event = {
            resize: function(size, winDim) {

                $(MODULE).trigger({
                    type: 'resize.viewport',
                    payload: {
                        size: size,
                        winDim: winDim
                    }
                });
            },
            change: function(size, point) {

                size = size || currentSize;
                point = point || currentPoint;

                $(MODULE).trigger({
                    type: 'change.viewport',
                    payload: {
                        size: size,
                        point: point
                    }
                });
            }
        };

        var update = function(/* e */) {

            var newPoint = getPoint(),
                isChanged = currentPoint !== newPoint;

            currentPoint = newPoint;
            currentSize = getSize();

            isChanged && event.change(currentSize, currentPoint);
            event.resize(currentSize, {
                w: currentSize,
                h: $(window).height()
            });
        };

        var init = function(opts) {

            options = $.extend(true, DEFAULTS, opts);

            currentPoint = getPoint();
            currentSize = getSize();

            options.attachOnInit && $(window).on('resize', Helper.debounce(update, 50));
        };


        $.extend(MODULE, {
            DEFAULTS: DEFAULTS,
            init: init,
            getSize: getSize,
            getPoint: getPoint,
            update: update,
            getCurrentSize: function() {
                return currentSize;
            },
            getCurrentPoint: function() {
                return currentPoint;
            }
        });

        return MODULE;
    }());


    $.extend(true, APP, {
        breakpoints: breakpoints
    });

    return breakpoints;
}));
