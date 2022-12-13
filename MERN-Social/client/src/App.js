// import { Routes } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import axios from "axios";
import { dispatchLogin, fetchUser, dispatchGetUser } from "./redux/actions/authAction";

import Body from "./components/body/Body";
import Headers from "./components/header/Headers";

function App() {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.token);
  const auth = useSelector((state) => state.auth);

  useEffect(() => {
    const firstLogin = localStorage.getItem("firstLogin");
    if (firstLogin) {
      const getToken = async () => {
        const res = await axios.post("/user/refresh_token", null);
        console.log(res);
        // dispatch({ type: "GET_TOKEN", payload: res.data.access_token });
        dispatch({ type: "GET_TOKEN", payload: res.data.access_token });
      };
      getToken();
    }
  }, [auth.isLogged, dispatch]);

  useEffect(() => {
    if(token){
      const getUer = () => {
        dispatch(dispatchLogin())
    
        return fetchUser(token).then(res=> {
          dispatch(dispatchGetUser(res))
        })
      }
      getUer()
    }
  }, [token, dispatch]);

  return (
    <BrowserRouter>
      <div className="App">
        <Headers />
        <Body />
      </div>
    </BrowserRouter>
  );
}

export default App;
