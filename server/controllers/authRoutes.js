import express from 'express'
import authCtrl from './authoCtrl'

const authRouter = express.Router()

authRouter.route('/signin')
	.post(authCtrl.signin)

authRouter.route('/signout')
	.get(authCtrl.signout)



export default authRouter