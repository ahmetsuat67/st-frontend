// if < then 768
// mobile sorting overlay pure JavaScript start
const mediaQuerymobile = window.matchMedia("(max-width: 892.98px)");


// mobile sorting overlay pure JavaScript end

// mobile filter pure JavaScript start
document.querySelector('.filter-btn').addEventListener('click', function () {
  document.querySelector('.sidebar').classList.add('open');
  document.body.classList.add('overflow-hidden', 'vh-100');
});

document.querySelector('.filter-close-btn').addEventListener('click', function () {
  document.querySelector('.sidebar').classList.remove('open');
  document.body.classList.remove('overflow-hidden', 'vh-100');
});
// mobile filter pure JavaScript end

// sidebar sticky
const mediaQuerySM = window.matchMedia('(min-width: 892px)');
// if > then = to 768
if (mediaQuerySM.matches) {
  // sidebar sticky function
  var sidebar = new StickySidebar('.sidebar', {
    topSpacing: 80,
    bottomSpacing: 20,
    containerSelector: '.main-content',
    innerWrapperSelector: '.sidebar__inner'
  });
}
