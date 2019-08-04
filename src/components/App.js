import React from 'react'
import Route from 'react-router-dom/Route'
import Helmet from 'react-helmet'
import Switch from 'react-router-dom/Switch'
import Home from './Home'
import Login from './Login'
import Signup from './Signup'
import VendorProfile from './VendorProfile'
import 'bootstrap/dist/css/bootstrap.css'

const App = () => (
  <div id='app'>
    <Helmet>
      <title>Do It For Me | Find Professionals</title>
      <meta name='description' content='We give you a snapshot of your neighbourhood' />
      <meta property='og:title' content='Know Your Neighbourhood | MyNeighbourhood' />
      <meta property='og:description' content='MyNeighbourhood' />
    </Helmet>
    <Switch>
      <Route exact path='/' component={Home} />
      <Route exact path='/login' component={Login} />
      <Route exact path='/signup' component={Signup} />
      <Route exact path='/vendor' component={VendorProfile} />
    </Switch>
  </div>
)

export default App
