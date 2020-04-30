import React, { useReducer, useState, useContext } from 'react'
import styles from '../Signup/Signup.module.css'
import CircularProgress from '@material-ui/core/CircularProgress';
import axios from 'axios'
import { AuthContext } from '../../shared/util/auth-context'
import { Link } from 'react-router-dom';

const loginReducer = (state, action) => {
  switch(action.type){
    case "CHANGE":
      return{
        ...state,
        inputs: {
          ...state.inputs,
          [action.inputId]: { 
            value: action.value,
            isValid: true,
          }
        }
      } 
      default: 
      return state  
  };
}

const Login = (props) => {

  const auth = useContext(AuthContext)

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState({});

  const [inputState, dispatch] = useReducer(loginReducer, {
    inputs:{
      name: {
        value:'fill'
      },
      email: {
        value: ''
      },        
      password: {
        value: ''
      }, 
    }
  });

  const onChange = (e) => {

    setError({})

    dispatch({
      type: 'CHANGE', 
      value: e.target.value,
      inputId: e.target.name
    })
  }

  const onSubmit = (e) => {
    e.preventDefault();

    setIsLoading(true)

    const loggedUser = {
      name: 'fill',
      email: inputState.inputs.email.value,
      password: inputState.inputs.password.value,
    }

    axios.post(process.env.REACT_APP_BACKEND_URL + '/users/login', loggedUser)
    .then(res => {
      auth.login(res.data.userId, res.data.token)
      setIsLoading(false)
      props.history.push('/goalpad')
    })
    .catch(err => {
      console.log(err)
      setError(err.response.data)
      setIsLoading(false)
    })

  }

  return (
    <section className={styles.formBackground}>
      <Link to="/">
        <h2 className={styles.signupHeader}>Jot</h2>
      </Link>
      {isLoading && (
        <section className={styles.loadBack}>
          <CircularProgress className={styles.isLoading}/> 
        </section>  
        )}
      <div className={styles.formContainer}>
        <form onSubmit={onSubmit}>
          <h2 className={styles.signFont}>Login</h2>
          <div className={styles.inputDiv}>
            <label>Email</label>
            <input 
              type="email" 
              className={`${error.email && styles.invalidInput}`}
              onChange={onChange}
              name="email"
              />
              {error.email && <p className={styles.errorText}>{error.email}</p> }
          </div>
          <div className={styles.inputDiv}>
            <label>Password</label>
            <input 
              type="password"
              autoComplete="off" 
              className={`${error.password && styles.invalidInput}`}
              onChange={onChange}
              name="password"
              />
              {error.password && <p className={styles.errorText}>{error.password}</p> }
          </div>
          <button type="submit" className={styles.submitButton} >Log in</button>
        </form>
      </div>  
    </section>  
  )
}
export default Login