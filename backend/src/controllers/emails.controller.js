import { AskEmail } from "../services/email.service.js";
import prisma from "../config/prisma.js";

export const sendCoordinates = async (req, res) => {
    try {
        const applicant = req.user;

        const depo = req.depo;

        const owner = await prisma.T_Users.findUnique({
        where: {
            ID_User: depo.ID_User,
        },
        select: {
            ID_User: true,
            Email_User: true,
            Login_User: true,
        },
        });

        if (!owner) {
            return res.status(404).json({
                message: "Owner not found."
            });
        }

        if (owner.ID_User === applicant.ID_User) {
            return res.status(400).json({
                message: "You can't contact yourself."
            });
        }

        await AskEmail(owner.Email_User, owner, applicant, depo);
        return res.status(200).json({
            message: "Email sent successfully."
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Can't send email" });
    }
}
