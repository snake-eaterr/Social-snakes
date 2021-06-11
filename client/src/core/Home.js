import React, { useState, useEffect } from 'react'
import { makeStyles, Card, Icon, CardContent, CardMedia, Typography, Grid} from '@material-ui/core'
import snakes from '../assets/images/snake-doodle.jpeg'
import auth from '../auth/auth-helper'
import { withRouter } from 'react-router-dom'
import Newsfeed from '../post/Newsfeed'
import FindPeople from '../user/FindPeople'
import { GitHub } from '@material-ui/icons'
import { Helmet } from 'react-helmet'


const useStyles = makeStyles(theme => ({
	root: {
		flexGrow: 1,
		[theme.breakpoints.down('sm')]: {
			margin: theme.spacing(0.5),
			padding: 0
		},
		margin: 30,
		padding: theme.spacing(2)
	},
	card: {
		maxWidth: 600,
		margin: 'auto',
		marginTop: theme.spacing(5),
	},
	title: {
		padding: `${theme.spacing(1)}px ${theme.spacing(3)}px`,
		color: theme.palette.openTitle
	},
	media: {
		minHeight: 400
	},
	github: {
		color: '#009688',
		verticalAlign: 'middle'
	},
	link: {
		color: 'inherit',
		'&:hover': {
			color: '#5cdb95'
		}
	},

}))

const Home = withRouter(({ history }) => {
	const classes = useStyles()
	const [defaultPage, setDefaultPage] = useState(false)

	useEffect(() => {
		setDefaultPage(auth.isAuthenticated())
		const unlisten = history.listen(() => {
			setDefaultPage(auth.isAuthenticated())
		})
		return () => {
			unlisten()
		}
		
	}, [])

	return (
		<div className={classes.root}>
			{
				!defaultPage 
					&&
				<Grid container spacing={8}>
					<Helmet>
						<title>
							Social Snakes | Home
						</title>
					</Helmet>
					<Grid item xs={12}>
						<Card className={classes.card}>
							<Typography variant="h6" className={classes.title}>
								Home Page
							</Typography>
							<CardMedia className={classes.media} image={snakes} title="snake" />
							<CardContent>
								<Typography variant="body2" component="p">
								<a href="https://github.com/snake-eaterr" target="_blank" rel="noreferrer" className={classes.link}>									
									<Icon className={classes.github}>
										<GitHub />
									</Icon>
									<span> Developed by snake-eaterr</span>
								</a>
								</Typography>
							</CardContent>
						</Card>
					</Grid>
				</Grid>
			}
			{
				defaultPage 
					&&
					<Grid container spacing={8}>
						<Helmet>
							<title>
								{`Social Snakes | ${auth.isAuthenticated().user.name}`}
							</title>
						</Helmet>
						<Grid item xs={12} sm={12} md={7}>
							<Newsfeed />
						</Grid>
						<Grid item xs={12} sm={12} md={5}>
							<FindPeople />
						</Grid>
					</Grid>
			}
		</div>
	)

})

export default Home