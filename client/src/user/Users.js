import React, { useEffect, useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Link } from 'react-router-dom'
import { Avatar, IconButton, ListItemAvatar, ListItemSecondaryAction, ListItemText, Paper, List, ListItem, Typography } from '@material-ui/core'
import { Person, ArrowForward } from '@material-ui/icons'
import axios from 'axios'
import { list } from './api-user'



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
		paddingLeft: `${theme.spacing(3)}px`
	},
	link: {
		textDecoration: 'none',
		color: theme.palette.primary.dark
	},
	arrow: {
		paddingRight: `${theme.spacing(3)}px`
	}
}))

const Users = () => {
	const classes = useStyles()
	const [users, setUsers] = useState([])

	useEffect(() => {
		const cancelToken = axios.CancelToken
		const source = cancelToken.source()
		const getUsers = async () => {
			const data = await list(source)
			setUsers(data)
		}
		getUsers()
		return () => source.cancel()
		
	}, [])

	return (
		<Paper className={classes.root} elevation={4}>
			<Typography variant="h6" className={classes.title}>
				All Users
			</Typography>
			< List dense>
				{users.map((item, i) => {
					return <Link className={classes.link} to={`/user/${item.id}`} key={i}>
						<ListItem button>
							<ListItemAvatar className={classes.listItem}>
								<Avatar>
									<Person />
								</Avatar>
							</ListItemAvatar>
							<ListItemText primary={item.name} />
							<ListItemSecondaryAction className={classes.arrow}>
								<IconButton>
									<ArrowForward />
								</IconButton>
							</ListItemSecondaryAction>
						</ListItem>
					</Link>
				})}
			</List>
		</Paper>
	)
}

export default Users