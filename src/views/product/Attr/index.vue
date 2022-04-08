<template>
    <div>
        <el-card style="margin:20px 0px">
            <CategorySelect @getCategoryId="getCategoryId" :show="!isShowTable"></CategorySelect>
        </el-card>
        <el-card>
            <div v-show="isShowTable">
                <el-button type="primary" icon="el-icon-plus" :disabled="!category3Id" @click="addAttr">添加属性</el-button>
                <!-- 表格：展示平台属性 -->
                <el-table style="width: 100%" border :data="attrList">
                    <el-table-column type="index" label="序号" width="80" align="center">
                    </el-table-column>
                    <el-table-column prop="attrName" label="属性名称" width="150" align="center">
                    </el-table-column>
                    <el-table-column prop="prop" label="属性值列表" width="width" align="center">
                        <template slot-scope="{row,$index}">
                            <el-tag type="success" style="margin:0px 10px;" v-for="(attrValue,index) in row.attrValueList" :key="attrValue.id">{{attrValue.valueName}}</el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column prop="prop" label="操作" width="250" align="center">
                        <template slot-scope="{row,$index}">
                            <el-button type="warning" icon="el-icon-edit" size="mini" @click="updateAttr(row)"></el-button>
                            <el-button type="danger" icon="el-icon-delete" size="mini"></el-button>
                        </template>
                    </el-table-column>
                    
                </el-table>
            </div>
            <!-- 添加或修改属性 -->
            <div v-show="!isShowTable">
                <el-form :inline="true" ref="form" label-width="80px" :model="attrInfo">
                    <el-form-item label="属性名">
                        <el-input placeholder="请输入属性名" v-model="attrInfo.attrName"></el-input>
                    </el-form-item>
                </el-form>
                <el-button type="primary" icon="el-icon-plus" @click="addAttrValue" :disabled="!attrInfo.attrName">添加属性</el-button>
                <!-- <el-button @click="isShowTable=true">取消</el-button> -->
                <el-table style="width: 100%;margin:20px 0px" border :data="attrInfo.attrValueList">
                    <el-table-column type="index" label="序号" width="80" algin="center">
                    </el-table-column>
                    <el-table-column align="center" prop="prop" label="属性值名称" width="width">
                        <template slot-scope="{row,$index}">
                            <!-- 展示是用span，编辑和新增是用input -->
                            <el-input 
                                v-model="row.valueName" 
                                placeholder="请输入属性值名称" 
                                v-if="row.flag" 
                                @blur="toLook(row)" 
                                @keyup.native.enter="toLook(row)"
                                :ref="$index"
                                size="mini"
                            ></el-input>
                            <span v-else @click="toEdit(row,$index)" style="display:block">{{row.valueName}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="prop" label="操作" width="width">
                        <template slot-scope="{row,$index}">
                            <!-- 气泡确认框 -->
                            <el-popconfirm :title="`确定删除${row.valueName}吗？`" @onConfirm="deleteAttrValue($index)">
                                <el-button type="danger" icon="el-icon-delete" size="mini" slot="reference"></el-button>
                            </el-popconfirm>
                        </template>
                    </el-table-column>
                </el-table>
                <el-button type="primary" @click="addOrUpdateAttr" :disabled="attrInfo.attrValueList.length<1">保存</el-button>
                <el-button @click="isShowTable=true">取消</el-button>
            </div>
        </el-card>
    </div>
</template>

<script>
// 按需引入lodash当中的深拷贝
import cloneDeep from 'lodash/cloneDeep'
export default {
    name: 'Attr',

    data() {
        return {
            category1Id:'',
            category2Id:'',
            category3Id:'',
            // 接收存储平台属性数据
            attrList:[],
            // 表格显示、隐藏
            isShowTable: true,
            // 收集新增属性|| 修改的属性值
            attrInfo:{
                attrName: "",    //属性名
                attrValueList: [  //属性值列表，每一个属性值都是一个对象
                    
                ],
                categoryId: 0,  // 三级分类的Id
                categoryLevel: 3  // 服务器需要id的级别
                
            }
        };
    },

    mounted() {
        
    },

    methods: {
        // 自定义事件的回调，子组件给父组件传数据
        getCategoryId({categoryId,level}){
            // console.log(categoryId)
            // 区分三级分类相应的Id，以及父组件存储
            if(level == 1){
                this.category1Id = categoryId
                this.category2Id = ''
                this.category3Id = ''
            }else if(level == 2){
                this.category2Id = categoryId
                this.category3Id =''
            }else{
                // 代表三级分类的Id有了
                this.category3Id = categoryId
                // 发请求获取平台属性数据进行展示
                this.getAttrList()
            }
        },
        // 获取平台属性的数据
        async getAttrList(){
            // 当用户确定三级分类的数据时，可以向服务器发请求获取平台属性数据展示
            const {category1Id,category2Id,category3Id} = this;
            let result = await this.$API.attr.reqAttrInfoList(category1Id,category2Id,category3Id)
            // console.log(result)
            if(result.code == 200){
                this.attrList = result.data
            }
        },
        // 添加属性值得回调
        addAttrValue(){
            // 向属性值的数组里添加元素
            this.attrInfo.attrValueList.push({
                // attrId:是相应的属性的Id,目前添加属性的操作，还没有相应的属性的Id，目前带给服务器的id为undefined
                // 对于修改某一个属性的时候，可以在已有的属性值基础上新增新的属性值（新增属性值的时候，需要把已有的属性的id带上）
                attrId:this.attrInfo.id, 
                // valueName:相应的属性值名称
                valueName:'',
                // 控制属性值展示形式 span和input
                flag:true,
            })
            this.$nextTick(() => {
                this.$refs[this.attrInfo.attrValueList.length-1].focus()
            })
        },
        // 添加属性按钮的的回调
        addAttr(){
            // 切换table显示与隐藏
            this.isShowTable = false
            // 清除上次添加的残留数据
            this.attrInfo = {
                attrName: "",    //属性名
                attrValueList: [  //属性值列表，每一个属性值都是一个对象
                    
                ],
                categoryId: this.category3Id,  // 三级分类的Id
                categoryLevel: 3  // 服务器需要id的级
            }
        },
        // 修改某一个属性的回调
        updateAttr(row){
            this.isShowTable = false
            // 将传递的参数进行展示
            // 由于数据结构当中在对象里面套数据组，数组里面套对象，因此需要使用深拷贝解决这类问题
            this.attrInfo = cloneDeep(row)
            // 在点击修改某一个属性的时候，将相应的属性值元素添加上 flag 标记
            this.attrInfo.attrValueList.forEach(item => {
                // 这样书写，可以给属性值添加flag标记，但是视图不会跟着发生变化（因为flag不是响应式数据）
                // Vue无法探测新增的属性property，
                // this.flag = false
                // 可以通过vm.$set新增属性，新增的属性是响应式数据，可以跟随视图变化
                this.$set(item,'flag',false)
                
            })
        },
        // 失去焦点事件-----切换为查看模式，通过span展示
        toLook(row){
            // 如果属性值为空不能作为新的属性值，需要给用户提示，重新输入一个合法属性值
            if(row.valueName.trim() == ''){
                this.$message('请输入合法属性值！')
                return
            }
            // 新曾的属性值不能与已有重复
            let isRepat = this.attrInfo.attrValueList.some(item => {
                // 需要将row从数组里面判断的时候去除
                if(row != item){
                    // 不重复返回false，重复返回true
                    return row.valueName == item.valueName
                }
            })
            // 如果重复添加时，不执行后面的代码
            if(isRepat) {
                this.$message('该属性值已存在！')
                return
            }
            row.flag=false
        },
        // 点击span的回调，变为编辑模式
        toEdit(row,index){
            row.flag = true
            // 注意：切换为编辑模式时，浏览器需要重绘页面，需要耗时间，
            // 因此，点击span时不会立即获取到input节点
            // $nextTick(),当节点加载完毕时执行一次
            this.$nextTick(() => {
                // 获取input节点，实现自动聚焦
                this.$refs[index].focus()
            });
        },
        // 气泡确认框确认按钮的回调
        deleteAttrValue(index){
            // 当前删除属性值得操作不需要发请求
            this.attrInfo.attrValueList.splice(index,1)
        },
        // 保存按钮，添加或修改属性
        async addOrUpdateAttr(){
            // 整理参数:带给服务器得参数不能为空，带给服务器前过滤出不为空得属性
            // 删除flag标志
            this.attrInfo.attrValueList = this.attrInfo.attrValueList.filter(item => {
                // 筛选出不为空的属性
                if(item.valueName != ''){
                    delete item.flag
                    return true
                }
            })
            // 发请求
            try {
                await this.$API.attr.reqAddOrUpdateAttr(this.attrInfo)
                this.isShowTable = true
                this.$message({type:'success',message:'保存成功！'})
                // 保存成功后，需要再次获取平台属性进行展示
                this.getAttrList()
            } catch (error) {
            }
            

        }
    },
};
</script>

<style lang="less" scoped>

</style>