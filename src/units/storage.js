import store from 'store'

const USER_KEY = 'user_key'

export const saveUser = (user) => {
	// return localStorage.setItem(USER_KEY, JSON.stringify(user))
	return store.set(USER_KEY, user)
}
export const getUser = () => {
	// return JSON.parse(localStorage.getItem(USER_KEY) || "{}")
	return store.get(USER_KEY) || {}
}
export const removeUser = () => {
	// localStorage.removeItem(USER_KEY)
	store.remove(USER_KEY)
}