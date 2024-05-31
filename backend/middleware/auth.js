const jwt = require("jsonwebtoken");
const Blacklist = require("../models/Blacklist")
const User = require("../models/User")

exports.authUser = async (req, res, next) => {
  try {
      let tmp = req.header("Authorization");
      const token1 = tmp ? tmp.slice(7, tmp.length) : "";

      let tmp1 = req.header("Cookie");
      const token2 = tmp1 ? tmp1.slice(7, tmp1.length) : ""

      if (token1 === "" && token2 === "") {
        return res.status(401).json({ message: "Invalid Authentification" });
      }
      var token = ''
      if (token1 != '') {
        token = token1
      } else {
        token = token2.split(';')[0]
      }
      const a = await Blacklist.findOne({token: token})
      if (a) {
        return res.status(401).json({ message: "Invalid Authentification" });
      }

      jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
        if (err) {
          return res.status(401).json({ message: "Invalid Authentification" });
        }
        req.user = user;
        if(req.originalUrl.includes('/logout')) {
          req.token = token
        }
        next();
      });
  } catch (error) {
    console.log('fail')
    return res.status(500).json({ message: error.message });
  }
};
