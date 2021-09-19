import React, { useState } from 'react'
import auth from '../auth/auth-helper'
import { remove } from './api-user'
import { Redirect } from 'react-router-dom'
import { Dialog, Button, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton } from '@material-ui/core'
import { Delete } from '@material-ui/icons'
import propTypes from 'prop-types'

const DeleteUser = ({ userId }) => {


	const [open, setOpen] = useState(false)
	const [redirect, setRedirect] = useState(false)

	const handleClick = () => {
		setOpen(true)
	}

	const handleRequestClose = () => {
		setOpen(false)
	}

	const deleteAccount = async () => {
		const jwt = auth.isAuthenticated()
		try {
			const data = await remove({ userId }, jwt.token)
			auth.clearJwt(() => console.log('deleted'))
			setRedirect(true)
		} catch (err) {
			console.log(err.response.data.error)
		}
	}

	if (redirect) {
		return <Redirect to="/" />
	}

	return (
		<span>
			<IconButton arial-label="Delete" onClick={handleClick} color="secondary">
				<Delete />
			</IconButton>
			<Dialog open={open} onClose={handleRequestClose}>
				<DialogTitle>
					Delete Account
				</DialogTitle>
				<DialogContent>
					<DialogContentText>
						Confirm to delete your account.
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleRequestClose} color="primary">
						Cancel
					</Button>
					<Button onClick={deleteAccount} color="secondary" autoFocus="autoFocus">
						Confirm
					</Button>
				</DialogActions>
			</Dialog>
		</span>
	)
}

DeleteUser.propTypes = {
	userId: propTypes.string.isRequired
}

export default DeleteUser