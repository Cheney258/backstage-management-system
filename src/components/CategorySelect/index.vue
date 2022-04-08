<template>
    <div>
        <!-- inline:代表行内表单，一行可以放置多个表单元素 -->
        <el-form :inline="true"  class="demo-form-inline" :model="cFrom">
            <el-form-item label="一级分类">
                <el-select placeholder="请选择" v-model="cFrom.category1Id" @change="handler1" :disabled="show">
                <el-option :label="c1.name" :value="c1.id" v-for="(c1,index) in category1List" :key="c1.id"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="二级分类">
                <el-select placeholder="请选择" v-model="cFrom.category2Id" @change="handler2" :disabled="show">
                <el-option :label="c2.name" :value="c2.id" v-for="(c2,index) in category2List" :key="c2.id"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="三级分类">
                <el-select placeholder="请选择" v-model="cFrom.category3Id" @change="handler3" :disabled="show">
                <el-option :label="c3.name" :value="c3.id" v-for="(c3,index) in category3List" :key="c3.id"></el-option>
                </el-select>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
export default {
    name: 'CategorySelect',

    data() {
        return {
            // 一级分类数组
            category1List:[],
            // 二级分类数组
            category2List:[],
            // 三级分类数组
            category3List:[],
            // 收集相应的一级二级三级分类的Id
            cFrom:{
                category1Id:'',
                category2Id:'',
                category3Id:'',
            }
        };
    },
    props:['show'],
    // 组件挂载完毕：向服务器发请求，获取相应的一类分类的数据
    mounted() {
        // 获取一级分类数据的方法
        this.getCategory1List()
    },

    methods: {
        // 获取一级分类数据的方法
        async getCategory1List(){
            let result = await this.$API.attr.reqCategory1List()
            // console.log(result)
            if(result.code == 200){
                this.category1List = result.data
            }
        },
        // 一级分类的select事件回调【当一级分类的option发生变化时获取相应的二级分类数据】
        async handler1(){
            // 清除数据
            this.category2List = []
            this.category3List = []
            this.cFrom.category2Id = ''
            this.cFrom.category3Id = ''
            // 解构出category1Id
            const {category1Id} = this.cFrom;
            // 给父组件传ID
            this.$emit('getCategoryId',{categoryId:category1Id,level:1})
            let result = await this.$API.attr.reqCategory2List(category1Id)
            if(result.code == 200){
                this.category2List = result.data
            }
        },
        // 二级分类的select事件回调【当二级分类的option发生变化时获取相应的三级分类数据】
        async handler2(){
            // 清除数据
            this.category3List = []
            this.cFrom.category3Id = ''
            // 解构出category2Id
            const {category2Id} = this.cFrom;
            // 给父组件传ID
            this.$emit('getCategoryId',{categoryId:category2Id,level:2})
            let result = await this.$API.attr.reqCategory3List(category2Id)
            if(result.code == 200){
                this.category3List = result.data
            }
        },
        // 三级分类事件回调
        handler3(){
            // 解构出category2Id
            const {category3Id} = this.cFrom;
            // 给父组件传ID
            this.$emit('getCategoryId',{categoryId:category3Id,level:3})
        }
    },
};
</script>

<style lang="less" scoped>

</style>