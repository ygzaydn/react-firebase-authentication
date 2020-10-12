import React from 'react'

import { PasswordForgetForm } from '../PasswordForget'
import PasswordChangeForm from '../PasswordChange'
import { withAuthorization } from '../Session'

const AccountPage = ({authUser}) => {
  console.log(authUser)
    return (
          <div>
            <h1>Account: {authUser.authUser.email}</h1>
            <PasswordForgetForm />
            <PasswordChangeForm />
          </div>
        )
}

const condition = authUser => authUser != null

export default withAuthorization(condition)(AccountPage)