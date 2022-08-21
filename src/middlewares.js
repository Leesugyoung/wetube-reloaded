export const localsMiddleware = (req, res, next) => {
    res.locals.loggedIn = Boolean(req.session.loggedIn);
    res.locals.siteName = "Wetube";
    res.locals.loggedInUser = req.session.user || {};
    next();
};

export const protectorMiddleware = (req, res, next) => {
    // user is loggedIn continue request
    if(req.session.loggedIn) {
        return next();
    } else {
        return res.redirect("/login");
    }

    // → use "/logout", "/edit", "/edit", "/delete", "/upload"
};

export const publicOnlyMiddleware = (req, res, next ) => {
    // user is not loggedIn continue request
    if(!req.session.loggedIn) {
        return next();
    } else {
        return res.redirect("/");
    }

    // → use "/github/start", "/github/finish", "/login" , "/join"
};


