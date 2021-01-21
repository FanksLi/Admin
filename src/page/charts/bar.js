import React, { Component } from 'react'
import ReactEcharts from "echarts-for-react"
import { Card } from 'antd'

export default class Bar extends Component {
	getOption = () => {
		const option = {
			title: {
				text: 'ECharts 入门示例'
			},
			tooltip: {},
			legend: {
				data:['销量']
			},
			xAxis: {
				data: ["衬衫","羊毛衫","雪纺衫","裤子","高跟鞋","袜子"]
			},
			yAxis: {},
			series: [{
				name: '销量',
				type: 'bar',
				data: [5, 20, 36, 10, 10, 20]
			},
			{
				name: '销量',
				type: 'bar',
				color: '#ccc',
				data: [6, 25, 30, 20, 30, 15]
			}
			]
		}
		return option
	}
	render () {
		return (
			<Card>
				<ReactEcharts option={this.getOption()} style={{width: 800, margin: '100px auto'}} />
			</Card>
		)
	}
}