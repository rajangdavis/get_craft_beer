import Head from 'next/head'
import Header from '../components/header'

export default ({ children }) => (
  <div>
	<Head>
		<meta name="viewport" content="initial-scale=1.0, width=device-width" />
		<title>Get Craft Beer</title>
		<link href="https://fonts.googleapis.com/css?family=Inconsolata" rel="stylesheet"/>	
		<link rel="stylesheet" type="text/css" href="/static/style.css"/>
	</Head>
	<Header/>
	{children}
  </div>
)