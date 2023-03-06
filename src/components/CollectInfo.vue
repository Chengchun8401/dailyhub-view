<template>
    <div class="collection-view">

        <div class="tips">
            <i>双击复制表格内容</i>
        </div>

        <el-table
            :data="collections"
            border
            :resizable="false"
            :header-cell-style="{'text-align': 'center'}"
            :cell-style="{'text-align': 'center'}"
            @cell-dblclick="handleDblClick"
            v-loading="loading"
            element-loading-text="拼命加载中"
            element-loading-spinner="el-icon-loading"
            element-loading-background="rgba(0, 0, 0, 0.8)"
            class="collect-table">

            <el-table-column
                prop="title"
                label="书签"
                width="200">
            </el-table-column>

            <el-table-column
                prop="description"
                label="描述"
                width="220"
                show-overflow-tooltip>
            </el-table-column>

            <el-table-column
                prop="url"
                label="网址"
                width="200"
                show-overflow-tooltip>
            </el-table-column>

            <el-table-column
                prop="weight"
                label="权重"
                width="120">
            </el-table-column>

            <el-table-column
                prop="count.click"
                label="总点击"
                width="120">
            </el-table-column>

            <el-table-column
                prop="createDate"
                label="创建日期"
                width="180">
            </el-table-column>

            <el-table-column
                prop="visible"
                label="状态"
                width="150">
                <template slot-scope="scope">
                    <el-tag type="success" v-if="scope.row.visible = 1">正常</el-tag>
                    <el-tag type="danger" v-if="scope.row.visible = 0">隐藏</el-tag>
                </template>
            </el-table-column>

            <el-table-column
                label="操作"
                fixed="right">
                <template slot-scope="scope">
                    <el-button type="primary" size="small" @click="showEdit(scope.row)">编辑</el-button>
                    <el-button type="danger" size="small" @click="deleteCollection(scope.row)">隐藏</el-button>
                </template>
            </el-table-column>
        </el-table>

        <div class="page-header">
            <el-pagination
                background
                @current-change="currentChange"
                @prev-click="prevClick"
                @next-click="nextClick"
                @size-change="sizeChange"
                layout="prev, pager, next, total, sizes"
                :total="total">
            </el-pagination>
        </div>

        <!-- 双击复制需要改输入框，隐藏了 -->
        <textarea id="input" style="position: absolute;bottom: 0;left: 0;opacity: 0;z-index: -10;"></textarea>
    </div>


</template>

<script>
export default {
    name: "CollectInfo",

    data(){
        return{
            collections: [],
            total: 0,
            pageParam:{
                currentPage: 1,
                pageSize: 10,
                data: ''
            },
            loading: false,
        }
    },

    methods: {
        // 拉取书签信息
        getCollectionsInfo(){
            let url = '/collect/info';

            if(this.pageParam.currentPage > 0){
                url = url + '?currentPage=' + this.pageParam.currentPage;
            }else{
                url = url + '?currentPage=' + 1;
            }

            url = url + '&pageSize=' + this.pageParam.pageSize;
            this.loading = true;

            this.getRequest(url).then(resp => {
                if(resp.success){
                    this.collections = resp.data.data;
                    this.total = resp.data.total;
                }
            })

            this.loading = false;
        },

        // 隐藏书签
        deleteCollection(collect){

        },

        // 修改书签
        showEdit(collect){

        },

        // 双击表格复制内容
        handleDblClick(row, colum, cell, event){
            const text = event.target.innerText;
            const input = document.getElementById("input");
            input.value = text;

            input.select(); // 选中文本
            document.execCommand("copy");

            this.$notify.success({
                title: `${text}`,
                message: '已复制到剪贴板',

            });
        },

        // 当前页数改变
        currentChange(currentPage){
            this.pageParam.currentPage = currentPage;
            this.getCollectionsInfo();
        },

        // 每页展示条数改变
        sizeChange(pageSize){
            this.pageParam.pageSize = pageSize;
            this.getCollectionsInfo();
        },

        // 向前切页
        prevClick(currentPage){
            this.pageParam.currentPage = currentPage;
            this.getCollectionsInfo();
        },

        // 向后切页
        nextClick(currentPage){
            this.pageParam.currentPage = currentPage;
            this.getCollectionsInfo();
        },

    },

    mounted() {
        this.getCollectionsInfo();
    }
}
</script>

<style scoped>

/*整体布局*/
.collection-view{
    width: 100%;
    height: 100%;


}

/*表格样式*/
.collect-table {
    width: 100%;
    user-select: none!important;
}

/*提示*/
.tips {
    background-color: #FDF6EC;
    height: 30px;
    width: 100%;
    font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
}

/*分页*/
.page-header {
    width: 100%;
    margin-top: 20px;
    display: flex;
    justify-content: flex-end;
}


</style>