import React, { Component } from 'react'
import { Card, Table, message, Modal, Form, Input, Select } from 'antd'

import { reqCategory, reqUpdate, reqAdd } from '../../api'

import ButtonHref from '../../component/button-href/index.js'
const Item = Form.Item
const { Option } = Select
export default class Category extends Component {
	formRef = React.createRef()
	state = {
		dataSource: [],
		subdataSource: [],
		parentId: 0,
		isShowCategory: false,
		isShowAdd: false,
		data: {}
	}
	// 根据要求发送获取列表请求
	getCategory = async () => {
		const {parentId} = this.state
		const res = await reqCategory(parentId)
		res.data.forEach(item => {
			item.key = item._id
		})
		if (res.status === 0) {
			if (parentId === 0) {
				this.setState({
					dataSource: res.data
				})
			} else {
				this.setState({
					subdataSource: res.data
				})
			}
			
		} else {
			message.error('列表获取失败')
		}
	}
	// 获取二级分类
	getSubList = (data) => {
		const parentId = data._id
		this.setState({
			parentId
		}, () => {
			this.getCategory()
		})
	}
	// 获取一级分类
	getList = () => {
		this.setState({
			parentId: 0
		}, () => {
			this.getCategory()
		})
	}
	/* 
	 修改分类
	 */
	update = (data) => {
		this.setState({
			isShowCategory: true,
			data
		}, () => {
			this.formRef.current.setFieldsValue({categoryName: this.state.data.name})
		})
	}
	// 修改确认
	categoryHandleOk = () => {
		this.formRef.current.submit()
	}
	// 修改取消
	categoryHandleCancel = () => {
		this.setState({
			isShowCategory: false,
			data: {}
		}, () => {
			this.formRef.current.resetFields()
		})
	}
	// 验证成功，发送请求，修改数据
	categoryFinish = async (value) => {
		const categoryId = this.state.data._id
		const categoryName = value.categoryName 
		const res = await reqUpdate({ categoryId, categoryName })
		if (res.status === 0 ) {
			this.setState({
				isShowCategory: false,
				data: {}
			}, () => {
				// 重置表单数据
				this.formRef.current.resetFields()
			})
		} else {
			message.error('网络繁忙，稍后再试！')
		}
		// 从新渲染数据
		this.getCategory()
	}
	/* 
	 添加分类
	 */
	add = () => {
		this.setState({
			isShowAdd: true
		}, () => {
			this.formRef.current.setFieldsValue({parentId: this.state.parentId+''})
		})
	}
	// 添加确认
	addHandleOk = () => {
		this.formRef.current.submit()
	}
	// 添加取消
	addHandleCancel = () => {
		this.setState({
			isShowAdd: false
		}, () => {
			this.formRef.current.resetFields()
		})
	}
	AddFinish = async (value) => {
		const { parentId, categoryName }  = value
		const res = await reqAdd({ parentId, categoryName })
		if (res.status === 0) {
			this.addHandleCancel()
			this.getCategory()
		} else {
			message.error('添加失败，稍后再试')
		}
	}
	componentDidMount () {
		this.getCategory()
	}
	render () {
		const { dataSource, subdataSource, parentId, isShowAdd, isShowCategory } = this.state
		const columns = [
		  {
		    title: '分类名称',
		    dataIndex: 'name',
			width: '60%',
		  },
		  {
		    title: '操作',
			render: (data) => (
			      <span>
			        <ButtonHref onClick={() => this.update(data)}>修改分类</ButtonHref>
			        {parentId === 0 ? <ButtonHref onClick={() => this.getSubList(data)}>查看二级分类</ButtonHref> : null}
			      </span>
			    ),
		  },
		];
		return (
			<Card 
				className='category_card'
				title={parentId === 0 ? '一级分类' : <span><ButtonHref onClick={this.getList}>一级分类</ButtonHref><span>></span><span>二级分类</span></span>} 
				extra={<ButtonHref onClick={this.add}>+ 添加</ButtonHref>}>
			      <Table
					dataSource={parentId === 0 ? dataSource : subdataSource}
					columns={columns} key='1'
					pagination={{defaultPageSize: 5, showQuickJumper: true}}
				  />
				  <Modal title="修改分类" visible={isShowCategory} onOk={this.categoryHandleOk} onCancel={this.categoryHandleCancel}>
						 <Form ref={this.formRef} onFinish={this.categoryFinish}>
						 	<Item
						 		label='分类名称'
						 		name='categoryName'
						 		initialValue={this.state.data.name}
						 		rules={[
						 			{
						 			required: true,
						 			message: '请输入分类名称！',
						 			},
						 		]}
						 	>
						 		<Input />
						 	</Item>
						 </Form>
				  </Modal>
				  <Modal title="添加分类" visible={isShowAdd} onOk={this.addHandleOk} onCancel={this.addHandleCancel}>
				          <Form ref={this.formRef} onFinish={this.AddFinish}>
							<Item name='parentId' initialValue={parentId+''}>
								<Select style={{ width: '100%' }}>,
									<Option value='0'>一级分类</Option>
									{dataSource.map(item => {
										return (<Option value={item._id} key={item._id}>{item.name}</Option>)
									})}
								</Select>
							</Item>
							<Item
								style={{marginTop: 30}}
								name='categoryName'
								rules={[
									{
									required: true,
									message: '请输入分类名称！',
									},
								]}
							>
								<Input placeholder='输入你的分类名称'/>
							</Item>
						  </Form>
				  </Modal>
			</Card>
		)
	}
}