/*
 *
 * Application Helper Functions
 * 2017-01-20
 *
 * Copyright 2017 Bogac Bokeer
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

    var antiForgeryToken = $('input[name="__RequestVerificationToken"]');

    var Helper = {
        getScriptPath: function(scriptName) {

            if ( typeof scriptName === 'string' ) {
                scriptName = [scriptName];
            }

            var scripts = document.getElementsByTagName('script'),
                script, src, pos;

            for (var idx = 0, l = scripts.length; idx < l; idx++) {

                script = scripts[idx];

                if ( src = script.getAttribute('src') ) { // eslint-disable-line no-cond-assign
                    pos = src.lastIndexOf('/');
                    var n = src.substring(pos + 1).split('?')[0];

                    if ( scriptName.indexOf(n) > -1 ) {
                        return src.replace(/\/js(.*)/, '/js') + '/';
                    }
                }
            }

            return '';
        },
        loadStylesheet: function(url, id) {

            if ( !url ) {
                return;
            }

            id = id || 'theme-styles';

            var s = document.createElement('link');

            s.id = id;
            s.rel = 'stylesheet';
            s.type = 'text/css';
            s.media = 'all';
            s.href = url;

            document.getElementsByTagName('head')[0].appendChild(s);
        },
        loadScript: function(url, cb) {

            var js = document.createElement('script');

            js.type = 'text/javascript';
            // js.async = true;

            js.addEventListener('load', cb.success);
            js.addEventListener('error', cb.failed);

            js.src = url;

            document.body.appendChild(js);

            return js;
        },
        throttle: function(fn, threshhold, scope) {

            threshhold || (threshhold = 250);

            var last,
                deferTimer;

            return function() {

                var context = scope || this;

                var now = +new Date(),
                    args = arguments;

                if ( last && now < last + threshhold ) {
                    // hold on to it
                    clearTimeout(deferTimer);
                    deferTimer = setTimeout(function() {
                        last = now;
                        fn.apply(context, args);
                    }, threshhold);
                } else {
                    last = now;
                    fn.apply(context, args);
                }
            };
        },
        debounce: function(func, wait, immediate) {

            // Returns a function, that, as long as it continues to be invoked, will not
            // be triggered. The function will be called after it stops being called for
            // N milliseconds. If `immediate` is passed, trigger the function on the
            // leading edge, instead of the trailing.

            var timeout;

            return function() {

                var context = this,
                    args = arguments;
                var later = function() {
                    timeout = null;
                    if ( !immediate ) {
                        func.apply(context, args);
                    }
                };
                var callNow = immediate && !timeout;

                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
                if (callNow) {
                    func.apply(context, args);
                }
            };
        },
        curry: function(fn) {

            var slice = Array.prototype.slice,
                storedArgs = slice.call(arguments, 1);

            return function() {

                var newArgs = slice.call(arguments),
                    args = storedArgs.concat(newArgs);

                return fn.apply(null, args);
            };
        },
        tmpl: function(tmpl, obj) {

            var result = tmpl,
                re;

            for (var k in obj ) {
                if ( Object.prototype.hasOwnProperty.call(obj, k) ) {
                    re = new RegExp('{{(' + k + ')}}', 'g');
                    result = result.replace(re, obj[k]);
                    re = null;
                }
            }

            return result;
        },
        formatDate: function(d, f) {

            var is = this.is;

            if ( !is.date(d) ) {
                throw new Error('The first parametre must be a date');
            }

            f = f || 'dd.mm.yyyy';

            if ( !is.string(f) ) {
                throw new Error('The format parametre must be a string');
            }

            var currDate = d.getDate(),
                currMonth = d.getMonth() + 1,
                currYear = d.getFullYear();

            var currDate2 = currDate.toString().length < 2 ? '0' + currDate : currDate,
                currMonth2 = currMonth.toString().length < 2 ? '0' + currMonth : currMonth;

            return f.replace('yyyy', currYear)
                .replace('dd', currDate2)
                // .replace("mmmm", Names.get("months")[currMonth])
                .replace('mm', currMonth2)
                .replace('d', currDate)
                .replace('m', currMonth);
        },
        getSlug: function (url) {

            url = url || APP.sanitizeXss(window.location.pathname);

            return url.split('/').reverse()[0];
        },
        getFormData: function (form, extraData) {
            var data = {};

            if (form) {
                if (form.attr('enctype') === 'multipart/form-data') {
                    var formData = new FormData(form[0]);

                    Object.keys(extraData || {}).forEach(function(key) {
                        formData.append(key, extraData[key]);
                    });
                    return formData;
                }
                data = form.serializeArray().reduce(function (acc, v) {
                    acc[v.name] = v.value;
                    return acc;
                }, {});
            }
            return $.extend(data, extraData);
        },
        sendRequest: function (form, service, extraData, reqOpts) {
            var data = $.extend({
                langId: UNIGATE.current.langId || '',
                language: UNIGATE.current.language || '',
                slug: APP.Helper.getSlug()
            }, extraData);

            if (antiForgeryToken.length) {
                data.__RequestVerificationToken = APP.sanitizeXss(antiForgeryToken.val()); // eslint-disable-line
            }

            var formData = APP.Helper.getFormData(form, data);

            return $.ajax($.extend({
                method: service.method,
                url: APP.sanitizeXss(service.url),
                dataType: 'JSON',
                cache: false,
                data: formData
            }, reqOpts));
        }
    };

    var typeofs = ['number', 'boolean', 'object'],
        sanitizeXssReg = new RegExp(/(\b)(on\S+)(\s*)=|javascript|(<\s*)(\/*)script/ig);

    $.extend(true, APP, {
        Helper: Helper,
        sanitizeXss: function(val) {

            if (val) {

                if (typeofs.indexOf(typeof val) === -1) {

                    val = val.replace(sanitizeXssReg, '');
                    return val;
                } else if (typeof val !== 'function') {

                    return val;
                }
                return '';
            }
            return val;
        }
    });

    return Helper;
}));
