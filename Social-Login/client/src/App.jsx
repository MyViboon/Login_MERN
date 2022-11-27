import Navbar from "./components/Navbar";
import "./App.css";
import Home from "./pages/Home";
import Post from "./pages/Post";
import Login from "./pages/Login";
import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const getUser = () => {
      axios
        .get("http://localhost:000/auth/login/success")
        .then((response) => {
          if (response.status === 200) return response.json();
          throw new Error("authentication has been failed!");
        })
        .then((resObject) => {
          setUser(resObject.user);
        })
        .catch((err) => {
          console.log(err);
        });
    };
    getUser();
  }, []);

  return (
    <div>
      <Navbar user={user} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
        <Route
          path="/post/:id"
          element={user ? <Post /> : <Navigate to="/login" />}
        />
      </Routes>
    </div>
  );
}

export default App;
