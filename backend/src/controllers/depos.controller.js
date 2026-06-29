import prisma from "../prismaClient.js";

// -----------------------------------------CRUD DEPOS---------------------------------------------------------------
export const createDepo = async (req, res) => {
  try {
    const { type, cat, title, description, lifetime } = req.body;

    const lifetimeDate =
      req.body.lifetime && req.body.lifetime !== ""
        ? new Date(req.body.lifetime)
        : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    const depo = await prisma.T_Depos.create({
      data: {
        ID_User: req.user.userId,
        Type_Depo: type,
        Cat_Depo: cat,
        Title_Depo: title,
        Text_Depo: description,
        Lifetime_Depo: lifetimeDate,
      },
    });

    // Check if the user send an image
    if (req.files?.length) {
      const uploadedImages = await Promise.all(
        //Stock it/them in cloudinary
        req.files.map((file) => uploadToCloudinary(file.buffer)),
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

// Display all depos in the db
export const getAllDepos = async (req, res) => {
  try {
    const { userId } = req.query;

    const depos = await prisma.T_Depos.findMany({
      where: userId ? { ID_User: userId } : undefined,
      include: {
        User_Depos: true,
        Answers_Depos: {
          include: { User_Answers: true },
        },
      },
      orderBy: {
        Date_Depo: "desc",
      },
    });

    res.json(depos);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

// Display depos owned by the user
export const getMyDepos = async (req, res) => {
  try {
    const depos = await prisma.T_Depos.findMany({
      where: {
        ID_User: req.user.userId,
      },
      include: {
        User_Depos: {
          select: {
            ID_User: true,
            Login_User: true,
            City_User: true,
            Latitude_User: true,
            Longitude_User: true,
          },
        },
        Answers_Depos: {
          include: {
            User_Answers: {
              select: {
                ID_User: true,
                Login_User: true,
                City_User: true,
                Email_User: true,
              },
            },
          },
        },
      },
      orderBy: {
        Date_Depo: "desc",
      },
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
        Type_Depo: req.body.type,
        Cat_Depo: req.body.cat,
        Title_Depo: req.body.title,
        Text_Depo: req.body.description,
        Lifetime_Depo: req.body.lifetime
          ? new Date(req.body.lifetime)
          : undefined,
      },
    });
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

export const deleteDepo = async (req, res) => {
  try {
    const depo = req.depo;
    if (!depo) return res.status(404).json({ error: "Depo not found" });

    await prisma.T_Depos.delete({
      where: { ID_Depo: depo.ID_Depo },
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
    const answer = await prisma.T_Answers.create({
      data: {
        Text_Answer: description,
        ID_Depo: depo.ID_Depo,
        ID_User: req.user.userId,
      },
    });
    console.log("USER:", req.user);
    console.log("DEPO:", req.depo);
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
      where: { ID_Answer: req.params.id },
      data: { Text_Answer: req.body.description },
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

    await prisma.T_Answers.delete({ where: { ID_Answer: req.params.id } });
    res.json({ message: "Deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};
