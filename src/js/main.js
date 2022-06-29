/*
 *
 * Application Main
 *
 */

!(function (APP) {

    'use strict';

    var breakpoint = 768;

    $.extend(true, APP, {
        breakpoint: breakpoint,
        init: {
            dropfile: function() {
                const txtArea = $('.file-textArea');
                let validExtentions = ['jpeg', 'jpg', 'png', 'svg', 'webp', 'pdf',
                    'document', 'text', 'mp4', 'mp3', 'wmv', 'flv', 'webcam', 'msword', 'txt', 'docx'];
                const area = $('.drop-c');

                if (txtArea === 'undefined' || txtArea === null) {
                    return;
                }
                txtArea.on('click', function() {
                    let btn = $('.getFile');

                    btn.click();
                });

                var allfiles = [];
                let fileNames = [];

                function dropOrClick(files) {
                    allfiles = [...files];
                    let filesTemp = [...allfiles];

                    filesTemp.map((e, index)=>{
                        if (e.size / (1024 * 1024) > 2) {
                            $('.invalid-msg-size').css({ display: 'block' });
                            $('.invalid-msg-extention').css({ display: 'none' });
                            allfiles.splice(index, 1);
                        } else if (!validExtentions.includes(e.name.slice(e.name.lastIndexOf('.') + 1))) {
                            $('.invalid-msg-extention').css({ display: 'block' });
                            $('.invalid-msg-size').css({ display: 'none' });
                            allfiles.splice(index, 1);
                        } else {
                            $('.invalid-msg-size').css({ display: 'none' });
                            $('.invalid-msg-extention').css({ display: 'none' });
                            fileNames.push(e.name);
                        }
                    });
                    allfiles = [...filesTemp];

                    var template = $('.template').html();

                    var rendered = window.Mustache.render(template, { data: fileNames } );

                    $('.target').html( rendered);

                }
                $('.getFile').on('change', function (e) {
                    if (e.target.files.length > 0) { dropOrClick( e.target.files); }

                });

                area.on('dragover', (event) => {
                    event.preventDefault();
                });
                area.on('drop', (e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    if (e.originalEvent.dataTransfer.files[0].name) { dropOrClick(e.originalEvent.dataTransfer.files); }
                });
            },
            faqSerach: function () {
                var $form, opts, template;

                template = $('#faq-template').html();
                $form = $('#searchForm');
                if (!$form.length) {
                    return;
                }
                if ($form.attr('service-url')) {
                    opts = {
                        method: $form.attr('service-method') || 'GET',
                        url: $form.attr('service-url')
                    };
                }
                var allquastion = $('#accordion').html();

                var debounce = APP.Helper.debounce(function () {
                    APP.Helper.sendRequest($form, opts)
                        .done(function(data) {
                            console.log(data);
                            if (data.result) {
                                var rendered = window.Mustache.render(template, data);

                                $('#accordion').html(rendered);
                            } else {
                                // $('#accordion').html(data.data);


                                var temp = $('#err-msg').html();
                                var rendered2 = window.Mustache.render(temp, data );

                                $('#accordion').html(rendered2);
                            }
                        })
                        .fail(function (response) {
                            console.log(response);
                            console.log('ahmed');
                            // var temp = $('#err-msg').html();
                            // var rendered2 = window.Mustache.render(temp, { errormsg: response.data });

                        });
                }, 1000);

                $('#search-sss').on('keyup', function(event) {
                    if (event.target.value.length === 0) {
                        $('#accordion').html(allquastion);
                        var temp = $('#err');

                        temp.css({ display: 'none' });
                    } else {
                        debounce();
                    }
                }
                );
            },
            asideBar: function () {
                const Body = $('body .general-content');

                let BodyHeight = Body.height();

                if (BodyHeight <= 600) {
                    $('.aside .card-aside').not(':first-child').css({ display: 'none' });
                } else if (BodyHeight > 600 && BodyHeight <= 1020) {
                    $('.aside .card-aside:nth-child(3)').css({ display: 'none' });
                }
            },
            form: function () {
                var tel = $('.phone');

                if (tel) { tel.inputmask(); }

                var checkboxf = $('.form-c').find('.form-check');

                checkboxf.on('click', function(e) {
                    let checkBox = this.querySelector('input[type="checkbox"]');
                    let checked = checkBox.checked;
                    let submitbtn = $('.front-form-btn');

                    if (e.target.nodeName === 'LABEL') {
                        checkBox.checked = !checked;
                    }
                    submitbtn.prop('disabled', !$('input[value="kvkk"]').is(':checked'));
                });
            },
            kgLb: function () {
                const btnKgLb = $('#btn-kg-lb');
                const kg = $('#kg');
                const lb = $('#lb');

                btnKgLb.on('click', function () {
                    kg.toggleClass('d-none');
                    lb.toggleClass('d-none');
                });
            },
            menu: function () {
                var btn = $('.navbar-toggler');

                btn.on('click', function () {
                    $(this)
                        .find('i')
                        .toggleClass('ms-icon-menu-mobile')
                        .toggleClass('ms-icon-gobackarrow');
                });
            },
            videoislemleri: function () {
                const play = `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="red" stroke="black">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1
                     1 0 000-1.664l-3-2z" clip-rule="evenodd" />
                </svg>`;
                const pause = `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="black">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>`;
                const sound = `
                <svg class='sound-btn-img' xmlns="http://www.w3.org/2000/svg" fill="red" viewBox="1 1 24 24" stroke="red">
                    <path class='sound-btn-img' stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                </svg>
                `;
                const mute = `
                <svg class='sound-btn-img' xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="red" viewBox="0 0 24 24" stroke="red">
                        <path class='sound-btn-img' stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" clip-rule="evenodd" />
                        <path class='sound-btn-img' stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                        </svg>
                `;
                let videoContainerClicked = false;

                function playVideo(e) {

                    const videoContainer = e.target.closest('.video-container');
                    const playButton = videoContainer.querySelector('.video-player').querySelector('.controls').querySelector('.play-button');

                    const video = videoContainer.querySelector('.video-tag');
                    const controls = videoContainer.querySelector('.video-player').querySelector('.controls');
                    const timeline = controls.querySelector('.timeline');

                    if (!videoContainerClicked) {
                        if (video.paused) {
                            video.play();
                            videoContainer.classList.add('playing');
                            playButton.innerHTML = pause;
                            videoContainer.querySelector('.buyuk-play-btn').style.display = 'none';
                        } else {
                            video.pause();
                            videoContainer.classList.remove('playing');
                            playButton.innerHTML = play;
                            videoContainer.querySelector('.buyuk-play-btn').style.display = 'block';
                        }
                    }
                    video.ontimeupdate = function () {
                        const percentagePosition = 100 * video.currentTime / video.duration;

                        timeline.style.backgroundSize = `${percentagePosition}% 100%`;
                        timeline.value = percentagePosition;
                    };
                    timeline.addEventListener('change', function () {
                        const time = timeline.value * video.duration / 100;

                        video.currentTime = time;

                    });

                }
                // eslint-disable-next-line complexity
                document.addEventListener('click', function (e) {
                    let playButton = e.target.closest('.play-button');
                    let videoTag = e.target.className;

                    if (e.target.className === 'sound-btn-img' || e.target.getAttribute('class') === 'sound-btn-img') {
                        const videoContainer = e.target.closest('.video-container');
                        const soundButton = videoContainer.querySelector('.video-player').querySelector('.controls').querySelector('.sound-button');
                        const video = videoContainer.querySelector('.video-tag');


                        video.muted = !video.muted;
                        soundButton.innerHTML = video.muted ? mute : sound;

                    }



                    if (e.target.className === 'full-screen-img') {
                        const videoContainer = e.target.parentElement.closest('.video-container');
                        const isFullScreen = false;
                        const video = videoContainer.querySelector('.video-tag');

                        if (!isFullScreen) {
                            if (video.requestFullscreen) {
                                video.requestFullscreen();
                            } else if (video.msRequestFullscreen) { /* IE11 */
                                video.msRequestFullscreen();
                            } else if (video.RequestFullscreen) {
                                video.requestFullscreen();
                            }
                        } else {
                            if (video.exitFullscreen) {
                                video.exitFullscreen();
                            }
                        }
                    }

                    if (videoTag.toString().includes( 'img-buyuk-btn') || videoTag === 'video-tag') {

                        playVideo(e);


                    }
                    if (playButton) {
                        if (playButton.className.includes('play-button')) {
                            playVideo(e);
                        }
                    }

                });
            }
        },

        INIT: function (options) {
            // APP init

            options = options || {};

            var fn;

            for (var i in this.init) {
                if (
                    Object.prototype.hasOwnProperty.call(this.init, i) && i.charAt(0) !== '_' && typeof(fn = this.init[i]) === 'function'
                ) {
                    fn.call(this, options && options[i] || options);
                }
            }

            return this;
        }
    });
})(window.APP = window.APP || {});

