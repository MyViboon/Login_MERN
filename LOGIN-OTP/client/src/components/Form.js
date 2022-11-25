import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import queryString from "query-string";
import axios from "axios";

const Form = () => {
  const baseUrl = "http://localhost:8000/api/user";

  const location = useLocation();
  const navigate = useNavigate();
  const [inValidUser, setInValidUser] = useState("");
  const [busy, setBusy] = useState(true);
  const [error, setError] = useState("");
  const [success, setSucess] = useState(false);
  const [newPassword, setNewPassword] = useState({
    password: "",
    confirmPassword: "",
  });

  const { token, id } = queryString.parse(location.search);

  const verifyToken = async () => {
    //การค้นหา token ที่ถูกต้อง
    try {
      const { data } = await axios(
        `${baseUrl}/verify-token?token=${token}&id=${id}`
      );
      setBusy(false);
    } catch (error) {
      if (error?.response?.data) {
        const { data } = error.response;
        if (!data.success) return setInValidUser(data.error);
        return console.log(error.response.data);
      }
      console.log(error);
    }
  };

  useEffect(() => {
    verifyToken();
  }, []);

  const handleOnChange = ({ target }) => {
    const { name, value } = target;
    setNewPassword({ ...newPassword, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { password, confirmPassword } = newPassword;
    if (password.trim().length < 8 || password.trim().length > 20) {
      return setError("Password must be 8 to 20 charater long!");
    }
    if (password !== confirmPassword) {
      return setError("Password dose not match!");
    }

    //ทำการส่งรหัส ไปบันทึก
    try {
      setBusy(true);
      const { data } = await axios.post(
        `${baseUrl}/reset-password?token=${token}&id=${id}`,
        { password }
      );
      setBusy(false);

      if (data.success) {
          navigate('/reset-password')
          setSucess(true);
      }
    } catch (error) {
        setBusy(false);
      if (error?.response?.data) {
        const { data } = error.response;
        if (!data.success) return setError(data.error);
        return console.log(error.response.data);
      }
      console.log(error);
    }
  };

  if (success)
    return (
      <div className="max-w-screen-sm m-auto pt-40">
        <h1 className="text-center text-3xl text-gray-500 mb-3">
          Password reset Successfully.
        </h1>
      </div>
    );
  if (inValidUser)
    return (
      <div className="max-w-screen-sm m-auto pt-40">
        <h1 className="text-center text-3xl text-gray-500 mb-3">
          {inValidUser}
        </h1>
      </div>
    );

  if (busy)
    //ไม่ใหแสดงหน้า form ตอนกดรีเฟรช
    return (
      <div className="max-w-screen-sm m-auto pt-40">
        <h1 className="text-center text-3xl text-gray-500 mb-3">
          Wait for a moment verifying reset token
        </h1>
      </div>
    );

  return (
    <div className="max-w-screen-sm m-auto pt-40">
      <h1 className="text-center text-3xl text-gray-500 mb3">Reset password</h1>
      <form
        onSubmit={handleSubmit}
        action=""
        className="shadew w-full rounded-lg pt-10"
      >
        {error && (
          <p className="test-center p-2 mb-3 bg-red-500 text-white">{error}</p>
        )}
        <div className="space-y-8">
          <input
            type="password"
            placeholder="**********"
            name="password"
            onChange={handleOnChange}
            className="px-3 text-lg h-10 w-full border-2 rounded"
          />
          <input
            type="password"
            placeholder="**********"
            name="confirmPassword"
            onChange={handleOnChange}
            className="px-3 text-lg h-10 w-full border-2 rounded"
          />
          <input
            type="submit"
            value="Reset Password"
            className="bg-gray-500 w-full py-3 text-white rounded"
          />
        </div>
      </form>
    </div>
  );
};

export default Form;
