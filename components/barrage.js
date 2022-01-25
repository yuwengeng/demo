/* 
  滚动留言
*/

const tep = document.createElement('template');

const renderTemplate = config => {
  // const { barrageWidth } = config;
  return `
    <style>
    input,button {
      border-style: none;
      outline: none;
    }
    .send-wrap{
      display: flex;
      justify-content: space-between;
      border-bottom: 2px solid rgb(189,22,19);
    }
    .send-wrap > .input{
      width: 70px;background-color: rgb(182,0,0);
      padding: 8px 10px;
      box-sizing: content-box;
      color: white;
    }
    .send-btn{
      background-color: rgb(221,0,0);  
      padding: 3px 6px;
      color: white;
    }
    .barrage-container{
      background-color: rgb(244,249,185);
      aspect-ratio: 76/25;
      position: relative;
      margin-top: 10px;  
      overflow: hidden;
      -webkit-user-select: none;
      -moz-user-select: none;
      -ms-user-select: none;
      user-select: none;
    }
    .barrage-item{
      position:absolute;
      right: 0;
      padding: 0.3vw;
      white-space: nowrap;
      background-color:rgb(182,0,0);
      color:#fff;
      opacity:0;

      will-change: 'transform, opacity'; 
      animation-name: RightToLeft;
      animation-duration: 6s;
      animation-timing-function: linear;
      animation-iteration-count: infinite;
      animation-direction: normal;
      animation-play-state: running;

      -webkit-animation-name: RightToLeft;
      -webkit-animation-duration: 6s;
      -webkit-animation-timing-function: linear;
      -webkit-animation-iteration-count: infinite;
      -webkit-animation-direction: normal;
      -webkit-animation-play-state: running;
    }
    .barrage-item:hover{
      transform: scale(1.4);
      animation-play-state: paused;
    }
    
    @keyframes RightToLeft{ 
      from{
        transform: translateX(100%);
      }
      to{
        transform: translateX(-64vw);
      }
    }
    @-webkit-keyframes RightToLeft{
      from{
        transform: translateX(100%);
      }
      to{
        transform: translateX(-64vw);
      }
    }
    </style>
    <div class="send-wrap">
        <input type="text" class="input" required placeholder="说点什么">
        <button class="cbutton send-btn">提交祝福</button>
    </div> 
    <div class="barrage-container"></div> 
  `
}
const barrageArray = [
  {
    url: '用户头像',
    text: '秋天爱美丽',
    level: 10
  },
  {
    url: '用户头像',
    text: '今天很开心啊',
    level: 10
  },
  {
    url: '用户头像',
    text: 'winter has come',
    level: 10
  },
  {
    url: '',
    text: '土耳其现在形势',
    level: 10
  },
  {
    url: '',
    text: '没事早点回家吃饭啊',
    level: 10
  },
  {
    url: '',
    text: '这主角真实醉了，不会回啊',
    level: 10
  },
  {
    url: '',
    text: '背景音乐真好听啊',
    level: 10
  },
  {
    url: '',
    text: '背景音乐是***',
    level: 10
  },
  {
    url: '',
    text: '经费在燃烧啊',
    level: 10
  },
  {
    url: '',
    text: '国产良心剧',
    level: 10
  },
];
class BarrageAnimation extends HTMLElement {
  constructor() {
    super();
    this.state = {}
    this.attachShadow({
      mode: 'open'
    });
    tep.innerHTML = renderTemplate(this.state)
    this.shadowRoot.append(tep.content.cloneNode(true))
    this.barrageBox = this.shadowRoot.querySelector('.barrage-container')
    this.inputBox = this.shadowRoot.querySelector('.input');
    this.sendBtn = this.shadowRoot.querySelector('.send-btn');
    let { width, height } = this.barrageBox.getBoundingClientRect();
    // this.state.barrageWidth = width;
    this.barrageHeight = height;
    this.sendMsg = this.sendMsg.bind(this)
  }
  //发送
  sendMsg() {
    const inputValue = this.inputBox.value;
    if (inputValue.trim() !== "") {
      //生成弹幕
      this.createBarrage(inputValue, true);
      this.inputBox.value = '';
    }
  }

  //随机获取高度
  getRandom(height) {
    return parseInt(Math.random()*height)
    // return start + (Math.random() * (end - start));
  }
  getContainer(delay) {
    const divNode = document.createElement('div');
    divNode.classList.add('barrage-item');
    // divNode.style.cssText=`
    divNode.style.animationDelay = isNaN(delay) ? delay : `${delay}s`;
    // divNode.style.transitionProperty = 'opacity';
    // divNode.style.transitionDuration = isNaN(delay) ? delay : `${delay}s`;
    divNode.addEventListener(
      'animationstart',
      () => {
        divNode.style.opacity = 1;
      },
      false
    );
    divNode.addEventListener(
      'animationend',
      () => {
        divNode.parentNode.removeChild(divNode)
      },
      false
    );
    divNode.addEventListener(
      'mouseenter',
      () => {
        divNode.style.animationPlayState = 'paused';
      },
      false
    );
    divNode.addEventListener(
      'mouseleave',
      () => {
        if (!divNode.dataset.clicked) {
          divNode.style.animationPlayState = 'running';
        }
      },
      false
    );
    const barrageOffsetTop = this.getRandom(this.barrageHeight);
    divNode.style.top = barrageOffsetTop + 'px'
    this.barrageBox.appendChild(divNode);
    return divNode;
  }
  //创建弹幕
  createBarrage(msg, isSendMsg, index) {
    // const divNode = getContainer(defaultOptions)
    this.timer = requestAnimationFrame(() => {
      const divNode = this.getContainer(index)
      if (divNode) {
        divNode.textContent = msg;
        // const barrageWidth = this.barrageWidth;
        // const barrageOffsetLeft = isSendMsg ? barrageWidth : this.getRandom(barrageWidth, barrageWidth * 2);
        // divNode.style.left = barrageOffsetLeft;
      }
    });
  }
  handleEnter(event) {
    const e = event || window.event;
    if (e.keyCode === 13) {
      this.sendMsg();
    }
  }
  connectedCallback() {
    // const url = this.getAttribute('data-url');
    //执行初始化滚动
    barrageArray.forEach((item, index) => {
      this.createBarrage(item.text, false, index);
    });
    this.sendBtn.addEventListener('click', this.sendMsg, false)
    this.inputBox.addEventListener('keydown', this.handleEnter.bind(this), false)
  }
}
if (!customElements.get('ui-barrage-animation')) {
  window.customElements.define('ui-barrage-animation', BarrageAnimation);

}