import { createMuiTheme } from '@material-ui/core/styles'


const theme = createMuiTheme({
	typography: {
		useNextVariants: true
	},
	palette: {
		primary: {
			light: '#2e90f1',
			main: '#1262b3',
			dark: '#05386b',
			contrastText: '#fff'
		},
		secondary: {
			light: '#edf5e1',
			main: '#8ee4af',
			dark: '#5cdb95',
			contrastText: '#000'
		},
		openTitle: 'white',
		protectedTitle: 'white',
		type: 'dark'
	}
})

export default theme