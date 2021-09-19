import React, { useEffect, useState } from 'react'
import axios from 'axios'
import auth from '../auth/auth-helper'
import { read } from './api-user'
import { Redirect, Link, useParams } from 'react-router-dom'
import { Paper, makeStyles, List, Typography, Divider, ListItem, ListItemAvatar, Avatar, ListItemText, ListItemSecondaryAction, IconButton } from '@material-ui/core'
import {  Edit } from '@material-ui/icons'
import DeleteUser from './DeleteUser'
import FollowProfileButton from './FollowProfileButton'
import ProfileTabs from './ProfileTabs'
import { listByUser } from '../post/api-post'
import { Helmet } from 'react-helmet'
import ContentLoader from 'react-content-loader'


const MyLoader = (props) => (
  <ContentLoader 
    speed={1}
    width={600}
    height={100}
    viewBox="0 0 600 100"
    backgroundColor="#817e7e"
    foregroundColor="#ecebeb"
    {...props}
  >
    <rect x="520" y="166" rx="3" ry="3" width="88" height="6" /> 
    <rect x="547" y="169" rx="3" ry="3" width="52" height="6" /> 
    <rect x="-106" y="41" rx="3" ry="3" width="380" height="9" /> 
    <rect x="-30" y="60" rx="3" ry="3" width="178" height="9" /> 
    <circle cx="577" cy="171" r="20" />
  </ContentLoader>
)

const useStyles = makeStyles(theme => ({
	root: {
		maxWidth: 600,
		margin: 'auto',
		marginTop: theme.spacing(5),

	},
	title: {
		padding: `${theme.spacing(3)}px ${theme.spacing(2.5)}px ${theme.spacing(2)}px ${theme.spacing(2)}px`,
		color: theme.palette.openTitle
	},
	listItem: {

		[theme.breakpoints.up('md')]: {
			paddingLift: `${theme.spacing(3)}px`
		},
		[theme.breakpoints.down('sm')]: {
			paddingLift: 0
		},

	},
	primary: {
		textAlign: 'justify',

	},
	secondary: {
		textAlign: 'justify',

	},
	link: {
		textDecoration: 'none',
		color: theme.palette.primary.dark
	},
	arrow: {
		paddingRight: `${theme.spacing(3)}px`
	},
	avatar: {
		width: 60,
		height: 60,
		margin: 10
	}
}))

const Profile = () => {

	const classes = useStyles()
	const [posts, setPosts] = useState([])
	const [values, setValues] = useState({
		user: { following: [], followers: []},
		following: false,
		error: ''
	})
	const [redirectToSignin, setRedirectToSignin] = useState(false)
	

	const userId = useParams().userId
	const jwt = auth.isAuthenticated()

	const photoUrl = values.user.id
		? `/api/users/photo/${values.user.id}?${new Date().getTime()}`
		: '/api/users/defaultphoto'

	const checkFollow = (profileUser) => {
		const match = profileUser.followers.some((follower) => {
			return follower.id === auth.isAuthenticated().user.id
		})

		return match
	}

	useEffect(() => {
		const cancelToken = axios.CancelToken
		const source = cancelToken.source()
		let data
		const getInfo = async () => {
		
			try {
				data = await read({ userId: userId }, jwt.token, source)
				const following = checkFollow(data)
				setValues(v => ({ ...v, user: data, following: following}))
				loadPosts(data)
			} catch (err) {
				setRedirectToSignin(true)
			}
		}
		getInfo()
		return () => source.cancel()

	}, [userId, jwt.token])

	const clickFollowButton = async (callApi) => {
		try {
			const data = await callApi({ userId: jwt.user.id}, jwt.token, values.user.id)
			setValues({ ...values, user: data, following: !values.following})
		} catch (err) {
			setValues({ ...values, error: err.response.data.error })
		}
	}

	const removePost = (post) => {
		const updatedPosts = [...posts]
		const index = updatedPosts.indexOf(post)
		updatedPosts.splice(index, 1)
		setPosts(updatedPosts)
	}

	const loadPosts = async (user) => {
		try {
			const data = await listByUser({ userId: user.id }, jwt.token)
			setPosts(data)
		} catch (err) {
			console.log(err.response.data.error)
		}
	}

	if (redirectToSignin) {
		return <Redirect to="/signin" />
	}

	return (
		<Paper className={classes.root} elevation={4}>
			<Helmet>
				<title>
					{`My profile | ${values.user.name}`}
				</title>
			</Helmet>
			<Typography variant="h6" className={classes.title}>
				Profile
			</Typography>
			<List dense>
				<ListItem>
					<ListItemAvatar>
						<Avatar src={photoUrl} className={classes.avatar}/>
					</ListItemAvatar>
					<ListItemText  classes={{primary: classes.primary, secondary: classes.secondary}} primary={values.user.name} secondary={values.user.email} />
					{
						auth.isAuthenticated().user && auth.isAuthenticated().user.id === values.user.id
							? 
							<ListItemSecondaryAction>
								<Link to={`/user/edit/${values.user.id}`}>
									<IconButton aria-label="Edit" color="primary">
										<Edit />
									</IconButton>
								</Link>
								<DeleteUser userId ={values.user.id} />
							</ListItemSecondaryAction>
							:
							<FollowProfileButton following={values.following} onButtonClick={clickFollowButton} />
					}
				</ListItem>
				<Divider />
				<ListItem>
					{ values.user.created ? <ListItemText primary={values.user.about} secondary={`Joined: ${new Date(values.user.created).toDateString()}`}  /> : <MyLoader />}
				</ListItem>
			</List>
			<ProfileTabs user={values.user} posts={posts} removePostUpdate={removePost} />
		</Paper>
	)
}

export default Profile