import React, { Component } from 'react'
import { Tabs, Row, Col, Calendar  } from 'antd'
import { Bar, Column, Pie  } from '@ant-design/charts'
import './home.less'

const { TabPane } = Tabs
export default class Home extends Component {
	getDateBar = () => {
		const data = [
			{
				action: '浏览网站',
				pv: 50000,
			},
			{
				action: '放入购物车',
				pv: 35000,
			},
			{
				action: '生成订单',
				pv: 25000,
			},
			{
				action: '支付订单',
				pv: 15000,
			},
			{
				action: '完成交易',
				pv: 8500,
			},
		]
		return data
	}
	getDateColumn = () => {
		const data = [
			{
				type: '家具家电',
				sales: 38
			},
			{
				type: '粮油副食',
				sales: 52
			},
			{
				type: '生鲜水果',
				sales: 61
			},
			{
				type: '美容洗护',
				sales: 145
			},
			{
				type: '母婴用品',
				sales: 48
			},
			{
				type: '进口食品',
				sales: 38
			},
			{
				type: '食品饮料',
				sales: 38
			},
			{
				type: '家庭清洁',
				sales: 38
			}
		]
		return data
	}
	getDatePie = () => {
		return [
			{
				type: '分类一',
				value: 27,
			},
			{
				type: '分类二',
				value: 25,
			},
			{
				type: '分类三',
				value: 18,
			},
			{
				type: '分类四',
				value: 15,
			},
			{
				type: '分类五',
				value: 10,
			},
			{
				type: '其他',
				value: 5,
			},
		]
	}
	handleChange = (key) => {
		console.log(key)
	}
	render () {
		const config = {
			data: this.getDateColumn(),
			xField: 'type',
			yField: 'sales',
			label: {
				position: 'middle',
				style: {
					fill: '#FFFFFF',
					opacity: 0.6
				}
			},
			meta: {
				type: { alias: '类别' },
				sales: { alias: '销售额' }
			}
		}
		const configPie = {
			appendPadding: 10,
			data: this.getDatePie(),
			angleField: 'value',
			colorField: 'type',
			radius: 0.9,
			label: {
				type: 'inner',
				offset: '-30%',
				content: function content(_ref) {
					var percent = _ref.percent;
					return ''.concat(percent * 100, '%');
				},
				style: {
					fontSize: 16,
					textAlign: 'center',
				},
			},
			interactions: [{ type: 'element-active' }],
		};
		return (
			<div className='home'>
				<Row>
					<Col span={8}>
						<div className="site-calendar-demo-card">
							<Calendar fullscreen={false} />
						</div>
					</Col>
					<Col span={16}>
						<Bar data={this.getDateBar()} xField='pv' yField='action' />
					</Col>
				</Row>
				<Tabs defaultActiveKey="1" onChange={this.handleChange}>
					<TabPane tab="Tab 1" key="1">
						<div style={{height: 300}}>
							<Column {...config} />
						</div>
						123
					</TabPane>
					<TabPane tab="Tab 2" key="2">
						<div style={{height: 300}}>
							<Pie {...configPie} />
						</div>
					</TabPane>
				</Tabs>
			</div>
		)
	}
}