import prisma from "../prismaClient.js";
import { hashEmail } from "../utils/hash.js";


// -----------------------------------------CRUD POSTS---------------------------------------------------------------
export const createPost = async (req, res) => {
  try {
    const { title, description } = req.body;
    const post = await prisma.T_Posts.create({
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
    const posts = await prisma.T_Posts.findMany({
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
    const post = req.post;
    if (!post) return res.status(404).json({ error: "Post not found" });

    const updated = await prisma.T_Posts.update({
      where: { ID_Post: post.ID_Post },
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
    const post = req.post;
    if (!post) return res.status(404).json({ error: "Post not found" });

    if (!process.env.UNKNOWN_EMAIL) {
      return res.status(500).json({ error: "UNKNOWN_EMAIL missing" });
    }
    const unknown = await prisma.T_Clients.findFirst({
      where: { Mail_Hash_Client: hashEmail(process.env.UNKNOWN_EMAIL) }
    });
    if (!unknown) {
      return res.status(500).json({ error: "Unknown user missing" });
    }

    await prisma.T_Comments.deleteMany({
      where: { ID_Post_Com: post.ID_Post }
    });

    await prisma.T_Posts.delete({
      where: { ID_Post: post.ID_Post }
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
    const post = req.post;
    if (!post) return res.status(404).json({ error: "Post not found" });
    if (post.ID_Client_Post === req.user.clientId && req.user.role !== "ADMIN") {
      return res.status(403).json({
        error: "You can't comment your own post"
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
    const comment = req.comment;
    if (!comment) return res.status(404).json({ error: "Comment not found" });

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
    const comment = req.comment;
    if (!comment) return res.status(404).json({ error: "Comment not found" });

    await prisma.T_Comments.delete({ where: { ID_Com: req.params.id } });
    res.json({ message: "Deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};
