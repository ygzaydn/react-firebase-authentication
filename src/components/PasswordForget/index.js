import React, { useState } from 'react'
import { Link } from 'react-router-dom'

import { withFirebase } from '../Firebase'
import * as ROUTES from '../../constants/routes'

const PasswordForgetPage = () => {
    return (
      <div>
        <h1> Password Forget </h1>
        <PasswordForgetForm />
      </div>
    )
}

const PasswordForgetFormBase = ({firebase}) => {
  const [email, setEmail] = useState('')
  const [error, setError] = useState(null)
  const onSubmit = (event) => {
    firebase.doPasswordReset(email)
    .then(() => {
      setEmail('')
      setError(null)
    }).catch(error => {
      setError(error)
    })
    event.preventDefault()
  }

  const onChange = event => {
    setEmail(event.target.value);
  }

  const isInvalid = email === ''

  return (
    <form onSubmit={onSubmit}>
      <input
        name="email"
        value={email}
        onChange={onChange}
        type="text"
        placeholder="Email adress"
      />
      <button disabled={isInvalid} type="submit">
        Reset My Password
      </button>
    </form>
  )
}

const PasswordForgetLink = () => (
  <p>
    <Link to={ROUTES.PASSWORD_FORGET}>Forgot Password?</Link>
  </p>
)

export default PasswordForgetPage

const PasswordForgetForm = withFirebase(PasswordForgetFormBase)

export { PasswordForgetForm, PasswordForgetLink }