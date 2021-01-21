import React, { Component } from 'react'

import { Link, withRouter } from 'react-router-dom'
import { Menu } from 'antd';

import logo from  '../../assets/images/logo.jpg'
import { getUser } from '../../units/storage'
import menuList from '../../config/menuConfig.js'
import './index.less'

const { SubMenu } = Menu;
class LeftNav extends Component {
	constructor(props) {
		super(props);
		const user = getUser()
		this.state = {
			user
		}
		this.getMenuList(menuList)
	}
	// 渲染侧边导航函数方法
	getMenuList = (list) => {
		let path = this.props.location.pathname
		const { menus } = this.state.user.role
		return list.map(item => {
			const str = menus.find(menu => menu === item.key)
			if (!item.children) {
				if (this.state.user.username === 'admin' || item.key === '/home') {
					return (
						<Menu.Item key={item.key} icon={item.icon}>
							<Link to={item.key}>{item.title}</Link>
						</Menu.Item>
					)
				} else if (str) {
					return (
						<Menu.Item key={item.key} icon={item.icon}>
							<Link to={item.key}>{item.title}</Link>
						</Menu.Item>
					)
				} else {
					return null
				}
			} else {
				const str = menus.find(menu => {
					return menu.indexOf(item.key) !== -1
				})
				if (path.indexOf('/product') !== -1) {
					path = '/product'
				}
				const child = item.children.find(child => path === child.key)
				if (child) {
					this.path = item.key
				}
				if (str || this.state.user.username === 'admin') {
					return (
						<SubMenu key={item.key} icon={item.icon} title={item.title}>
							{this.getMenuList(item.children)}
						</SubMenu>
					)
				} else {
					return null
				}
			}
		})
	}
	render () {
		// debugger
		let url = this.props.location.pathname
		if (url.indexOf('/product') !== -1) {
			url = '/product'
		}
		return (
			<div className='left-nav'>
				<div className='left-nav-title'>
					<img src={logo} alt='logo' style={{borderRadius: '50%'}} />
					<h1>电商后台管理</h1>
				</div>
				<Menu mode="inline" theme="dark" defaultOpenKeys={[this.path]} selectedKeys={[url]}>
					{this.getMenuList(menuList)}
				</Menu>
			</div>
		)
	}
}

export default withRouter(LeftNav)