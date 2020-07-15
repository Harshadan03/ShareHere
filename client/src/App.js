import React, { Fragment, useEffect } from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import loadUser from './actions/auth'

import Routes from './components/routing/Routes'
import Navbar from './components/layout/Navbar'
import Landing from './components/layout/Landing'

// Provider for connecting react with redux
import { Provider } from 'react-redux'
import store from './store'
import setAuthToken from './utils/setAuthToken'

import './App.css'

// must run when 1st time when user loads
if (localStorage.token) {
  setAuthToken(localStorage.token)
}

// all the page except the landing page needs to be of container so for that we put all other page in container class and in Switch Route
// So we're going to just wrap everything in a switch say route same exact path and we're going to set

// So if you want to run in effect and clean it up only once on mountain one mile you can pass in an empty array as a second argument.

const App = () => {

  useEffect(() => {
    store.dispatch(loadUser())
  }, []);

  return (
    <Provider store={store}>
      <Router>
        <Fragment>
          <Navbar />
          <Switch>
            <Route exact path="/" component={Landing} />
            <Route component={Routes} />
          </Switch>
        </Fragment>
      </Router>
    </Provider>
  )
}


//And then for the dashboard we want to protect that so we're going to use private route like that instead
//So any wrote that we want to try to force the user to be logged in for we can simply use private route instead of route.
export default App