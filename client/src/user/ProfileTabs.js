import React, { useState } from 'react'
import propTypes from 'prop-types'
import { AppBar, Tabs, Tab, Typography } from '@material-ui/core'
import FollowGrid from './FollowGrid'
import PostList from '../post/PostList'

const ProfileTabs = (props) => {
	const [tab, setTab] = useState(0)

	const handleTabChange = (event, value) => {
		console.log(value)
		setTab(value)
	}

	return (
		<div>
			<AppBar position="static" color="default">
				<Tabs
					value={tab}
					onChange={handleTabChange}
					indicatorColor="primary"
					textColor="primary"
					variant="fullWidth"
				>
					<Tab label="Posts" />
					<Tab label="Following" />
					<Tab label="Followers" />
				</Tabs>
				{
					tab === 0 && <TabContainer><PostList removeUpdate={props.removePostUpdate} posts={props.posts} /></TabContainer>

				}
				{
					tab === 1 && <TabContainer><FollowGrid people={props.user.following} /></TabContainer>
				}
				{
					tab === 2 && <TabContainer><FollowGrid people={props.user.followers} /></TabContainer>
				}
			</AppBar>
		</div>
	)
}

ProfileTabs.propTypes = {
	user: propTypes.object.isRequired,
}

const TabContainer = (props) => {
	return (
		<Typography component="div" style={{padding: 8 * 2}}>
			{props.children}
		</Typography>
	)
}

export default ProfileTabs