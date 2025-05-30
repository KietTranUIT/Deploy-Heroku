import { TfiWrite } from "react-icons/tfi";
import { RiShieldUserLine } from "react-icons/ri";
import { ImMenu } from "react-icons/im";
import { GiSplitCross } from "react-icons/gi";
import { BsSearch, BsPencilSquare } from "react-icons/bs";

import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import Cookies from "js-cookie";

import { useState, useEffect } from "react";
import axios from "axios";
import { clearCookie } from "../helpers";
import { useMediaQuery } from "react-responsive";
import {
  searchresult
} from "../helpers/index";
function Navbar({ postpage }) {
  const view1 = useMediaQuery({ query: "(max-width: 564px)" });
  const view2 = useMediaQuery({ query: "(max-width: 420px)" });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchsel, setsearchsel] = useState(true);
  const [sres, searchf] = useState([]);
  const [ssw, cssw] = useState(false)
  const [scontent, cscontent] = useState("")
  const navigateToHome = () => {
    navigate("/");
  };

  const handleDown = (post) => {
    navigate('/article', { state: { post } }) 
  }

  const onsearchc = async () => {
    try {
      if (scontent === "") {
        return;
      }
      const {data} = await searchresult(scontent)
      searchf(data);
    } catch (error) {
      console.log("error in search result");
    }
  }
  const { user } = useSelector((state) => ({ ...state }));
  const handleLoad = () => {
    if (user === null || user === undefined) {
      fetch(`${process.env.REACT_APP_BACKEND_URL}/login/success`, {
        method: "GET",
        credentials: "include",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "Access-Control-Allow-Credentials": true,
        },
      })
        .then((response) => {
          if (response.status === 200) return response.json();
          throw new Error("Authentication Failed!");
        })
        .then((resObject) => {
          dispatch({ type: "LOGIN", payload: resObject.user });
          Cookies.set("user", JSON.stringify(resObject.user), {
            expires: 15,
          });
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const logoutFunction = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/logout`, {
          headers: {
            Authorization: `Bearer ${Cookies.get('bearer')}`
          },
          withCredentials: true,
          }
      );
      if (data) {
        //Cookies.set("user", "");
        Cookies.remove("user")
        Cookies.remove("sessionId");
        clearCookie("sessionId");
        dispatch({
          type: "LOGOUT",
        });
      }
    } catch (error) {
      if(error.response.data.message === "Invalid Authentification") {
        alert("Phiên đăng nhập đã hết hạn! Vui lòng đăng nhập lại")
        window.location.href = "/auth"
      }
    }
  };
  const select_action = async () => {
    setsearchsel((prev) => !prev);
  };

  return (
    <nav className="navbar">
      {ssw ?
        <div className="btnsrch" onClick={() => { cssw(false); }}>

        </div>
        :
        <></>}
      <div className="rocket" onClick={() => navigateToHome()}>
        <div className="img">
          <img src="/OIG.svg" alt="HOME" />
        </div>
        <span style={{ textDecoration: "underline" }} >Nhóm 21</span>
      </div>
      <div className="search">
        <div className="search_wrap">
          <input className="inputnav" onClick={() => { cssw(true) }} onChange={(e) => { cscontent(e.target.value); cssw(true); onsearchc() }} type="text" name="" value={scontent} id="" placeholder="Search..." />
          {ssw ?
            <div className="search-result">
              <ul className="search-list">
                {sres.map((i) => {
                  return (
                    <li className="lis-item noun" onClick={() => handleDown(i)}>
                      {user ?
                        <>
                          <img className="imgscp" src={i.image} alt=""/>
                          <p className="blackclr">
                              {i.title}
                            </p>
                        </>
                        :
                        <>
                          <img className="imgscp" src={i.image} alt="" />
                          <Link className="noun" to={`/auth`}>
                            <p className="blackclr">
                              {i.title}
                            </p>
                          </Link>
                        </>
                      }
                    </li>
                  )
                })}
                <li className=" lis-item">
                </li>
              </ul>
            </div>
            : <></>
          }
        </div>
        <div className="imagesearch" onClick={() => { cssw(true); onsearchc() }}>
          <BsSearch size={view1 ? 15 : 20} />
          {view2 ? (
            <div className="searchsel" onClick={select_action}>
              {searchsel ? <ImMenu size={22} /> : <GiSplitCross size={22} />}
            </div>
          ) : null}
        </div>
      </div>
      {user ? (
        <div className="links write2">
          <Link
            className={view1 ? "write extra" : "write"}
            to="/write"
            style={{ visibility: `${postpage && "hidden"}` }}
          >
            <BsPencilSquare className="pencill" />
            <span>Add</span>
          </Link>
          <Link className="user" to="/profile">
            <div className="user_image">
              <img src={user?.picture} alt="" />
            </div>
          </Link>
          <Link
            to=""
            className={view1 ? "logout extra" : "logout"}
            onClick={logoutFunction}
          >
            Log Out
          </Link>
        </div>
      ) : (
        <div className="links">
          <Link className="write" to="/auth">
            <BsPencilSquare className="" />
            <span>Add</span>
          </Link>
          <Link to="/auth" className="logout">
            SignUp | LogIn
          </Link>
        </div>
      )}
      {view2 && (
        <div className={!searchsel ? "sidebar" : "sidebar2"}>
          <ul>
            <li>
              <RiShieldUserLine size={15} />
              {user ? (
                <Link to="/profile">Profile</Link>
              ) : (
                <Link to="/auth">LogIn | SignUp</Link>
              )}
            </li>
            <li>
              <TfiWrite size={15} /> <Link to="/write">Write</Link>
            </li>
            {user ? (
              <li className="hamburger_logout">
                <Link to="/" onClick={logoutFunction}>
                  LogOut
                </Link>
              </li>
            ) : (
              ""
            )}
          </ul>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
