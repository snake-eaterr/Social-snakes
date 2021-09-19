import React from 'react'
import { makeStyles, GridList, GridListTile, Typography, Avatar } from '@material-ui/core'
import { Link } from 'react-router-dom'
import propTypes from 'prop-types'

const useStyles = makeStyles(theme => ({
	root: {
		paddingTop: theme.spacing(2),
		display: 'flex',
		flexWrap: 'wrap',
		justifyContent: 'space-around',
		overflow: 'hidden',
		background: theme.palette.background.paper
	},
	avatar: {
		width: 60,
		height: 60,
		margin: 'auto'
	},
	gridList: {
		width: 500,
		height: 220
	},
	tileText: {
		textAlign: 'center',
		color: 'white',
		marginTop: 10
	}
}))


const FollowGrid = (props) => {
	const classes = useStyles()
	return (
		<div>
			<GridList cellHeight={160} cols={4} className={classes.root}>
				{
					props.people.map((person) => {
						return <GridListTile style={{'height': 120}} key={person.id} className={classes.gridList}>
							<Link to={`/user/${person.id}`}>
								<Avatar src={`/api/users/photo/${person.id}`} className={classes.avatar} />
								<Typography color="primary" className={classes.tileText}>
									{person.name}
								</Typography>
							</Link>
						</GridListTile>
					})
				}
			</GridList>
		</div>
	)
}

FollowGrid.propTypes = {
	people: propTypes.array.isRequired
}

export default FollowGrid