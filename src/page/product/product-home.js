import React, { Component } from 'react'
import {
	Card,
	Input,
	Button,
	Table,
	Select
} from 'antd'

import { reqProductList, reqSearchList, reqUpdateStatus } from '../../api'
import { PAGE_SIZE } from '../../units/constant'
import ButtonHref from '../../component/button-href/index.js'

const { Option } = Select
export default class ProductHome extends Component {
	state = {
		productList: [],
		pageNum: 1,
		total: 0,
		search: '',
		productType: 'productName',
	}
	// 获取列表数据
	getProductList = async () => {
		const { pageNum, search, productType } = this.state
		const pageSize = PAGE_SIZE
		this.pageNum = pageNum
		let res
		// 根据要求获取列表数据
		if (search) {
			this.pageNum = 1
			res = await reqSearchList(this.pageNum, pageSize, search, productType)
		} else {
			// 获取全部列表数据
			res = await reqProductList(pageNum, pageSize)
		}
		if (res.status === 0 ) {
			const { list, total } = res.data
			list.forEach((item, index) => {
				item.key = index
			})
			this.setState({
				total,
				productList: list
			})
		}
		console.log(res)
	}
	// 上架下架函数方法
	updataStatus = async (type, id) => {
		const status = type === 1 ? 0 : 1
		const res = await reqUpdateStatus(id, status)
		if (res.status === 0) {
			this.getProductList()
		}

	}
	// 页数发生改变时从新渲染页面
	handleChange = (page) => {
		this.setState({
			pageNum: page.current
		}, () => {
			this.getProductList()
		})
	}
	componentDidMount() {
		this.getProductList()
		this.columns = [
			{
				classNmae: 'product_list',
				title: '商品名称',
				width: '200px',
				dataIndex: 'name',
				render: (name) => <span style={{fontSize: 16}}>{name}</span>
			},
			{
				title: '商品描述',
				dataIndex: 'desc',
			},
			{
				title: '价格',
				width: '100px',
				dataIndex: 'price',
				render: (price) => (<span>￥{price}</span>)
			},
			{
				title: '状态',
				width: '50px',
				render: (item) => {
					const { _id, status } = item
					if (item.status === 1) {
						return (
							<span>
								<Button type='primary'
										onClick={() => this.updataStatus(status, _id)}>下架</Button>
								<span>在售</span>
							</span>)
					} else {
						return (
							<span>
								<Button type='primary'
										onClick={() => this.updataStatus(status, _id)}>上架</Button>
								<span>已下架</span>
							</span>)

					}
				}
			},
			{
				title: '操作',
				width: '200px',
				render: (item) => (
					<span>
						<ButtonHref onClick={() => this.props.history.push('/product/info', item)}>详情</ButtonHref>
						<ButtonHref onClick={() => this.props.history.push('/product/updateadd', item)}>修改</ButtonHref>
					</span>
				)
			},
		]
	}
	render () {
		this.dataSource = this.state.productList
		const title = (
		<span style={{display: 'flex', alignItem: 'center'}}>
			<Select
				value={this.state.productType}
				style={{width: 150}}
				onChange={(value) => {
					this.setState({productType: value})
					}
				}
			>
				<Option value='productName'>按名称搜索</Option>
				<Option value='productDesc'>按描述搜索</Option>
			</Select>
			<Input  style={{width: 200, margin: '0 20px'}} value={this.state.search} onChange={(e) => {
				this.setState({
					search: e.target.value
				})
			}}/>
			<Button type='primary' onClick={this.getProductList}>搜索</Button>
		</span>
		)

		return (
			<Card title={title} extra={<ButtonHref onClick={() => this.props.history.push('/product/updateadd')}>+ 添加商品</ButtonHref>}>
				<Table
					bordered
					dataSource={this.dataSource}
					columns={this.columns}
					pagination={{pageSize: PAGE_SIZE, total: this.state.total, current: this.pageNum}}
					onChange= {this.handleChange}
				/>
			</Card>
		)
	}
}