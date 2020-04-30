import React, { useState, useReducer, useContext } from 'react';
import styles from './NewGoal.module.css'
import axios from 'axios';

import { MuiPickersUtilsProvider, DatePicker } from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';
import { AuthContext } from '../../../shared/util/auth-context';

const newGoalReducer = (state, action) => {
  switch (action.type ){
    case "NEW GOAL":
      return{
        ...state,
        inputs: {
          ...state.inputs,
          [action.inputId]: { 
            value: action.value
          }
        }
      };
    default:
      return state;  
  }
}

const NewGoal = (props) => {
  const auth = useContext(AuthContext)

  const [selectedEndDate, handleEndDateChange] = useState()
  const [error, setError] = useState()

  const [inputState, dispatch] = useReducer(newGoalReducer, {
    inputs:{
      title: {
        value: '',
      },
      description: {
        value: '',
      },        
      startDate: {
        value: Date(),
      },
      dueDate: {
        value:''
      },
      user: '',
    }
  });
  
  let currentUser = auth.userId

  const onSubmit =(e)=> {
    e.preventDefault();

    if(!selectedEndDate){
      return setError('Due Date Required')
    }

    if(Date.parse(selectedEndDate) < Date.parse(Date())){
      return setError('Invalid Date')
    }

    const newGoal = {
      title: inputState.inputs.title.value,
      description: inputState.inputs.description.value,
      user: currentUser,
      startDate: Date(),
      dueDate: selectedEndDate
    }

    axios.post(process.env.REACT_APP_BACKEND_URL + '/goals/newGoal', newGoal, {
      headers:{ 
        'Content-type':'application/json',
        'Authorization': `Bearer: ${auth.token}` 
      } 
    })
      .then(res => {
        props.onUpdate()
      })
      .catch(err => {
        console.log(err)
      })

  }

  const onChange = (e) => {
    dispatch({
      type: "NEW GOAL",
      value: e.target.value,
      inputId: e.target.name
    })
  }

  return (
    <MuiPickersUtilsProvider utils={MomentUtils}>
      <div className={styles.goalBackDiv}>
        <div className={styles.goalPadDiv}>
          <form onSubmit={onSubmit} className={styles.padItemDiv}>
            <div className={styles.newGoalInput}>
              <label htmlFor="title">Goal Title</label>
              <input 
                type="text" 
                id="title" 
                onChange={onChange} 
                name="title"></input>
            </div>
            <div className={styles.newGoalInput}>
              <label>Description</label>
              <textarea 
                onChange={onChange} 
                name="description" 
                rows="3"></textarea>
            </div>
            <div className={styles.datesContainer}>
              <div className={styles.newGoalInput}>
                <label>Due Date</label>
                <DatePicker 
                  variant={"inline"} 
                  disableToolbar
                  name="dueDate"
                  value={selectedEndDate} 
                  onChange={handleEndDateChange} />
                  {error && <p className={styles.errorText}>{error}</p> }
              </div>
            </div> 
            <div className={styles.subFlex}>
              <button type="submit" className={styles.submitButton}>Submit</button>
              <button type="reset" onClick={props.cancelSubmitted} className={styles.submitButton}>Cancel</button>              
            </div> 
          </form>
        </div> 
      </div>
    </MuiPickersUtilsProvider>  
  )
}

export default NewGoal