import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import reduers from './reduers.js'

const store = createStore(reduers, applyMiddleware(thunk))

export default store