<template>
  <div class="vaptcha-dz-tip" style="display: block" :class="`pay-${type}`">
      <span class="dz-tip-text"><i class="iconfont" :class="type" v-html="icon"></i>{{msg}}</span>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        type: 'error',
        msg: ''
      };
    },
    computed: {
      icon() {
        return this.type === 'success' ? '&#xe652;' : '&#xe70d;';
      }
    }
  };
</script>

<style>
.vaptcha-dz-tip {
  z-index: 100000;
}
</style>
