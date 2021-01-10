import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'

import { Form, Input, Button, message } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import { reqLogin } from '../../api'
import { saveUser, getUser } from '../../units/storage.js'

import logo from '../../assets/images/logo.png'
import './css/login.less'

export default class Login extends Component {
	// 自定义检验
	validatorPwd = (rule, value) => {
		const values = value || ''
		if (values.length === 0) {
			return Promise.reject('密码不能为空！')
		} else if (values.length < 4 || values.length > 12) {
			return Promise.reject('密码长度为4-12位！')
		} else if (!/^[a-zA-Z_.]+$/.test(values)) {
			return Promise.reject('用户名为英文、数字或下划线组成!')
		} else {
			return Promise.resolve()
		}
	}
	// 提交方法
	onFinish = async (value) => {
		const { username, password } = value
		const res = await reqLogin(username, password)
		if (res.status === 0) {
			saveUser(res.data)
			this.props.history.replace('/')
			message.success('登录成功')
		} else {
			message.error(res.msg)
			console.log(res)
		}
	}
	render () {
		const user = getUser()
		if (user && user._id) {
			return <Redirect to='/' />
		}
		return (
			<div className='login'>
				<header className='login-header'>
					<img alt='logo' src={logo} />
					<h1>React项目:后台管理系统</h1>
				</header>
				<section className='login-content'>
					<h2 className='content-title'>用户登录</h2>
					<Form
						style={{marginTop: '20px'}}
						onFinish={this.onFinish}
					      name="login"
					    >
					      <Form.Item
					        name="username"
					        rules={[
					          {
					            required: true,
					            message: '用户名不能为空!',
					          },
							  {
							    max: 12,
								min: 4,
							    message: '用户名使用为4-12位!',
							  },
							  {
								pattern: /^[a-zA-Z_.]+$/,
							    message: '用户名为英文、数字或下划线组成!',
							  },
					        ]}
							initialValue="admin"
					      >
					        <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username" />
					      </Form.Item>
					
					      <Form.Item
					        name="password"
					        rules={[
					          {
					            validator: this.validatorPwd,
					          },
					        ]}
					      >
					        <Input.Password   prefix={<LockOutlined className="site-form-item-icon" />} placeholder="Password" />
					      </Form.Item>
					      <Form.Item
							style={{marginTop: '30px'}}
						  >
					        <Button type="primary" htmlType="submit" style={{width: '100%'}} >
					          登录
					        </Button>
					      </Form.Item>
					    </Form>
				</section>
			</div>
		)
	}
}
