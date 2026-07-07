import prisma from "../prismaClient.js";
import { UpdateImageSchema } from "../validators/image.schema.js";
import { uploadToCloudinary } from "../../services/cloudinary.service.js";

export const updateImage = async (req, res) => {
  try {
    const result = UpdateImageSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        errors: result.error.flatten().fieldErrors,
      });
    }

    const updated = await prisma.T_Images.update({
      where: {
        ID_Image: req.params.id,
      },
      data: {
        Text_Image: result.data.title,
      },
    });

    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Server error",
    });
  }
};

export const deleteImage = async (req, res) => {
  try {
    await prisma.T_Images.delete({
      where: {
        ID_Image: req.params.id,
      },
    });

    res.json({
      message: "Image deleted",
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: "Server error",
    });
  }
};

export const uploadImage = async (req, res) => {
  try {
    const { depoId } = req.params;

    if (!req.files?.length) {
      return res.status(400).json({
        error: "No images uploaded",
      });
    }

    const imageRecords = [];

    if (process.env.CLOUDINARY_CLOUD_NAME) {
      const uploaded = await Promise.all(
        req.files.map((file) => uploadToCloudinary(file.buffer)),
      );

      uploaded.forEach((img) => {
        imageRecords.push({
          ID_Depo: depoId,
          URL_Image: img.secure_url,
          Date_Image: new Date(),
        });
      });
    } else {
      req.files.forEach((file) => {
        imageRecords.push({
          ID_Depo: depoId,
          URL_Image: `/uploads/${file.filename}`,
          Date_Image: new Date(),
        });
      });
    }

    const createdImages = await Promise.all(
      imageRecords.map((image) =>
        prisma.T_Images.create({
          data: image,
        }),
      ),
    );

    res.status(201).json({
      message: "Images uploaded",
      images: createdImages,
    });


  } catch (err) {
    console.error("UPLOAD IMAGE ERROR:", err);

    res.status(500).json({
      error: "Server error",
    });
  }
};
