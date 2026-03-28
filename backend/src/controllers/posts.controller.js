import prisma from "../prismaClient.js";

const isOwnerOrAdmin = (user, ownerId) => {
  return user.role === "ADMIN" || user.clientId === ownerId;
};

// -----------------------------------------CRUD POSTS---------------------------------------------------------------
export const createPost = async (req, res) => {
  try {
    const { title, description } = req.body;
    const post = await prisma.t_Posts.create({
      data: {
        Title_Post: title,
        Description_Post: description,
        ID_Client_Post: req.user.clientId
      }
    });
    res.status(201).json(post);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};


export const getAllPosts = async (req, res) => {
  try {
    const posts = await prisma.t_Posts.findMany({
      include: {
        Client_Post: true,
        Comments_Post: {
          include: { Client_Comments: true }
        }
      }
    });
    res.json(posts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};


export const updatePost = async (req, res) => {
  try {
    const post = await prisma.T_Posts.findUnique({
      where: { ID_Post: req.params.id }
    });
    if (!post) return res.status(404).json({ error: "Post not found" });
    if (!isOwnerOrAdmin(req.user, post.ID_Client_Post)) {
      return res.status(403).json({ error: "Forbidden" });
    }

    const updated = await prisma.t_Posts.update({
      where: { ID_Post: req.params.id },
      data: {
        Title_Post: req.body.title,
        Description_Post: req.body.description
      }
    });
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};


export const deletePost = async (req, res) => {
  try {
    const post = await prisma.T_Posts.findUnique({
      where: { ID_Post: req.params.id }
    });
    if (!post) return res.status(404).json({ error: "Post not found" });
    if (!isOwnerOrAdmin(req.user, post.ID_Client_Post)) {
      return res.status(403).json({ error: "Forbidden" });
    }

    await prisma.T_Comments.updateMany({
      where: { ID_Post_Com: post.ID_Post },
      data: { ID_Client_Com: "UNKNOWN_CLIENT_ID" }
    });

    await prisma.t_Posts.delete({
      where: { ID_Post: req.params.id }
    });
    res.json({ message: "Deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

// -----------------------------------------------CRUD COMMENTS-----------------------------------------------------------
export const createComment = async (req, res) => {
  try {
    const { description } = req.body;
    const post = await prisma.t_Posts.findUnique({
      where: { ID_Post: req.params.postId }
    });
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }
    if (req.user.role !== "ADMIN" && post.ID_Client_Post === req.user.clientId) {
      return res.status(403).json({ error: "You can't comment your own post"
      });
    }
    const comment = await prisma.T_Comments.create({
      data: {
        Description_Com: description,
        ID_Post_Com: post.ID_Post,
        ID_Client_Com: req.user.clientId
      }
    });
    res.status(201).json(comment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};


export const updateComment = async (req, res) => {
  try {
    const comment = await prisma.T_Comments.findUnique({
      where: { ID_Com: req.params.id }
    });
    if (!comment) return res.status(404).json({ error: "Comment not found" });
    if (!isOwnerOrAdmin(req.user, comment.ID_Client_Com)) { 
      return res.status(403).json({ error: "Forbidden" });
    }

    const updated = await prisma.T_Comments.update({
      where: { ID_Com: req.params.id },
      data: { Description_Com: req.body.description }
    });
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

export const deleteComment = async (req, res) => {
  try {
    const comment = await prisma.T_Comments.findUnique({
      where: { ID_Com: req.params.id }
    });
    if (!comment) return res.status(404).json({ error: "Comment not found" });
    if (!isOwnerOrAdmin(req.user, comment.ID_Client_Com)) {
      return res.status(403).json({ error: "Forbidden" });
    }

    await prisma.T_Comments.delete({ where: { ID_Com: req.params.id } });
    res.json({ message: "Deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};
