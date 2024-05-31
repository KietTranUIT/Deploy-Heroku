const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    mail: {
        type: String,
        minlength: 3,
        required: true
    },
    name: {
        type: String
    },
    target: {
        type: String,
        required: true,
        enum: ["signup", "forgotpassword"]
    },
    token:{
        type:String,
        require: true
    }
},
    { timestamps: true })

UserSchema.index({createdAt: 1},{expireAfterSeconds: 1800});
module.exports = mongoose.model('Verification', UserSchema);

