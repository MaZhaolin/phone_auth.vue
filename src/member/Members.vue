<template>
  <div class="user-management">
    <div class="management-title">用户管理
      <div class="right">
        <div class="search">
          <input type="text" class="input" @keydown.enter="searchHandle" v-model="form.value">
          <vp-select v-model="form.key">
            <vp-option value="phone">手机号</vp-option>
            <vp-option value="uid">ID</vp-option>
            <vp-option value="username">用户名</vp-option>
          </vp-select>
          <button class="btn btn-search" @click="searchHandle">
              <i class="iconfont">&#xe6d4;</i>
          </button>
        </div>
        <a :href="`${url}/plugin.php?id=phone_auth&control=Members&action=export`" style="display: inline-block;text-align:center" class="btn btn-download">下载数据</a>
        <input type="file" name="file" @change="upload" ref="file" style="display:none">
        <button  style="display:none" class="btn btn-download" @click="$refs.file.click()">导入数据</button>
      </div>
    </div>
    <div class="table">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>用户名</th>
            <th>邮箱</th>
            <th>国别码</th>
            <th>手机号</th>
            <th>注册时间</th>
            <th style="width: 50px">操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="members.length === 0">
            <td>暂无数据</td>
          </tr>
          <tr v-for="(member, key) in members" :key="key">
            <td>
              <a @click="redirectUserSet(member.uid)">{{member.uid}}</a>
            </td>
            <td>{{member.username}}</td>
            <td>{{member.email}}</td>
            <td>{{member.country_code && `+${member.country_code}`}}</td>
            <td>{{member.phone}}</td>
            <td>{{member.regdate | dateString}}</td>
            <td>
              <a v-if="member.phone" @click="unbind(key)">解绑</a>
              <a v-else @click="bind(member)">绑定</a>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <pagination :current-page.sync="page" :page-total="pageTotal" @change="loaddata"></pagination>
    <form ref="form" action="" method="post" style="display: none">
      <input type="text" name="uid" ref="uidInput">
      <input type="text" name="formhash" ref="formhash">
    </form>
    <bind-phone ref="bindPhone"></bind-phone>
  </div>
</template>

<script>
import axios from "@/lib/axios";
import dateString from "@/filters/date-string";
import select from "@/components/select";
import pagination from "@/components/pagination.vue";
import message from '@/components/message'
import BindPhone from './popup-bind-phone.vue'

export default {
  filters: {
    dateString
  },
  data() {
    return {
      members: [],
      form: {
        key: "username",
        value: ""
      },
      showBind: false,
      page: 1,
      pageTotal: 0,
      url: '',
      msg: {
        visible: false,
        type: 'success',
        icon: '&#xe652;',
        content: ''
      }
    };
  },
  created() {
    this.url = config.site_url;
    this.loaddata();
  },
  methods: {
    searchHandle() {
      this.page = 1;
      this.loaddata();
    },
    loaddata(page) {
      axios
        .get("/plugin.php?id=phone_auth&control=Members&action=find", {
          params: {
            ...this.form,
            page
          }
        })
        .then(({ data }) => {
          this.members = data.members;
          this.pageTotal = data.pageTotal;
        });
    },
    bind(member) {
      this.$refs.bindPhone.user = member;
      this.$refs.bindPhone.visible = true;
    },
    unbind(key) {
      axios
        .post("/plugin.php?id=phone_auth&control=Members&action=unbind", {
          phone: this.members[key].phone
        })
        .then(({ data }) => {
          this.members[key].country_code = '';
          this.members[key].phone = '';
          message({
            type: 'success',
            msg: '解绑成功'
          });
        })
        .catch(e => {
          message(e.toString());
        })
    },
    upload() {
      var file = this.$refs.file.files[0];
      console.log(file);
      if(!file || file.name.split('.').pop() !== 'csv') {
        return message('文件格式错误， 仅支持csv格式');
      }
      var formData = new FormData();
      formData.append('file', file);
      ajax.post(this.url + "/plugin.php?id=phone_auth&control=Members&action=import", formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      .then(({data}) => {
        data = data.data;
        message({
          type: 'success',
          msg: `成功:${data.success}条, 失败:${data.faild}条`
        });
        this.loaddata();
      })
      .catch(e => {
        message(e.toString());
      })
    },
    redirectUserSet(uid) {
      let url = config.site_url + "/admin.php?action=members&operation=search";
      let form = this.$refs.form;
      form.setAttribute("action", url);
      this.$refs.uidInput.value = uid;
      this.$refs.formhash.value = config.formhash;
      form.submit();
    }
  },
  components: {
    ...select,
    pagination,
    BindPhone
  }
};
</script>
