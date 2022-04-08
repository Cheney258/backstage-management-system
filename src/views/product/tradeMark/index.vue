/* eslint-disable vue/name-property-casing */
<template>
    <div>
        <!-- 按钮 -->
        <el-button type="primary" icon="el-icon-plus" style="margin: 10px 0px" @click="showDialog">添加</el-button>
        <!-- 
                表格组件: 
                data:表格组件将来需要展示的组件
                boder:表格边框

                table-column属性：
                label：显示的标题
                width:对应列的宽度
                align:文字对齐方式
                prop:对应页内容的字段名
                注意：elementUI table组件是以列进行数据展示的
                -->
        <el-table style="width: 100%" border :data="list">
            <!-- 列 -->
            <el-table-column type="index" label="序号" width="80px" align="center">
            </el-table-column>
            <el-table-column prop="tmName" label="品牌名称" width="width" align="center">
            </el-table-column>
            <el-table-column prop="prop" label="品牌LOGO" width="width" align="center">
                <template slot-scope="{row,$index}">
                    <img :src="row.logoUrl" alt="" style="width:80px;height:80px">
                </template>
            </el-table-column>
            <el-table-column prop="prop" label="操作" width="width" align="center">
                <template slot-scope="{row,$index}">
                    <el-button type="warning" icon="el-icon-edit" @click="updateTradeMark(row)">修改</el-button>
                    <el-button type="danger" icon="el-icon-delete" @click="deleteTradeMark(row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <!-- 分页器 :
                当前页:current-page
                数据总条数:total
                每页展示的条数:page-size
                页码按键数量:page-count
                layout:展示分页器的布局
        -->
        <el-pagination
            style="margin-top:20px;textAlign:center"
            :current-page="page"
            :total="total"
            :page-size="limit"
            :page-sizes="[3, 5, 10]"
            @current-change="getPageList"
            @size-change="handleSizeChange"
            layout="prev, pager, next, jumper,->, sizes, total "
            >
        </el-pagination>

        <!-- 对话框
                :visible.sync：控制对话框显示与隐藏
        -->
        <el-dialog :title="this.tmFrom.id?'修改品牌':'添加品牌'" :visible.sync="dialogFormVisible">
            <!-- from 表单 
                :model属性：把收集的数据放到该对象上，表单验证需要-->
            <el-form style="width:50%" :model="tmFrom" :rules="rules" ref="rulesFrom">
                <el-form-item label="活动名称" label-width="100px" prop="tmName">
                <el-input autocomplete="off" v-model="tmFrom.tmName"></el-input>
                </el-form-item>
                <el-form-item label="品牌LOGO" label-width="100px" prop="logoUrl">
                    <!-- 这里收集数据不能使用v-model，不是表单元素 
                        action：设置图片上传的地址
                        :on-success:可以检测图片上传成功，上传成功执行一次
                        :before-upload：上传之前执行一次
                    -->
                    <el-upload
                        class="avatar-uploader"
                        action="/dev-api/admin/product/fileUpload"
                        :show-file-list="false"
                        :on-success="handleAvatarSuccess"
                        :before-upload="beforeAvatarUpload"
                        >
                        <img v-if="tmFrom.logoUrl" :src="tmFrom.logoUrl" class="avatar">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                        <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
                    </el-upload>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="addOrUpdateTradeMark">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
