import React, { Component } from 'react'
import {Card, Button, Table, message, Modal, Form, Select, Input} from 'antd'
import { ExclamationCircleOutlined } from '@ant-design/icons'

import { reqRoleList, reqAddorUpdataUser, reqDeleteUser } from '../../api'
import formatDate from "../../units/formatDate"
import ButtonHref from "../../component/button-href"
import {PAGE_SIZE} from "../../units/constant";

const Item = Form.Item
const Option = Select.Option
const { confirm } = Modal
export default class User extends Component {
	constructor(props) {
		super(props);
		this.AddformRef = React.createRef()
		this.initColumns()
		this.state = {
			roleList: [],
			userList: [],
			isUserVisible: false
		}
	}
	// 初始化列表
	initColumns = () => {
		this.columns = [
			{
				title: '用户名',
				dataIndex: 'username',
			},
			{
				title: '邮箱',
				dataIndex: 'email',
			},
			{
				title: '电话',
				dataIndex: 'phone',
			},
			{
				title: '注册时间',
				dataIndex: 'create_time',
				render: (create_time) => {
					return formatDate(create_time)
				}
			},
			{
				title: '所属角色',
				dataIndex: 'role_id',
				render: (role_id) => {
					const role = this.state.userList.find(item => {
						return item._id === role_id
					})
					return role.name
				}
			},
			{
				title: '操作',
				render: (user) => (
					<span>
						<ButtonHref onClick={() => this.userUpdata(user)}>修改</ButtonHref>
						<ButtonHref onClick={() => this.userDelete(user)}>删除</ButtonHref>
					</span>
				)
			},
		]
	}
	// 发送请求获取用户数据
	getRoleList = async () => {
		const res = await reqRoleList()
		if (res.status === 0) {
			const roleList = res.data.users
			const userList = res.data.roles
			roleList.forEach(item => {
				item.key = item._id
			})
			this.setState({
				roleList,
				userList
			})
		} else {
			message.error('获取用户列表失败')
		}
	}
	// 添加确认
	handleAddOk = () => {
		this.AddformRef.current.submit()
	}
	// 添加取消
	handleAddCancel = () => {
		this.AddformRef.current.resetFields()
		this.user = {}
		this.setState({
			isUserVisible: false
		})
	}
	// 修改
	userUpdata = (user) => {
		this.user = user
		this.setState({
			isUserVisible: true
		}, () => {
			this.AddformRef.current.setFieldsValue(this.user)
		})
	}
	// 表单提交成功
	onFinishAdd = async (value) => {
		let res
		const addData = value
		const updataDate = {
			_id: this.user._id,
			username: value.username,
			phone: value.phone,
			email: value.email,
			role_id: value.role_id
		}
		if (updataDate._id) {
			res = await reqAddorUpdataUser(updataDate)
		} else {
			res = await reqAddorUpdataUser(addData)
		}
		if (res.status === 0) {
			this.setState({
				isUserVisible: false
			})
			this.getRoleList()
		} else {
			message.error(updataDate._id ? '更新失败' : '添加失败')
		}
	}
	userAddorUpdata = () => {
		this.setState({ isUserVisible: true })
	}
	// 删除用户
	userDelete = (user) => {
		confirm({
			title: '警告！',
			icon: <ExclamationCircleOutlined />,
			content: '你确定要删除该用户吗?',
			onOk: async () => {
				const res = await reqDeleteUser(user._id)
				if (res.status === 0) {
					this.getRoleList()
				} else {
					message.error('删除失败')
				}
			}
		});
	}
	componentDidMount() {
		this.getRoleList()
	}
	render () {
		const { roleList, isUserVisible, userList } = this.state
		const user = this.user || {}
		const layout = {
			labelCol: { span: 4 },
			wrapperCol: { span: 16 },
		}
		const title = (
			<span style={{marginLeft: 50}}>
				<Button
					type='primary'
					onClick={this.userAddorUpdata}
				>
					创建用户
				</Button>
			</span>
		)
		return (
			<Card title={title}>
				<Table
					dataSource={roleList}
					columns={this.columns}
					pagination={{pageSize: PAGE_SIZE}}
				/>
				<Modal
					title="添加用户"
					visible={isUserVisible}
					onOk={this.handleAddOk}
					onCancel={this.handleAddCancel}
				>
					<Form
						{...layout}
						ref={this.AddformRef}
						onFinish={this.onFinishAdd}
					>
						<Item
							label='用户名'
							name='username'
							rules={[
								{required: true, message: '用户名不能为空'}
							]}
						>
							<Input placeholder='请输入用户名'></Input>
						</Item>
						{!user._id ? (
							<Item
								label='密码'
								name='password'
								rules={[
									{required: true, message: '密码不能为空'},
									{max: 12, min: 6, message: '密码长度为6-12位'}
								]}
							>
								<Input placeholder='请输入密码'></Input>
							</Item>
						) : null}
						<Item
							label='手机号'
							name='phone'
							rules={[
								{required: true, message: '手机号不能为空'}
							]}
						>
							<Input placeholder='请输入手机号'></Input>
						</Item>
						<Item
							label='邮箱'
							name='email'
							rules={[
								{required: true, message: '邮箱不能为空'}
							]}
						>
							<Input placeholder='请输入邮箱'></Input>
						</Item>
						<Item
							label='角色'
							name='role_id'
							rules={[
								{required: true, message: '邮箱不能为空'}
							]}
						>
							<Select placeholder='请选择角色'>
								{userList.map(item => {
									return (
										<Option key={item._id} value={item._id}>{item.name}</Option>
									)
								})}
							</Select>
						</Item>
					</Form>
				</Modal>
			</Card>
		)
	}
}