$(function () {
    'use strict';

    APP.browser = (function () {
        var is = APP.Helper.is,
            val,
            tmp,
            userAgent = APP.sanitizeXss(navigator.userAgent);

        var browser = {
            mobile: !!/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile/i.test(
                userAgent
            ),
            ios: !!/iPhone|iPad|iPod/i.test(userAgent),
            ie: (tmp = userAgent.toLowerCase().match(/MSIE ([^;]+)|rv:(11)\.[0-9]+/i)) ? parseInt(tmp[1] || tmp[2], 10) : false,
            edge:
        (tmp = userAgent.indexOf('Edge/')) > 0 ? parseInt(
            userAgent.substring(tmp + 5, userAgent.indexOf('.', tmp)),
            10
        ) : false,
            bp: function () {
                return $(window).width() < APP.breakpoint;
            }
        };

        var $el = $('html'); // document.documentElement

        for (var k in browser) {
            if (Object.prototype.hasOwnProperty.call(browser, k)) {
                val = browser[k];

                if (val && !is.function(val)) {
                    $el.addClass(k);
                    if (!is.boolean(val)) {
                        $el.addClass(k + val);
                    }
                }
            }
        }

        APP.browser = browser;

        return browser;
    })();
    APP.scriptPath = APP.Helper.getScriptPath([
        'app.js',
        'app.min.js',
        'main.js'
    ]);

    APP.Helper.loadScript(APP.scriptPath + 'config.js', {
        success: function () {
            APP.INIT(CONFIG);
        },
        failed: function () {
            APP.INIT();
        }
    });
});
