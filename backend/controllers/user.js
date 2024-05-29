const { validateEmail, validateLength, validatePassword } = require("../helper/validation");
const { generateToken } = require("../helper/token");
const generateCode = require("../helper/gencode")
const {sendResetCode, sendRegisterCode} = require("../helper/mail")
const User = require("../models/User");
const Post = require("../models/Post");
const Blockip = require("../models/Blockip")
const Blacklist = require("../models/Blacklist")
const FailedLogin = require("../models/FailedLogin")
const Verification = require("../models/Verification")
const bcrypt = require("bcrypt");

exports.sendOTP = async(req, res) => {
  try {
    const {mail, name} = req.body
    if (!validateEmail(mail)) {
      return res.status(400).json({msg: "Please enter a valid email !"})
    }

    const verifies = await Verification.find({
      $and: [
        {mail: mail},
        {target: 'signup'}
      ]
    });
    if(verifies.length >= 5) {
      return res.status(400).json({msg: "The number of OTP requests exceeds the limit"})
    }

    const code = generateCode(6);
    const hashed_code = await bcrypt.hash(code, 10);
    const savedOTP = await new Verification({
      mail: mail,
      otp: hashed_code,
      target: 'signup'
    }).save();

    sendRegisterCode(mail, name, code)
    return res.status(200).json({msg: 'ok'})
  } catch(error) {
    return res.status(500).json({msg: error.message})
  }
}

// hàm register xử lí các request đăng kí từ client
exports.register = async (req, res) => {
    try {
      const { name, temail, password } = req.body;
      if (!validateLength(name, 6, 15)) {
        return res
        .status(400)
        .json({ message: "Enter name between 6 to 15 characters !" });
      }
      if (!validateEmail(temail)) {
        return res.status(400).json({ message: "Please enter a valid email !" });
      }
      
      if (!validatePassword(password, 8)) {
        return res
        .status(400)
        .json({ message: "Weak password" });
      }
      
      // kiểm tra xem email đăng kí đã tồn tại hay chưa
      const check = await User.findOne({ email: temail });
      if (check) {
        return res.status(400).json({
          message:
          "This email already exists,try again with a different email",
        });
      }

      const verifies = await Verification.find({
        $and: [
          {mail: temail},
          {target: 'signup'}
        ]
      });

      if(verifies.length <= 0) {
        return res.status(400).json({
          message:"Email has not been verified"
        })
      }
      var flag = false
      for(var i=0; i<verifies.length; i++) {
        if(verifies[i].isVerify) {
          flag=true
          break
        }
      }

      if(!flag) {
        return res.status(400).json({
          message:"Email has not been verified"
        })
      }

      const hashed_password = await bcrypt.hash(password, 10);
      const user = await new User({
        name:name,
        email:temail,
        password: hashed_password,
        verify: true
      }).save();
      await Verification.deleteMany({
        $and: [
          {mail: temail},
          {target: 'signup'}
        ]
      });
      const token = generateToken({ id: user._id.toString() }, "1h");
      res.cookie('bearer', token, {
        httpOnly: false,
        secure: false,
        sameSite: 'Strict',
        maxAge: 3600000,  // 1 giờ
      });
      res.send({
        id: user._id,
        name: user.name,
        picture: user.picture,
        message: "Register Success !",
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: error.message });
    }
};

