import React from 'react'
import { useSelector } from 'react-redux'
import {Routes, Route} from 'react-router-dom'
import ActivationEmail from './auth/ActivationEmail'
import Login from './auth/Login'
import Register from './auth/Register'
import Notfound from '../utils/NotFound/Notfound'
import ForgotPassword from './auth/ForgotPassword'
import ResetPassword from './auth/ResetPassword'
import Profile from './profile/Profile'
import EditUser from './profile/EditUser'
import Home from './home/Home'

const Body = () => {

  const auth = useSelector(state => state.auth)
  const {isLogged, isAdmin } = auth
  return (
    <section>
      <Routes>
        <Route path='/' element={<Home/>} exact/>

        <Route path='/login' element={isLogged ? <Notfound/> : <Login/>}/>
        <Route path='/register' element={isLogged ? <Notfound/> : <Register/>}/>

        <Route path='/forgot_password' element={isLogged ? <Notfound/> : <ForgotPassword/>}/>
        <Route path='/user/reset/:token' element={isLogged ? <Notfound/> : <ResetPassword/>}/>

        <Route path='/user/activate/:activation_token' element={<ActivationEmail/>}/>

        <Route path='/profile' element={isLogged ? <Profile/> : <Notfound/> }/>
        <Route path='/edit_user/:id' element={isAdmin ? <EditUser/> : <Notfound/> }/>

      </Routes>
    </section>
  )
}

export default Body