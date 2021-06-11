import User from '../models/user'
import { extend } from 'lodash'
import 'express-async-errors'
import formidable from 'formidable'
import fs from 'fs'





const create = async (req, res) => {
	const body = req.body
	const user = new User({
		...body,
		passwordHash: body.password
	})
	await user.save()
	return res.status(200).json({ message: 'Successfully signed up!' })
}

const list = async (req, res) => {
	const users = await User.find({})
	res.json(users)
}

const userByID = async (req, res, next, id) => {

	const user = await User.findById(id)
		.populate('followers', '_id, name')
		.populate('following', '_id name')
		.exec()
	if (!user) return res.status(400).json({ error: 'User not found' })

	req.profile = user
	next()

}

const read = async (req, res) => {
	return res.json(req.profile)
}

const update = async (req, res) => {
	let form = new formidable.IncomingForm()
	form.keepExtensions = true
	form.parse(req, async (err, fields, files) => {
		if (err) {
			return res.status(400).json({ error: 'Photo could not be uploaded' })
		}
		let user = req.profile
		user = extend(user, fields)
		user.updated = Date.now()
		if(files.photo) {
			user.photo.data = fs.readFileSync(files.photo.path)
			user.photo.contentType = files.photo.type
		}
		await user.save()
		res.json(user)
	})
	
}

const remove = async (req, res) => {
	const user = req.profile
	const deletedUser = await user.remove()
	res.json(deletedUser)
}

const photo = async (req, res, next) => {
	if(req.profile.photo.data) {
		res.set('Content-Type', req.profile.photo.contentType)
		return res.send(req.profile.photo.data)
	}
	next()
}

const defaultPhoto = async (req, res) => {
	return res.sendFile(`${process.cwd()}/controllers/profile-pic.png`)
}

const addFollowing = async (req, res, next) => {
	await User.findByIdAndUpdate(req.auth.id,
		{
			$addToSet: { following: req.body.followId }
		})
	next()
}

const addFollower = async (req, res) => {
	let result = await User.findByIdAndUpdate(req.body.followId, {
		$addToSet: { followers: req.auth.id}
	},
	{
		new: true
	})
	.populate('following', '_id name')
	.populate('followers', '_id name')
	.exec()

	res.json(result)
}

const removeFollowing = async (req, res, next) => {
	await User.findByIdAndUpdate(req.auth.id, 
		{
			$pull: { following: req.body.unfollowId }
		})

	next()
}

const removeFollower = async (req, res) => {
	let result = await User.findByIdAndUpdate(req.body.unfollowId,
		{
			$pull: { followers: req.auth.id }
		},
		{
			new: true
		})
		.populate('following', '_id name')
		.populate('followers', '_id name')
		.exec()

		res.json(result)
}


const findPeople = async (req, res) => {
	const following = req.profile.following
	following.push(req.profile._id)
	const users = await User.find({ _id: { $nin: following}}).select('name')
	res.json(users)
}

export default { create, list, userByID, read, update, remove, photo, defaultPhoto, findPeople, addFollowing, addFollower, removeFollowing, removeFollower }