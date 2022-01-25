const tep = document.createElement('template');

const renderTemplate = config => {
  const { data, cols } = config;
  return `
    <style>
    :host {
      display: block;
    }
    .card{
        display: grid;
        grid-template-columns: repeat(${cols},1fr);
      }
    .item{
        text-align: center;
        width: auto;
    }
    .item a{
        display:inline-block;
        text-decoration: none;
        outline: none;
        transition: all .25s ease-in-out;
        overflow: hidden;
        border-radius: 3px;
    }
    .item > a img{
        width: 100%;
        object-fit: cover;
        aspect-ratio: 14/19;
    }
    .item > a img:hover{
        -webkit-transform: scale(1.05); 
        -ms-transform: scale(1.05);
        transform: scale(1.05);

    }
    .item a.title{
      text-decoration: none;
      color: #282828;
      outline: none;
      margin-bottom: 8%;
    }
    .item a.title:hover{
      color: #de53a6;
    }
    </style>
    <div class="card">
        ${data.map((item) => `
        <div class="item">
            <a href='#'>
                <img src='' data-src="${item.link}" alt="加载中">
            </a>
            <a class='title' href=''>
                ${item.desc}
            </a>
        </div>
        `).join('')
    }
    </div>
  `
}
class PosterItem extends HTMLElement {
  constructor() {
    super();
    this.state = {
      num: 0,
      imgs: null
    }
    this.attachShadow({
      mode: 'open'
    });
    this.lazyload = this.lazyload.bind(this);
    this.debounce = this.debounce.bind(this);
    this.handleLazyLoad = this.handleLazyLoad.bind(this);
  }
  disconnectedCallback(){
    window.removeEventListener("scroll", this.handleLazyLoad, false);
  }
  connectedCallback() {
    const url = this.getAttribute('data-url');
    const cols = this.getAttribute('data-cols');
    if (url) {
      fetch(url).then((res) => res.json()).then((data) => {
        if (data) {
          this.state = {
            data,
            cols
          }
          tep.innerHTML = renderTemplate(this.state)
          this.shadowRoot.append(tep.content.cloneNode(true))
          this.state.imgs = this.shadowRoot.querySelector('.card').getElementsByTagName('img')
          this.state.num = 0;
          this.lazyload();
          window.addEventListener("scroll", this.handleLazyLoad, false);

        }
      }).catch(console.error)
    }
  }
  handleLazyLoad(){
    this.debounce(this.lazyload, 600)()
  }
  // 防抖函数
  debounce(fn, delay = 500) {
    let timer = null;
    return function (...args) {
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        fn.call(this, args);
      }, delay);
    };
  }
  lazyload() {
    let { imgs, num } = this.state;
    if (num + 1 < imgs.length) {
      const viewHeight = window.innerHeight;
      for (let i = num; i < imgs.length; i++) {
        const distance = viewHeight - imgs[i].getBoundingClientRect().top;
        // 如果可视区域高度大于等于元素顶部距离可视区域顶部的高度，说明元素露出
        if (distance >= 0) {
          imgs[i].src = imgs[i].getAttribute("data-src");
          // 前i张图片已经加载完毕，下次从第i+1张开始检查是否露出
          this.state.num = i + 1;
        }
      }
    } else {
      console.log('first');
      window.removeEventListener("scroll", this.handleLazyLoad, false);
    }
  }
}
if (!customElements.get('ui-poster-item')) {
  window.customElements.define('ui-poster-item', PosterItem);

}