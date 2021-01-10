import React from 'react'
import './index.less'

export default function ButtonHref (props) {
	return (
		<button className='button_a' {...props}>{props.children}</button>
	)
}