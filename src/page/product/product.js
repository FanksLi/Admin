import React, { Component } from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'

import ProductHome from './product-home.js'
import ProductUpdataAdd from './product-updataAdd.js'
import ProductInfo from './product-info.js'
import './product.less'

export default class Product extends Component {
	render () {
		return (
			<Switch>
				<Route path='/product' component={ProductHome} exact />
				<Route path='/product/info' component={ProductInfo} />
				<Route path='/product/updateadd' component={ProductUpdataAdd} />
				<Redirect to='/product' />
			</Switch>
		)
	}
}