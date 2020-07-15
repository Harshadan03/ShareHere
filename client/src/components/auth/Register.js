import React, { Fragment, useState } from 'react'
// import sweetAlert from 'sweetalert';
import { Link, Redirect } from 'react-router-dom'
// Connect Component to Redux
import { connect } from 'react-redux'   // wwherever we connect we actually have to also connect in export right below

//now we want to bring the setAlert dispatcher
import { setAlert } from '../../actions/alert'
import { register } from '../../actions/auth'

// set the prop type
import PropTypes from 'prop-types'


// And since it's a form we need to have some components state because each each input needs to have its
// own state at all.They also need to have an on change handler.So when we type in it it updates the state.
// All right so we're using a functional component here so we're gonna use the use state hook.
// So we want to bring that in use state.
// And we're gonna go right above the return here and say cons with some brackets and we're our state is
// gonna be formed data.
// So basically it's going to be an object with all of the field values and then the second thing we need
// to put here is the the function we want to use to update our state which I'm going to call set form
// data and we want to pull that from use state just like that.

const Register = ({ setAlert, register, isAuthenticated }) => {

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        password2: ''
    })

    const { name, email, password, password2 } = formData

    const onChange = e => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const onSubmit = async e => {
        e.preventDefault();

        if (password !== password2) {
            setAlert('Opps! Your Password should match', 'danger');
        } else {
            //console.log(formData)
            register({ name, email, password })
        }
    }

    if (isAuthenticated) {
        return (
            <Redirect to="/dashboard" />
        )
    }

    return (
        <Fragment>
            <h1 className="large text-primary">Sign Up</h1>
            <p className="lead"><i className="fas fa-user"></i> Create Your Account</p>
            <form className="form" onSubmit={e => onSubmit(e)}>
                <div className="form-group">
                    <input
                        type="text"
                        placeholder="Name"
                        name="name"
                        value={name}
                        onChange={e => onChange(e)}
                        required
                    />
                </div>
                <div className="form-group">
                    <input
                        type="email"
                        placeholder="Email Address"
                        name="email"
                        value={email}
                        onChange={e => onChange(e)}
                        required
                    />
                    <small className="form-text">This site uses Gravatar so if you
                                                 want a profile image, use aGravatar email</small>
                </div>
                <div className="form-group">
                    <input
                        type="password"
                        placeholder="Password"
                        name="password"
                        value={password}
                        onChange={e => onChange(e)}
                        minLength="6"
                        required
                    />
                </div>
                <div className="form-group">
                    <input
                        type="password"
                        placeholder="Confirm Password"
                        name="password2"
                        value={password2}
                        onChange={e => onChange(e)}
                        minLength="6"
                        required
                    />
                </div>
                <input type="submit" className="btn btn-primary" value="Register" />
            </form>
            <p className="my-1">
                Already have an account? <Link to="/login">Sign In</Link>
            </p>
        </Fragment>
    )
}

Register.propTypes = {
    setAlert: PropTypes.func.isRequired,
    register: PropTypes.func.isRequired,
    isAuthenticated: PropTypes.bool
}


const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated
})


// if we want to get state from alert or profile or anything else would put that as a first parameter in connect else null.

// The second is going to be an object with any actions you want to use. So in our case set alert.

export default connect(mapStateToProps, { setAlert, register })(Register)

// Now what this is going to do is it's going to allow us to access props dot set alert.