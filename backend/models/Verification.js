const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    mail: {
        type: String,
        minlength: 3,
    },
    isVerify: {
        type: Boolean,
        default:false,
    },
    target: {
        type: String,
        required: true,
        enum: ["signup", "forgotpassword"]
    },
    otp:{
        type:String,
    }
},
    { timestamps: true })

UserSchema.index({createdAt: 1},{expireAfterSeconds: 1800});
module.exports = mongoose.model('Verification', UserSchema);

