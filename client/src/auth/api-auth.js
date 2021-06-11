import axios from 'axios'

const baseUrl = '/auth'

export const signin = async (user) => {
	const response = await axios.post(`${baseUrl}/signin`, user)
	return response.data
}

export const signout = async () => {
	const response = await axios.get(`${baseUrl}/signout`)
	return response.data
}