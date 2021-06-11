import React from 'react'
import { Button, makeStyles } from '@material-ui/core'
import propTypes from 'prop-types'
import { follow, unfollow } from './api-user'

const useStyles = makeStyles(theme => ({
	button: {
		[theme.breakpoints.down('sm')]: {
			padding: `${theme.spacing(1)}px`
		}
	}
}))

const FollowProfileButton = (props) => {
	const classes = useStyles()

	const followClick = () => {
		props.onButtonClick(follow)
	}

	const unfollowClick = () => {
		props.onButtonClick(unfollow)
	} 

	return (
		<div>
			{
				props.following
					? <Button className={classes.button} variant="contained" color="secondary" onClick={unfollowClick}>Unfollow</Button>
					: <Button className={classes.button} variant="contained" color="primary" onClick={followClick}>Follow</Button>
			}
		</div>
	)
}

FollowProfileButton.propTypes = {
	following: propTypes.bool.isRequired,
	onButtonClick: propTypes.func.isRequired
}

export default FollowProfileButton