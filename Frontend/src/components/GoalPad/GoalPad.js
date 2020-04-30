import React, { useState, useReducer, useEffect, useContext } from 'react'
import styles from './GoalPad.module.css';

import axios from 'axios'
import { Link } from 'react-router-dom';

import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import MaterialIcon from '@material/react-material-icon';
import Zoom from 'react-reveal/Zoom';

import EditGoal from './EditGoal/EditGoal'
import NewGoal from './NewGoal/NewGoal'

import { AuthContext } from '../../shared/util/auth-context'


const goalReducer = (state, action) => {
  switch(action.type){
    case "ADD GOAL":
      return {
        ...state,
        goals:[
          ...state.goals,
          action.value
        ]
      }
    case "GOAL RESET":
      return{
        goals:[]
      }  
    default:
      return state  
  } 
}

 const GoalPad = () => {

  const auth = useContext(AuthContext)

  const [goalsState, dispatch] = useReducer(goalReducer, {
    goals: []
  });

  const [completedGoalView, setCompletedGoalView] = useState(false);
  const [editGoalData, editGoalDataHandler] = useState();
  const [initiated, initiatedIsTrue] = useState(false);
  const [submitted, submittedIsTrue] = useState();
  const [updated, callUpdate] = useState(0);

  function handleUpdate(){
    callUpdate(updated+1)
  }
  
  function onDelete(gId){
    axios.delete(`${process.env.REACT_APP_BACKEND_URL}/goals/${gId}`, {
      headers:{ 
        'Content-type':'application/json',
        'Authorization': `Bearer: ${auth.token}` 
      } 
    })
      .then(res => {
        callUpdate(updated+1)
      })
      .catch( err => {
        console.log(err)
      })
  }

  function onCompleted(gId){
    axios.patch(`${process.env.REACT_APP_BACKEND_URL}/goals/completed/${gId}`, {
      headers:{ 
        'Content-type':'application/json',
        'Authorization': `Bearer: ${auth.token}` 
      } 
    })
      .then(res => {
        callUpdate(updated+1)  
      })
      .catch(err => {
        console.log(err)
      })
  }

  function onEdit(gId){

    axios.get(`${process.env.REACT_APP_BACKEND_URL}/goals/${gId}`, {
      headers:{ 
        'Content-type':'application/json',
        'Authorization': `Bearer: ${auth.token}` } 
    })
      .then(res => {
        editGoalDataHandler(res.data)
        initiatedIsTrue(true)        
      })
      .catch(err => {
        console.log(err)
      })
  }

  useEffect(() => { 

      if(updated){
        dispatch({
          type:"GOAL RESET"
        });
        submittedIsTrue(false)
      }
    
      axios.get(`${process.env.REACT_APP_BACKEND_URL}/goals/myGoals/${auth.userId}`, {
        headers:{ 
          'Content-type':'application/json',
          'Authorization': `Bearer: ${auth.token}` } 
      })
      .then(goals => {
        

        goals.data.forEach(object => {
          dispatch({
            type: "ADD GOAL",
            value: Object.values(object)
          })
        })
      })
      .catch(err => {
        console.log(err) 
      })
    
  }, [updated, initiatedIsTrue, auth.userId, auth.token])

  

  const goalEdit = (
    <>
      <EditGoal goalData={editGoalData} initializedStateHandler={initiated} cancel={() =>initiatedIsTrue(false)} onUpdate={handleUpdate} />    
    </>
  )


  const goalFunctions =(gId)=> (
    <div className={styles.goalButtons}>
      {initiated && goalEdit}
      <button className={styles.editButton} onClick={() => onEdit(gId)}>Edit</button>
      <button className={styles.editButton} onClick={() => onDelete(gId)}>Delete</button>
      <button className={styles.completeButton} onClick={()=> onCompleted(gId)} >Completed</button>
    </div>
  )

  const newGoalDiv = (
    <>
      <Zoom>    
        <NewGoal updatedIsTrue={updated} onUpdate={handleUpdate} cancelSubmitted={()=> submittedIsTrue(false)}/>
      </Zoom>  
    </>  
  )

  function completedClassClicked(){
    setCompletedGoalView(true); 
    submittedIsTrue(false);
  }

  let completedClass = styles.goalTypes
  let currentClass = styles.goalTypes

  if(!completedGoalView){
    completedClass = styles.goalTypes;
    currentClass = `${styles.goalTypes} ${styles.goalView}`
  }else if(completedGoalView){
    currentClass = styles.goalTypes;
    completedClass = `${styles.goalTypes} ${styles.goalView}`
  }


  return (
    <div className={styles.padBackDiv}>
      <h2 className={styles.goalPageHeader}>
        <Link to="/">Jot</Link>      
      </h2>
      <div className={styles.goalPadDiv}>
       <div className={styles.padItemDiv}> 
          <div className={styles.headAndOptions}>
            <h2 className={styles.goalPadHead}>Goal Pad</h2>
            <div className={styles.padOptions}>
              <h3 className={currentClass} onClick={() => setCompletedGoalView(false)}>Current</h3>
              <h3 className={completedClass} onClick={() => completedClassClicked()}>Completed </h3>
            </div>
          </div>          

          <div className={styles.goalContainer}>
            {goalsState.goals.map((goal, index) => {

              let hours = 1000 * 60 * 60; 
              let today = new Date();
              let startToDueHours = Math.round(Date.parse(goal[6]) - Date.parse(goal[5])) / hours;
              let todayToDueHours = Math.round(Date.parse(goal[6]) - today.getTime()) / hours;
              let projectedProgressValue = todayToDueHours/startToDueHours * 100;

              let progress = styles.noProgress

              if(todayToDueHours < 24){
                progress = styles.redProgress
              }else if(projectedProgressValue.toFixed(0) < 20){
                progress = styles.noProgress
              }else if(projectedProgressValue.toFixed(0) < 40){
                progress = styles.yellowProgress
              }else if(projectedProgressValue.toFixed(0) < 80){
                progress = styles.redProgress
              }

              if(goal[0] === completedGoalView){
                return(
                <ExpansionPanel key={index}>
                  <ExpansionPanelSummary 
                    className={styles.panel}
                    expandIcon={<MaterialIcon icon="expand_more" style={{ fontSize:20}} />}>
                    <Typography>
                      <span className={styles.goalDescriptionBox}>
                        <span className={!completedGoalView ? progress : undefined}>
                          {goal[2]}                        
                        </span>
                        <span className={styles.dueDateP}>
                          {!completedGoalView && 'Due: ' + goal[6][5] + goal[6][6] + goal[6][7] + goal[6][8] + goal[6][9]}
                        </span> 
                      </span>                      
                    </Typography>
                  </ExpansionPanelSummary>
                  <ExpansionPanelDetails>
                      <Typography>                      
                        {goal[3]}
                      </Typography>            
                    </ExpansionPanelDetails>
                    {!completedGoalView && (
                      <ExpansionPanelDetails>
                          {goalFunctions(goal[1])}          
                      </ExpansionPanelDetails>
                    )}
                </ExpansionPanel>
                )
              }
            })}
          </div>

          {!completedGoalView && !submitted && <p className={styles.newGoalButton} onClick={() => submittedIsTrue(true)}>+ Create New Goal</p>}

          {submitted && newGoalDiv}
        </div>
      </div>
    </div>
  )
}

export default GoalPad
