import React from 'react'
import { Route, Switch } from 'react-router-dom'
import PrivateRoute from './auth/PrivateRoute'
import Home from './core/Home'
import Users from './user/Users'
import Signup from './user/Signup'
import Signin from './auth/Signin'
import Profile from './user/Profile'
import EditProfile from './user/EditProfile'
import Menu from './core/Menu'
import { Typography, makeStyles } from '@material-ui/core'

const useStyles = makeStyles(theme => ({
	typography: {
		fontSize: `${theme.spacing(5)}px`,
		color: 'white',
		position: 'fixed',
		top: '50%',
		left: '50%',
		transform: 'translate(-50%, -50%)'
	}
}))
const NotFound = () => {
	const classes = useStyles()
	return (
		<div>
			<Typography className={classes.typography}>
				404 - Fellow snake, this page does not exist
			</Typography>
		</div>
	)
}

const MainRouter = () => {

	return (
		<div>
			<Menu />
			<Switch>
				<Route path="/" exact>
					<Home />
				</Route>
				<Route path ="/signin" component={Signin} />
				<Route path="/signup">
					<Signup />
				</Route>
				<Route path="/users">
					<Users />
				</Route>
				<PrivateRoute path="/user/edit/:userId" component={EditProfile} />
				<Route path="/user/:userId">
					<Profile />
				</Route>
				<Route>
					<NotFound />
				</Route>
			</Switch>
		</div>
	)
}

export default MainRouter