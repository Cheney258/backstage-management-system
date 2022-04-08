// 引入axios(axios进行二次封装)
import request from '@/utils/request'

// 登录接口函数
export function login(data) {
  return request({
    url: '/admin/acl/index/login',
    method: 'post',
    data
  })
}

// 获取用户信息的函数
export function getInfo(token) {
  return request({
    url: '/admin/acl/index/info',
    method: 'get',
    params: { token }
  })
}

// 退出登录的函数
export function logout() {
  return request({
    url: '/admin/acl/index/logout',
    method: 'post'
  })
}


// 后台管理系统API接口文档：
// http://39.98.123.211:8170/swagger-ui.html
// http://39.98.123.211:8216/swagger-ui.html