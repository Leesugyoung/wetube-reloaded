import User from "../models/User";
import bcrypt from "bcrypt"; 
import fetch from "node-fetch";

// --- getJoin
export const getJoin = (req, res) => res.render("join", { pageTitle : "Join" });


// --- postJoin
export const postJoin = async (req, res) => {
    const { name, username, email, password, password2, location } = req.body;
    const pageTitle = "Join";

    if (password !== password2) {
        return res.status(400).render("Join", {
            pageTitle,
            errorMessage:"Password confirmation does not match!",
        })
    }

    const exists = await User.exists({ $or : [
            // username : req.body.username
            {username},{email}]});

    if (exists) {
        return res.status(400).render("join", { 
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
        return res.status(400).render("/join", {
            pageTitle : "Upload Video",
            errorMessage : error._message,
        });
    };
};


// --- getLogin 
export const getLogin = (req, res) => {
    res.render("login", {pageTitle: "Login"});
}


// --- postLogin 
export const postLogin = async (req, res) => {
    const { username, password } = req.body;
    const pageTitle = "Login";
    const user = await User.findOne({ username });

    if (!user) {
        return res.status(400).render("login", {
            pageTitle, 
            errorMessage:"An account with this username does not exists."
        });
    }
    const ok = await bcrypt.compare(password, user.password);
    
    if (!ok) {
        return res.status(400).render("login", {
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
    const tokenRequest = await (
        await fetch(finalUrl, {
        method:"POST",
        headers:{
            Accept:"application/json"
        },
    })).json();
    if ("acces_token" in tokenRequest){
        const {access_token} = tokenRequest;
        const userRequest = await(
            await fetch("https://api.github.con/user", {
                headers: {
                    Authorization:`token ${access_token}`,
            },
        })
        ).json();
    } else {
        return res.redirect("/login");
    }
};

export const edit = (req, res) => res.send("Edit User");

export const remove = (req, res) => res.send("Remove User");

export const logout = (req, res) => res.send("logout");

export const see = (req, res) => res.send("See user");