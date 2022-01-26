const tep = document.createElement('template');
let dataSource = [
  {
    label: '1',
    desc: '新春走军营 | 帅!看“飞鲨”凌云出击',
    link: 'assets/images/swiper-imgs/6c4b9041a6d3218ad7974e.jpg'
  },
  {
    label: '2',
    desc: '新春走军营 | 直击现场！南部战区海军开展实战化训练',
    link: 'assets/images/swiper-imgs/6c4b9041a6d3217c4f0510.jpg'
  },
  {
    label: '3',
    desc: '新春走军营这些“新变化”温暖边防言兵们的心',
    link: 'assets/images/swiper-imgs/6c4b9041a6d32189e39c14.jpg'
  },
  {
    label: '4',
    desc: '组图 | 全军部队迅速掀起新年度实战化训练热潮',
    link: 'assets/images/swiper-imgs/6c4b9041a6d32166033c08.jpg'
  },
  {
    label: '5',
    desc: '战鹰振翅 搏击长空 | 空军航空兵某团跨昼夜飞行训练影像',
    link: 'assets/images/swiper-imgs/6c4b9041a6d3216744002c.gif'
  }
]
// const DEFAULT_PROPS = {
//   SPEED: 3,
//   MODE: "MODE_ALTERNATE",
// }
const renderTemplate = config => {
  // const { label, content, image } = config.data;
  return `
    <style>
    #container {
      position: relative;
      height: 200px;
      margin: 0 auto;
      overflow: hidden;
      border-radius: 4px;
    }

    #banner_bg {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      scroll-behavior: smooth;
    }
    #container .slide {
      position: absolute;
      top: 0;
      left: 0;
      z-index: 0;
      opacity: 0;
      display: inline-block;
      width: 100%;
      height: 100%;
      overflow: hidden;
      transition: all 1s;
  }
  #container .slide:nth-child(1) {
    z-index: 1;
    opacity: 1;
  }
  #container .slide img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: fill;
  }
    .banner_control {
      position: absolute;
      bottom: 0;
      left: 0;
      margin: 0;
      text-align:center;
      width:100%;
      display: flex;
      z-index: 2;
      list-style: none;
      padding: 0;
    }
    .description {
      width: inherit;
      line-height: 1.5;
      background: rgba(0,0,0,0.7);
      transition: all 1s;
      box-sizing: border-box;
      padding: 1.1vw;
      color: white;
      border-right: 1px solid #252323;
    }
    .descBox{
      width: 100%;
      height: 100%;
      text-decoration: none;
      outline: none;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }
    .banner_control .description:nth-child(1) {
      background: rgb(14,13,13);
    }
    </style>
    <div id="container">
      <div id="banner_bg">
        ${config.data.map((item) => {
    return `
            <a href="#" class='slide'>
              <img class="carouselItem" height="240px" width="100%" src=${item.link}
              alt=${item.label} />     
            </a>
            `
  }).join('')
    }
      </div>
      <ul class="banner_control">
        ${config.data.map((item, index) => `
          <li class="description" id=${index}>
            <a class="descBox">${item.desc}</a>
          </li>
          `).join('')
    }
      </ul>
    </div>
  `
}
class CarouselComponent extends HTMLElement {
  constructor() {
    super();
    this.state = {
      index: 0,
      length: 0,
      data: dataSource
    };
    this.attachShadow({
      mode: 'open'
    });
    this.autoPlay = this._autoPlay.bind(this);
    this.handleLeave = this.handleLeave.bind(this)
    this.handleHover = this.handleHover.bind(this)
    this.setBannerInterval = this.setBannerInterval.bind(this)

  }
  connectedCallback() {
    tep.innerHTML = renderTemplate(this.state)
    this.shadowRoot.append(tep.content.cloneNode(true))
    const images = this.shadowRoot.getElementById('banner_bg');
    this.state.length = images.children.length
    this.setBannerInterval();

    const container = this.shadowRoot.getElementById('container');
    container.addEventListener('mouseover', this.handleHover, false)
    container.addEventListener('mouseleave', this.handleLeave, false)

  }
  disconnectedCallback() {
    this.timer && clearInterval(this.timer)
  }
  // static get observedAttributes() {
  //   return ['e-button-type', 'e-button-text']
  // }
  // attributeChangedCallback() {

  // }
  _autoPlay(focus) {
    const { index, length } = this.state;
    if (!focus) {
      if (index >= length) {
        this.state.index = 1;
        // console.log('ling',this.state.index);
        // clearInterval(this.timer)
      } else {
        this.state.index += 1;
      }
    }
    const slides = this.shadowRoot.querySelectorAll('.slide');
    const dots = this.shadowRoot.querySelectorAll('.description');
    slides.forEach((item, i) => {
      // console.log('_autoPlay',this.state.index,i,length);
      if (i === this.state.index) {
        return item.style.opacity = 1;
      }
      return item.style.opacity = 0;
    });
    dots.forEach((item, i) => {
      if (i === this.state.index) {
        return item.style.backgroundColor = 'rgb(14,13,13)'
      }
      return item.style.backgroundColor = 'rgba(0,0,0,0.7)';
    });
    if (this.state.index === length) {
      slides[0].style.opacity = 1;
      dots[0].style.backgroundColor = 'rgb(14,13,13)';
    }
    // console.log(this.state, index,)
  }
  setBannerInterval() {
    this.timer = setInterval(this.autoPlay, 2500)
  }
  handleLeave() {
    this.setBannerInterval()
  }
  handleHover(e) {
    this.timer && clearInterval(this.timer);

    if (e.target.classList.contains('description')) {
      this.state.index = parseInt(e.target.id);
      this.autoPlay(true)
    }
  }
}
// 定义组件
if (!customElements.get('ui-carousel')) {
  window.customElements.define('ui-carousel', CarouselComponent);

}