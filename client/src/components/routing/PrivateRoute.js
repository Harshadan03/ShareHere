import React from 'react'
import { Route, Redirect } from 'react-router-dom'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'


const PrivateRoute = ({ component: Component, auth: { isAuthenticated, loading }, ...rest }) => (
    <Route {...rest} render={props => !isAuthenticated && !loading ? (<Redirect to="/login" />) : (<Component {...props} />)} />
)
// we check to see if the user is not authenticated and not loading and if that's true 
//then we're going to just redirect to log in. OK, If they are authenticated then the component will load.


PrivateRoute.propTypes = {
    auth: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
    auth: state.auth                        // we want all the state in auth reducer
})

export default connect(mapStateToProps)(PrivateRoute)
