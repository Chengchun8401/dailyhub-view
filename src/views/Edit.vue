<template>
    <div id="website">

        <div class="box-card">

            <div class="tips">
                <i style="">请把此链接: <a :href="js" class="alert-link">立即收藏</a> 固定到浏览器的书签栏</i>
            </div>

            <div class="data">
                <el-form label-position="right" label-width="80px" :model="collection" :rules="rules" ref="collectFrom">
                    <el-form-item label="书签名" prop="title">
                        <el-input class="edit-input" placeholder="请设置书签名" v-model="collection.title"></el-input>
                    </el-form-item>

                    <el-form-item label="链接" prop="url">
                        <el-input class="edit-input" placeholder="请输入书签链接" v-model="collection.url"></el-input>
                    </el-form-item>

                    <el-form-item label="描述">
                        <el-input class="edit-input" placeholder="可有可无" v-model="collection.description"></el-input>
                    </el-form-item>

                    <el-form-item label="权重">
                        <el-slider class="edit-input" v-model="collection.weight" show-input input-size="small"></el-slider>
                    </el-form-item>
                </el-form>

            </div>

            <div>
                <el-button type="primary" @click="save">保存提交</el-button>
            </div>
        </div>

    </div>


</template>

<script>
export default {
    name: "Edit",

    data(){
        return{
            collection:{
                title: '',
                url: '',
                description: '',
                icon: null,
                id: null,
                createDate: null,
                weight: 1
            },
            rules:{
                title: [{required: true, message: '请输入书签名', trigger: 'blur'}],
                url:[{required: true, message: '请输入链接', trigger: 'blur'}],
            },
            js:'javascript:(function (){const site=\'http://lizp.vip/#/edit?title=\'+document.title+\'&url=\'+window.parent.location.href;const win=window.open(site,\'_blank\');win.focus();})()'
        }
    },

    methods:{
        save(){
            // 数据校验
            this.$refs['collectFrom'].validate(valid => {
                if(valid){
                    if(this.collection.id == null){
                        // 添加操作
                        this.postRequest('/collect', this.collection).then(resp=>{
                            if(resp != null && resp.success){
                                this.$router.push({
                                    name: 'Home'
                                }
                                )
                            }
                        })
                    }else{
                        // 更新操作
                        this.putRequest('/collect', this.collection).then(resp=>{
                            if(resp != null && resp.success){
                                this.$router.push({
                                        name: 'Home'
                                    }
                                )
                            }
                        })
                    }
                }
            })
        },

        getQueryString(name) {
            const reg = new RegExp('(^|[&,?])' + name + '=([^&]*)(&|$)');
            const r = decodeURIComponent(window.parent.location.href).substr(1).match(reg);
            if (r != null) {
                return unescape(r[2]);
            }
            return null;
        }

    },

    created() {
        document.title = '详细信息';
        if(this.$route.query.collection != null){
            this.collection = JSON.parse(this.$route.query.collection);
        }else{
            this.collection.title = this.getQueryString('title')
            this.collection.url = this.getQueryString('url')
        }
    },

}

</script>

<style>

/*页面整体布局*/
#website {
    justify-content: center;

    display: flex;
}

/*卡片容器布局*/
.box-card {
    width: 40%;

    height: 500px;

    border: 1px silver solid;

    box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);

    border-radius: 4px;

    position: relative;

    text-align: center;

    margin-top: 10%;

}

.tips{
    background-color: #FDF6EC;

    height: 15%;

    display: flex;

    justify-content: center;

    align-items: center;
}

.data {
    margin-top:70px;

    display: flex;

    justify-content: center
}

.edit-input {
    width: 350px;
}

</style>