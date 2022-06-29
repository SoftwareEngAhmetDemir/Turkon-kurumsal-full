/*
 *
 * jQuery Form Plugins
 * 2015-11-09
 *
 * Copyright 2015 Bogac Bokeer
 * Licensed under the MIT license
 *
 */
!(function(root, factory) {
    'use strict';

    if ( typeof define === 'function' && define.amd ) {
        // AMD. Register as an anonymous module.
        define(['jquery'], factory);
    } else if ( typeof exports === 'object' ) {
        // Node/CommonJS
        module.exports = factory(require('jquery'));
    } else {
        // Browser globals
        factory(root.jQuery);
    }
}(this, function($) {
    'use strict';

    $.extend($.fn, {
        radiobox: function(opts) {

            var PLUGIN_NAME = 'radiobox';

            var options = $.extend({
                activeClass: 'active',
                disabledClass: 'disabled'
            }, opts);

            var updateTrigger = function($item) {

                if ( !$item ) {
                    return;
                }

                var $label = $item.closest('label');

                $label.toggleClass(options.disabledClass, $item.prop('disabled') || $item.is(':disabled'));
                $label.toggleClass(options.activeClass, $item.prop('checked') || $item.is(':checked'));
            };

            function onChange($item/* , e */) {

                if ( !$item.data(PLUGIN_NAME) ) {
                    return;
                }

                if ( $item.is('[name]') ) {

                    var $itemGroup = $('input[type=radio][name="' + $item.attr('name') + '"]');

                    $itemGroup.filter(function() {
                        return !!$(this).data(PLUGIN_NAME);
                    }).each(function() {
                        updateTrigger($(this));
                    });
                } else {
                    updateTrigger($item);
                }
            }

            var $container = this,
                selector = 'input[type=radio]';

            $container.on('change', selector, function(e) {

                return onChange($(this), e);

            }).on('update.radiobox', selector, function(/* e */) {

                updateTrigger($(this));

            }).find(selector).data(PLUGIN_NAME, true).trigger('update.radiobox');


            return this;
        },
        checkbox: function(opts) {

            var PLUGIN_NAME = 'checkbox';

            var options = $.extend({
                activeClass: 'active',
                disabledClass: 'disabled'
            }, opts);


            var updateTrigger = function($item) {

                if ( !$item ) {
                    return;
                }

                var $label = $item.closest('label');

                $label.toggleClass(options.disabledClass, $item.prop('disabled') || $item.is(':disabled'));
                $label.toggleClass(options.activeClass, $item.prop('checked') || $item.is(':checked'));
            };

            function onChange($item/* , e */) {

                if ( !$item.data(PLUGIN_NAME) ) {
                    return true;
                }

                updateTrigger($item);

                return true;
            }


            var $container = this,
                selector = 'input[type=checkbox]';

            $container.on('change', selector, function(e) {

                return onChange($(this), e);

            }).on('update.checkbox', selector, function(/* , e */) {

                updateTrigger($(this));
            }).find(selector).data(PLUGIN_NAME, true).trigger('update.checkbox');


            return this;
        }
    });

    APP.init.forms = function(/* opts */) {

        var $container = $('body');

        $container.radiobox();
        $container.checkbox();
    };
}));
