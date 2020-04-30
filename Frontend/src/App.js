import React, { useState, useCallback, useEffect, Suspense } from 'react';
import './App.css';
import { BrowserRouter, Route } from 'react-router-dom'

import Navbar from './Layout/Navbar/Navbar';
import Landing from './Layout/Landing/Landing';
import { AuthContext } from './shared/util/auth-context';
import CircularProgress from '@material-ui/core/CircularProgress';
import { styles } from '@material-ui/pickers/views/Calendar/Calendar';


const Signup = React.lazy(() => import('./components/Signup/Signup'));
const Login = React.lazy(() => import('./components/Login/Login'));
const GoalPad = React.lazy(() => import('./components/GoalPad/GoalPad'));
const NewGoal = React.lazy(() => import('./components/GoalPad/NewGoal/NewGoal'));
const NotLoggedGoalPad = React.lazy(() => import('./components/GoalPad/NotLoggedGoalPad'));
const AboutPage = React.lazy(() => import('./components/AboutPage/AboutPage'));



function App() {

  const [token, setToken] = useState(false);
  const [userId, setUserId] = useState(false);

  const login = useCallback((uid, token) => {
    setToken(token);
    localStorage.setItem('userData', JSON.stringify({
      userId: uid, token: token, 
    }))
    setUserId(uid)
  }, [])

  const logout = useCallback(() => {
    setToken(null);
    setUserId(null);
    localStorage.removeItem('userData');
  }, [])

  useEffect (() => {
    const storedData = JSON.parse(localStorage.getItem('userData'))


    if(storedData && storedData.token){
      login(storedData.userId, storedData.token);
    }

  }, [login])

  return (
    <AuthContext.Provider value={ {isLoggedIn: !!token, token: token, login: login, logout: logout, userId: userId}}>
      <Suspense fallback={
        <section className="isLoading">
          <CircularProgress/> 
        </section>  
      }>
        <BrowserRouter>
          <div className="App">
            <Route exact path="/" component={Navbar} />
            <Route exact path="/" component={Landing} />
            <Route exact path="/signup" component={Signup} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/goalpad" component={GoalPad} />
            <Route exact path="/goalPad/newgoal" component={NewGoal} />
            <Route exact path="/goalpad/noUser" component={NotLoggedGoalPad} />
            <Route exact path="/about" component={()=>(<div><Navbar/><AboutPage/></div>)} />
          </div>
        </BrowserRouter>
      </Suspense>
    </AuthContext.Provider>  
  );
}

export default App;
