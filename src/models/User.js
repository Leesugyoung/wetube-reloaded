import bcrypt from "bcrypt";
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    email: { type:String, required: true, unique:true  },
    avatarUrl: { type: String },
    socialOnly: { type:Boolean, default: false},
    username : { type:String, required:true,  unique:true },
    password : { type:String },
    name : { type:String, required:true },
    location : { type:String },
});

// password 암호화(hashing)
userSchema.pre("save", async function() {
    // this === create User
    this.password = await bcrypt.hash(this.password, 5);
});

const User = mongoose.model('User', userSchema);

export default User;