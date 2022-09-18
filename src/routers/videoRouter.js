import express from "express";
import {watch, 
    getEdit, 
    postEdit,  
    getUpload,
    postUpload,
    deleteVideo,
} from "../controllers/videoController";
import { protectorMiddleware, videoUpload, avatarUpload } from "../middlewares"

const videoRouter = express.Router();

videoRouter.route("/:id([0-9a-f]{24})")
    .get(avatarUpload.single("avatar"),watch)
videoRouter.route("/:id([0-9a-f]{24})/edit")
    .all(protectorMiddleware)
    .get(getEdit)
    .post(postEdit);
videoRouter.route("/:id([0-9a-f]{24})/delete")
    .all(protectorMiddleware)
    .get(deleteVideo);
videoRouter.route("/upload")
    .all(protectorMiddleware)
    .get(getUpload)
    .post(videoUpload.fields([
        { name:"video" },
        { name:"thumb" },
    ]), postUpload);


// videoRouter.get("/:id(\\d+)/delete", deleteVideo);
// videoRouter.get("/upload", upload);


export default videoRouter;
