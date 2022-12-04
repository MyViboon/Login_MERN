import React from "react";
import { Link } from "react-router-dom";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faCartShopping, faUser} from '@fortawesome/free-solid-svg-icons'


const Headers = () => {
  return <header>
    <h1><Link to='/'>Viboon⚝DEV</Link></h1>
    <ul>
      <li><Link to='/'><FontAwesomeIcon icon={faCartShopping} />Cart</Link></li>
      <li><Link to='/login'><FontAwesomeIcon icon={faUser} />Sign in</Link></li>
    </ul>
  </header>;
};

export default Headers;
