// 获取品牌管理信息模块
import request from '@/utils/request'

//获取品牌列表的接口 
// /admin/product/baseTrademark/{page}/{limit}  method：get
export const reqTradeMarkList = (page,limit) => request({url:`/admin/product/baseTrademark/${page}/${limit}`,method:'get'})

// 处理新增品牌
// url:/admin/product/baseTrademark/save  method:post 参数：品牌名称，品牌logo

// 修改品牌信息
//  url:/admin/product/baseTrademark/update method:put  参数：品牌ID 品牌名称 品牌logo
export const reqAddOrUpdateTradeMark = (tradeMark) =>{
    if(tradeMark.id){
        // 修改
        // console.log(tradeMark)
        return request({url:'/admin/product/baseTrademark/update',method:'PUT',data:tradeMark})
    }else{
        // 新增
        return request({url:'/admin/product/baseTrademark/save',method:'post',data:tradeMark})
    }
} 

// 删除某一个品牌
// url:/admin/product/baseTrademark/remove/{id} method:delete 
export const reqDeleteTradeMark = (id) => request({url:`/admin/product/baseTrademark/remove/${id}`,method:'delete'})