import { combineReducers } from 'redux'
import {
	GET_USER,
	LOGOUT
} from './actionType.js'
const user = {}

function users (state=user, action) {
	switch(action.type) {
		case GET_USER:
			return action.data
		case LOGOUT: 
		console.log(action.data)
			return action.data
		default:
			return state
	}
}
export default combineReducers({
	users
})