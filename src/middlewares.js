import multer from "multer";

export const localsMiddleware = (req, res, next) => {
    res.locals.loggedIn = Boolean(req.session.loggedIn);
    res.locals.siteName = "Wetube";
    res.locals.loggedInUser = req.session.user || {};
    next();
};

/** use "/logout", "/edit", "/edit", "/delete", "/upload" */
export const protectorMiddleware = (req, res, next) => {
    // user is loggedIn continue request
    if(req.session.loggedIn) {
        return next();
    } else {
        return res.redirect("/login");
    }

};

/** use "/github/start", "/github/finish", "/login" , "/join" */
export const publicOnlyMiddleware = (req, res, next) => {
    // user is not loggedIn continue request
    if(!req.session.loggedIn) {
        return next();
    } else {
        return res.redirect("/");
    }
};

/** form의 input에서 오는 avatar file을 uploads폴더에 저장하고 업로드, 이후 postEdit 컨트롤러에 file 정보전달, 'req.file' 제공 */
export const uploadFilesMiddleware = multer({ dest: "uploads/"});

export const avatarUpload = multer({ dest: "uploads/avatars/", 
    limits: {
        fileSize: 3000000,  // bytes
    }
});

export const videoUpload = multer({ dest: "uploads/videos/", 
    limits: {
        fileSize: 10000000,  // bytes
    }
});
