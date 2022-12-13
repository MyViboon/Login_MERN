import React, { useState } from 'react'
import axios from 'axios'
import { useParams } from 'react-router-dom'
import { showErrMsg, showSccessMsg } from '../../utils/notification/Notification'
import { isLength, isMatch } from '../../utils/validation/Validation'


const initialState = {
    password: '',
    cf_password: '',
    err: '',
    success: ''
}

const ResetPassword = () => {
// console.log(useParams())
    const {token} = useParams()
    const [data, setData] = useState(initialState)

    const {password, cf_password, err, success } = data

    const handleChangInput = e => {
        const {name, value} = e.target
        setData({...data, [name]:value, err: '', success: ''})
    }

    const handleResetPassword = async () => {
        if(isLength(password))
            return setData({ ...data, err: "Password must be 6 characters!.", success: "" })
        if(!isMatch(password, cf_password))
            return setData({ ...data, err: "Password did not match!.", success: "" })

        try {
            const res = await axios.post('/user/reset', {password}, {
                headers: {Authorization: token}
            })

            setData({ ...data, err: "", success: res.data.msg })

        } catch (err) {
            err.response.data.msg && setData({ ...data, err: err.response.data.msg, success: "" })
        }
    }


  return (
    <div className="fg_pass">
      <h2>Reset Your Password?</h2>

      <div className="row">
        {err && showErrMsg(err)}
        {success && showSccessMsg(success)}

        <label htmlFor="password">Password </label>
        <input
          type="password"
          name="password"
          id="password"
          value={password}
          onChange={handleChangInput}
        />

        <label htmlFor="cf_password">Confirm Password </label>
        <input
          type="password"
          name="cf_password"
          id="cf_password"
          value={cf_password}
          onChange={handleChangInput}
        />

        <button onClick={handleResetPassword}>Reset password</button>
      </div>
    </div>
  )
}

export default ResetPassword