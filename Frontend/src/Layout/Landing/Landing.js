import React, { useContext } from 'react';
import styles from './Landing.module.css';
import MaterialIcon from '@material/react-material-icon';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../shared/util/auth-context'

 const Landing = () => {

  const auth = useContext(AuthContext)

  let buttonText

  if(auth.isLoggedIn){
    buttonText = (
      <Link to="/goalpad" className={styles.landButton}>Get Started</Link>
    )
  }else{
    buttonText = (
      <Link to="/signup" className={styles.landButton}>Sign up</Link>
    )
  }

  return (
    <>
      <section className={styles.landingPrimary}>
        <div className={styles.landingPrimaryCard}>
          <h2>Hold Yourself Accountable</h2>
          <p>Progress tracker for those who want to make the most of their time.</p>
        </div>
          {buttonText}
      </section>
      <section className={styles.landingSecondary}>
        <div className={styles.landingSecondaryCard}>
          <MaterialIcon icon="group_work" style={{ fontSize:100}} />
          <p className={styles.secondaryCardText}>
            Get the upper hand against competition. Great for setting group and individual goals
          </p>
        </div>
        <div className={styles.landingSecondaryCard}>
          <MaterialIcon icon="calendar_today" style={{ fontSize:100}}/>
          <p className={styles.secondaryCardText}>
            Have expected goals scheduled to your goal pad. Track progress and make sure you are on target.
          </p>
        </div>
        <div className={styles.landingSecondaryCard}>
          <MaterialIcon icon="check_circle" style={{ fontSize:100}}/>
          <p className={styles.secondaryCardText}>
            Write down daily tasks, conquer short and long term objectives
          </p>
        </div>
      </section>
      <section className={styles.landingTertiary}>
        <h3>Improve Your Results</h3>
        <p>Research has shown that those who <b>write down</b> their goals and practice accountability have up to <b>30% increase</b> in achieving goals compared with those who do not.</p>
      </section>
    </>
  )
}

export default Landing
