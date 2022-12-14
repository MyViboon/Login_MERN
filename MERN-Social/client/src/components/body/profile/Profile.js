import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCamera,
  faCheck,
  faTimes,
  faEdit,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { isLength, isMatch } from "../../utils/validation/Validation";
import {
  showErrMsg,
  showSccessMsg,
} from "../../utils/notification/Notification";
import {
  fetchAllUser,
  dispatchGetAllUsers,
} from "../../../redux/actions/usersAction";
import { Link } from "react-router-dom";

const initialState = {
  name: "",
  password: "",
  cf_password: "",
  err: "",
  success: "",
};
const Profile = () => {
  const auth = useSelector((state) => state.auth);
  const token = useSelector((state) => state.token);
  const users = useSelector((state) => state.users);
  const dispatch = useDispatch();

  const { user, isAdmin } = auth;
  const [data, setData] = useState(initialState);
  const [avatar, setAvatar] = useState(false);
  const [loading, setLoading] = useState(false);
  const [callback, setCallback] = useState(false);

useEffect(() => {
  if(isAdmin){
      fetchAllUser(token).then(res =>{
          dispatch(dispatchGetAllUsers(res))
      })
  }
},[token, isAdmin, dispatch, callback])

  const { name, password, cf_password, err, success } = data;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value, err: "", success: "" });
  };

  const changeAvatar = async (e) => {
    e.preventDefault();
    try {
      const file = e.target.files[0];
  
      if (!file)
        return setData({ ...data, err: "No files ware upload!", success: "" });

      if (file.size > 1024 * 1024)
        return setData({ ...data, err: "Size too large!", success: "" });

      if (file.type !== "image/jpeg" && file.type !== "image/png")
        return setData({
          ...data,
          err: "File format is incorrect.",
          success: "",
        });

      let formData = new FormData();
      formData.append("file", file);

      setLoading(true);
      const res = await axios.post("/api/upload_avatar", formData, {
        headers: {
          "context-type": "multipart/form-data",
          Authorization: token,
        },
      });

      setLoading(false);
      setAvatar(res.data.url);
    } catch (err) {
      setData({ ...data, err: err.response.data.msg, success: "" });
    }
  };

  const updateInfor = () => {
    try {
      axios.patch(
        "/user/update",
        {
          name: name ? name : user.name,
          avatar: avatar ? avatar : user.avatar,
        },
        {
          headers: { Authorization: token },
        }
      );

      setData({ ...data, err: "", success: "Update Success!" });
    } catch (err) {
      setData({ ...data, err: err.response.data.msg, success: "" });
    }
  };

  const updatePassword = () => {
    if (isLength(password))
      return setData({
        ...user,
        err: "Password must be 6 characters!.",
        success: "",
      });

    if (!isMatch(password, cf_password))
      return setData({ ...user, err: "Password did not match!", success: "" });

    try {
      axios.post(
        "/user/reset",
        { password },
        {
          headers: { Authorization: token },
        }
      );

      setData({ ...data, err: "", success: "Update Success!" });
    } catch (err) {
      setData({ ...data, err: err.response.data.msg, success: "" });
    }
  };

  const handleUpdate = () => {
    if (name || avatar) updateInfor();
    if (password) updatePassword();
  };

  const handleDelete = async (id) => {
    try {
      if(user.id !== id){
        if(window.confirm("Are you sure you want to delete this account?")){
          setLoading(true);
          await axios.delete(`/user/delete/${id}`, {
            headers: { Authorization: token },
          })
          setLoading(false);
          setCallback(!callback);
        }
      }
    } catch (err) {
      setData({ ...data, err: err.response.data.msg, success: "" });
    }
  }

  return (
    <>
      <div>
        {err && showErrMsg(err)}
        {success && showSccessMsg(success)}
        {loading && <h3>Loading.....</h3>}
      </div>
      <div className="profile_page">
        <div className="col-left">
          <h2>{isAdmin ? "Admin Profile" : "User Profile"} </h2>

          <div className="avatar">
            <img src={avatar ? avatar : user.avatar} alt="" />
            <span>
              <FontAwesomeIcon icon={faCamera} />
              <p>Change</p>
              <input
                type="file"
                name="file"
                id="file_up"
                onChange={changeAvatar}
              />
            </span>
          </div>

          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              name="name"
              id="name"
              placeholder="Your name"
              defaultValue={user.name}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="text"
              name="email"
              id="email"
              placeholder="Your email address"
              defaultValue={user.email}
              disabled
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">New Password</label>
            <input
              type="text"
              name="password"
              id="password"
              placeholder="Your password"
              value={password}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="cf_password">Confirm Password</label>
            <input
              type="text"
              name="cf_password"
              id="cf_password"
              placeholder="Your password"
              value={cf_password}
              onChange={handleChange}
            />
          </div>

          <div>
            <em style={{ color: "crimson" }}>
              * If you update your password here, you will not be able to login
              quickly using google and facebook.
            </em>
          </div>

          <button disabled={loading} onClick={handleUpdate}>
            Update
          </button>
        </div>

        <div className="col-right">
          <h2>{isAdmin ? "Users" : "My Order"}</h2>

          <div style={{ overflowX: "auto" }}>
            <table className="customers">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Admin</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id}>
                    <td>{user._id}</td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>
                      {user.role === 1 ? (
                        <i>
                          <FontAwesomeIcon
                            icon={faCheck}
                            className="faCheck"
                            title="Admin"
                          />
                        </i>
                      ) : (
                        <i>
                          <FontAwesomeIcon
                            icon={faTimes}
                            className="faTimes"
                            title="User"
                          />
                        </i>
                      )}
                    </td>
                    <td>
                      <Link to={`/edit_user/${user._id}`}>
                        <i>
                          <FontAwesomeIcon
                            icon={faEdit}
                            className="faEdit"
                            title="Edit"
                          />
                        </i>
                      </Link>
                      <i>
                        <FontAwesomeIcon
                          icon={faTrash}
                          className="faTrash"
                          title="Remove"
                          onClick={()=> handleDelete(user._id)}
                        />
                      </i>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
