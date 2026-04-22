import express from "express";
import { authMiddleware, isOwnerOrAdmin } from "../middleware/auth.middleware.js";
import prisma from "../prismaClient.js";
import {
  createPost,
  updatePost,
  deletePost,
  getAllPosts,
  createComment,
  updateComment,
  deleteComment
} from "../controllers/posts.controller.js";

const router = express.Router();

//---------------------------------------CRUD POST-----------------------------------------------
const preloadPost = async (req, res, next) => {
  const post = await prisma.T_Posts.findUnique({
    where: { ID_Post: req.params.postId || req.params.postId}
  });
  if (!post) return res.status(404).json({ error: "Post not found" });
  req.post = post;
  next();
};

router.post("/posts", authMiddleware, createPost);
router.get("/posts", authMiddleware, getAllPosts);

router.put("/posts/:id", authMiddleware, preloadPost, isOwnerOrAdmin(async (req) => req.post.ID_Client_Post), updatePost);
router.delete("/posts/:id", authMiddleware, preloadPost, isOwnerOrAdmin(async (req) => req.post.ID_Client_Post), deletePost);

router.post("/posts/:postId/comments", authMiddleware, preloadPost, createComment);

//---------------------------------------CRUD COMMENTS-----------------------------------------------
const preloadComment = async (req, res, next) => {
  const comment = await prisma.T_Comments.findUnique({
    where: { ID_Com: req.params.id }
  });
  if (!comment) return res.status(404).json({ error: "Comment not found" });
  req.comment = comment;
  next();
};

router.put("/comments/:id", authMiddleware, preloadComment, isOwnerOrAdmin((req) => req.comment.ID_Client_Com), updateComment);
router.delete("/comments/:id", authMiddleware, preloadComment, isOwnerOrAdmin((req) => req.comment.ID_Client_Com), deleteComment);

export default router;
