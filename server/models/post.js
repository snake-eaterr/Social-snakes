import mongoose from 'mongoose'


const postShema = new mongoose.Schema({
	text: {
		type: String,
		required: 'Text is required'
	},
	photo: {
		data: Buffer,
		contentType: String
	},
	postedBy : {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	},
	created: {
		type: Date,
		default: Date.now
	},
	likes: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User'
		}
	],
	comments: [
		{
			text: String,
			created: { type: Date, default: Date.now },
			postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
		}
	]
})

postShema.set('toJSON', {
	transform: (document, returnedObject) => {
		returnedObject.id = returnedObject._id.toString()
		delete returnedObject._id
		delete returnedObject.__v

	}
})

const Post = mongoose.model('Post', postShema)

export default Post