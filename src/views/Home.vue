<template>

    <div id="site">

        <div class="main-container">
            <!--头部搜索栏-->
            <div class="header">
                <el-input placeholder="I need ..." suffix-icon="el-icon-search" v-model="pageParam.title" clearable
                              @keyup.enter.native="initData()"
                              class="home-search"></el-input>

                <el-button icon="el-icon-user-solid" circle type="primary" size="mini" @click="dialogCheck"
                               class="home-button"></el-button>

                <el-button icon="el-icon-plus" circle type="primary" size="mini" @click="createCollect"
                               class="home-button"></el-button>

                <el-button icon="el-icon-s-home" circle type="primary" size="mini" @click="toLogin"
                           class="home-button"></el-button>

            </div>

            <div class="body">
                <div class="collections">
                    <!--书签卡片内容-->
                    <el-card ref="cards" class="my-cards" shadow="always" v-for="(collection,index) in collections"
                             :key="index"
                             @click.native="openView(collection)">

                        <div class="card-content">
                            <div class="card-title">
                                <b class="title-font">{{ collection.title }}</b>
                            </div>

                            <div class="operation_button">
                                <li class="el-icon-edit"
                                    @click.stop="toEdit(collection)"></li>

                                <li class="el-icon-delete"
                                    @click.stop="deleteCollect(collection)"></li>
                            </div>

                            <div class="card-description">
                                <i class="description-font">{{ collection.description }}</i>
                            </div>
                        </div>
                    </el-card>

                </div>

            </div>

            <div class="footer">
                <el-pagination
                    class="el-pagination"
                    background
                    @current-change="currentChange"
                    @prev-click="prevClick"
                    @next-click="nextClick"
                    layout="prev, pager, next"
                    :total="total">
                </el-pagination>
            </div>


            <!--用户登录弹窗-->
            <el-dialog
                title="用户登录"
                class="loginDialog"
                :visible.sync="dialogVisible"
                center
                width="25%">

                <div class="login-dialog">
                    <el-form label-position="right" label-width="80px" :model="loginParam" ref="loginForm"
                             :rules="rules">
                        <el-form-item label="用户名" prop="username">
                            <el-input placeholder="请输入账号" class="login-input" v-model="loginParam.username"></el-input>
                        </el-form-item>

                        <el-form-item label="密码" prop="password">
                            <el-input placeholder="请输入密码" class="login-input" v-model="loginParam.password"
                                      autocomplete="off"
                                      show-password @keyup.enter.native="login"></el-input>
                        </el-form-item>
                    </el-form>
                </div>

                <div style="display: flex;justify-content: center">
                    <el-button type="primary" @click="login">登 录</el-button>
                </div>

            </el-dialog>

        </div>

        <div class="code">
            <i style="color: white">互联网ICP备案：渝ICP备2022001788号</i>
        </div>

    </div>

</template>

<script>

import Cookie from 'js-cookie';
import {Base64} from "js-base64";

export default {
    name: 'Home',

    data() {
        return {
            pageParam: {
                currentPage: 1,
                pageSize: 12,
                title: ''
            },
            collections: [],
            total: 0,
            dialogVisible: false,
            loginParam: {
                username: '',
                password: ''
            },
            rules: {
                username: [{required: true, message: '请输入用户名', trigger: 'blur'}],
                password: [{required: true, message: '请输入密码', trigger: 'blur'}]
            }
        }
    },

    methods: {
        // 数据初始化
        initData() {
            let url = '/collect/all';

            if (this.pageParam.currentPage > 0) {
                url = url + '?currentPage=' + this.pageParam.currentPage;
            } else {
                url = url + '?currentPage=' + 1;
            }

            url = url + '&pageSize=' + this.pageParam.pageSize;

            if (this.pageParam.title != null || this.pageParam.title !== '') {
                url = url + '&title=' + this.pageParam.title;
            }

            this.getRequest(url, this.pageParam).then(resp => {
                if (resp != null && resp.success) {
                    this.collections = resp.data.data;
                    this.total = resp.data.total;
                }
            })

        },

        // 删除书签
        deleteCollect(collection) {
            this.$confirm('此操作将删除【' + collection.title + '】，是否继续？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.deleteRequest('/collect/' + collection.id).then(resp => {
                    if (resp != null && resp.success) {
                        this.initData();
                    }
                })
            }).catch(() => {
                this.$message({
                    type: 'warning',
                    message: '操作已取消'
                });
            })
        },

        // 跳转书签页面
        openView(collection) {
            // 点击量自增
            this.getRequest('/collect/increase/' + collection.id);
            window.open(collection.url, '_blank')
        },

        // 跳转博客首页
        toHome(){
            window.open('https://chengchun8401.github.io/', '_blank')
        },

        // 登录后台管理页面
        toLogin(){
            let toPage = '';
            if(Cookie.get('token') != null && Cookie.get('token') !== ''){
                toPage = 'Admin'
            }else{
                toPage = 'Login'
            }

            let routeDate = this.$router.resolve({
              name: toPage,
            });

            window.open(routeDate.href, '_blank')
        },

        // 跳转详细信息界面
        toEdit(collection) {
            this.$router.push({
                path: '/edit',
                query: {
                    collection: JSON.stringify(collection)
                }
            });
        },

        // 新建书签
        createCollect() {
            const {href} = this.$router.resolve({
                path: '/edit',
            });
            window.open(href, '_blank');
        },

        // 用户行为判断
        dialogCheck() {
            if (Cookie.get('token') != null && Cookie.get('token') !== '') {
                this.showLogout();
            } else {
                this.showLogin();
            }
        },

        // 展示登录对话框
        showLogin() {
            // 获取cookie中存放的信息
            if (this.loginParam.username == '' || this.loginParam.username == null) {
                let account = Cookie.get('account');

                if (account != null && '' != account) {
                    this.loginParam.username = account;
                    this.loginParam.password = Base64.decode(Cookie.get('password'));
                }
            }

            this.dialogVisible = true;
        },

        // 登录
        login() {
            this.$refs['loginForm'].validate(valid => {
                if (valid) {
                    this.postRequest('/collect/login', this.loginParam).then(resp => {
                        if (resp != null && resp.success) {
                            this.dialogVisible = false;
                            // 存放数据到cookie
                            Cookie.set('token', resp.data);
                            Cookie.set('account', this.loginParam.username);
                            Cookie.set('password', Base64.encode(this.loginParam.password));
                        }
                    })
                }
            })
        },

        // 注销登录提示
        showLogout() {
            this.$confirm('用户已登录，是否注销登录？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.logOut();
            }).catch(() => {
                this.$message({
                    type: 'warning',
                    message: '操作已取消'
                });
            })
        },

        // 注销登录
        logOut() {
            if (Cookie.get('token') != null && Cookie.get('token') !== '') {
                // 移除token
                Cookie.remove('token');
                this.$message.success('注销成功');
            } else {
                this.$message.error('尚未进行登录，注销失败');
            }
        },


        // 当前页数改变
        currentChange(currentPage) {
            this.pageParam.currentPage = currentPage;
            this.initData();
        },

        // 向前切页
        prevClick(currentPage) {
            this.pageParam.currentPage = currentPage;
            this.initData();
        },

        // 向后切页
        nextClick(currentPage) {
            this.pageParam.currentPage = currentPage;
            this.initData();
        },

    },

    mounted() {
        this.initData();
    },

    created() {
        document.title = '书签收藏';
    }

}
</script>


