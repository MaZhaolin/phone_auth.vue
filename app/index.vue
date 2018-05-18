<template>
  <div class="sms-anti-brush" v-cloak>
    <div class="content">
      <form ref="form" class="v-settings" method="post" @submit.prevent="submit">
        <div class="basics">
          <p>基础设置</p>
          <span>网站名称</span>
          <input type="text" class="form-control" v-model="params.site_name" placeholder="不超过10个汉字，不能包含特殊字符" name="site_name">
          <span class="right">名称包含敏感字将影响短信发送，如淘宝、金融、高利等；短信模板：你的
            <b>{{params.site_name}}</b>验证码：123456,10分钟内有效</span>
          <span>VAPTCHA验证单元配置</span>
          <span class="title">（请到<a href="https://www.vaptcha.com/" target="_blank" title="了解VAPTCHA">VAPTCHA官网</a>注册并免费获取私有KEY及VID）</span>
          <input type="text" class="form-control" placeholder="VID" name="id" v-model="params.vid">
          <span class="right">ID所关联的VAPTCHA账号将作为短信充值关联账号，请使用同一账号下的验证单元 </span>
          <input type="text" class="form-control" placeholder="KEY" name="key" v-model="params.key">
          <span class="right">用于验证过程数据传输加密，请勿泄露</span>
        </div>
        <div class="senior">
          <p>高级设置</p>
          <div class="dz-set">
            <div class="btn-color">
              <div class="title">颜色风格</div>
              <div class="example-ex">
                <span># </span>
                <input type="text" id="picker" name="style_color" class="picker" :style="{borderColor: `#${params.style_color}`}" v-model="params.style_color">
              </div>
            </div>
            <div class="btn-style">
              <div class="title">VAPTCHA按钮风格</div>
              <select name="btn_style" v-model="params.btn_style">
                <option value="light">IOS</option>
                <option value="dark">Windows</option>
              </select>
            </div>
            <div class="international-sms">
              <div class="title">国际短信</div>
              <select name="enable_inter" v-model="params.enable_inter">
                <option value="1">允许</option>
                <option value="0">不允许</option>
              </select>
            </div>
            <div class="international-sms">
              <div class="title">登录人机验证
                <span style="display: inline-block;color:#ccc;margin: 0"></span>
              </div>
              <select name="login_captcha" v-model="params.login_captcha">
                <option value="1">开启</option>
                <option value="0">关闭</option>
              </select>
            </div>
            <div class="international-sms">
              <div class="title">短信验证登录
                <i class="iconfont prompt">
                  <span>无需输入密码，通过手机验证码直接登录</span>
                </i>
                <span style="display: inline-block;color:#ccc;margin: 0"></span>
              </div>
              <select name="code_login" v-model="params.code_login">
                <option value="1">开启</option>
                <option value="0">关闭</option>
              </select>
            </div>
            <div class="right">请根据自己网站风格和需求来设置</div>
          </div>
          <div class="register">
            <div class="title">注册填写选项</div>
            <div class="item">
              <input type="checkbox" id="email" v-model="register_email">
              <input type="hidden" name="register_email" :value="params.register_email">
              <label for="email">邮箱</label>
            </div>
            <div class="right">邮箱不做验证，仅用于接受信息不会用于找回密码等操作</div>
          </div>
          <div class="landing">
            <span>第三方登录 </span>
            <span class="title">（若调用官方插件请不要更改输入框内容，若调用第三方插件请自行输入登录地址）</span>
            <div class="item">
              <input type="checkbox" id="qq" v-model="qq_login">
              <input type="hidden" name="qq_login" value="1" id="qq" v-model="params.qq_login">
              <label for="qq" class="min-w">QQ</label>
              <input type="text" class="form-control" v-model="params.qq_login_url" name="qq_login_url">
            </div>
            <div class="item">
              <input type="checkbox" id="wx" v-model="wechat_login" >
              <input type="hidden" name="wechat_login" value="1" id="wx" v-model="params.wechat_login" >
              <label for="wx" class="min-w">微信</label>
              <input type="text" class="form-control" v-model="params.wechat_login_url"  name="wechat_login_url">
            </div>
          </div>
        </div>

        <button class="v-btn btn-default">保存</button>
      </form>
    </div>
    <div class="vaptcha-dz-tip message" style="display:block" v-show="msg.visible">
      <span class="dz-tip-text">
        <i class="iconfont error">&#xe70d;</i>{{msg.content}}</span>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      params,
      register_email: params.register_email == '1',
      qq_login: params.qq_login == '1',
      wechat_login: params.wechat_login == '1',
      msg: {
        visible: false,
        content: ""
      }
    };
  },
  mounted() {
    $('#picker').colpick({
      layout: 'hex',
      submit: 0,
      colorScheme: 'dark',
      onChange: (hsb, hex, rgb, el, bySetColor) => {
        if (!bySetColor) this.params.style_color = hex;
      }
    }).keyup(function () {
      $(this).colpickSetColor(this.value);
    });
  },
  methods: {
    message(content) {
      this.msg = {
        visible: true,
        content
      };
      let timer = setTimeout(() => {
        clearTimeout(timer);
        this.msg.visible = false;
      }, 1500);
    },
    submit() {
      if(this.params.site_name.replace(/[\u0391-\uFFE5]/g, "aa").length > 20) {
        return this.message('网站名称不能超过10汉字')
      }
      var containSpecial = RegExp(/[(\ )(\~)(\!)(\@)(\#)(\$)(\%)(\^)(\&)(\*)(\()(\))(\-)(\_)(\+)(\=)(\[)(\])(\{)(\})(\|)(\\)(\;)(\:)(\')(\")(\,)(\.)(\/)(\<)(\>)(\?)(\)]+/);
      if(containSpecial.test(this.params.site_name)) {
        return this.message('网站名称不能包含特殊字符')
      }
      if(this.params.vid.trim().length !== 24 || this.params.key.trim().length !== 32) {
        return this.message('请填写正确的验证单元')
      }
      this.params.register_email = this.register_email ? 1 : 0;
      this.params.qq_login = this.qq_login ? 1 : 0;
      this.params.wechat_login = this.wechat_login ? 1 : 0;
      this.$nextTick(() => {
        this.$refs.form.submit();
      })
    }
  }
};
</script>

<style lang="scss">
i.prompt {
  position: relative;
  color: #999;
  color: rgba(153,153,153,0.9);
  font-size: 14px;
  cursor: pointer;
  span {
    display: none !important
  }
  &:hover {
    color: #999;
    background: none;
    font-size: 14px;
    transition: 1s;
    -moz-transition: 1s;
    -webkit-transition: 1s;
    -o-transition: 1s;
    span {
      z-index: 3;
      display: block !important;
      position: absolute;
      padding: 5px 10px;
      left: 8px;
      transform: translate(-50%, 0);
      transform: -webkit-translate(-50%, 0);
      transform: -moz-translate(-50%, 0);
      transform: -ms-translate(-50%, 0);
      white-space: pre;
      font-size: 12px;
      -webkit-text-stroke-width: 0;
      color: #fff;
      background: #39424E;
      border-radius: 2px
    }
  }
}
</style>
