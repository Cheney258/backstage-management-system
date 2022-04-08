<template>
    <div>
    <el-form ref="form" label-width="100px" :model="spu">
        <el-form-item label="Spu的名称">
        <el-input
            placeholder="请输入Spu属性的名称"
            v-model="spu.spuName"
        ></el-input>
        </el-form-item>
        <el-form-item label="品牌">
        <el-select placeholder="请选择品牌" v-model="spu.tmId">
            <el-option :label="tm.tmName" :value="tm.id" v-for="(tm,index) in tradeMarkList" :key="tm.id"></el-option>
        </el-select>
        </el-form-item>
        <el-form-item label="SPU描述">
            <el-input type="textarea" rows="4" placeholder="描述" v-model="spu.description"></el-input>
        </el-form-item>
        <el-form-item label="Spu图片">
            <!-- 上传图片 ：action 图片上传的地址
                list-type:文件列表的类型
                on-preview:图片预览时触发
                on-remove：删除图片时触发
                file-list:照片墙展示的数据，【数组：数组里面的元素务必有name,url属性】
            -->
            <el-upload
            action="/dev-api/admin/product/fileUpload"
            list-type="picture-card"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove"
            :file-list="spuImageList"
            :on-success="handleSuccess"
            >
            <i class="el-icon-plus"></i>
            </el-upload>
            <el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="dialogImageUrl" alt="" />
            </el-dialog>
        </el-form-item>
        <el-form-item label="销售属性">
            <el-select :placeholder="`还有${unSelectSaleAttr.length}未选择`" v-model="attrIdAndAttrName">
                <el-option :label="unSelect.name" :value="`${unSelect.id}:${unSelect.name}`" v-for="(unSelect,index) in unSelectSaleAttr" :key="unSelect.id"></el-option>
            </el-select>
            <el-button type="primary" icon="el-icon-plus" style="margin: 0px 20px" :disabled="!attrIdAndAttrName" @click="addSaleAttr">添加销售属性</el-button>
            <el-table style="width: 100%" border :data="spu.spuSaleAttrList">
            <el-table-column type="index" label="序号" width="80" align="center">
            </el-table-column>
            <el-table-column prop="saleAttrName" label="属性名" width="200">
            </el-table-column>
            <el-table-column prop="prop" label="属性值名称列表" width="width">
                <template slot-scope="{row,$index}">
                    <!-- @close="handleClose(tag)" -->
                    <el-tag :key="tag.id" v-for="(tag,index) in row.spuSaleAttrValueList" closable :disable-transitions="false" @close="row.spuSaleAttrValueList.splice(index,1)">{{tag.saleAttrValueName}}</el-tag>
                    <!-- 下面的结构相当于 input和span 的切换 -->
                    <!--  @keyup.enter.native="handleInputConfirm"  -->
                    <el-input class="input-new-tag" v-if="row.inputVisible" v-model="row.inputValue" ref="saveTagInput" size="small" @blur="handleInputConfirm(row)"></el-input>
                    <!--  @click="showInput" -->
                    <el-button v-else class="button-new-tag" size="small" @click="addSaleAttrValue(row)">添加</el-button>
                </template>
            </el-table-column>
            <el-table-column prop="prop" label="操作" width="400" align="center">
                <template slot-scope="{row,$index}">
                    <el-button type="danger" icon="el-icon-delete" size="mini" @click="spu.spuSaleAttrList.splice($index,1)"></el-button>
                </template>
            </el-table-column>
            </el-table>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="addOrUpdateSpu">保存</el-button>
            <el-button @click="$emit('changeSence', 0)">取消</el-button>
        </el-form-item>
        </el-form>
    </div>
</template>

