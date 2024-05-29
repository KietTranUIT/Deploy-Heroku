const jwt = require("jsonwebtoken");
const Blacklist = require("../models/Blacklist")

exports.authUser = async (req, res, next) => {
  try {
      let tmp = req.header("Authorization");
      const token = tmp ? tmp.slice(7, tmp.length) : "";
      if (token === "") {
        return res.status(401).json({ message: "Invalid Authentification" });
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
