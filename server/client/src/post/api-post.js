import axios from 'axios'
import setHeaders from '../utils/tokenHelper'

const baseUrl = '/api/posts'

export const listNewsfeed = async (params, credentials, source) => {
	const config = setHeaders(credentials)

	const response = await axios.get(`${baseUrl}/feed/${params.userId}`, { ...config, cancelToken: source.token})
	return response.data
}

export const listByUser = async (params, credentials) => {
	const config = setHeaders(credentials)

	const response = await axios.get(`${baseUrl}/by/${params.userId}`, config)
	return response.data
}

export const create = async (params, credentials, post) => {
	const config = setHeaders(credentials)

	const response = await axios.post(`${baseUrl}/new/${params.userId}`, post, config)
	return response.data
}

export const remove = async (params, credentials) => {
	const config = setHeaders(credentials)

	const response = await axios.delete(`${baseUrl}/${params.postId}`, config)
	return response.data
}

export const like = async (params, credentials, postId) => {
	const config = setHeaders(credentials)

	const response = await axios.put(`${baseUrl}/like`, {userId: params.userId, postId}, config)
	return response.data
}

export const unlike = async (params, credentials, postId) => {
	const config = setHeaders(credentials)

	const response = await axios.put(`${baseUrl}/unlike`, {userId: params.userId, postId}, config)
	return response.data
}

export const comment = async (params, credentials, postId, text) => {
	const config = setHeaders(credentials)
	console.log('DEBUGG',comment)

	const response = await axios.put(`${baseUrl}/comment`, { userId: params.userId, postId, comment: text}, config)
	return response.data
}

export const uncomment = async (params, credentials, postId, comment) => {
	const config = setHeaders(credentials)

	const response = await axios.put(`${baseUrl}/uncomment`, { userId: params.userId, postId, comment }, config)
	return response.data
}

