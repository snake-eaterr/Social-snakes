import React, { useEffect, useState } from 'react'
import { Card, Icon, Button,  IconButton, TextField, makeStyles, CardHeader, Avatar, CardContent, Typography, CardActions } from '@material-ui/core'
import { PhotoCamera } from '@material-ui/icons'
import auth from '../auth/auth-helper'
import { create } from './api-post'
import propTypes from 'prop-types'

const useStyles = makeStyles(theme => ({
	root: {
		backgroundColor: theme.palette.primary,
		padding: `${theme.spacing(3)}px 0px 1px`
	},
	card: {
		maxWidth: 600,
		margin: 'auto',
		marginBottom: theme.spacing(3),
		backgroundColor: 'rgba(65, 150, 136, 0.09)',
		boxShadow: 'none'
	},
	cardContent: {
		backgroundColor: theme.palette.secondary,
		paddingTop: 0,
		paddingBottom: 0
	},
	cardHeader: {
		paddingTop: 8,
		paddingBottom: 8,
	},
	textField: {
		width: '90%',
		marginLeft: theme.spacing(2),
		marginRight: theme.spacing(2)
	},
	input: {
		display: 'none'
	},
	photoButton: {
		height: 30,
		marginBottom: 5
	},
	submit: {
		margin: theme.spacing(2)
	},
	filename: {
		verticalAlign: 'super'
	}
}))


const NewPost = (props) => {
	const classes = useStyles()
	const [values, setValues] = useState({
		text: '',
		photo: '',
		error: '',
		user: {}
	})

	useEffect(() => {
		setValues(v => ({ ...v, user: auth.isAuthenticated().user }))
	}, [])

	const jwt = auth.isAuthenticated()

	const clickPost = async (e) => {
		e.preventDefault()

		let postData = new FormData()

		postData.append('text', values.text)
		postData.append('photo', values.photo)
		try {
			const data = await create({ userId: jwt.user.id}, jwt.token, postData)
			setValues({ ...values, text:'', photo: '' })
			props.addUpdate(data)
		} catch (err) {
			setValues({ ...values, error: err.response.data.error})
		}

	}

	const handleChange = name => event => {
		const value = name === 'photo'
			? event.target.files[0]
			: event.target.value
		setValues({ ...values, [name]: value})
	}

	const photoUrl = values.user.id ? `/api/users/photo/${values.user.id} `
		: '/api/users/defaultphoto'

	return (
		<div className={classes.root}>
			<Card className={classes.card}>
				<CardHeader avatar={<Avatar src={photoUrl} />}
					title={values.user.name}
					className={classes.cardHeader} 
				/>
				<CardContent className={classes.cardContent}>
					<TextField
						placeholder="Share your thoughts..."
						className={classes.textField}
						multiline
						rows="3"
						value={values.text}
						onChange={handleChange('text')}
						margin="normal"
					/>
					<input accept="image/*" onChange={handleChange('photo')}
						className={classes.input} id="icon-button-file" type="file" 
					/>
					<label htmlFor="icon-button-file">
						<IconButton color="secondary" className={classes.photoButton} component="span">
							<PhotoCamera />
						</IconButton>
					</label>
					<span className={classes.filename}>
						{values.photo ? values.photo.name : ''}
					</span>
						{
							values.error && <Typography component="p" color="error">
								<Icon color="error" className={classes.error}>error</Icon>
								{values.error}
							</Typography>
						}
				</CardContent>
				<CardActions>
					<Button color="primary" variant="contained" disabled={values.text === ''} onClick={clickPost} className={classes.submit}>POST</Button>
				</CardActions>
			</Card>
		</div>
	)
}

NewPost.propTypes = {
	addUpdate: propTypes.func.isRequired
}

export default NewPost