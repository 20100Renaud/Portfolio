import prisma from "../prismaClient.js";


// -----------------------------------------CRUD DEPOS---------------------------------------------------------------
export const createDepo = async (req, res) => {
  try {
    const { title, description, lifetime } = req.body;

    const lifetimeDate = lifetime
      ? new Date(lifetime)
      : new Date(new Date().setMonth(new Date().getMonth() + 1));

    const depo = await prisma.T_Depos.create({
      data: {
        Title_Depo: title,
        Text_Depo: description,
        Lifetime_Depo: lifetimeDate,
        ID_User: req.user.userId,
      },
    });

    // Check if the user send an image
    if (req.files?.length) {
      const uploadedImages = await Promise.all(
        //Stock it/them in cloudinary
        req.files.map((file) => uploadToCloudinary(file.buffer))
      );

      await prisma.T_Images.createMany({
        //Then, in the database
        data: uploadedImages.map((image) => ({
          ID_Depo: depo.ID_Depo,
          Date_Image: new Date(),
          URL_Image: image.secure_url,
        })),
      });
    }

    res.status(201).json(depo);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


export const getAllDepos = async (req, res) => {
  try {
    const depos = await prisma.T_Depos.findMany({
      include: {
        User_Depos: true,
        Answers_Depos: {
          include: { User_Answers: true }
        }
      }
    });
    res.json(depos);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};


export const updateDepo = async (req, res) => {
  try {
    const depo = req.depo;
    if (!depo) return res.status(404).json({ error: "Depo not found" });

    const updated = await prisma.T_Depos.update({
      where: { ID_Depo: depo.ID_Depo },
      data: {
        Title_Depo: req.body.title,
        Text_Depo: req.body.description,
        Lifetime_Depo: req.body.lifetime
      }
    });
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};


export const deleteDepo = async (req, res) => {
  try {
    const depo = req.depo;
    if (!depo) return res.status(404).json({ error: "Depo not found" });

    if (!process.env.UNKNOWN_EMAIL) {
      return res.status(500).json({ error: "UNKNOWN_EMAIL missing" });
    }
    const unknown = await prisma.T_Users.findFirst({
      where: { Email_User: process.env.UNKNOWN_EMAIL }
    });
    if (!unknown) {
      return res.status(500).json({ error: "Unknown user missing" });
    }

    await prisma.T_Answers.deleteMany({
      where: { ID_Depo_Com: depo.ID_Depo }
    });

    await prisma.T_Depos.delete({
      where: { ID_Depo: depo.ID_Depo }
    });

    res.json({ message: "Deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

// -----------------------------------------------CRUD ANSWERS-----------------------------------------------------------
export const createAnswer = async (req, res) => {
  try {
    const { description } = req.body;
    const depo = req.depo;
    if (!depo) return res.status(404).json({ error: "Depo not found" });
    if (depo.ID_User === req.user.userId && req.user.role !== "ADMIN") {
      return res.status(403).json({
        error: "You can't answer to your own depo"
      });
    }

    const answer = await prisma.T_Answers.create({
      data: {
        Description_Com: description,
        ID_Depo_Com: depo.ID_Depo,
        ID_User_Com: req.user.userId
      }
    });
    res.status(201).json(answer);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};


export const updateAnswer = async (req, res) => {
  try {
    const answer = req.answer;
    if (!answer) return res.status(404).json({ error: "Answer not found" });

    const updated = await prisma.T_Answers.update({
      where: { ID_Com: req.params.id },
      data: { Description_Com: req.body.description }
    });
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

export const deleteAnswer = async (req, res) => {
  try {
    const answer = req.answer;
    if (!answer) return res.status(404).json({ error: "Answer not found" });

    await prisma.T_Answers.delete({ where: { ID_Com: req.params.id } });
    res.json({ message: "Deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};
