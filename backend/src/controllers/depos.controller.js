import prisma from "../prismaClient.js";
import { uploadToCloudinary } from "../../services/cloudinary.service.js";
import { error } from "node:console";
import { CreateDepoSchema, UpdateDepoSchema } from "../validators/depo.schema.js";
import { CreateAnswersSchema, UpdateAnswersSchema } from "../validators/answers.schema.js";

// -----------------------------------------CRUD DEPOS---------------------------------------------------------------
export const createDepo = async (req, res) => {
  try {
    const result = CreateDepoSchema.safeParse(req.body);
    if (!result.success) {
      console.log(result.error)
      return res.status(400).json({
          errors: result.error.flatten().fieldErrors
      })
    }

    const data = result.data;
    const { type, cat, title, description, lifetime } = req.body;

    const lifetimeDate =
      req.body.lifetime && req.body.lifetime !== ""
        ? new Date(req.body.lifetime)
        : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    const depo = await prisma.T_Depos.create({
      data: {
        ID_User: req.user.userId,
        Type_Depo: data.type,
        Cat_Depo: data.cat,
        Title_Depo: data.title,
        Text_Depo: data.description,
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
    console.error(err)
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
    const result = UpdateDepoSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        errors: result.error.flatten().fieldErrors,
      });
    }

    const data = result.data;

    const updated = await prisma.T_Depos.update({
      where: {
        ID_Depo: req.params.id,
      },
      data: {
        Type_Depo: data.type,
        Cat_Depo: data.cat,
        Title_Depo: data.title,
        Text_Depo: data.description,
        Lifetime_Depo: data.lifetime
          ? new Date(data.lifetime)
          : undefined,
      },
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

    await prisma.T_Depos.delete({
      where: { ID_Depo: depo.ID_Depo },
    });

    res.json({ message: "Deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};
