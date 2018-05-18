<template>
  <div class="v-popup" v-show="visible">
    <div class="v-popup-main">
      <div class="v-header">
        <span class="title">绑定手机号: {{user.username}}</span>
        <i class="iconfont" @click="visible = false">&#xe70d;</i>
      </div>
      <div class="v-content">
        <i>+ </i><input type="text" class="v-input v-input--code" placeholder="国别码" v-model="form.countryCode">
        <input @keyup.enter="bindHandle" @keyup="formatPhone" type="text" maxlength="11" class="v-input v-input--phone" placeholder="手机号" autofocus v-model="form.phone">
      </div>
      <div class="v-footer">
        <button class="v-button" @click="bindHandle">绑定手机号</button>
      </div>
    </div>
  </div>
</template>

<script>
  import axios from "@/lib/axios";
  import message from '@/components/message'
  
  export default {
    name: 'bind-phone',
    data() {
      return {
        form: {
          countryCode: '86',
          phone: ''
        },
        user: {},
        visible: false
      }
    },
    methods: {
      bindHandle() {
        this.form.uid = this.user.uid;
        axios.post("/plugin.php?id=phone_auth&control=Members&action=bind", this.form)
          .then(({data}) => {
            this.$parent.loaddata(this.$parent.page);
            this.visible = false;
            this.form.phone = '';
            message({
                type: 'success',
                msg: '绑定成功'
            });
          })
          .catch(e => {
            message(e.toString());
          })
      },
      formatPhone() {
        !Number(this.form.phone) && (this.form.phone = parseInt(this.form.phone) ? parseInt(this.form.phone) : '');
      }
    }
  }
</script>

<style lang="scss">
  .v-input {
    border: 1px solid #eee;
    background: #fff;
    outline: none;
    padding: 5px 10px;
    box-sizing: border-box;
  }
  
  .v-button {
    vertical-align: top;
    margin: 0;
    padding: 5px 10px;
    border: none;
    outline: none;
    background: rgba(0, 136, 255, 0.9);
    cursor: pointer;
    color: #fff;
  }
  
  .v-popup {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    text-align: center;
    z-index: 100000;
    background: rgba(0, 0, 0, 0.08);
    .v-popup-main {
      display: inline-block;
      margin-top: 200px;
      background: #fff;
      .v-header {
        background: #62afff;
        padding: 5px 10px;
        color: #fff;
        &:after {
          content: "";
          display: block;
          clear: both;
        }
        .title {
          float: left;
        }
        .iconfont {
          float: right;
          &:hover {
            cursor: pointer;
          }
        }
      }
      .v-content {
        padding: 10px;
        .v-input--code {
          width: 60px;
        }
      }
      .v-footer {
        padding: 5px 10px;
        text-align: right;
      }
    }
  }
</style>