<style>

/*整体容器布局*/
#site {
    /* justify-content: center 配合 display: flex，让内部容器居中 */
    justify-content: center;

    display: flex;

    position: relative;

    /* 设置背景图片 */
    height: 100%;

    width: 100%;

    background-image: url('../assets/back.png');

    background-repeat: no-repeat;

    background-size: 100% 100%;

}

/*备案信息*/
.code {
    position: absolute;
    bottom: 0;
    user-select: none;
}

/*主体卡片容器*/
.main-container {
    width: 60%;

    margin-top: 80px;

    height: 760px;

    box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);

    border-radius: 4px;

    position: relative;

}

/*搜索栏*/
.header {
    height: 80px;

    display: flex;

    justify-content: center;

    align-items: center;

}

.home-search {
    width: 25%!important;

    margin-top: 10px;

    margin-right: 10px;

    margin-left: 8%!important;
}

.home-button {
    margin-top: 10px!important;
}

/*书签容器父组件*/
.body {
    display: flex;

    justify-content: center;
}

/*书签容器*/
.collections {

    height: calc(100% - 80px);

    display: flex;

    width: 80%;

    /*控制容器在主轴上的对齐方式（水平向右）*/
    justify-content: flex-start;

    /*控制容器在交叉轴上的对齐方式（垂直向下）*/
    align-content: flex-start;

    /*flex-direction（控制排列方式） + flex-wrap（控制换行方式）*/
    flex-flow: row wrap;

}

/*底部容器*/
.footer {
    margin-top: 20px;

    height: 55px;

    width: 80%;

    margin-left: 10%;

    display: flex;

    justify-content: center;
}

/*书签卡片*/
.my-cards {
    margin: 25px 25px 20px 25px;

    width: 250px;

    height: 100px;

    cursor: pointer;
}

/*卡片内容*/
.card-content {
    display: flex;

    flex-direction: row;

    justify-content: flex-start;

    flex-wrap: wrap;

    position: relative;
}

.card-title {
    width: 70%!important;
}

.title-font {
    font-size: 16px;
    user-select: none;
}

.description-font {
    font-size: 12px;

    user-select: none;

    /*强制单行显示*/
    white-space:nowrap;

    /*/超出部分省略号表示/*/
    text-overflow:ellipsis;

    /*超出部分隐藏*/
    overflow:hidden;

    /*设置显示的最大宽度*/
    width: 80%;

    display:block;
}

.card-description {
    width: 100%;

    margin-top: 10%
}

/*卡片操作按钮*/
.operation_button {
    /*强制单行显示*/
    white-space:nowrap;

    width: 20%;

    top: 0;

    right: 0;

    position: absolute;
}

.el-icon-edit {
    padding: 3px;
}

.el-icon-delete {
    padding: 3px;
}

/*鼠标悬浮放大*/
.my-cards:hover {
    transform: scale(1.03, 1.03);
    transition: all .5s linear;
}

/*登录对话框*/
.login-dialog {
    display: flex;

    justify-content: flex-start;

    align-content: center;

    margin-left: 8%
}

.login-input {
    width: 250px;
}

</style>
