import React, { Component } from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'

import ProductHome from './product-home.js'
import ProductAdd from './product-add.js'
import ProductUpdate from './product-update.js'
import ProductInfo from './product-info.js'

export default class Product extends Component {
	render () {
		return (
			<Switch>
				<Route path='/product' component={ProductHome} exact />
				<Route path='/product/info' component={ProductInfo} />
				<Route path='/product/add' component={ProductAdd} />
				<Route path='/product/update' component={ProductUpdate} />
				<Redirect to='/product' />
			</Switch>
		)
	}
}