import express from 'express'
import cookieParser from 'cookie-parser'
import compress from 'compression'
import cors from 'cors'
import helmet from 'helmet'
import config from './utils/config'
import mongoose from 'mongoose'
import userRouter from './controllers/userRoutes'
import authRouter from './controllers/authRoutes'
import postRouter from './controllers/postRoutes'
import middleware from './utils/middleware'
import path from 'path'
import fs from 'fs'




//modules for server side rendering

import React from 'react'
import ReactDOMServer from 'react-dom/server'
import { StaticRouter } from 'react-router-dom'
import MainRouter from './client/src/MainRouter'
import { ServerStyleSheets, ThemeProvider } from '@material-ui/core'
import theme from './client/src/theme'



const app = express()



mongoose.connect(config.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
	.then(() => console.log('connected to mongodb'))
	.catch(error => {
		console.log(`error connecting to mongodb. error: ${error.message}`)
	})
app.use(cors())
app.use(helmet())

app.get( /\.(js|css|map|ico|jpg|jpeg)$/, express.static('./build'))
app.use(express.json())
app.use(cookieParser())
app.use(compress())
app.use('/api', userRouter)
app.use('/auth', authRouter)
app.use('/api', postRouter)



app.get('*', (req, res) => {
	const sheets = new ServerStyleSheets()
	const context = {}
	const markup = ReactDOMServer.renderToString(
		sheets.collect(
			<StaticRouter location={req.url} context={context}>
				<ThemeProvider theme={theme}>
					<MainRouter />
				</ThemeProvider>
			</StaticRouter>
		)
	)

	if (context.url) {
		return res.redirect(303, context.url)
	}



	const css = sheets.toString()
	let indexHTML = fs.readFileSync(path.resolve(__dirname, '../build/index.html'), {
		encoding: 'utf-8'
	})


	indexHTML = indexHTML.replace(`<div id="root"></div>`, `<div id="root">${markup}</div>`)
	indexHTML = indexHTML.replace(`<style id="jss-server-side"></style>`, `<style id="jss-server-side">${css}</style>`)

	res.send(indexHTML)
})


app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)


export default app