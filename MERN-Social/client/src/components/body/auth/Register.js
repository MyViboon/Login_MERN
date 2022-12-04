import React, { useState } from "react";
import { Link } from "react-router-dom";
import axiox from "axios";
import {showErrMsg,showSccessMsg} from '../../utils/notification/Notification'
import { isEmptry, isEmail, isLength, isMatch } from '../../utils/validation/Validation'

const initialState = {
    name:"",
    email: "",
    password: "",
    cf_password: "",
    err: "",
    success: "",
};

const Register = () => {
  const [user, setUser] = useState(initialState);

  const { name, email, password, cf_password, err, success } = user;
 
  const handleChangeInput = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value, err: "", success: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if(isEmptry(name) || isEmptry(password))
            return setUser({ ...user, err: "Please fill in all fields", success: "" })

    if(!isEmail(email))
        return setUser({ ...user, err: "Invalid Email.", success: "" })

    if(isLength(password))
        return setUser({ ...user, err: "Password must be 6 characters!.", success: "" })
        
    if(!isMatch(password, cf_password))
        return setUser({ ...user, err: "Password did not match!", success: "" })


    try {
        const res = await axiox.post('/user/register', {
            name, email, password
        })

        setUser({ ...user, err: '', success: res.data.msg })  

    } catch (err) {
      err.response.data.msg && setUser({ ...user, err: err.response.data.msg, success: "" })
    }
    
  };

  return (
    <div className="login_page">
      <h2>Register</h2>

      {err && showErrMsg(err)}
      {success && showSccessMsg(success)}

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Name</label>
          <input
            type="text"
            placeholder="Enter your name"
            value={name}
            name="name"
            onChange={handleChangeInput}
          ></input>
        </div>

        <div>
          <label htmlFor="email">Email Address</label>
          <input
            type="text"
            placeholder="Enter your email"
            value={email}
            name="email"
            onChange={handleChangeInput}
          ></input>
        </div>

        <div>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            placeholder="Enter your pasword"
            value={password}
            name="password"
            onChange={handleChangeInput}
          ></input>
        </div>

        <div>
          <label htmlFor="cf_password">Confirm Password</label>
          <input
            type="password"
            placeholder="Enter your pasword"
            value={cf_password}
            name="cf_password"
            onChange={handleChangeInput}
          ></input>
        </div>

        <div className="row">
          <button type="submit">Register</button>
          
        </div>
      </form>

      <p>Already an account? <Link to="/login">Login</Link></p>
      
    </div>
  );
};

export default Register;
