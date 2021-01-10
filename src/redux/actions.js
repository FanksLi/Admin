// import { message } from 'antd'

// import { reqLogin } from '../api/index.js'
// import {
// 	GET_USER,
// 	LOGOUT
// } from './actionType.js'

// const getUser = (user) => ({type: GET_USER, data: user})
// export const logOut = () => ({type: LOGOUT, data: {}})

// export function user (username, password) {
// 	console.log(username, password)
// 	return async dispatch => {
// 		const res = await reqLogin(username, password)
// 		if (res.status === 0) {
// 			message.success('登录成功')
// 			dispatch(getUser(res.data))
// 		} else {
// 			message.error('密码或验证码错误！')
// 			dispatch(getUser(res))
// 		}
// 	}
// }