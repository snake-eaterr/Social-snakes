import express from 'express'
import authCtrl  from './authoCtrl'
import userCtrl from './userCtrl'
import postCtrl from './postCtrl'


const postRouter = express.Router()

postRouter.route('/posts/like')
	.put(authCtrl.requireSigin, postCtrl.like)

postRouter.route('/posts/unlike')
	.put(authCtrl.requireSigin, postCtrl.unlike)

postRouter.route('/posts/comment')
	.put(authCtrl.requireSigin, postCtrl.comment)

postRouter.route('/posts/uncomment')
	.put(authCtrl.requireSigin, postCtrl.isCommentor, postCtrl.uncomment)


postRouter.route('/posts/feed/:userId')
	.get(authCtrl.requireSigin, postCtrl.listNewsfeed)

postRouter.route('/posts/by/:userId')
	.get(authCtrl.requireSigin, postCtrl.listByUser)

postRouter.route('/posts/new/:userId')
	.post(authCtrl.requireSigin, postCtrl.create)

postRouter.route('/posts/photo/:postId')
	.get(postCtrl.photo)

postRouter.route('/posts/:postId')
	.delete(authCtrl.requireSigin, postCtrl.isPoster, postCtrl.remove)

postRouter.param('userId', userCtrl.userByID)
postRouter.param('postId', postCtrl.postByID)

export default postRouter