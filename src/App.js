import React, { Component } from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'


import Login from './page/Login/Login.js'
import Main from './page/Main/Main.js'


export default class App extends Component {
	render () {
		return (
			<BrowserRouter>
				<Switch>
					<Route path='/login' component={Login}/>
					<Route path='/' component={Main}/>
				</Switch>
			</BrowserRouter>
		)
	}
}