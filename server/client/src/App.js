import React, { useEffect } from 'react'
import MainRouter from './MainRouter'
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider } from '@material-ui/styles'
import theme from './theme'


const App = () => {
	useEffect(() => {
		const ssStyles = document.querySelector('#jss-server-side')
		if (ssStyles) {
			ssStyles.parentNode.removeChild(ssStyles)
		}
	}, [])
	return (
		<BrowserRouter>
			<ThemeProvider theme={theme}>
				<MainRouter />
			</ThemeProvider>
		</BrowserRouter>
	)
}

export default App