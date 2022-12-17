import React from "react";
import { Link } from "react-router-dom";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faCartShopping, faUser , faAngleDown} from '@fortawesome/free-solid-svg-icons'
import { useSelector } from "react-redux";
import axios from "axios";
// import axios from "axios";


const Headers = () => {

const auth = useSelector(state => state.auth)
const {user, isLogged} = auth

const handleLogout = async () => {
  try {
    await axios.get('/user/logout')
    localStorage.removeItem('firstLogin')
    window.location.href = "/"
  } catch (err) {
    window.location.href = "/"
  }
}

const userLink = () => {
  return <li className="drop-nav">
    <Link to="#" className="avatar">
      <img src={user.avatar} alt='' referrerPolicy="no-referrer"/> {user.name} <FontAwesomeIcon icon={faAngleDown}/>
    </Link>
    <ul className="dropdown">
       <li><Link to='/profile'>Profile</Link></li>
       <li><Link to='/' onClick={handleLogout}>Logut</Link></li>
    </ul>
  </li>
}

const transform = {
  transform: isLogged ? "translateY(-3px)" : 0
}

  return (
    <header>
      <h1><Link to='/'>Viboon⚝DEV</Link></h1>
      <ul style={transform}>
        <li><Link to='/'><FontAwesomeIcon icon={faCartShopping} />Cart</Link></li>
        {
          isLogged
          ?userLink()
          :<li><Link to='/login'><FontAwesomeIcon icon={faUser} />Sign in</Link></li>
        }
        
      </ul>
    </header>)
};

export default Headers;
