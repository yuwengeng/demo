const lineNav = document.createElement('div');
lineNav.className = ("nav-wrapper");
document.querySelector('.wrapper').appendChild(lineNav);
const navObserver = new IntersectionObserver(function (entries) {
  const entry = entries[0];
    if (!entry.isIntersecting){
      lineNav.style.visibility ='initial'
    }else{
      lineNav.style.visibility ='hidden'
  
    }
})
navObserver.observe(document.querySelector('.nav-box'))
// 监听lineNav 

 var smartNav = function (elements, options) {
  var defaults = {
      nav: null
  };

  var params = Object.assign({}, defaults, options || {});

  if (typeof elements == 'string') {
      elements = document.querySelectorAll(elements);
  }
  
  if (!elements.forEach) {
      return;
  }

  // 导航元素创建，如果没有
  if (!params.nav) {
      params.nav = document.createElement('div');
      params.nav.className = 'title-nav-ul';
      document.body.appendChild(params.nav);
  }

  var lastScrollTop = document.scrollingElement.scrollTop;

  var zxxObserver = new IntersectionObserver(function (entries) {
      if (params.isAvoid) {
          return;
      }
      entries.reverse().forEach(function (entry) {
          if (entry.isIntersecting && entry.boundingClientRect.top >= window.innerHeight / 2 && entry.boundingClientRect.bottom<=window.innerHeight / 2) {
              entry.target.active();  
          } else if (entry.target.isActived) {
              entry.target.unactive();  
          }
      });

      lastScrollTop = document.scrollingElement.scrollTop;
  },);
/**
 * {
    rootMargin: '-33% 0% -33% 0%'
}
 */
  elements.forEach(function (ele, index) {
      var id = ele.id || ('smartNav' + Math.random()).replace('0.', '');
      ele.id = id;
      // 导航元素创建
      var eleNav = document.createElement('a');
      eleNav.href = '#' + id;
      eleNav.className = 'title-nav-li';
      eleNav.innerHTML = ele.textContent;
      params.nav.appendChild(eleNav);
      ele.active = function () {
          // 对应的导航元素高亮
          eleNav.parentElement.querySelectorAll('.active').forEach(function (eleActive) {
              ele.isActived = false;
              eleActive.classList.remove('active');
          });
          eleNav.classList.add('active');
          ele.isActived = true;
      };
      ele.unactive = function () {
          if (document.scrollingElement.scrollTop > lastScrollTop) {
              elements[index + 1] && elements[index + 1].active();
          } else {
              elements[index - 1] && elements[index - 1].active();
          }
          eleNav.classList.remove('active');
          ele.isActived = false;
      };

      // 观察元素
      zxxObserver.observe(ele);
  });
  window.addEventListener('scroll', function () {
    var root = document.scrollingElement;
    if (root.scrollTop + root.clientHeight > root.scrollHeight - 1) {
        elements[elements.length - 1].active();
    }
});
  params.nav.addEventListener('click', function (event) {
      var eleLink = event.target.closest('a');
      // 导航对应的标题元素
      var eleTarget = eleLink && document.querySelector(eleLink.getAttribute('href'));
      if (eleTarget) {
          event.preventDefault();
          // Safari不支持平滑滚动
          eleTarget.scrollIntoView({
              behavior: "smooth",
              block: 'center'
          });

          if (CSS.supports('scroll-behavior: smooth')) {
              params.isAvoid = true;
              setTimeout(function () {
                  eleTarget.active();
                  params.isAvoid = false;
              }, Math.abs(eleTarget.getBoundingClientRect().top  - window.innerHeight / 2) / 3);
          } else {
              eleTarget.active();
          }            
      }
  });
};
window.addEventListener('DOMContentLoaded',()=>smartNav('.section h1', { nav: lineNav }));
