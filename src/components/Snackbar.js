import React, { useState, useEffect } from 'react'
import { Snackbar } from '@material-ui/core'
import { connect } from "react-redux";

const SnackbarMessage = ({ state }) => {
    const [open, setOpen] = useState(false)

    useEffect(() => {
        if (state.error) setOpen(true)
    }, [state])

    return (
        <Snackbar open={open} autoHideDuration={3000} message={state.error} onClose={() => setOpen(false)} />
    )
}

const mapStateToProps = (state) => ({
    state: state.auth ? state.auth : state.products,
});

export default connect(mapStateToProps)(SnackbarMessage)