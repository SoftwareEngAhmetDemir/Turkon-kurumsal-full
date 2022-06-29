/*
 *
 * jQuery Carousel Plugins
 * 2021-24-03
 *
 * Licensed under the MIT license
 *
 */
!(function (root, factory) {
    'use strict';

    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['jquery'], factory);
    } else if (typeof exports === 'object') {
        // Node/CommonJS
        module.exports = factory(require('jquery'));
    } else {
        // Browser globals
        factory(root.jQuery);
    }
}(this, function ($) {
    'use strict';

    APP.carousel = {
        defaults: {
            base: {
                arrows: false,
                lazyLoad: 'ondemand',
                fade: false
            },
            main: {
                autoplay: true,
                autoplaySpeed: 7000,
                slidesToShow: 1,
                slidesToScroll: 1,
                arrows: true,
                dots: true,
                responsive: [
                    {
                        breakpoint: APP.breakpoint,
                        settings: {
                            dots: true,
                            arrows: false,
                            autoplay: false
                        }
                    }
                ]
            },
            igrow: {
                autoplay: true,
                autoplaySpeed: 7000,
                slidesToShow: 1,
                slidesToScroll: 1,
                arrows: true,
                dots: false,
                responsive: [
                    {
                        breakpoint: APP.breakpoint,
                        settings: {
                            dots: false,
                            arrows: false,
                            autoplay: false
                        }
                    }
                ]
            },
            triple: {
                slidesToShow: 3,
                slidesToScroll: 1,
                arrows: true,
                dots: false,
                responsive: [
                    {
                        breakpoint: APP.breakpoint,
                        settings: {
                            dots: false,
                            arrows: false,
                            slidesToShow: 1,
                            slidesToScroll: 1
                        }
                    }
                ]
            },
            preview: {
                slidesToShow: 1,
                slidesToScroll: 1,
                arrows: true,
                dots: false
            },
            navigation: {
                slidesPerRow: 3,
                slidesToScroll: 1,
                rows: 3,
                arrows: false,
                dots: true,
                infinite: false,
                counter: true
            },
            links: {
                slidesPerRow: 5,
                slidesToScroll: 1,
                rows: 3,
                arrows: true,
                infinite: false
            }
        },
        getOptions: function ($slick, $carousel) {

            var root = APP.carousel,
                appOptions = root.options;

            var typeData = APP.sanitizeXss($slick.data('slickType')),
                types = typeData ? typeData.split(',') : [],
                options = $.extend(true, {}, root.defaults.base),
                type;

            types.length && $carousel.addClass('slider-' + types[0]);

            while (types.length) {

                type = types.shift();

                if (root.defaults[type]) {
                    $.extend(true, options, root.defaults[type]);
                }
            }

            if (appOptions && appOptions[type]) {
                $.extend(true, options, appOptions[type]);
            }

            $.extend(true, options, {
                prevArrow: $carousel.find('.slick-prev'),
                nextArrow: $carousel.find('.slick-next')
            });

            if (options.dots && $carousel.find('.dots').length > 0) {
                $.extend(options, {
                    appendDots: $carousel.find('.dots')
                });
            }

            return options;
        },
        types: {
            linked: function ($carousel) {

                var root = APP.carousel;

                var $slickFor = $carousel.find('[data-slick-role=for]').eq(0),
                    $slickNav = $carousel.find('[data-slick-role=nav]').eq(0);

                $slickNav.on('click', function (e) {
                    e.preventDefault();
                });

                var slickForOpts = root.getOptions($slickFor, $carousel),
                    slickNavOpts = root.getOptions($slickNav, $carousel);

                $.extend(slickForOpts, {
                    asNavFor: $slickNav,
                    prevArrow: $carousel.find('.slick-prev'),
                    nextArrow: $carousel.find('.slick-next')
                });

                $.extend(slickNavOpts, {
                    asNavFor: $slickFor
                });

                $slickFor.slick(slickForOpts);
                $slickNav.slick(slickNavOpts);
            },
            indexed: function ($carousel) {

                if (APP.browser.bp()) {
                    return;
                }

                var root = APP.carousel,
                    sliderCounter;

                var $slickFor = $carousel.find('[data-slick-role=for]').eq(0),
                    $slickNav = $carousel.find('[data-slick-role=nav]').eq(0);

                var slickForOpts = root.getOptions($slickFor, $carousel),
                    slickNavOpts = root.getOptions($slickNav, $carousel);

                var groupIndex,
                    slickNavObj,
                    slickForObj,
                    lastVals = {
                        nav: {
                            slideIndex: 0,
                            change: false
                        },
                        for: {
                            slideIndex: 0,
                            change: false
                        }
                    };

                $.extend(slickNavOpts, {
                    prevArrow: $slickNav.parent().find('.slick-prev'),
                    nextArrow: $slickNav.parent().find('.slick-next')
                });

                $.extend(slickForOpts, {
                    prevArrow: $slickFor.parent().find('.slick-prev'),
                    nextArrow: $slickFor.parent().find('.slick-next')
                });

                function getGroup() {

                    var slick = $slickFor.slick('getSlick'),
                        slides = slick.$slides,
                        group = [],
                        groupIndex = [],
                        groupIndexWithEl = [];

                    slides.each(function (i, el) {

                        var $el = $(el),
                            index = APP.sanitizeXss($el.data('groupIndex')) || APP.sanitizeXss($el.find('[data-group-index]').data('groupIndex').toString());

                        index = parseInt(index, 10);

                        if (group.indexOf(index) < 0) {
                            group.push(index);
                            groupIndex.push(i);
                        }

                        groupIndexWithEl.push([i, index]);
                    });

                    return [group, groupIndex, groupIndexWithEl];
                }

                function beforeChange(event, slick, currentSlide, nextSlide) { // Alt

                    if (!lastVals.nav.change) {

                        var gotoIndex = groupIndex[2][nextSlide][1];
                        lastVals.for.change = true;

                        if (slickNavOpts.rows && slickNavOpts.rows > 1) {
                            var oneSlideCount = slickNavOpts.rows * slickNavOpts.slidesPerRow;
                            var slideIndex = parseInt(groupIndex[2][nextSlide][1] / oneSlideCount, 10);
                            gotoIndex = slideIndex;
                            slickNavObj.$slider.find('[data-group-index]').removeClass('active').eq(groupIndex[2][nextSlide][1]).addClass('active');
                        }

                        slickNavObj.slickGoTo(gotoIndex);
                        lastVals.nav.slideIndex = gotoIndex;

                        lastVals.nav.change = false;
                    } else {
                        lastVals.nav.change = false;
                    }
                }

                function beforeChangeNav(event, slick, currentSlide, nextSlide) { // Üst

                    if (!lastVals.for.change) {
                        lastVals.nav.change = true;
                        slickForObj.slickGoTo(groupIndex[1][nextSlide]);
                    }

                    lastVals.for.change = false;
                }

                function updateSliderCounter(slick) {
                    $(sliderCounter).text((slick.slickCurrentSlide() + 1) + ' / ' + slick.slideCount);
                }

                if (slickNavOpts.centerMode && $slickNav.children().length < slickNavOpts.slidesToShow) {
                    slickNavOpts.centerMode = false;
                    slickNavOpts.init = function () {
                        slickNavObj.$slides.on('click', function () {
                            var index = APP.sanitizeXss($(this).data('slickIndex'));

                            lastVals.for.change = false;
                            beforeChangeNav(null, slickNavObj, -1, index);
                        });
                    };
                }

                if (slickNavOpts.counter) {
                    $carousel.append($('<div class="slick-counter">'));
                    sliderCounter = $carousel.find('.slick-counter');

                    $slickFor.on('init', function (event, slick) {
                        updateSliderCounter(slick);
                    });

                    $slickFor.on('afterChange', function (event, slick, currentSlide) {
                        updateSliderCounter(slick, currentSlide);
                    });
                }

                $slickNav.slick(slickNavOpts);
                $slickFor.slick(slickForOpts);

                $slickFor.on('beforeChange', beforeChange);

                if (!(slickNavOpts.rows && slickNavOpts.rows > 0)) {
                    $slickNav.on('beforeChange', beforeChangeNav);
                }

                slickNavObj = $slickNav.slick('getSlick');
                slickForObj = $slickFor.slick('getSlick');
                groupIndex = getGroup();

                slickNavObj.$slider.find('[data-group-index]').on('click', function () {

                    var index = APP.sanitizeXss($(this).data('groupIndex'));

                    slickForObj.slickGoTo(index);
                });

                if (slickNavOpts.rows && slickNavOpts.rows > 1) {
                    slickNavObj.$slider.find('[data-group-index]').eq(0).trigger('click');
                }
            }
        },
        init: function () {

            var root = APP.carousel;

            var $carousel = $(this),
                carouselType = APP.sanitizeXss($carousel.data('carouselType'));

            if ($.isFunction(root.types[carouselType])) {
                root.types[carouselType]($carousel);
                return;
            }

            var $slick = $carousel.find('[data-slick]').eq(0),
                options = root.getOptions($slick, $carousel);

            if (APP.sanitizeXss($slick.data('initbreakpoint'))) {
                if (APP.browser.bp()) { // Mobile
                    $slick.slick(options);
                }
            } else {
                $slick.slick(options);
            }
        }
    };

    APP.init.carousel = function (opts) {

        var root = APP.carousel;

        root.options = $.extend({}, opts);

        $('.carousel').on('click', '.slick-prev, .slick-next', function (e) {
            e.preventDefault();
        }).each(root.init);
    };
}));
