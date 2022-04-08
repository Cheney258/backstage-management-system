// 平台属性管理模块文件
import request from '@/utils/request'

// 获取一级分类数据接口
// url：/admin/product/getCategory1 method:get
export const reqCategory1List = () => request({url:'/admin/product/getCategory1',method:'get'})


// 获取二级分类的数据接口
// url；/admin/product/getCategory2/${category1Id}  method：get
export const reqCategory2List = (category1Id) => request({url:`/admin/product/getCategory2/${category1Id}`,method:'get'})


// 获取三级分类的数据接口
// url；/admin/product/getCategory3/{category2Id}   method：get
export const reqCategory3List = (category2Id) => request({url:`/admin/product/getCategory3/${category2Id}`,method:'get'})

// 获取平台属性数据的接口
// url:/admin/product/attrInfoList/{category1Id}/{category2Id}/{category3Id}   method:get
export const reqAttrInfoList = (category1Id,category2Id,category3Id) => request({url:`/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`,methos:'get'})

// 添加属性与属性值的接口
// /admin/product/saveAttrInfo  method: post
export const reqAddOrUpdateAttr = (data) => request({url:'/admin/product/saveAttrInfo',methos:'post',data})
/*  需要携带的参数
    {
    "attrName": "string",       属性名
    "attrValueList": [          属性名中属性值，因为属性值可以是多个，因此结构是数组
        {
        "attrId": 0,            属性的ID               
        "valueName": "string"   属性值
        }
    ],
    "categoryId": 0,            category3Id
    "categoryLevel": 3,
    "id": 0
}
*/