<script>
export default {
    name: "SpuFrom",

    data() {
        return {
        dialogImageUrl: "",
        dialogVisible: false,
        spu: {
            // 三级分类的id
            category3Id: 0,
            description: "",  // 描述
            spuName: "",   // spu名称
            tmId: 0,   //平台Id
            spuImageList: [  //收集spu图品信息
                // {
                    // id: 0,
                    // imgName: "string",
                    // imgUrl: "string",
                    // spuId: 0,
                // },
            ],
            // 平台属性与属性值收集
            spuSaleAttrList: [
                // {
                //     baseSaleAttrId: 0,
                //     id: 0,
                //     saleAttrName: "string",
                //     spuId: 0,
                //     spuSaleAttrValueList: [
                //         {
                //             baseSaleAttrId: 0,
                //             id: 0,
                //             isChecked: "string",
                //             saleAttrName: "string",
                //             saleAttrValueName: "string",
                //             spuId: 0,
                //         },
                //     ],
                // },
            ],
            
        }, //存储SPU信息属性
        tradeMarkList: [], //存储品牌信息
        spuImageList: [], //存储spu图片信息
        saleAttrList: [], //平台销售属性数据
        attrIdAndAttrName:'',   // 收集未销售属性的id
        };
    },

    computed:{
        // 计算出还没选择的销售属性
        unSelectSaleAttr(){
            // 整个平台的销售属性一共三个：颜色，尺寸，版本    saleAttrList
            // 当前SPU拥有的属于自己的销售属性spu.spuSaleAttrList
            // filter:数组的过滤API，可以从已有的数组中过滤出用户需要的元素，并返回一个新的数组
            let result = this.saleAttrList.filter(item => {
                // every:数组API，返回一个布尔值【真||假】
                return this.spu.spuSaleAttrList.every(item1 => {
                    return item.name != item1.saleAttrName
                })
            })
            return result
        }
    },

    mounted() {},

    methods: {
        // 照片墙图片移除的回调
        handleRemove(file, fileList) {
            // file:移除的图片
            // fileList：移除后剩余的照片墙
            // 收集照片墙图片的数据
            this.spuImageList = fileList
        },
        // 照片墙预览的回调
        handlePictureCardPreview(file) {
            this.dialogImageUrl = file.url;
            // 对话框显示
            this.dialogVisible = true;
        },
        // 图片上传成功的回调
        handleSuccess(response, file, fileList){
            // 收集照片墙图片信息
            this.spuImageList = fileList
        },
        // 初始化SpuFrom的数据
        async initSpuData(spu) {
            // 获取spu信息
            let spuResult = await this.$API.spu.reqSpu(spu.id);
            // console.log(spuResult)
            if (spuResult.code == 200) {
                this.spu = spuResult.data;
            }
            // 获取品牌的信息
            let tmResult = await this.$API.spu.reqTradeMarkList();
            // console.log(tmResult)
            if (tmResult.code == 200) {
                this.tradeMarkList = tmResult.data;
            }
            // 获取SPU图片信息
            let imgResult = await this.$API.spu.reqSpuImageList(spu.id);
            // console.log(imgResult)
            if (imgResult.code == 200) {
                let listArr = imgResult.data
                // 由于照片墙显示图片的数据需要数组，数组里面的元素需要name与url字段
                // 需要把服务器返回的数据进行修改
                listArr.forEach(item => {
                    item.name = item.imgName
                    item.url = item.imgUrl
                });
                // 把整理好的数据赋值给
                this.spuImageList = listArr
            }
            // 获取平台全部的销售属性
            let attrResult = await this.$API.spu.reqBaseSaleAttrList();
            // console.log(attrResult)
            if (attrResult.code == 200) {
                this.saleAttrList = attrResult.data;
            }
        },
        // 添加属性按键的回调
        addSaleAttr(){
            // 已经收集到添加属性的信息，
            const [baseSaleAttrId,saleAttrName] = this.attrIdAndAttrName.split(':')
            // 向spu对象的spuSaleAttrList属性添加新的销售属性
            let newSaleAttr = {baseSaleAttrId,saleAttrName,spuSaleAttrValueList:[]}
            // 添加销售属性
            this.spu.spuSaleAttrList.push(newSaleAttr)
            // 清空输入框内容
            this.attrIdAndAttrName = ''
        },
        // 添加销售属性值的添加按钮的回调
        addSaleAttrValue(row){
            // 点击兄啊受属性值当中添加按钮时，需要把button变成input，通过当前销售属性的inputVisible控制
            this.$set(row,'inputVisible',true)
            // 通过响应式数据inputValue字段收集新增的销售属性
            this.$set(row,'inputValue','')
        },
        // el-input失焦事件
        handleInputConfirm(row){
            // 解构出销售属性当中的收集数据
            const {baseSaleAttrId,inputValue} = row
            // 新增属性值不能为空
            if(inputValue.trim() == ''){
                this.$message('属性值不能为空！')
                return
            }
            // 属性值不能重复
            let result = row.spuSaleAttrValueList.every(item => item.saleAttrValueName != inputValue)
            // console.log(result)
            if (!result) return
            // 新增的销售属性
            let newSaleAttrValue = {baseSaleAttrId,saleAttrValueName:inputValue}
            // 新增
            row.spuSaleAttrValueList.push(newSaleAttrValue)
            // 失焦显示button
            row.inputVisible = false
        },
        // 添加||修改spu属性---保存按钮的回调
        async addOrUpdateSpu(){
            // 整理参数，需要整理照片墙的数据
            // 携带的参数：对于新增的图片，需要携带imageUrl和imageName字段
            this.spu.spuImageList = this.spuImageList.map(item => {
                return {
                    imageName:item.name,
                    imageUrl:(item.response&&item.response.data) || item.url
                }
            })
            // 发请求
            let result = await this.$API.spu.reqAddOrUpdateSpu(this.spu)
            if (result.code == 200) {
                // 成功提示
                this.$message({type:'success',message:'保存成功'})
                // 通知父组件回到场景sence0
                this.$emit('changeSence',0)
            }
        }
    },
};
</script>

<style>
    .el-tag + .el-tag {
        margin-left: 10px;
    }
    .button-new-tag {
        margin-left: 10px;
        height: 32px;
        line-height: 30px;
        padding-top: 0;
        padding-bottom: 0;
    }
    .input-new-tag {
        width: 90px;
        margin-left: 10px;
        vertical-align: bottom;
    }
</style>