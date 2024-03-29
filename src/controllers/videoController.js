import Video from "../models/Video";
import User from "../models/User";
import Comment from "../models/Comment";

export const home = async (req, res) => {
  const videos = await Video.find({})
    .sort({ createdAt: "desc" })
    .populate("owner");
  res.render("home", { pageTitle: "Home", videos });
};

// --- watch
export const watch = async (req, res) => {
  const { id } = req.params;
  const { description, hashtags } = req.body;
  // ㄴ> == const id = req.params.id;
  const video = await Video.findById(id).populate("owner").populate("comments");
  if (!video) {
    return res.render("404", { pageTitle: "Video not found." });
  }
  res.render("video/watch", {
    pageTitle: video.title,
    video,
    description,
    hashtags,
  });
};

// --- getEdit
export const getEdit = async (req, res) => {
  const { id } = req.params;
  const {
    user: { _id },
  } = req.session;
  const video = await Video.findById(id);
  if (!video) {
    return res.status(404).render("404", { pageTitle: "Video not found." });
  }
  // video.owner 가 object type 이므로 string으로 변환
  if (String(video.owner) !== String(_id)) {
    res.status(403).redirect("/");
  }
  return res.render("video/edit", { pageTitle: `Edit: ${video.title}`, video });
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
  if (String(video._id) !== String(id)) {
    req.flash("error", "You are not the owenr of the video.");
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
  return res.render("video/upload", { pageTitle: "Upload Video" });
};

// --- postUpload
export const postUpload = async (req, res) => {
  const {
    user: { _id },
  } = req.session;
  const { video, thumb } = req.files;
  const { title, description, hashtags } = req.body;
  const isFlyio = process.env.NODE_ENV === "production";
  // db에 저장하는 방식 .create() or .save()
  try {
    const newVideo = await Video.create({
      // videoschema: req.body ,
      title,
      description,
      fileUrl: isFlyio ? video[0].location : video[0].path,
      thumbUrl: isFlyio
        ? thumb[0].location.replace(/[\\]/g, "/")
        : video[0].path,
      owner: _id,
      hashtags: Video.formatHashtags(hashtags),
    });
    const user = await User.findById(_id);
    user.videos.push(newVideo._id);
    user.save();
    return res.redirect("/");
  } catch (error) {
    return res.status(400).render("video/upload", {
      pageTitle: "Upload Video",
      errorMessage: error.message,
    });
  }
};

// --- deleteVideo
export const deleteVideo = async (req, res) => {
  const { id } = req.params;
  const {
    user: { _id },
  } = req.session;
  const video = await Video.findById(id);
  if (!video) {
    return res.status(404).render("404", { pageTitle: "Video not found." });
  }
  if (String(video.owner) !== String(_id)) {
    req.flash("error", "You are not the owenr of the video.");
    return res.status(403).redirect("/");
  }
  await Video.findByIdAndDelete(id);
  return res.redirect("/");
};

// --- search
export const search = async (req, res) => {
  const { keyword } = req.query;
  let videos = [];
  if (keyword) {
    videos = await Video.find({
      title: {
        // 대소문자 구분 없이
        $regex: new RegExp(keyword, "i"),
      },
    }).populate("owner");
  }
  return res.render("video/search", { pageTitle: "Search", videos });
};

/** 조회수 증가 controller */
export const registerView = async (req, res) => {
  const { id } = req.params;
  const video = await Video.findById(id);

  if (!video) {
    return res.sendStatus(404);
  }
  video.meta.views = video.meta.views + 1;
  await video.save();
  return res.sendStatus(200);
};

// --- creatComment
export const creatComment = async (req, res) => {
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
    text: text,
    owner: user._id,
    videoId: id,
    ownername: user.name,
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
export const deleteComment = async (req, res) => {
  const {
    params: { id },
  } = req;
  try {
    const comment = await Comment.findById(id);
    if (!comment) {
      return res.sendStatus(404);
    }
    await comment.remove();
    return res.sendStatus(204);
  } catch (error) {
    // console.log("error", error);
    return res.sendStatus(500);
  }
};
