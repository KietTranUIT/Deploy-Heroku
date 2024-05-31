import axios from "axios";
import { useState } from "react";
import "./resetPassword.css";
import { Link, useNavigate, Navigate } from "react-router-dom";

function ResetPassword() {
  const [email, setEmail] = useState("");
  const [code, setcode] = useState("");
  const [pass, setpass] = useState("");
  const [foundUser, setFoundUser] = useState(null);
  const [foundsend, setFoundsend] = useState(null);
  const [open, setopen] = useState(null);

  const navigate = useNavigate();

  const handleInputChange = (event) => {
    setEmail(event.target.value);
  };

  const handleSearchClick = async () => {
    try {
      const { data } = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/findOutUser`,
        {
          email,
        }
      );
      setFoundUser(data[0])


    } catch (error) {
      console.log(error.message);
    }
  };
  const forgotPassword = async () => {
    try {
      const { data } = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/account/reset/${email}`);
      if(data.msg === "User not found") {
        setFoundsend(false);
        alert("User not found!");
      } else {
        setFoundsend(true)
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const validate = async (e) => {
    e.preventDefault()
    try {
      const { data } = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/verifycode`, { mail: email, otp: code, intent: 'forgotpassword'});
      if (data.msg === "ok") {
        setFoundsend(false);
        setopen(true);
      }
      else {
        alert(data.message)
      }

    } catch (error) {
      console.log(error.message)
    }
  }
  const changep = async (e) => {
    e.preventDefault();
    if (pass.length <= 8) {
      alert("PASSWORD LENGTH SHOULD BE MORE THAN 8")
      return;
    }
    if (!pass) {
      return;
    }

    try {
      const { data } = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/resetpassword`, { email: email, password: pass });
      if (data.message === "ok") {
        alert("Password Changed");
        setTimeout(() => {
          navigate("/");
        }, 2000);
      }
      else {
        alert("Failed Change Password")
      }
    } catch (error) {
      alert(error.response.data.message)
    }
  }
  return (
    <div className="user-search">
      {" "}
      {/* Add the "user-search" class to the container */}
      <label htmlFor="email-input">Email address:</label>
      <input
        type="email"
        id="email-input"
        value={email}
        onChange={handleInputChange}
        className="user-search-input"
      />
      <button onClick={forgotPassword} className="user-search-button">
        Send code
      </button>
      <div className={`${foundsend ? "" : "hidden"}`}>
      <label htmlFor="email-input">Code Has been Sent to your email</label>
      </div>
    </div>
  );
}

export default ResetPassword;
