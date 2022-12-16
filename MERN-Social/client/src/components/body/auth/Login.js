import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiox from "axios";
import {
  showErrMsg,
  showSccessMsg,
} from "../../utils/notification/Notification";
import { dispatchLogin } from "../../../redux/actions/authAction";
import { useDispatch } from "react-redux";
// import { GoogleLogin } from "react-google-login";
// import { gapi } from "gapi-script";
import jwt_decode from "jwt-decode"

const initialState = {
  email: "",
  password: "",
  err: "",
  success: "",
};

const Login = () => {
  const [user, setUser] = useState(initialState);

  const { email, password, err, success } = user;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const clientID =
    "768817129404-17dnvi7bg1deleuto56aii38p9ksttkm.apps.googleusercontent.com";

  // useEffect(() => {
  //   const initClient = () => {
  //     gapi.client.init({
  //       clientId: clientID,
  //       scope: "",
  //     });
  //   };
  //   gapi.load("client:auth2", initClient);
  // }, []);

  const handleCallbackResponse = async (response) => {
    let userObject = jwt_decode(response.credential)
    console.log(userObject);
    try {
      const res = await axiox.post("user/login_google", {
        tokenId: jwt_decode(response.credential),
      });

      setUser({ ...user, err: "", success: res.data.msg });
      localStorage.setItem("firstLogin", true);

      dispatch(dispatchLogin());
      navigate("/");
    } catch (err) {
      err.response.data.msg &&
        setUser({ ...user, err: err.response.data.msg, success: "" });
    }
  };

  useEffect(() => {
    /* global google */
    google.accounts.id.initialize({
      client_id: clientID,
      callback: handleCallbackResponse,
    });

    google.accounts.id.renderButton(document.getElementById("signinDiv"), {
      theme: "filled_blue",
      size: "medium",
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // const responseGoogle = async (response) => {
  //   console.log("success", response);
  //   try {
  //     const res = await axiox.post("user/login_google", {
  //       tokenId: response.tokenId,
  //     });

  //     setUser({ ...user, err: "", success: res.data.msg });
  //     localStorage.setItem("firstLogin", true);

  //     dispatch(dispatchLogin());
  //     navigate("/");
  //   } catch (err) {
  //     err.response.data.msg &&
  //       setUser({ ...user, err: err.response.data.msg, success: "" });
  //   }
  // };

  const handleChangeInput = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value, err: "", success: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axiox.post("/user/login", { email, password });
      setUser({ ...user, err: "", success: res.data.msg });

      localStorage.setItem("firstLogin", true);

      dispatch(dispatchLogin());
      navigate("/");
    } catch (err) {
      err.response.data.msg &&
        setUser({ ...user, err: err.response.data.msg, success: "" });
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

      <div className="hr">Or Login With</div>

      {/* <div className="social">
        <GoogleLogin
          clientId={clientID}
          buttonText="Login wtih google"
          onSuccess={handleCallbackResponse}
          cookiePolicy={"single_host_origin"}
          isSignedIn={false}
        />
        ,
      </div> */}
      <div id="signinDiv"></div>

      <p>
        New Customer? <Link to="/register">Register</Link>
      </p>
    </div>
  );
};

export default Login;
