import bcrypt from "bcryptjs";
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    email: { type:String, required: true, unique:true  },
    avatarUrl: { type: String },
    socialOnly: { type:Boolean, default: false},
    username : { type:String, required:true,  unique:true },
    password : { type:String },
    name : { type:String, required:true },
    location : { type:String },
    comments : [{ type: mongoose.Schema.Types.ObjectId, ref:"Comment" }],
    videos : [ { type: mongoose.Schema.Types.ObjectId, ref:"Video" } ],
});

// password 암호화(hashing)
userSchema.pre("save", async function() {
    // this === create User
    // password가 수정된 경우에만 hash
    if(this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 5);
    }
});

const User = mongoose.model('User', userSchema);

export default User;