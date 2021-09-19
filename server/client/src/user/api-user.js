import axios from 'axios'
import setHeaders from '../utils/tokenHelper'

const baseUrl = '/api/users'

export const create = async (user) => {
	const response = await axios.post(baseUrl, user)
	return response.data
}

export const list = async (source) => {
	const response = await axios.get(baseUrl, { cancelToken: source.token })
	return response.data
}



export const read = async (params, credentials, source) => {
	const config = setHeaders(credentials)
	
	const response = await axios.get(`${baseUrl}/${params.userId}`, { ...config, cancelToken: source.token})
	return response.data
}

export const update = async (params, credentials, user) => {
	const config = setHeaders(credentials)

	const response = await axios.put(`${baseUrl}/${params.userId}`, user, config)
	return response.data
}

export const remove = async (params, credentials) => {
	const config = setHeaders(credentials)

	const response = await axios.delete(`${baseUrl}/${params.userId}`, config)
	return response.data
}

export const follow = async (params, credentials, followId) => {
	const config = setHeaders(credentials)

	const response = await axios.put(`${baseUrl}/follow`, { userId: params.userId, followId }, config)
	return response.data
}

export const unfollow = async (params, credentials, unfollowId) => {
	const config = setHeaders(credentials)

	const response = await axios.put(`${baseUrl}/unfollow`, { userId: params.userId, unfollowId }, config)
	return response.data
}

export const findPeople = async (params, credentials, source) => {
	const config = setHeaders(credentials)

	const response = await axios.get(`${baseUrl}/findpeople/${params.userId}`, { ...config, cancelToken: source.token}, config)
	return response.data
}
