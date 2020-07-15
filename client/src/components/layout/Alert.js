import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

const Alert = ({ alerts }) => {
    return (
        alerts !== null && alerts.length > 0 && alerts.map(alert => {
            return (
                <div key={alert.id} className={`alert alert-${alert.alertType}`}>
                    {alert.msg}
                </div>
            )
        })
    )
}


Alert.propTypes = {
    alerts: PropTypes.array.isRequired,
}

// we want that array(i.e. is in the redux dev-tool) to convert int the props so that we can access here to show in UI
const mapStateToProps = state => ({
    alerts: state.alert                    // this is props.alerts or { alerts }
})


export default connect(mapStateToProps)(Alert)
