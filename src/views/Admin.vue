<template>
    <div class="admin-page">
        <el-container>
            <el-header class="admin-header">

            </el-header>

            <el-container class="admin-container">
                <el-aside class="admin-menu">
                    <el-menu @select="handleSelect">
                        <el-menu-item index="1">
                            <i class="el-icon-s-data icon-font"></i>
                            <span class="menu-title">数据中心</span>
                        </el-menu-item>

                        <el-menu-item index="2">
                            <i class="el-icon-s-tools icon-font"></i>
                            <span class="menu-title">书签管理</span>
                        </el-menu-item>

                        <el-menu-item index="3">
                            <i class="el-icon-user-solid icon-font"></i>
                            <span class="menu-title">个人信息</span>
                        </el-menu-item>

                        <el-menu-item index="4">
                            <i class="el-icon-s-order icon-font"></i>
                            <span class="menu-title">操作日志</span>
                        </el-menu-item>

                    </el-menu>
                </el-aside>

                <div class="component-container">
                    <component :is="cmp"/>
                </div>


            </el-container>
        </el-container>


    </div>


</template>


<script>
    import DataShow from "@/components/DataShow";
    import CollectInfo from "@/components/CollectInfo";
    import UserInfo from "@/components/UserInfo";
    import Oplog from "@/components/Oplog";

    export default {
        name: 'Admin',

        components: {DataShow, CollectInfo, UserInfo, Oplog},

        data() {
            return{
                activeIndex: '1',
                cmp: 'DataShow'
            }
        },

        methods:{
            // 导航页改变
            handleSelect(index) {
                index = Number(index)
                switch (index){
                    case 1:
                        this.cmp = 'DataShow';
                        break;
                    case 2:
                        this.cmp = 'CollectInfo';
                        break;
                    case 3:
                        this.cmp = 'UserInfo';
                        break;
                    case 4:
                        this.cmp = 'Oplog';
                        break;
                    default:
                        this.cmp = 'DataShow';
                }
            },

        },

    }
</script>


<style scoped>
/*整体页面布局*/
.admin-page {
    height: 100%;
    width: 100%;
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    flex-direction: row;
    position: relative;
}

/*头部导航栏*/
.admin-header{
    width: 100%;
    height: 59px;
    border-bottom: 1px solid #eee;
    background-image: url('../assets/back3.jpg');
    background-repeat: no-repeat;

}

/*布局容器*/
.admin-container {
    width: 100%;
    height: calc(100% - 60px);
    position: relative;
}

/*左侧导航栏*/
.admin-menu{
    width: 199px!important;
    height: 100%!important;
    border-right: 1px solid #eee;
    background: #faf8f8;
}

.el-menu{
    background: #faf8f8;
    border: 0!important;
}

/*导航标题*/
.menu-title {
    font-size: 16px;
}

/*导航内图标*/
.icon-font{
    padding: 10px;
}

/*导航标题鼠标悬浮效果*/
.el-menu-item:hover{
    color: skyblue;
}

/*组件布局*/
.component-container{
    width: calc(100% - 200px);
    height: 100%;
}

</style>