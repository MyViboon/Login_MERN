import React, { useState } from "react";
import { Link, useNavigate,  } from "react-router-dom";
import axiox from "axios";
import {showErrMsg,showSccessMsg} from '../../utils/notification/Notification'
import {dispatchLogin} from '../../../redux/actions/authAction'
import { useDispatch } from "react-redux";

const initialState = {
  email: "",
  password: "",
  err: "",
  success: "",
};

const Login = () => {
  const [user, setUser] = useState(initialState);

  const { email, password, err, success } = user;
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleChangeInput = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value, err: "", success: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axiox.post('/user/login', {email,password})
      setUser({ ...user, err: "", success: res.data.msg })

      localStorage.setItem('firstLogin', true)

      dispatch(dispatchLogin())
      navigate('/')

    } catch (err) {
      err.response.data.msg && setUser({ ...user, err: err.response.data.msg, success: "" })
    }
    
  };

  return (
    <div className="login_page">
      <h2>Login</h2>

      {err && showErrMsg(err)}
      {success && showSccessMsg(success)}

      <form onSubmit={handleSubmit}>
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

        <div className="row">
          <button type="submit">Login</button>
          <Link to="/forgot_password">Forgot your password?</Link>
        </div>
      </form>

      <p>New Customer? <Link to="/register">Register</Link></p>

    </div>
  );
};

export default Login;
