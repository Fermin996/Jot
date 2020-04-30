import React from 'react'
import styles from './GoalPad.module.css'
import { Link } from 'react-router-dom'

const NotLoggedGoalPad = () => { 
  return (
    <div className={styles.padBackDiv}>
      <h2 className={styles.goalPageHeader}>
        <Link to="/">Jot</Link>      
      </h2>
      <div className={styles.goalPadDiv}>
       <div className={styles.padItemDiv}> 
          <div className={styles.headAndOptions}>
            <h2 className={styles.goalPadHead}>Goal Pad</h2>
          </div>          

          <div className={styles.notLoggedPadDiv}> 
            <p className={styles.notLoggedDivP}>Log in to begin tracking your goals</p>

            <div className={styles.notLoggedPadButtons}>
              <Link to="/login"><p>Log In</p></Link>
              <Link to="/signup"><p>Sign Up</p></Link>
            </div>
            
          </div>
        
        </div>
      </div>
    </div>
  )
}

export default NotLoggedGoalPad