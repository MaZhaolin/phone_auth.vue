<template>
  <div class="sms-anti-brush">
    <div class="content">
      <div class="tab">
        <div class="v-btn" :class="{active: active === 'sms'}" @click="active = 'sms'">短信充值</div>
        <div class="v-btn"  :class="{active: active !== 'sms'}" @click="active = 'send'">发送记录</div>
      </div>
      <sms-recharge v-if="active === 'sms'"></sms-recharge>
      <send-record  v-else></send-record>
    </div>
    <div class="vaptcha-dz-pop alipay-pop">
      <div class="vaptcha-dz-title">充值
        <i class="iconfont close"></i>
      </div>
      <div class="vaptcha-dz-main">请在新打开页面完成支付操作。</div>
      <button class="v-btn btn-default finish-pay">支付已完成</button>
    </div>
    <div class="vaptcha-dz-tip please-finish-config">
      <span class="dz-tip-text">请正确配置
        <span class="vaptcha">VAPTCHA验证单元</span>
      </span>
    </div>
    <div class="vaptcha-dz-tip pay-success">
      <span class="dz-tip-text">
        <i class="iconfont success"></i>支付成功</span>
    </div>
    <div class="vaptcha-dz-tip pay-error">
      <span class="dz-tip-text">
        <i class="iconfont error"></i>支付失败，如有疑问请联系客服</span>
    </div>
    <div class="vaptcha-dz-tip message">
      <span class="dz-tip-text">
        <i class="iconfont error"></i>
        <span class="text">网站名称不得多于10个汉字</span>
      </span>
    </div>
  </div>
</template>

<script>
// const SendRecord = () => import('./send-record.vue')
import SmsRecharge from './sms-recharge.vue'
import SendRecord from './send-record.vue'

export default {
  data() {
    return {
      active: 'sms'
    }
  },
  components: {
    SmsRecharge,
    SendRecord
  }
}
</script>
