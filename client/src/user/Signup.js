import React, { useState } from 'react'
import { create } from './api-user'
import { Card, CardContent, Typography, Icon, TextField, CardActions, makeStyles, Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@material-ui/core'
import { Link } from 'react-router-dom'


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
const Signup = () => {
	const classes = useStyles()
	const [values, setValues] = useState({
		name: '',
		password: '',
		email: '',
		open: false,
		error: ''
	})

	const handleChange = name => event => {
		setValues({ ...values, [name]: event.target.value })
	}

	const handleSubmit = async (e) => {
		e.preventDefault()
		const user = {
			name: values.name || undefined,
			email: values.email || undefined,
			password: values.password || undefined
		}
		try {
			await create(user)
			setValues({ ...values, error: '', open: true })
		} catch (error) {
			setValues({ ...values, error: error.response.data.error})
		}
	}

	return (
		<div>
			<Card className={classes.card}>
				<CardContent>
					<Typography variant="h6" className={classes.title}>
						Sign Up
					</Typography>
					<TextField id="name" label="Name" className={classes.textField}
						value={values.name} onChange={handleChange('name')}
						margin="normal" />
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
			<Dialog open={values.open} disableBackdropClick={true}>
				<DialogTitle>New Account</DialogTitle>
				<DialogContent>
					<DialogContentText>
						New account successfully created.
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Link to="/signin">
						<Button color="primary" autoFocus="autoFocus" variant="contained">
							Sign In
						</Button>
					</Link>
				</DialogActions>
			</Dialog>
		</div>
	)
}

export default Signup