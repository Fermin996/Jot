import React, { useReducer, useState } from 'react';
import styles from './Signup.module.css';
import CircularProgress from '@material-ui/core/CircularProgress';

import { Link } from 'react-router-dom';
import axios from 'axios';


const signupReducer = (state, action) => {
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
      };
    default:
      return state;
  }
}



const Signup = (props) => {

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState({});

  const [inputState, dispatch] = useReducer(signupReducer, {
    inputs:{
      name: {
        value: '',
      },
      email: {
        value: '',
      },        
      password: {
        value: '',
      }, 
    }
  });

  const onSubmit = (e) => {
    e.preventDefault();

    setIsLoading(true);

    const newUser = {
      name: inputState.inputs.name.value,
      email: inputState.inputs.email.value,
      password: inputState.inputs.password.value,
    }

    axios.post(process.env.REACT_APP_BACKEND_URL + '/users/signup', newUser)
    .then(res => {
      setIsLoading(false);
      props.history.push('/login')
    })
    .catch(err => {
      setError(err.response.data)
      setIsLoading(false);
    })

  }

  const onChange = (e) => {

    setError({})

    dispatch({
      type: 'CHANGE', 
      value: e.target.value,
      inputId: e.target.name,
    });
    
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
          <h2 className={styles.signFont}>Sign Up</h2>
          <div className={styles.inputDiv}>
            <label>Full Name</label>
            <input 
              className={`${error.name && styles.invalidInput}`}
              type="text" 
              name="name" 
              onChange={onChange} />
              {error.name && <p className={styles.errorText}>{error.name}</p> }
          </div>
          <div className={styles.inputDiv}>
            <label>Email</label>
            <input 
              className={`${error.email && styles.invalidInput}`}
              type="email" 
              name="email" 
              onChange={onChange} />
              {error.email && <p className={styles.errorText}>{error.email}</p> }
          </div>
          <div className={styles.inputDiv}>
            <label>Password</label>
            <input 
              className={`${error.password && styles.invalidInput}`}
              type="password" 
              name="password" 
              autoComplete="off"
              onChange={onChange} />
              {error.password && <p className={styles.errorText}>{error.password}</p> }
          </div>
          <button type="submit" className={styles.submitButton} >Create account</button>
        </form>
      </div>  
    </section>  
  )
}

export default Signup