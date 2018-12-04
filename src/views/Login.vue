<template>
<el-container style="background-image: url('http://www.primeton.com/img/slider/swiper/ep.jpg')">
  <el-main>
    <el-form :model="loginForm" :rules="rules" ref="loginForm" class="demo-loginForm login-container">
      <h3 class="title">用户管理微服务</h3>
      <el-form-item prop="userAccount">
        <el-input type="text" v-model="loginForm.userAccount" auto-complete="off"  placeholder="账号"></el-input>
      </el-form-item>
      <el-form-item prop="userPwd">
        <el-input type="password" v-model="loginForm.userPwd" auto-complete="off" placeholder="密码"></el-input>
      </el-form-item>
      <el-form-item style="width:100%;">
        <el-button type="primary" style="width:100%;" @click="submitForm('loginForm')" :loading="logining" >登录</el-button>
      </el-form-item>
    </el-form>
  </el-main>
</el-container>
</template>

<script>

  import loginApi from '@/api/user'
    export default {
      name: "login",
      data() {
        return {
          //定义loading默认为false
          logining: false,
          loginForm: {
            //userAccount和userPwd默认为空
            userAccount: 'ceshione',
            userPwd: '123456'
          },
          //rules前端验证
          rules: {
            userAccount: [{ required: true, message: '请输入账号', trigger: 'blur' }],
            userPwd: [{ required: true, message: '请输入密码', trigger: 'blur' }]
          }
        }
      },
      methods: {
        async submitForm() {
          this.$refs.loginForm.validate(async (valid) => {
            if (valid) {
              this.logining = true
              let data = await loginApi.login(this.loginForm)
              debugger
              this.logining = false;
              let code = data.code
              console.log(code)
              let user = null
              if (code !== 200) {
                this.$message({
                  message: data.msg,
                  type: 'error'
                });
              } else {
                user = data.data
                sessionStorage.setItem('user', JSON.stringify(user));
                this.$router.push({ path: '/index' });
              }
            } else {
              console.log('error submit!!');
              return false;
            }
          });
        }
      }
    }
</script>

<style scoped>
  .login-container {
    /*box-shadow: 0 0px 8px 0 rgba(0, 0, 0, 0.06), 0 1px 0px 0 rgba(0, 0, 0, 0.02);*/
    -webkit-border-radius: 5px;
    border-radius: 5px;
    -moz-border-radius: 5px;
    background-clip: padding-box;
    margin: 180px auto;
    width: 350px;
    padding: 35px 35px 15px 35px;
    background: #fff;
    border: 1px solid #eaeaea;
    box-shadow: 0 0 25px #cac6c6;

  }
  .title {
    margin: 0px auto 40px auto;
    text-align: center;
    color: #505458;
  }
  .remember {
    margin: 0px 0px 35px 0px;
    padding-right: 155px;
  }


</style>
