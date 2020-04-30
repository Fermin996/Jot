import React from 'react'
import styles from './AboutPage.module.css'

const AboutPage = () => {
  return (
    <div className={styles.aboutPageDiv}>
      <div className={styles.aboutTextDiv}>
        <h4>Still not Convinced?</h4>
        <p>The need for individuals and teams to set goals cannot be stressed enough. 
          A look at facts is enough to convince anyone that these practices should be <b>mandatory</b> in the work place 
          and are indispensable for those with any amount of personal ambition. 
        </p>

        <p>
          One study showed that those who wrote down challenging and specific goals 
          improved their performance 90% of the time. <br/>
          source: <a href="https://psycnet.apa.org/record/1981-27276-001">https://psycnet.apa.org/record/1981-27276-001</a>
        </p>

        <p>
          Another study observed that teams with specific and difficult goals assigned
          yielded considerably higher group performance than those who set goals poorly. <br/>
          source: <a href="https://psycnet.apa.org/buy/2011-14077-001">https://psycnet.apa.org/buy/2011-14077-001</a>
        </p>
      </div>
    </div>  
  )
}

export default AboutPage