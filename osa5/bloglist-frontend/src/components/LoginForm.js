import PropTypes from 'prop-types'

const LoginForm = ({ username, password, handleLogin, handleUsernameChange, handlePasswordChange }) => {
  return (
    <div>
      <h2>Log in to application</h2>

      <form onSubmit={handleLogin}>
        <div>
            username
          <input
            id='loginusername'
            type='text'
            value={username}
            name='Username'
            onChange={handleUsernameChange}
          />
        </div>
        <div>
            password
          <input
            id='loginpassword'
            type='password'
            value={password}
            name='Password'
            onChange={handlePasswordChange}
          />
        </div>
        <button id='loginbutton' type='submit'>login</button>
      </form>
    </div>
  )
}

LoginForm.propTypes = {
  handleLogin: PropTypes.func.isRequired,
  handleUsernameChange: PropTypes.func.isRequired,
  handlePasswordChange: PropTypes.func.isRequired,
  username: PropTypes.string.isRequired,
  password: PropTypes.string.isRequired
}

export default LoginForm