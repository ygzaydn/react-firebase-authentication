import React, {useState } from 'react'
import { withFirebase } from '../Firebase'

const PasswordChangeForm = ({firebase}) => {
    const [passwordOne, setPasswordOne] = useState('')
    const [passwordTwo, setPasswordTwo] = useState('')
    const [error, setError] = useState(null)

    const onSubmit = (event) => {
      firebase.doPasswordUpdate(passwordOne)
      .then(()=>{
        setPasswordOne('')
        setPasswordTwo('')
        setError(null)
      }).catch(error => (
        setError(error)
      ))

      event.preventDefault()
    }
    
    const onChange = setFunction => event => {
      setFunction(event.target.value)
    }

    const isInvalid = passwordOne !== passwordTwo || passwordOne === ''

    return (
      <form onSubmit={onSubmit}>
        <input 
          name="passwordOne"
          value={passwordOne}
          onChange={onChange(setPasswordOne)}
          type="password"
          placeholder="New Password"
        />
        <input 
          name="passwordTwo"
          value={passwordTwo}
          onChange={onChange(setPasswordTwo)}
          type="password"
          placeholder="Confirm New Password"
        />
        <button disabled={isInvalid} type="submit">
          Reset My Password
        </button>

        {error && <p>{error.message}</p>}
      </form>
    )
}

export default withFirebase(PasswordChangeForm)