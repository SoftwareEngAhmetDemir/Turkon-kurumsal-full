/*
 * Get Paged Data Plugin
 *
 * HandleBars required!
 */
/* eslint-disable */
!(function (root, factory) {
    'use strict';

    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['app', 'jquery'], factory);
    } else if (typeof exports === 'object') {
        // Node/CommonJS
        module.exports = factory(require('app'), require('jquery'));
    } else {
        // Browser globals

        root.APP = root.APP || {};
        root.APP.init = root.APP.init || {};

        factory(root.APP, root.jQuery);
    }
}(this, function (APP, $) {
    'use strict';

    APP.init.getPagedData = function (opts) {
        var options = $.extend({}, opts);
    
        function showMore(target, template, settings) {
    
            var isExtend = false;
            var currentPageIndex = 2;
            var container = $(target);
            var showMoreBtn = $('[data-target="' + APP.sanitizeXss(target.data('showmore')) + '"]');
            var showMoreBtnInnerHtml = showMoreBtn.html();
    
            var tmpl = $(template).html();
            var compiled = Handlebars.compile(tmpl); // eslint-disable-line
    
            function setItem(data) {
                if (!data.result) {
                    container.append('<div class="col-12"><div class="alert alert-warning">' + data.errorMessage + '</div></div>');
                    showMoreBtn.addClass('d-none');
                    return;
                }
    
                currentPageIndex++;
    
                for (var i = 0; i < data.items.length; i++) {
                    var compiledHtml = compiled(data.items[i]);
    
                    compiledHtml = compiledHtml.replace('class="', 'class="fadeInDown ');
                    container.append(compiledHtml);
                }
    
                if (isExtend === false && currentPageIndex > 1) {
                    isExtend = true;
                    showMoreBtn.removeClass('d-none');
                }
    
                // no data fix
    
                if (!APP.Helper.is.undefined(data.nextData)) {
                    showMoreBtn[data.nextData !== true ? 'addClass' : 'removeClass' ]('d-none');
                }
            }
    
            function sendViaAjax() {
                var dt = { page: currentPageIndex },
                    form = $(settings.toForm || APP.sanitizeXss(showMoreBtn.data('form')));
    
                showMoreBtn.prop('disabled', true).html(options.btnLoadingText);
    
                var formData = APP.Helper.getFormData(form);
    
                if (formData.page) {
                    dt.page = formData.page;
                    currentPageIndex = formData.page;
                }
    
                return APP.Helper.sendRequest(form, settings, dt).done(function (data) {
                    setItem(data);
    
                    showMoreBtn.prop('disabled', false).html(showMoreBtnInnerHtml);
    
                    APP.init.popups(CONFIG.popups);
                }).catch(function() {
                    // TODO: LOG HERE
                });
            }
    
            showMoreBtn.click(function(e) {
                e.preventDefault();
                sendViaAjax();
            });
        }
    
        $('[data-showmore]').each(function () {
    
            var type = APP.sanitizeXss($(this).data('showmore')),
                opts = options[type] || {},
                template = APP.sanitizeXss($(this).data('template'));
    
            opts.url = !opts.url ? APP.sanitizeXss($(this).data('url')).split('|')[0] : opts.url;
            opts.method = !opts.method ? APP.sanitizeXss($(this).data('url')).split('|')[1] || 'GET' : opts.method;
    
            showMore($(this), template, opts);
        });
    }

}));
