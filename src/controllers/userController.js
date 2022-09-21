import User from "../models/User";
import Video from "../models/Video";
import bcrypt from "bcrypt"; 
import fetch from "node-fetch";

// --- getJoin
export const getJoin = (req, res) => res.render("user/join", { pageTitle : "Join" });


// --- postJoin
export const postJoin = async(req, res) => {
    const { name, username, email, password, password2, location } = req.body;
    const pageTitle = "Join";

    if (password !== password2) {
        return res.status(400).render("user/join", {
            pageTitle,
            errorMessage:"Password confirmation does not match!",
        })
    }

    const exists = await User.exists({ $or : [
            // username : req.body.username
            {username},{email}]});

    if (exists) {
        return res.status(400).render("user/join", { 
            pageTitle,
            errorMessage:"This username/email is already taken."
        });
    }

    try {
        await User.create({
            name, 
            username, 
            email, 
            password, 
            location,
        });
        return res.redirect("/login");
    } catch (error) {
        return res.status(400).render("user/join", {
            pageTitle,
            errorMessage : error.message,
        });
    };
};


// --- getLogin 
export const getLogin = (req, res) => {
    res.render("user/login", {pageTitle: "Login"});
}


// --- postLogin 
export const postLogin = async (req, res) => {
    const { username, password } = req.body;
    const pageTitle = "Login";
    const user = await User.findOne({ username, socialOnly:false });

    if (!user) {
        return res.status(400).render("user/login", {
            pageTitle, 
            errorMessage:"An account with this username does not exists."
        });
    }
    const ok = await bcrypt.compare(password, user.password);
    
    if (!ok) {
        return res.status(400).render("user/login", {
            pageTitle, 
            errorMessage: "Wrong password",
        });
    }
    req.session.loggedIn = true;
    req.session.user = user;
    // → req.session.user = db find user
    return res.redirect("/");
};


// --- startGithubLogin 
export const startGithubLogin = (req,res) => {
    const baseUrl = 'https://github.com/login/oauth/authorize';
    const config = {
        client_id: process.env.GH_CLIENT,
        allow_singup: false,
        scope:"read:user user:email"
    };
    const params = new URLSearchParams(config).toString();
    const finalUrl = `${baseUrl}?${params}`;

    return res.redirect(finalUrl);
};


// --- finishGithubLogin
export const finishGithubLogin = async (req, res) => {
    const baseUrl = "https://github.com/login/oauth/access_token";
    const config = {
        client_id: process.env.GH_CLIENT,
        client_secret: process.env.GH_SECRET,
        code: req.query.code,
    };

    const params = new URLSearchParams(config).toString();
    const finalUrl = `${baseUrl}?${params}`;
    const tokenRequest = await(
        await fetch(finalUrl, {
        method:"POST",
        headers: { Accept: "application/json" },
    })
    ).json();

    if("access_token" in tokenRequest ){
        const { access_token } = tokenRequest;
        const apiUrl = "https://api.github.com";

        const userData= await(
            await fetch(`${apiUrl}/user`, {
                headers : {
                    Authorization: `token ${access_token}`
                },
            })
        ).json();
        // console.log(userData);

        const emailData = await(
            await fetch(`${apiUrl}/user/emails`, {
                headers : {
                    Authorization: `token ${access_token}`
                },
            })
        ).json();
        // console.log(emailData);

        const emailObj = emailData.find(
            (email) => email.primary===true && email.verified===true
        );

        if (!emailObj) {
            return res.redirect("/login");
        }

        // github email이 db 에 있을 때 로그인될 수 있도록
        let user = await User.findOne({email: emailObj.email});
        if(!user) {
            // 만약 db에 email 이 없다면 가입시키기
            const user = await User.create({
                avatarUrl: userData.avatar_url ,
                name: userData.name, 
                username: userData.login, 
                email: emailObj.email, 
                password:"", 
                socialOnly: true,
                location: userData.location,
            });
        }
        req.session.loggedIn = true;
        req.session.user = user;
        return res.redirect("/");
    } else {
        return res.redirect("/login");
    }
};

// --- Logout
export const logout = (req, res) => {
    req.session.destroy();
    return res.redirect("/");
};


// --- getEdit
export const getEdit = (req, res) => {
    return res.render("user/edit-profile", {pageTitle : "Edit Profile"});
};

// --- postEdit
export const postEdit = async (req,res) => {
    const {
        session:{
            user: { _id, avatarUrl },
        },
            body:{ name, email, username, location },
        file,
    } = req;
    // code challenge!
    // db에서 기존 data 와 겹치는거 없는지 확인
    const existUsername = await User.exists({username});
    const existEmail = await User.exists({email});
    const pageTitle = "Edit Profile";
    if (username !== req.session.user.username) {
        if (existUsername) { 
            return res.status(400).render("user/edit-profile", { 
                pageTitle, 
                errorMessage: "Username is already taken." });
        };
    };
    if (email !== req.session.user.email) {
        if (existEmail) {
            return res.status(400).render("user/edit-profile", { 
                pageTitle, 
                errorMessage: "Email is already taken." });
        };
    };
    const updatedUser = await User.findByIdAndUpdate(
        _id,
        {
            // form 에 file이 존재한다면 file.path 사용
            // 존재하지 않는다면 기존 session의 avatarUrl 로 저장
            avatarUrl: file ? file.path : avatarUrl,
            name,
            email,
            username,
            location
        },
        {new:true}
    )
    req.session.user = updatedUser;
    return res.redirect("/users/edit");
};

// --- getChangePasswor
export const getChangePassword = (req,res) => {
    if (req.session.user.socialOnly === true) {
        req.flash("error","Can't change password. Because You logged in with Github.");
        return res.redirect("/");
    }
    return res.render("user/change-password", {pageTitle : "change Password"});
};

// --- postChangePasswor
export const postChangePassword = async (req,res) => {
    const {
        session:{
            user: { _id },
        },
            body:{ oldPassword, newPassword, newPasswordConfirmaiton }
    } = req;
    // session에 로그인되어있는 유저 찾기
    const user = await User.findById(_id);

    // 기존 비밀번호가 정확한지 체크
    const ok = await bcrypt.compare(oldPassword, user.password);
    // → 사용자가 form 으로 보낸 비밀번호와 db에 있는 user의 가장 최근의 비밀번호를 비교 

    if(!ok) {
        return res.status(400).render("user/change-password", {
            pageTitle : "change Password",
            errorMessage : "The current password is incorrect."
        });
    };

    if(newPassword !== newPasswordConfirmaiton) {
        return res.status(400).render("user/change-password", {
            pageTitle : "change Password",
            errorMessage : "The password does not match Confirmaiton."
        });
    };

    user.password = newPassword;
    // userSchema.pre("save") 발동! 비밀번호 해시 ok!
    await user.save();
    req.flash("info","Password updated");
    // return res.redirect("/users/logout");
    // → 해킹의 위험을 방지하기위해 아래와 같이 좀 더 확실하게 작성함
    req.session.destroy();
    return res.redirect("/login");
};

export const see = async (req, res) => {
    const { id } = req.params;
    const user = await User.findById(id).populate({
        path: "videos",
        populate: {
            path: "owner",
            model: "User",
        },
    });
    if(!user){
        return res.status(404).render("404", { 
            pageTitle: "User not found",
        });
    }
    // user와 owner 의 id 가 같은 video 를 찾는다
    // const videos = await Video.find({owner: user._id});
    res.render("user/profile", { 
        pageTitle: `${user.name}의 Profile`,
        user,
    });
};