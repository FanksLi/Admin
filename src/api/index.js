/* 
	请求方法
 */
import ajax from './ajax.js'

const base = ''
// 登录
export const reqLogin = (username, password) => ajax(base + '/login', { username, password }, 'POST')
// 获取天去信息
export const reqWeather = (url) => ajax(url)
// 获取分类列表
export const reqCategory = (parentId) => ajax('/manage/category/list', {parentId})
// 修改分类
export const reqUpdate = (data) => ajax('/manage/category/update', data, 'POST')
// 添加分类
export const reqAdd = (data) => ajax('/manage/category/add', data, 'POST')