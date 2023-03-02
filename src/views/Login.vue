<template>
    <div class="login-view">

        <div class="container">
            <el-form :rules="logRules"
                     ref="loginForm"
                     :show-message="false"
                     :model="loginParam"
                     v-loading="loading"
                     element-loading-text="正在登陆..."
                     element-loading-spinner="el-icon-loading"
                     element-loading-background="rgba(0, 0, 0, 0.8)"
                     class="form">

                <h2 class="form_title">用户登录</h2>

                <el-form-item prop="username">
                    <el-input type="text" v-model="loginParam.username" placeholder="管理员账号" class="input"/>
                    <!--  oninput="value=value.replace(/[^0-9.]/g,'')"  -->
                </el-form-item>

                <el-form-item prop="password">
                    <el-input type="password" v-model="loginParam.password" placeholder="登录密码" class="input"
                              autocomplete="false" @keyup.enter.native="submitLogin" show-password/>
                </el-form-item>

                <!--<a class="link" @click="toForgot">忘记密码</a>-->
                <button class="btn" @click="submitLogin" type="button">立即登录</button>
            </el-form>
        </div>
    </div>


</template>


<script>
import Cookie from "js-cookie";

export default {
    name: 'Login',

    data() {
        return {
            loginParam: {
                username: '',
                password: ''
            },
            logRules: {  // 数据校验规则
                username: [{required: true, trigger: 'change'}],  // 对应el-form-item的prop属性
                password: [{required: true, trigger: 'change'}],
            },
            loading: false,
        }
    },

    methods: {
        // 提交登录信息
        submitLogin(){
            this.$refs.loginForm.validate((valid) => { // 提交之前先进行数据校验  $refs.loginForm 对应表单的ref属性
                if(valid){
                    this.loading = true;

                    this.postRequest('/collect/login', this.loginParam).then(resp =>{
                        if(resp.success){
                            // 设置用户token
                            Cookie.set('token', resp.data);
                            // 跳转首页
                            this.loading = false;
                            this.toHome();
                        }
                    })

                    this.loading = false;
                }else{
                    this.$message.error("请输入账号密码")
                }
            })

        },

        // 返回首页
        toHome(){
            this.$router.replace('/admin');
        },
    }

}
</script>


<style scope>

/*整体页面布局*/
.login-view {
    justify-content: center;

    align-items: center;

    display: flex;

    position: relative;

    height: 100%;

    width: 100%;

    /* 设置背景图片 */
    background-image: url('../assets/back3.jpg');

    background-repeat: no-repeat;

    background-size: 100% 100%;
}

:root {
    /* 颜色 */
    --white: #e9e9e9;
    --gray: #333;
    --blue: #095c91;
    --blue-r: #315a7491;
    --lightblue: #0393a3;

    /* 圆角 */
    --button-radius: 11.2px;

    /* 大小 */
    --max-width: 758px;
    --max-height: 400px;

    font-size: 16px;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
    Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
}

/*登录卡片容器*/
.container {
    background-color: var(--white);
    border-radius: var(--button-radius);
    box-shadow: 0 14.4px 27.2px rgba(0, 0, 0, 0.25),
    0 11.2px 11.2px rgba(0, 0, 0, 0.22);
    height: var(--max-height);
    max-width: var(--max-width);
    overflow: hidden;
    position: relative;
    width: 30%;
}

/*登录表单*/
.form {
    background-color: var(--white);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    height: 100%;
}

.form_title {
    font-weight: 300;
    margin: 0 0 20px;
    user-select: none;
}

.input {
    border: none;
    width: 300px!important;
}

/*登录按钮*/
.btn {
    background-color: var(--blue);
    background-image: linear-gradient(90deg, var(--blue) 0%, var(--lightblue) 74%);
    border-radius: 20px;
    border: 0.2px solid var(--blue-r);
    color: var(--white);
    cursor: pointer;
    font-size: 12.8px;
    font-weight: bold;
    letter-spacing: 1.6px;
    padding: 14px 50px;
    text-transform: uppercase;
    transition: transform 80ms ease-in;
}

.form > .btn {
    margin-top: 10px!important;
}


</style>