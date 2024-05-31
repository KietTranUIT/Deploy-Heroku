const jwt = require("jsonwebtoken");
const seedrandom = require('seedrandom')

const seed = new Date().getTime().toString();
const random = seedrandom(seed)
const str = '0123456789qwertyuiopasdfghjklzxcvbnm'

exports.randomToken = (len) => {
  var token = ''
  for(var i=0; i<len; i++) {
    const index = Math.floor(random() * 36)
    token = token + str[index]
  }
  return token
}


exports.generateToken = (payload, expired) => {
  return jwt.sign(payload, process.env.TOKEN_SECRET, {
    expiresIn: expired,
  });
};



