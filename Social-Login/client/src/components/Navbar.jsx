import React from "react";
import { Link } from "react-router-dom";

const Navbar = ({ user }) => {

  const logout =()=> {
    window.open("http://localhost:5000/auth/google", "_self");
  }
  return (
    <div className="navbar">
      <span className="logo">
        <Link className="link" to="/">
          Viboon App
        </Link>
      </span>
      {user ? (
        <ul className="list">
          <li className="listItem">
            <img
              src="https://cdn.pixabay.com/photo/2016/03/23/04/01/woman-1274056_960_720.jpg"
              alt=""
              className="avatar"
            />
          </li>
          <li className="listItem">John Doe</li>
          <li className="listItem" onClick={logout}>Logout</li>
        </ul>
      ) : (
        <Link className="link" to="/login">Login</Link>
      )}
    </div>
  );
};

export default Navbar;
