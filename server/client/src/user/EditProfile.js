import React, { useEffect, useState } from 'react'
import { makeStyles, Card, CardActions, TextField, Typography, CardContent, Icon, Button } from '@material-ui/core'
import { FileCopy } from '@material-ui/icons'
import auth from '../auth/auth-helper'
import { update, read } from './api-user'
import { useParams, Redirect } from 'react-router-dom'
import axios from 'axios'



const useStyles = makeStyles(theme => ({
	card: {
		maxWidth: 600,
		margin: 'auto',
		marginTop: theme.spacing(5),
		textAlign: 'center'
	},
	title: {
		marginTop: theme.spacing(2),
		color: theme.palette.openTitle,
		textAlign: 'center'
	},
	textField: {
		width: 300,
		marginLeft: theme.spacing(2),
		marginRight: theme.spacing(2)
	},
	submit: {
		margin: 'auto',
		marginBottom: theme.spacing(1)
	},
	error: {
		verticalAlign: 'middle'
	}


}))

const EditProfile = () => {
	
	const classes = useStyles()
	const [values, setValues] = useState({
		name: '',
		password: '',
		email: '',
		about: '',
		redirectToProfile: false,
		error: '',
		photo: ''
	})
	const userId = useParams().userId
	
	useEffect(() => {
		const cancelToken = axios.CancelToken
		const source = cancelToken.source()
		let timeout
		const getInfo = async () => {
			const jwt = auth.isAuthenticated()
			try {
				const data = await read({ userId: userId }, jwt.token, source)
				setValues(v => ({ ...v, name: data.name, email: data.email }))
			} catch (err) {
				setValues(v => ({ ...v, error: err.response.data.error}))
				clearTimeout(timeout)
				timeout = setTimeout(() => {
				setValues({ ...values, error: ''})
			}, 7000)
			}
		}

		getInfo()
		return () => source.cancel()
	}, [userId])

	const handleSubmit = async (e) => {
		e.preventDefault()

		const jwt = auth.isAuthenticated()
		let userData = new FormData()
		values.name && userData.append('name', values.name)
		values.email && userData.append('email', values.email)
		values.password && userData.append('password', values.password)
		values.about && userData.append('about', values.about)
		values.photo && userData.append('photo', values.photo)

		try {
			const data = await update({ userId }, jwt.token, userData)
			setValues({ ...values, redirectToProfile: true})
		} catch (err) {
			setValues({ ...values, error: err.response.data.error })
		}
	}

	const handleChange = name => event => {
		const value = name === 'photo'
			? event.target.files[0]
			: event.target.value
		setValues({ ...values, [name]: value})
	}

	if (values.redirectToProfile) {
		return <Redirect to={`/user/${userId}`} />
	}

	return (
		<div>
			<Card className={classes.card}>
				<CardContent>
					<Typography variant="h6" className={classes.title}>
						Edit Profile
					</Typography>
					<input accept="image/*" type="file" onChange={handleChange('photo')}
						style={{ display: 'none '}}
						id="icon-button-file" />
					<label htmlFor="icon-button-file">
						<Button variant="contained" color="default" component="span">
							Upload Profile Image <FileCopy />
						</Button>
					</label>
					<span className={classes.filename}>
						{values.photo ? values.photo.name : ''}
					</span>
					<br />
					<TextField id="name" label="Name" className={classes.textField}
						value={values.name} onChange={handleChange('name')}
						margin="normal" />
					<br />
					<TextField id="multiline-flexible" label="About" multiline rows="2"
						value={values.about} onChange={handleChange('about')} className={classes.textField} />
					<br />
					<TextField id="email" type="email" label="Email"
						className={classes.textField} value={values.email}
						onChange={handleChange('email')}
						margin="normal" />
					<br />
					<TextField id="password" type="password" label="Password"
						className={classes.textField} value={values.password}
						onChange={handleChange('password')} margin="normal" />
					<br />
					{
						values.error && <Typography component="p" color="error">
							<Icon color="error" className={classes.error}>error</Icon>
							{values.error}
						</Typography>
					}
				</CardContent>
				<CardActions>
					<Button color="primary" variant="contained" onClick={handleSubmit}
						className={classes.submit}>
							Submit
						</Button>
				</CardActions>
			</Card>
		</div>
	)
}

export default EditProfile