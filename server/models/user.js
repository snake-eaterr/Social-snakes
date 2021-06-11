import mongoose from 'mongoose'
import uniqueValidator from 'mongoose-unique-validator'
import bcrypt from 'bcrypt'

const saltRounds = 10



const userSchema = new mongoose.Schema({
	name: {
		type: String,
		trim: true,
		required: 'Name is required'
	},
	email: {
		type: String,
		trim: true,
		unique: 'Email already exists',
		match: [/.+\@.+\..+/, 'Please fill a valid email address'],
		required: 'Email is required'
	},
	created: {
		type: Date,
		default: Date.now,
	},
	updated: Date,
	passwordHash: {
		type: String,
		minlength: 5,
		required: true
	},
	about: {
		type: String,
		trim: true
	},
	photo: {
		data: Buffer,
		contentType: String
	},
	followers: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
		}
	],
	following: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
		}
	]
})

userSchema.plugin(uniqueValidator)

userSchema.pre('save', async function(next) {
	

	if (!this.isModified('passwordHash')) return next()

	const hash = await bcrypt.hash(this.passwordHash, saltRounds)
	this.passwordHash = hash
	next()
})

userSchema.set('toJSON', {
	transform: (document, returnedObject) => {
		returnedObject.id = returnedObject._id.toString()
		delete returnedObject._id
		delete returnedObject.__v
		delete returnedObject.passwordHash
	}
})

userSchema.methods.comparePasswords = async function(candidatePassword) {
	return bcrypt.compare(candidatePassword, this.passwordHash)
}

const User = mongoose.model('User', userSchema)
export default User