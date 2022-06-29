/*
 * Native validation Plugin
 *
 * Fancybox required!
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

    APP.init.nativeValidation = function (opts) {
        var forms = document.getElementsByClassName('needs-validation');
        var validateClassName = 'was-validated';

        function checkValidate(form, event) {
            var result = form.checkValidity();

            if (result === false) {
                event.preventDefault();
                event.stopPropagation();
                form.classList.remove(validateClassName);
            }
            form.classList.add(validateClassName);
            return result;
        }

        Array.prototype.filter.call(forms, function (form) {

            var $form = $(form);
            var reCaptcha = $form.find('.g-recaptcha');
            var template = $form.data('template');
            var tmpl,
                compiled,
                contentTextPlaceholder;
            var steps = $form.find('fieldset.step'),
                stepIndex = 0,
                hasAjax = $form.hasClass('send-ajax');

            if (template) {
                tmpl = $(template).html();
                compiled = Handlebars.compile(tmpl); // eslint-disable-line
                contentTextPlaceholder = $($(template).data('to'));
            }

            function goToStep(val) {
                $form.removeClass(validateClassName);
                if (val !== -1) {
                    steps.eq(stepIndex + val).removeClass('d-none').removeAttr('disabled');
                    steps.eq(stepIndex).addClass('d-none');
                } else {
                    steps.eq(stepIndex + val).removeClass('d-none');
                    steps.eq(stepIndex).addClass('d-none').attr('disabled', 'disabled');
                }
                
                if (val === 0) {
                    steps.addClass('d-none').attr('disabled', 'disabled');
                } else {
                    stepIndex += val;
                }

                document.documentElement.scrollTop = steps.eq(stepIndex).offset().top;
            }

            form.addEventListener('submit', function (event) {
                var result = checkValidate(form, event),
                    hasNextStep = false;

                if ($form.hasClass('form-wizard')) {
                    var step = steps.filter(':not(.d-none)'),
                        index = step.index();

                    if (hasNextStep = index < (steps.length - 1)) { // eslint-disable-line
                        hasNextStep = true;
                        if (result) {
                            event.preventDefault();
                            event.stopPropagation();
                            goToStep(1);
                        }
                    }
                }

                if (reCaptcha.length > 0) {
                    try {
                        var reCaptchaResult = grecaptcha.getResponse(reCaptcha[0].grecaptcha) !== "";
                        if (result) {
                            result = reCaptchaResult;
                        } else {
                            event.preventDefault();
                            event.stopPropagation();
                        }
    
                        reCaptcha.toggleClass('is-invalid', !reCaptchaResult);
                    } catch (eroor) { }
                }

                if (result && !hasNextStep && hasAjax) {
                    event.preventDefault();
                    event.stopPropagation();

                    $form.find('[type=submit]:last').prop('disabled', true);
                    $form.find('.loading').addClass('show');
                    APP.Helper.sendRequest($form, {
                        url: APP.sanitizeXss(form.action),
                        method: form.method
                    },
                        {},
                        {
                            processData: false,
                            contentType: false
                        }).done(function (e) {
                            if (e.Result) {
                                $form.removeClass(validateClassName);
                                form.reset();
                                while (stepIndex > 0) {
                                    goToStep(-1);
                                }

                                if (template) {
                                    contentTextPlaceholder.append(compiled(e.Data));
                                    var modal = APP.sanitizeXss($form.data('target'));
                                    $(modal).removeClass('d-none');

                                    goToStep(0);
                                } else {
                                    var modal = APP.sanitizeXss($form.data('target'));
                                    var options = {
                                        src: modal,
                                        type: 'inline'
                                    };
                        
                                    $.fancybox.open(options);
                                }
                            } else {
                                $.fancybox.open('<div class="popup-content">' + APP.sanitizeXss(e.ErrorMessage) + '</div>');
                            }

                            $form.find('.loading').removeClass('show');
                            $form.find('[type=submit]:last').prop('disabled', false);
                        }).fail(function() {
                            $form.find('.loading').removeClass('show');
                            $form.find('[type=submit]:last').prop('disabled', false);
                        });
                }

            }, false);

            $form.find('[data-prev="true"]').on('click', function () {
                goToStep(-1);
            });
        });

        window.verifyRecaptchaCallback = function(data) {
            if (data) {
                $('.g-recaptcha').removeClass('is-invalid');
            }
        }
    }

}));
