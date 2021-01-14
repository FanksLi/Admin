import React, { Component } from 'react'
import { withRouter, Redirect } from 'react-router-dom'
import { Modal } from 'antd'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import { reqWeather } from '../../api'
import { getUser, removeUser } from '../../units/storage.js'
import menuList from '../../config/menuConfig.js'
import formatDate from '../../units/formatDate.js'

import ButtonHref from '../button-href/index.js'

import './index.less'

const {confirm} = Modal
class Header extends Component {
	state = {
		weather: {},
		time: ''
	}
	// 设置title
	getMenuList = (list) => {
		return list.forEach(item => {
			let path = this.props.location.pathname
			if (item.children) {
				this.getMenuList(item.children)
			}
			if (path.indexOf('/product') !== -1) {
				path = '/product'
			}
			if (path === item.key) {
				this.title = item.title
			}
		})
	}
	// 获取时间
	getTime = () => {
		if (!this.timeId) {
			const time = formatDate()
			this.setState({
				time
			})
		} 
		this.timeId = setInterval(() => {
			const time = formatDate()
			this.setState({
				time
			})
		}, 1000)
		
		
	}
	// 获取天气
	getWeather = async () => {
		const url = 'http://wthrcdn.etouch.cn/weather_mini?city=怀化'
		const res = await reqWeather(url)
		this.setState({
			weather: res.data.forecast[0]
		})
	}
	// 退出登录
	logOUt = () => {
		console.log(123)
		confirm({
		    title: '温馨提示',
		    icon: <ExclamationCircleOutlined />,
		    content: '你确定要退出登录吗?',
		    onOk: () => {
				// 删除用户信息
				removeUser()
		    },
		  })
	}
	componentDidMount () {
		this.getWeather()
		this.getTime()
	}
	componentWillUnmount () {
		// 清理定时器
		clearInterval(this.timeId)
	}
	render () {
		const user = getUser()
		this.getMenuList(menuList)
		if (!user || !user._id) {
			return <Redirect to='/login' />
		}
		return (
			<div className='home-header'>
				<div className='home-header-top'>
					<span>欢迎,{user.username}</span>
					<ButtonHref onClick={this.logOUt}>退出</ButtonHref>
				</div>
				<div className='home-header-bottom'>
					<div className='header-bottom-left'>
						{this.title}
					</div>
					<div className='header-bottom-right'>
						<span>{this.state.time}</span>
						<img src='' alt='' />
						<span>{this.state.weather.type || '晴天'}</span>
					</div>
				</div>
			</div>
		)
	}
}

export default withRouter(Header)