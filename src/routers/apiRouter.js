import express from "express";
import {
  registerView,
  creatComment,
  deleteComment,
} from "../controllers/videoController";

const apiRouter = express.Router();

apiRouter.post("/videos/:id([0-9a-f]{24})/view", registerView);
apiRouter.post("/videos/:id([0-9a-f]{24})/comment", creatComment);
// ↓코드챌린지(댓글삭제)
apiRouter.delete("/comments/:id([0-9a-f]{24})/delete", deleteComment);
export default apiRouter;
