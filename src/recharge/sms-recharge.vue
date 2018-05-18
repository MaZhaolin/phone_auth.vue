<template>
  <div class="recharge tab-panel active">
    <div class="message-con">
      <p>短信充值</p>
      <div class="specifications">
        <div class="title">套餐规格</div>
        <div class="v-num prices" style="font-size:0">
          <span v-for="(price, key) in prices" :key="price.num" 
            :class="{active: activePriceIndex === key}" @click="activePriceIndex = key">{{price.num}}条</span>
        </div>
      </div>
      <div class="when-long">
        <div class="title">有效时长</div>
        <div class="when">
          <span class="active">无限制</span>
        </div>
      </div>
      <div class="subsidy">
        <div class="title">结算金额</div>
        <div class="v-money">
          <span class="price-total">￥{{amount}}</span>（单价
          <span class="price">{{prices[activePriceIndex].price}}</span>分/条）
        </div>
        <div class="market-value">
          <a href="https://common-buy.aliyun.com/?spm=5176.8195934.907839.sms6.32cd41835Q3wKJ&amp;&amp;commodityCode=newdysmsbag#/buy"
            target="_blank">市场价</a>
          <span class="market">{{prices[activePriceIndex].market}}</span>分/条
          <i class="iconfont prompt" mdtooltip="" mdtooltipposition="right">
            <span>购买同样短信条数的市场价格</span>
          </i>
        </div>
      </div>
      <div class="mode">
        <div class="title">支付方式</div>
        <div class="payment">
          <span class="check-way">
            <input id="alipay" type="radio" name="pay" value="alipay" v-model="payType">
            <label for="alipay">
              <i class="img-alipay"></i>支付宝</label>
          </span>
          <span class="check-way wx-payment">
            <input id="wechart" type="radio" name="pay" value="wechat" v-model="payType">
            <label for="wechart">
              <i class="img-wechart"></i>微信
            </label>
            <div class="vaptcha-dz-qrcode" :class="{active: wechat.visible}">
              <i class="iconfont close" @click="closeWechatPay">&#xe70d;</i>
              <div class="title">请用微信扫码完成支付</div>
              <img :src="wechat.qrcode" alt="" class="qrcode">
            </div>
          </span>
        </div>
      </div>
      <div class="agree">
        <div class="title"></div>
        <a target="_blank" class="v-btn btn-success online-pay-btn" v-if="payType === 'alipay'" :href="alipayUrl" @click="alipayHandle">在线支付</a>
        <a class="v-btn btn-success online-pay-btn" v-else @click="wechatpayHandle">在线支付</a>
        <div class="agreement">
          <input type="checkbox" checked="" id="agreement">
          <label for="agreement">同意</label>
          <a class="agreement-link" @click="smsRuleVisible = true">《VAPTCHA短信补贴规则》</a>
        </div>
      </div>
      <div class="surplus-count">
        <div class="count">{{data.amount}}</div>
        <p>剩余短信条数</p>
      </div>
      <div class="surplus-day">
        <div class="day">{{data.expecttime}}</div>
        <p>预计可用天数</p>
      </div>
    </div>
    <div class="record">
      <div class="title">充值记录</div>
      <table>
        <thead>
          <tr>
            <th>短信条数</th>
            <th>充值金额</th>
            <th>支付方式</th>
            <th>流水号</th>
            <th>时间</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="order in data.orders" :key="order.orderid">
            <td>{{order.amount}}</td>
            <td>{{order.payment}}</td>
            <td>{{getPayType(order.paytype)}}</td>
            <td>{{order.orderid}}</td>
            <td>{{order.createtime | dateString}}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="dz-sms-pop" :class="{active: smsRuleVisible}">
      <div class="vaptcha-clause">
        <h2>VAPTCHA短信补贴条款</h2>
        <p>享受补贴对象</p>
        <ul>
          <li>所有接入VAPTCHA人机验证服务的网站或APP。</li>
        </ul>
        <p>补贴规则</p>
        <ul>
          <li>注册即送10条测试短信，超过部分先充值后消费，不同的充值金额享受不同的补贴价格，请根据网站需求购买。</li>
          <li>充值短信为基础短信，国内短信单次消耗1条，国际短信扣除方法：美国单次10条，其他国家和地区单次25条。</li>
          <li>仅对触发类短信进行补贴，短信模板：你的{网站名称}验证码：{123456}，{10}分钟内有效（"{}"为变量）。</li>
          <li>调用短信接口必须回传VAPTCHA验证通过的有效token，不传则按正常价格计费，单次加倍扣除基础短信。</li>
        </ul>
        <p>其他</p>
        <ul>
          <li>验证单元key将用于短信发送加密验证，请妥善保管，若泄露请及时重新生成。</li>
          <li>充值后不可提现，请根据需求购买；短信单价已做价格补贴，充值金额未含税，不可开具发票。</li>
        </ul>
      </div>
      <div class="close"  @click="smsRuleVisible = false">
        <i class="iconfont v-close">&#xe70d;</i>
      </div>
    </div>
    <div class="dz-mask" v-show="alipayVisible">
      <div class="vaptcha-dz-pop alipay-pop" :class="{active: alipayVisible}">
        <div class="vaptcha-dz-title">充值
          <i class="iconfont close" @click="closeAlipay">&#xe70d;</i>
        </div>
        <div class="vaptcha-dz-main">请在新打开页面完成支付操作。</div>
        <button class="v-btn btn-default finish-pay" @click="checkPayState(alipayToken, true)">支付已完成</button>
      </div>
    </div>
    <div class="vaptcha-dz-tip" :class="{active: msg.visible}">
      <span class="dz-tip-text">
        <i class="iconfont" :class="msg.type" v-html="msg.icon"></i>{{msg.content}}</span>
    </div>
  </div>
