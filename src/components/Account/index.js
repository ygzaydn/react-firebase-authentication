import React from 'react'

import { PasswordForgetForm } from '../PasswordForget'
import PasswordChangeForm from '../PasswordChange'
import { withAuthorization, AuthUserContext } from '../Session'

const AccountPageBase = ({authUser}) => {

    return (
          <div>
            <h1>Account: {authUser.authUser.email}</h1>
            <PasswordForgetForm />
            <PasswordChangeForm />
          </div>
        )
}

const condition = authUser => authUser != null

const AccountPage = withAuthorization(condition)(AccountPageBase)

export default AccountPage