import React, { useEffect, useState } from 'react'
import axios from 'axios'
import auth from '../auth/auth-helper'
import { makeStyles, List, ListItem, ListItemAvatar, Avatar, ListItemSecondaryAction, ListItemText, IconButton, Button, Snackbar, Paper, Typography } from '@material-ui/core'
import { RemoveRedEye } from '@material-ui/icons'
import { Link } from 'react-router-dom'
import { follow, findPeople } from './api-user'

const useStyles = makeStyles(theme => ({
	root: {
		padding: theme.spacing(1),
		margin: 0
	},

	title: {
		margin: `${theme.spacing(3)}px ${theme.spacing(1)}px ${theme.spacing(2)}px`,
		color: theme.palette.openTitle,
		fontSize: '1em'
	},
	avatar: {
		marginRight: theme.spacing(1)
	},
	snack: {
		color: 'black'
	}

}))

const FindPeople = () => {
	const classes = useStyles()
	const [values, setValues] = useState({
		users: [],
		open: false,
		followMessage: ''
	})

	const jwt = auth.isAuthenticated()

	useEffect(() => {
		const cancelToken = axios.CancelToken
		const source = cancelToken.source()
		const getPeople = async () => {
			try {
				const data = await findPeople({ userId: jwt.user.id}, jwt.token, source)
				setValues(v => ({ ...v, users: data}))
			} catch (err) {
				console.log(err, 'here')
			}
		}
		getPeople()
		return () => source.cancel()
	}, [jwt.token, jwt.user.id])

	const clickFollow = async (user, index) => {
		try {
			const data = await follow({ userId: jwt.user.id }, jwt.token, user.id)
			let toFollow = values.users
			toFollow.splice(index, 1)
			setValues({ ...values, users: toFollow, open: true, followMessage: `Following ${user.name}!`})
		} catch (err) {
			console.log(err.response.data.error)
		}
	}

	const handleRequestClose = (event, reason) => {
		setValues({ ...values, open: false})
	}

	return (
		<div>
			<Paper className={classes.root} elevation={4}>
				<Typography type="title" className={classes.title}>
					Who to Follow
				</Typography>
				<List>
					{
						values.users.map((item, i) => {
							return (
								<span key={item.id}>
									<ListItem>
										<ListItemAvatar>
											<Avatar className={classes.avatar} src={`/api/users/photo/${item.id}`} />
										</ListItemAvatar>
										<ListItemText primary={item.name} />
										<ListItemSecondaryAction>
											<Link to={`/user/${item.id}`}>
												<IconButton variant="contained" color="secondary">
													<RemoveRedEye />
												</IconButton>
											</Link>
											<Button aria-label="Follow" variant="contained" color="primary"
											onClick={() => clickFollow(item, i)}>
												Follow
											</Button>
										</ListItemSecondaryAction>
									</ListItem>
								</span>
							)
						})
					}
				</List>
			</Paper>
			<Snackbar anchorOrigin={{ vertical: 'bottom', horizontal: 'right'}}
				open={values.open}
				onClose={handleRequestClose}
				authoHideDuration={6000}
				message={
					<span className={classes.snack}>{values.followMessage}</span>
				}
			/>
		</div>
	)
}

export default FindPeople