/*
 *
 * Application Helper.is Functions
 * 2017-01-20
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

    var is = {
        string: function(obj) {
            return Object.prototype.toString.call(obj) === '[object String]';
        },
        number: function(obj) {
            return Object.prototype.toString.call(obj) === '[object Number]';
        },
        integer: function(obj) {
            return parseFloat(obj) === parseInt(obj, 10) && !isNaN(obj);
        },
        boolean: function(obj) {
            return typeof obj === 'boolean' && obj.constructor === Boolean;
        },
        float: function(value) {
            return value === +value && value !== (value | 0);
        },
        array: $.isArray,
        function: $.isFunction,
        plainObject: $.isPlainObject,
        object: function(obj) {
            return obj && obj.constructor && obj instanceof Object;
        },
        objectLike: function(value) {
            return typeof value === 'object' && value !== null;
        },
        arguments: function(obj) {
            return !!(obj && Object.prototype.hasOwnProperty.call(obj, 'callee'));
        },
        regexp: function(obj) {
            return Object.prototype.toString.call(obj) === '[object RegExp]';
        },
        element: function(obj) {

            var result;

            try {
                result = obj instanceof HTMLElement;
            } catch (e) {
                result = typeof obj === 'object' && obj.nodeType === 1 && typeof obj.style === 'object' && typeof obj.ownerDocument === 'object';
            }

            return result;
        },
        date: function(obj) {
            return Object.prototype.toString.call(obj) === '[object Date]';
        },
        'undefined': function(obj) { // eslint-disable-line quote-props
            return typeof obj === 'undefined';
        },
        empty: function(obj) {

            if ( obj === null ) {
                return true;
            }

            if ( this.is.array(obj) || this.is.string(obj)) {
                return obj.length === 0;
            }

            for (var key in obj) {
                if ( Object.prototype.hasOwnProperty.call(obj, key) ) {
                    return false;
                }
            }

            return true;
        },
        exists: function(what, ns, typed) {

            if ( !what || typeof what !== 'string' ) {
                return null;
            }

            ns = ns || window;
            typed = typed || null;
            what = what.split('.');

            var isExists = false,
                subns;

            while ( what.length > 1 && typeof ns === 'object' ) {
                subns = what.shift();
                ns = ns[subns];
            }

            if ( typeof ns === 'object' ) {
                what = what.shift();
                what = ns[what];
                isExists = typed ? typeof what === typed : typeof what !== 'undefined';
            }

            this.exists.lastValue = isExists ? what : null;

            return isExists;
        }
    };

    APP.Helper = APP.Helper || {};

    $.extend(true, APP.Helper, {
        is: is
    });

    return is;
}));
