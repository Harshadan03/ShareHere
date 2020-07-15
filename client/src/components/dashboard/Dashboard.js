//we want to call this get current profile as soon as this loads.
//Now in order to do that since we're using hooks we're gonna use use effect.
import React, { Fragment, useEffect } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import DashboardActions from './DashboardActions'
import { getCurrentProfile, deleteAccount } from '../../actions/profile'
import Experience from './Experience'
import Education from './Education'
import Spinner from '../layout/Spinner'
import { Link } from 'react-router-dom'


const Dashboard = ({ getCurrentProfile, auth: { user }, profile: { profile, loading }, deleteAccount }) => {

    useEffect(() => {
        getCurrentProfile()
    }, [getCurrentProfile])

    return loading && profile === null ? <Spinner /> : <Fragment>
        <h1 className="large text-primary">Dashboard</h1>
        <p className="lead">
            <i className="fas fa-user">Welcome {user && user.name}</i>
        </p>
        {
            profile != null ? <Fragment> <DashboardActions />
                <Link to={`/profile/${user._id}`} className="btn btn-primary my-1"><i className="fas fa-user"> My Profile</i></Link>

                <Experience experience={profile.experience} />
                <Education education={profile.education} />

                <div className="my-2">
                    <button className="btn btn-danger" onClick={() => deleteAccount()}>
                        <i className="fas fa-user-minus"></i> Delete My Account
                    </button>
                </div>

            </Fragment> : <Fragment>
                    <p> Sorry you Dont have Profile yet Plz add Profile...</p>
                    <Link to='/create-profile' className="btn btn-primary my-1">Create Profile</Link>
                </Fragment>
        }
    </Fragment>
}

Dashboard.propTypes = {
    getCurrentProfile: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    profile: PropTypes.object.isRequired,
    deleteAccount: PropTypes.func.isRequired
}

const mapStateToProps = state => ({
    auth: state.auth,
    profile: state.profile
})

export default connect(mapStateToProps, { getCurrentProfile, deleteAccount })(Dashboard)
