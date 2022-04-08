// 将四个模块请求的接口函数统一封装
import * as trademark from './product/tradeMark'
import * as attr from './product/attr'
import * as sku from './product/sku'
import * as spu from './product/spu'

// 对外暴露
export default {
    trademark,
    attr,
    sku,
    spu
}