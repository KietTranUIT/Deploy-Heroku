import axios from "axios";
import Cookies from 'js-cookie';

export const clearCookie = (cookieName) => {
  document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
};
// export const checkifverify = async (mail) => {
//   try {
//     const { data } = await axios.post(
//       `${process.env.REACT_APP_BACKEND_URL}/checkifverify`, {
//       mail
//     }
//     )
//     return data;
//   } catch (error) {
//     return { msg: "error" };
//   }
// }

export const sendVerifyOTP = async (mail, otp, intent) => {
  try {
    const { data } = await axios.post(
      `${process.env.REACT_APP_BACKEND_URL}/verifycode`, {
      mail,
      otp,
      intent
    }
    )
    return data;
  } catch (error) {
    return { msg: "error in sending mail" };
  }
}
export const sendmail = async (mail, name) => {
  try {
    const { data } = await axios.post(
      `${process.env.REACT_APP_BACKEND_URL}/sendmail`, {
      mail,
      name
    }
    )
    return data;
  } catch (error) {
    return { msg: "error in sending mail" };
  }
}
export const uplaodImages = async (formData) => {
  try {
    const { data } = await axios.post(
      `${process.env.REACT_APP_BACKEND_URL}/uploadImages`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${Cookies.get('bearer')}`
        },
        withCredentials: true,
        }
    );
    return data;
  } catch (error) {
    if(error.response.data.message === "Invalid Authentification") {
      alert("Phiên đăng nhập đã hết hạn! Vui lòng đăng nhập lại")
      window.location.href = "/auth"
    }
    return error.response.data.message;
  }
};

export const dataURItoBlob = (dataURI) => {
  // convert base64/URLEncoded data component to raw binary data held in a string
  var byteString;
  if (dataURI.split(",")[0].indexOf("base64") >= 0)
    byteString = atob(dataURI.split(",")[1]);
  else byteString = unescape(dataURI.split(",")[1]);

  // separate out the mime component
  var mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];

  // write the bytes of the string to a typed array
  var ia = new Uint8Array(byteString.length);
  for (var i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }

  return new Blob([ia], { type: mimeString });
};

export const createPost = async (
  title,
  description,
  image,
  category,
  userId,
  token = null,
  cleanHtml
) => {
  try {
    const { data } = await axios.post(
      `${process.env.REACT_APP_BACKEND_URL}/post`,
      {
        title,
        description,
        image,
        category,
        content: cleanHtml,
      },

      {
        headers: {
          Authorization: `Bearer ${Cookies.get('bearer')}`
        },
        withCredentials: true,
        }
    );
    return data;
  } catch (error) {
    if(error.response.data.message === "Invalid Authentification") {
      alert("Phiên đăng nhập đã hết hạn! Vui lòng đăng nhập lại")
      window.location.href = "/auth"
    }
    return error.response.data.message;
  }
};
export const createcomment = async (

  name,
  image,
  content,
  id1,
  id2

) => {
  try {
    const { data } = await axios.post(
      `${process.env.REACT_APP_BACKEND_URL}/postcomment`,
      {
        name,
        image,
        content,
        id2
      },{
        headers: {
          Authorization: `Bearer ${Cookies.get('bearer')}`
        },
        withCredentials: true,
        }
    )
    return data
  } catch (error) {
    if(error.response.data.message === "Invalid Authentification") {
      alert("Phiên đăng nhập đã hết hạn! Vui lòng đăng nhập lại")
      window.location.href = "/auth"
    }
    return;
  }
}

export const fetchprof = async (id) => {
  try {
    var { data } = await axios.post(
      `${process.env.REACT_APP_BACKEND_URL}/fetchprof`,
      {
        id,

      }

    )
    // data = [...data, { msg: "ok" }];
    return data;
  } catch (error) {
    console.log(error);
    return { msg: "error" };
  }
}
export const getcomment = async (id) => {
  try {
    var { data } = await axios.get(
      `${process.env.REACT_APP_BACKEND_URL}/comment/${id}`,{
        headers: {
          Authorization: `Bearer ${Cookies.get('bearer')}`
        },
        withCredentials: true,
        }
    )
    data = [...data, { msg: "ok" }];
    return data;
  } catch (error) {
    if(error.response.data.message === "Invalid Authentification") {
      alert("Phiên đăng nhập đã hết hạn! Vui lòng đăng nhập lại")
      window.location.href = "/auth"
    }
    return { msg: "error" };
  }
}
export const getfollowercount = async (id) => {
  try {
    const data = await axios.post(
      `${process.env.REACT_APP_BACKEND_URL}/countfollower`, {
      id
    },{
      headers: {
        Authorization: `Bearer ${Cookies.get('bearer')}`
      },
      withCredentials: true,
      })
    return data
  } catch (error) {
    if(error.response.data.message === "Invalid Authentification") {
      alert("Phiên đăng nhập đã hết hạn! Vui lòng đăng nhập lại")
      window.location.href = "/auth"
    }
    return { msg: "error" }
  }
}


export const getallpostdata = async (id) => {
  try {
    const data = await axios.get(
      `${process.env.REACT_APP_BACKEND_URL}/post/${id}`)
    return data
  } catch (error) {
    console.log(error);
    // console.log(error);
    return { msg: "error" }
  }
}
export const getfollowingcount = async (id) => {
  try {
    const data = await axios.post(
      `${process.env.REACT_APP_BACKEND_URL}/countfollowing`, {
      id
    },{
      headers: {
        Authorization: `Bearer ${Cookies.get('bearer')}`
      },
      withCredentials: true,
      })
    return data
  } catch (error) {
    if(error.response.data.message === "Invalid Authentification") {
      alert("Phiên đăng nhập đã hết hạn! Vui lòng đăng nhập lại")
      window.location.href = "/auth"
    }
    return { msg: "error" }
  }
}

export const showbookmarks = async (id) => {
  try {
    console.log(id)
    const data = await axios.get(
      `${process.env.REACT_APP_BACKEND_URL}/bookmark`, {
        headers: {
          Authorization: `Bearer ${Cookies.get('bearer')}`
        },
        withCredentials: true,
        } )
    return data;
  } catch (error) {
    if(error.response.data.message === "Invalid Authentification") {
      alert("Phiên đăng nhập đã hết hạn! Vui lòng đăng nhập lại")
      window.location.href = "/auth"
    }
    return { msg: "error" }
  }
}

export const reportcontent = async (pid, postid, userid, name1, name2, reason) => {
  try {
    var { data } = await axios.post(
      `${process.env.REACT_APP_BACKEND_URL}/reportcontent`, {
      pid,
      postid,
      userid,
      name1,
      name2,
      reason
    }
    )
    return data;
  } catch (error) {
    console.log("Error in Reporting", error);
    return { msg: error };
  }
}
export const deletebookmark = async (postid, userid) => {
  try {
    var { data } = await axios.delete(
      `${process.env.REACT_APP_BACKEND_URL}/bookmark?postid=${postid}&userid=${userid}`,
      {
        headers: {
          Authorization: `Bearer ${Cookies.get('bearer')}`
        },
        withCredentials: true,
        } 
    )
    return data;
  } catch (error) {
    if(error.response.data.message === "Invalid Authentification") {
      alert("Phiên đăng nhập đã hết hạn! Vui lòng đăng nhập lại")
      window.location.href = "/auth"
    }
    return { msg: error };
  }
}

export const deletepost = async (postid, userid) => {
  try {
    var { data } = await axios.delete(
      `${process.env.REACT_APP_BACKEND_URL}/post?postid=${postid}`, 
      {
        headers: {
          Authorization: `Bearer ${Cookies.get('bearer')}`
        },
        withCredentials: true,
        } 
    )
    return data;
  } catch (error) {
    if(error.response.data.message === "Invalid Authentification") {
      alert("Phiên đăng nhập đã hết hạn! Vui lòng đăng nhập lại")
      window.location.href = "/auth"
    }
    return { msg: error };
  }
}
export const checkbookmark = async (postid, userid) => {
  try {
    var { data } = await axios.post(
      `${process.env.REACT_APP_BACKEND_URL}/checkbookmark`, {
      postid,
      userid
    }, {
      headers: {
        Authorization: `Bearer ${Cookies.get('bearer')}`
      },
      withCredentials: true,
      } 
    )
    return data;
  } catch (error) {
    if(error.response.data.message === "Invalid Authentification") {
      return {msg: "no authenticate"}
    }
    return { msg: error };
  }
}

export const fetchfollowing = async (id) => {
  try {
    var { data } = await axios.post(
      `${process.env.REACT_APP_BACKEND_URL}/fetchfollowing`, {}, {
      headers: {
        Authorization: `Bearer ${Cookies.get('bearer')}`
      },
      withCredentials: true,
      } 
    )
    return data;
  } catch (error) {
    if(error.response.data.message === "Invalid Authentification") {
      alert("Phiên đăng nhập đã hết hạn! Vui lòng đăng nhập lại")
      window.location.href = "/auth"
    }
    return;
  }
}
export const startfollow = async (id, id2) => {
  try {
    var { data } = await axios.post(
      `${process.env.REACT_APP_BACKEND_URL}/follow`, {
      id2
    },{
      headers: {
        Authorization: `Bearer ${Cookies.get('bearer')}`
      },
      withCredentials: true,
      } 
    )
    return data;
  } catch (error) {
    if(error.response.data.message === "Invalid Authentification") {
      alert("Phiên đăng nhập đã hết hạn! Vui lòng đăng nhập lại")
      window.location.href = "/auth"
    }
    return;
  }
}
export const unfollow = async (id, id2) => {
  try {
    var { data } = await axios.post(
      `${process.env.REACT_APP_BACKEND_URL}/unfollow`, {
      id2
    }, {
      headers: {
        Authorization: `Bearer ${Cookies.get('bearer')}`
      },
      withCredentials: true,
      } 
    )
    return data;
  } catch (error) {
    if(error.response.data.message === "Invalid Authentification") {
      alert("Phiên đăng nhập đã hết hạn! Vui lòng đăng nhập lại")
      window.location.href = "/auth"
    }
    return;
  }
}
export const checkfollowing = async (id, id2) => {
  try {
    var { data } = await axios.post(
      `${process.env.REACT_APP_BACKEND_URL}/checkfollow`, {
      id2
    }, {
      headers: {
        Authorization: `Bearer ${Cookies.get('bearer')}`
      },
      withCredentials: true,
      } 
    )
    return data;
  } catch (error) {
    if(error.response.data.message === "Invalid Authentification") {
      return {msg: "no authenticate"}
    }
    return;
  }
}
export const showmyposts = async (id) => {
  try {
    var { data } = await axios.get(
      `${process.env.REACT_APP_BACKEND_URL}/post/user`,
      {
        headers: {
          Authorization: `Bearer ${Cookies.get('bearer')}`
        },
        withCredentials: true,
        } 
    )
    return data;
  } catch (error) {
    if(error.response.data.message === "Invalid Authentification") {
      alert("Phiên đăng nhập đã hết hạn! Vui lòng đăng nhập lại")
      window.location.href = "/auth"
    }
    return;
  }
}
export const searchresult = async (query,) => {
  try {
    var { data } = await axios.get(
      `${process.env.REACT_APP_BACKEND_URL}/search?q=${query}`
    )
    return data;
  } catch (error) {
    console.log("Error in Bookmark", error);
    return;
  }
}
export const bookmark = async (postid, userid) => {
  try {
    var { data } = await axios.post(
      `${process.env.REACT_APP_BACKEND_URL}/bookmark`, {
      postid,
      userid
    },
    {
      headers: {
        Authorization: `Bearer ${Cookies.get('bearer')}`
      },
      withCredentials: true,
      }    )
    return data;
  } catch (error) {
    if(error.response.data.message === "Invalid Authentification") {
      alert("Phiên đăng nhập đã hết hạn! Vui lòng đăng nhập lại")
      window.location.href = "/auth"
    }
    return;
  }
}

export const getAllPost = async (activePage, LIMIT) => {
  try {
    const { data } = await axios.get(
      `${process.env.REACT_APP_BACKEND_URL}/posts`,
      {
        params: {
          page: activePage,
          size: LIMIT,
        },
      }
    );
    return data;
  } catch (error) {
    return error.response.data.message;
  }
};

export const uploadProfilePicture = async (picture, about, id, token = null) => {
  try {
    const { data } = await axios.post(
      `${process.env.REACT_APP_BACKEND_URL}/profile`,
      {
        picture,
        about,
      },
        {
          headers: {
            Authorization: `Bearer ${Cookies.get('bearer')}`
          },
          withCredentials: true,
      }
    );
    return data;
  } catch (error) {
    if(error.response.data.message === "Invalid Authentification") {
      alert("Phiên đăng nhập đã hết hạn! Vui lòng đăng nhập lại")
      window.location.href = "/auth"
    }
    return error.response.data.message;
  }
};

export const getUser = async (userId) => {
  try {
    const { data } = await axios.get(
      `${process.env.REACT_APP_BACKEND_URL}/user?userId=${userId}`,
      {
      headers: {
        Authorization: `Bearer ${Cookies.get('bearer')}`
      },
      withCredentials: true,
    }
    );
    return data;
  } catch (error) {
    if(error.response.data.message === "Invalid Authentification") {
      // alert("Phiên đăng nhập đã hết hạn! Vui lòng đăng nhập lại")
      // window.location.href = "/auth"
    }
    return error.response.data.message;
  }
};
