import express from 'express'
import userCtrl from './userCtrl'
import authCtrl from './authoCtrl'
const userRouter = express.Router()

userRouter.route('/users')
	.get(userCtrl.list)
	.post(userCtrl.create)

userRouter.route('/users/defaultphoto')
	.get(userCtrl.defaultPhoto)

userRouter.route('/users/follow')
	.put(authCtrl.requireSigin,
		userCtrl.addFollowing,
		userCtrl.addFollower)

userRouter.route('/users/unfollow')
		.put(authCtrl.requireSigin,
			userCtrl.removeFollowing,
			userCtrl.removeFollower)

userRouter.route('/users/:userId')
	.get(authCtrl.requireSigin, userCtrl.read)
	.put(authCtrl.requireSigin, authCtrl.hasAuthorization ,userCtrl.update)
	.delete(authCtrl.requireSigin, authCtrl.hasAuthorization ,userCtrl.remove)

userRouter.route('/users/photo/:userId')
	.get(userCtrl.photo, userCtrl.defaultPhoto)


userRouter.route('/users/findpeople/:userId')
	.get(authCtrl.requireSigin, userCtrl.findPeople)

userRouter.param('userId', userCtrl.userByID)


export default userRouter