import React, { useState, useEffect} from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'

import Navigation from '../Navigation'
import LandingPage from '../Landing'
import SignUpPage from '../SignUp'
import SignInPage from '../SignIn'
import PasswordForgetPage from '../PasswordForget'
import HomePage from '../Home'
import AccountPage from '../Account'
import AdminPage from '../Admin'
import { withAuthentication } from '../Session'
import { AuthUserContext } from '../Session/index'
import * as ROUTES from '../../constants/routes'

const App = ({firebase}) => {

    const [authUser, setAuthUser] = useState(null)
    useEffect(() => {firebase.auth.onAuthStateChanged(authUser => {
      authUser
      ? setAuthUser({authUser})
      : setAuthUser(null)
    })},[])
    console.log(authUser)
    return (
      <AuthUserContext.Provider value={authUser}>
        <Router>
            <Navigation />
            <hr />

            <Route exact path={ROUTES.LANDING} component={LandingPage}/>
            <Route path={ROUTES.SIGN_UP} component={SignUpPage}/>
            <Route path={ROUTES.SIGN_IN} component={SignInPage}/>
            <Route path={ROUTES.PASSWORD_FORGET} component={PasswordForgetPage}/>
            <Route path={ROUTES.HOME} component={HomePage}/>
            <Route path={ROUTES.ACCOUNT} component={AccountPage}/>
            <Route path={ROUTES.ADMIN} component={AdminPage}/>

        </Router> 
      </AuthUserContext.Provider>
    )
}

export default withAuthentication(App)