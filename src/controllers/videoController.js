import Video from "../models/Video";
import User from "../models/User";
import Comment from "../models/Comment";
import { compareSync } from "bcryptjs";

export const home = async (req, res) => {
    const videos = await Video.find({})
        .sort({ createdAt :"desc"})
        .populate("owner");
    res.render("home", {pageTitle: "Home", videos });
};

// --- watch
export const watch = async (req, res) => {
    const { id } = req.params;
    const { description, hashtags } = req.body;
    // ㄴ> == const id = req.params.id;
    const video = await Video.findById(id)
        .populate("owner")
        .populate("comments");
    if (!video) {
        return res.render("404", {pageTitle : "Video not found."});
    }
    res.render("video/watch" , {
        pageTitle : video.title, 
        video,
        description,
        hashtags,
    },);
};


// --- getEdit
export const getEdit = async (req, res) => {
    const { id } = req.params;
    const { user: { _id }} = req.session;
    const video = await Video.findById(id);
    if (!video) {
        return res.status(404).render("404", {pageTitle : "Video not found."});
    }
    // video.owner 가 object type 이므로 string으로 변환 
    if (String(video.owner) !== String(_id)) {
        res.status(403).redirect("/");
    }
    return res.render("video/edit", {pageTitle: `Edit: ${video.title}`, video});
};

// --- postEdit
export const postEdit = async (req, res) => {
    const {
      user: { _id },
    } = req.session;
    const { id } = req.params;
    const { title, description, hashtags } = req.body;
    const video = await Video.exists({ _id: id });
    if (!video) {
      return res.status(404).render("404", { pageTitle: "Video not found." });
    }
    if ((String(video._id)) !== String(id)) {
      req.flash("error","You are not the owenr of the video.");
      return res.status(403).redirect("/");
    }
    await Video.findByIdAndUpdate(id, {
      title,
      description,
      hashtags: Video.formatHashtags(hashtags),
    });
    req.flash("success", "Changes saved.");
    return res.redirect(`/videos/${id}`);
};

// --- getUpload
export const getUpload = (req, res) => {
    return res.render("video/upload", {pageTitle: "Upload Video"});
};

// --- postUpload
export const postUpload = async (req, res) => {
    const { user:{ _id } } = req.session;
    const { video, thumb } = req.files;
    const { title, description, hashtags } = req.body;
    // db에 저장하는 방식 .create() or .save()
    try {
        const newVideo = await Video.create({
            // videoschema: req.body ,
            title,
            description,
            fileUrl : video[0].location,
            thumbUrl : thumb[0].location.replace(/[\\]/g, "/"),
            owner:_id,
            hashtags: Video.formatHashtags(hashtags),
        });
        const user = await User.findById(_id);
        user.videos.push(newVideo._id);
        user.save();
        return res.redirect("/");
    } catch(error){
        console.log(error);
        return res.status(400).render("video/upload", { 
            pageTitle: "Upload Video", 
            errorMessage : error.message,
        });
    }
};

// --- deleteVideo
export const deleteVideo = async (req,res) => {
    const { id } = req.params;
    const { user:{ _id } } = req.session;
    const video = await Video.findById(id);
    if (!video) {
        return res.status(404).render("404", { pageTitle: "Video not found."});
    }
    if (String(video.owner) !== String(_id)) {
        req.flash("error","You are not the owenr of the video.");
        return res.status(403).redirect("/");
    }
    await Video.findByIdAndDelete(id);
    return res.redirect("/");
};

// --- search
export const search = async (req,res) => {
    const { keyword } = req.query;
    let videos = [];
    if (keyword) {
        videos = await Video.find({
            title: {
                // 대소문자 구분 없이 
                $regex: new RegExp(keyword, "i")
            },
        }).populate("owner");
    }
    return res.render("video/search", {pageTitle:"Search", videos});
};

/** 조회수 증가 controller */
export const registerView = async (req, res) => {
    const { id } = req.params;  
    const video = await Video.findById(id);

    if(!video){
        return res.sendStatus(404);
    }
    video.meta.views = video.meta.views + 1;
    await video.save();
    return res.sendStatus(200);
};

// --- creatComment
export const creatComment = async (req, res)=> {
    const {
        session: { user },
        body: { text },
        params: { id },
    } = req;
    const video = await Video.findById(id);
    if (!video) {
        return res.sendStatus(404);
    }
    const comment = await Comment.create({
        text:text,
        owner: user._id,
        video: id,
        //
        ownername : user.name,
        avatarUrl: user.avatarUrl,
    });
    video.comments.push(comment._id);
    video.save();
    res.status(201).json({ 
        newCommentId: comment._id,
        comment,
    });
};

// --- deleteComment
// 코드챌린지(댓글삭제)
export const deleteComment = async (req, res) => {
    const {
      params: { id: commentId },
    } = req;
    const {
      session: {
        user: { _id: userId },
      },
    } = req;
    const comment = await Comment.findById(commentId)
      .populate("owner")
      .populate("video");
    const video = comment.video;
    const user = await User.findById(userId);
  
    // 현재 로그인 된 유저의 아이디와 댓글 소유주의 아이디가 같은가?
    if (String(userId) !== String(comment.owner._id)) {
      return res.sendStatus(404);
    }
    if (!video) {
      return res.sendStatus(404);
    }
  
    //댓글 삭제, 비디오에서 댓글 배열 삭제, 유저에서 댓글 배열 삭제
    user.comments.splice(user.comments.indexOf(commentId), 1);
    await user.save();
    video.comments.splice(video.comments.indexOf(commentId), 1);
    await video.save();
    await Comment.findByIdAndRemove(commentId);
  
    return res.status(200);
};