</template>

<script>
import axios from '@/lib/axios'
import dateString from "@/filters/date-string";

export default {
  filters: {dateString},
  data() {
    return {
      prices: [
        { price: 3.5, num: 5000, market: 4.5 },
        { price: 3.2, num: 20000, market: 4.3 },
        { price: 2.8, num: 50000, market: '4.0' },
        { price: 2.5, num: 200000, market: 3.9 },
        { price: 2.2, num: 500000, market: 3.8 },
      ],
      msg: {
        type: '',
        icon: '',
        content: '',
        visible: false
      },
      activePriceIndex: 0,
      data: {},
      payType: 'alipay',
      alipayUrl: '',
      checkPayTimer: null,
      smsRuleVisible: false,
      alipayVisible: false,
      alipayToken: '',
      wechat: {
        visible: false,
        qrcode: ''
      }
    }
  },
  computed: {
    amount() {
      let price = this.prices[this.activePriceIndex];
      return (price.price * price.num / 100) . toFixed(2);
    }
  },
  created() {
    this.setAlipayUrl();
    this.loadOrderData();
  },
  methods: {
    getPayType(type) {
      switch(type) {
        case 'alipay':
          return '支付宝';
        case 'wepay':
          return '微信';
      }
    },
    message(content, type) {
      type = type || 'error';
      this.msg = {
        type,
        content,
        icon: type === 'success' ? '&#xe652;' : '&#xe70d;',
        visible: true
      };
      this.smsRuleVisible = false;
      this.alipayVisible = false;
      this.wechat.visible = false;
      let timer = setTimeout(() => {
        clearTimeout(timer);
        this.msg.visible = false;
      }, 1500);
    },
    wechatpayHandle() {
      if(config.vid.length !== 24 || config.key.length !== 32) {
        return this.message('请配置正确的验证单元');
      }
      if(config.active != 1) {
        return this.message('请先开启插件');
      }
      axios.get('/plugin.php?id=phone_auth&action=smspay&type=wechat&amount=' + this.prices[this.activePriceIndex].num)
      .then(data => {
        this.wechat = {
          visible: true,
          qrcode: `data:image/png;base64,${data.data}`
        }
        this.checkPayState(data.token)
      })
      .catch(e => {
        console.log(e);
      })
    },
    alipayHandle(e) {
      if(config.vid.length !== 24 || config.key.length !== 32) {
        e.preventDefault();
        this.message('请配置正确的验证单元');
        return;
      }
      if(config.active != 1) {
        e.preventDefault();
        return this.message('请先开启插件');
      }
      this.alipayVisible = true;
      this.checkPayTimer = setTimeout(() => {
        this.checkPayState(this.alipayToken);
      }, 5000);
    },
    checkPayState(token, isClick) {
      axios.get('/plugin.php?id=phone_auth&action=paycheck&token=' + token,)
      .then(data => {
        var code = data.data;
        this.checkPayTimer && clearTimeout(this.checkPayTimer);
        if (code == "0") {
          //wait paym, 
          if (isClick) {
            this.message('支付失败，如有疑问请联系客服')
            return;
          }
          this.checkPayTimer = setTimeout(() => {
            this.checkPayState(token);
          }, 1000);
        } else if (code == '2') {
          // pay success
          this.loadOrderData();
          this.message('支付成功', 'success')
        } else {
          this.message('支付失败，如有疑问请联系客服')
          //pay error
        }
      })
      .catch(e => {
        console.log(e);
      })
    },
    closeWechatPay() {
      this.wechat.visible = false;
      this.checkPayTimer && clearTimeout(this.checkPayTimer)
    },
    closeAlipay() {
      this.alipayVisible = false;
      this.checkPayTimer && clearTimeout(this.checkPayTimer);      
    },
    loadOrderData() {
      axios.get('/plugin.php?id=phone_auth&action=smsdata&type=order&page=0')
      .then(({data}) => {
        this.data = data
      })
      .catch(e => {
        console.log(e);
      })
    },
    setAlipayUrl() {
      axios.get('/plugin.php?id=phone_auth&action=smspay&type=alipay&amount=' + this.prices[this.activePriceIndex].num)
      .then(data => {
        this.alipayUrl = data.url;
        this.alipayToken = data.token;
      })
      .catch(e => {
        console.log(e);
      })
    }
  },
  watch: {
    activePriceIndex(index) {
      this.setAlipayUrl();
    }
  }
}
</script>

<style>
.dz-mask{
  position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: #ffffff00;
    z-index: 1000;
}
</style>
