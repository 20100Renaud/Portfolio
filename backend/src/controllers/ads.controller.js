import prisma from "../prismaClient.js";


// -----------------------------------------CRUD POSTS---------------------------------------------------------------
export const createAd = async (req, res) => {
  try {
    const { title, description } = req.body;
    const ad = await prisma.T_Ads.create({
      data: {
        Title_Ad: title,
        Description_Ad: description,
        ID_Client_Ad: req.user.clientId
      }
    });
    res.status(201).json(ad);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};


export const getAllAds = async (req, res) => {
  try {
    const ads = await prisma.T_Ads.findMany({
      include: {
        Client_Ad: true,
        Answers_Ad: {
          include: { Client_Answers: true }
        }
      }
    });
    res.json(ads);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};


export const updateAd = async (req, res) => {
  try {
    const ad = req.ad;
    if (!ad) return res.status(404).json({ error: "Ad not found" });

    const updated = await prisma.T_Ads.update({
      where: { ID_Ad: ad.ID_Ad },
      data: {
        Title_Ad: req.body.title,
        Description_Ad: req.body.description
      }
    });
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};


export const deleteAd = async (req, res) => {
  try {
    const ad = req.ad;
    if (!ad) return res.status(404).json({ error: "Ad not found" });

    if (!process.env.UNKNOWN_EMAIL) {
      return res.status(500).json({ error: "UNKNOWN_EMAIL missing" });
    }
    const unknown = await prisma.T_Clients.findFirst({
      where: { Mail_Client: process.env.UNKNOWN_EMAIL }
    });
    if (!unknown) {
      return res.status(500).json({ error: "Unknown user missing" });
    }

    await prisma.T_Answers.deleteMany({
      where: { ID_Ad_Com: ad.ID_Ad }
    });

    await prisma.T_Ads.delete({
      where: { ID_Ad: ad.ID_Ad }
    });

    res.json({ message: "Deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

// -----------------------------------------------CRUD COMMENTS-----------------------------------------------------------
export const createAnswer = async (req, res) => {
  try {
    const { description } = req.body;
    const ad = req.ad;
    if (!ad) return res.status(404).json({ error: "Ad not found" });
    if (ad.ID_Client_Ad === req.user.clientId && req.user.role !== "ADMIN") {
      return res.status(403).json({
        error: "You can't answer to your own ad"
      });
    }

    const answer = await prisma.T_Answers.create({
      data: {
        Description_Com: description,
        ID_Ad_Com: ad.ID_Ad,
        ID_Client_Com: req.user.clientId
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
