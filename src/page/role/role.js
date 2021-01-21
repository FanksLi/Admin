import React, { Component } from 'react'
import {reqRoleAdd, reqUserList, reqUpdataRole} from "../../api";
import {Button, Card, Form, Input, message, Modal, Table, Tree} from "antd";
import {PAGE_SIZE} from "../../units/constant";
import menuConfig from "../../config/menuConfig";
import { getUser, removeUser } from '../../units/storage'
import formatDate from '../../units/formatDate'

const Item = Form.Item
export default class Role extends Component {
	formRef = React.createRef()
	constructor(props) {
		super(props);
		this.initTabColumns()
		this.initTreeList(menuConfig)
		this.state = {
			userList: [],
			isShowAdd: false,
			isShowSet: false,
			role: {},
			selectKey: ''
		}
	}
	// 初始化权限数组
	initTreeList = (menuConfig) => {
		const arrList = []
		const arr = menuConfig.reduce((pre, item) => {
			const obj = {}
			obj.title = item.title
			obj.key = item.key
			if (item.children) {
				obj.children = item.children.map(map => {
					return {
						title: map.title,
						key: map.key
					}
				})
				this.initTreeList(item.children)
			}
			pre.push(obj)
			return pre
		}, [])
		arrList.push(
			{
				title: '权限设置',
				key: '/'
			}
		)
		arrList[0].children = arr
		this.TreeList = arrList
	}
	// 角色信息列表数据初始化
	initTabColumns = () => {
		this.columns = [
			{
				title: '角色名称',
				dataIndex: 'name'
			},
			{
				title: '创建时间',
				dataIndex: 'create_time',
				render: (create_time) => {
					return formatDate(create_time)
				}
			},
			{
				title: '授权时间',
				dataIndex: 'auth_time',
				render: (auth_time) => {
					return formatDate(auth_time)
				}
			},
			{
				title: '授权人',
				dataIndex: 'auth_name'
			},
		]
	}
	// 获取角色数据
	getUserList = async () => {
		const res = await reqUserList()
		const userList = res.data
		userList.forEach(item => {
			item.key = item._id
		})
		if (res.status === 0) {
			this.setState({
				userList
			})
		} else {
			message.error('用户列表获取失败')
		}
	}
	// 添加角色确认
	handleOk = () => {
		this.formRef.current.submit()
	}
	// 添加角色取消
	handleCancel = () => {
		this.formRef.current.resetFields()
		this.setState((state) => {
			return state.isShowAdd = false
		})
	}
	// 添加并发送请求
	roleAdd = async (value) => {
		const res = await reqRoleAdd(value)
		if (res.status === 0) {
			const data = res.data
			data.key = data._id
			this.setState((state) => {
				return (
					state.userList = [...state.userList, data],
						state.isShowAdd = false
				)
			})

		}
	}
	// 单选按钮被点击时
	handleChange = (selectKey, selectRow) => {
		this.setState({
			selectKey: selectKey[0],
			role: selectRow[0]
		})
	}
	// 设置角色
	handleSetOk = async () => {
		const { role, userList } = this.state
		const {_id, menus} = role
		const auth_time = Date.now()
		const auth_name = getUser().username
		const res = await reqUpdataRole({_id, menus, auth_time, auth_name})
		if (res.status === 0) {
			console.log(role._id, getUser().role_id)
			if (role._id === getUser().role_id) {
				removeUser()
				message.info('修改权限，请重新登录')
			}
			// 查找更新权限对象的位置
			const index = userList.findIndex(item => {
				return item.name === res.data.name
			})
			// 将数据更新为最新数据
			userList[index] = res.data
			// 给数据添加key值
			userList.forEach(item => {
				item.key = item._id
			})
			// 将最新数据传递给state
			this.setState({
				isShowSet: false,
				role: {},
				selectKey: '',
				userList: [...userList]
			})
		} else {
			message.error('更新失败')
		}
	}
	// 添加权限关闭
	handleSetCancel = () => {
		this.setState({
			isShowSet: false,
			role: {},
			selectKey: ''
		})
	}
	// check被点击时跟新数据
	handCheck = (menus) => {
		this.setState({
			role: {...this.state.role, menus}
		})
	}
	componentDidMount() {
		this.getUserList()
	}
	render () {
		const { userList, isShowAdd, selectKey, role, isShowSet } = this.state
		const title = (
			<span>
				<Button
					type='primary'
					style={{margin: '0 20px'}}
					onClick={() => this.setState({ isShowAdd: true })}>
					创建角色
				</Button>
				<Button
					type='primary'
					disabled={selectKey ? false : true}
					onClick={() => this.setState({ isShowSet: true })}>
					设置角色权限
				</Button>
			</span>
		)
		return (
			<Card title={title}>
				<Table
					dataSource={userList}
					columns={this.columns}
					pagination={{pageSize: PAGE_SIZE}}
					rowSelection={{type: 'radio', onChange: this.handleChange, selectedRowKeys: [selectKey]}}
					onRow={role => {
						return {
							onClick: (event) => {
								this.setState({
									selectKey: role.key,
									role
								})
							}
						}
					}}
				/>
				{/*添加角色弹窗*/}
				<Modal
					title="创建角色"
					visible={isShowAdd}
					onOk={this.handleOk}
					onCancel={this.handleCancel}>
					<Form ref={this.formRef} onFinish={this.roleAdd}>
						<Item
							label='角色名称'
							name='roleName'
							rules={[
								{
									required: true,
									message: '角色名称不能为空',
								},
							]}
						>
							<Input />
						</Item>
					</Form>
				</Modal>
				{/*添加角色弹窗*/}
				<Modal
					title="设置角色权限"
					visible={isShowSet}
					onOk={this.handleSetOk}
					onCancel={this.handleSetCancel}>
					<Item label='角色名称'>
						<Input value={role.name} disabled />
					</Item>
					<Tree
						checkable
						checkedKeys={role.menus || []}
						defaultExpandAll
						onCheck={this.handCheck}
						treeData={this.TreeList}
					/>
				</Modal>
			</Card>
		)
	}
}