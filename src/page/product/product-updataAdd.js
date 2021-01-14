import React, { Component } from 'react'
import {Card, Form, Input, Cascader, Button, message} from 'antd'
import {ArrowLeftOutlined} from "@ant-design/icons";

import { reqCategory, reqUptaAdd } from '../../api'
import PicturesWall from './pictures-wall'
import EditorText from "./editor-text";

const Item = Form.Item
export default class ProductUpdataAdd extends Component {
	constructor(props) {
		super(props);
		this.pw = React.createRef()
		this.editor = React.createRef()
		this.state = {
			optionList: []
		}
	}
	// 发送请求获取分类列表
	getOptionList = async (parentId='0') => {
		const  res = await reqCategory(parentId)
		if (res.status === 0 ) {
			// 判断是一级分类还是二级分类
			if (parentId === '0') {
				console.log(res)
				this.initOptionList(res.data, parentId)
			} else if (parentId !== '0') {
				return this.initOptionList(res.data, parentId)
			}
		}
	}
	// 初始化数据列表
	initOptionList = async (list, parentId) => {
		const optionList = []
		const isLeaf = parentId !== '0'
		list.forEach(item => {
			optionList.push({
				value: item._id,
				label: item.name,
				isLeaf,
				parentId: item.parentId,
			})
		})
		if (parentId === '0') {
			const { pCategoryId } = this.product
			// 判断是否添加子分类
			if (pCategoryId !== '0') {
				const res = await reqCategory(pCategoryId)
				const data = res.data
				const optionChild = await this.initOptionList(data, pCategoryId)
				optionList.forEach(item => {
					if(item.value === pCategoryId) {
						item.children = optionChild
					}
				})
			}
				this.setState({
					optionList
				})
		} else {
			return optionList
		}
	}
	// 处理数据动态加载级联选择框
	loadData = async (selectedOptions) => {
		const targetOption = selectedOptions[selectedOptions.length - 1]
		console.log(selectedOptions[selectedOptions.length - 1])
		targetOption.loading = true
		// 获取二级数据
		const res = await this.getOptionList(targetOption.value)
		targetOption.loading = false
		// 判断是否有数据
		if (res && res.length > 0) {
			targetOption.children = res
		} else {
			targetOption.isLeaf = true
		}
		// 将数据添加到状态中去
		this.setState({
			optionList: [...this.state.optionList]
		})
	}
	// 表单验证成功时方法
	onFinish = async (value) => {
		const {name, desc, price} = value
		let categoryId, pCategoryId
		// 获取分类id，黑父类id
		if (value.categoryId[1]) {
			categoryId = value.categoryId[1]
			pCategoryId = value.categoryId[0]
		} else {
			categoryId = value.categoryId[0]
			pCategoryId = '0'
		}
		const imgs = this.pw.current.getStateList()
		const detail = this.editor.current.getEditor()
		let data,res
		// 更新请求
		if (this.props.location.state._id) {
			const {_id} = this.props.location.state
			data = { _id, categoryId, pCategoryId, name, desc, price: price+'', imgs, detail }
			res = await reqUptaAdd(data, 'update')
		} else { // 发送添加请求
			data = {categoryId, pCategoryId, name, desc, price: price+'', imgs, detail }
			 res = await reqUptaAdd(data, 'add')
		}
		console.log(res)
		if (res.status === 0) {
			message.success(this.product ? '更新成功' : '添加成功')
			this.props.history.replace('/product')
		} else {
			message.success(this.product ? '更新失败' : '添加失败')
		}
		console.log(data)
	}
	componentDidMount() {
		const { categoryId, pCategoryId } = this.props.location.state || {}
		this.product = { categoryId, pCategoryId}
		this.getOptionList()
	}

	render () {
		const { optionList } = this.state
		const product = this.props.location.state || {}
		let categoryArr = []
		if (product.categoryId) {
			categoryArr = product.pCategoryId === '0' ? [product.categoryId]: [product.pCategoryId, product.categoryId]
		}
		const title = (
			<span>
				<ArrowLeftOutlined
					style={{fontSize: 20, margin: '0 15px', color: '#1DA57A'}}
					onClick={() => this.props.history.goBack()}
				/>
				{product.categoryId ? '商品修改':'添加商品'}
			</span>)
		return (
			<Card title={title}>
				<Form onFinish={this.onFinish}>
					<Item
						label='商品名称'
						name='name'
						initialValue={product.name}
						rules={[
							{required: true, message: '商品名称不能为空'}
						]}
					>
						<Input placeholder='请输入商品名称' style={{width: '40%'}}/>
					</Item>
					<Item
						label='商品描述'
						name='desc'
						initialValue={product.desc}
						rules={[
							{required: true, message: '商品描述不能为空'}
						]}
					>
						<Input.TextArea  placeholder='请输入商品描述' style={{width: '40%'}}/>
					</Item>
					<Item
						label='商品价格'
						name='price'
						initialValue={product.price}
						rules={[
							{required: true, message: '商品价格不能为空'}
						]}
					>
						<Input type='number' addonAfter='元' placeholder='请输入商品价格' style={{width: '40%'}}/>
					</Item>
					<Item
						label='商品分类'
						name='categoryId'
						initialValue = {product ? categoryArr : [] }
						rules={[
							{required: true, message: '请选择商品分类'}
						]}
					>
						<Cascader options={optionList} loadData={this.loadData} placeholder='请选商品分类' style={{width: '40%'}} />
					</Item>
					<Item
						label='商品图片'
					>
						<PicturesWall imgs={product.imgs ? product.imgs : []} ref={this.pw} />
					</Item>
					<Item
						label='商品详细'
					>
						<EditorText detail={product.detail ? product.detail : ''} ref={this.editor} />
					</Item>
					<Button type='primary'  htmlType="submit" >提交</Button>
				</Form>
			</Card>
		)
	}
}