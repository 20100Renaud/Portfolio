import prisma from "../prismaClient.js";
import { uploadToCloudinary } from "../../services/cloudinary.service.js";
import {
  CreateDepoSchema,
  UpdateDepoSchema,
} from "../validators/depo.schema.js";

// -----------------------------------------CRUD DEPOS---------------------------------------------------------------
export const createDepo = async (req, res) => {
  console.log("[CREATE DEPO HIT]");

  try {
    console.log("[USER on createDepo]:", req.user);
    console.log("[BODY on createDepo]:", req.body);
    console.log("[FILES on createDepo]:", req.files);

    const result = CreateDepoSchema.safeParse(req.body);

    if (!result.success) {
      console.log("[ZOD ERROR]:", result.error);
      return res.status(400).json({
        errors: result.error.flatten().fieldErrors,
      });
    }

    const data = result.data;

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

    console.log("[FILES]:", req.files);

    // Check if the user send an image
    const imageRecords = [];

    if (req.files?.length) {
      if (process.env.CLOUDINARY_CLOUD_NAME) {
        console.log(process.env.CLOUDINARY_CLOUD_NAME);
        const uploaded = await Promise.all(
          req.files.map((file) => uploadToCloudinary(file.buffer)),
        );

        uploaded.forEach((img) => {
          imageRecords.push({
            ID_Depo: depo.ID_Depo,
            URL_Image: img.secure_url,
            Date_Image: new Date(),
          });
        });
      } else {
        req.files.forEach((file) => {
          imageRecords.push({
            ID_Depo: depo.ID_Depo,
            URL_Image: `/uploads/${file.filename}`,
            Date_Image: new Date(),
          });
        });
      }

      await prisma.T_Images.createMany({
        data: imageRecords,
      });
    }

    const user = await prisma.T_Users.findUnique({
        where: {
            ID_User: req.user.userId
        },
        select: {
            Email_User: true
        }
    });

    res.status(201).json(depo);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// Get image URL
const getImageUrl = (file) => {
  if (process.env.NODE_ENV === "development") {
    return `local://${file.originalname}`;
  }
  return uploadToCloudinary(file.buffer);
};

// Display all depos in the db
export const getAllDepos = async (req, res) => {
  try {
    const { userId } = req.query;

    const depos = await prisma.T_Depos.findMany({
      where: userId ? { ID_User: userId } : undefined,
      include: {
        User_Depos: true,

        Images_Depos: true,

        Answers_Depos: {
          include: {
            User_Answers: true,
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
        Images_Depos: true,

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

    if (req.user.userId !== depo.ID_User && req.user.role !== "ADMIN") {
      return res.status(403).json({
        error: "Forbidden",
      });
    }
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
        Lifetime_Depo: data.lifetime ? new Date(data.lifetime) : undefined,
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

    if (req.user.userId !== depo.ID_User && req.user.role !== "ADMIN") {
      return res.status(403).json({
        error: "Forbidden",
      });
    }

    await prisma.T_Depos.delete({
      where: { ID_Depo: depo.ID_Depo },
    });

    res.json({ message: "Deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};
