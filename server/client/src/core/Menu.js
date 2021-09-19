import React from 'react'
import { withRouter, Link } from 'react-router-dom'
import { AppBar, Button, IconButton, Toolbar, Typography} from '@material-ui/core' 
import { Home } from '@material-ui/icons'
import auth from '../auth/auth-helper'



const isActive = (history, path) => {
	if (history.location.pathname === path) {
		return { color: '#5cdb95' }
	} else {
		return { color: '#ffffff' }
	}
}

const Menu = withRouter(({ history }) => (
	<AppBar position="static">
		<Toolbar>
			<Typography variant="h6" color="inherit">
				Social Snakes
			</Typography>
			<Link to="/">
				<IconButton aria-label="Home" style={isActive(history, '/')}>
					<Home />
				</IconButton>
			</Link>
			
			{
				!auth.isAuthenticated()
				&&
				<span>
					<Link to="/signup">
						<Button style={isActive(history, "/signup")}>
							Sign Up
						</Button>
					</Link>
					<Link to="/signin">
						<Button style={isActive(history, '/signin')}>
							Sign in
						</Button>
					</Link>
				</span>
			}
			{
				auth.isAuthenticated()
				&&
				<span>
					<Link to={`/user/${auth.isAuthenticated().user.id}`}>
						<Button style={isActive(history, `/user/${auth.isAuthenticated().user.id}`)}>
							My Profile
						</Button>
					</Link>
					<Button color="inherit" onClick={() => auth.clearJwt(() => history.push('/'))}>
						Sign Out
					</Button>
				</span>
			}
		</Toolbar>
	</AppBar>
))
export default Menu