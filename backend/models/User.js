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
    status:{
      type:Boolean,
      enum: ["active", "lock"]
    },
    isAdmin: {
      type: Boolean,
      default: false
    },
    isVerify: {
      type: Boolean,
      default: false
    },
    secret: {
      type: String,
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

