
// let footercerez = $('.cerez-footer');

// $('.footer-btn').on('click', function() {
//     'use strict';
//     localStorage.setItem('okundu', true);
//     footercerez.addClass('d-none');
// });
// if (localStorage.getItem('okundu')) {
//     footercerez.addClass('d-none');
// }

let footercerez = document.querySelector('.cerez-footer');
let footerbtn = document.querySelector('.footer-btn');

footerbtn.onclick = function() {
    'use strict';
    localStorage.setItem('okundu', true);
    footercerez.classList.add('d-none');
};
if (localStorage.getItem('okundu')) {
    footercerez.classList.add('d-none');
}

document.querySelectorAll('.accordion .accordion-item')[0].onclick = function() {
    'use strict';
    document.getElementById('iframe1').classList.remove('d-none');
};
