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
// 获取商品列表
export const reqProductList = (pageNum, pageSize) => ajax('/manage/product/list',
                                    {pageNum, pageSize})
// 根据要求获取列表分类
export const reqSearchList = (pageNum, pageSize, Search, productType) => (
    ajax('/manage/product/search', {pageNum, pageSize, [productType]: Search})
)
// 对商品进行下架上架处理
export const reqUpdateStatus = (productId , status) =>
    ajax(
        '/manage/product/updateStatus',
        { productId, status },
        'POST'
    )
// 根据id查询分类
export const reqCategoryInfo = (categoryId) => ajax('/manage/category/info', {categoryId})
// 添加分类和更新分类
export const reqUptaAdd = (data) => ajax('/manage/product/update', data, 'POST')
// 删除图片
export const reqDeletePic = (name) => ajax('/manage/img/delete', {name}, 'POST')