// hàm login xử lí các request đăng nhập từ phía client
exports.login = async (req, res) => {
    try {
      const { temail, password } = req.body;
      const ip = req.connection.remoteAddress
      const blockip = await Blockip.findOne({
        $and: [
          {email: temail},
          {ipAddress: ip}
        ]
      })

      if (blockip) {
        return res.status(400).json({message: "IP address temporarily blocked. Please come back later!"})
      }

      const user = await User.findOne({ email:temail });
      if (!user) {
        return res.status(400).json({
          message:
            "the email you entered is not registered.",
        });
      }
      const check = await bcrypt.compare(password, user.password);
      if (!check) {
        var failed = await FailedLogin.findOne({$and: [
          {email: temail},
          {ipAddress: ip}
        ]})

        if (!failed) {
          failed = await new FailedLogin({
            email: temail,
            ipAddress: ip
          }).save()
        } else {
          failed.count = failed.count + 1
          if (failed.count > 5) {
            const block_ip = await new Blockip({
              email: temail,
              ipAddress: ip
            }).save()

            await FailedLogin.deleteOne({
              $and: [
                {email: temail},
                {ipAddress: ip}
              ]
            })
          }
        }

        return res.status(400).json({
          message: "Invalid Credentials. Please Try Again.",
        });
      }
      const token = generateToken({ id: user._id.toString() }, "15h");
      res.cookie('bearer', token, {
        httpOnly: false,
        secure: false,
        sameSite: 'Strict',
        maxAge: 3600000,  // 1 giờ
    });
      res.send({
        id: user._id,
        name: user.name,
        picture: user.picture,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };

// Xử lí yêu cầu đăng xuất từ client
exports.logout = async(req, res) => {
    try {
      console.log(req.token)
      if (!req.token) {
        return res.status(500).json({ message: 'Internal Server' });
      }
        // req.logout((err) => {
        //   if (err) {
        //     return res.status(400).json("Couldn't logout");
        //   }
        // });
        res.cookie('session', '', { expires: new Date(0), });
        res.cookie('bearer', '', {
          httpOnly: true,
          secure: true,
          sameSite: 'Strict',
          expires: new Date(0)  // Thiết lập thời gian hết hạn về quá khứ để xóa cookie
      });
        res.clearCookie("sessionId");
        const list = await new Blacklist({
          token: req.token,
        }).save()
        res.status(200).json({ success: true });
      } catch (error) {
        return res.status(500).json({ message: error.message });
      }
}

exports.verifycode=async(req,res)=>{

  try {
      const {mail, otp, intent}=req.body
      const data=await Verification.find({
        $and: [
          {mail: mail},
          {target: intent}
        ]
      });

      if(data.length === 0) {
        return res.status(400).json({msg:"not found"})
      }

      for(var i=0; i<data.length; i++) {
        let check = await bcrypt.compare(otp, data[i].otp)
        if(check) {
          data[i].isVerify = true;
          data[i].save();
          return res.status(200).json({msg: "ok"})
        }
      }
      return res.status(400).json({msg: "not"})
  } catch (error) {
      return res.status(400).json({msg:error.message});
  }
}

// Xử lí yêu cầu quên mật khảu và gửi mã xác thực về mail client
exports.forgotPassword = async (req, res) => {
    try {
      const { email } = req.body;
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({msg: 'User not found'})
      }

      const verifies = await Verification.find({
        $and: [
          {mail: email},
          {target: 'forgotpassword'}
        ]
      });

      if (verifies.length >= 5) {
        return res.status(400).json({msg: "The number of OTP requests exceeds the limit"})
      }

      const code = generateCode(6);
      const hashed_code = await bcrypt.hash(code, 10);
      const savedOTP = await new Verification({
        mail: email,
        otp: hashed_code,
        target: 'forgotpassword'
      }).save();

      sendResetCode(user.email, user.name, code);
      return res.status(200).json({
        msg: "Email reset code has been sent to your email",
      });
    } catch (error) {
      res.status(500).json({ msg: error.message });
    }
};

// Xử lí reset mật khẩu cho client
exports.resetPassword = async (req, res) => {
    try {
      const { email, password } = req.body;
      const verify = await Verification.find({mail: email});
      if (verify.length === 0) {
        return res.status(400).json({msg: "not"})
      }

      var isVerify = false;
      for(var i=0; i<verify.length; i++) {
        if(verify[i].isVerify === true) {
          isVerify = true;
          break;
        }
      }

      if (!isVerify) {
        return res.status(400).json({msg: "not"})
      }

      const user = await User.findOne({ email });

      if (!validatePassword(password, 8)) {
        return res
        .status(400)
        .json({ message: "Weak password" });
      }

      const hashed_password = await bcrypt.hash(password, 10);
      await User.updateOne({email: email}, {
        $set:
        {password: hashed_password}
    })
      await Verification.deleteMany({mail: email});
      return res.status(200).json({ message: "ok" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

exports.bookmark = async (req, res) => {
    try {
      const {
        postid,
      } = req.body;
      const userid = req.user.id
      const user = await User.findOne({ _id: userid });
      var m = user.bookmarks;
      var f = 0;
      if (m.length == 0) {
        user.bookmarks.push(postid);
      }
      else {
        for (var i = 0; i < m.length; i++) {
          if (m[i] == postid) {
            f = 1;
            m.splice(i, 1);
            m.push(postid);
            user.bookmarks = m;
            break;
          }
        }
      }
      if (f == 1) {
        user.save();
        return res.status(202).json({ msg: "exists" });
      }
      else {
        user.bookmarks.push(postid);
        user.save();
        return res.status(202).json({ msg: "ok" });
      }
    } catch (error) {
      console.log(error);
      return res.status(401).json({ msg: "ERROR" })
    }
};

exports.getBookmark = async (req, res) => {
    try {
      const id= req.user.id;
      const data = await User.findById(id)
      var arr = data.bookmarks;
      var respon = [];
      var img = "";
      var title = "";
      var desc = "";
      var imgp = "";
      var name = "";
      var userid = "";
      var postid = "";
      for (var i = 0; i < arr.length; i++) {
        var pd = await Post.findById(arr[i]);
        if (!pd) {
          arr.splice(i, 1);
          data.bookmarks = arr;
          data.save();
          continue;
        }
        img = pd.image;
        title = pd.title;
        desc = pd.description;
        userid = pd.user;
        var ud = await User.findById(userid);
        imgp = ud.picture;
        name = ud.name;
        postid = arr[i];
        respon.push({
          img: img,
          title: title,
          desc: desc,
          imgp: imgp,
          name: name,
          userid: userid,
          postid: postid
        })
      }
      return res.status(200).json({ msg: respon });

    } catch (error) {
      console.log(error)
      return res.status(400).json({ msg: "error" });
    }
};

exports.deleteBookmark = async (req, res) => {
    try {
      const {
        postid,
        userid
      } = req.query;
      const user = await User.findOne({ _id: userid });
      var m = user.bookmarks;
      var f = 0;
      if (m.length == 0) {
        return res.status(202).json({ msg: "Does not exists" });
      }
      else {
        for (var i = 0; i < m.length; i++) {
          if (m[i] == postid) {
            f = 1;
            m.splice(i, 1);
          }
        }
        user.bookmarks = m;
        user.save();
        if (f == 1) {
          return res.status(202).json({ msg: "deleted" });
        }
        else {
          return res.status(202).json({ msg: "not found" });
        }
  
      }
      // user.bookmarks.push(postid);
    }
    catch (error) {
      console.log(error);
      return res.status(401).json({ msg: "ERROR" })
    }
}

exports.checkBookmark = async (req, res) => {
    try {
      const {
        postid,
        userid
      } = req.body;
      const user = await User.findOne({ _id: userid });
      var m = user.bookmarks;
      if (m.length == 0) {
        return res.status(202).json({ msg: "Does not exist" });
      }
      else {
        for (var i = 0; i < m.length; i++) {
          if (m[i] == postid) {
            return res.status(202).json({ msg: "ok" });
          }
        }
        return res.status(202).json({ msg: "Does not exists" });
      }
      // user.bookmarks.push(postid);
    }
    catch (error) {
      console.log(error);
      return res.status(401).json({ msg: "ERROR" })
    }
};

exports.getMyPost = async (req, res) => {
  console.log("OK")

    try {
      const id= req.user.id;
      console.log(id)
      const data = await User.findById(id)
  
      var arr = data.posts;
      var respon = [];
      var img = "";
      var title = "";
      var desc = "";
      var imgp = "";
      var name = "";
      var userid = "";
      var postid = "";
      // console.log(99,arr.length);
      for (var i = 0; i < arr.length; i++) {
        var pd = await Post.findById(arr[i]);
        if (!pd) {
          continue;
        }
        img = pd.image;
        title = pd.title;
        desc = pd.description;
        userid = pd.user;
        var ud = await User.findById(userid);
        imgp = ud.picture;
        name = ud.name;
        postid = arr[i];
        respon.push({
          img: img,
          title: title,
          desc: desc,
          imgp: imgp,
          name: name,
          userid: userid,
          postid: postid
        })
      }
      return res.status(200).json({ msg: respon });
    } catch (error) {
      return res.status(400).json({ msg: "error" });
    }
};

exports.follow = async (req, res) => {
    try {
      const { id2 } = req.body;
      const id = req.user.id
      if (id === id2) {
        return res.status(400).json({ msg: "duplicate" });
      }
      const user = await User.findById(id);
      const user2 = await User.findById(id2);
  
      var mm = user2.followerscount;
      mm = mm + 1;
      user2.followerscount = mm;
      user2.save();

      var f = 0;
      var m = user.following;
      if (m.length == 0) {
        user.following.push(id2);
      }
      else {
        for (var i = 0; i < m.length; i++) {
          if (m[i] == id2) {
            f = 1;
            break;
          }
        }
        if (!f) {
          m.push(id2);
        }
  
        user.following = m;
      }
      user.followingcount = user.followingcount + 1;
      user.save();

      return res.status(200).json({ msg: "ok" });
    } catch (error) {
      console.log(error);
      console.log("error in follow");
      return res.status(400).json({ msg: "error in follow" });
    }
};

exports.unfollow = async (req, res) => {
    try {
      const { id2 } = req.body;
      const id = req.user.id
      if (id === id2) {
        return res.status(400).json({ msg: "duplicate" });
      }
      const user = await User.findById(id);
      const user2 = await User.findById(id2);

      var mm = user2.followerscount
      if (mm - 1 < 0) {
        mm = 0;
      }
      else {
        mm = mm - 1;
      }
      user2.followerscount = mm;
      user2.save();

      var f = 0;
      var m = user.following;
      if (m.length == 0) {
        return res.status(200).json({ msg: "ok" });
        // user.following.push(id2);
      }
      else {
        for (var i = 0; i < m.length; i++) {
          if (m[i] == id2) {
            f = 1;
            m.splice(i, 1);
            break;
          }
        }
        user.following = m;
      }

      if (f == 1) {
        user.followingcount = user.followingcount - 1
      }
      user.save();
      res.status(200).json({ msg: "ok" });
    } catch (error) {
      console.log("error in unfollow");
      res.status(400).json({ msg: "error in unfollow" });
    }
};

exports.uploadProfile = async (req, res) => {
    try {
      const { picture, about } = req.body;
      const id = req.user.id
  
      await User.findByIdAndUpdate(id, {
        picture: picture,
        about: about,
      });
      res.status(200).json({ picture, about });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
};

exports.getUser = async (req, res) => {
  try {
    const { userId } = req.query;
    const user = await User.findById(userId);
    const { password, ...otherdata } = user
    res.status(200).json(otherdata);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.search = async (req, res) => {
  try {
    const { q } = req.query;
    const data = await Post.find({ 
      $or: [
        {"tech":{ $regex: `${q}`, $options: 'i' }},
        {"title": { $regex: `${q}`, $options: 'i' } },
        {"description": { $regex: `${q}`, $options: 'i' }}
      ]});

    await Promise.all(
        data.map((post) => post.populate("user", "name picture about"))
    );

    if (data.length === 0) {
      return res.status(400).json({ data });
    }
    return res.status(200).json({data});
  } catch (error) {
    return res.status(400).json({ msg: "error in search" });
  }
};

exports.followercount = async (req, res) => {
  try {
    const { id } = req.body;
    const user = await User.findById(id);
    var count = user.followerscount;
    return res.status(200).json({ msg: count });
  } catch (error) {
    console.log("error in followcount");
    return res.status(400).json({ msg: "error in followcount" });
  }
}
exports.followingcount = async (req, res) => {
  try {
    const { id } = req.body;
    const user = await User.findById(id);
    var count = user.followingcount;
    return res.status(200).json({ msg: count });
  } catch (error) {
    console.log("error in followingcount");
    return res.status(400).json({ msg: "error in followingcount" });
  }
}

exports.checkfollowing = async (req, res) => {
  try {
    const { id2 } = req.body;
    const id = req.user.id
    const user = await User.findById(id);
    const arr = user.following;
    if (id === id2) {
      return res.status(200).json({ msg: "duplicate" });
    }
    if (arr.length == 0) {
      return res.status(200).json({ msg: "not" });
    }
    for (var i = 0; i < arr.length; i++) {
      if (arr[i] === id2) {
        return res.status(200).json({ msg: "ok" });
      }
    }
    return res.status(200).json({ msg: "not" });
  } catch (error) {
    console.log(error)
    return res.status(400).json({ msg: "error in fetchcheckfollow" });
  }
}

exports.fetchfollowing = async (req, res) => {
  try {
    const id = req.user.id;
    const user = await User.findById(id);
    const arr = user.following;
    const resp = [];
    var name = "";
    var pic = "";
    var pid = "";
    for (var i = 0; i < arr.length; i++) {
      var dat = await User.findById(arr[i]);
      name = dat.name;
      pic = dat.picture;
      pid = arr[i];
      resp.push({
        name: name,
        pic: pic,
        pid: pid
      })
    }
    return res.status(200).json({ msg: resp });
  } catch (error) {
    console.log("error in fetchfollow");
    return res.status(400).json({ msg: "error in fetchfollow" });
  }
}
