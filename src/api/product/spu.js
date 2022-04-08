// 平台Spu属性管理模块文件
import request from '@/utils/request'

// 获取Spu属性数据的接口
// url:/admin/product/{page}/{limit} method:get
export const reqSpuList = (page,limit,category3Id) => request({url:`/admin/product/${page}/${limit}`,method:'get',params:{category3Id}})

// /admin/product/baseSaleAttrList                 method：get   品牌的数据需要发请求
// /admin/product/baseTrademark/getTrademarkList   method：get   获取平台中全部的销售属性（3个）
// /admin/product/getSpuById/{spuId}               method：get   获取某一个SPU信息
// /admin/product/spuImageList/{spuId}             method：get   获取Spu图片

// 获取spu信息
export const reqSpu = (spuId) => request({url:`/admin/product/getSpuById/${spuId}`,method:'get'})

// 获取品牌信息
export const reqTradeMarkList = () => request({url:'/admin/product/baseTrademark/getTrademarkList',method:'get'})

// 获取SPU图片的信息
export const reqSpuImageList = (spuId) => request({url:`/admin/product/spuImageList/${spuId}`,method:'get'})

// 获取平台全部的销售属性  ---   整个平台销售属性一共三个
export const reqBaseSaleAttrList = () => request({url:'/admin/product/baseSaleAttrList',method:'get'})

// 修改或者添加一个spu
// 添加API：/admin/product/saveSpuInfo  修改API：/admin/product/updateSpuInfo  method：post  参数一样
export const reqAddOrUpdateSpu = (spuInfo) =>{ 
    // 携带的参数带有Id-----更新数据
    if(spuInfo.id){
        return request({url:'/admin/product/updateSpuInfo',method:'post',data:spuInfo})
    }else{
        // 携带的参数没有带Id----添加一个spu 
        return request({url:'/admin/product/saveSpuInfo',method:'post',data:spuInfo})
    }
    
}