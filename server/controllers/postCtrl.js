import Post from '../models/post'
import 'express-async-errors'
import formidable from 'formidable'
import fs from 'fs'


const listNewsfeed = async (req, res) => {
	let following = req.profile.following
	following.push(req.profile._id)
	const posts = await Post.find({ postedBy: { $in: following }})
		.populate('comments.postedBy', '_id name')
		.populate('postedBy', '_id name')
		.sort('-created')
		.exec()
	res.json(posts)
}

const listByUser = async (req, res) => {
	const posts = await Post.find({ postedBy: req.profile._id })
		.populate('comments.postedBy', '_id name')
		.populate('postedBy', '_id name')
		.sort('-created')
		.exec()
	res.json(posts)
}

const create = (req, res, next) => {
	let form = new formidable.IncomingForm()
	form.keepExtensions = true
	form.parse(req, async (err, fields, files) => {
		if (err) {
			return res.status(400).json({ error: 'Image could not be uploaded'})
		}
		let post = new Post(fields)
		post.postedBy = req.auth.id
		if (files.photo) {
			post.photo.data = fs.readFileSync(files.photo.path)
			post.photo.contentType = files.photo.type
		}
		await post.save()
		res.json(post)
	})
}

const photo = async (req, res, next) => {
	res.set('Content-Type', req.post.photo.contentType)
	return res.send(req.post.photo.data)
} 

const postByID = async (req, res, next, id) => {
	const post = await Post.findById(id)
		.populate('postedBy', '_id name')
		.exec()

	if (!post) return res.status(400).json({ error: 'Post not found '})
	req.post = post
	next()
}

const isPoster = async (req, res, next) => {
	const isposter = req.post && req.auth && req.post.postedBy._id == req.auth.id
	if (!isposter) {
		return res.status(403).json({ error: 'User is not authorized' })
	}
	next()
}

const remove = async (req, res) => {
	await Post.findByIdAndRemove(req.post._id)
	return res.status(204).end()
}

const like = async (req, res) => {
	const result = await Post.findByIdAndUpdate(req.body.postId, {
		$addToSet: { likes: req.auth.id },
	}, { new: true })

	res.json(result)
}

const unlike = async (req, res) => {
	const result = await Post.findByIdAndUpdate(req.body.postId, { $pull: { likes: req.auth.id }}, { new: true })
	res.json(result)
}

const comment = async (req, res) => {

	const comment = req.body.comment
	comment.postedBy = req.auth.id
	const result = await Post.findByIdAndUpdate(req.body.postId, { $addToSet: { comments: comment} }, { new: true })
		.populate('comments.postedBy', '_id name')
		.populate('postedBy', '_id name')
		.exec()
	res.json(result)
}

const isCommentor = async (req, res, next) => {
	console.log(req.auth.id, req.body.comment.postedBy.id)
	const iscommentor = req.body.comment && req.auth.id && req.body.comment.postedBy.id === req.auth.id
	if (!iscommentor) return res.status(403).json({ error: 'User is not authorized' })
	next()
}

const uncomment = async (req, res) => {
	const comment = req.body.comment
	const result = await Post.findByIdAndUpdate(req.body.postId, {$pull: { comments: { _id: comment._id} }}, {new: true})
		.populate('comments.postedBy', '_id name')
		.populate('postedBy', '_id name')
		.exec()

	res.json(result)
}
export default { listNewsfeed, listByUser, create, photo, postByID, isPoster, remove, like, unlike, isCommentor, comment, uncomment }