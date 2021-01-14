import React, { Component } from 'react'
import { List, Card } from 'antd'
import { ArrowLeftOutlined } from '@ant-design/icons'

import { reqCategoryInfo } from '../../api'
const Item = List.Item
export default class ProductInfo extends Component {
	constructor(props) {
		super(props);
		this.state={
			category: '',
			pCategory: ''
		}
	}
	// 获取分类名称
	getCategoryInfo = async () => {
		const {categoryId, pCategoryId} = this.props.location.state
		let res
		if (pCategoryId === '0') {
			res = await reqCategoryInfo(categoryId)
			if (res.status === 0) {
				this.setState({
					category: res.data.name
				})
			}
		} else {
			res = await Promise.all([reqCategoryInfo(categoryId), reqCategoryInfo(pCategoryId)])
			if (res[0].status === 0 && res[1].status === 0) {
				this.setState({
					category: res[0].data.name,
					pCategory: res[1].data.name
				})
			}
		}
	}
	componentDidMount() {
		this.getCategoryInfo()
	}

	render () {
		console.log(this.props.location.state)
		const baseUrl = 'http://localhost:5000/upload/'
		const { name, desc, price, imgs, detail, pCategoryId } = this.props.location.state
		const { category, pCategory } = this.state
		const title = (
			<span>
				<ArrowLeftOutlined
					style={{fontSize: 20, margin: '0 15px', color: '#1DA57A'}}
					onClick={() => this.props.history.goBack()}
				/>
				商品详细
			</span>)
		return (
			<Card title={title} className='product-info'>
				<List>
					<Item className='product-item'>
						<span className='left'>商品名称：</span>
						<span>{name}</span>
					</Item>
					<Item className='product-item'>
						<span className='left'>商品描述：</span>
						<span>{desc}</span>
					</Item>
					<Item className='product-item'>
						<span className='left'>商品价格：</span>
						<span>￥{price}</span>
					</Item>
					<Item className='product-item'>
						<span className='left'>商品分类：</span>
						<span>{ (pCategoryId === '0' ? '' : pCategory + ' > ') + category}</span>
					</Item>
					<Item className='product-item'>
						<span className='left'>商品图片：</span>
						<span>
						{
							imgs.map((item, index) => (
								<img style={{width: 150, height: 150, border: '1px solid #1DA57A'}} src={baseUrl + item} alt='img' key={index}/>
							))
						}
						</span>
					</Item>
					<Item className='product-item'>
						<span className='left'>商品详情：</span>
						<span dangerouslySetInnerHTML={{__html: detail}}>
						</span>
					</Item>
				</List>
			</Card>

		)
	}
}