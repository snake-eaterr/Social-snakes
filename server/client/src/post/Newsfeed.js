import React, { useEffect, useState } from 'react'
import { Card, Typography, Divider, makeStyles } from '@material-ui/core'
import axios from 'axios'
import auth from '../auth/auth-helper'
import { listNewsfeed } from './api-post'
import NewPost from './NewPost'
import PostList from './PostList'

const useStyles = makeStyles(theme => ({
	card: {
		margin: 'auto',
		paddingTop: 0,
		paddingBottom: theme.spacing(3)
	},
	title: {
		padding: `${theme.spacing(3)}px ${theme.spacing(2.5)}px ${theme.spacing(2)}px`,
		color: theme.palette.openTitle,
		fontSize: '1em'
	}
	
}))


const Newsfeed = () => {
	const classes = useStyles()
	const [posts, setPosts] = useState([])

	const jwt = auth.isAuthenticated()

	const addPost = (post) => {
		const updatedPosts = [...posts]
		updatedPosts.unshift(post)
		setPosts(updatedPosts)
	}

	const removePost = (post) => {
		const updatedPosts = [...posts]
		const index = updatedPosts.indexOf(post)
		updatedPosts.splice(index, 1)
		setPosts(updatedPosts)
	}

	useEffect(() => {
		const cancelToken = axios.CancelToken
		const source = cancelToken.source()

		const getPosts = async () => {
			try {
				const data = await listNewsfeed({ userId: jwt.user.id}, jwt.token, source)
				setPosts(data)
			} catch (err) {
				console.log(err)
			}
		}

		getPosts()
		return () => source.cancel()
	}, [jwt.token, jwt.user.id])

	return (
		<Card className={classes.card}>
			<Typography type="title" className={classes.title}>
				Newsfeed
			</Typography>
			<Divider />
			<NewPost addUpdate={addPost} />
			<Divider />
			<PostList removeUpdate={removePost} posts={posts} />
		</Card>
	)
}

export default Newsfeed