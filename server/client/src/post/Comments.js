import React, { useState } from 'react'
import { Avatar, makeStyles, CardHeader, TextField, Icon, Button } from '@material-ui/core'
import auth from '../auth/auth-helper'
import { comment, uncomment } from './api-post'
import { Link } from 'react-router-dom'
import proptTypes from 'prop-types'


const useStyles = makeStyles(theme => ({
	cardHeader: {
		paddingTop: theme.spacing(1),
		paddingBottom: theme.spacing(1)
	},
	smallAvatar: {
		width: 25,
		height: 25
	},
	commentField: {
		width: '96%'
	},
	commentText: {
		backgroundColor: theme.palette.secondary,
		padding: theme.spacing(1),
		margin: `2px ${theme.spacing(2)}px 2px 2px`
	},
	commentDate: {
		display: 'block',
		color: 'rgba(255, 255, 255, 0.349)',
		fontSize: '0.8em'
	},
	commentDelete: {
		fontSize: '1.6em',
		verticalAlign: 'middle',
		cursor: 'pointer'
	},
	commentButton: {
		padding: `${theme.spacing(1)}`
	}
}))

const Comments = (props) => {
	const classes = useStyles()
	const [text, setText] = useState('')
	const jwt = auth.isAuthenticated()


	const handleChange = (event) => {
		setText(event.target.value)
	}

	const addComment = async (event) => {

		
		
		event.preventDefault()
		try {
			const data = await comment({userId: jwt.user.id}, jwt.token, props.postId, { text })
			setText('')
			props.updateComments(data.comments)
		} catch (err) {
			console.log(err.response.data.error)
		}


	}
	const deleteComment = comment => async event => {
		try {
		const data = await uncomment({ userId: jwt.user.id}, jwt.token, props.postId, comment)
		props.updateComments(data.comments)

		} catch (err) {
			console.log(err.response.data.error)
		}
	}

	const commentBody = item => {
		return (
			<p className={classes.commentText}>
				<Link to={`/user/${item.postedBy.id}`} style={{color: 'white'}}>
					{item.postedBy.name}
				</Link>
				<br />
				{item.text}
				<span className={classes.commentDate}>
					{ (new Date(item.created)).toDateString() } | { auth.isAuthenticated().user.id === item.postedBy.id
						&& <Icon onClick={deleteComment(item)} className={classes.commentDelete}>
							delete
						</Icon> }
				</span>
			</p>
		)
	}

	return (
		<div>
			<CardHeader
				avatar={ <Avatar className={classes.smallAvatar}  src={`/api/users/photo/${auth.isAuthenticated().user.id}`} />}
				title={
					<form onSubmit={addComment}>
						<TextField
							multiline
							value={text}
							onChange={handleChange}
							placeholder="Write something..."
							className={classes.commentField}
							margin="normal"
						/>
						{ text && <Button type="submit" className={classes.commentButton} color="primary" variant="contained">comment</Button> }
					</form>
				}
				className={classes.cardHeader}
			/>
			{
				props.comments.map((item) => {

					return (
						<CardHeader avatar={<Avatar className={classes.smallAvatar}  src={`/api/users/photo/${item.postedBy.id}`} />}
							title={commentBody(item)}
							className={classes.cardHeader}
							key={item.id}
						/>
					)
				})
			}
				
		</div>
	)
}

Comments.proptTypes = {
	postId: proptTypes.string.isRequired,
	comments: proptTypes.array.isRequired,
	updatedComments: proptTypes.func.isRequired
}

export default Comments

