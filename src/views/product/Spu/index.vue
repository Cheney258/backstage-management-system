<template>
    <div>
        <el-card style="margin:20px 0">
            <!-- 三级联动组件（全局组件） -->
            <CategorySelect @getCategoryId="getCategoryId" :show="scence!=0"></CategorySelect>
        </el-card>
        <el-card>
            <!-- 底部由三部分进行切换 -->
            <div v-show="scence == 0">
                <!-- 展示Spu列表的结构 -->
                <el-button type="primary" icon="el-icon-plus" :disabled="!category3Id" @click="addSpu">添加Spu</el-button>
                <el-table style="width: 100%" border :data="records">
                    <el-table-column type="index" label="序号" width="80" align="center">
                    </el-table-column>
                    <el-table-column prop="spuName" label="spu名称" width="width">
                    </el-table-column>
                    <el-table-column prop="description" label="spu描述" width="width">
                    </el-table-column>
                    <el-table-column prop="prop" label="操作" width="width" align="center">
                        <template slot-scope="{row,$index}">
                            <!-- 这里的button将来用hintButton替换 -->
                            <hint-button type="success" icon="el-icon-plus" size="mini" title="添加spu"></hint-button>
                            <hint-button type="warning" icon="el-icon-edit" size="mini" title="修改spu" @click="updateSpu(row)"></hint-button>
                            <hint-button type="info" icon="el-icon-info" size="mini" title="查看当前spu全部列表"></hint-button>
                            <hint-button type="danger" icon="el-icon-delete" size="mini" title="删除spu"></hint-button>
                        </template>
                    </el-table-column>
                </el-table>
                <el-pagination
                    style="text-align:center"
                    @current-change="getSpuList"
                    @size-change="handleSizeChange"
                    :current-page="page"
                    :page-sizes="[3, 5, 10]"
                    :page-size="limit"
                    layout=" prev, pager, next, jumper,->,sizes, total"
                    :total="total">
                </el-pagination>
            </div>
            <SpuFrom v-show="scence == 1" @changeSence="changeSence" ref="spu"></SpuFrom>
            <SkuFrom v-show="scence == 2"></SkuFrom>
        </el-card>
    </div>
</template>

<script>
import SkuFrom from './SkuFrom'
import SpuFrom from './SpuFrom'
export default {
    name: 'Spu',

    data() {
        return {
            // 分类的id
            category1Id:'',
            category2Id:'',
            category3Id:'',
            // 控制三级联动组件的可操作性
            page:1,   //分页器当前第几页
            limit:5,  //每一页展示条数
            records:[],  // 接收Spu列表数据
            total:0,  //分页器一共需要展示数据的总条数
            scence:0,   //展示spu数据列表
        };
    },
    components:{SkuFrom,SpuFrom},
    methods: {
        // 三级联动的自定义事件，可以把子组件的相应的id传递给父组件
        getCategoryId({categoryId,level}){
            // categoryId:获取到一，二，三级分类的id  level：为了区分是几级id
            if(level == 1){
                this.category1Id = categoryId
                // 清除二，三级分类的id
                this.category2Id = ''
                this.category3Id = ''
            }else if(level == 2){
                this.category2Id = categoryId
                this.category3Id = ''
            }else{
                this.category3Id = categoryId
                // 发请求，获取数据
                this.getSpuList()
            }
        },
        // 获取Spu列表数据的方法
        async getSpuList(pages=1){
            // console.log(pages)
            this.page = pages
            const {page,limit,category3Id} = this;
            let result = await this.$API.spu.reqSpuList(page,limit,category3Id)
            // console.log(result)
            if(result.code == 200){
                this.records = result.data.records
                this.total = result.data.total
            }
        },
        // 分页器每一页展示的条数发生变化时的回调
        handleSizeChange(limit){
            this.limit = limit
            this.getSpuList()
        },
        // 添加Spu的回调
        addSpu(){
            this.scence = 1
        },
        // 编辑按钮修改Spu的回调
        updateSpu(row){
            this.scence = 1
            // 获取子组件以及子组件的方法和数据【父组件可以通过$refs获取子组件及其数据方法】
            this.$refs.spu.initSpuData(row)
        },
        // 自定义事件的回调----【SpuFrom】
        changeSence(sence){
            this.scence = sence
            // 子组件通知父组件换场景，需要更新列表数据数据,数据展示回到当前页
            this.getSpuList(this.page)
        }
    }
};
</script>

<style lang="less" scoped>

</style>