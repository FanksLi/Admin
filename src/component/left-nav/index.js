import React, { Component } from 'react'

import { Link, withRouter } from 'react-router-dom'
import { Menu } from 'antd';

import logo from  '../../assets/images/logo.png'
import menuList from '../../config/menuConfig.js'
import './index.less'

const { SubMenu } = Menu;
class LeftNav extends Component {
	// 渲染侧边导航函数方法
	getMenuList = (list) => {
		return list.map(item => {
			if (!item.children) {
				return (
				  <Menu.Item key={item.key} icon={item.icon}>
				   <Link to={item.key}>{item.title}</Link>
				  </Menu.Item>
				)
			} else {
				let path = this.props.location.pathname
				if (path.indexOf('/product') !== -1) {
					path = '/product'
				}
				const child = item.children.find(child => path === child.key)
				if (child) {
					this.path = item.key
				}
				return (
					<SubMenu key={item.key} icon={item.icon} title={item.title}>
						{this.getMenuList(item.children)}
					</SubMenu>
				)
			}
		})
	}
	UNSAFE_componentWillMount () {
		this.getMenuList(menuList)
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
					<img src={logo} alt='logo' />
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