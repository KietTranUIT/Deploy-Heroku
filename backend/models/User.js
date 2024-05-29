const { model, Schema } = require("mongoose");
const userSchema = new Schema(
  {
    name: {
      type: String,
      // required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: function () { return !this.googleId },
    },
    verify:{
      type:Boolean,
      default:false
    },
    googleId: {
      type: String,
      required: function () { return !this.password },
    },
    picture: {
      type: String,
      trim: true,
      default:
        "https://res.cloudinary.com/dfgnimhoi/image/upload/v1716606972/default-avatar_hcl6y7.jpg",
    },
    about: {
      type: String
    },
    bookmarks:{
      type:Array,
      default:[]
    },
    posts:{
      type:Array,
      default:[]
    },
    following:{
      type:Array,
      default:[],
    },
    followerscount:{
      type:Number,
      default:0,
    },
    followingcount:{
      type:Number,
      default:0,
    }

  },
  { timestamps: true }
);

module.exports = model("User", userSchema);

