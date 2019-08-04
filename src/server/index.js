import App from '../components/App'
import React from 'react'
import { Provider } from 'react-redux'
import { StaticRouter } from 'react-router-dom'
import express from 'express'
import { renderToString } from 'react-dom/server'
import configureStore from '../store/configureStore'
import rootSaga from '../store/rootSaga'
import axios from 'axios'
import qs from 'qs'
import bodyParser from 'body-parser'

const assets = require(process.env.RAZZLE_ASSETS_MANIFEST)
const server = express()
const createPreloadedState = () => ({})
server
  .disable('x-powered-by')
  .use(express.static(process.env.RAZZLE_PUBLIC_DIR))
  .disable('x-powered-by')
  .use(express.static(process.env.RAZZLE_PUBLIC_DIR))
  .use(bodyParser.json())
  .use(bodyParser.urlencoded({
    extended: false
  }))
  .post('/data/user/submit', (req, res) => {
    let url = process.env.RAZZLE_DIFM_API + 'signup/customer'
    axios({
      method: 'post',
      url: url,
      data: qs.stringify(req.body)
    })
      .then(data => res.status(200).json(data.data))
      .catch(err => err.message)
  })
  .post('/data/login', (req, res) => {
    const userType = req.body.userType
    let url = process.env.RAZZLE_DIFM_API + 'login/' + userType
    axios({
      method: 'post',
      url: url,
      data: qs.stringify(req.body)
    })
      .then(data => res.status(200).json(data.data))
      .catch(err => err.message)
  })
  .post('/data/*', (req, res) => {
    let url = process.env.RAZZLE_DIFM_API + req.url.split('/')[2]
    axios({
      method: 'post',
      url: url,
      data: qs.stringify(req.body)
    })
      .then(data => res.status(200).json(data.data))
      .catch(err => err.message)
  })
  .get('/*', (req, res) => {
    const store = configureStore(createPreloadedState())
    const context = {}
    const markup = renderToString(
      <Provider store={store}>
        <StaticRouter context={context} location={req.url}>
          <App />
        </StaticRouter>
      </Provider>
    )
    const finalState = store.getState()

    // res.render('index', {title: 'Express', data: store.getState(), markup })
    if (context.url) {
      res.redirect(context.url)
    } else {
      store.runSaga(rootSaga)
      res.status(200).send(
        `<!doctype html>
        <html lang="en_ZA">
        <head>
          <meta name="google-site-verification" content="iQCzO2whcLNU6_F3xi1Dck7JMALz7869mBLTQf08wJo" />
          <meta charset="UTF-8" />
            <meta http-equiv="X-UA-Compatible" content="IE=edge, chrome=1" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
          <title>Bitcub-SN</title>
            ${assets.client.css ? `<link rel="stylesheet" href="${assets.client.css}">` : ''}
            ${process.env.NODE_ENV === 'production' ? `<script src="${assets.client.js}" defer></script>` : `<script src="${assets.client.js}" defer crossorigin></script>`}
            <!--  Favicons -->
            <link rel="apple-touch-icon" sizes="180x180" href="/favicon/apple-touch-icon.png" />
            <link rel="icon" type="image/png" sizes="32x32" href="/favicon/favicon-32x32.png" />
            <link rel="icon" type="image/png" sizes="16x16" href="/favicon/favicon-16x16.png" />
            <link rel="manifest" href="/favicon/manifest.json" />
            <link rel="mask-icon" href="/favicon/safari-pinned-tab.svg" color="#b41400" />
            <link rel="shortcut icon" href="/favicon/favicon.ico" />
            <link rel="stylesheet" href="assets/vendor/bootstrap/css/bootstrap.css">
            <link rel="stylesheet" href="assets/vendor/font-awesome/css/font-awesome.css">
            <link rel="stylesheet" href="assets/vendor/animate.css/animate.css">
            <link rel="stylesheet" href="assets/css/chl.css">
            <link rel="stylesheet" href="assets/css/theme-peter-river.css">
            <link href="https://fonts.googleapis.com/css?family=Open+Sans:300,400,600,700" rel="stylesheet">
            <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.3.1/css/all.min.css" rel="stylesheet">
            <meta name="msapplication-config" content="/favicon/browserconfig.xml" />
            <meta name="theme-color" content="#ffffff" />
            <!--  Font and Normalize CSS -->
            <style type="text/css">
               .no-fouc {display: none;}
            </style>
            <link href="https://fonts.googleapis.com/css?family=Open+Sans:400,700|Roboto+Condensed" rel="stylesheet">
            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/normalize.css@7.0.0/normalize.min.css" />
        </head>
        <body id="top" class="no-fouc">
          <div id="root">${markup}</div>
            <script type="text/javascript">
                window.__PRELOADED_STATE__ = ${JSON.stringify(finalState)};
                document.getElementById("top").removeAttribute("class");
            </script>
            </body>
        </html>`
      )
    }
  })

export default server
