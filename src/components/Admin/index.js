import React from 'react'

import {withAuthorization} from '../Session'
import * as ROLES from '../../constants/roles'

const AdminPage = () => {

    return (
      <div>
        <h1>Admin</h1>
        <p> Restricted area! Only admin users can see this page!</p>
      </div>
    )
}

const condition = authUser => authUser && !!authUser.roles[ROLES.ADMIN]

export default withAuthorization(condition)(AdminPage)