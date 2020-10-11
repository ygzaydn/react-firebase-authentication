import React, { useState } from 'react'
import { Link, withRouter } from 'react-router-dom'

import { withFirebase } from '../Firebase'
import { compose } from 'recompose'
import * as ROUTES from '../../constants/routes'

const SignUpPage = () => {
    return (
      <div>
        <h1>Sign Up</h1>
        <SignUpForm />
      </div>
    )
}

export const SignUpFormBase = ({firebase, history}) => {
  const [username, setUsername ] = useState('')
  const [email, setEmail ] = useState('')
  const [passwordOne, setPasswordOne ] = useState('')
  const [passwordTwo, setPasswordTwo ] = useState('')
  const [error, setError ] = useState(null)


  const onSubmit = (event) => {
    firebase.doCreateUserWithEmailAndPassword(email, passwordOne).then(authUser => {
      setUsername('')
      setEmail('')
      setPasswordOne('')
      setPasswordTwo('')
      setError(null)
      history.push(ROUTES.HOME)
    }).catch(error => {
      setError(error)
    })

    event.preventDefault()
  }
  const onChange = (setFunction) => (event) => {
    setFunction(event.target.value)
  }

  const isInvalid = passwordOne !== passwordTwo || passwordOne === '' || email === '' || username === ''

  return (
    <form onSubmit={onSubmit}>
      <input
        name="username"
        value={username}
        onChange={onChange(setUsername)}
        type="text"
        placeholder="Full Name"
      />
      <input
        name="email"
        value={email}
        onChange={onChange(setEmail)}
        type="text"
        placeholder="Email Adress"
      />
      <input
        name="passwordOne"
        value={passwordOne}
        onChange={onChange(setPasswordOne)}
        type="password"
        placeholder="Password"
      />
      <input
        name="passwordTwo"
        value={passwordTwo}
        onChange={onChange(setPasswordTwo)}
        type="password"
        placeholder="Confirm Password"
      />
      <button disabled={isInvalid} type="submit">Sign Up</button>

      {error && <p>{error.message}</p>}
    </form>
  )
}

export const SignUpLink = () => (
  <p>Don't have an account? <Link to={ROUTES.SIGN_UP}>Sign Up</Link></p>
)

const SignUpForm = compose(withRouter,withFirebase)(SignUpFormBase)

export default SignUpPage
