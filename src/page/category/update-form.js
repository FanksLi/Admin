import React, {Component} from 'react'
import PropTypes from 'prop-types'

import { Form, Input } from 'antd'

const Item = Form.Item
export default class UpdataForm extends Component {
	static propTypes = {
		formRef: PropTypes.object.isRequired,
		data: PropTypes.object.isRequired
	}
	onFinish = (value) => {
		console.log(value)
	}
	render () {
		const {name} = this.props.data
		console.log(this.props.data)
		return (
			<Form ref={this.props.formRef} onFinish={this.onFinish}>
				<Item
					label='分类名称'
					name='categoryName'
					initialValue={name}
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
		)
	}
}