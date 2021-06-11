import User from '../models/user'
import jwt from 'jsonwebtoken'
import expressJwt from 'express-jwt'
import config from '../utils/config'
import 'express-async-errors'

const signin = async (req, res) => {
	const body = req.body
	const user = await User.findOne({ email: body.email })
	if (!user) {
		return res.status(401).json({ error: 'wrong credentials' })
	}

	const isMatch = await user.comparePasswords(body.password)
	
	if (!isMatch) {
		return res.status(401).json({ error: 'wrong credentials' })
	}

	const token = jwt.sign({ id: user._id }, config.JWT_SECRET)

	res.cookie('t', token, { expire: new Date() + 9999})
	return res.json({
		token,
		user: {
			id: user._id,
			name: user.name,
			email: user.email
		}
	})
}

const signout = (req, res) => {
	res.clearCookie('t')
	return res.status(200).json({ message: 'signed out' })
}

const requireSigin = expressJwt({
	secret: config.JWT_SECRET,
	algorithms: ['HS256'],
	userProperty: 'auth'
})

const hasAuthorization = (req, res, next) => {
	const authorized = req.profile && req.auth && req.profile._id == req.auth.id
	if (!authorized) {
		return res.status(403).json({ error: 'User is not authorized' })
	}
	next()
}

export default { signin, signout, requireSigin, hasAuthorization }
