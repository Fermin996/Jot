import React, { useContext, useState } from 'react'
import styles from './Navbar.module.css'
import { Link } from 'react-router-dom'
import { AuthContext } from '../../shared/util/auth-context'
import MaterialIcon from '@material/react-material-icon';



 const Navbar = () => {

  const [drawerClicked, drawerClickedHandler] = useState(false)

  const auth = useContext(AuthContext)

  const logout = () => {
    auth.logout()
  }

  const drawerHandler = () => {
    
    if(drawerClicked === true){
      drawerClickedHandler(false)
    }else{
      drawerClickedHandler(true)
    }
  }

  let drawerClass = styles.sideDrawerContainer

  if(drawerClicked){
    drawerClass = `${styles.sideDrawerContainer} ${styles.sideDrawerOpen}`
  }else{
    drawerClass = styles.sideDrawerContainer
  }

  const sideDrawer = (
    <ul className={drawerClass}>
      <li>
        <MaterialIcon icon="house" style={{ fontSize:20}} />
        <Link to="/">
          Home
        </Link>
      </li>
      <li>
        <MaterialIcon icon="library_books" style={{ fontSize:20}} />
        <Link to="/goalpad/noUser">
          Goal Pad
        </Link>
      </li>
      <li>
        <MaterialIcon icon="more_horiz" style={{ fontSize:20}} />
        <Link to="/about">
          About
        </Link>
      </li>
    </ul>
  )

  const notLoggedNav = (
    <div className={styles.headFlex}>
      <Link to="/"><h1>Jot</h1></Link>
      <div 
        className={styles.responsiveIcon}
        onClick={drawerHandler}>
        <MaterialIcon icon="dehaze" style={{ fontSize:40}} />
      </div>
      <div className={styles.navLinks}> 
        <ul className={styles.constantNav}>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/goalpad/noUser">Goal Pad</Link></li>
          <li><Link to="/about">About</Link></li>
        </ul>
        <ul className={styles.notLoggedItems}>
          <Link to="/login"><li className={styles.login}>Log In</li></Link>
          <Link to="/signup"><li className={styles.join}>Join</li></Link>
        </ul>
      </div>
    </div>  
  )

  const loggedNav = (
    <div className={styles.headFlex}>
      <Link to="/"><h1>Jot</h1></Link>
      <div 
        className={styles.responsiveIcon}
        onClick={drawerHandler}>
        <MaterialIcon icon="dehaze" style={{ fontSize:40}} />
      </div>
      <div className={styles.navLinks}> 
        <ul className={styles.constantNav}>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/goalpad">Goal Pad</Link></li>
          <li><Link to="/about">About Us</Link></li>
        </ul>
        <ul className={styles.notLoggedItems}>
          <li className={styles.logoutButton} onClick={logout} >Logout</li>
        </ul>
      </div>
    </div>  
  )

  return (
    <>
      {auth.isLoggedIn ? loggedNav : notLoggedNav}
      {drawerClicked && sideDrawer}
    </>
  )
}

export default Navbar