import React, { useState } from 'react'
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'
import styles from '@/app/styles/SignIn.module.css'
import Image from 'next/image'

const SignIn = () => {
  const [credentials, setCredentials] = useState({ username: '', password: '' })
  const [error, setError] = useState(null)

  console.log(error)

  const handleSignIn = async (e) => {
    e.preventDefault()
    try {
      const auth = getAuth()
      const email = `${credentials.username}@ucla.edu` // Append @ucla.edu to the username
      await signInWithEmailAndPassword(auth, email, credentials.password)
      setError(null) // Clear any previous errors on successful sign-in
    } catch (error) {
      setError('The username or password is incorrect. Please try again.')
      console.log(error.message)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setCredentials({ ...credentials, [name]: value })
  }

  return (
    <div>
      <div className={styles.container}>
        <form onSubmit={handleSignIn}>
          <div className={styles.card}>
            <Image alt="logo">{/* Add logo if needed */}</Image>
            {error && (
              <div
                style={{
                  color: 'red',
                  marginBottom: '10px',
                  textAlign: 'center' // Center the text
                }}
              >
                {error}
              </div>
            )}
            <h2>Sign in to your account</h2>
            <div>
              <input
                type="text"
                name="username"
                value={credentials.username}
                onChange={handleChange}
                placeholder="Username"
              />
            </div>
            <div>
              <input
                type="password"
                name="password"
                value={credentials.password}
                onChange={handleChange}
                placeholder="Password"
              />
            </div>
            <button type="submit">Sign In</button>
            <div style={{ color: 'grey', fontSize: '0.7rem' }}>
              <p>
                Need Help?{' '}
                <a
                  href="mailto:uclatennisconsulting@gmail.com"
                  style={{ color: 'inherit', textDecoration: 'underline' }}
                >
                  <b>Contact Us</b>
                </a>
              </p>
              {/* add contact details */}
              <p>To demo this page, use:</p>
              <ul>Username: demo</ul>
              <ul>Password: demo123</ul>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default SignIn
