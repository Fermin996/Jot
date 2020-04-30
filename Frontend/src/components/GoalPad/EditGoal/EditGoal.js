import React, { useReducer, useContext } from 'react';
import styles from './EditGoal.module.css';
import axios from 'axios';

import { AuthContext } from '../../../shared/util/auth-context'

import Modal from '@material-ui/core/Modal';

const editGoalReducer = (state, action) => {
  switch(action.type){
    case "EDIT GOAL":
      return{
        ...state,
        inputs:{
          ...state.inputs,
          [action.inputId]: { 
            value: action.value, 
          }
        }
      };
      default:
        return state;
  }
}


const EditGoal = (props) => {

  const auth = useContext(AuthContext)

  const [changingGoalState, dispatch] = useReducer(editGoalReducer, {
    inputs:{
      title: {
        value: props.goalData.title
      },
      description:{
        value: props.goalData.description
      }
    }
  });


  const changingData = (e) => {

    dispatch({
      type: "EDIT GOAL",
      value: e.target.value,
      inputId: e.target.name
    })

  }

  const updateGoal = (e) => {
    e.preventDefault()

    const newFields = {
      title: changingGoalState.inputs.title.value,
      description: changingGoalState.inputs.description.value
    }

    axios.patch(`${process.env.REACT_APP_BACKEND_URL}/goals/${props.goalData._id}`, newFields, {
      headers:{ 
        'Content-type':'application/json',
        'Authorization': `Bearer: ${auth.token}` 
      } 
    })
      .then( 
        props.cancel,
        props.onUpdate()
      )
      .catch(err => {
        console.log(err)
      })

  }

  return (
    <Modal
      open={props.initializedStateHandler}
    >
      <div className={styles.editGoal}>
        <h3>Edit Goal</h3>
        <form onSubmit={updateGoal}>
          <div className={styles.editInputDivs}>
            <label className={styles.modalLabels}>Title</label>
            <input 
              className={styles.modalText}
              type="text" 
              name="title"
              value={changingGoalState.inputs.title.value}
              onChange={changingData}
              />
          </div>
          <div className={styles.editInputDivs}>
            <label className={styles.modalLabels}>Description</label>
            <textarea
              className={styles.modalTextArea}
              rows="3"
              name="description"  
              value={changingGoalState.inputs.description.value}
              onChange={changingData}
              />
          </div>
          <div className={styles.modalButtons}>
            <button type="submit" className={styles.modalButton}>Update</button>
            <button className={styles.modalButton} onClick={props.cancel}>Cancel</button>
          </div>
        </form>
      </div>
    </Modal>
  )
}

export default EditGoal;
