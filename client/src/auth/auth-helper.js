const authenticate = (jwt, cb) => {
	if (typeof window !== 'undefined') {
		localStorage.setItem('jwt', JSON.stringify(jwt))
	}	
	cb()
}

const isAuthenticated = () => {
	if(typeof window == 'undefined') {
		return false
	}

	if (localStorage.getItem('jwt')) {
		return JSON.parse(localStorage.getItem('jwt'))
	} else {
		return false
	}
	
}

const clearJwt = (cb) => {
	if (typeof window !== 'undefined') {
		localStorage.removeItem('jwt')
	}
	cb()
}

export default { authenticate, isAuthenticated, clearJwt }