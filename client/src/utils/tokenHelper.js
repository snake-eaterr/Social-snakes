const setHeaders = (token) => {
	const config = {
		headers: { Authorization : `Bearer ${token}` }
	}
	return config
}


export default setHeaders