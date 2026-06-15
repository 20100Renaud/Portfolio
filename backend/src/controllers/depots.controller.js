import prisma from "../prismaClient.js";


// -----------------------------------------CRUD POSTS---------------------------------------------------------------
export const createDepot = async (req, res) => {
  try {
    const { title, description } = req.body;
    const depot = await prisma.T_Depots.create({
      data: {
        Title_Depot: title,
        Description_Depot: description,
        ID_User_Depot: req.user.userId
      }
    });
    res.status(201).json(depot);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};


export const getAllDepots = async (req, res) => {
  try {
    const depots = await prisma.T_Depots.findMany({
      include: {
        User_Depots: true,
        Answers_Depots: {
          include: { User_Answers: true }
        }
      }
    });
    res.json(depots);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};


export const updateDepot = async (req, res) => {
  try {
    const depot = req.depot;
    if (!depot) return res.status(404).json({ error: "Depot not found" });

    const updated = await prisma.T_Depots.update({
      where: { ID_Depot: depot.ID_Depot },
      data: {
        Title_Depot: req.body.title,
        Description_Depot: req.body.description
      }
    });
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};


export const deleteDepot = async (req, res) => {
  try {
    const depot = req.depot;
    if (!depot) return res.status(404).json({ error: "Depot not found" });

    if (!process.env.UNKNOWN_EMAIL) {
      return res.status(500).json({ error: "UNKNOWN_EMAIL missing" });
    }
    const unknown = await prisma.T_Users.findFirst({
      where: { Mail_User: process.env.UNKNOWN_EMAIL }
    });
    if (!unknown) {
      return res.status(500).json({ error: "Unknown user missing" });
    }

    await prisma.T_Answers.deleteMany({
      where: { ID_Depot_Com: depot.ID_Depot }
    });

    await prisma.T_Depots.delete({
      where: { ID_Depot: depot.ID_Depot }
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
    const depot = req.depot;
    if (!depot) return res.status(404).json({ error: "Depot not found" });
    if (depot.ID_User_Depot === req.user.userId && req.user.role !== "ADMIN") {
      return res.status(403).json({
        error: "You can't answer to your own depot"
      });
    }

    const answer = await prisma.T_Answers.create({
      data: {
        Description_Com: description,
        ID_Depot_Com: depot.ID_Depot,
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
