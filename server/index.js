import http from 'http'
import app from './express'



const server = http.createServer(app)
const PORT = process.env.PORT || 4000
server.listen(PORT, () => {
	console.log(`server running on port ${PORT}`)
})