const tep = document.createElement('template');
let dataSource = [
  {
    label: '1',
    desc: '军号入云添斗志<br>战旗映日动豪情',
  },
  {
    label: '2',
    desc: '风云动鼙鼓，巩固金汤祖国<br>星火燎原野，毋忘钢铁长城',
  },
  {
    label: '3',
    desc: '握钢枪保边疆，保家卫国<br>穿林莽挂晨露，戴月披星',
  },
  {
    label: '4',
    desc: '一片丹心，九州报捷<br>三军浩气，四海扬威',
  },
  {
    label: '5',
    desc: '守边关枕戈待旦甘心情愿<br>卫祖国跃马横枪舍我其谁',
  }, {
    label: '6',
    desc: '共产党情深似深<br>解放军功高如山',
  },
  {
    label: '7',
    desc: '长征道路英雄史<br>保卫边疆将士功',
  },
  {
    label: '8',
    desc: '钢枪慑敌胆<br>炮火振国威',
  },
  {
    label: '9',
    desc: '八一军旗红大地<br>万千劲旅壮河山',
  },
  {
    label: '10',
    desc: '跃马横刀，观国际风云变幻<br>枕戈披甲，防边庭虎豹凶狂',
  },
  {
    label: '11',
    desc: '沙场比武，展雄风劲旅<br>赛场竞技，创鳌头佳绩',
  },
  {
    label: '12',
    desc: '运筹帷幄共谋打赢之策<br>决胜千里齐出制敌之招',
  },
  {
    label: '13',
    desc: '神州十亿共明月<br>铁军一支振雄风',
  },
  {
    label: '14',
    desc: '军爱民，高歌爱民曲<br>民拥军，齐唱拥军歌',
  }
]

const renderTemplate = config => {

  return `
    <style>
    :host {
      display: block;
    }
    .card{
        display: grid;
        grid-gap: 1% 1.4%;
        grid-template-columns: repeat(3,1fr);
      }
    .item{
        text-align: center;
        height: 20;
        aspect-ratio: 20/5;
        color: #96110a;
        background-color: #fdcca1;
        border-radius: 4px;
        position:relative;
    }
    .item-switch{
      display: grid;
      place-items: center;
      background-color:rgb(225,120,37);
      color:white;
    }
    .box{
        width:100%;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        }
    </style>
    <div class="card">
        ${config.data.map((item) => `
        <div class="item">
            <div class='box'>
                ${item.desc}
            </div>
        </div>
        `).join('')
    }
        <div class="item item-switch">
            换一组
        </div>
    </div>
  `
}
class CardItem extends HTMLElement {
  constructor() {
    super();
    this.state = {
      data: dataSource
    };
    this.attachShadow({
      mode: 'open'
    });
  }
  connectedCallback() {
    tep.innerHTML = renderTemplate(this.state)
    this.shadowRoot.append(tep.content.cloneNode(true))
  }
}
if (!customElements.get('ui-card-item')) {
  window.customElements.define('ui-card-item', CardItem);

}