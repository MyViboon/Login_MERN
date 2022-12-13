import React, { useState } from "react";
import axios from "axios";
import { isEmail } from "../../utils/validation/Validation";
import {
  showErrMsg,
  showSccessMsg,
} from "../../utils/notification/Notification";

const initialState = {
  email: "",
  err: "",
  success: "",
};

const ForgotPassword = () => {
  const [data, setData] = useState(initialState);

  const { email, err, success } = data;

    const handleChangInput = e => {
        const {name, value} = e.target
        setData({...data, [name]:value, err: '', success: ''})
    }

    const forgotPassword = async () => {
        if(!isEmail(email))
            return setData({...data, err: 'Invalid emails', success: ''})
        try {
            const res = await axios.post('/user/forgot', {email})

            return setData({...data, err: '', success: res.data.msg})
        } catch (err) {
            err.response.data.msg &&  setData({...data, err: err.response.data.msg, success: ''})
        }
    }

  return (
    <div className="fg_pass">
      <h2>Forgot Your Password?</h2>

      <div className="row">
        {err && showErrMsg(err)}
        {success && showSccessMsg(success)}

        <label htmlFor="email">Enter Your Email address</label>
        <input
          type="email"
          name="email"
          id="email"
          value={email}
          onChange={handleChangInput}
        />
        <button onClick={forgotPassword}>Verify Your Email</button>
      </div>
    </div>
  );
};

export default ForgotPassword;