export default {
    name: "tradeMark",

    data() {
        // 自定义校验规则
        var validateTmName = (rules, value, callback) => {
            if (value.length < 2 || value.length > 10) {
                callback(new Error('品牌名称要求2-10位'))
            }else{
                callback()
            }
        };
        return {
            // 当前分页器展示的页数
            page:1,
            // 每一页展示的条数
            limit:3,
            // 总数据条数
            total:0,
            // 展示的数据
            list:[],
            // 对话框显示与隐藏控制的属性
            dialogFormVisible:false,
            // 收集品牌信息
            tmFrom:{
                tmName:'',
                logoUrl:'',
            },
            // 表单验证规则
            rules:{
                // required:必须验证的字段  message：提示信息  trigger：用户行为设置
                tmName: [
                    { required: true, message: '请输入品牌名称', trigger: 'blur' },
                    // 自定义校验规则
                    { validator: validateTmName, trigger: 'chagne' }
                ],
                logoUrl: [
                    { required: true, message: '请上传品牌图片' }
                ],
            }
        };
    },
    // 组件挂载完发请求
    mounted() {
        // 获取列表数据方法
        this.getPageList()
    },

    methods: {
        // 获取品牌数据方法
        async getPageList(pager=1){
            this.page = pager
            // 解构参数
            const {page,limit} = this;
            // 获取品牌列表的接口
            let result = await this.$API.trademark.reqTradeMarkList(page,limit)
            if (result.code == 200) {
                this.total = result.data.total
                this.list = result.data.records
            }
        },
        // 当分页器某一页需要展示的数据条数发生变化时触发
        handleSizeChange(limit){
            // 整理参数
            this.limit = limit
            this.getPageList()
        },
        // 点击添加品牌按钮
        showDialog(){
            // 显示对话框
            this.dialogFormVisible = true
            // 清除数据
            this.tmFrom = {tmName:'',logoUrl:''}
        },
        // 修改某个品牌
        updateTradeMark(row){
            // row:当前选中的品牌信息
            // 显示对话框
            this.dialogFormVisible = true
            // console.log(row)
            // 将选选中的品牌信息赋给tmFrom进行展示
            // 将服务器返回的信息直接赋值给tmFrom 进行展示
            // 也就是说tmFrom存储的即为服务器返回品牌信息
            this.tmFrom = {...row} // 使用浅拷贝
        },
        // 上传图片成功的回调
        handleAvatarSuccess(res, file) {
            // res : 上传成功之后返回前端数据
            // file：上传成功之后服务器返回给前端的数据
            // 收集品牌图片数据，后面需要带给服务器
            this.tmFrom.logoUrl = res.data
        },
        // 图片上传之前的回调
        beforeAvatarUpload(file) {
            const isJPG = file.type === 'image/jpeg';
            const isLt2M = file.size / 1024 / 1024 < 2;

            if (!isJPG) {
                this.$message.error('上传头像图片只能是 JPG 格式!');
            }
            if (!isLt2M) {
                this.$message.error('上传头像图片大小不能超过 2MB!');
            }
            return isJPG && isLt2M;
        },
        // 添加品牌或修改品牌
        addOrUpdateTradeMark(){
            // 当全部验证字段通过，再写其他业务逻辑
            this.$refs.rulesFrom.validate(async(success)=>{
                // 全部校验通过
                if (success) {
                    this.dialogFormVisible = false
                    // console.log(this.tmFrom)
                    // 发请求
                    let result = await this.$API.trademark.reqAddOrUpdateTradeMark(this.tmFrom)
                    if(result.code ==200){
                        // 弹出信息：添加品牌成功 || 修改品牌成功
                        this.$message({
                            type:'success',
                            message:this.tmFrom.id?'修改品牌成功':'添加品牌成功'
                        })
                        // 添加或修改成功之后，再发请求进行数据更新展示
                        this.getPageList(this.tmFrom.id?this.page:1)
                    }
                }else{
                    console.log('error submit!!')
                    return false
                }
            })
        },
        // 删除某个品牌
        deleteTradeMark(row){
            // 弹框
            this.$confirm(`此操作将永久删除${row.tmName}品牌`,' 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(async() => {
                // 用户点击确认按钮时触发
                // 向服务器发请求
                let result = await this.$API.trademark.reqDeleteTradeMark(row.id)
                if(result.code == 200){
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    });
                    // 再次获取品牌数据进行展示
                    this.getPageList(this.list.length>1?this.page:this.page-1)
                }
                
            }).catch(() => {
                // 用户点击取消按钮时触发
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });          
            });
        }
    },
};
</script>

<style>
    .avatar-uploader .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
    }
    .avatar-uploader .el-upload:hover {
        border-color: #409EFF;
    }
    .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 178px;
        height: 178px;
        line-height: 178px;
        text-align: center;
    }
    .avatar {
        width: 178px;
        height: 178px;
        display: block;
    }
</style>