import Video from "../models/Video";

export const home = async (req, res) => {
    const videos = await Video.find({});
    return res.render("home", {pageTitle: "Home", videos });
};

export const watch = (req, res) => {
    const { id } = req.params;
    // ㄴ> == const id = req.params.id;
    return res.render("watch" , {pageTitle : `Watching`});
};

export const getEdit = (req, res) => {
    const { id } = req.params;
    return res.render("edit", {pageTitle: `Editing`});
};

export const postEdit = (req, res) => {
    const { id } = req.params;
    const { title } = req.body;
    return res.redirect(`/videos/${id}`);
};

export const getUpload = (req, res) => {
    return res.render("upload", {pageTitle: "Upload Video"});
}

export const postUpload = async (req, res) => {
    const { title, description, hashtags } = req.body;
    // db에 저장하는 방식 .create() or .save()
    await Video.create({
        // videoschema : req.body ,
        title:title,
        description:description,
        createdAt: Date.now(),
        hashtags:hashtags.split(",").map(word =>`#${word}`),
        meta:{
            views:0,
            rating:0,
        }
        
    });
    return res.redirect("/");
};


