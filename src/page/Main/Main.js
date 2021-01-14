import React, { Component } from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'
import { Layout } from 'antd';

import { getUser } from '../../units/storage.js'
import Header from '../../component/header'
import LeftNav from '../../component/left-nav'
import Home from '../Home/Home.js'
import Category from '../category/category.js'
import Product from '../product/product.js'
import Role from '../role/role.js'
import User from '../user/user.js'
import Bar from '../charts/bar.js'
import Pie from '../charts/pie.js'
import Line from '../charts/line.js'
import './Main.less'


const { Footer, Sider, Content } = Layout;

export default class Main extends Component {
	render () {
		const user = getUser()
		if (!user || !user._id) {
			return <Redirect to='/login' />
		}
		return (
			<Layout style={{minHeight: '100%'}}>,
				<Sider className='home-sider'>
					<LeftNav />
				</Sider>
				<Layout>
					<Header>Header</Header>
					<Content className='home-content'>
						<Switch>
							<Route path='/home' component={ Home }/>
							<Route path='/category' component={ Category }/>
							<Route path='/product' component={ Product }/>
							<Route path='/role' component={ Role }/>
							<Route path='/user' component={ User }/>
							<Route path='/charts/bar' component={ Bar }/>
							<Route path='/charts/pie' component={ Pie }/>
							<Route path='/charts/line' component={ Line }/>
							<Redirect to='/home' />
						</Switch>
					</Content>
					<Footer className='home-footer'>推荐使用Google浏览器,可以获得更加的页面操作体验</Footer>
				</Layout>
			</Layout>
		)
	}
}