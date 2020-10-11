import React from 'react'
import { withFirebase } from '../Firebase'
import { withRouter } from 'react-router-dom'
import { compose } from 'recompose'
import * as ROUTES from '../../constants/routes'

const SignOutBase = ({firebase, history}) => {

    const onClick = () => {
      firebase.doSignOut()
      .then(() =>{
        history.push(ROUTES.HOME)
      })
    }
    return (
        <button type="button" onClick={onClick}> Sign Out </button>
    )
}

const SignOut = compose(withRouter, withFirebase)(SignOutBase)

export default SignOut