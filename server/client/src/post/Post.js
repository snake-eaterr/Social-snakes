import React, { useState } from 'react'
import { Card, makeStyles, CardHeader, IconButton, Avatar, CardContent, Typography, CardActions, Divider } from '@material-ui/core'
import { Delete, Comment, Favorite, FavoriteBorder } from '@material-ui/icons'
import auth from '../auth/auth-helper'
import { Link } from 'react-router-dom'
import { remove, like, unlike } from './api-post'
import propTypes from 'prop-types'
import Comments from './Comments'


const useStyles = makeStyles(theme => ({
	card: {
		maxWidth: 600,
		margin: 'auto',
		backgroundColor: 'rgba(65, 150, 136, 0.1)',
		marginBottom: theme.spacing(3)
	},
	cardHeader: {
		paddingTop: theme.spacing(1),
		paddingBottom: theme.spacing(1)
	},
	cardContent: {
		backgroundColor: theme.palette.primary,
		padding: `${theme.spacing(2)}px 0px`
	},
	text: {
		margin: theme.spacing(2)
	},
	photo: {
		textAlign: 'center',
		backgroundColor: '#f2f5f4',
		padding: theme.spacing(1)
	},
	media: {
		width: '100%',
		height: 'auto'
	},
	button: {
		margin: theme.spacing(1)
	},
	link: {
		color: 'white'
	}
}))



const Post = (props) => {
	const classes = useStyles()
	const jwt = auth.isAuthenticated()
	const checkLike = (likes) => {
		const match = likes.indexOf(jwt.user.id) !== -1
		return match
	}

	const [values, setValues] = useState({
		like: checkLike(props.post.likes),
		likesCount: props.post.likes.length,
		comments: props.post.comments 
	})
	

	const updateComments = comments => {
		console.log('here')
		setValues({ ...values, comments: comments})
	}

	const deletePost = async () => {
		try {
			await remove({ postId: props.post.id }, jwt.token)
			props.onRemove(props.post)
		} catch (err) {
			console.log(err.response.data.error)
		}
	}

	

	const clickLike = async () => {
		const callApi = values.like ? unlike : like
		try {
			const data = await callApi({ userId: jwt.user.id}, jwt.token, props.post.id)
			setValues({ ...values, like: !values.like, likesCount: data.likes.length })
		} catch (err) {
			console.log(err.response.data.error)
		}
	}
	return (
		<Card className={classes.card}>
			<CardHeader
				avatar={<Avatar src={`/api/users/photo/${props.post.postedBy.id}`} />}
				action={ props.post.postedBy.id === auth.isAuthenticated().user.id
				&& <IconButton onClick={deletePost}>
					<Delete />
				</IconButton>}
				title={
					<Link to={`/user/${props.post.postedBy.id}`} className={classes.link}>
						{props.post.postedBy.name}
					</Link>
				}
				subheader={( new Date(props.post.created)).toDateString()}
				className={classes.cardHeader}
			/>
			<CardContent className={classes.cardContent}>
				<Typography component="p" className={classes.text}>
					{props.post.text}
				</Typography>
				{
					props.post.photo &&
					<div className={classes.photo}>
						<img  src={`/api/posts/photo/${props.post.id}`} alt="post" className={classes.media} />
					</div>
				}
			</CardContent>
			<CardActions>
				{
					values.like
						? <IconButton onClick={clickLike} className={classes.button}  aria-label="Like" color="secondary">
							<Favorite />
						</IconButton>
						: <IconButton onClick={clickLike} className={classes.button}  aria-label="Unlike" color="secondary">
							<FavoriteBorder />
						</IconButton>
				}
				<span>{values.likesCount}</span>
				<IconButton  className={classes.button} aria-label="Comment" color="secondary">
					<Comment />
				</IconButton>
				<span>{values.comments.length}</span>
			</CardActions>
			<Divider />
			<Comments postId={props.post.id} comments={values.comments} updateComments={updateComments} />
		</Card>
	)
}

Post.propTypes = {
	post: propTypes.object.isRequired,
	onRemove: propTypes.func.isRequired
}

export default Post