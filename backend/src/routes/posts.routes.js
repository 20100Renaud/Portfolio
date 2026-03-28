import { authMiddleware, isOwnerOrAdmin } from "../middleware/auth.middleware.js";
import {
  createPost,
  updatePost,
  deletePost,
  getAllPosts,
  createComment,
  updateComment,
  deleteComment
} from "../controllers/posts.controller.js";

//---------------------------------------CRUD POST-----------------------------------------------
router.post("/posts", authMiddleware, createPost);
router.get("/posts", authMiddleware, getAllPosts);

router.put("/posts/:id", authMiddleware, isOwnerOrAdmin(async (req) => {
  const post = await prisma.T_Posts.findUnique({
    where: { ID_Post: req.params.id }
  });
  return post?.ID_Client_Post;
}), updatePost);

router.delete("/posts/:id", authMiddleware, isOwnerOrAdmin(async (req) => {
  const post = await prisma.T_Posts.findUnique({
    where: { ID_Post: req.params.id }
  });
  return post?.ID_Client_Post;
}), deletePost);

router.post("/posts/:postId/comments", authMiddleware, createComment);

//---------------------------------------CRUD COMMENTS-----------------------------------------------
router.put("/comments/:id", authMiddleware, isOwnerOrAdmin(async (req) => {
    const comment = await prisma.T_Comments.findUnique({
      where: { ID_Com: req.params.id }
    });
    return comment?.ID_Client_Com;
  }), updateComment);


router.delete(
  "/comments/:id",
  authMiddleware,
  isOwnerOrAdmin(async (req) => {
    const comment = await prisma.T_Comments.findUnique({
      where: { ID_Com: req.params.id }
    });
    return comment?.ID_Client_Com;
  }),
  deleteComment
);