<template>
<div class="i-login">
  <div class="login-wrap">
    <div class="login-box">
      <h1 class="heading">疫苗接种仿真平台</h1>
      <el-form :model="account" :rules="rules" ref="validateForm">
        <el-form-item prop="username">
          <el-input v-model="account.name" placeholder="用户名"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="account.password" type="password" placeholder="密码" @keydown.enter.native="login"></el-input>
        </el-form-item>
        <el-button type="primary" :loading="isLoading" @click="login" size="large">登录</el-button>
      </el-form>
    </div>
  </div>
</div>
</template>

<script>
import { mapActions } from 'vuex'
import { $page } from '@helper'
import types from '@store/types'
import Cookies from 'js-cookie'

export default {
  name: 'i-login',
  data () {
    return {
      isLoading: false,
      account: {
        name: '',
        password: ''
      },
      rules: {
        name: [
          {
            required: true,
            message: '请输入用户名',
            trigger: 'change,blur'
          }
        ],
        password: [
          {
            required: true,
            message: '请输入密码',
            trigger: 'change,blur'
          }
        ]
      }
    }
  },
  methods: {
    ...mapActions({
      updateUser: types.user.action.update
    }),
    login () {
      this.$refs['validateForm'].validate(async (valid) => {
        if (valid) {
          this.isLoading = true
          const user = await $page.user.login(this.account)
          if (user && user.name) {
            this.updateUser(user)
            Cookies.set('isLogin', true)
            this.$router.push('/')
          }
          this.isLoading = false
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss">
.i-login {
  height: 100%;
  background-color: #e8ebf1;
  .login-wrap {
    width: 520px;
    margin: 0 auto;
    padding-top: 150px;
    min-height: 400px;
    position: relative;
    .login-box {
      width: 460px;
      padding: 30px;
      height: 100%;
      background-color: #fff;
      clear: both;
      display: table;
      border-radius: 3px;
      border: 1px solid #d7dce5;
      .heading {
        text-align: center;
        margin-bottom: 30px;
        font-size: 24px;
        color: #707473;
      }
      img {
        display: block;
        width: 80px;
        margin: 0 auto 20px;
      }
      .el-form-item {
        margin-bottom: 30px;
      }
      .el-button--primary {
        display: block;
        width: 100%;
        margin: 0 auto;
      }
    }
  }
  @media (max-width: 320px) {
    .login-wrap {
      width: 100%;
      padding-top: 60px;
    }
    .login-box {
      width: 100%;
      border: 0 none;
    }
  }
}
</style>
