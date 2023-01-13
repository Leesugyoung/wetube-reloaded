import multer from "multer";
import multerS3 from "multer-s3";
import aws from "aws-sdk";

const s3 = new aws.S3({
  credentials: {
    accessKeyId: process.env.AWS_ID,
    secretAccessKey: process.env.AWS_SECRET,
  },
});

const s3ImageUploader = multerS3({
  s3: s3,
  bucket: "wetube-leesu/images",
  Condition: {
    StringEquals: {
      "s3:x-amz-acl": ["public-read"],
    },
  },
});

const isFlyio = process.env.NODE_ENV === "production";

const s3VideoUploader = multerS3({
  s3: s3,
  bucket: "wetube-leesu/videos",
  Condition: {
    StringEquals: {
      "s3:x-amz-acl": ["public-read"],
    },
  },
});

export const localsMiddleware = (req, res, next) => {
  res.locals.loggedIn = Boolean(req.session.loggedIn);
  res.locals.siteName = "Wetube";
  res.locals.loggedInUser = req.session.user || {};
  res.locals.isFlyio = isFlyio;
  next();
};

/** use "/logout", "/edit", "/edit", "/delete", "/upload" */
export const protectorMiddleware = (req, res, next) => {
  // user is "loggedIn" continue request
  if (req.session.loggedIn) {
    return next();
  } else {
    req.flash("error", "Not authorized. Log in first!");
    return res.redirect("/login");
  }
};

/** use "/github/start", "/github/finish", "/login" , "/join" */
export const publicOnlyMiddleware = (req, res, next) => {
  // user is "Not loggedIn" continue request
  if (!req.session.loggedIn) {
    return next();
  } else {
    req.flash("error", "Not authorized");
    return res.redirect("/");
  }
};

/** form의 input에서 오는 avatar file을 uploads폴더에 저장하고 업로드, 이후 postEdit 컨트롤러에 file 정보전달, 'req.file' 제공 */
export const uploadFilesMiddleware = multer({ dest: "uploads/" });

export const avatarUpload = multer({
  dest: "uploads/avatars/",
  limits: {
    fileSize: 3000000, // bytes
  },
  storage: isFlyio ? s3ImageUploader : undefined,
});

export const videoUpload = multer({
  dest: "uploads/videos/",
  limits: {
    fileSize: 10000000, // bytes
  },
  storage: isFlyio ? s3VideoUploader : undefined,
});
