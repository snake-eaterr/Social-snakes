import React, { useState } from 'react'
import { Card, CardContent, Typography, Icon, TextField, CardActions, makeStyles, Button } from '@material-ui/core'
import { signin } from './api-auth'
import auth from './auth-helper'
import { Redirect } from 'react-router-dom'

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

const Signin = (props) => {
	const classes = useStyles()
	const [values, setValues] = useState({
		email: '',
		password: '',
		error: '',
		redirectToReferrer: false
	})

	const handleChange = name => event => {
		setValues({ ...values, [name]: event.target.value })
	}
	let timeout
	const handleSubmit = async (e) => {
		
		e.preventDefault()
		const user = {
			email: values.email || undefined,
			password: values.password || undefined
		}
		try{
			const data = await signin(user)
			auth.authenticate(data, () => {
				setValues({ ...values, error: '', redirectToReferrer: true })
			})
			
		} catch(error) {
			setValues({ ...values, error: error.response.data.error })
			clearTimeout(timeout)
			timeout = setTimeout(() => {
				setValues({ ...values, error: ''})
			}, 7000)
		}
	}

	const { from } = props.location.state || {
		 from: { pathname: '/' }
	}

	const { redirectToReferrer } = values
	if (redirectToReferrer) {
		return <Redirect to={from} />
	}

	return (
		<div>
			<Card className={classes.card}>
				<CardContent>
					<Typography variant="h6" className={classes.title}>
						Sign In
					</Typography>
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
					<Button  variant="contained" onClick={handleSubmit}
						className={classes.submit}>
							Submit
						</Button>
				</CardActions>
			</Card>
			</div>
	)
}

export default Signin